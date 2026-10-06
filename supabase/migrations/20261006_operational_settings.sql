-- Review/apply against the live schema before enabling these forms.
BEGIN;
CREATE TABLE IF NOT EXISTS public.hub_managers (
  hub_id uuid REFERENCES public.hubs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (hub_id, user_id)
);
ALTER TABLE public.hub_managers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Managers read assignments" ON public.hub_managers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage assignments" ON public.hub_managers FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TABLE IF NOT EXISTS public.hub_operational_settings (
  hub_id uuid PRIMARY KEY REFERENCES public.hubs(id) ON DELETE CASCADE,
  opening_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  closed_dates date[] NOT NULL DEFAULT '{}',
  booking_horizon_days integer NOT NULL DEFAULT 30 CHECK (booking_horizon_days BETWEEN 1 AND 365),
  cancellation_hours integer NOT NULL DEFAULT 24 CHECK (cancellation_hours BETWEEN 0 AND 168),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hub_operational_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read hub operational settings" ON public.hub_operational_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Assigned managers edit hub settings" ON public.hub_operational_settings FOR ALL TO authenticated
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.hub_managers m WHERE m.hub_id = hub_operational_settings.hub_id AND m.user_id = auth.uid()))
WITH CHECK (public.is_admin() OR EXISTS (SELECT 1 FROM public.hub_managers m WHERE m.hub_id = hub_operational_settings.hub_id AND m.user_id = auth.uid()));
CREATE TABLE IF NOT EXISTS public.advertiser_settings (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT '',
  billing_email text NOT NULL DEFAULT '',
  organisation_number text NOT NULL DEFAULT '',
  campaign_notifications boolean NOT NULL DEFAULT true,
  monthly_budget_sek numeric NOT NULL DEFAULT 0 CHECK (monthly_budget_sek >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.advertiser_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Advertiser manages own settings" ON public.advertiser_settings FOR ALL TO authenticated
USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());
COMMIT;
-- Opening hours and budgets are configuration only until booking/payment services enforce them.
-- Do not rely on these settings to restrict presence access or authorize payment.
