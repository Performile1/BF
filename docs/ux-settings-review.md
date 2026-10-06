# UX settings review

## Changes
- Recommended desktop sidebar with one Home destination using the selected dashboard.
- Legacy top navigation and both existing dashboard implementations remain accessible.
- Responsive mobile bottom navigation; legacy device simulators remain available.
- Member appearance/profile/membership settings, HUB_HOST workspace and admin workspace.
- Role workspaces link to existing modules; they do not grant new server permissions or introduce hub-scoped database writes.
- Preferences and optional first-visit guide status are stored per account in this browser, not synchronized across devices.
- Known hash destinations support shared links and Back/Forward without replacing existing auth/invitation paths. Supabase authentication callback fragments are left untouched.
- New/default Bento order prioritizes meetings and connections. Existing saved layouts are not migrated or removed.

## Automated checks
- `npm run lint` (TypeScript)
- `npm run build`
- `node --import tsx tests/experience-settings.test.tsx` (15 server-rendered assertions; not browser interaction tests)

## Manual acceptance before merge
- Test MEMBER, HUB_HOST and administrator accounts, including direct links to denied settings workspaces.
- Verify authentication callback, invitation and connect routes.
- Switch dashboard/navigation preferences, reload and verify account isolation.
- Test Back/Forward and a shared `#calendar` link.
- Test mobile at 320px/390px and tablet/desktop; verify content and quick action are not obscured by the bottom bar.
- Run, skip and restart the guide; test Escape, Tab/Shift+Tab and screen reader announcements.
- Verify all legacy modules, device simulators and saved widget layouts remain reachable.
- Verify reduced motion with OS preference and the appearance setting.

Visual/browser acceptance and server-side role enforcement have not been verified by the automated checks above.
