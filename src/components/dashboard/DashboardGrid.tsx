import { canonicalWidgetId, normalizeWidgetIds } from '../../lib/widgetIdentity';
import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  Shield, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  LayoutGrid,
  Columns,
  Layers
} from 'lucide-react';
import { Member, Hub, DealPipelineItem, WebMeeting, BoosterScoreLog, GuestPass, MasterCalendarEvent } from '../../types';
import { 
  WIDGET_REGISTRY, 
  WidgetDefinition, 
  WidgetWidth,
  DEFAULT_USER_WIDGET_IDS, 
  DEFAULT_ADMIN_WIDGET_IDS 
} from '../../types/widgets';
import { 
  getUserWidgetPreferences, 
  saveUserWidgetPreferences 
} from '../../lib/widgetServices';
import { WidgetPickerModal } from './WidgetPickerModal';
import { DashboardComparisonModal } from './DashboardComparisonModal';
import { AdminInspect } from '../dev/AdminInspect';
import { usePermissions } from '../../hooks/usePermissions';

// Importera alla widgetkomponenter
import { FlexBookingWidget } from './widgets/FlexBookingWidget';
import { HubPresenceWidget } from './widgets/HubPresenceWidget';
import { AdminKpiWidget } from './widgets/AdminKpiWidget';
import { AdminBroadcastSenderWidget } from './widgets/AdminBroadcastSenderWidget';
import { AdminMaintenanceWidget } from './widgets/AdminMaintenanceWidget';
import { BoosterScoreWidget } from './widgets/BoosterScoreWidget';
import { VCardQrWidget } from './widgets/VCardQrWidget';
import { ActivityTickerWidget } from './widgets/ActivityTickerWidget';
import { ProximityRadarWidget } from './widgets/ProximityRadarWidget';
import { 
  CommunityFeedWidget, 
  AcademyProgressWidget, 
  NotificationsInboxWidget, 
  TagSubscriptionsWidget, 
  AdminDealsPipelineWidget, 
  AdminInvoicesWidget, 
  AdminAccountLifecycleWidget 
} from './widgets/SecondaryWidgets';
import {
  MyMeetingsWidget,
  AiMatchmakingWidget,
  MemberPipelineWidget,
  CalendarUpcomingWidget,
  GuestPassWidget,
  WebinarWidget,
  BpLedgerWidget,
  NetworkRecommendationsWidget,
  HubBattleWidget,
  GeofencingWidget,
  KnowledgeQuizWidget
} from './widgets/CoreModulesWidgets';
import {
  MiniWidgetContainer,
  MiniBpCounterWidget,
  MiniCoffeeToggleWidget,
  MiniQuickQrWidget,
  MiniHubAttendanceWidget
} from './MiniWidgets';

