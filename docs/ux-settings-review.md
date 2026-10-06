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

## Expanded categories, compact menu and detailed tour
- Categories now expand on click; active category opens in full mode. Search reveals matching destinations.
- Compact desktop rail shows accessible category icons with labelled flyouts; clicking outside or Escape closes them. Full/mobile modes retain labels.
- Preference can be changed in Settings or with the sidebar toggle.
- Guide now contains 12 member steps, plus a hub workspace step and an admin workspace step for existing roles. A minimized resume panel allows exploration without losing the current step. No data mutations are triggered by the guide.
- Updated verification: TypeScript, production build, 18 settings/guide assertions and 10 category-sidebar assertions passed. Browser interaction/visual acceptance remains unverified.
- Source is published on the agent PR branch; production is deployed explicitly through Vercel CLI. Main still needs a GitHub merge to make future main-branch builds include these changes.
