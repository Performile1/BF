import React, { useState } from 'react';
import { Radio, ChevronRight, Bell, Sparkles, Pin } from 'lucide-react';
import { SystemActivityTickerEvent, TabType } from '../../types';

interface SystemTickerWidgetProps {
  events: SystemActivityTickerEvent[];
  onNavigate?: (tab: TabType) => void;
  onOpenPingModal?: () => void;
  className?: string;
  isEditMode?: boolean;
}

export const SystemTickerWidget: React.FC<SystemTickerWidgetProps> = ({
  events,
  onNavigate,
  onOpenPingModal,
  className = '',
  isEditMode = false
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const pinnedEvent = events.find(e => e.is_pinned_by_admin);

  const handleItemClick = (event: SystemActivityTickerEvent) => {
    if (event.event_type === 'COFFEE_PING' && onOpenPingModal) {
      onOpenPingModal();
      return;
    }
    if (event.target_tab && onNavigate) {
      onNavigate(event.target_tab);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-white/95 backdrop-blur border border-slate-200/80 rounded-2xl shadow-xs transition-all ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-3 px-3.5 py-2.5">
        {/* Live Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-[#800020] text-white rounded-lg text-[11px] font-black uppercase tracking-wider shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Radio className="w-3 h-3 text-amber-300" />
          <span>Live Ticker</span>
        </div>

        {/* Ticker Content Stream */}
        <div className="flex-1 min-w-0 overflow-hidden relative">
          <div
            className={`flex items-center gap-8 whitespace-nowrap transition-transform duration-500 ease-in-out ${
              isPaused ? '' : 'motion-safe:animate-none'
            }`}
          >
            {events.map((evt, idx) => {
              const isPinned = evt.is_pinned_by_admin;
              return (
                <button
                  key={evt.id}
                  onClick={() => handleItemClick(evt)}
                  className={`group inline-flex items-center gap-2 text-xs font-semibold transition-all py-1 px-2.5 rounded-lg text-left ${
                    isPinned
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                      : 'text-slate-700 hover:text-[#800020] hover:bg-slate-100/80'
                  }`}
                  title="Klicka för att gå till händelsen"
                >
                  {isPinned ? (
                    <Pin className="w-3 h-3 text-amber-600 shrink-0 fill-amber-500" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#800020] transition shrink-0" />
                  )}
                  <span className="truncate max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-none">
                    {evt.message}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-[#800020] group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Pause/Hover Indicator & Status */}
        <div className="shrink-0 hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200/80 text-[10px] text-slate-400">
          {isPaused ? (
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              Pausad (Klicka för länk)
            </span>
          ) : (
            <span className="font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Realtidsflöde
            </span>
          )}
        </div>

        {/* Edit mode indicator */}
        {isEditMode && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 bg-amber-500 rounded-full animate-ping" />
        )}
      </div>
    </div>
  );
};
