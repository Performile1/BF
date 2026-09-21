import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  AlertCircle, 
  RefreshCw,
  Receipt,
  UserPlus,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { WidgetComponentProps, AdminDashboardKpis } from '../../../types/widgets';
import { getAdminDashboardKpis } from '../../../lib/widgetServices';
import { AdminInspect } from '../../dev/AdminInspect';

// Valutaformaterare med Intl.NumberFormat enligt kravspecifikation
const sekCurrencyFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0
});

export const AdminKpiWidget: React.FC<WidgetComponentProps> = ({
  onNavigateTab
}) => {
  const [kpis, setKpis] = useState<AdminDashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDashboardKpis();
      if (!data) {
        throw new Error('Kunde inte läsa in KPI-data');
      }
      setKpis(data);
    } catch (err: any) {
      console.error('Kunde inte hämta admin KPI:', err);
      setError(err?.message || 'Ett oväntat fel inträffade vid hämtning av KPI-data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return (
    <AdminInspect
      component="AdminKpiWidget.tsx"
      sourceTable="RPC: public.get_admin_dashboard_kpis()"
      columns={['total_members', 'active_today', 'unpaid_invoices_sek', 'pipeline_value_sek', 'maintenance_mode']}
      notes="Returnerar samlad jsonb över hubb, medlemmar, deals och ekonomi"
      className="col-span-full"
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight">
                Admin KPI Översikt (Realtid)
              </h3>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Admin Exclusive
              </span>
              {/* Statusbricka om maintenance_mode är aktivt */}
              {kpis?.maintenance_mode && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider animate-pulse">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  Underhållsläge aktivt
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregerade nyckeltal för medlemmar, fakturor, affärspipeline och hubbnärvaro
            </p>
          </div>
        </div>

        <button
          onClick={fetchKpis}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
          title="Uppdatera KPI:er i realtid"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Felhantering med Försök igen-knapp */}
      {error && !loading && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchKpis}
            className="px-3 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold transition text-[11px] shrink-0"
          >
            Försök igen
          </button>
        </div>
      )}

      {/* Laddningsskelett */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40 animate-pulse space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-slate-700 rounded" />
                <div className="h-4 w-4 bg-slate-700 rounded-full" />
              </div>
              <div className="h-7 w-28 bg-slate-700 rounded" />
              <div className="h-3 w-36 bg-slate-700/60 rounded" />
            </div>
          ))}
        </div>
      ) : (
        /* 4 Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
          
          {/* Kort 1: Medlemsbas (aktiva, nya denna månad, trials, prospects) */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('admin')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-500 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">1. Medlemsbas</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {kpis?.total_members ?? 0}
                <span className="text-xs font-normal text-slate-400 ml-1.5">aktiva</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                <span className="text-emerald-400 font-bold">+{kpis?.new_members_this_month ?? 0} nya denna mån</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-medium">{kpis?.active_trials ?? 0} trials</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{kpis?.prospects_count ?? 0} prospects</span>
              </div>
            </div>
          </div>

          {/* Kort 2: Oreglerat / Fakturering (obetalda belopp i SEK, antal obetalda, varning för förfallna) */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('admin')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-500 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">2. Oreglerat / Fakturor</span>
              <Receipt className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {sekCurrencyFormatter.format(kpis?.unpaid_invoices_total_sek ?? 0)}
              </div>
              <div className="mt-2 text-[10px]">
                {(kpis?.unpaid_invoices_count ?? 0) > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-amber-300 font-bold">
                      {kpis?.unpaid_invoices_count} obetalda
                    </span>
                    {(kpis?.overdue_invoices_count ?? 0) > 0 && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-rose-400 font-bold inline-flex items-center gap-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {kpis?.overdue_invoices_count} förfallna
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-emerald-400 font-bold">Alla fakturor reglerade</span>
                )}
                <div className="text-slate-400 mt-1">
                  MRR: {sekCurrencyFormatter.format(kpis?.mrr_sek ?? 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Kort 3: Affärspipeline (antal aktiva affärer, totalt pipeline-värde, vunna avslut) */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('pipeline')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-500 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">3. Affärspipeline</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {sekCurrencyFormatter.format(kpis?.total_deals_closed_sek ?? 0)}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                <span className="text-amber-300 font-bold">
                  {kpis?.active_pipeline_deals_count ?? 0} aktiva affärer
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-bold">
                  {kpis?.won_deals_count ?? 0} vunna avslut
                </span>
              </div>
            </div>
          </div>

          {/* Kort 4: Närvaro i Hubben (incheckade just nu via v_who_is_at_hub_today, dagens bokningar) */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('coworking')}
            className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-500 transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">4. Närvaro i Hubben</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-white tracking-tight">
                  {kpis?.checked_in_now ?? 0}
                </div>
                <span className="text-xs text-purple-300 font-medium">incheckade nu</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span>{kpis?.today_hub_bookings ?? 0} bokningar idag</span>
                <span className="font-bold text-purple-400">{kpis?.hub_occupancy_percent ?? 0}% beläggning</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(kpis?.hub_occupancy_percent ?? 0, 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
    </AdminInspect>
  );
};
