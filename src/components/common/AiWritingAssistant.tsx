import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
export function AiWritingAssistant({ text, onApply, scope }: { scope?: string; text: string; onApply: (value: string) => void }) {
  const [instructions, setInstructions] = useState(''); const [suggestion, setSuggestion] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const epoch = React.useRef(0);
  React.useEffect(() => { epoch.current++; setSuggestion(''); setNotice(''); setInstructions(''); setBusy(false); }, [scope]);
  const generate = async (mode: 'draft' | 'proofread') => {
    const requestEpoch = epoch.current;
    setBusy(true); setNotice(''); setSuggestion('');
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw new Error('Logga in för att använda AI-skrivhjälp.');
      const response = await fetch('/api/writing-assistant', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify({ mode, text: mode === 'draft' ? instructions : text }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Kunde inte skapa textförslag.'); if (requestEpoch === epoch.current) setSuggestion(result.text);
    } catch (error: any) { if (requestEpoch === epoch.current) setNotice(error.message); } finally { if (requestEpoch === epoch.current) setBusy(false); }
  };
  return <details className="border border-[#800020]/15 rounded-xl p-3 mb-3"><summary className="text-[#800020] font-semibold cursor-pointer">AI-skrivhjälp & textkontroll</summary><div className="space-y-3 mt-3"><p className="text-xs">Endast texten du väljer skickas till AI-tjänsten — inte samtalshistoriken. Undvik känsliga uppgifter. Granska alltid fakta; inget skickas automatiskt.</p><label className="block text-sm">Vad vill du skriva?<textarea maxLength={4000} value={instructions} onChange={e => setInstructions(e.target.value)} className="block w-full border rounded p-2" placeholder="Till exempel: föreslå en kaffe nästa vecka" /></label><div className="flex flex-wrap gap-2"><button type="button" disabled={busy || !instructions.trim()} onClick={() => generate('draft')} className="bg-[#800020] text-white rounded-lg p-2 disabled:opacity-40">Skapa utkast</button><button type="button" disabled={busy || !text.trim() || text.length > 4000} onClick={() => generate('proofread')} className="border text-[#800020] rounded-lg p-2 disabled:opacity-40">Kontrollera min text</button></div><p role="status">{busy ? 'Skapar förslag…' : notice}</p>{suggestion && <><label className="block text-sm">AI-förslag<textarea value={suggestion} onChange={e => setSuggestion(e.target.value)} className="block w-full border rounded p-2" rows={4} /></label><button type="button" onClick={() => { onApply(suggestion); setSuggestion(''); }} className="bg-[#800020] text-white rounded-lg p-2">Använd i meddelandefältet</button><button type="button" onClick={() => setSuggestion('')} className="p-2">Förkasta</button></>}</div></details>;
}
