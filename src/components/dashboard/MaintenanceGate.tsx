import React, { useState, useEffect } from 'react';
import { AlertOctagon, Wrench, ShieldAlert, RefreshCw, LogIn, PowerOff } from 'lucide-react';
import { Member } from '../../types';
import { SystemSettings } from '../../types/widgets';
import { getSystemSettings, updateSystemSettings } from '../../lib/widgetServices';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { AdminInspect } from '../dev/AdminInspect';

interface MaintenanceGateProps {
  currentUser: Member | null;
  children: React.ReactNode;
  onOpenAuth?: () => void;
}

export const MaintenanceGate: React.FC<MaintenanceGateProps> = ({
  currentUser,
  children,
  onOpenAuth,
}) => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenance_mode: false,
    maintenance_message: 'Vi uppdaterar just nu Booster Friends med nya nätverksfunktioner. Vi beräknas vara tillbaka inom kort!',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isDisabling, setIsDisabling] = useState<boolean>(false);

  const fetchSettings = async () => {
    try {
      const data = await getSystemSettings();
      setSettings(data);
    } catch (e) {
      console.warn('Maintenance check failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // 1. Supabase Realtime prenumeration på system_settings
    let realtimeChannel: any = null;
    if (isSupabaseConfigured) {
      try {
        realtimeChannel = supabase
          .channel('realtime_system_settings_maintenance')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'system_settings' },
            () => {
              fetchSettings();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription error on system_settings:', err);
      }
    }

    // 2. Lyssna även på storage-events om en admin ändrar i samma flik/fönster
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'booster_system_settings') {
        fetchSettings();
      }
    };
    const handleCustomUpdate = () => {
      fetchSettings();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('booster_system_settings_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('booster_system_settings_updated', handleCustomUpdate);
      if (realtimeChannel && isSupabaseConfigured) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  const isAdmin = Boolean(
    currentUser?.is_admin ||
    (currentUser as any)?.profiles?.is_admin ||
    currentUser?.role === 'SUPER_ADMIN' ||
    currentUser?.role === 'ADMIN' ||
    (currentUser as any)?.profiles?.role === 'SUPER_ADMIN' ||
    currentUser?.role_title?.toLowerCase().includes('admin') ||
    currentUser?.id === 'usr_rickard_wigrund' ||
    currentUser?.email === 'wigrund81@gmail.com'
  );

  const handleDisableMaintenance = async () => {
    setIsDisabling(true);
    try {
      await updateSystemSettings({ maintenance_mode: false });
      setSettings(prev => ({ ...prev, maintenance_mode: false }));
    } catch (err) {
      console.error('Kunde inte stänga av underhållsläge:', err);
    } finally {
      setIsDisabling(false);
    }
  };

  // Om underhållsläge INTE är aktivt -> Släpp igenom helt utan layout-shift
  if (!settings.maintenance_mode) {
    return <>{children}</>;
  }

  // Om underhållsläge ÄR aktivt OCH användaren ÄR ADMIN:
  // Släpp igenom med en fast varningsbanner högst upp med direktknapp för att inaktivera
  if (isAdmin) {
    return (
      <div className="relative w-full">
        <AdminInspect
          component="MaintenanceBanner.tsx"
          sourceTable="public.system_settings"
          columns={['maintenance_mode', 'maintenance_message', 'estimated_maintenance_end']}
          notes="Realtidsprenumeration via Supabase Realtime"
          className="w-full"
        >
          <div className="bg-amber-500 text-black px-4 py-2 text-xs font-black flex flex-wrap items-center justify-between gap-2 shadow-md z-50 sticky top-0 border-b border-amber-600/30">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-black animate-pulse shrink-0" />
              <span>
                UNDERHÅLLSLÄGE AKTIVT FÖR MEDLEMMAR — Du har administratörsåtkomst (Bypass aktiv)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium hidden md:inline opacity-90">
                "{settings.maintenance_message}"
              </span>
              <button
                onClick={handleDisableMaintenance}
                disabled={isDisabling}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black text-white hover:bg-slate-900 text-[11px] font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                title="Stäng av underhållsläge direkt"
              >
                <PowerOff className="w-3 h-3 text-amber-400" />
                {isDisabling ? 'Avaktiverar...' : 'Inaktivera underhåll'}
              </button>
              <button
                onClick={fetchSettings}
                className="p-1 hover:bg-amber-600/30 rounded transition text-black"
                title="Uppdatera status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </AdminInspect>
        {children}
      </div>
    );
  }

  // Om underhållsläge ÄR aktivt och användaren INTE är Admin:
  // Blockera sidan helt och visa en ren fullskärmsvy med uppdateringsinformation, beräknad återkomsttid och länk till admininloggning
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Bakgrundsdekor */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center relative z-10">
        {/* Logotyp / Ikon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#800020] to-rose-950 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-950/50">
          <Wrench className="w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          Planerat Underhåll
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
          Booster Friends uppdateras
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          {settings.maintenance_message}
        </p>

        {settings.estimated_maintenance_end && (
          <div className="mb-6 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Beräknat klart:</span>{' '}
            {new Date(settings.estimated_maintenance_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={fetchSettings}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#9a0027] text-white text-xs font-bold transition shadow-lg shadow-rose-950/50 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Kontrollera igen
          </button>

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Admin-inloggning
            </button>
          )}
        </div>

        <div className="mt-6 text-[11px] text-slate-500">
          Behöver du akut support? Kontakta{' '}
          <a href="mailto:support@boosterfriends.se" className="text-rose-400 hover:underline">
            support@boosterfriends.se
          </a>
        </div>
      </div>
    </div>
  );
};
