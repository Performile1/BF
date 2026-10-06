# PR #2 gaps and AI writing rollout

Implemented in this follow-up:
- Quick Action preference now appears in ordinary Settings and is not admin-gated. Admin HUD remains admin-only. Preference is per account/browser.
- Chat AI panel: draft from an explicit prompt or proofread current text; preview/edit/apply/discard; never automatically send. Conversation history is not sent. Requests are invalidated on channel change.
- Server function checks Supabase session, method/input size, timeout; provider key never goes into the client. AI_WRITING_ENABLED must be true. No live provider request has been verified.

AI rollout prerequisites:
- Set AI_GATEWAY_API_KEY, AI_WRITING_MODEL, server SUPABASE_URL/SUPABASE_ANON_KEY (existing VITE names are accepted) in protected deployment settings, not chat/GitHub.
- Add durable per-user quotas/rate limiting and spend controls BEFORE enabling AI_WRITING_ENABLED=true for public use. Current endpoint is intentionally disabled by default.
- Verify model availability, gateway funding, Vercel API function routing, real login, provider error handling and messaging acceptance. Review privacy/provider processing terms.
- API reference: https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/rest-api

PR #2 is still a partial/draft implementation:
1. Migration is not applied; schema and RLS not tested live. Admin needs to populate hub_managers assignments; primary_hub_id is not equivalent to trusted manager assignment.
2. Opening hours are saved configuration only, not enforced in booking transactions. Closure dates, booking horizon and cancellation rule UI/consumption remain missing.
3. Server-authorized creation of new hubs, capacity/facilities/contact forms and manager assignment workflow are missing.
4. Server-side presence restrictions by role/member level and removal of broad base-table access are missing. Widget still shows four members.
5. QR customization currently changes only the modular widget border. Public/private field filtering, shared preview, all QR representations and cross-device persistence are missing.
6. Apple/Google Wallet signed pass issuance, certificate/issuer setup and update/revocation are missing.
7. Real ad campaigns, approval, verified payments/webhooks, budget enforcement, pause/resume and notification delivery are missing. Advertiser settings are profile/planning preferences, not billing implementation.
8. Full browser/integration tests and production rollout remain pending. PR #1 not merged; tools cannot merge it. PR #2 targets PR #1's branch.

This follow-up is source/preview only, not production.
