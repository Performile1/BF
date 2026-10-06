# Safe demo cleanup acceptance

New cleanup_demo_activities RPC is separate from the old blocked purge RPC. Both HUD and Dev call one shared frontend helper. No direct DELETE fallback remains in those purge handlers. Seed handlers remain unchanged and their old RPC remains blocked; do not use Load Mock until seed-side fallbacks are also replaced.

Install SQL only creates the function/grants; it does not delete data. Server checks require auth.uid(), active SUPER_ADMIN profile and protected email admin@performile.com. Demo activity table allowlist excludes profile/auth/CV/storage/hubs/invoices/configuration. Demo children/protected children are rechecked under public-table locks. Unknown DELETE triggers and SET NULL/DEFAULT dependencies abort. Preview rehearses in an exception subtransaction, restoring writes. Permanent call requires explicit confirmation. Preview and execute are separate transactions: inspect the permanent returned counts because data can change between them.

Required staging/live acceptance before permanent cleanup:
- Anonymous/non-admin/other admin denied.
- Protected admin can preview; counts unchanged afterwards.
- Inject real child referencing demo parent in isolated staging; must abort.
- New real activity survives staging purge; admin profile unchanged.
- Real profile CV/Storage and invoices/hubs remain unchanged.
- Verify locking and statement duration; operation locks ALL public tables.
- Backup before permanent action; this is not a backup or undo system.

TypeScript and Vite build passed. Database function not installed/tested by agent. Prior user SQL Editor trial tested deletion dependencies but not this authenticated function. Frontend change only in PR/preview; not production. No all-admin-security remediation claim.
