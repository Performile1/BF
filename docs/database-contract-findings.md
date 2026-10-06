# Frontend/database review — repository evidence, NOT live verification

Inventory: 18 referenced tables/views and 8 RPC names, scanned across src. See database-contract-audit.json for every reference and source file. SQL existence alone does not verify compatible columns/signatures/policies.

Missing from repository SQL:
- notification_subscriptions, user_mfa_settings, v_who_is_at_hub_today.
- RPC connect_vcard_friend, delete_user_account, process_referral_signup, send_broadcast, update_profile_avatar.
These may exist in live Supabase; absence here is not proof of live absence.

Known contract/behavior risks:
- community_posts author_id is present in repository schema. Live joins, required fields and row policies still need verification; no author-column mismatch is established.
- Dashboard preferences request enabled_widgets and active_widget_ids together, then fallback between schema variants. Selecting a missing field invalidates the whole query.
- system_settings supports incompatible row/column and key/value fallbacks; role settings save requires maintenance key/value representation. Existing service may report local fallback as success.
- Hub/member creation is client-state only, not persisted Auth/database administration.
- Operational-settings migration has not been verified live; hub_managers assignments must be trusted backend data.
- Presence is currently limited to four in UI, not a server privacy rule.
- Advertisement payment/publication is simulated client state; do not treat it as verified billing.
- Wallet issuance, shared QR visibility rules and booking enforcement remain incomplete.

Live verification BLOCKED: externally installed Supabase integration has no managed SQL/MCP capability here. Project URL alone cannot inspect information_schema, migrations or RLS. Need a supported authenticated read-only database/schema export from the exact project. Do not send passwords/keys in chat.

Required acceptance: compare columns/types/defaults/constraints, RPC args/returns, policy grants and applied migrations; execute real member/manager/admin write tests in isolated staging. Never run destructive tests against production members.

Header search follow-up: deterministic navigation suggestions are implemented. AI suggestions and real member/hub search are NOT implemented in this branch and must not be presented as AI output. AI requires authenticated endpoint, server rate limits and authorized result IDs, not invented entities. No production rollout.
