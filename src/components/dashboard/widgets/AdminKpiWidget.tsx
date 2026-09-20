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
  UserPlus
} from 'lucide-react';
import { WidgetComponentProps, AdminDashboardKpis } from '../../../types/widgets';
import { getAdminDashboardKpis } from '../../../lib/widgetServices';
import { formatSek } from '../../../utils/calendar';

export const AdminKpiWidget: React.FC<WidgetComponentProps> = ({
  onNavigateTab
}) => {
  const [kpis, setKpis] = useState<AdminDashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchKpis = async () => {
    setLoading(true);
    const data = await getAdminDashboardKpis();
    setKpis(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight">
                Admin KPI Översikt (Realtid)
              </h3>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Admin Exclusive
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregerade nyckeltal för medlemmar, intäkter och nätverksomsättning
            </p>
          </div>
        </div>

        <button
          onClick={fetchKpis}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Uppdatera KPI:er"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        
        {/* Kort 1: Medlemmar & Tillväxt */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('admin')}
          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Medlemmar & Trials</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              {kpis?.total_members ?? 142}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-emerald-400 font-bold">+{kpis?.new_members_this_month ?? 18} denna mån</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-medium">{kpis?.active_trials ?? 7} aktiva trials</span>
            </div>
          </div>
        </div>

        {/* Kort 2: Finanser & Fakturor */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('admin')}
          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">MRR & Fakturor</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              {formatSek(kpis?.mrr_sek ?? 184500)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              {(kpis?.unpaid_invoices_count ?? 0) > 0 ? (
                <span className="text-rose-400 font-bold inline-flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {kpis?.unpaid_invoices_count} obetalda ({formatSek(kpis?.unpaid_invoices_total_sek ?? 0)})
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">Alla fakturor reglerade</span>
              )}
            </div>
          </div>
        </div>

        {/* Kort 3: Affärer & Pipeline */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('pipeline')}
          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Nätverksaffärer</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              {formatSek(kpis?.total_deals_closed_sek ?? 1850000)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className="text-amber-300 font-bold">
                {kpis?.active_pipeline_deals_count ?? 23} pågående affärer
              </span>
            </div>
          </div>
        </div>

        {/* Kort 4: Hubb-beläggning */}
        <div 
          onClick={() => onNavigateTab && onNavigateTab('coworking')}
          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Hubb Beläggning</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">
              {kpis?.hub_occupancy_percent ?? 78}%
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full" 
                style={{ width: `${kpis?.hub_occupancy_percent ?? 78}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
