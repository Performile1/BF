import { AdminSettingsForm, HubSettingsForm } from './RoleSettingsForms';
import { Hub, Member } from '../../types';
import React, { useEffect, useState } from 'react';
import { AVAILABLE_START_PAGES } from '../../lib/landingPageService';
const validHomePages = ['overview', 'dashboard_widgets', 'matchmaking', 'coworking', 'calendar', 'events', 'community', 'directory', 'blog', 'chat', 'skills', 'academy', 'edx_partners', 'webinars', 'benefits', 'promos', 'advertise', 'pipeline', 'gamification', 'profile_settings', 'membership', 'admin', 'architecture'];

export type ExperiencePreferences = { navigation: 'sidebar' | 'compact' | 'top'; home: string; reducedMotion: boolean };
const defaults: ExperiencePreferences = { navigation: 'sidebar', home: 'overview', reducedMotion: false };
export function useExperiencePreferences(userId: string, profileStart?: string) {
  const key = `bf_experience_${userId}`;
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const start = saved.home || localStorage.getItem('bf_preferred_start_page') || localStorage.getItem('bf_user_landing_page') || profileStart;
      return { navigation: saved.navigation === 'top' ? 'top' : saved.navigation === 'compact' ? 'compact' : 'sidebar', home: validHomePages.includes(start) ? start : 'overview', reducedMotion: saved.reducedMotion === true } as ExperiencePreferences;
    } catch { return defaults; }
  };
  const [preferences, setPreferences] = useState<ExperiencePreferences>(read);
  useEffect(() => { setPreferences(read()); }, [key]);
  useEffect(() => {
    const sync = (event: Event) => {
      const home = (event as CustomEvent<string>).detail;
      if (!validHomePages.includes(home)) return;
      setPreferences(previous => { const next = { ...previous, home }; try { localStorage.setItem(key, JSON.stringify(next)); } catch {} return next; });
    };
    window.addEventListener('bf_start_page_changed', sync);
    return () => window.removeEventListener('bf_start_page_changed', sync);
  }, [key]);
  const update = (value: ExperiencePreferences) => { setPreferences(value); try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem('bf_preferred_start_page', value.home);
    localStorage.setItem('bf_user_landing_page', value.home);
    window.dispatchEvent(new CustomEvent('bf_start_page_changed', { detail: value.home }));
  } catch {} };
  return { preferences, update };
}
export function ExperienceSettings({ section, preferences, onChange, onNavigate, onGuide, isAdmin, isHubHost, hub, currentUser, onHubSaved }: {
  section: string; preferences: ExperiencePreferences; onChange: (value: ExperiencePreferences) => void;
  onNavigate: (tab: string) => void; onGuide: () => void; isAdmin: boolean; isHubHost: boolean; hub?: Hub; currentUser?: Member; onHubSaved?: (hub: Hub) => void;
}) {
  if ((section === 'admin_settings' && !isAdmin) || (section === 'hub_settings' && !isAdmin && !isHubHost)) return <p role="alert">Du saknar behörighet till dessa inställningar.</p>;
  const button = (label: string, tab: string) => <button onClick={() => onNavigate(tab)} className="block w-full text-left border rounded-xl p-4 hover:bg-gray-50">{label} →</button>;
  return <section className="bg-white rounded-2xl border p-6 space-y-6">
    <h1 className="text-2xl font-bold">{section === 'admin_settings' ? 'Admininställningar' : section === 'hub_settings' ? 'Hubbinställningar' : 'Inställningar'}</h1>
    {section === 'settings' ? <>
      <fieldset className="space-y-4"><legend className="font-semibold mb-3">Utseende & startsida</legend>
        <label className="block">Navigation<select className="block border rounded-lg p-3 mt-2 w-full" value={preferences.navigation} onChange={e => onChange({ ...preferences, navigation: e.target.value as ExperiencePreferences['navigation'] })}><option value="sidebar">Sidomeny (rekommenderas)</option><option value="compact">Kompakt ikonmeny till vänster</option><option value="top">Topmeny (tidigare navigation)</option></select></label>
        <label className="block">Standardstartsida<select className="block border rounded-lg p-3 mt-2 w-full" value={preferences.home} onChange={e => onChange({ ...preferences, home: e.target.value as ExperiencePreferences['home'] })}><option value="overview">Bento-översikt</option><option value="dashboard_widgets">Modulär widgetvy</option>{AVAILABLE_START_PAGES.filter(page => !['overview', 'dashboard_widgets'].includes(page.id)).map(page => <option key={page.id} value={page.id}>{page.title}</option>)}{!AVAILABLE_START_PAGES.some(page => page.id === preferences.home) && <option value={preferences.home}>Vald startsida: {preferences.home}</option>}</select></label>
        <label className="flex gap-3 items-center"><input type="checkbox" checked={preferences.reducedMotion} onChange={e => onChange({ ...preferences, reducedMotion: e.target.checked })} />Minska rörelser och animationer</label>
        <p className="text-sm text-gray-500">Sparas automatiskt för ditt konto i den här webbläsaren. Alla funktioner och båda vyerna finns kvar.</p>
      </fieldset>
      <div className="space-y-3">{button('Profil & säkerhet', 'profile_settings')}{button('Medlemskap & betalning', 'membership')}<button onClick={onGuide} className="border rounded-xl p-4 w-full text-left">Starta introduktionsguiden igen →</button></div>
      <details className="border rounded-xl p-4"><summary className="cursor-pointer font-semibold py-2">Alla funktioner</summary><div className="grid sm:grid-cols-2 gap-2 mt-3">{[
        ['Hem (Bento)', 'overview'], ['Mina widgets', 'dashboard_widgets'], ['Matchningar', 'matchmaking'], ['Medlemmar', 'directory'], ['Community', 'community'], ['Medlemsbloggen', 'blog'], ['Meddelanden', 'chat'], ['Kompetenser & omdömen', 'skills'], ['Boka arbetsplats', 'coworking'], ['Kalender', 'calendar'], ['Event', 'events'], ['Kurser', 'academy'], ['Utbildningspartners', 'edx_partners'], ['Webbinarier', 'webinars'], ['Förmåner', 'benefits'], ['Kampanjer', 'promos'], ['Annonsering', 'advertise'], ['Pipeline', 'pipeline'], ['Poäng & status', 'gamification'], ...(isAdmin ? [['Kravspecifikation & schema', 'architecture']] : [])
      ].map(([label, tab]) => <React.Fragment key={tab}>{button(label, tab)}</React.Fragment>)}</div></details>
      {isHubHost || isAdmin ? button('Hubbinställningar', 'hub_settings') : null}
      {isAdmin ? button('Admininställningar', 'admin_settings') : null}
    </> : section === 'admin_settings' ? <div className="space-y-3"><AdminSettingsForm isAdmin={isAdmin} /><h2 className="font-semibold">Verktyg</h2><p>Genvägar till befintlig administration. Inga roller eller behörigheter ändras här.</p>{button('Medlemmar, regler & systemadministration', 'admin')}{button('Annonsering', 'advertise')}{button('Kravspecifikation & schema', 'architecture')}</div> : <div className="space-y-3">{hub && currentUser && onHubSaved ? <HubSettingsForm hub={hub} currentUser={currentUser} isAdmin={isAdmin} isHubHost={isHubHost} onSaved={onHubSaved} /> : <p>Välj en hubb för att läsa inställningar.</p>}<h2 className="font-semibold">Verktyg</h2><p>Hubbansvarigs arbetsyta. Välj aktuell hubb i sidhuvudet. Genvägarna ger inte nya administrativa behörigheter.</p>{button('Arbetsplatser & bokningar', 'coworking')}{button('Hubbkalender', 'calendar')}{button('Event', 'events')}{button('Hubbens community', 'community')}</div>}
  </section>;
}
export const GUIDE_STEPS = [
  { title: 'Välkommen till Booster Friends', text: 'Turen visar hur du hittar människor, bokar platser och anpassar din arbetsyta. Du behöver inte fylla i något och turen gör inga bokningar. Du kan pausa och starta igen under Inställningar.', tab: 'overview', action: 'Visa startsidan', tips: ['Använd Nästa och Tillbaka i din egen takt.', 'Öppna sidan bakom guiden för att se var funktionen finns.'] },
  { title: 'Hitta rätt i menyn', text: 'Klicka på en huvudkategori för att fälla ut dess undersidor. Den aktuella sidan markeras. På desktop kan du minimera menyn till ikoner; klicka på en ikon för att visa kategorins sidor.', tab: 'settings', action: 'Visa menyinställningar', tips: ['Sök i fullständig sidomeny för att hitta en funktion.', 'Mobilens bottenmeny ger genvägar; alla funktioner finns under Mer.'] },
  { title: 'Välj hubb och boka arbetsplats', text: 'Välj aktuell hubb i sidhuvudet. Under Platser och bokningar hittar du tillgängliga arbetsplatser och dina bokningar. Kontrollera datum, plats och villkor innan du bekräftar.', tab: 'coworking', action: 'Visa arbetsplatser', tips: ['Guiden gör aldrig en bokning åt dig.', 'Dina bokningar och tillgänglighet finns i bokningsvyn.'] },
  { title: 'Planera med kalender och event', text: 'Kalendern samlar träffar och aktiviteter. Öppna ett event för att läsa datum, plats och deltagarvillkor innan du anmäler dig.', tab: 'calendar', action: 'Visa kalendern', tips: ['Eventvyn ger en annan ingång till aktiviteter.', 'Kontrollera om aktiviteten är fysisk eller digital.'] },
  { title: 'Gör din profil användbar', text: 'Berätta vem du är, vad du erbjuder och vad du söker. En tydlig profil gör det lättare för andra medlemmar att hitta rätt kontakt. Profilvyn innehåller även QR och säkerhetsinställningar.', tab: 'profile_settings', action: 'Visa din profil', tips: ['Granska kontaktuppgifter innan du delar din profil.', 'Aktivera tillgängliga säkerhetsfunktioner under Profil & säkerhet.'] },
  { title: 'Hitta medlemmar och matchningar', text: 'Medlemskatalogen hjälper dig att upptäcka kontakter. Matchningsvyn ger ytterligare förslag. Läs personens profil och välj en relevant kontaktväg.', tab: 'directory', action: 'Visa medlemmar', tips: ['Utgå från vad du behöver hjälp med eller kan erbjuda.', 'Matchningar är förslag, inte automatiska introduktioner.'] },
  { title: 'Fortsätt samtalet', text: 'I Meddelanden hittar du chattar och samtal. Välj mottagare och kontrollera meddelandet innan du skickar. Räknaren i menyn hjälper dig att upptäcka olästa meddelanden.', tab: 'chat', action: 'Visa meddelanden', tips: ['Guiden skickar inga meddelanden.', 'En kort introduktion med ett tydligt syfte gör kontakten enklare.'] },
  { title: 'Delta i communityn', text: 'Läs flödet, hitta diskussioner och dela kunskap. Medlemsbloggen och kompetenser/omdömen finns i samma nätverksområde.', tab: 'community', action: 'Visa communityn', tips: ['Välj ett relevant ämne och en tydlig rubrik när du skriver.', 'Undvik att publicera privata kontakt- eller kunduppgifter.'] },
  { title: 'Lärande och förmåner', text: 'Under Akademin hittar du kurser, utbildningspartners och webbinarier. Förmåner och kampanjer finns också kvar som egna undersidor.', tab: 'academy', action: 'Visa akademin', tips: ['Läs kursens beskrivning och eventuella villkor.', 'Kontrollera förmånens giltighet och medlemsnivå.'] },
  { title: 'Följ dina affärer', text: 'Pipeline hjälper dig att hålla ordning på affärsmöjligheter och deras status. Använd den som din arbetsöversikt och uppdatera nästa steg när ett samtal går vidare.', tab: 'pipeline', action: 'Visa pipeline', tips: ['Guiden lägger inte till eller ändrar affärer.', 'Poäng och status finns kvar i sin egen vy.'] },
  { title: 'Medlemskap och ditt konto', text: 'Under Inställningar hittar du profil, säkerhet och medlemskap. I medlemskapsvyn kan du granska din nivå och tillgänglig betalningsinformation.', tab: 'membership', action: 'Visa medlemskap', tips: ['Kontrollera villkor före ändringar av medlemskap.', 'Inställningsgenvägar ger inte nya administrativa rättigheter.'] },
  { title: 'Anpassa din arbetsyta', text: 'Välj fullständig sidomeny, kompakt ikonmeny eller topmeny. Välj också din startsida: bento, modulära widgets eller en annan befintlig vy. Dina tidigare funktioner finns kvar.', tab: 'settings', action: 'Visa inställningar', tips: ['Utseendeval sparas för ditt konto i den här webbläsaren.', 'Aktivera Minska rörelser om du vill ha ett lugnare gränssnitt.', 'Du kan starta denna tur igen när som helst.'] }
];
export function WelcomeGuide({ onClose, onNavigate, isAdmin = false, isHubHost = false }: { onClose: () => void; onNavigate: (tab: string) => void; isAdmin?: boolean; isHubHost?: boolean }) {
  const steps = [...GUIDE_STEPS, ...(isHubHost || isAdmin ? [{ title: 'Hubbansvarigs arbetsyta', text: 'Hubbinställningar samlar genvägar till arbetsplatser, kalender, event och community. Välj rätt hubb i sidhuvudet innan du arbetar vidare.', tab: 'hub_settings', action: 'Visa hubbinställningar', tips: ['Tillgängliga funktioner följer din befintliga roll.', 'Denna arbetsyta ger inte nya rättigheter till andra hubbar.'] }] : []), ...(isAdmin ? [{ title: 'Administratörens arbetsyta', text: 'Admininställningar leder till befintlig administration, annonsering och systemdokumentation. Kontrollera mål och omfattning innan du ändrar gemensamma inställningar.', tab: 'admin_settings', action: 'Visa admininställningar', tips: ['Administrationen visas enbart för befintliga administratörer.', 'Guiden ändrar inga roller eller systeminställningar.'] }] : [])];
  const [step, setStep] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const current = steps[Math.min(step, steps.length - 1)];
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    if (minimized) return;
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const buttons: HTMLButtonElement[] = dialogRef.current ? Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')) : [];
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handler); previous?.focus(); };
  }, [onClose, minimized]);
  if (minimized) return <aside aria-label="Guidad tur pausad" className="fixed bottom-24 right-4 z-[100] bg-white border shadow-xl rounded-2xl p-4 max-w-xs"><p className="font-semibold mb-2">Steg {step + 1}: {current.title}</p><p className="text-sm mb-3">Utforska sidan utan att förlora din plats i turen.</p><button onClick={() => setMinimized(false)} className="bg-[#800020] text-white p-3 rounded-lg">Fortsätt turen</button><button onClick={onClose} className="p-3 underline">Avsluta</button></aside>;
  return <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"><section ref={dialogRef} id="welcome-guide" role="dialog" aria-modal="true" aria-labelledby="guide-title" aria-describedby="guide-description" className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-5 max-h-[90dvh] overflow-y-auto">
    <div className="flex justify-between items-center"><p aria-live="polite" className="text-sm text-gray-500">Steg {step + 1} av {steps.length}</p><button ref={closeRef} onClick={onClose} className="p-3 underline">Hoppa över</button></div>
    <progress aria-label="Turens framsteg" className="w-full accent-[#800020]" value={step + 1} max={steps.length} />
    <h2 id="guide-title" className="text-2xl font-bold">{current.title}</h2><p id="guide-description">{current.text}</p>
    <ul className="list-disc pl-5 text-sm space-y-2">{current.tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
    <button className="p-3 border rounded-lg" onClick={() => { onNavigate(current.tab); setMinimized(true); }}>{current.action} och utforska →</button>
    <div className="flex justify-between"><button disabled={step === 0} onClick={() => setStep(step - 1)} className="p-3 disabled:opacity-40">Tillbaka</button><button onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)} className="bg-[#800020] text-white px-5 py-3 rounded-lg">{step === steps.length - 1 ? 'Slutför turen' : 'Nästa'}</button></div>
  </section></div>;
}
