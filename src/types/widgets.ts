import React from 'react';
import { 
  Member, 
  Hub, 
  CoworkingDeskBooking, 
  DealPipelineItem, 
  WebMeeting, 
  BoosterScoreLog, 
  GuestPass, 
  MasterCalendarEvent 
} from '../types';

export type WidgetCategory = 'CORE' | 'HUB' | 'COMMUNITY' | 'ACADEMY' | 'ADMIN';
export type WidgetWidth = 'span-1' | 'span-2' | 'span-full';

export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  category: WidgetCategory;
  adminOnly: boolean;
  defaultWidth: WidgetWidth;
  iconName: string;
}

export interface UserWidgetPreference {
  user_id: string;
  active_widget_ids: string[];
  widget_order?: string[];
  updated_at?: string;
}

export interface HubDesk {
  id: string;
  hub_id: string;
  desk_number: string;
  desk_type: 'FLEX' | 'FIX' | 'QUIET' | 'STAND';
  is_active: boolean;
}

export interface HubPresenceMember {
  booking_id: string;
  member_id: string;
  full_name: string;
  company_name: string;
  role_title: string;
  avatar_url?: string;
  membership_level: string;
  check_in_time: string;
  slot_type: 'FULL_DAY' | 'AM' | 'PM';
  desk_label?: string;
}

export interface AdminDashboardKpis {
  total_members: number;
  new_members_this_month: number;
  active_trials: number;
  prospects_count?: number;
  mrr_sek: number;
  unpaid_invoices_count: number;
  unpaid_invoices_total_sek: number;
  overdue_invoices_count?: number;
  total_deals_closed_sek: number;
  active_pipeline_deals_count: number;
  won_deals_count?: number;
  hub_occupancy_percent: number;
  today_hub_bookings?: number;
  checked_in_now?: number;
  maintenance_mode?: boolean;
  updated_at: string;
}

export type AdminKpiData = AdminDashboardKpis;
export type MaintenanceSettings = SystemSettings;

export interface SystemSettings {
  id?: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  estimated_maintenance_end?: string | null;
  updated_at?: string;
  updated_by?: string | null;
}

