import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { Member, Hub } from '../../types';
import { 
  WIDGET_REGISTRY, 
  WidgetDefinition, 
  DEFAULT_USER_WIDGET_IDS, 
  DEFAULT_ADMIN_WIDGET_IDS 
} from '../../types/widgets';
import { 
  getUserWidgetPreferences, 
  saveUserWidgetPreferences 
} from '../../lib/widgetServices';
import { WidgetPickerModal } from './WidgetPickerModal';

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

interface DashboardGridProps {
  currentUser: Member;
  allMembers?: Member[];
  hubs?: Hub[];
  selectedHub?: Hub;
  onNavigateTab?: (tab: string) => void;
  onOpenDirectChat?: (memberId: string) => void;
  onAwardPoints?: (points: number, reason: string, activityType: string) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  currentUser,
  allMembers = [],
  hubs = [],
  selectedHub,
  onNavigateTab,
  onOpenDirectChat,
  onAwardPoints,
}) => {
  const isAdmin = Boolean(
    currentUser.is_admin ||
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role_title?.toLowerCase().includes('admin') ||
    currentUser.id === 'usr_rickard_wigrund'
  );

  const [activeWidgetIds, setActiveWidgetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Ladda användarens sparade widget-preferenser
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const ids = await getUserWidgetPreferences(currentUser.id, isAdmin);
      setActiveWidgetIds(ids);
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
    setActiveWidgetIds(newActiveIds);
    await saveUserWidgetPreferences(currentUser.id, newActiveIds);
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
    };

    switch (id) {
      case 'booster_score':
        return <BoosterScoreWidget {...props} />;
      case 'vcard_qr':
        return <VCardQrWidget {...props} />;
      case 'activity_ticker':
        return <ActivityTickerWidget {...props} />;
      case 'proximity_radar':
        return <ProximityRadarWidget {...props} />;
      case 'hub_presence':
        return <HubPresenceWidget {...props} />;
      case 'flex_booking':
        return <FlexBookingWidget {...props} />;
      case 'community_feed':
        return <CommunityFeedWidget {...props} />;
      case 'academy_progress':
        return <AcademyProgressWidget {...props} />;
      case 'notifications_inbox':
        return <NotificationsInboxWidget {...props} />;
      case 'tag_subscriptions':
        return <TagSubscriptionsWidget {...props} />;
      case 'admin_kpi_overview':
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
  const visibleWidgets = activeWidgetIds
    .map(id => WIDGET_REGISTRY[id])
    .filter((w): w is WidgetDefinition => {
      if (!w) return false;
      if (w.adminOnly && !isAdmin) return false;
      return true;
    });

  // Beräkna kolumnbreddsklass för Tailwind
  const getColSpanClass = (def: WidgetDefinition) => {
    if (def.defaultWidth === 'span-full') {
      return 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4';
    }
    if (def.defaultWidth === 'span-2') {
      return 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2';
    }
    return 'col-span-1';
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Topbar / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Personlig Dashboard
            </h1>
            {isAdmin && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
                Admin-läge
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Anpassa din vy med moduler för hubb, affärer, poäng och community
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-rose-400" />
            Anpassa Dashboard
          </button>
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
            Klicka på "Anpassa Dashboard" för att välja vilka verktyg du vill visa.
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
          {visibleWidgets.map(widget => {
            const spanClass = getColSpanClass(widget);
            return (
              <div key={widget.id} className={`${spanClass} flex flex-col`}>
                {renderWidgetComponent(widget.id)}
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
    </div>
  );
};