interface DashboardGridProps {
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

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  currentUser,
  allMembers = [],
  hubs = [],
  selectedHub,
  onNavigateTab,
  onOpenDirectChat,
  onAwardPoints,
  pipelineItems = [],
  webMeetings = [],
  onOpenWebMeetingModal,
  onStartIntroWith,
  scoreLogs = [],
  guestPasses = [],
  masterEvents = [],
}) => {
  const { isSuperAdmin, isAdmin: hookIsAdmin } = usePermissions();
  const isAdmin = Boolean(
    isSuperAdmin ||
    hookIsAdmin ||
    currentUser.is_admin ||
    (currentUser as any).profiles?.is_admin ||
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'ADMIN' ||
    currentUser.role_title?.toLowerCase().includes('admin') ||
    currentUser.role_title?.toLowerCase().includes('grundare') ||
    currentUser.id === 'usr_rickard_wigrund' ||
    currentUser.id === 'usr_rickard_performile' ||
    currentUser.email?.toLowerCase() === 'wigrund81@gmail.com' ||
    currentUser.email?.toLowerCase() === 'admin@performile.com' ||
    currentUser.email?.toLowerCase() === 'rickard@wigrund.se'
  );

  const [activeWidgetIds, setActiveWidgetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Användardefinierade widget-storlekar (synkas med localStorage & user_dashboard_widgets)
  const [customWidths, setCustomWidths] = useState<Record<string, WidgetWidth>>(() => {
    try {
      const saved = localStorage.getItem(`bf_widget_widths_${currentUser.id}`);
      if (saved) return Object.fromEntries(Object.entries(JSON.parse(saved)).map(([id, width]) => [canonicalWidgetId(id), width]));
    } catch {}
    return {};
  });

  const handleSetWidgetWidth = (widgetId: string, width: WidgetWidth) => {
    setCustomWidths(prev => {
      const next = { ...prev, [widgetId]: width };
      try {
        localStorage.setItem(`bf_widget_widths_${currentUser.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMoveWidget = (index: number, direction: 'UP' | 'DOWN') => {
    setActiveWidgetIds(prev => {
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      saveUserWidgetPreferences(currentUser.id, next);
      return next;
    });
  };

  const handleRemoveWidget = (widgetId: string) => {
    const next = activeWidgetIds.filter(id => id !== widgetId);
    setActiveWidgetIds(next);
    saveUserWidgetPreferences(currentUser.id, next);
  };

  // Ladda användarens sparade widget-preferenser
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const ids = await getUserWidgetPreferences(currentUser.id, isAdmin);
      setActiveWidgetIds(normalizeWidgetIds(ids));
    } catch (err) {
      console.warn('Could not load widget prefs:', err);
      setActiveWidgetIds(isAdmin ? DEFAULT_ADMIN_WIDGET_IDS : DEFAULT_USER_WIDGET_IDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [currentUser.id, isAdmin]);

  // Spara ändringar från WidgetPickerModal
  const handleSavePreferences = async (newActiveIds: string[]) => {
    setActiveWidgetIds(normalizeWidgetIds(newActiveIds));
    await saveUserWidgetPreferences(currentUser.id, normalizeWidgetIds(newActiveIds));
  };

  // Mappa widget ID till dess motsvarande React-komponent
  const renderWidgetComponent = (id: string) => {
    const props = {
      currentUser,
      allMembers,
      hubs,
      selectedHub,
      onNavigateTab,
      onOpenDirectChat,
      onAwardPoints,
      pipelineItems,
      webMeetings,
      onOpenWebMeetingModal,
      onStartIntroWith,
      scoreLogs,
      guestPasses,
      masterEvents,
    };

    switch (id) {
      case 'mini_widgets_bar':
        return (
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
            <MiniWidgetContainer>
              <MiniBpCounterWidget
                currentUser={currentUser}
                onClick={() => onNavigateTab?.('gamification')}
              />
              <MiniCoffeeToggleWidget
                currentUser={currentUser}
                onToggleStatus={() => onNavigateTab?.('proximity')}
                onOpenPingModal={() => onNavigateTab?.('proximity')}
              />
              <MiniQuickQrWidget
                currentUser={currentUser}
                onClick={() => onNavigateTab?.('profile_settings')}
              />
              <MiniHubAttendanceWidget
                members={allMembers || []}
                currentUser={currentUser}
                onClick={() => onNavigateTab?.('directory')}
              />
            </MiniWidgetContainer>
          </div>
        );
      case 'booster_score':
      case 'profile_gamification':
        return <BoosterScoreWidget {...props} />;
      case 'vcard_qr':
        return <VCardQrWidget {...props} />;
      case 'activity_ticker':
      case 'system_ticker_widget':
        return <ActivityTickerWidget {...props} />;
      case 'proximity_radar':
      case 'coffee_ping_radar':
        return <ProximityRadarWidget {...props} />;
      case 'hub_presence':
      case 'who_is_at_hub':
        return <HubPresenceWidget {...props} />;
      case 'flex_booking':
      case 'coworking_booking':
        return <FlexBookingWidget {...props} />;
      case 'my_meetings':
        return <MyMeetingsWidget {...props} />;
      case 'ai_matchmaking':
      case 'matchmaking':
        return <AiMatchmakingWidget {...props} />;
      case 'member_pipeline':
      case 'pipeline':
        return <MemberPipelineWidget {...props} />;
      case 'calendar_upcoming':
        return <CalendarUpcomingWidget {...props} />;
      case 'guest_pass':
        return <GuestPassWidget {...props} />;
      case 'webinar':
        return <WebinarWidget {...props} />;
      case 'bp_ledger':
      case 'bp_ledger_widget':
        return <BpLedgerWidget {...props} />;
      case 'network_recommendations':
        return <NetworkRecommendationsWidget {...props} />;
      case 'hub_battle':
        return <HubBattleWidget {...props} />;
      case 'geofencing':
        return <GeofencingWidget {...props} />;
      case 'knowledge_quiz':
        return <KnowledgeQuizWidget {...props} />;
      case 'community_feed':
      case 'forum_activity':
        return <CommunityFeedWidget {...props} />;
      case 'academy_progress':
      case 'academy_certs':
        return <AcademyProgressWidget {...props} />;
      case 'notifications_inbox':
        return <NotificationsInboxWidget {...props} />;
      case 'tag_subscriptions':
        return <TagSubscriptionsWidget {...props} />;
      case 'admin_kpi_overview':
      case 'kpi_overview':
        return <AdminKpiWidget {...props} />;
      case 'admin_deals_pipeline':
        return <AdminDealsPipelineWidget {...props} />;
      case 'admin_invoices':
        return <AdminInvoicesWidget {...props} />;
      case 'admin_broadcast_sender':
        return <AdminBroadcastSenderWidget {...props} />;
      case 'admin_account_lifecycle':
        return <AdminAccountLifecycleWidget {...props} />;
      case 'admin_maintenance_toggle':
        return <AdminMaintenanceWidget {...props} />;
      default:
        return null;
    }
  };

  // Filtrera så att endast tillåtna widgets renderas
  const visibleWidgets = normalizeWidgetIds(activeWidgetIds)
    .map(id => WIDGET_REGISTRY[id])
    .filter((w): w is WidgetDefinition => {
      if (!w) return false;
      if (w.adminOnly && !isAdmin) return false;
      return true;
    });

  // Beräkna kolumnbreddsklass för Tailwind (tar hänsyn till användarens valda anpassning)
  const getColSpanClass = (def: WidgetDefinition) => {
    const width = customWidths[def.id] || def.defaultWidth;
    if (width === 'span-full') {
      return 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4';
    }
    if (width === 'span-2') {
      return 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2';
    }
    return 'col-span-1';
  };

  return (
    <AdminInspect
      component="DashboardGrid.tsx"
      sourceTable="public.user_dashboard_widgets / user_dashboard_layouts"
      columns={['user_id', 'active_widget_ids', 'updated_at']}
      notes="Personlig dashboard grid-layout med modulladdning"
    >
      <div className="space-y-6">
      {/* Dashboard Topbar / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Personlig Modulär Dashboard
            </h1>
            {isAdmin && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
                Admin-läge
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {isEditMode 
              ? 'Detaljredigering aktiv: Justera modullayout (1 kol, 2 kol, Full), flytta eller dölj widgets.'
              : 'Personlig modulär översikt över dina aktiva verktyg och nätverksdata.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Compare Button */}
          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            title="Jämför Bento- och Modulär Dashboard sida vid sida"
          >
            <Layers className="w-3.5 h-3.5 text-[#800020]" />
            <span>Jämför Vyer</span>
          </button>

          {/* Switch to Bento */}
          <button
            type="button"
            onClick={() => onNavigateTab?.('overview')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-[#800020] hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
            title="Växla till Bento Dashboard"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
            <span>Växla till Bento-vy</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isEditMode
                ? 'bg-[#800020] text-white border-[#800020] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{isEditMode ? '✓ Avsluta detaljläge' : '🎨 Detaljredigering'}</span>
          </button>

          {/* ONLY show "Välj moduler" when isEditMode is true */}
          {isEditMode && (
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer animate-in fade-in"
            >
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              Välj moduler
            </button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400 animate-pulse">
          Laddar din personliga layout...
        </div>
      ) : visibleWidgets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-sm font-bold text-gray-700 mb-2">Inga aktiva widgets valda</p>
          <p className="text-xs text-gray-500 mb-4">
            Klicka på "Välj moduler" för att välja vilka verktyg du vill visa.
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold"
          >
            Öppna Widgetväljaren
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleWidgets.map((widget, index) => {
            const currentWidth = customWidths[widget.id] || widget.defaultWidth;
            const spanClass = getColSpanClass(widget);
            return (
              <div 
                key={widget.id} 
                className={`${spanClass} flex flex-col relative transition-all duration-200 ${
                  isEditMode ? 'ring-2 ring-[#800020]/20 rounded-3xl p-1 bg-gray-50/60' : ''
                }`}
              >
                {/* Size & Move Controls Bar - Visas ENDAST när detaljredigering är aktiv */}
                {isEditMode && (
                  <div className="mb-2 px-3 py-2 rounded-2xl border bg-rose-50/80 border-rose-200 shadow-xs transition-all flex items-center justify-between gap-1 text-[11px] animate-in fade-in">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] font-bold text-gray-700 truncate">{widget.title}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 font-bold uppercase mr-0.5">Bredd:</span>
                      <button
                        type="button"
                        onClick={() => handleSetWidgetWidth(widget.id, 'span-1')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          currentWidth === 'span-1'
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        title="1 kolumn (Kompakt bredd)"
                      >
                        1 kol
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetWidgetWidth(widget.id, 'span-2')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          currentWidth === 'span-2'
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        title="2 kolumner (Halv bredd)"
                      >
                        2 kol
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetWidgetWidth(widget.id, 'span-full')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          currentWidth === 'span-full'
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        title="Full bredd (4 kolumner)"
                      >
                        Full
                      </button>

                      {/* Move & Remove Controls */}
                      <div className="flex items-center gap-0.5 ml-1 border-l border-gray-200 pl-1">
                        <button
                          type="button"
                          onClick={() => handleMoveWidget(index, 'UP')}
                          disabled={index === 0}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Flytta framåt/uppåt"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveWidget(index, 'DOWN')}
                          disabled={index === visibleWidgets.length - 1}
                          className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Flytta bakåt/nedåt"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 ml-0.5 cursor-pointer"
                          title="Dölj denna widget"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                  {renderWidgetComponent(widget.id)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Widget Picker Modal */}
      <WidgetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        activeWidgetIds={activeWidgetIds}
        isAdmin={isAdmin}
        onSavePreferences={handleSavePreferences}
      />

      {/* Dashboard Comparison Modal */}
      <DashboardComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        activeView="modular"
        onSelectView={(view) => {
          if (view === 'bento') {
            onNavigateTab?.('overview');
          }
        }}
      />
    </div>
    </AdminInspect>
  );
};