export interface WidgetComponentProps {
  currentUser: Member;
  allMembers?: Member[];
  hubs?: Hub[];
  selectedHub?: Hub;
  onNavigateTab?: (tab: string) => void;
  onOpenDirectChat?: (memberId: string) => void;
  onAwardPoints?: (points: number, reason: string, activityType: string) => void;
  pipelineItems?: DealPipelineItem[];
  webMeetings?: WebMeeting[];
  onOpenWebMeetingModal?: (targetMember?: Member | null, initialType?: 'ONE_TO_ONE' | 'GROUP') => void;
  onStartIntroWith?: (member: Member) => void;
  scoreLogs?: BoosterScoreLog[];
  guestPasses?: GuestPass[];
  masterEvents?: MasterCalendarEvent[];
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  mini_widgets_bar: {
    id: 'mini_widgets_bar',
    title: 'Snabb-Puckar & Status (Mini Widgets 1x1)',
    description: 'Kompakta 1x1 snabbpuckar för BP-saldo, Fika/Lunch-status toggle, vCard QR och Hubb-närvaro.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-full',
    iconName: 'LayoutGrid',
  },
  booster_score: {
    id: 'booster_score',
    title: 'Booster Score & Medlemskort',
    description: 'Ditt digitala medlemskort, statusnivå, aktuellt poängsaldo och måluppfyllelse.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Award',
  },
  vcard_qr: {
    id: 'vcard_qr',
    title: 'Digitalt Visitkort (vCard QR)',
    description: 'Direkt QR-kod för smart connect och mobil kontaktbokinläsning.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'QrCode',
  },
  activity_ticker: {
    id: 'activity_ticker',
    title: 'Aktivitetsflöde & Händelser',
    description: 'Rullande live-ticker med nya medlemmar, affärer och händelser i nätverket.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-full',
    iconName: 'Activity',
  },
  proximity_radar: {
    id: 'proximity_radar',
    title: 'Närhetsradar (Fika & Lunch)',
    description: 'Realtidsöversikt över anslutna medlemmar i närheten redo för spontanmöten.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Radar',
  },
  hub_presence: {
    id: 'hub_presence',
    title: 'Vem är i hubben idag?',
    description: 'Lista på incheckade och bokade medlemmar med roller och avatarer i vald hubb.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Building2',
  },
  flex_booking: {
    id: 'flex_booking',
    title: 'Snabbokning Flexplats',
    description: 'Se tillgängliga flexbord idag och boka/checka in med ett klick.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'CalendarCheck',
  },
  my_meetings: {
    id: 'my_meetings',
    title: 'Mina Webbmöten (1-1 & Grupp)',
    description: 'Kommande digitala möten, anslutningslänk (Meet/Teams) och snabbokning (+20 BP).',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Video',
  },
  ai_matchmaking: {
    id: 'ai_matchmaking',
    title: 'AI Lead Match Spotlight',
    description: 'Intelligenta affärs- och sparringsförslag med synergipoäng och direkt introduktionsutkast.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Sparkles',
  },
  member_pipeline: {
    id: 'member_pipeline',
    title: 'Min Affärspipeline (CRM)',
    description: 'Dina personliga pågående B2B-affärer, potentiellt ordervärde och säljsteg.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'TrendingUp',
  },
  calendar_upcoming: {
    id: 'calendar_upcoming',
    title: 'Min Kalender & Hubbmöten',
    description: 'Kommande nätverksfrukostar, workshops, utbildningar och regionala träffar.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Calendar',
  },
  guest_pass: {
    id: 'guest_pass',
    title: 'VIP Gästpass & Bjud in',
    description: 'Dela ut digitala provpass till kollegor, kunder och partners (+bonus vid konvertering).',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Gift',
  },
  webinar: {
    id: 'webinar',
    title: 'Live Webinar Engine',
    description: 'Kommande live-sändningar, expertseminarier och inspelade masterclasses.',
    category: 'ACADEMY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Tv',
  },
  bp_ledger: {
    id: 'bp_ledger',
    title: 'Booster Points Revisionslogg',
    description: 'Senaste verifierade BP-transaktioner, aktiviteter och audit-historik.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'History',
  },
  network_recommendations: {
    id: 'network_recommendations',
    title: 'Nätverksrekommendationer',
    description: 'Nya relevanta medlemmar i nätverket att knyta kontakt och ta en kaffe med.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'UserPlus',
  },
  hub_battle: {
    id: 'hub_battle',
    title: 'Månadens Hubb Battle',
    description: 'Regional tävling och sammanlagd poängranking mellan Stockholm, Göteborg och Malmö.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Trophy',
  },
  geofencing: {
    id: 'geofencing',
    title: 'Geo-fencing Radar & Incheckning',
    description: 'Automatisk GPS-närvarokontroll inom vald hubbs radie och 1-klicks incheckning.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'ShieldCheck',
  },
  knowledge_quiz: {
    id: 'knowledge_quiz',
    title: 'Kunskapsprov & Veckans Quiz',
    description: 'Utmana dig i affärsjuridik, B2B-försäljning eller cybersäkerhet för att erhålla badges (+50 BP).',
    category: 'ACADEMY',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'GraduationCap',
  },
  community_feed: {
    id: 'community_feed',
    title: 'Community & Diskussioner',
    description: 'Snabböversikt över de senaste foruminläggen, samarbetena och diskussionerna.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'MessageSquare',
  },
  academy_progress: {
    id: 'academy_progress',
    title: 'Akademi & Kompetenslyft',
    description: 'Dina pågående kurser, certifieringar och nästa modul i Booster Academy.',
    category: 'ACADEMY',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'GraduationCap',
  },
  notifications_inbox: {
    id: 'notifications_inbox',
    title: 'Aviseringar & Inkorg',
    description: 'Personliga notiser för taggbevakningar, direktmeddelanden och utskick.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Bell',
  },
  tag_subscriptions: {
    id: 'tag_subscriptions',
    title: 'Mina Bevakningar (Taggar & Ämnen)',
    description: 'Snabbväljare för att slå av och på bevakning på branscher och expertiser.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Tag',
  },
  // ADMIN-ENDAST WIDGETS
  admin_kpi_overview: {
    id: 'admin_kpi_overview',
    title: 'Admin: Samlade KPI:er',
    description: 'Realtidsnyckeltal: Medlemmar, aktiva trials, MRR, oreglerade fakturor och nätverksomsättning.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-full',
    iconName: 'BarChart3',
  },
  admin_deals_pipeline: {
    id: 'admin_deals_pipeline',
    title: 'Admin: Nätverkets B2B-affärer',
    description: 'Pipeline över genererade affärer och förmedlade leads mellan medlemmar.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-2',
    iconName: 'TrendingUp',
  },
  admin_invoices: {
    id: 'admin_invoices',
    title: 'Admin: Faktura- & Betalstatus',
    description: 'Översikt över förfallna, obetalda och reglerade medlemsfakturor med statuspiller.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-2',
    iconName: 'Receipt',
  },
  admin_broadcast_sender: {
    id: 'admin_broadcast_sender',
    title: 'Admin: Skicka Broadcast',
    description: 'Skicka snabba meddelanden till All, Prospects eller Members via in-app & e-post.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-2',
    iconName: 'Send',
  },
  admin_account_lifecycle: {
    id: 'admin_account_lifecycle',
    title: 'Admin: Kontolivscykel & Roller',
    description: 'Snabbsök, frys, återaktivera, gör till prospect eller hantera konton.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-2',
    iconName: 'Users',
  },
  admin_maintenance_toggle: {
    id: 'admin_maintenance_toggle',
    title: 'Admin: Underhållsläge (Maintenance Mode)',
    description: 'Aktivera driftläge för vanliga användare och konfigurera informationsmeddelande.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-1',
    iconName: 'AlertOctagon',
  },

