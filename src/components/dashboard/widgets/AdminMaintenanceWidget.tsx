import React, { useState, useEffect } from 'react';
import { AlertOctagon, Wrench, CheckCircle2, RefreshCw, Clock } from 'lucide-react';
import { WidgetComponentProps, SystemSettings } from '../../../types/widgets';
import { getSystemSettings, updateSystemSettings } from '../../../lib/widgetServices';
import { AdminInspect } from '../../dev/AdminInspect';

export const AdminMaintenanceWidget: React.FC<WidgetComponentProps> = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenance_mode: false,
    maintenance_message: 'Vi uppdaterar just nu Booster Friends. Vi beräknas vara tillbaka inom kort!',
    estimated_maintenance_end: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const fetchSettings = async () => {
    setLoading(false);
    const data = await getSystemSettings();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async () => {
    const nextVal = !settings.maintenance_mode;
    setUpdating(true);
    const res = await updateSystemSettings({
      maintenance_mode: nextVal,
      maintenance_message: settings.maintenance_message,
    });
    if (res.success) {
      setSettings(prev => ({ ...prev, maintenance_mode: nextVal }));
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 2500);
    }
    setUpdating(false);
  };

  const handleSaveMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUpdating(true);
    const res = await updateSystemSettings({
      maintenance_mode: settings.maintenance_mode,
      maintenance_message: settings.maintenance_message,
      estimated_maintenance_end: settings.estimated_maintenance_end,
    });
    if (res.success) {
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 2500);
    }
    setUpdating(false);
  };

  const setQuickDuration = (minutes: number | null) => {
    if (minutes === null) {
      setSettings(prev => ({ ...prev, estimated_maintenance_end: null }));
    } else {
      const targetTime = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      setSettings(prev => ({ ...prev, estimated_maintenance_end: targetTime }));
    }
  };

  return (
    <AdminInspect
      component="AdminMaintenanceToggleWidget.tsx"
      sourceTable="public.system_settings"
      columns={['key = maintenance_mode', 'value (jsonb)']}
      notes="Styr underhållsläget globalt via UPDATE på system_settings"
      className="h-full"
    >
      <div className={`rounded-3xl p-5 border shadow-xs flex flex-col justify-between h-full transition-all ${
      settings.maintenance_mode 
        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/50' 
        : 'bg-white border-gray-200/80 hover:border-gray-300'
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              settings.maintenance_mode ? 'bg-amber-500 text-black' : 'bg-rose-50 text-[#800020]'
            }`}>
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Underhållsläge</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                  Drift
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Stäng av åtkomst för icke-admins</p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={updating}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer disabled:opacity-50 ${
              settings.maintenance_mode ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              settings.maintenance_mode ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Status banner */}
        <div className={`p-3 rounded-2xl text-xs mb-3 flex items-center justify-between ${
          settings.maintenance_mode 
            ? 'bg-amber-100 text-amber-900 font-bold' 
            : 'bg-emerald-50 text-emerald-800 font-medium'
        }`}>
          <span>
            {settings.maintenance_mode 
              ? '⚠️ AKTIVT: Endast administratörer släpps igenom' 
              : '✓ NORMAL DRIFT: Alla medlemmar har full åtkomst'}
          </span>
          {successNotice && (
            <span className="text-[10px] text-emerald-700 font-black">Sparat!</span>
          )}
        </div>

        {/* Redigera meddelande och beräknad tid */}
        <form onSubmit={handleSaveMessage} className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-bold text-gray-600 mb-1">
              Driftmeddelande till besökare:
            </label>
            <textarea
              value={settings.maintenance_message}
              onChange={e => setSettings({ ...settings, maintenance_message: e.target.value })}
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs bg-white text-gray-800 focus:ring-1 focus:ring-[#800020] outline-hidden resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-600 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                Beräknat underhållsavslut:
              </span>
              {settings.estimated_maintenance_end ? (
                <span className="text-[#800020] font-mono">
                  {new Date(settings.estimated_maintenance_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ) : (
                <span className="text-gray-400 font-normal">Tillsvidare</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setQuickDuration(30)}
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] font-medium text-gray-700 cursor-pointer"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => setQuickDuration(60)}
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] font-medium text-gray-700 cursor-pointer"
              >
                +1h
              </button>
              <button
                type="button"
                onClick={() => setQuickDuration(120)}
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] font-medium text-gray-700 cursor-pointer"
              >
                +2h
              </button>
              <button
                type="button"
                onClick={() => setQuickDuration(null)}
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] font-medium text-gray-700 cursor-pointer"
              >
                Ingen tid
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] text-gray-400">
              Syns på spärrskärmen
            </span>
            <button
              type="submit"
              disabled={updating}
              className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-[10px] font-bold transition cursor-pointer disabled:opacity-50"
            >
              {updating ? 'Sparar...' : 'Spara inställningar'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AdminInspect>
  );
};
