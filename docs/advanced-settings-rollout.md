# Advanced settings: partial implementation and rollout gates

Implemented in this branch:
- Opening-hours editor stored in hub_operational_settings with migration-level RLS for admins/assigned hub_managers.
- Advertiser profile and planning preferences, with owner-only/admin RLS. Budget/notifications are explicitly not enforced or sent yet.
- QR widget border theme, local per user/browser.

Required before live usage:
1. Review/apply supabase/migrations/20261006_operational_settings.sql to the correct Supabase project. This has NOT been applied here. Policies depend on existing public.is_admin(). Populate hub_managers using verified admin assignments, not editable profile role strings.
2. Run database role tests: unrelated member cannot update hub settings, assigned manager can update only assigned hub, owner can access only own advertiser profile, admin can manage assignments. Forms block save if tables are unavailable and show database errors.
3. Connect opening-hours config to booking validation in server transactions. Existing booking code does not yet consume these settings.
4. Implement server-authorized hub creation, presence-limited responses (and remove broad base-table grants), QR public-field filtering, real ad approval/payment/webhook lifecycle. These are NOT implemented in this branch. Current presence widget still shows four people.
5. Implement Apple/Google pass generation after issuer credentials and provider documentation are available. No Wallet buttons claim to work in this branch. Do not upload certificates or private keys to GitHub or chat.
6. Merge PR #1 in GitHub; supplied tools cannot merge PRs. Until merged, main does not include these changes.

No migration applied, no live database test, no production deployment for this partial follow-up. QR theme currently affects the modular QR widget only, not all existing QR representations.
