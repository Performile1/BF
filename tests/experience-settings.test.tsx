import React from 'react';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExperienceSettings, WelcomeGuide, type ExperiencePreferences } from '../src/components/settings/ExperienceSettings';
const preferences: ExperiencePreferences = { navigation: 'sidebar', home: 'overview', reducedMotion: false };
function render(section: string, isAdmin = false, isHubHost = false) {
  return renderToStaticMarkup(<ExperienceSettings section={section} preferences={preferences} onChange={() => {}} onNavigate={() => {}} onGuide={() => {}} isAdmin={isAdmin} isHubHost={isHubHost} />);
}
assert.match(render('settings'), /Bento-översikt/);
assert.match(render('settings'), /Modulär widgetvy/);
assert.doesNotMatch(render('settings'), /Admininställningar/);
assert.doesNotMatch(render('settings'), /Hubbinställningar/);
assert.match(render('admin_settings'), /saknar behörighet/);
assert.match(render('hub_settings'), /saknar behörighet/);
assert.match(render('settings', false, true), /Hubbinställningar/);
assert.doesNotMatch(render('settings', false, true), /Admininställningar/);
assert.match(render('hub_settings', false, true), /Hubbkalender/);
assert.match(render('admin_settings', true), /systemadministration/);
assert.match(render('hub_settings', true), /Hubbkalender/);
assert.match(render('settings', true), /Admininställningar/);
const guide = renderToStaticMarkup(<WelcomeGuide onClose={() => {}} onNavigate={() => {}} />);
assert.match(guide, /role="dialog"/);
assert.match(guide, /Hoppa över/);
assert.match(guide, /Steg 1 av 4/);
console.log('15 experience settings / role visibility / guide assertions passed.');
