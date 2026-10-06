import React, { useEffect, useState } from 'react';
import { AVAILABLE_START_PAGES } from '../../lib/landingPageService';
const validHomePages = ['overview', 'dashboard_widgets', 'matchmaking', 'coworking', 'calendar', 'events', 'community', 'directory', 'blog', 'chat', 'skills', 'academy', 'edx_partners', 'webinars', 'benefits', 'promos', 'advertise', 'pipeline', 'gamification', 'profile_settings', 'membership', 'admin', 'architecture'];

export type ExperiencePreferences = { navigation: 'sidebar' | 'top'; home: string; reducedMotion: boolean };
const defaults: ExperiencePreferences = { navigation: 'sidebar', home: 'overview', reducedMotion: false };
export function useExperiencePreferences(userId: string, profileStart?: string) {
  const key = `bf_experience_${userId}`;
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      const start = saved.home || localStorage.getItem('bf_preferred_start_page') || localStorage.getItem('bf_user_landing_page') || profileStart;
      return { navigation: saved.navigation === 'top' ? 'top' : 'sidebar', home: validHomePages.includes(start) ? start : 'overview', reducedMotion: saved.reducedMotion === true } as ExperiencePreferences;
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
export function ExperienceSettings({ section, preferences, onChange, onNavigate, onGuide, isAdmin, isHubHost }: {
  section: string; preferences: ExperiencePreferences; onChange: (value: ExperiencePreferences) => void;
  onNavigate: (tab: string) => void; onGuide: () => void; isAdmin: boolean; isHubHost: boolean;
}) {
  if ((section === 'admin_settings' && !isAdmin) || (section === 'hub_settings' && !isAdmin && !isHubHost)) return <p role="alert">Du saknar behörighet till dessa inställningar.</p>;
  const button = (label: string, tab: string) => <button onClick={() => onNavigate(tab)} className="block w-full text-left border rounded-xl p-4 hover:bg-gray-50">{label} →</button>;
  return <section className="bg-white rounded-2xl border p-6 space-y-6">
    <h1 className="text-2xl font-bold">{section === 'admin_settings' ? 'Admininställningar' : section === 'hub_settings' ? 'Hubbinställningar' : 'Inställningar'}</h1>
    {section === 'settings' ? <>
      <fieldset className="space-y-4"><legend className="font-semibold mb-3">Utseende & startsida</legend>
        <label className="block">Navigation<select className="block border rounded-lg p-3 mt-2 w-full" value={preferences.navigation} onChange={e => onChange({ ...preferences, navigation: e.target.value as ExperiencePreferences['navigation'] })}><option value="sidebar">Sidomeny (rekommenderas)</option><option value="top">Topmeny (tidigare navigation)</option></select></label>
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
    </> : section === 'admin_settings' ? <div className="space-y-3"><p>Genvägar till befintlig administration. Inga roller eller behörigheter ändras här.</p>{button('Medlemmar, regler & systemadministration', 'admin')}{button('Annonsering', 'advertise')}{button('Kravspecifikation & schema', 'architecture')}</div> : <div className="space-y-3"><p>Hubbansvarigs arbetsyta. Välj aktuell hubb i sidhuvudet. Genvägarna ger inte nya administrativa behörigheter.</p>{button('Arbetsplatser & bokningar', 'coworking')}{button('Hubbkalender', 'calendar')}{button('Event', 'events')}{button('Hubbens community', 'community')}</div>}
  </section>;
}
const steps = [
  { title: 'Välkommen till Booster Friends', text: 'Här hittar du arbetsplatser, människor och aktiviteter. Guiden är frivillig och kan startas igen i Inställningar.', tab: 'overview', action: 'Visa startsidan' },
  { title: 'Boka en arbetsplats', text: 'Välj hubb i sidhuvudet och öppna bokningar för att hitta en arbetsplats.', tab: 'coworking', action: 'Visa bokningar' },
  { title: 'Bygg ditt nätverk', text: 'Hitta medlemmar, se matchningar och fortsätt samtalet i Meddelanden.', tab: 'directory', action: 'Visa medlemmar' },
  { title: 'Gör sidan till din', text: 'I Inställningar väljer du bento eller modulär startsida, sido- eller topmeny och minskad rörelse.', tab: 'settings', action: 'Visa inställningar' }
];
export function WelcomeGuide({ onClose, onNavigate }: { onClose: () => void; onNavigate: (tab: string) => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const closeRef = React.useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('#welcome-guide button'));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handler); previous?.focus(); };
  }, [onClose]);
  return <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"><section id="welcome-guide" role="dialog" aria-modal="true" aria-labelledby="guide-title" aria-describedby="guide-description" className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-5">
    <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Steg {step + 1} av {steps.length}</p><button ref={closeRef} onClick={onClose} className="p-3 underline">Hoppa över</button></div>
    <h2 id="guide-title" className="text-2xl font-bold">{current.title}</h2><p id="guide-description">{current.text}</p>
    <button className="p-3 border rounded-lg" onClick={() => { onNavigate(current.tab); onClose(); }}>{current.action} →</button>
    <div className="flex justify-between"><button disabled={step === 0} onClick={() => setStep(step - 1)} className="p-3 disabled:opacity-40">Tillbaka</button><button onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)} className="bg-[#800020] text-white px-5 py-3 rounded-lg">{step === steps.length - 1 ? 'Kom igång' : 'Nästa'}</button></div>
  </section></div>;
}
