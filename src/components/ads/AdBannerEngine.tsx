import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Eye, 
  MousePointer, 
  Plus, 
  X, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp,
  Megaphone,
  BarChart3,
  MapPin,
  Sliders,
  Maximize2,
  Layout
} from 'lucide-react';
import { BannerAd, AdFormat, AdPlacementType } from '../../types';
import { INITIAL_BANNER_ADS } from '../../data/communityAndMatchmakingData';
import { AdZonesVisualGuide } from './AdZonesVisualGuide';

export type AdZone = 'FEED_TOP' | 'COMMUNITY_FEED' | 'CALENDAR_SIDEBAR' | 'HUB_HEADER' | 'MEMBERS_DIRECTORY' | 'EVENT_LIST' | 'DASHBOARD_BENTO';

interface AdBannerEngineProps {
  zone: AdZone;
  isAdmin?: boolean;
  className?: string;
  onBookAdClick?: () => void;
}

// Fallback banner pool with default partner campaigns including width, height and format
const DEFAULT_EXPANDED_BANNERS: BannerAd[] = [
  ...INITIAL_BANNER_ADS,
  {
    id: 'ban_3',
    title: 'Boka Mötesrum & Studio med 20% Medlemsrabatt hos Helio',
    advertiser_name: 'Helio Workspace & Event',
    placement: 'FEED_TOP',
    image_url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://helio.se/sv/erbjudanden/booster-friends',
    is_active: true,
    impressions_count: 1120,
    clicks_count: 64,
    format: 'FULL_WIDTH',
    custom_height: 180,
    custom_width: '100%'
  },
  {
    id: 'ban_4',
    title: 'Scale-Up Juridik & Aktieägaravtal: Kostnadsfri 30 min Sparring',
    advertiser_name: 'Ekström & Partners Advokatbyrå',
    placement: 'CALENDAR_SIDEBAR',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    target_url: 'https://ekstromlaw.se/booster-b2b',
    is_active: true,
    impressions_count: 730,
    clicks_count: 39,
    format: 'SIDEBAR',
    custom_height: 340,
    custom_width: '320px'
  },
  {
    id: 'ban_5',
    title: 'Convendum Executive Members Club: Prova gratis en dag',
    advertiser_name: 'Convendum Coworking & Lounge',
    placement: 'HUB_HEADER',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://convendum.se',
    is_active: true,
    impressions_count: 512,
    clicks_count: 41,
    format: 'FULL_WIDTH',
    custom_height: 180,
    custom_width: '100%'
  },
  {
    id: 'ban_6',
    title: 'Exklusiv Headhunting & Executive Search för Booster Medlemmar',
    advertiser_name: 'Nordic Executive Talent',
    placement: 'MEMBERS_DIRECTORY',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://nordictalent.se',
    is_active: true,
    impressions_count: 880,
    clicks_count: 72,
    format: 'FULL_WIDTH',
    custom_height: 150,
    custom_width: '100%'
  },
  {
    id: 'ban_7',
    title: 'Säkra biljetter till Årets B2B Tillväxtgala med 15% rabatt',
    advertiser_name: 'Nordic Business Forum & Events',
    placement: 'EVENT_LIST',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://b2bgala.se',
    is_active: true,
    impressions_count: 420,
    clicks_count: 35,
    format: 'IN_FEED',
    custom_height: 160,
    custom_width: '100%'
  }
];

