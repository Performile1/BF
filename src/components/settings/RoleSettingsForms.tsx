import React, { useState } from 'react';
import { Hub, Member } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { getSystemSettings } from '../../lib/widgetServices';
import { SystemSettings } from '../../types/widgets';

export function AdminSettingsForm({ isAdmin }: { isAdmin: boolean }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  React.useEffect(() => { if (isAdmin) getSystemSettings().then(setSettings).catch(() => setNotice('Inställningarna kunde inte läsas.')); }, [isAdmin]);
  if (!isAdmin) return <p role="alert">Du saknar administratörsbehörighet.</p>;
  if (!settings) return <p role="status">{notice || 'Läser driftinställningar…'}</p>;
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice('');
    try {
      if (!isSupabaseConfigured) throw new Error('Databasen är inte ansluten. Ingen gemensam inställning har sparats.');
      // Use the existing key/value representation; never claim a local fallback is a shared save.
      const value = { maintenance_mode: settings.maintenance_mode, maintenance_message: settings.maintenance_message, estimated_maintenance_end: settings.estimated_maintenance_end };
      const { data, error } = await supabase.from('system_settings').upsert({ key: 'maintenance', value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select('key,value').single();
      if (error) throw error;
      if (!data) throw new Error('Sparningen kunde inte bekräftas.');
      localStorage.setItem('booster_system_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('booster_system_settings_updated'));
      setNotice('Driftinställningarna är sparade i databasen.');
    } catch (error: any) { setNotice(`Kunde inte spara gemensamma inställningar: ${error.message}`); }
    finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4 border rounded-xl p-4">
    <h2 className="font-semibold text-lg">Drift & underhåll</h2><p className="text-sm">Gäller hela plattformen. Ändringar träder i kraft först när du sparar.</p>
    <label className="flex gap-3"><input type="checkbox" checked={settings.maintenance_mode} onChange={e => setSettings({ ...settings, maintenance_mode: e.target.checked })} />Aktivera underhållsläge (begränsar åtkomst för medlemmar)</label>
    <label className="block">Driftmeddelande<textarea required maxLength={2000} className="block w-full border rounded-lg p-3 mt-2" value={settings.maintenance_message} onChange={e => setSettings({ ...settings, maintenance_message: e.target.value })} /></label>
    <label className="block">Beräknat avslut (valfritt)<input type="datetime-local" className="block border rounded-lg p-3 mt-2" value={settings.estimated_maintenance_end ? new Date(new Date(settings.estimated_maintenance_end).getTime() - new Date(settings.estimated_maintenance_end).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setSettings({ ...settings, estimated_maintenance_end: e.target.value ? new Date(e.target.value).toISOString() : null })} /></label>
    <button disabled={busy} className="bg-[#800020] text-white rounded-lg px-4 py-3 disabled:opacity-50">{busy ? 'Sparar…' : 'Spara driftinställningar'}</button><p role="status">{notice}</p>
  </form>;
}
export function HubSettingsForm({ hub, currentUser, isAdmin, isHubHost, onSaved }: { hub: Hub; currentUser: Member; isAdmin: boolean; isHubHost: boolean; onSaved: (hub: Hub) => void }) {
  const [draft, setDraft] = useState(hub);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const assigned = (currentUser.primary_hub_id || currentUser.hub_id) === hub.id;
  const canEdit = isAdmin || (isHubHost && assigned);
  React.useEffect(() => { setDraft(hub); setNotice(''); }, [hub.id]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!canEdit) return;
    setBusy(true); setNotice('');
    try {
      if (!isSupabaseConfigured) throw new Error('Databasen är inte ansluten. Ingen hubbinställning har sparats.');
      const value = { name: draft.name.trim(), city: draft.city.trim(), address: draft.address.trim(), meeting_day: draft.meeting_day.trim(), radius_m: draft.radius_m, geofence_lat: draft.geofence_lat, geofence_lng: draft.geofence_lng };
      const { data, error } = await supabase.from('hubs').update(value).eq('id', hub.id).select('id').single();
      if (error) throw error;
      if (!data) throw new Error('Ändringen kunde inte bekräftas. Kontrollera hubbens databasbehörighet.');
      onSaved({ ...draft, ...value }); setNotice('Hubbinställningarna är sparade i databasen.');
    } catch (error: any) { setNotice(`Kunde inte spara: ${error.message}`); }
    finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4 border rounded-xl p-4">
    <h2 className="font-semibold text-lg">Inställningar för {hub.name}</h2>
    <p className="text-sm">Gäller vald hubb. Databasen måste tillåta ändringen; inga nya behörigheter tilldelas här.</p>
    {!canEdit && <p role="alert">Välj din tilldelade hubb för att redigera. Andra hubbar visas endast för läsning.</p>}
    <fieldset disabled={!canEdit || busy} className="space-y-4">
      {(['name', 'city', 'address', 'meeting_day'] as const).map((field, index) => <label className="block" key={field}>{['Namn', 'Ort', 'Adress', 'Ordinarie mötestid'][index]}<input required maxLength={field === 'address' ? 255 : field === 'meeting_day' ? 50 : 100} value={draft[field]} onChange={e => setDraft({ ...draft, [field]: e.target.value })} className="block w-full border rounded-lg p-3 mt-2" /></label>)}
      {(['geofence_lat', 'geofence_lng', 'radius_m'] as const).map((field, index) => <label className="block" key={field}>{['Latitud', 'Longitud', 'Incheckningsradie (meter)'][index]}<input required type="number" step={field === 'radius_m' ? 1 : 'any'} min={field === 'radius_m' ? 1 : field === 'geofence_lat' ? -90 : -180} max={field === 'radius_m' ? 10000 : field === 'geofence_lat' ? 90 : 180} value={Number.isFinite(draft[field]) ? draft[field] : ''} onChange={e => setDraft({ ...draft, [field]: e.target.value === '' ? NaN : Number(e.target.value) })} className="block border rounded-lg p-3 mt-2" /></label>)}
      <button className="bg-[#800020] text-white rounded-lg px-4 py-3 disabled:opacity-50">{busy ? 'Sparar…' : 'Spara hubbinställningar'}</button>
    </fieldset><p role="status">{notice}</p>
  </form>;
}
