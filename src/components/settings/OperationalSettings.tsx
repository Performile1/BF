import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Hub } from '../../types';
const days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
type Hours = Record<string, { open: string; close: string; closed: boolean }>;
export function HubOperationalSettings({ hub }: { hub: Hub }) {
  const [hours, setHours] = useState<Hours>({});
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false; setReady(false); setNotice('');
    if (!isSupabaseConfigured) { setNotice('Databasen är inte ansluten.'); return; }
    supabase.from('hub_operational_settings').select('opening_hours').eq('hub_id', hub.id).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) { setNotice('Öppettider kräver databasmigrationen operational_settings. Ingen ändring sparad.'); return; }
      setHours(data?.opening_hours || {}); setReady(true);
    });
    return () => { cancelled = true; };
  }, [hub.id]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true);
    try {
      for (const value of Object.values(hours) as Hours[string][]) if (!value.closed && (!value.open || !value.close || value.open >= value.close)) throw new Error('Ange giltiga tider. Nattöppettider behöver delas upp per dag.');
      const { data, error } = await supabase.from('hub_operational_settings').upsert({ hub_id: hub.id, opening_hours: hours, updated_at: new Date().toISOString() }).select('hub_id').single();
      if (error) throw error; if (!data) throw new Error('Sparningen bekräftades inte.');
      setNotice('Öppettider sparade. Bokningsmotorn behöver separat kopplas till öppettiderna.');
    } catch (error: any) { setNotice(`Kunde inte spara: ${error.message}`); } finally { setBusy(false); }
  };
  return <form onSubmit={save} className="border rounded-xl p-4 space-y-4"><h2 className="font-semibold">Öppettider — {hub.name}</h2><p className="text-sm">Sparbar konfiguration. Bokningar blockeras ännu inte automatiskt av dessa tider. Databasen tillåter skrivning endast för admin eller tilldelad hubbansvarig.</p><fieldset disabled={!ready || busy} className="space-y-3">{days.map((day, index) => {
    const value = hours[String(index)] || { open: '08:00', close: '17:00', closed: true };
    const change = (patch: Partial<typeof value>) => setHours(previous => ({ ...previous, [String(index)]: { ...value, ...patch } }));
    return <div key={day} className="flex flex-wrap gap-3 items-center"><span className="w-24">{day}</span><label><input type="checkbox" checked={value.closed} onChange={e => change({ closed: e.target.checked })} /> Stängt</label><input aria-label={`${day} öppnar`} type="time" disabled={value.closed} value={value.open} onChange={e => change({ open: e.target.value })} className="border rounded p-2" /><input aria-label={`${day} stänger`} type="time" disabled={value.closed} value={value.close} onChange={e => change({ close: e.target.value })} className="border rounded p-2" /></div>;
  })}<button className="bg-[#800020] text-white px-4 py-3 rounded-lg">{busy ? 'Sparar…' : 'Spara öppettider'}</button></fieldset><p role="status">{notice}</p></form>;
}
export function AdvertiserSettings({ userId }: { userId: string }) {
  const [draft, setDraft] = useState({ company_name: '', billing_email: '', organisation_number: '', campaign_notifications: true, monthly_budget_sek: 0 });
  const [notice, setNotice] = useState(''); const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => {
    let cancelled = false; setReady(false);
    if (!isSupabaseConfigured) { setNotice('Databasen är inte ansluten.'); return; }
    supabase.from('advertiser_settings').select('*').eq('user_id', userId).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) { setNotice('Annonsörsinställningar kräver databasmigrationen operational_settings.'); return; }
      if (data) setDraft({ company_name: data.company_name, billing_email: data.billing_email, organisation_number: data.organisation_number, campaign_notifications: data.campaign_notifications, monthly_budget_sek: Number(data.monthly_budget_sek) });
      setReady(true);
    }); return () => { cancelled = true; };
  }, [userId]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true);
    try {
      const { data, error } = await supabase.from('advertiser_settings').upsert({ ...draft, user_id: userId, updated_at: new Date().toISOString() }).select('user_id').single();
      if (error) throw error; if (!data) throw new Error('Sparningen kunde inte bekräftas.'); setNotice('Annonsörsprofil sparad. Budgeten är en planeringsuppgift, inte ett verkställt betalningstak.');
    } catch (error: any) { setNotice(`Kunde inte spara: ${error.message}`); } finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4 border rounded-xl p-4"><h2 className="font-semibold">Annonsörsinställningar</h2><p className="text-sm">Företagsprofil och önskemål. Detta genomför inga betalningar eller aktiverar kampanjer. Aviseringar måste kopplas till en utskickstjänst.</p><fieldset disabled={!ready || busy} className="space-y-4">{(['company_name', 'billing_email', 'organisation_number'] as const).map((field, index) => <label className="block" key={field}>{['Företag', 'Faktura-e-post', 'Organisationsnummer'][index]}<input required type={field === 'billing_email' ? 'email' : 'text'} value={draft[field]} onChange={e => setDraft({ ...draft, [field]: e.target.value })} className="block border rounded-lg p-3 w-full" /></label>)}<label className="block">Planerad månadsbudget (SEK)<input type="number" min="0" value={draft.monthly_budget_sek} onChange={e => setDraft({ ...draft, monthly_budget_sek: Number(e.target.value) })} className="block border rounded-lg p-3" /></label><label><input type="checkbox" checked={draft.campaign_notifications} onChange={e => setDraft({ ...draft, campaign_notifications: e.target.checked })} /> Kampanjaviseringar önskas</label><button className="block bg-[#800020] text-white px-4 py-3 rounded-lg">{busy ? 'Sparar…' : 'Spara annonsörsprofil'}</button></fieldset><p role="status">{notice}</p></form>;
}
