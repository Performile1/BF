import React from 'react';
import { 
  Home, 
  MessageSquare, 
  Video, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CalendarDays,
  Star, 
  Gift, 
  Database,
  Trophy,
  GraduationCap,
  Building2,
  Tag
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'calendar'
  | 'coworking'
  | 'pipeline' 
  | 'gamification' 
  | 'academy' 
  | 'chat' 
  | 'webinars' 
  | 'matchmaking' 
  | 'events' 
  | 'skills' 
  | 'benefits' 
  | 'promos'
  | 'architecture';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadChatCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  unreadChatCount
}) => {
  const navItems = [
    { id: 'overview', label: 'Översikt', icon: Home },
    { id: 'calendar', label: 'Masterkalender V6', icon: CalendarDays },
    { id: 'coworking', label: 'Hubbar & Coworking V7', icon: Building2 },
    { id: 'pipeline', label: 'My Pipeline (CRM)', icon: TrendingUp },
    { id: 'gamification', label: 'Booster Score & Hub Battle', icon: Trophy },
    { id: 'academy', label: 'Akademi & Certifikat', icon: GraduationCap },
    { id: 'chat', label: 'Direktchatt & Intro', icon: MessageSquare, badge: unreadChatCount },
    { id: 'webinars', label: 'Webinar Engine', icon: Video, pulse: true },
    { id: 'matchmaking', label: 'AI Matchmaking', icon: Sparkles },
    { id: 'events', label: 'Event & Tillval', icon: Calendar },
    { id: 'skills', label: 'Skillbars & Omdömen', icon: Star },
    { id: 'benefits', label: 'Förmåner & Betalning', icon: Gift },
    { id: 'promos', label: 'Kampanjer & Fria Pass V7', icon: Tag },
    { id: 'architecture', label: 'Kravspec & Schema V7', icon: Database },
  ];

  const activeItem = navItems.find(item => item.id === activeTab);

  return (
    <nav className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex items-center justify-between gap-2">
      {/* Icon-only nav list with hover tooltip names */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id as ActiveTab)}
                title={item.label}
                aria-label={item.label}
                id={`nav-${item.id}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'text-gray-500 hover:bg-[#F4F5F7] hover:text-[#800020]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#800020]'}`} />

                {item.badge && item.badge > 0 ? (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white ${
                      isActive ? 'bg-amber-400 text-gray-900' : 'bg-[#800020] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}

                {item.pulse && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-1" />
                )}
              </button>

              {/* Hover Tooltip displaying the name */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="w-2 h-2 bg-gray-900 rotate-45 -mb-1" />
                <div className="bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl tracking-normal">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active module indicator on the right */}
      {activeItem && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F4F5F7] rounded-xl border border-gray-200 text-xs flex-shrink-0">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Aktiv vy:</span>
          <span className="font-bold text-[#800020]">{activeItem.label}</span>
        </div>
      )}
    </nav>
  );
};
