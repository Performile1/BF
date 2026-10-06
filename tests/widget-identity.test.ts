import assert from 'node:assert/strict';
import { WIDGET_ALIASES, normalizeWidgetIds } from '../src/lib/widgetIdentity';
import { WIDGET_REGISTRY, DEFAULT_ADMIN_WIDGET_IDS, DEFAULT_USER_WIDGET_IDS } from '../src/types/widgets';
for (const [alias, canonical] of Object.entries(WIDGET_ALIASES)) {
  assert.ok(WIDGET_REGISTRY[canonical]);
  assert.deepEqual(normalizeWidgetIds([alias, canonical, alias]), [canonical]);
}
assert.deepEqual(normalizeWidgetIds(DEFAULT_ADMIN_WIDGET_IDS), DEFAULT_ADMIN_WIDGET_IDS);
assert.deepEqual(normalizeWidgetIds(DEFAULT_USER_WIDGET_IDS), DEFAULT_USER_WIDGET_IDS);
assert.deepEqual(normalizeWidgetIds(['guest_pass', 'guest_pass', 'my_meetings']), ['guest_pass', 'my_meetings']);
console.log('25 widget identity assertions passed');
