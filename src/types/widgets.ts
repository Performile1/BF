import React from 'react';
import { Member, Hub, CoworkingDeskBooking } from '../types';

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
  mrr_sek: number;
  unpaid_invoices_count: number;
  unpaid_invoices_total_sek: number;
  total_deals_closed_sek: number;
  active_pipeline_deals_count: number;
  hub_occupancy_percent: number;
  updated_at: string;
}

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
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
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
};

export const DEFAULT_USER_WIDGET_IDS = [
  'activity_ticker',
  'booster_score',
  'vcard_qr',
  'flex_booking',
  'hub_presence',
  'proximity_radar',
  'community_feed',
  'academy_progress',
  'notifications_inbox',
  'tag_subscriptions',
];

export const DEFAULT_ADMIN_WIDGET_IDS = [
  'admin_kpi_overview',
  'admin_maintenance_toggle',
  'admin_broadcast_sender',
  'admin_deals_pipeline',
  'admin_invoices',
  'admin_account_lifecycle',
  'activity_ticker',
  'booster_score',
  'hub_presence',
  'flex_booking',
];
