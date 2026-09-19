import React, { useState, useEffect } from 'react';
import {
  GripVertical,
  Plus,
  RotateCcw,
  X,
  ArrowUp,
  ArrowDown,
  Trophy,
  Sparkles,
  Gift,
  Building2,
  Calendar,
  MessageSquare,
  GraduationCap,
  History,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Coffee,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Video,
  Users,
  Copy,
  Check,
  BarChart3,
  Clock,
  Link as LinkIcon,
  AlertTriangle,
  UserCheck,
  MessageCircle,
  UserPlus,
  Maximize2,
  Minimize2,
  Columns,
  Save,
  Sliders
} from 'lucide-react';
import { 
  Member, 
  Hub, 
  BoosterScoreLog, 
  CoworkingDeskBooking, 
  DeskSwap, 
  FreeTrialPass,
  MasterCalendarEvent,
  WebMeeting,
  WidgetSize,
  WidgetCategoryGroup,
  DashboardColumnsCount,
  DashboardGridGap,
  DashboardGridLayout,
  SavedWidgetLayoutItem,
  UserDashboardLayout
} from '../../types';
import { AdBannerEngine } from '../ads/AdBannerEngine';
import { formatSek } from '../../utils/calendar';
import { INITIAL_WEB_MEETINGS } from '../../data/calendarAndCoworkingData';
import { INITIAL_COMMUNITY_POSTS } from '../../data/communityAndMatchmakingData';
import { CoffeePingWidget } from '../networking/CoffeePingWidget';
import { SystemTickerWidget } from './SystemTickerWidget';
import { INITIAL_TICKER_EVENTS } from '../../data/tickerData';
import {
  MiniWidgetContainer,
  MiniBpCounterWidget,
  MiniCoffeeToggleWidget,
  MiniQuickQrWidget,
  MiniHubAttendanceWidget
} from './MiniWidgets';

export interface WidgetDefinition {
  id: string;
  title: string;
  category: WidgetCategoryGroup;
  defaultSpan: string; // e.g. 'col-span-12 md:col-span-6'
  defaultSize: WidgetSize;
  defaultColSpan: number; // 1, 2, 3, 4 (desktop columns)
  defaultRowSpan: number; // 1 (standard) or 2 (extended)
  description: string;
}

export const ALL_AVAILABLE_WIDGETS: WidgetDefinition[] = [
  // ==================== LIVE NOTISER & MINI WIDGETS ====================
  {
    id: 'system_ticker_widget',
    title: 'Live Ticker (Realtidsnotiser & Nyhetsflöde)',
    category: 'community',
    defaultSpan: 'col-span-12',
    defaultSize: 'WIDE',
    defaultColSpan: 4,
    defaultRowSpan: 1,
    description: 'Rullande realtidsnotiser, kaffeping-aktivitet och systemmeddelanden med pause-on-hover och djuplänkar.'
  },
  {
    id: 'mini_widgets_bar',
    title: 'Snabb-Puckar & Status (Mini Widgets 1x1)',
    category: 'mitt',
    defaultSpan: 'col-span-12',
    defaultSize: 'WIDE',
    defaultColSpan: 4,
    defaultRowSpan: 1,
    description: 'Kompakta 1x1 sub-widgets för BP-saldo, Kaffe/Lunch-toggle, vCard QR och Hubb-närvaro.'
  },

  // ==================== MITT ====================
  {
    id: 'profile_gamification',
    title: 'Profil & Booster Score',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-4',
    defaultSize: 'SMALL',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Ditt Booster Score, ranking, skillbars och aktiv utmaning'
  },
  {
    id: 'my_meetings',
    title: 'Mina Webbmöten (1-1 & Grupp)',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Kommande digitala möten, anslutningslänkar och boka nytt webbmöte (+20 BP)'
  },
  {
    id: 'coworking_booking',
    title: 'Mina Bokningar & Desk Swap',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Dina skrivbordsbokningar, flexpass och tillgängliga desk swaps'
  },
  {
    id: 'bp_ledger_widget',
    title: 'Booster Points Ledger',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Senaste verifierade BP-transaktioner och audit trail'
  },
  {
    id: 'academy_certs',
    title: 'Badges & Executive Certifikat',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Dina avklarade certifieringar, QR-verifiering och mentorsparring'
  },
  {
    id: 'calendar_upcoming',
    title: 'Min Kalender & Hubbmöten',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Nätverksfrukostar, workshops och regionala träffar'
  },
  {
    id: 'knowledge_quiz',
    title: 'Kunskapsprov & Quiz',
    category: 'mitt',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Certifieringar, quiz och kunskapsbadgar (+BP)'
  },

  // ==================== NÄTVERK ====================
  {
    id: 'coffee_ping_radar',
    title: 'Proximity Ping (Kaffe & Lunch-Radar)',
    category: 'natverk',
    defaultSpan: 'col-span-12 md:col-span-8',
    defaultSize: 'LARGE',
    defaultColSpan: 2,
    defaultRowSpan: 1,
    description: 'Integritetssäker radar på zonnivå. Se vem som är öppen för kaffe/lunch på samma ort och bjud med 1 klick.'
  },
  {
    id: 'matchmaking',
    title: 'AI Lead Match Spotlight',
    category: 'natverk',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'AI-genererad affärsmatchning baserad på din profil'
  },
  {
    id: 'network_recommendations',
    title: 'Nätverksrekommendationer & Nya Medlemmar',
    category: 'natverk',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Rekommenderade sparringpartners baserat på kompletterande bransch och kompetens'
  },
  {
    id: 'pipeline',
    title: 'My Booster Pipeline (CRM)',
    category: 'natverk',
    defaultSpan: 'col-span-12 md:col-span-8',
    defaultSize: 'LARGE',
    defaultColSpan: 2,
    defaultRowSpan: 1,
    description: 'Genererade affärer, potentiellt värde och CRM-översikt'
  },

  // ==================== HUB ====================
  {
    id: 'who_is_at_hub',
    title: 'Vem är på Hubben Idag (Who is at Hub Today)',
    category: 'hub',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Se vilka medlemmar som är incheckade på hubben just nu och bjud på kaffe'
  },
  {
    id: 'geofencing',
    title: 'Geo-fencing Radar & Incheckning',
    category: 'hub',
    defaultSpan: 'col-span-12 md:col-span-4',
    defaultSize: 'SMALL',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Automatisk närvarokontroll inom hubbens GPS-radie'
  },
  {
    id: 'hub_battle',
    title: 'Månadens Hubb Battle',
    category: 'hub',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Regional topplista och sammanlagda poäng per medlem'
  },

  // ==================== COMMUNITY ====================
  {
    id: 'forum_activity',
    title: 'Senaste Forumaktivitet & Diskussioner',
    category: 'community',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Aktuella ämnen, obesvarade frågor och heta diskussioner'
  },
  {
    id: 'webinar',
    title: 'Live Webinar Engine',
    category: 'community',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 1,
    defaultRowSpan: 1,
    description: 'Kommande live stream med Q&A och direktlänk'
  },
  {
    id: 'guest_pass',
    title: 'VIP Gästpass & Förmåner',
    category: 'community',
    defaultSpan: 'col-span-12 md:col-span-6',
    defaultSize: 'MEDIUM',
    defaultColSpan: 2,
    defaultRowSpan: 1,
    description: 'Dela ut provpass och lås upp partnerförmåner'
  },

  // ==================== KPI ====================
  {
    id: 'kpi_overview',
    title: 'Övergripande KPI: Medlem, Event, Hub & Pipeline',
    category: 'kpi',
    defaultSpan: 'col-span-12',
    defaultSize: 'WIDE',
    defaultColSpan: 4,
    defaultRowSpan: 1,
    description: 'Central sammanställning av dina nyckeltal och plattformens aktivitet'
  }
];

