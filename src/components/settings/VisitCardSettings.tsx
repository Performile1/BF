import React from 'react';
export function VisitCardSettings({ userId }: { userId: string }) {
  const key = `bf_visitcard_${userId}`;
  const [style, setStyle] = React.useState('burgundy');
  const [notice, setNotice] = React.useState('');
  React.useEffect(() => { try { setStyle(localStorage.getItem(key) || 'burgundy'); } catch {} }, [key]);
  return <section className="border rounded-xl p-4 space-y-4"><h2 className="font-semibold">Mitt QR-visitkort</h2><label className="block">Korttema<select value={style} onChange={e => setStyle(e.target.value)} className="block border rounded-lg p-3"><option value="burgundy">Vinröd</option><option value="light">Ljust</option><option value="dark">Mörkt</option></select></label><button className="bg-[#800020] text-white px-4 py-3 rounded-lg" onClick={() => { try { localStorage.setItem(key, style); window.dispatchEvent(new Event('bf_visitcard_changed')); setNotice('Korttema sparat i denna webbläsare.'); } catch { setNotice('Kunde inte spara temat.'); } }}>Spara korttema</button><p role="status">{notice}</p><h3 className="font-semibold">Apple Wallet / Google Wallet</h3><p className="text-sm">Wallet-utfärdning är inte konfigurerad ännu. Ett signerat pass och utfärdarkonfiguration behövs innan knappar för att lägga till kortet kan aktiveras. Din vanliga QR-länk och kontaktfil fungerar fortsatt.</p></section>;
}
