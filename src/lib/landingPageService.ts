export interface StartPageOption {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
}

export const AVAILABLE_START_PAGES: StartPageOption[] = [
  {
    id: 'overview',
    title: 'Bento Översikt',
    category: 'Hem',
    description: 'Modern visuell dashboard med hero-kort, radar & nyckeltal',
    iconName: 'Home'
  },
  {
    id: 'dashboard_widgets',
    title: 'Modulär Dashboard',
    category: 'Hem',
    description: 'Strukturerat 1–4 kolumners widget-grid för power users',
    iconName: 'Sliders'
  },
  {
    id: 'community',
    title: 'Community & Forum',
    category: 'Community',
    description: 'Diskussioner, samtal, nätverksflöde och medlemsfrågor',
    iconName: 'Users'
  },
  {
    id: 'academy',
    title: 'Akademin & Utbildningspartners',
    category: 'Akademi',
    description: 'Kurser, edX/Coursera-partnerskap och certifieringar',
    iconName: 'GraduationCap'
  },
  {
    id: 'coworking',
    title: 'Boka Flexplats & Hubbar',
    category: 'Hubben',
    description: 'Skrivbordsbokning, tysta rum och hubbaccess i realtid',
    iconName: 'Building2'
  },
  {
    id: 'pipeline',
    title: 'My Pipeline (CRM)',
    category: 'Affärer',
    description: 'Dina pågående B2B-affärer och försäljningsstadier',
    iconName: 'TrendingUp'
  },
  {
    id: 'calendar',
    title: 'Kalender & Träffar',
    category: 'Event',
    description: 'Månadskalender, nätverksfrukostar och workshops',
    iconName: 'CalendarDays'
  },
  {
    id: 'webinars',
    title: 'Live Webinars Engine',
    category: 'Akademi',
    description: 'Kommande streams, masterclasses och live-sändningar',
    iconName: 'Video'
  }
];

const STORAGE_KEY = 'bf_user_landing_page';

export function getPreferredStartPage(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && AVAILABLE_START_PAGES.some(p => p.id === saved)) {
      return saved;
    }
  } catch {}
  return 'overview';
}

export function setPreferredStartPage(pageId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, pageId);
    window.dispatchEvent(new CustomEvent('bf_start_page_changed', { detail: pageId }));
  } catch {}
}