export const DEFAULT_WIDGET_ORDER = [
  'system_ticker_widget',
  'mini_widgets_bar',
  'profile_gamification',
  'coffee_ping_radar',
  'my_meetings',
  'pipeline',
  'who_is_at_hub',
  'matchmaking',
  'geofencing',
  'forum_activity',
  'guest_pass'
];

export const SIZE_TO_CLASS: Record<WidgetSize, string> = {
  SMALL: 'col-span-12 md:col-span-4',
  MEDIUM: 'col-span-12 md:col-span-6',
  LARGE: 'col-span-12 md:col-span-8',
  WIDE: 'col-span-12'
};

interface CustomizableBentoDashboardProps {
  currentUser: Member;
  hubs: Hub[];
  selectedHub: Hub;
  pipelineItems: any[];
  members: Member[];
  scoreLogs: BoosterScoreLog[];
  coworkingBookings?: CoworkingDeskBooking[];
  deskSwaps?: DeskSwap[];
  trialPasses?: FreeTrialPass[];
  webMeetings?: WebMeeting[];
  onNavigateTab: (tab: string) => void;
  onOpenDirectChat: (memberId: string) => void;
  onStartIntroWith: (memberId: string) => void;
  onAwardPoints: (points: number, reason: string) => void;
  onCheckInGeoOrQr?: () => void;
  onOpenWebMeetingModal?: (targetMember?: Member | null, initialType?: 'ONE_TO_ONE' | 'GROUP') => void;
  memberLocations?: import('../../types').MemberActiveLocation[];
  proximityPings?: import('../../types').ProximityPing[];
  tickerEvents?: import('../../types').SystemActivityTickerEvent[];
  onSendPing?: (ping: {
    receiver_id: string;
    receiver_name: string;
    ping_type: 'COFFEE' | 'LUNCH';
    suggested_location: string;
    custom_message?: string;
  }) => void;
  onRespondPing?: (pingId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  onUpdateLocationStatus?: (status: Partial<import('../../types').MemberActiveLocation>) => void;
  onOpenLocationPingModal?: () => void;
}

export const CustomizableBentoDashboard: React.FC<CustomizableBentoDashboardProps> = ({
  currentUser,
  hubs,
  selectedHub,
  pipelineItems,
  members,
  scoreLogs,
  coworkingBookings = [],
  deskSwaps = [],
  trialPasses = [],
  webMeetings = INITIAL_WEB_MEETINGS as any,
  onNavigateTab,
  onOpenDirectChat,
  onStartIntroWith,
  onAwardPoints,
  onCheckInGeoOrQr,
  onOpenWebMeetingModal,
  memberLocations = [],
  proximityPings = [],
  tickerEvents = INITIAL_TICKER_EVENTS,
  onSendPing,
  onRespondPing,
  onUpdateLocationStatus,
  onOpenLocationPingModal
}) => {
  // Dashboard Grid configuration (Punkt 29 & 30)
  const [gridLayout, setGridLayout] = useState<DashboardGridLayout>(() => {
    try {
      const userKey = `booster_bento_saved_layout_${currentUser.id}`;
      const saved = localStorage.getItem(userKey) || localStorage.getItem('booster_bento_saved_layout');
      if (saved) {
        const parsed = JSON.parse(saved) as UserDashboardLayout;
        if (parsed?.gridLayout?.columnsCount) {
          return {
            columnsCount: parsed.gridLayout.columnsCount,
            gap: parsed.gridLayout.gap || '16px'
          };
        }
      }
    } catch {
      // fallback
    }
    return { columnsCount: 4, gap: '16px' };
  });

  // Widget dimensions (colSpan and rowSpan) (Punkt 29 & 33)
  const [widgetDimensions, setWidgetDimensions] = useState<Record<string, { colSpan: number; rowSpan: number }>>(() => {
    try {
      const userKey = `booster_bento_saved_layout_${currentUser.id}`;
      const saved = localStorage.getItem(userKey) || localStorage.getItem('booster_bento_saved_layout');
      if (saved) {
        const parsed = JSON.parse(saved) as UserDashboardLayout;
        if (parsed?.widgets && Array.isArray(parsed.widgets) && parsed.widgets.length > 0) {
          const map: Record<string, { colSpan: number; rowSpan: number }> = {};
          parsed.widgets.forEach(w => {
            map[w.widgetId] = {
              colSpan: w.colSpan || 1,
              rowSpan: w.rowSpan || 1
            };
          });
          return map;
        }
      }
    } catch {
      // fallback
    }
    const initial: Record<string, { colSpan: number; rowSpan: number }> = {};
    ALL_AVAILABLE_WIDGETS.forEach(w => {
      initial[w.id] = {
        colSpan: w.defaultColSpan || 1,
        rowSpan: w.defaultRowSpan || 1
      };
    });
    return initial;
  });

  // Widget ordering state persisted in localStorage
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    try {
      const userKey = `booster_bento_saved_layout_${currentUser.id}`;
      const saved = localStorage.getItem(userKey) || localStorage.getItem('booster_bento_saved_layout');
      if (saved) {
        const parsed = JSON.parse(saved) as UserDashboardLayout;
        if (parsed?.widgets && Array.isArray(parsed.widgets) && parsed.widgets.length > 0) {
          return parsed.widgets.filter(w => w.isVisible !== false).sort((a, b) => a.order - b.order).map(w => w.widgetId);
        }
      }
      const legacy = localStorage.getItem('booster_bento_active_widgets');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_WIDGET_ORDER;
  });

  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [dragOverWidgetId, setDragOverWidgetId] = useState<string | null>(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string>('ALL');
  const [customizingMode, setCustomizingMode] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

  // Auto-save layout data model to localStorage (Punkt 33)
  useEffect(() => {
    try {
      const userKey = `booster_bento_saved_layout_${currentUser.id}`;
      const layoutData: UserDashboardLayout = {
        userId: currentUser.id,
        gridLayout: gridLayout,
        widgets: activeWidgets.map((widgetId, index) => {
          const dim = widgetDimensions[widgetId] || { colSpan: 1, rowSpan: 1 };
          return {
            widgetId,
            order: index + 1,
            colSpan: dim.colSpan,
            rowSpan: dim.rowSpan,
            isVisible: true
          };
        })
      };
      const serialized = JSON.stringify(layoutData);
      localStorage.setItem(userKey, serialized);
      localStorage.setItem('booster_bento_saved_layout', serialized);
      localStorage.setItem('booster_bento_active_widgets', JSON.stringify(activeWidgets));
    } catch {
      // ignore
    }
  }, [activeWidgets, gridLayout, widgetDimensions, currentUser.id]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleManualSaveLayout = () => {
    try {
      const userKey = `booster_bento_saved_layout_${currentUser.id}`;
      const layoutData: UserDashboardLayout = {
        userId: currentUser.id,
        gridLayout: gridLayout,
        widgets: activeWidgets.map((widgetId, index) => {
          const dim = widgetDimensions[widgetId] || { colSpan: 1, rowSpan: 1 };
          return {
            widgetId,
            order: index + 1,
            colSpan: dim.colSpan,
            rowSpan: dim.rowSpan,
            isVisible: true
          };
        })
      };
      const serialized = JSON.stringify(layoutData);
      localStorage.setItem(userKey, serialized);
      localStorage.setItem('booster_bento_saved_layout', serialized);
      localStorage.setItem('booster_bento_active_widgets', JSON.stringify(activeWidgets));
      showToast(`✓ Dashboard-layout sparad! (${gridLayout.columnsCount} kolumner, ${gridLayout.gap} gap)`);
    } catch {
      showToast('Ett fel uppstod när layouten skulle sparas.');
    }
  };

  // Card resizing handlers (Col-Span & Row-Span) (Punkt 29 & 30)
  const handleColSpanChange = (widgetId: string, delta: number) => {
    setWidgetDimensions(prev => {
      const current = prev[widgetId] || { colSpan: 1, rowSpan: 1 };
      const maxCols = gridLayout.columnsCount;
      const nextCol = Math.max(1, Math.min(maxCols, current.colSpan + delta));
      return {
        ...prev,
        [widgetId]: { ...current, colSpan: nextCol }
      };
    });
    showToast('✓ Kortbredd uppdaterad');
  };

  const handleRowSpanChange = (widgetId: string, delta: number) => {
    setWidgetDimensions(prev => {
      const current = prev[widgetId] || { colSpan: 1, rowSpan: 1 };
      const nextRow = Math.max(1, Math.min(2, current.rowSpan + delta));
      return {
        ...prev,
        [widgetId]: { ...current, rowSpan: nextRow }
      };
    });
    showToast('✓ Korthöjd uppdaterad');
  };

  const handleSetColSpan = (widgetId: string, colSpan: number) => {
    setWidgetDimensions(prev => {
      const current = prev[widgetId] || { colSpan: 1, rowSpan: 1 };
      return {
        ...prev,
        [widgetId]: {
          ...current,
          colSpan: Math.max(1, Math.min(gridLayout.columnsCount, colSpan))
        }
      };
    });
    showToast(`✓ Bredd satt till ${colSpan} kolumn${colSpan > 1 ? 'er' : ''}`);
  };

  const handleToggleRowSpan = (widgetId: string) => {
    setWidgetDimensions(prev => {
      const current = prev[widgetId] || { colSpan: 1, rowSpan: 1 };
      const nextRow = current.rowSpan === 1 ? 2 : 1;
      return {
        ...prev,
        [widgetId]: { ...current, rowSpan: nextRow }
      };
    });
    showToast('✓ Korthöjd växlad');
  };

  const handleSetColumnsCount = (cols: DashboardColumnsCount) => {
    setGridLayout(prev => ({ ...prev, columnsCount: cols }));
    showToast(`✓ Desktop-grid ändrat till ${cols} kolumner`);
  };

  const handleSetGridGap = (gap: DashboardGridGap) => {
    setGridLayout(prev => ({ ...prev, gap }));
    showToast(`✓ Grid-avstånd ändrat till ${gap}`);
  };

  const handleCopyMeetingLink = (id: string, link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedMeetingId(id);
    showToast('✓ Möteslänk kopierad till urklipp!');
    setTimeout(() => setCopiedMeetingId(null), 2000);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedWidgetId !== id) {
      setDragOverWidgetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidgetId || draggedWidgetId === targetId) {
      setDraggedWidgetId(null);
      setDragOverWidgetId(null);
      return;
    }

    const newOrder = [...activeWidgets];
    const sourceIndex = newOrder.indexOf(draggedWidgetId);
    const targetIndex = newOrder.indexOf(targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, draggedWidgetId);
      setActiveWidgets(newOrder);
      showToast('✓ Dashboard-layout uppdaterad!');
    }

    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
    setDragOverWidgetId(null);
  };