  // Alias-mappningar för 100% kompatibilitet mellan Bento och Modulär Dashboard
  system_ticker_widget: {
    id: 'system_ticker_widget',
    title: 'Live Ticker (Realtidsnotiser & Nyheter)',
    description: 'Rullande realtidsnotiser, kaffeping-aktivitet och systemmeddelanden.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-full',
    iconName: 'Activity',
  },
  profile_gamification: {
    id: 'profile_gamification',
    title: 'Profil & Booster Score',
    description: 'Ditt digitala medlemskort, statusnivå, aktuellt poängsaldo och måluppfyllelse.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'Award',
  },
  coworking_booking: {
    id: 'coworking_booking',
    title: 'Mina Bokningar & Snabbokning Flexplats',
    description: 'Se tillgängliga flexbord idag och boka/checka in med ett klick.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'CalendarCheck',
  },
  bp_ledger_widget: {
    id: 'bp_ledger_widget',
    title: 'Booster Points Revisionslogg',
    description: 'Senaste verifierade BP-transaktioner, aktiviteter och audit-historik.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'History',
  },
  academy_certs: {
    id: 'academy_certs',
    title: 'Akademi & Kompetenslyft',
    description: 'Dina pågående kurser, certifieringar och diplom i Booster Academy.',
    category: 'ACADEMY',
    adminOnly: false,
    defaultWidth: 'span-1',
    iconName: 'GraduationCap',
  },
  coffee_ping_radar: {
    id: 'coffee_ping_radar',
    title: 'Närhetsradar (Fika & Lunch)',
    description: 'Realtidsöversikt över anslutna medlemmar i närheten redo för spontanmöten.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Radar',
  },
  matchmaking: {
    id: 'matchmaking',
    title: 'AI Lead Match Spotlight',
    description: 'Intelligenta affärs- och sparringsförslag med synergipoäng och direkt introduktionsutkast.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Sparkles',
  },
  pipeline: {
    id: 'pipeline',
    title: 'Min Affärspipeline (CRM)',
    description: 'Dina personliga pågående B2B-affärer, potentiellt ordervärde och säljsteg.',
    category: 'CORE',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'TrendingUp',
  },
  who_is_at_hub: {
    id: 'who_is_at_hub',
    title: 'Vem är i hubben idag?',
    description: 'Lista på incheckade och bokade medlemmar med roller och avatarer i vald hubb.',
    category: 'HUB',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'Building2',
  },
  forum_activity: {
    id: 'forum_activity',
    title: 'Community & Diskussioner',
    description: 'Snabböversikt över de senaste foruminläggen, samarbetena och diskussionerna.',
    category: 'COMMUNITY',
    adminOnly: false,
    defaultWidth: 'span-2',
    iconName: 'MessageSquare',
  },
  kpi_overview: {
    id: 'kpi_overview',
    title: 'Admin: Samlade KPI:er',
    description: 'Realtidsnyckeltal: Medlemmar, aktiva trials, MRR, oreglerade fakturor och nätverksomsättning.',
    category: 'ADMIN',
    adminOnly: true,
    defaultWidth: 'span-full',
    iconName: 'BarChart3',
  },
};

export const DEFAULT_USER_WIDGET_IDS = [
  'mini_widgets_bar',
  'activity_ticker',
  'booster_score',
  'my_meetings',
  'ai_matchmaking',
  'member_pipeline',
  'vcard_qr',
  'flex_booking',
  'hub_presence',
  'proximity_radar',
  'calendar_upcoming',
  'community_feed',
  'academy_progress',
  'guest_pass',
  'notifications_inbox',
  'tag_subscriptions',
];

export const DEFAULT_ADMIN_WIDGET_IDS = [
  'mini_widgets_bar',
  'admin_kpi_overview',
  'admin_maintenance_toggle',
  'admin_broadcast_sender',
  'admin_deals_pipeline',
  'admin_invoices',
  'admin_account_lifecycle',
  'my_meetings',
  'member_pipeline',
  'activity_ticker',
  'booster_score',
  'hub_presence',
  'flex_booking',
];