export const AdBannerEngine: React.FC<AdBannerEngineProps> = ({
  zone,
  isAdmin = false,
  className = '',
  onBookAdClick
}) => {
  const [banners, setBanners] = useState<BannerAd[]>(() => {
    try {
      const saved = localStorage.getItem(`booster_ads_${zone}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_EXPANDED_BANNERS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdminStats, setShowAdminStats] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVisualGuide, setShowVisualGuide] = useState(false);

  // New Banner Form State with size & placement configuration
  const [newTitle, setNewTitle] = useState('');
  const [newAdvertiser, setNewAdvertiser] = useState('');
  const [newPlacement, setNewPlacement] = useState<AdZone>(zone);
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80');
  
  // Format & Size States
  const [newFormat, setNewFormat] = useState<AdFormat>(zone === 'CALENDAR_SIDEBAR' ? 'SIDEBAR' : 'FULL_WIDTH');
  const [newCustomHeight, setNewCustomHeight] = useState<number>(zone === 'CALENDAR_SIDEBAR' ? 340 : 180);
  const [newCustomWidth, setNewCustomWidth] = useState<string>(zone === 'CALENDAR_SIDEBAR' ? '320px' : '100%');

  // Filter banners matching this zone (or fallback if zone is COMMUNITY_FEED, match FEED_TOP)
  const zoneBanners = banners.filter(b => {
    if (zone === 'COMMUNITY_FEED') {
      return (b.placement === 'FEED_TOP' || (b.placement as string) === 'COMMUNITY_FEED') && b.is_active;
    }
    return b.placement === zone && b.is_active;
  });

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= zoneBanners.length && zoneBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [zoneBanners.length, currentIndex]);

  // Track impressions on mount / banner display
  useEffect(() => {
    if (zoneBanners.length === 0) return;
    const currentAd = zoneBanners[currentIndex];
    if (!currentAd) return;

    setBanners(prev => {
      const updated = prev.map(b => 
        b.id === currentAd.id ? { ...b, impressions_count: (b.impressions_count || 0) + 1 } : b
      );
      try {
        localStorage.setItem(`booster_ads_${zone}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [currentIndex, zone]);

  // Handle Ad Click
  const handleBannerClick = (ad: BannerAd) => {
    setBanners(prev => {
      const updated = prev.map(b => 
        b.id === ad.id ? { ...b, clicks_count: (b.clicks_count || 0) + 1 } : b
      );
      try {
        localStorage.setItem(`booster_ads_${zone}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Create Banner with custom dimensions
  const handleCreateNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: BannerAd = {
      id: `ad_${Date.now()}`,
      title: newTitle || 'Exklusiv Partnerkampanj',
      advertiser_name: newAdvertiser || 'Booster Partner',
      placement: newPlacement || zone,
      image_url: newImageUrl,
      target_url: newTargetUrl || 'https://boosterfriends.se/partners',
      is_active: true,
      impressions_count: 0,
      clicks_count: 0,
      format: newFormat,
      custom_height: newCustomHeight,
      custom_width: newCustomWidth
    };

    const updated = [newAd, ...banners];
    setBanners(updated);
    try {
      localStorage.setItem(`booster_ads_${zone}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setShowCreateModal(false);
    setNewTitle('');
    setNewAdvertiser('');
    setNewTargetUrl('');
  };

  // Handle selection from visual guide
  const handleSelectFromGuide = (selectedZone: AdPlacementType, height: number, width: string) => {
    setNewPlacement(selectedZone as AdZone);
    setNewCustomHeight(height);
    setNewCustomWidth(width);
    setNewFormat(selectedZone === 'CALENDAR_SIDEBAR' ? 'SIDEBAR' : 'FULL_WIDTH');
    setShowVisualGuide(false);
    setShowCreateModal(true);
  };

  // If no ads configured for this zone, render sponsor invitation card
  if (zoneBanners.length === 0) {
    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-gray-50 via-amber-50/40 to-white border border-dashed border-amber-200 text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase tracking-wider">
                  Partnerplats {zone}
                </span>
                <span className="text-[11px] text-gray-500">Nå 500+ beslutsfattare</span>
              </div>
              <p className="text-xs font-bold text-gray-900 mt-0.5">
                Vill ditt bolag synas här som certifierad Booster Partner?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowVisualGuide(true)}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-50 transition flex items-center gap-1.5 shadow-2xs"
              title="Se var annonser kan visas och testa storlekar"
            >
              <Layout className="w-3.5 h-3.5 text-amber-700" />
              <span>Visuell guide</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Skapa Annons</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBookAdClick || (() => window.open('mailto:partner@boosterfriends.se?subject=Sponsring%20av%20Booster%20Portal', '_blank'))}
              className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#660018] transition flex items-center gap-1 shrink-0"
            >
              <span>Boka Annonsplats</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Guide Modal */}
        <AdZonesVisualGuide
          isOpen={showVisualGuide}
          onClose={() => setShowVisualGuide(false)}
          onSelectZoneToCreate={handleSelectFromGuide}
        />
      </>
    );
  }

  const activeAd = zoneBanners[currentIndex] || zoneBanners[0];
  const ctr = activeAd.impressions_count > 0 
    ? ((activeAd.clicks_count / activeAd.impressions_count) * 100).toFixed(1) 
    : '0.0';

  // Sizing styles for active banner
  const isSidebar = zone === 'CALENDAR_SIDEBAR' || activeAd.format === 'SIDEBAR';
  const effectiveHeight = activeAd.custom_height || (isSidebar ? 340 : 180);
  const effectiveWidth = activeAd.custom_width || (isSidebar ? '320px' : '100%');

  // ==========================================
  // Compact / Sidebar Variant (CALENDAR_SIDEBAR)
  // ==========================================
  if (isSidebar) {
    return (
      <>
        <div className={`space-y-2 ${className}`}>
          <div 
            className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:border-[#800020]/40 transition duration-200 flex flex-col justify-between"
            style={{
              minHeight: `${effectiveHeight}px`
            }}
          >
            {/* Top image with dynamic aspect */}
            <div className="relative h-32 w-full overflow-hidden bg-gray-900 shrink-0">
              <img 
                src={activeAd.image_url} 
                alt={activeAd.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Sponsrat Samarbete</span>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                <span>Sidopanel {effectiveHeight}px</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider block">
                  {activeAd.advertiser_name}
                </span>
                <h4 className="text-xs font-bold text-gray-900 leading-snug mt-0.5 line-clamp-2">
                  {activeAd.title}
                </h4>
              </div>

              <button
                onClick={() => handleBannerClick(activeAd)}
                className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-[#800020] text-gray-700 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-gray-200 hover:border-[#800020]"
              >
                <span>Se medlemserbjudande</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Guide & Admin Stats Bar */}
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowVisualGuide(true)}
                className="text-[#800020] font-bold hover:underline flex items-center gap-1"
                title="Öppna visuell guide över annonsplaceringar"
              >
                <Layout className="w-3 h-3" />
                <span>Visuell guide</span>
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono">👁️ {activeAd.impressions_count} | 🖱️ {activeAd.clicks_count}</span>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-[#800020] font-bold hover:underline"
                  >
                    + Ny
                  </button>
                </div>
              ) : (
                <span className="text-gray-400">Booster Partner</span>
              )}
            </div>
          </div>
        </div>

        {/* Visual Guide Modal */}
        <AdZonesVisualGuide
          isOpen={showVisualGuide}
          onClose={() => setShowVisualGuide(false)}
          onSelectZoneToCreate={handleSelectFromGuide}
        />
      </>
    );
  }

  // ==========================================
  // Full-width Landscape Variant (FEED_TOP, etc.)
  // ==========================================
  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <div 
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:border-[#800020]/40 transition duration-200"
          style={{
            minHeight: `${effectiveHeight}px`
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch h-full">
            
            {/* Banner Graphic Thumbnail with dynamic height */}
            <div 
              className="relative md:w-2/5 overflow-hidden bg-gray-900 shrink-0"
              style={{ minHeight: `${Math.min(effectiveHeight, 220)}px` }}
            >
              <img 
                src={activeAd.image_url} 
                alt={activeAd.title}
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 md:to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Sponsrat Samarbete</span>
              </div>
              <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[9px] font-mono text-white/80 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                <span>{effectiveWidth} × {effectiveHeight}px</span>
              </div>
            </div>

            {/* Banner Text & CTA */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider">
                      {activeAd.advertiser_name}
                    </span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                      {activeAd.format || 'Fullbredd'}
                    </span>
                  </div>
                  {zoneBanners.length > 1 && (
                    <div className="flex items-center gap-1">
                      {zoneBanners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`w-2 h-2 rounded-full transition ${
                            i === currentIndex ? 'bg-[#800020] w-4' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          title={`Visa annons ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 leading-snug">
                  {activeAd.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  Förmånligt nätverkserbjudande för medlemmar i Booster Friends. Klicka för att ta del av rabatten eller boka rådgivning.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Booster Friends Validerad Partner</span>
                  </div>

                  {/* Visual Guide trigger button */}
                  <button
                    type="button"
                    onClick={() => setShowVisualGuide(true)}
                    className="text-[#800020] font-bold hover:underline flex items-center gap-1 text-[11px]"
                    title="Öppna den visuella annonsguiden"
                  >
                    <Layout className="w-3 h-3" />
                    <span>Visuell guide</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setShowAdminStats(!showAdminStats)}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition flex items-center gap-1"
                      title="Visa analys"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Stats</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleBannerClick(activeAd)}
                    className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Ta del av erbjudandet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Admin Stats expansion */}
              {isAdmin && showAdminStats && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
                  <div className="flex items-center gap-4">
                    <span><strong>Visningar:</strong> {activeAd.impressions_count}</span>
                    <span><strong>Klick:</strong> {activeAd.clicks_count}</span>
                    <span><strong>CTR:</strong> {ctr}%</span>
                    <span><strong>Mått:</strong> {effectiveWidth} × {effectiveHeight}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowVisualGuide(true)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-[11px] hover:bg-amber-50"
                    >
                      🗺️ Zon-karta
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 text-amber-900 font-bold text-[11px] hover:bg-amber-300"
                    >
                      + Ny Kampanj
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Modal for creating a new ad with full sizing controls */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Skapa Sponsrad Partnerkampanj
                    </h3>
                    <p className="text-[11px] text-gray-500">Ställ in annonsinnehåll, placering och storlek</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewAd} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Annonsörens Namn / Bolag</label>
                  <input
                    type="text"
                    required
                    placeholder="t.ex. Convendum Coworking"
                    value={newAdvertiser}
                    onChange={e => setNewAdvertiser(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                {/* Placement Zone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Placering / Zon i appen</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowVisualGuide(true);
                      }}
                      className="text-[11px] text-[#800020] font-bold hover:underline flex items-center gap-1"
                    >
                      <Layout className="w-3 h-3" />
                      <span>Öppna visuell zon-guide</span>
                    </button>
                  </div>
                  <select
                    value={newPlacement}
                    onChange={e => {
                      const sel = e.target.value as AdZone;
                      setNewPlacement(sel);
                      if (sel === 'CALENDAR_SIDEBAR') {
                        setNewFormat('SIDEBAR');
                        setNewCustomHeight(340);
                        setNewCustomWidth('320px');
                      } else {
                        setNewFormat('FULL_WIDTH');
                        setNewCustomHeight(180);
                        setNewCustomWidth('100%');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-800 font-medium"
                  >
                    <option value="FEED_TOP">Hem / Feed Top (Fullbredd 100%)</option>
                    <option value="COMMUNITY_FEED">Community Flöde (In-Feed)</option>
                    <option value="CALENDAR_SIDEBAR">Masterkalender (Sidopanel 320px)</option>
                    <option value="HUB_HEADER">Hubbar & Coworking Sida (Header)</option>
                    <option value="MEMBERS_DIRECTORY">Medlemsregister (Leaderboard)</option>
                    <option value="EVENT_LIST">Events & Biljetter</option>
                    <option value="DASHBOARD_BENTO">Bento Dashboard (Grid-Widget)</option>
                  </select>
                </div>

                {/* Sizing Controls (Höjd & Bredd beroende på placering) */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Ställ in Annonsstorlek</span>
                    </span>
                    <span className="text-[11px] font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {newCustomWidth} × {newCustomHeight}px
                    </span>
                  </div>

                  {/* Format Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewFormat('FULL_WIDTH');
                        setNewCustomWidth('100%');
                        setNewCustomHeight(180);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newFormat === 'FULL_WIDTH'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Fullbredd (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewFormat('SIDEBAR');
                        setNewCustomWidth('320px');
                        setNewCustomHeight(340);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newFormat === 'SIDEBAR'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Sidopanel (320px)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewFormat('IN_FEED');
                        setNewCustomWidth('100%');
                        setNewCustomHeight(150);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newFormat === 'IN_FEED'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      In-Feed Kort
                    </button>
                  </div>

                  {/* Height Presets & Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-700">Höjd i pixlar:</span>
                      <span className="font-mono text-[#800020] font-bold">{newCustomHeight}px</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[130, 160, 180, 240, 340].map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setNewCustomHeight(h)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            newCustomHeight === h
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {h}px
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={440}
                      step={10}
                      value={newCustomHeight}
                      onChange={e => setNewCustomHeight(Number(e.target.value))}
                      className="w-full accent-[#800020] cursor-pointer"
                    />
                  </div>

                  {/* Width Presets */}
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-bold text-gray-700">Bredd-begränsning:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['100%', '320px', '360px', 'max-w-4xl', 'max-w-6xl'].map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setNewCustomWidth(w)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            newCustomWidth === w
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kampanjens Rubrik / Erbjudande</label>
                  <input
                    type="text"
                    required
                    placeholder="t.ex. 20% på Konferens & Mötesrum"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Länkadress (URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://partner.se/booster-deal"
                    value={newTargetUrl}
                    onChange={e => setNewTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bild-URL</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#660018]"
                  >
                    Publicera Kampanj
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Visual Guide Modal */}
      <AdZonesVisualGuide
        isOpen={showVisualGuide}
        onClose={() => setShowVisualGuide(false)}
        onSelectZoneToCreate={handleSelectFromGuide}
      />
    </>
  );
};