  // Move up / down (mobile & accessibility friendly)
  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const idx = activeWidgets.indexOf(id);
    if (idx === -1) return;
    const newOrder = [...activeWidgets];
    if (direction === 'up' && idx > 0) {
      const temp = newOrder[idx - 1];
      newOrder[idx - 1] = newOrder[idx];
      newOrder[idx] = temp;
      setActiveWidgets(newOrder);
    } else if (direction === 'down' && idx < newOrder.length - 1) {
      const temp = newOrder[idx + 1];
      newOrder[idx + 1] = newOrder[idx];
      newOrder[idx] = temp;
      setActiveWidgets(newOrder);
    }
  };

  const removeWidget = (id: string) => {
    if (activeWidgets.length <= 1) {
      alert('Du måste ha minst en widget på din dashboard.');
      return;
    }
    setActiveWidgets(prev => prev.filter(w => w !== id));
    showToast('Widget borttagen från dashboard.');
  };

  const addWidget = (id: string) => {
    if (!activeWidgets.includes(id)) {
      setActiveWidgets(prev => [...prev, id]);
      showToast('✓ Widget tillagd på din dashboard!');
    }
    setShowWidgetPicker(false);
  };

  const resetToDefault = () => {
    setActiveWidgets(DEFAULT_WIDGET_ORDER);
    setGridLayout({ columnsCount: 4, gap: '16px' });
    const initialDims: Record<string, { colSpan: number; rowSpan: number }> = {};
    ALL_AVAILABLE_WIDGETS.forEach(w => {
      initialDims[w.id] = {
        colSpan: w.defaultColSpan || 1,
        rowSpan: w.defaultRowSpan || 1
      };
    });
    setWidgetDimensions(initialDims);
    setShowResetConfirm(false);
    showToast('✓ Dashboard återställd till standardvy (4 kolumner, 16px gap)!');
  };

  const getGridColsClass = () => {
    if (gridLayout.columnsCount === 2) return 'lg:grid-cols-2';
    if (gridLayout.columnsCount === 3) return 'lg:grid-cols-3';
    return 'lg:grid-cols-4';
  };

  const getGridGapClass = () => {
    if (gridLayout.gap === '12px') return 'gap-3';
    if (gridLayout.gap === '24px') return 'gap-6';
    return 'gap-4';
  };

  const getCardSpanClasses = (widgetId: string) => {
    const dim = widgetDimensions[widgetId] || { colSpan: 1, rowSpan: 1 };
    const colSpan = Math.max(1, Math.min(dim.colSpan, gridLayout.columnsCount));
    const rowSpan = dim.rowSpan || 1;

    // Mobile (iOS/Android): always 1 column (vertical stacking, overflow-x: hidden)
    // Tablet (md): 2 columns grid
    let mdColClass = 'md:col-span-1';
    if (colSpan >= 2) {
      mdColClass = 'md:col-span-2';
    }

    // Desktop (lg): 2, 3, or 4 columns grid
    let lgColClass = 'lg:col-span-1';
    if (gridLayout.columnsCount === 4) {
      if (colSpan === 2) lgColClass = 'lg:col-span-2';
      else if (colSpan === 3) lgColClass = 'lg:col-span-3';
      else if (colSpan >= 4) lgColClass = 'lg:col-span-4';
    } else if (gridLayout.columnsCount === 3) {
      if (colSpan === 2) lgColClass = 'lg:col-span-2';
      else if (colSpan >= 3) lgColClass = 'lg:col-span-3';
    } else if (gridLayout.columnsCount === 2) {
      if (colSpan >= 2) lgColClass = 'lg:col-span-2';
    }

    const rowClass = rowSpan === 2 ? 'row-span-1 md:row-span-2 min-h-[420px]' : 'row-span-1';

    return `col-span-1 ${mdColClass} ${lgColClass} ${rowClass}`;
  };

  // Render individual widget content
  const renderWidgetContent = (id: string) => {
    switch (id) {
      case 'profile_gamification':
        return (
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Profil & Gamification</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('gamification')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Scoreboard →
                </button>
              </div>

              <div 
                onClick={() => onNavigateTab('gamification')}
                className="p-3 bg-[#800020]/5 rounded-xl border border-[#800020]/20 cursor-pointer hover:bg-[#800020]/10 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Booster Score</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800020] text-white flex items-center gap-1">
                    <Trophy className="w-2.5 h-2.5" /> Level 4
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-[#800020]">{currentUser.booster_score}</p>
                  <span className="text-xs text-gray-400">/ 1 000 BP</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-[#800020] h-full rounded-full transition-all" 
                    style={{ width: `${Math.min(100, (currentUser.booster_score / 1000) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {Math.max(0, 1000 - currentUser.booster_score)} BP till Level 5 Master
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold mb-2 uppercase tracking-wider text-gray-700">
                  TOP SKILLS (ENDORSED)
                </p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-600">
                      <span>B2B SALES & STRATEGI</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#800020] h-full w-[92%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-600">
                      <span>STRATEGIC PARTNERSHIP</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#800020] h-full w-[78%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 border border-dashed border-[#800020] rounded-xl bg-[#800020]/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">Aktiv Utmaning</p>
                <p className="text-xs font-medium text-gray-800 truncate">
                  Stäng 1 affär i CRM (+100 BP)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="text-[11px] font-bold text-[#800020] hover:underline shrink-0 ml-2"
              >
                CRM →
              </button>
            </div>
          </div>
        );

      case 'pipeline':
        return (
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#800020]" />
                  <span>My Booster Pipeline</span>
                </h2>
                <button 
                  onClick={() => onNavigateTab('pipeline')}
                  className="bg-[#800020] text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#580016] transition shadow-xs"
                >
                  Öppna CRM
                </button>
              </div>

              {/* 3 Metric cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-[#F4F5F7] p-3 rounded-xl border border-gray-100">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Avslutade Affärer</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{formatSek(currentUser.deals_closed_sek)}</p>
                </div>
                <div className="bg-[#F4F5F7] p-3 rounded-xl border border-gray-100">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Rekommendationer</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">24 st</p>
                </div>
                <div className="bg-[#F4F5F7] p-3 rounded-xl border border-gray-100">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Aktiva Affärer</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{pipelineItems.length} st</p>
                </div>
              </div>

              {/* Mini Pipeline deals table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-gray-50 grid grid-cols-3 sm:grid-cols-4 p-2 text-[9px] font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                  <span>Bolag</span>
                  <span>Status</span>
                  <span>Värde</span>
                  <span className="text-right hidden sm:inline">Senast</span>
                </div>
                <div className="divide-y divide-gray-50">
                  <div 
                    onClick={() => onNavigateTab('pipeline')} 
                    className="grid grid-cols-3 sm:grid-cols-4 p-2 text-xs items-center hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <span className="font-bold text-gray-900 truncate">Global Logistics AB</span>
                    <span className="text-emerald-700 font-semibold text-[10px]">Follow-up</span>
                    <span className="text-gray-700 font-medium">120k kr</span>
                    <span className="text-gray-400 text-[10px] text-right hidden sm:inline">2h sedan</span>
                  </div>
                  <div 
                    onClick={() => onNavigateTab('pipeline')} 
                    className="grid grid-cols-3 sm:grid-cols-4 p-2 text-xs items-center hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <span className="font-bold text-gray-900 truncate">Svea Tech Solutions</span>
                    <span className="text-amber-700 font-semibold text-[10px]">Proposal</span>
                    <span className="text-gray-700 font-medium">350k kr</span>
                    <span className="text-gray-400 text-[10px] text-right hidden sm:inline">Igår</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">Aktiv pipeline: <strong>{formatSek(555000)}</strong></span>
              <button 
                onClick={() => onNavigateTab('pipeline')} 
                className="text-xs text-[#800020] font-bold hover:underline"
              >
                Kanban CRM →
              </button>
            </div>
          </div>
        );

      case 'webinar':
        return (
          <div className="bg-[#800020] rounded-xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden gap-4 h-full">
            <div className="relative z-10 max-w-md">
              <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded mb-2 inline-block uppercase tracking-wider">
                Live Webinar Engine
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-display">
                Scaling Digital Assets with AI Architecture
              </h3>
              <p className="text-xs text-white/80 mt-1 leading-relaxed line-clamp-2">
                Interaktiv live-sändning med realtidsomröstning och Q&A för verifierade medlemmar.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => onNavigateTab('webinars')}
                  className="bg-white text-[#800020] px-4 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-gray-100 transition shadow-sm"
                >
                  Gå till Live Stream
                </button>
                <button
                  onClick={() => onNavigateTab('webinars')}
                  className="bg-transparent border border-white text-white px-3 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-white/10 transition"
                >
                  Kalender (.ics)
                </button>
              </div>
            </div>

            <div className="flex gap-2 relative z-10 flex-shrink-0">
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10 text-center w-20 backdrop-blur-xs">
                <p className="text-lg font-bold text-white">120</p>
                <p className="text-[8px] text-white/70 font-bold uppercase">Anmälda</p>
              </div>
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10 text-center w-20 backdrop-blur-xs">
                <p className="text-lg font-bold text-white">14</p>
                <p className="text-[8px] text-white/70 font-bold uppercase">Frågor</p>
              </div>
            </div>
          </div>
        );

      case 'geofencing':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Geo-fencing Radar</span>
                </h2>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Aktiv Radar
                </span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between font-semibold text-emerald-950">
                  <span className="truncate pr-1">{selectedHub.name}</span>
                  <span className="text-emerald-700 font-bold shrink-0">18m kvar (Inom radie)</span>
                </div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  Du är inom radien ({selectedHub.radius_m}m). Närvaro och deltagarlistan synkas automatiskt.
                </p>
              </div>
            </div>

            <button
              onClick={() => onCheckInGeoOrQr ? onCheckInGeoOrQr() : onNavigateTab('coworking')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
            >
              Incheckning & QR-skanner →
            </button>
          </div>
        );

      case 'matchmaking':
        const targetMem = members[1] || members[0];
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                  <span>AI Lead Match Spotlight</span>
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#800020] text-white">
                  98% Match
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F5F7] flex items-start gap-3 border border-gray-100">
                <img
                  src={targetMem.avatar}
                  alt={targetMem.full_name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#800020] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate">{targetMem.full_name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{targetMem.role_title} • {targetMem.company_name}</p>
                  <p className="text-[11px] text-gray-700 mt-1 truncate">
                    Erbjuder: <strong>{targetMem.offering_tags?.slice(0, 2).join(', ')}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => onOpenDirectChat(targetMem.id)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#800020] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#580016] transition text-center shadow-xs"
              >
                Direktchatt
              </button>
              <button
                onClick={() => onStartIntroWith(targetMem.id)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-50 transition text-center"
              >
                3-Partsmatch
              </button>
            </div>
          </div>
        );

      case 'guest_pass':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>VIP Gästpass & Förmåner</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('promos')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Alla koder →
                </button>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">Booster Friends Gästpass</span>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                    {trialPasses.length} st aktiva
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 mt-1">
                  Bjud in en affärskollega att testa en valfri hubb kostnadsfritt. Ger dig +50 BP vid incheckning!
                </p>
              </div>
            </div>

            <div className="pt-1 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => onNavigateTab('promos')}
                className="w-full py-2 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
              >
                Dela provpass till gäst →
              </button>
            </div>
          </div>
        );

      case 'coworking_booking':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Dagens Coworking & Desk Swap</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('coworking')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Boka plats →
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{selectedHub.name}</p>
                    <p className="text-[11px] text-gray-500">{selectedHub.address}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Öppet idag
                  </span>
                </div>
                <div className="p-2.5 bg-[#800020]/5 border border-[#800020]/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800">Tillgängliga Desk Swaps:</span>
                  <span className="font-bold text-[#800020]">{deskSwaps.length} st platser</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('coworking')}
              className="w-full py-2 px-3 rounded-xl bg-[#800020] hover:bg-[#580016] text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
            >
              Hantera Coworking & Skrivbord →
            </button>
          </div>
        );

      case 'bp_ledger_widget':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-600" />
                  <span>Booster Points Transaktioner</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('gamification')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Full audit logg →
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {scoreLogs.slice(0, 3).map(log => (
                  <div key={log.id} className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-gray-900 truncate text-[11px]">{log.title}</p>
                      <p className="text-[10px] text-gray-400">{log.verification_method || 'SYSTEM'}</p>
                    </div>
                    <span className={`font-black text-xs px-2 py-0.5 rounded-lg flex-shrink-0 ${
                      log.points_awarded > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {log.points_awarded > 0 ? `+${log.points_awarded}` : log.points_awarded} BP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Totalt: <strong>{scoreLogs.length} poster</strong></span>
              <button
                onClick={() => onNavigateTab('gamification')}
                className="text-[11px] text-[#800020] font-bold hover:underline"
              >
                Gå till Scoreboard
              </button>
            </div>
          </div>
        );

      case 'calendar_upcoming':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Kommande Hubbmöten</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('calendar')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Kalender →
                </button>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020]">
                  {selectedHub.city} Hubbmöte
                </span>
                <p className="text-xs font-bold text-gray-900">{selectedHub.next_event_title || 'Introduktionsfrukost & Nätverk'}</p>
                <p className="text-[11px] text-gray-500">{selectedHub.next_event_date || 'Nästa vecka kl 07:30'}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('calendar')}
              className="w-full py-2 px-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
            >
              Visa alla event och workshops →
            </button>
          </div>
        );

      case 'knowledge_quiz':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Kunskapsbank & Booster Badge</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('academy')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Academy →
                </button>
              </div>

              <div className="p-3 bg-[#800020]/5 border border-[#800020]/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Veckans Kunskapsprov</span>
                  <span className="text-[10px] font-bold bg-[#800020] text-white px-2 py-0.5 rounded">
                    +50 BP
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Gör provet inom B2B Pitching & Avtal för att få verifierad kunskapsbadge i din profil.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('academy')}
              className="w-full py-2 px-3 rounded-xl bg-[#800020] hover:bg-[#580016] text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
            >
              Starta Kunskapsprov →
            </button>
          </div>
        );

      case 'academy_certs':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Executive Academy & Certifikat</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('academy')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Mina Certifikat →
                </button>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Aktiv Certifiering
                </span>
                <h4 className="text-xs font-bold text-gray-900">
                  Enterprise B2B Sales & Digital Matchmaking
                </h4>
                <p className="text-[11px] text-gray-600 font-mono">
                  Kod: BOOST-CERT-2026-B2B
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Mentor sparrings redo
              </span>
              <button
                onClick={() => onNavigateTab('academy')}
                className="px-3 py-1.5 rounded-lg bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs"
              >
                Boka Mentor
              </button>
            </div>
          </div>
        );

      case 'hub_battle':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Månadens Hubb Battle</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('gamification')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Topplista →
                </button>
              </div>

              <div className="space-y-1.5">
                {[
                  { rank: 1, name: 'Hubb Stockholm City', points: '745 BP / medl', isCurrent: true },
                  { rank: 2, name: 'Hubb Göteborg Avenyn', points: '692 BP / medl', isCurrent: false },
                  { rank: 3, name: 'Hubb Malmö Dockan', points: '620 BP / medl', isCurrent: false }
                ].map((item) => (
                  <div
                    key={item.rank}
                    onClick={() => onNavigateTab('gamification')}
                    className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      item.isCurrent 
                        ? 'bg-[#800020]/5 border-[#800020]/30' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                        item.rank === 1 ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {item.rank}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#800020] font-mono">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">18 dagar kvar</span>
              <button
                onClick={() => onNavigateTab('gamification')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Bidra med poäng →
              </button>
            </div>
          </div>
        );

      // ==================== PUNKT 23: MINA WEBBMÖTEN (1-1 & GRUPP) ====================
      case 'my_meetings':
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Mina Webbmöten (1-1 & Grupp)</span>
                </h2>
                <button
                  onClick={() => onOpenWebMeetingModal ? onOpenWebMeetingModal(null) : onNavigateTab('calendar')}
                  className="text-xs text-[#800020] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Boka Möte (+20 BP)</span>
                </button>
              </div>

              {webMeetings.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-xl text-center space-y-2 border border-gray-100">
                  <Video className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500">Inga inbokade webbmöten just nu.</p>
                  <button
                    onClick={() => onOpenWebMeetingModal ? onOpenWebMeetingModal(null) : onNavigateTab('calendar')}
                    className="px-3 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-bold"
                  >
                    Boka 1-till-1 Webbmöte
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {webMeetings.slice(0, 2).map((m: WebMeeting) => {
                    const isCopied = copiedMeetingId === m.id;
                    const otherParticipants = m.participants.filter(p => p.member_id !== currentUser.id);

                    return (
                      <div key={m.id} className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/70 space-y-2 hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                m.meeting_type === 'ONE_TO_ONE' ? 'bg-rose-100 text-[#800020]' : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {m.meeting_type === 'ONE_TO_ONE' ? '1-till-1' : 'Gruppmöte'}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                {m.date_str} • {m.start_time}-{m.end_time}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                              {m.title}
                            </h4>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Bekräftat
                          </span>
                        </div>

                        {/* Participants avatars */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-200/50">
                          <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {m.participants.slice(0, 3).map(p => (
                                <img
                                  key={p.member_id}
                                  src={p.avatar}
                                  alt={p.full_name}
                                  title={p.full_name}
                                  className="w-5 h-5 rounded-full border border-white object-cover"
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-gray-600 truncate max-w-[130px]">
                              {otherParticipants.length > 0 ? otherParticipants[0].full_name : 'Du'}
                              {otherParticipants.length > 1 && ` +${otherParticipants.length - 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyMeetingLink(m.id, m.meeting_link)}
                              title="Kopiera möteslänk"
                              className="p-1 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition text-[10px]"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>

                            <a
                              href={m.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-[#800020] hover:bg-[#66001a] text-white text-[10px] font-bold transition flex items-center gap-1 shadow-2xs"
                            >
                              <span>Gå med</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Kalendersynk & Google Meet/Teams
              </span>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-[#800020] font-bold hover:underline text-[11px]"
              >
                Alla möten i kalender →
              </button>
            </div>
          </div>
        );

      // ==================== VEM ÄR PÅ HUBBEN IDAG ====================
      case 'who_is_at_hub':
        // Guldmedlemmar har prioriterad topplacering
        const checkedInMembers = [...members.filter(m => m.id !== currentUser.id)].sort((a, b) => {
          if (a.membership_level === 'GOLD' && b.membership_level !== 'GOLD') return -1;
          if (b.membership_level === 'GOLD' && a.membership_level !== 'GOLD') return 1;
          return 0;
        }).slice(0, 4);
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vem är på Hubben Idag ({selectedHub.name.split(' ')[1] || 'City'})</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('coworking')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Flexplatser →
                </button>
              </div>

              <div className="space-y-2">
                {checkedInMembers.map((m, idx) => {
                  const isMemGold = m.membership_level === 'GOLD';
                  return (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                        isMemGold
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400 shadow-amber-200/50 shadow-md'
                          : 'bg-gray-50 border-gray-100 hover:bg-gray-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={m.profile_picture_url}
                            alt={m.first_name}
                            className={`w-8 h-8 rounded-full object-cover border ${
                              isMemGold ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-200'
                            }`}
                          />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-gray-900 truncate flex items-center gap-1.5">
                            <span>{m.first_name} {m.last_name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              isMemGold 
                                ? 'bg-gradient-to-r from-amber-400 to-amber-200 text-amber-950 font-black' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {m.membership_level}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            {m.company_name} • Incheckad kl 08:{30 + idx * 15}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onOpenDirectChat(m.id)}
                          title="Starta chatt"
                          className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#800020]" />
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenWebMeetingModal) {
                              onOpenWebMeetingModal(m, 'ONE_TO_ONE');
                            } else {
                              onOpenDirectChat(m.id);
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <Coffee className="w-3 h-3 text-amber-700" />
                          <span>Kaffe?</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {checkedInMembers.length + 4} medlemmar i hubben just nu
              </span>
              <button
                onClick={() => onNavigateTab('coworking')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Boka skrivbord →
              </button>
            </div>
          </div>
        );

      // ==================== SENASTE FORUMAKTIVITET ====================
      case 'forum_activity':
        const recentPosts = INITIAL_COMMUNITY_POSTS.slice(0, 3);
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Senaste Forumaktivitet & Diskussioner</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('community')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Till Forumet →
                </button>
              </div>

              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onNavigateTab('community')}
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100/80 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <img
                          src={post.author_avatar}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-[11px] font-bold text-gray-700 truncate">{post.author_name}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                        {post.category === 'AFFARER_LEADS' ? '💼 Leads' : post.category === 'FRAGA_EXPERTERNA' ? '💡 Fråga' : 'Community'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {post.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-0.5">
                      <span className="flex items-center gap-1 text-[#800020] font-bold">
                        ▲ {post.upvotes_count} röster
                      </span>
                      <span>💬 {post.comments_count} svar</span>
                      {post.is_pinned && (
                        <span className="text-amber-600 font-bold">📌 Fäst</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">Dela med dig och samla Booster Points</span>
              <button
                onClick={() => onNavigateTab('community')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Skapa inlägg →
              </button>
            </div>
          </div>
        );

      // ==================== NÄTVERKSREKOMMENDATIONER ====================
      case 'network_recommendations':
        const recommendedMembers = members.filter(m => m.id !== currentUser.id).slice(1, 3);
        return (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nätverksrekommendationer & Nya Medlemmar</span>
                </h2>
                <button
                  onClick={() => onNavigateTab('members')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Katalog →
                </button>
              </div>

              <div className="space-y-2.5">
                {recommendedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 hover:bg-gray-100/60 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.profile_picture_url}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">
                            {m.first_name} {m.last_name}
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            {m.company_name} • {m.industry || 'Tech'}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                        96% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 line-clamp-1 italic">
                      "Kompletterande kompetens inom SaaS och skalbarhet."
                    </p>

                    <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                      <button
                        onClick={() => {
                          if (onOpenWebMeetingModal) {
                            onOpenWebMeetingModal(m, 'ONE_TO_ONE');
                          } else {
                            onOpenDirectChat(m.id);
                          }
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-[#800020] hover:bg-[#66001a] text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Video className="w-3 h-3" />
                        <span>Boka 1-1 Webbmöte</span>
                      </button>

                      <button
                        onClick={() => onStartIntroWith(m.id)}
                        className="py-1.5 px-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3 text-gray-500" />
                        <span>Intro</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">AI-driven matchmaking</span>
              <button
                onClick={() => onNavigateTab('members')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Hitta fler kontakter →
              </button>
            </div>
          </div>
        );

      // ==================== PUNKT 28: ÖVERGRIPANDE KPI ====================
      case 'kpi_overview':
        return (
          <div className="flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Övergripande KPI: Medlem, Event, Hub & Pipeline</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Realtidssynkad
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* KPI 1 */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Booster Score</span>
                  <div className="text-xl font-black text-[#800020] mt-0.5">
                    {currentUser.booster_score} <span className="text-xs font-medium text-gray-400">BP</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +65 BP denna månad
                  </div>
                </div>

                {/* KPI 2 */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Pipeline Värde</span>
                  <div className="text-xl font-black text-gray-900 mt-0.5">
                    385k <span className="text-xs font-medium text-gray-400">SEK</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">
                    8 aktiva affärsmöjligheter
                  </div>
                </div>

                {/* KPI 3 */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Nätverksträffar</span>
                  <div className="text-xl font-black text-gray-900 mt-0.5">
                    12 <span className="text-xs font-medium text-gray-400">st</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">
                    94% närvarograd
                  </div>
                </div>

                {/* KPI 4 */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Ambassadör & Hub</span>
                  <div className="text-xl font-black text-amber-600 mt-0.5">
                    Top 3 <span className="text-xs font-medium text-gray-400">Rank</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">
                    4 provpass utdelade
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="text-[11px]">Beräknat på Single Source of Truth från samtliga moduler</span>
              <button
                onClick={() => onNavigateTab('gamification')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Djupgående statistik →
              </button>
            </div>
          </div>
        );

      // ==================== PROXIMITY PING (KAFFE & LUNCH RADAR) ====================
      case 'coffee_ping_radar':
        return (
          <CoffeePingWidget
            currentUser={currentUser}
            allMembers={members}
            memberLocations={memberLocations}
            proximityPings={proximityPings}
            onSendPing={onSendPing || (() => {})}
            onRespondPing={onRespondPing || (() => {})}
            onUpdateLocationStatus={onUpdateLocationStatus || (() => {})}
            onOpenFullModal={onOpenLocationPingModal}
            mode="extended"
          />
        );

      // ==================== LIVE TICKER WIDGET ====================
      case 'system_ticker_widget':
        return (
          <div className="-mx-1 sm:-mx-2">
            <SystemTickerWidget
              events={tickerEvents}
              onNavigate={(tab) => onNavigateTab(tab)}
              onOpenPingModal={onOpenLocationPingModal}
              isEditMode={customizingMode}
            />
          </div>
        );

      // ==================== MINI WIDGETS SUB-GRID ====================
      case 'mini_widgets_bar': {
        const myActiveLoc = memberLocations.find(l => l.member_id === currentUser.id);
        return (
          <MiniWidgetContainer isEditMode={customizingMode}>
            <MiniBpCounterWidget
              currentUser={currentUser}
              onClick={() => onNavigateTab('gamification')}
              isEditMode={customizingMode}
            />
            <MiniCoffeeToggleWidget
              currentUser={currentUser}
              myLocation={myActiveLoc}
              onToggleStatus={() => {
                const currentStatus = myActiveLoc?.is_available_for_coffee || myActiveLoc?.is_available_for_lunch;
                if (onUpdateLocationStatus) {
                  onUpdateLocationStatus({
                    is_available_for_coffee: !currentStatus,
                    is_available_for_lunch: !currentStatus,
                    current_city: currentUser.city || 'Mölnlycke'
                  });
                }
              }}
              onOpenPingModal={onOpenLocationPingModal}
              isEditMode={customizingMode}
            />
            <MiniQuickQrWidget
              currentUser={currentUser}
              onClick={() => {
                if (onCheckInGeoOrQr) {
                  onCheckInGeoOrQr();
                } else {
                  onNavigateTab('profile_settings');
                }
              }}
              isEditMode={customizingMode}
            />
            <MiniHubAttendanceWidget
              members={members}
              currentUser={currentUser}
              onClick={() => onNavigateTab('directory')}
              isEditMode={customizingMode}
            />
          </MiniWidgetContainer>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 📢 SPONSRAD BANNER ENGINE (FEED_TOP) */}
      <AdBannerEngine 
        zone="FEED_TOP" 
        isAdmin={currentUser.membership_level === 'GOLD' || currentUser.is_admin} 
      />

      {/* Dashboard Top Control Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Home – Min Personliga Arbetsyta</span>
            </h1>
            <span className="text-[10px] bg-[#800020]/10 text-[#800020] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {gridLayout.columnsCount} Kolumner Grid
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">
              Gap: {gridLayout.gap}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {activeWidgets.length} aktiva widgets
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Flexibel Bento-dashboard med dynamisk kolumnstyrning (2, 3, 4 kolumner), kortstorlekar och automatisk layoutsparning.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {customizingMode ? (
            <>
              {/* Finish & Save Button */}
              <button
                type="button"
                onClick={() => {
                  handleManualSaveLayout();
                  setCustomizingMode(false);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#800020] text-white hover:bg-[#580016] transition flex items-center gap-1.5 shadow-xs ring-2 ring-[#800020]/20"
                title="Spara ändringar och lås dashboarden"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Klar med redigering</span>
              </button>

              {/* Add Widget Button */}
              <button
                type="button"
                onClick={() => setShowWidgetPicker(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-[#800020] border border-[#800020]/30 hover:bg-[#800020]/5 transition flex items-center gap-1.5 shadow-xs"
                title="Lägg till widgets från andra vyer"
              >
                <Plus className="w-3.5 h-3.5 text-[#800020]" />
                <span>Lägg till widget</span>
              </button>

              {/* Reset to Default Button */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition border border-gray-200"
                title="Återställ till standardvy (4 kolumner, standardstorlekar)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* Edit Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setCustomizingMode(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition flex items-center gap-1.5 shadow-xs"
                title="Växla till redigeringsläge för att ändra kolumner, kortstorlekar och ordning"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#800020]" />
                <span>Redigera layout</span>
              </button>

              {/* Add Widget Button */}
              <button
                type="button"
                onClick={() => setShowWidgetPicker(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-[#800020] border border-[#800020]/30 hover:bg-[#800020]/5 transition flex items-center gap-1.5 shadow-xs"
                title="Lägg till widgets från andra vyer"
              >
                <Plus className="w-3.5 h-3.5 text-[#800020]" />
                <span>Lägg till widget</span>
              </button>

              {/* Reset to Default Button */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition border border-gray-200"
                title="Återställ till standardvy"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid Settings Panel (Punkt 30: Home Edit Mode & Grid-kontroll) */}
      {customizingMode && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Columns className="w-4 h-4 text-[#800020]" />
              <span>Desktop Grid:</span>
            </div>
            <div className="flex items-center bg-gray-200/80 p-1 rounded-xl gap-1">
              {([2, 3, 4] as DashboardColumnsCount[]).map((cols) => (
                <button
                  key={cols}
                  type="button"
                  onClick={() => handleSetColumnsCount(cols)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    gridLayout.columnsCount === cols
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={`Växla till ${cols} kolumners vy på desktop`}
                >
                  <span>{cols} Kolumner</span>
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <Sliders className="w-4 h-4 text-gray-500" />
              <span>Grid Gap:</span>
            </div>
            <div className="flex items-center bg-gray-200/80 p-1 rounded-xl gap-1">
              {(['12px', '16px', '24px'] as DashboardGridGap[]).map((gapVal) => (
                <button
                  key={gapVal}
                  type="button"
                  onClick={() => handleSetGridGap(gapVal)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    gridLayout.gap === gapVal
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={`Sätt avstånd mellan kort till ${gapVal}`}
                >
                  <span>{gapVal === '12px' ? '12px (Kompakt)' : gapVal === '16px' ? '16px (Standard)' : '24px (Rymlig)'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Redigeringsläge aktivt: Dra och släpp, eller använd Col/Row-knappar</span>
          </div>
        </div>
      )}

      {toastNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Bento Grid with Dynamic Reflow, Col-Span & Row-Span (Punkt 29, 30 & 34) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridColsClass()} ${getGridGapClass()} transition-all duration-200`}>
        {activeWidgets.map((widgetId, index) => {
          const def = ALL_AVAILABLE_WIDGETS.find(w => w.id === widgetId);
          if (!def) return null;
          const dim = widgetDimensions[widgetId] || { colSpan: 1, rowSpan: 1 };
          const spanClasses = getCardSpanClasses(widgetId);
          const isDragging = draggedWidgetId === widgetId;
          const isOver = dragOverWidgetId === widgetId;

          return (
            <div
              key={widgetId}
              draggable={customizingMode}
              onDragStart={(e) => customizingMode && handleDragStart(e, widgetId)}
              onDragOver={(e) => customizingMode && handleDragOver(e, widgetId)}
              onDrop={(e) => customizingMode && handleDrop(e, widgetId)}
              onDragEnd={handleDragEnd}
              className={`${spanClasses} transition-all duration-200 ${
                isDragging && customizingMode ? 'opacity-40 scale-[0.98]' : 'opacity-100'
              } ${
                isOver && customizingMode ? 'ring-2 ring-[#800020] ring-offset-2' : ''
              }`}
            >
              <section className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between h-full relative transition-shadow hover:shadow-sm ${
                customizingMode ? 'ring-1 ring-[#800020]/20' : ''
              } ${
                dim.rowSpan === 2 ? 'min-h-[440px]' : ''
              }`}>
                {/* Storlekskontroller och handles VISAS ENBART i Edit Mode (Punkt 30 Edit-låst resizing) */}
                {customizingMode && (
                  <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-gray-200 gap-2 bg-gray-50/90 -mx-5 -mt-5 p-3 rounded-t-2xl">
                    <div 
                      className="flex items-center gap-1.5 text-gray-500 cursor-grab active:cursor-grabbing bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs"
                      title="Klicka och dra för att flytta"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                        Plats #{index + 1}
                      </span>
                    </div>

                    {/* Col-Span & Row-Span Resizing Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Width / Col-Span */}
                      <div className="flex items-center bg-white border border-gray-200 p-0.5 rounded-lg gap-0.5 shadow-2xs">
                        <span className="text-[10px] text-gray-400 font-bold px-1 hidden sm:inline">Bredd:</span>
                        <button
                          type="button"
                          onClick={() => handleColSpanChange(widgetId, -1)}
                          disabled={dim.colSpan <= 1}
                          className="w-5 h-5 flex items-center justify-center rounded text-[11px] font-black text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                          title="Minska kolumnbredd"
                        >
                          -
                        </button>
                        {Array.from({ length: gridLayout.columnsCount }, (_, i) => i + 1).map((colNum) => (
                          <button
                            key={colNum}
                            type="button"
                            onClick={() => handleSetColSpan(widgetId, colNum)}
                            title={`Sätt ${colNum} kolumn${colNum > 1 ? 'er' : ''}`}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-black transition ${
                              Math.min(dim.colSpan, gridLayout.columnsCount) === colNum 
                                ? 'bg-[#800020] text-white shadow-2xs' 
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {colNum}K
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleColSpanChange(widgetId, 1)}
                          disabled={dim.colSpan >= gridLayout.columnsCount}
                          className="w-5 h-5 flex items-center justify-center rounded text-[11px] font-black text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                          title="Öka kolumnbredd"
                        >
                          +
                        </button>
                      </div>

                      {/* Height / Row-Span */}
                      <div className="flex items-center bg-white border border-gray-200 p-0.5 rounded-lg shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleToggleRowSpan(widgetId)}
                          title="Växla mellan standardhöjd och utökad höjd (2 rader)"
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                            dim.rowSpan === 2
                              ? 'bg-[#800020] text-white shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {dim.rowSpan === 2 ? (
                            <>
                              <Minimize2 className="w-3 h-3" />
                              <span>2 Rader (Utökad)</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-3 h-3" />
                              <span>1 Rad (Standard)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Reordering & Close */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveWidget(widgetId, 'up')}
                        className={`p-1 rounded hover:bg-white transition border border-transparent hover:border-gray-200 ${
                          index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                        }`}
                        title="Flytta uppåt / vänster"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === activeWidgets.length - 1}
                        onClick={() => moveWidget(widgetId, 'down')}
                        className={`p-1 rounded hover:bg-white transition border border-transparent hover:border-gray-200 ${
                          index === activeWidgets.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                        }`}
                        title="Flytta nedåt / höger"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeWidget(widgetId)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 transition ml-1"
                        title="Ta bort widget från dashboard"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Innehåll i kortet (Visas alltid) */}
                <div className="flex-1">
                  {renderWidgetContent(widgetId)}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {/* Widget Picker Modal with Category Tabs (Punkt 31) */}
      {showWidgetPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full p-5 shadow-xl max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#800020]" />
                <h3 className="text-base font-bold text-gray-900">Lägg till widget på Dashboard</h3>
              </div>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-gray-100 text-xs">
              {[
                { id: 'ALL', label: 'Alla Widgets' },
                { id: 'mitt', label: 'Mitt' },
                { id: 'natverk', label: 'Nätverk' },
                { id: 'hub', label: 'Hub' },
                { id: 'community', label: 'Community' },
                { id: 'kpi', label: 'KPI' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPickerCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition text-xs ${
                    pickerCategory === cat.id
                      ? 'bg-[#800020] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 my-2.5">
              Välj moduler och widgets från Booster Friends för att lägga till på din personliga startsida.
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {ALL_AVAILABLE_WIDGETS
                .filter(w => pickerCategory === 'ALL' || w.category === pickerCategory)
                .map(widget => {
                  const isAlreadyActive = activeWidgets.includes(widget.id);
                  return (
                    <div
                      key={widget.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                        isAlreadyActive ? 'bg-gray-50/70 border-gray-200' : 'bg-white border-gray-200 hover:border-[#800020]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">{widget.title}</h4>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                            {widget.category}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400">
                            Standard: {widget.defaultSize}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                          {widget.description}
                        </p>
                      </div>

                      {isAlreadyActive ? (
                        <button
                          type="button"
                          onClick={() => removeWidget(widget.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 shrink-0"
                        >
                          Ta bort
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addWidget(widget.id)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#800020] hover:bg-[#580016] transition shadow-xs shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Lägg till</span>
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowWidgetPicker(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal (Punkt 30) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-sm w-full p-5 shadow-xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Återställ Dashboard?</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Är du säker på att du vill återställa layouten till standard? Alla dina anpassade widget-placeringar och storlekar återställs till utgångsläget.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={resetToDefault}
                className="flex-1 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-xs font-bold text-white transition shadow-xs"
              >
                Ja, återställ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
