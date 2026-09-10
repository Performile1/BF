import React, { useMemo } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CalendarDays, 
  Repeat, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Star, 
  Video, 
  Gift, 
  Tag, 
  TrendingUp, 
  Trophy, 
  Settings, 
  Shield, 
  Database,
  Sparkles,
  Calendar,
  CreditCard,
  Megaphone
} from 'lucide-react';

export type MainCategory = 
  | 'home' 
  | 'hub_events' 
  | 'community_network' 
  | 'academy_resources' 
  | 'business_profile';

export type SubTabId = 
  // 1. Hem
  | 'overview'
  | 'matchmaking'
  // 2. Hubben & Event
  | 'coworking'
  | 'calendar'
  | 'events'
  // 3. Community & Nätverk
  | 'community'
  | 'directory'
  | 'blog'
  | 'chat'
  | 'skills'
  // 4. Akademin & Resurser
  | 'academy'
  | 'webinars'
  | 'benefits'
  | 'promos'
  | 'advertise'
  // 5. Mina Affärer & Profil
  | 'pipeline'
  | 'gamification'
  | 'profile_settings'
  | 'membership'
  | 'admin'
  | 'architecture';

export type ActiveTab = SubTabId | MainCategory | string;

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  unreadChatCount: number;
  isAdmin?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  unreadChatCount,
  isAdmin = true
}) => {
  // Define the 5 primary main categories and their subtabs
  const mainCategories = useMemo(() => [
    {
      id: 'home' as MainCategory,
      number: '1',
      title: 'HEM',
      subtitle: 'Feed & Dashboard',
      icon: Home,
      defaultTab: 'overview',
      subtabs: [
        { id: 'overview', label: 'Bento Översikt', icon: Home },
        { id: 'matchmaking', label: 'Veckans AI-Matchningar', icon: Sparkles, badge: 'AI' }
      ]
    },
    {
      id: 'hub_events' as MainCategory,
      number: '2',
      title: 'HUBBEN & EVENT',
      subtitle: 'Flexplatser & Kalender',
      icon: Building2,
      defaultTab: 'coworking',
      subtabs: [
        { id: 'coworking', label: 'Boka Flexplats & Hubbar', icon: Building2 },
        { id: 'calendar', label: 'Kalender & Träffar', icon: CalendarDays },
        { id: 'events', label: 'Event & Tillval', icon: Calendar }
      ]
    },
    {
      id: 'community_network' as MainCategory,
      number: '3',
      title: 'COMMUNITY & NÄTVERK',
      subtitle: 'Forum, Register & Chatt',
      icon: Users,
      defaultTab: 'community',
      subtabs: [
        { id: 'community', label: 'Flöde & Forum', icon: Users },
        { id: 'directory', label: 'Sök Medlem & Följ', icon: Search },
        { id: 'blog', label: 'Medlemsbloggen', icon: BookOpen },
        { id: 'chat', label: 'Mina Chattar', icon: MessageSquare, countBadge: unreadChatCount },
        { id: 'skills', label: 'Skillbars & Omdömen', icon: Star }
      ]
    },
    {
      id: 'academy_resources' as MainCategory,
      number: '4',
      title: 'AKADEMIN & RESURSER',
      subtitle: 'Utbildning & Förmåner',
      icon: GraduationCap,
      defaultTab: 'academy',
      subtabs: [
        { id: 'academy', label: 'Kurser & Diplom', icon: GraduationCap },
        { id: 'webinars', label: 'Webinars', icon: Video, pulse: true },
        { id: 'benefits', label: 'Förmåner & Perks', icon: Gift },
        { id: 'promos', label: 'Kampanjer & Fria Pass', icon: Tag },
        { id: 'advertise', label: 'Annonsera & Banners', icon: Megaphone }
      ]
    },
    {
      id: 'business_profile' as MainCategory,
      number: '5',
      title: 'MINA AFFÄRER',
      subtitle: 'Pipeline & Profil',
      icon: Briefcase,
      defaultTab: 'pipeline',
      subtabs: [
        { id: 'pipeline', label: 'My Pipeline (CRM)', icon: TrendingUp },
        { id: 'gamification', label: 'Poäng & Status', icon: Trophy },
        { id: 'profile_settings', label: 'Min Profil & QR', icon: Settings },
        { id: 'membership', label: 'Medlemskap (/profile/membership)', icon: CreditCard },
        { id: 'admin', label: 'Admin-Panel', icon: Shield, adminOnly: true },
        { id: 'architecture', label: 'Kravspec & Schema', icon: Database }
      ]
    }
  ], [unreadChatCount]);

  // Determine active main category based on current activeTab
  const currentCategory = useMemo(() => {
    const found = mainCategories.find(cat => 
      cat.subtabs.some(sub => sub.id === activeTab) || cat.id === activeTab
    );
    return found || mainCategories[0];
  }, [activeTab, mainCategories]);

  const handleSelectMainCategory = (cat: typeof mainCategories[0]) => {
    // If the active tab already belongs to this category, keep it, otherwise switch to default
    const belongs = cat.subtabs.some(s => s.id === activeTab);
    if (!belongs) {
      setActiveTab(cat.defaultTab);
    }
  };

  return (
    <div className="space-y-2">
      {/* 1. PRIMARY 5-CATEGORY NAVIGATION BAR */}
      <nav className="bg-white rounded-2xl border border-gray-200 p-1.5 sm:p-2 shadow-xs" id="v12-primary-navigation">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {mainCategories.map(cat => {
            const Icon = cat.icon;
            const isCategoryActive = currentCategory.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectMainCategory(cat)}
                id={`main-nav-${cat.id}`}
                className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl transition-all duration-150 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-center sm:text-left relative group ${
                  isCategoryActive
                    ? 'bg-[#800020] text-white shadow-xs font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#800020]'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                  isCategoryActive 
                    ? 'bg-white/15 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:text-[#800020] group-hover:bg-[#800020]/10'
                }`}>
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <span className="hidden xl:inline text-[9px] font-bold opacity-60">
                      {cat.number}.
                    </span>
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-tight truncate leading-tight">
                      {cat.title}
                    </span>
                  </div>
                  <p className={`text-[10px] truncate hidden lg:block leading-tight ${
                    isCategoryActive ? 'text-white/80' : 'text-gray-400'
                  }`}>
                    {cat.subtitle}
                  </p>
                </div>

                {/* Sub-item notifications indicator */}
                {cat.id === 'community_network' && unreadChatCount > 0 && (
                  <span className={`absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white ${
                    isCategoryActive ? 'bg-amber-400 text-gray-900' : 'bg-[#800020] text-white'
                  }`}>
                    {unreadChatCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. SUB-NAVIGATION PILLS (Current Category Subtabs) */}
      <div className="bg-[#F8F9FA] rounded-xl border border-gray-200/80 px-2 py-1.5 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 px-2 flex-shrink-0 border-r border-gray-200 mr-0.5 hidden sm:flex">
          <currentCategory.icon className="w-3.5 h-3.5 text-[#800020]" />
          <span className="uppercase tracking-wider text-[10px] text-gray-500">
            {currentCategory.title}
          </span>
        </div>

        {currentCategory.subtabs.map(subtab => {
          if (subtab.adminOnly && !isAdmin) return null;
          const SubIcon = subtab.icon;
          const isSubActive = activeTab === subtab.id;

          return (
            <button
              key={subtab.id}
              onClick={() => setActiveTab(subtab.id)}
              id={`sub-nav-${subtab.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 ${
                isSubActive
                  ? 'bg-white text-[#800020] font-bold shadow-xs border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#800020]' : 'text-gray-400'}`} />
              <span>{subtab.label}</span>

              {subtab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-900">
                  {subtab.badge}
                </span>
              )}

              {subtab.countBadge && subtab.countBadge > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#800020] text-white">
                  {subtab.countBadge}
                </span>
              ) : null}

              {subtab.pulse && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
