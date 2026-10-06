-- New RPC; old purge_demo_data remains blocked. Installing does NOT delete rows.
-- Review and backup first. Requires previously added boolean demo flags.
-- Preview rehearses DELETE in a rolled-back subtransaction; no delete triggers allowed.
-- Permanent action excludes profiles/Auth/CV/Storage/hubs/invoices/configuration.
BEGIN;
CREATE OR REPLACE FUNCTION public.cleanup_demo_activities(p_preview boolean DEFAULT true, p_confirmation text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public,pg_temp
AS $cleanup$
DECLARE
 targets text[] := ARRAY[
 'post_poll_votes','post_comments','post_upvotes','post_poll_options',
 'chat_messages','chat_channel_members','event_addons','event_attendees',
 'event_gallery_images','event_invitations','event_reviews','meeting_participants',
 'academy_progress','user_notifications','community_resource_bookings',
 'coworking_desk_bookings','crm_pipeline_deals','desk_swaps','friendships',
 'gift_upgrades','guest_passes','intro_requests','lunch_invitations',
 'member_active_locations','member_follows','p2p_point_transfers','proximity_pings',
 'referrals','skill_endorsements','speed_networking_matches','booster_points_ledger',
 'booster_score_logs','ad_campaigns','broadcast_campaigns','chat_channels',
 'community_posts','master_events','web_meetings','academy_courses'];
 name text; r record; condition text; filter text; flag boolean; blockers bigint;
 deleted bigint; admin_before jsonb; admin_after jsonb; results jsonb := '{}'::jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS (
   SELECT 1 FROM public.profiles WHERE id=auth.uid() AND role::text='SUPER_ADMIN'
   AND lower(email)='admin@performile.com' AND account_status='ACTIVE'
 ) THEN RAISE EXCEPTION 'Only the authenticated protected super-admin may clean demo activities'; END IF;
 IF p_preview IS NULL THEN RAISE EXCEPTION 'Preview must be specified'; END IF;
 IF NOT p_preview AND p_confirmation IS DISTINCT FROM 'RENSA DEMOAKTIVITETER' THEN
   RAISE EXCEPTION 'Explicit confirmation required'; END IF;
 BEGIN
 -- Stabilize all public base tables, including protected children.
 FOR r IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relkind IN ('r','p') ORDER BY c.relname LOOP
   EXECUTE format('LOCK TABLE public.%I IN ACCESS EXCLUSIVE MODE',r.relname);
 END LOOP;
 IF (SELECT count(*) FROM public.profiles WHERE lower(email)='admin@performile.com') <> 1 THEN
   RAISE EXCEPTION 'Protected admin profile missing or ambiguous';
 END IF;
 SELECT to_jsonb(p) INTO admin_before FROM public.profiles p WHERE lower(email)='admin@performile.com';
 FOREACH name IN ARRAY targets LOOP
   IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=name AND column_name='is_demo' AND data_type='boolean') THEN
     RAISE EXCEPTION 'Expected boolean demo flag missing on %',name;
   END IF;
   -- Reject all DELETE user triggers, including disabled ones, rather than
   -- trusting unknown side effects. Internal FK triggers remain active.
   IF EXISTS(SELECT 1 FROM pg_trigger WHERE tgrelid=to_regclass(format('public.%I',name)) AND NOT tgisinternal AND (tgtype::integer & 8)<>0) THEN
     RAISE EXCEPTION 'DELETE trigger present on %; review required',name;
   END IF;
 END LOOP;
 -- Reject protected/non-demo direct children before any DELETE (all FK actions).
 FOR r IN SELECT con.*,cn.nspname cs,c.relname ct,pn.nspname ps,p.relname pt
 FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid
 JOIN pg_namespace cn ON cn.oid=c.relnamespace
 JOIN pg_class p ON p.oid=con.confrelid JOIN pg_namespace pn ON pn.oid=p.relnamespace
 WHERE con.contype='f' AND pn.nspname='public' AND p.relname=ANY(targets) LOOP
   IF r.cs <> 'public' THEN RAISE EXCEPTION 'Cross-schema child %.% requires review',r.cs,r.ct; END IF;
   SELECT string_agg(format('c.%I = p.%I',ca.attname,pa.attname),' AND ' ORDER BY k.i) INTO condition
   FROM generate_subscripts(r.conkey,1) k(i)
   JOIN pg_attribute ca ON ca.attrelid=r.conrelid AND ca.attnum=r.conkey[k.i]
   JOIN pg_attribute pa ON pa.attrelid=r.confrelid AND pa.attnum=r.confkey[k.i];
   SELECT EXISTS(SELECT 1 FROM pg_attribute WHERE attrelid=r.conrelid AND attname='is_demo' AND atttypid='boolean'::regtype AND NOT attisdropped) INTO flag;
   filter := CASE WHEN r.ct=ANY(targets) AND flag THEN 'c.is_demo IS DISTINCT FROM true' ELSE 'true' END;
   EXECUTE format('SELECT count(*) FROM public.%I c WHERE %s AND EXISTS(SELECT 1 FROM public.%I p WHERE p.is_demo IS TRUE AND %s)',r.ct,filter,r.pt,condition) INTO blockers;
   IF blockers > 0 THEN RAISE EXCEPTION 'Protected children found on % via %: %',r.ct,r.conname,blockers; END IF;
   IF r.confdeltype IN ('n','d') THEN RAISE EXCEPTION 'SET NULL/DEFAULT dependency % needs separate review',r.conname; END IF;
 END LOOP;
 FOREACH name IN ARRAY targets LOOP
   EXECUTE format('DELETE FROM public.%I WHERE is_demo IS TRUE',name);
   GET DIAGNOSTICS deleted=ROW_COUNT;
   results := results || jsonb_build_object(name,deleted);
 END LOOP;
 SELECT to_jsonb(p) INTO admin_after FROM public.profiles p WHERE lower(email)='admin@performile.com';
 IF admin_before IS DISTINCT FROM admin_after THEN RAISE EXCEPTION 'Admin profile changed; trial rejected'; END IF;
 IF p_preview THEN RAISE EXCEPTION USING ERRCODE='PZ001', MESSAGE='Preview rollback'; END IF;
 EXCEPTION WHEN SQLSTATE 'PZ001' THEN
   -- Database changes inside this block rollback; local result variables survive.
   NULL;
 END;
 RETURN jsonb_build_object('preview',p_preview,'counts',results,'protected_admin_unchanged',true);
END;
$cleanup$;
REVOKE ALL ON FUNCTION public.cleanup_demo_activities(boolean,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cleanup_demo_activities(boolean,text) TO authenticated;
COMMIT;
-- Test through app with a real protected-admin session; SQL Editor has no auth.uid().
-- Member/anonymous calls must be rejected. Preview must leave all counts unchanged.
-- App permanent cleanup must wait for these acceptance tests and a database backup.
