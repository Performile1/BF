import React from 'react';
import { Activity, Sparkles, TrendingUp, UserPlus, Trophy, ChevronRight } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { AdminInspect } from '../../dev/AdminInspect';

export const ActivityTickerWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const events = [
    { id: '1', title: 'Ny medlem: Marcus Ekström (Affärsjuridik)', time: '12m sedan', type: 'NEW_MEMBER' },
    { id: '2', title: 'Affär stängd: Performile och Nordic Growth (125 000 kr)', time: '34m sedan', type: 'DEAL' },
    { id: '3', title: 'Sofia Lindqvist checkade in på Hubb Göteborg', time: '1h sedan', type: 'CHECKIN' },
    { id: '4', title: 'Elena Vance avslutade modulen "B2B Förhandling"', time: '2h sedan', type: 'ACADEMY' },
  ];

  return (
    <AdminInspect
      component="ActivityTickerWidget.tsx"
      sourceTable="public.activity_logs"
      columns={['event_type', 'description', 'created_at']}
      notes="Aktivitetsflöde och realtidshändelser i nätverket"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Aktivitetsflöde & Nätverk</h3>
              <p className="text-[10px] text-gray-500">Händelser i realtid</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-2 my-2">
          {events.map(ev => (
            <div key={ev.id} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                <span className="font-medium text-gray-800 truncate">{ev.title}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 shrink-0">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Direktflöde från systemet</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('community')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Visa hela flödet
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
    </AdminInspect>
  );
};
