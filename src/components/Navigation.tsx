import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CalendarDays, 
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
  Megaphone, 
  Sliders,
  ChevronDown,
  ChevronRight,
  Check,
  Layers,
  ArrowRight,
  Compass,
  SlidersHorizontal,
  LayoutGrid,
  Bookmark
} from 'lucide-react';
import { CategorySidebar } from './CategorySidebar';
import { AdminInspect } from './dev/AdminInspect';

export type MainCategory = 
  | 'home' 
  | 'hub_events' 
  | 'community_network' 
  | 'academy_resources' 
  | 'business_profile';

export type SubTabId = 
  // 1. Hem
  | 'overview'
  | 'dashboard_widgets'
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
  | 'edx_partners'
  | 'webinars'
  | 'benefits'
  | 'promos'
  | 'advertise'
  // 5. Mina Affärer & Profil
  | 'pipeline'
  | 'gamification'
  | 'profile_settings'
  | 'membership'
  | 'admin_hubs'
  | 'admin_members'
  | 'admin'
  | 'architecture';

export type ActiveTab = SubTabId | MainCategory | string;

export interface SubTabItem {
  id: SubTabId;
  label: string;
  description: string;
  icon: any;
  badge?: string;
  countBadge?: number;
  pulse?: boolean;
  adminOnly?: boolean;
}

