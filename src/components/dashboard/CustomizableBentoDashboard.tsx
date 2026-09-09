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
  EyeOff
} from 'lucide-react';
import { 
  Member, 
  Hub, 
  BoosterScoreLog, 
  CoworkingDeskBooking, 
  DeskSwap, 
  FreeTrialPass,
  MasterCalendarEvent 
} from '../../types';
import { AdBannerEngine } from '../ads/AdBannerEngine';
import { formatSek } from '../../utils/calendar';

export interface WidgetDefinition {
  id: string;
  title: string;
  category: 'core' | 'coworking' | 'community' | 'gamification' | 'academy' | 'calendar';
  defaultSpan: string; // e.g. 'col-span-12 md:col-span-4'
  description: string;
}

export const ALL_AVAILABLE_WIDGETS: WidgetDefinition[] = [
  {
    id: 'profile_gamification',
    title: 'Profil & Gamification',
    category: 'gamification',
    defaultSpan: 'col-span-12 md:col-span-4',
    description: 'Ditt Booster Score, ranking, skillbars och aktiv utmaning'
  },
  {
    id: 'pipeline',
    title: 'My Booster Pipeline',
    category: 'core',
    defaultSpan: 'col-span-12 md:col-span-8',
    description: 'Genererade affärer, potentiellt värde och CRM-översikt'
  },
  {
    id: 'webinar',
    title: 'Live Webinar Engine',
    category: 'academy',
    defaultSpan: 'col-span-12 md:col-span-8',
    description: 'Kommande live stream med Q&A och direktlänk'
  },
  {
    id: 'geofencing',
    title: 'Geo-fencing Radar & Hubb',
    category: 'coworking',
    defaultSpan: 'col-span-12 md:col-span-4',
    description: 'Automatisk närvarokontroll inom hubbens GPS-radie'
  },
  {
    id: 'matchmaking',
    title: 'AI Lead Match Spotlight',
    category: 'community',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'AI-genererad affärsmatchning baserad på din profil'
  },
  {
    id: 'guest_pass',
    title: 'VIP Gästpass & Förmåner',
    category: 'coworking',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'Dela ut provpass och lås upp partnerförmåner'
  },
  {
    id: 'coworking_booking',
    title: 'Dagens Coworking & Desk Swap',
    category: 'coworking',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'Dina skrivbordsbokningar och tillgängliga desk swaps'
  },
  {
    id: 'bp_ledger_widget',
    title: 'Booster Points Ledger',
    category: 'gamification',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'Senaste verifierade BP-transaktioner och audit trail'
  },
  {
    id: 'calendar_upcoming',
    title: 'Kommande Hubbmöten',
    category: 'calendar',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'Nätverksfrukostar, workshops och regionala träffar'
  },
  {
    id: 'knowledge_quiz',
    title: 'Booster Academy & Kunskapsprov',
    category: 'academy',
    defaultSpan: 'col-span-12 md:col-span-6',
    description: 'Certifieringar, quiz och kunskapsbadgar (+BP)'
  },
  {
    id: 'academy_certs',
    title: 'Executive Academy & Certifikat',
    category: 'academy',
    defaultSpan: 'col-span-12 md:col-span-7',
    description: 'Dina avklarade certifieringar, QR-verifiering och mentorsparring'
  },
  {
    id: 'hub_battle',
    title: 'Månadens Hubb Battle',
    category: 'gamification',
    defaultSpan: 'col-span-12 md:col-span-5',
    description: 'Regional topplista och sammanlagda poäng per medlem'
  }
];

const DEFAULT_WIDGET_ORDER = [
  'profile_gamification',
  'pipeline',
  'webinar',
  'geofencing',
  'matchmaking',
  'guest_pass'
];

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
  onNavigateTab: (tab: string) => void;
  onOpenDirectChat: (memberId: string) => void;
  onStartIntroWith: (memberId: string) => void;
  onAwardPoints: (points: number, reason: string) => void;
  onCheckInGeoOrQr?: () => void;
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
  onNavigateTab,
  onOpenDirectChat,
  onStartIntroWith,
  onAwardPoints,
  onCheckInGeoOrQr
}) => {
  // Widget ordering state persisted in localStorage
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('booster_bento_active_widgets');
      if (saved) {
        const parsed = JSON.parse(saved);
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
  const [customizingMode, setCustomizingMode] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('booster_bento_active_widgets', JSON.stringify(activeWidgets));
    } catch {
      // ignore
    }
  }, [activeWidgets]);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
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
    showToast('✓ Dashboard återställd till standardlayout!');
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
          <h1 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span>Anpassningsbar Bento Dashboard</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full uppercase">
              Drag & Drop
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Dra och släpp korten eller använd pilarna för att skapa din egen personliga översikt.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCustomizingMode(!customizingMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              customizingMode
                ? 'bg-[#800020] text-white border-[#800020]'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title="Växla anpassningsläge"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{customizingMode ? 'Klar med anpassning' : 'Anpassa layout'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWidgetPicker(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#800020] border border-[#800020]/30 hover:bg-[#800020]/5 transition flex items-center gap-1.5 shadow-xs"
            title="Lägg till widgets från andra vyer"
          >
            <Plus className="w-3.5 h-3.5 text-[#800020]" />
            <span>Lägg till widget</span>
          </button>

          <button
            type="button"
            onClick={resetToDefault}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition border border-gray-200"
            title="Återställ till standardvy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {toastNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Bento Grid with Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {activeWidgets.map((widgetId, index) => {
          const def = ALL_AVAILABLE_WIDGETS.find(w => w.id === widgetId);
          if (!def) return null;
          const spanClass = def.defaultSpan;
          const isDragging = draggedWidgetId === widgetId;
          const isOver = dragOverWidgetId === widgetId;

          return (
            <div
              key={widgetId}
              draggable={customizingMode}
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={(e) => handleDragOver(e, widgetId)}
              onDrop={(e) => handleDrop(e, widgetId)}
              onDragEnd={handleDragEnd}
              className={`${spanClass} transition-all duration-200 ${
                isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
              } ${
                isOver ? 'ring-2 ring-[#800020] ring-offset-2' : ''
              }`}
            >
              <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between h-full relative group">
                {/* Control handles in customizing mode or on hover */}
                <div className={`flex items-center justify-between pb-2 mb-2 border-b border-gray-100 ${
                  customizingMode ? 'flex' : 'hidden group-hover:flex'
                }`}>
                  <div 
                    className="flex items-center gap-1.5 text-gray-400 cursor-grab active:cursor-grabbing"
                    title="Klicka och dra för att flytta"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Plats #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveWidget(widgetId, 'up')}
                      className={`p-1 rounded hover:bg-gray-100 transition ${
                        index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                      }`}
                      title="Flytta uppåt"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === activeWidgets.length - 1}
                      onClick={() => moveWidget(widgetId, 'down')}
                      className={`p-1 rounded hover:bg-gray-100 transition ${
                        index === activeWidgets.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
                      }`}
                      title="Flytta nedåt"
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

                {/* Widget inner contents */}
                <div className="flex-1">
                  {renderWidgetContent(widgetId)}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {/* Widget Picker Modal */}
      {showWidgetPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-5 shadow-xl max-h-[85vh] flex flex-col">
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

            <p className="text-xs text-gray-500 my-3">
              Välj moduler och widgets från Booster Friends övriga vyer för att lägga till på din personliga startsida.
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {ALL_AVAILABLE_WIDGETS.map(widget => {
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
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {widget.category}
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
    </div>
  );
};