export interface CategoryItem {
  id: MainCategory;
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  defaultTab: SubTabId;
  subtabs: SubTabItem[];
}

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  unreadChatCount: number;
  isAdmin?: boolean;
  isHubHost?: boolean;
  layout?: 'sidebar' | 'compact' | 'top';
  homeTab?: string;
  onLayoutChange?: (layout: 'sidebar' | 'compact' | 'top') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  unreadChatCount,
  isAdmin = false,
  isHubHost = false,
  layout = 'sidebar',
  homeTab = 'overview',
  onLayoutChange
}) => {
  const [search, setSearch] = useState('');
  const matches = (label: string) => label.toLocaleLowerCase('sv').includes(search.toLocaleLowerCase('sv'));
  // Start page preference
  const [preferredStartPage, setPreferredStartPage] = useState<string>(() => {
    try {
      return localStorage.getItem('bf_preferred_start_page') || 'overview';
    } catch {
      return 'overview';
    }
  });
  useEffect(() => {
    const sync = (event: Event) => setPreferredStartPage((event as CustomEvent<string>).detail);
    window.addEventListener('bf_start_page_changed', sync);
    return () => window.removeEventListener('bf_start_page_changed', sync);
  }, []);
  const [startPageToast, setStartPageToast] = useState<string | null>(null);

  const handleSetPreferredStartPage = (tabId: string, label: string) => {
    setPreferredStartPage(tabId);
    try {
      localStorage.setItem('bf_preferred_start_page', tabId);
      window.dispatchEvent(new CustomEvent('bf_start_page_changed', { detail: tabId }));
    } catch {}
    setStartPageToast(`"${label}" har sparats som din valda första sida!`);
    setTimeout(() => setStartPageToast(null), 3000);
  };

  // Navigation mode: 'dropdown' (new refined dropdowns) vs 'classic' (stacked second bar)
  const [navMode, setNavMode] = useState<'dropdown' | 'classic'>(() => {
    try {
      const saved = localStorage.getItem('bf_nav_mode');
      return saved === 'classic' ? 'classic' : 'dropdown';
    } catch {
      return 'dropdown';
    }
  });

  const handleToggleNavMode = (mode: 'dropdown' | 'classic') => {
    setNavMode(mode);
    try {
      localStorage.setItem('bf_nav_mode', mode);
    } catch {}
  };

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (catId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (navMode === 'dropdown') {
      setOpenDropdownId(catId);
    }
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 200);
  };

  const handleCategoryClick = (cat: CategoryItem) => {
    if (navMode === 'dropdown') {
      // Toggle dropdown on click
      if (openDropdownId === cat.id) {
        setOpenDropdownId(null);
      } else {
        setOpenDropdownId(cat.id);
      }
      // If the active tab doesn't belong to this category, switch to its default
      const belongs = cat.subtabs.some(s => s.id === activeTab);
      if (!belongs) {
        setActiveTab(cat.defaultTab);
      }
    } else {
      // Classic mode
      const belongs = cat.subtabs.some(s => s.id === activeTab);
      if (!belongs) {
        setActiveTab(cat.defaultTab);
      }
    }
  };

  // Define the 5 primary main categories with rich descriptions for the dropdowns
  const sourceCategories: CategoryItem[] = useMemo(() => [
    {
      id: 'home',
      number: '1',
      title: 'HEM',
      subtitle: 'Feed & Dashboards',
      icon: Home,
      defaultTab: 'overview',
      subtabs: [
        { 
          id: 'overview', 
          label: 'Bento Översikt', 
          description: 'Modern visuell dashboard med hero-kort, radar & nyckeltal', 
          icon: Home 
        },
        { 
          id: 'dashboard_widgets', 
          label: 'Modulär Dashboard', 
          description: 'Strukturerat 1–4 kolumners widget-grid för power users', 
          icon: Sliders, 
          badge: 'Widgets' 
        },
        { 
          id: 'matchmaking', 
          label: 'Veckans AI-Matchningar', 
          description: 'Intelligenta affärs- och sparringsförslag via AI', 
          icon: Sparkles, 
          badge: 'AI' 
        }
      ]
    },
    {
      id: 'hub_events',
      number: '2',
      title: 'HUBBEN & EVENT',
      subtitle: 'Flexplatser & Kalender',
      icon: Building2,
      defaultTab: 'coworking',
      subtabs: [
        { 
          id: 'coworking', 
          label: 'Boka Flexplats & Hubbar', 
          description: 'Skrivbordsbokning, tysta rum, hubbaccess och desk swaps', 
          icon: Building2 
        },
        { 
          id: 'calendar', 
          label: 'Kalender & Träffar', 
          description: 'Månadskalender, nätverksfrukostar, workshops & träffar', 
          icon: CalendarDays 
        },
        { 
          id: 'events', 
          label: 'Event & Tillval', 
          description: 'Kommande evenemang, middagar och gästlistor', 
          icon: Calendar 
        }
      ]
    },
    {
      id: 'community_network',
      number: '3',
      title: 'COMMUNITY & NÄTVERK',
      subtitle: 'Forum, Register & Chatt',
      icon: Users,
      defaultTab: 'community',
      subtabs: [
        { 
          id: 'community', 
          label: 'Flöde & Forum', 
          description: 'Diskussioner, samtal, frågor och nätverksflöde', 
          icon: Users 
        },
        { 
          id: 'directory', 
          label: 'Sök Medlem & Följ', 
          description: 'Komplett medlemsregister med sök, kompetens och ort', 
          icon: Search 
        },
        { 
          id: 'blog', 
          label: 'Medlemsbloggen', 
          description: 'Artiklar, kunskapsdelning och medlemsinlägg', 
          icon: BookOpen 
        },
        { 
          id: 'chat', 
          label: 'Mina Chattar', 
          description: 'Direktmeddelanden, grupper och hubbkanaler', 
          icon: MessageSquare, 
          countBadge: unreadChatCount 
        },
        { 
          id: 'skills', 
          label: 'Skillbars & Omdömen', 
          description: 'Kompetensprofiler, rekommendationer och intyg', 
          icon: Star 
        }
      ]
    },
    {
      id: 'academy_resources',
      number: '4',
      title: 'AKADEMIN & RESURSER',
      subtitle: 'Utbildning & Förmåner',
      icon: GraduationCap,
      defaultTab: 'academy',
      subtabs: [
        { 
          id: 'academy', 
          label: 'Kurser & Diplom', 
          description: 'Kompetensutveckling och Booster-certifieringar', 
          icon: GraduationCap 
        },
        { 
          id: 'edx_partners', 
          label: 'Utbildningspartners (edX, Coursera)', 
          description: 'Externa kurser, certifikat och partnerförmåner', 
          icon: Compass,
          badge: 'edX & Fler'
        },
        { 
          id: 'webinars', 
          label: 'Webinars', 
          description: 'Live-sändningar, expertseminarier och masterclasses', 
          icon: Video, 
          pulse: true 
        },
        { 
          id: 'benefits', 
          label: 'Förmåner & Perks', 
          description: 'Exklusiva partneravtal och medlemsrabatter', 
          icon: Gift 
        },
        { 
          id: 'promos', 
          label: 'Kampanjer & Fria Pass', 
          description: 'Dela ut VIP-provpass och bjud in gäster (+BP)', 
          icon: Tag 
        },
        { 
          id: 'advertise', 
          label: 'Annonsera & Banners', 
          description: 'Marknadsför dina tjänster internt i nätverket', 
          icon: Megaphone 
        }
      ]
    },
    {
      id: 'business_profile',
      number: '5',
      title: 'MINA AFFÄRER',
      subtitle: 'Pipeline & Profil',
      icon: Briefcase,
      defaultTab: 'pipeline',
      subtabs: [
        { 
          id: 'pipeline', 
          label: 'Pipeline', 
          description: 'Pågående B2B-affärer, prospekt och ordervärde', 
          icon: TrendingUp 
        },
        { 
          id: 'gamification', 
          label: 'Poäng & Status', 
          description: 'Booster Points, månadens utmaning och rankning', 
          icon: Trophy 
        },
        { 
          id: 'profile_settings', 
          label: 'Min Profil & QR', 
          description: 'Digitalt visitkort (vCard), 2FA-säkerhet & konto', 
          icon: Settings 
        },
        { 
          id: 'membership', 
          label: 'Medlemskap', 
          description: 'Nivåer (Gold/Silver), kvitton och uppgradering', 
          icon: CreditCard 
        },
        { 
          id: 'admin', 
          label: 'Admin-Panel', 
          description: 'Nätverksadministration, broadcast och systemdrift', 
          icon: Shield, 
          adminOnly: true 
        },
        { 
          id: 'architecture', 
          label: 'Kravspec & Schema', 
          description: 'Systemarkitektur, OpenAPI-spec och databasschema', 
          icon: Database,
          adminOnly: true 
        }
      ]
    }
  ], [unreadChatCount]);

  const mainCategories = [...sourceCategories];

  // Current category based on active tab
  const currentCategory = useMemo(() => {
    const found = mainCategories.find(cat => 
      cat.subtabs.some(sub => sub.id === activeTab) || cat.id === activeTab
    );
    return found || mainCategories[0];
  }, [activeTab, mainCategories]);

  // Current active subtab details
  const activeSubtabItem = useMemo(() => {
    for (const cat of mainCategories) {
      const sub = cat.subtabs.find(s => s.id === activeTab);
      if (sub) return { cat, sub };
    }
    return { cat: currentCategory, sub: currentCategory.subtabs[0] };
  }, [activeTab, currentCategory, mainCategories]);

  // Determine dropdown placement (left, center or right aligned)
  const getDropdownPlacementClass = (index: number) => {
    if (index === 0) return 'left-0';
    if (index === 1) return 'left-0 sm:left-4';
    if (index === 2) return 'left-1/2 -translate-x-1/2';
    if (index === 3) return 'right-0 sm:right-4';
    return 'right-0';
  };

  const settingsLinks = [
    { id: 'settings', label: 'Inställningar' },
    ...(isHubHost || isAdmin ? [{ id: 'hub_settings', label: 'Hubbinställningar' }] : []),
    ...(isAdmin ? [{ id: 'admin_settings', label: 'Admininställningar' }] : [])
  ];
  if (isAdmin && !mainCategories.some(cat => cat.id === ('admin_tools' as any))) {
    // Add an explicit admin category while preserving the existing portal destinations.
    mainCategories.push({ id: 'admin_tools' as any, number: '6', title: 'ADMIN', subtitle: 'Hubbar, medlemmar & inställningar', icon: Shield, defaultTab: 'admin', subtabs: [
      { id: 'admin', label: 'Adminöversikt', description: 'Översikt och befintliga verktyg', icon: Shield, adminOnly: true },
      { id: 'admin_hubs', label: 'Hantera hubbar', description: 'Skapa och redigera hubbar', icon: Building2, adminOnly: true },
      { id: 'admin_members', label: 'Hantera medlemmar', description: 'Medlemmar och medlemsnivåer', icon: Users, adminOnly: true },
      { id: 'admin_settings' as any, label: 'Admininställningar', description: 'Drift och adminverktyg', icon: Settings, adminOnly: true },
      { id: 'hub_settings' as any, label: 'Hubbinställningar', description: 'Inställningar för vald hubb', icon: Building2, adminOnly: true }
    ] });
  }
  const sidebarCategories = mainCategories.map(cat => ({ ...cat, subtabs: cat.subtabs.filter(tab => tab.id !== 'dashboard_widgets').map(tab => tab.id === 'overview' ? { ...tab, id: homeTab, label: 'Hem' } : tab) }));
  if (layout !== 'top') return <CategorySidebar categories={sidebarCategories} activeTab={activeTab} onNavigate={setActiveTab} compact={layout === 'compact'} onCompactChange={value => onLayoutChange?.(value ? 'compact' : 'sidebar')} isAdmin={isAdmin} isHubHost={isHubHost} unreadChatCount={unreadChatCount} />;

  return (
    <AdminInspect
      component="Navigation.tsx"
      sourceTable="Klient-State / Navigation"
      columns={['activeTab', 'navMode', 'isAdmin', 'unreadChatCount']}
      notes="5-kategoriers navigation med dropdown-meny och kontextremsa (Klient-hanterat UI-state)"
    >
      <div ref={navContainerRef} className="space-y-2.5 relative z-40 overflow-visible" onMouseLeave={handleMouseLeave}>
        <div className="flex flex-wrap gap-2">{settingsLinks.map(link => <button key={link.id} onClick={() => setActiveTab(link.id)} className="px-3 py-2 rounded-lg bg-white border text-sm">{link.label}</button>)}</div>
        {/* Start page saved notification banner */}
        {startPageToast && (
          <div className="bg-amber-500 text-gray-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center justify-between shadow-md border border-amber-400 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{startPageToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setStartPageToast(null)}
              className="text-gray-800 hover:text-black font-black text-xs ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* 1. PRIMARY NAVIGATION BAR WITH DROPDOWN TRIGGERS */}
        <nav 
          className="bg-white rounded-2xl border border-gray-200/90 p-1.5 sm:p-2 shadow-xs relative z-30" 
          id="v12-primary-navigation"
        >
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {mainCategories.map((cat, catIndex) => {
              const Icon = cat.icon;
              const isCategoryActive = currentCategory.id === cat.id;
              const isDropdownOpen = openDropdownId === cat.id;
              const activeSubInThisCat = cat.subtabs.find(s => s.id === activeTab);

              return (
                <div 
                  key={cat.id} 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    id={`main-nav-${cat.id}`}
                    aria-expanded={isDropdownOpen}
                    className={`w-full py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl transition-all duration-150 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-center sm:text-left relative group cursor-pointer ${
                      isCategoryActive
                        ? 'bg-[#800020] text-white shadow-xs font-bold'
                        : isDropdownOpen
                          ? 'bg-rose-50 text-[#800020] font-bold border border-rose-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#800020]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                        isCategoryActive 
                          ? 'bg-white/15 text-white' 
                          : isDropdownOpen
                            ? 'bg-[#800020] text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:text-[#800020] group-hover:bg-[#800020]/10'
                      }`}>
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>

                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <span className="hidden xl:inline text-[9px] font-bold opacity-60">
                            {cat.number}.
                          </span>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight truncate leading-tight">
                            {cat.title}
                          </span>
                        </div>
                        
                        {/* Subtitle / Active indicator */}
                        <p className={`text-[10px] truncate hidden md:block leading-tight font-medium ${
                          isCategoryActive 
                            ? 'text-white/85' 
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`}>
                          {isCategoryActive && activeSubInThisCat 
                            ? activeSubInThisCat.label 
                            : cat.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Chevron Indicator & Notification Counters */}
                    <div className="flex items-center gap-1 shrink-0">
                      {cat.id === 'community_network' && unreadChatCount > 0 && (
                        <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white ${
                          isCategoryActive ? 'bg-amber-400 text-gray-900' : 'bg-[#800020] text-white'
                        }`}>
                          {unreadChatCount}
                        </span>
                      )}

                      {navMode === 'dropdown' && (
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-200 hidden sm:block ${
                            isDropdownOpen 
                              ? 'rotate-180 text-current' 
                              : isCategoryActive 
                                ? 'text-white/70' 
                                : 'text-gray-400 group-hover:text-gray-600'
                          }`} 
                        />
                      )}
                    </div>
                  </button>

                  {/* ======================================================== */}
                  {/* FLOATING CATEGORY DROPDOWN MENU                          */}
                  {/* ======================================================== */}
                  {navMode === 'dropdown' && isDropdownOpen && (
                    <div 
                      className={`absolute top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200/90 shadow-2xl shadow-rose-950/10 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 ${getDropdownPlacementClass(catIndex)}`}
                    >
                      {/* Dropdown Header */}
                      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-xl mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#800020]" />
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Kategori {cat.number}
                            </span>
                            <h4 className="text-xs font-black text-gray-900">
                              {cat.title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {cat.subtabs.length} val
                        </span>
                      </div>

                      {/* Subtab Options List */}
                      <div className="space-y-1">
                        {cat.subtabs.map(subtab => {
                          if (subtab.adminOnly && !isAdmin) return null;
                          const SubIcon = subtab.icon;
                          const isSubActive = activeTab === subtab.id;

                          return (
                            <div
                              key={subtab.id}
                              id={`sub-nav-${subtab.id}`}
                              className={`w-full p-2.5 rounded-xl transition-all flex items-start justify-between gap-3 text-left group ${
                                isSubActive
                                  ? 'bg-[#800020]/10 text-[#800020] border border-[#800020]/25 shadow-2xs font-bold'
                                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-950'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab(subtab.id);
                                  setOpenDropdownId(null);
                                }}
                                className="flex items-start gap-2.5 min-w-0 flex-1 text-left cursor-pointer focus:outline-none"
                              >
                                <div className={`p-2 rounded-xl shrink-0 transition ${
                                  isSubActive
                                    ? 'bg-[#800020] text-white shadow-2xs'
                                    : 'bg-gray-100 text-gray-500 group-hover:bg-[#800020]/10 group-hover:text-[#800020]'
                                }`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold truncate">
                                      {subtab.label}
                                    </span>
                                    {subtab.adminOnly && (
                                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase">
                                        Admin
                                      </span>
                                    )}
                                    {subtab.badge && (
                                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-900">
                                        {subtab.badge}
                                      </span>
                                    )}
                                    {subtab.pulse && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-500 line-clamp-1 leading-snug mt-0.5">
                                    {subtab.description}
                                  </p>
                                </div>
                              </button>

                              <div className="flex items-center gap-1 shrink-0 pt-1">
                                {subtab.countBadge && subtab.countBadge > 0 && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#800020] text-white">
                                    {subtab.countBadge}
                                  </span>
                                )}

                                {/* Set as start page button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetPreferredStartPage(subtab.id, subtab.label);
                                  }}
                                  className={`p-1 rounded-md transition cursor-pointer ${
                                    preferredStartPage === subtab.id
                                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                      : 'text-gray-300 hover:text-amber-600 hover:bg-gray-100'
                                  }`}
                                  title={preferredStartPage === subtab.id ? 'Vald som din första sida' : 'Sätt som min första sida'}
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${preferredStartPage === subtab.id ? 'fill-current' : ''}`} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab(subtab.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="cursor-pointer focus:outline-none"
                                >
                                  {isSubActive ? (
                                    <Check className="w-4 h-4 text-[#800020] shrink-0" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition shrink-0" />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="pt-2 mt-1.5 border-t border-gray-100 px-2 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Klicka för att öppna direkt</span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(cat.defaultTab);
                            setOpenDropdownId(null);
                          }}
                          className="text-[#800020] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <span>Till huvudsida</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* 2. REFINED CONTEXT BAR / BREADCRUMBS OR CLASSIC PILLS */}
        {navMode === 'dropdown' ? (
          /* ======================================================== */
          /* SLIM CONTEXT & BREADCRUMB BAR (Clean Dropdown Flow)       */
          /* ======================================================== */
          <div className="bg-[#F8F9FA] rounded-xl border border-gray-200/80 px-3 py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs text-xs">
            {/* Breadcrumb location */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                <Compass className="w-3.5 h-3.5 text-[#800020]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {activeSubtabItem.cat.title}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-bold text-gray-900 truncate">
                <activeSubtabItem.sub.icon className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                <span className="truncate">{activeSubtabItem.sub.label}</span>
                {activeSubtabItem.sub.badge && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900">
                    {activeSubtabItem.sub.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Sibling Switcher + Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap shrink-0">
              {/* Sibling fast-switch pills in current category */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {currentCategory.subtabs.map(sub => {
                  if (sub.adminOnly && !isAdmin) return null;
                  const isCurrent = activeTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTab(sub.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-white text-[#800020] shadow-2xs border border-gray-200'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                      }`}
                    >
                      <sub.icon className={`w-3 h-3 ${isCurrent ? 'text-[#800020]' : 'text-gray-400'}`} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="h-3.5 w-px bg-gray-200 hidden sm:block" />

              {/* Navigation Flow Toggle */}
              <button
                type="button"
                onClick={() => handleToggleNavMode('classic')}
                className="text-[10px] font-bold text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-200/60 transition flex items-center gap-1 cursor-pointer shrink-0"
                title="Växla till klassisk tvåradig menyrad under kategorierna"
              >
                <SlidersHorizontal className="w-3 h-3 text-gray-400" />
                <span className="hidden md:inline">Klassisk rad</span>
              </button>

              <div className="h-3.5 w-px bg-gray-200 hidden sm:block" />

              {/* Set Current Tab as First Page */}
              <button
                type="button"
                onClick={() => handleSetPreferredStartPage(activeSubtabItem.sub.id, activeSubtabItem.sub.label)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md transition flex items-center gap-1 cursor-pointer shrink-0 ${
                  preferredStartPage === activeSubtabItem.sub.id
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-gray-500 hover:text-amber-800 hover:bg-amber-50'
                }`}
                title={preferredStartPage === activeSubtabItem.sub.id ? 'Detta är din valda första sida vid inloggning' : 'Välj denna flik som din första sida'}
              >
                <Bookmark className={`w-3 h-3 ${preferredStartPage === activeSubtabItem.sub.id ? 'fill-current text-amber-700' : 'text-gray-400'}`} />
                <span className="hidden lg:inline">{preferredStartPage === activeSubtabItem.sub.id ? 'Första sida' : 'Sätt som start'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* CLASSIC 2ND BAR: Sub-Navigation Pills                    */
          /* ======================================================== */
          <div className="bg-[#F8F9FA] rounded-xl border border-gray-200/80 px-2 py-1.5 flex items-center justify-between gap-1 sm:gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar flex-1">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
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

            {/* Actions: Start Page Bookmark & Toggle back to dropdown mode */}
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => handleSetPreferredStartPage(activeSubtabItem.sub.id, activeSubtabItem.sub.label)}
                className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                  preferredStartPage === activeSubtabItem.sub.id
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-gray-500 border-gray-200 hover:text-amber-800 hover:bg-amber-50'
                }`}
                title={preferredStartPage === activeSubtabItem.sub.id ? 'Vald som din första sida' : 'Sätt aktiv sida som första sida'}
              >
                <Bookmark className={`w-3 h-3 ${preferredStartPage === activeSubtabItem.sub.id ? 'fill-current text-amber-700' : 'text-gray-400'}`} />
                <span className="hidden md:inline">{preferredStartPage === activeSubtabItem.sub.id ? 'Första sida' : 'Start'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleNavMode('dropdown')}
                className="text-[10px] font-bold text-[#800020] hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition flex items-center gap-1 cursor-pointer shrink-0"
                title="Växla till modern dropdown-meny"
              >
                <LayoutGrid className="w-3 h-3 text-[#800020]" />
                <span className="hidden sm:inline">Dropdown-läge</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminInspect>
  );
};
