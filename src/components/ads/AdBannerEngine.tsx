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
  BarChart3
} from 'lucide-react';
import { BannerAd } from '../../types';
import { INITIAL_BANNER_ADS } from '../../data/communityAndMatchmakingData';

export type AdZone = 'FEED_TOP' | 'COMMUNITY_FEED' | 'CALENDAR_SIDEBAR' | 'HUB_HEADER';

interface AdBannerEngineProps {
  zone: AdZone;
  isAdmin?: boolean;
  className?: string;
  onBookAdClick?: () => void;
}

// Fallback banner pool with default partner campaigns
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
    clicks_count: 64
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
    clicks_count: 39
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

  // New Banner Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAdvertiser, setNewAdvertiser] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80');

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

  // Create Banner
  const handleCreateNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: BannerAd = {
      id: `ad_${Date.now()}`,
      title: newTitle || 'Exklusiv Partnerkampanj',
      advertiser_name: newAdvertiser || 'Booster Partner',
      placement: zone === 'COMMUNITY_FEED' ? 'FEED_TOP' : zone,
      image_url: newImageUrl,
      target_url: newTargetUrl || 'https://boosterfriends.se/partners',
      is_active: true,
      impressions_count: 0,
      clicks_count: 0
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

  // If no ads configured for this zone, render sponsor invitation card
  if (zoneBanners.length === 0) {
    return (
      <div className={`p-4 rounded-2xl bg-linear-to-r from-gray-50 via-amber-50/40 to-white border border-dashed border-amber-200 text-gray-700 flex items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
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
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Skapa Annons</span>
            </button>
          )}
          <button
            onClick={onBookAdClick || (() => window.open('mailto:partner@boosterfriends.se?subject=Sponsring%20av%20Booster%20Portal', '_blank'))}
            className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#660018] transition flex items-center gap-1 shrink-0"
          >
            <span>Boka Annonsplats</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const activeAd = zoneBanners[currentIndex] || zoneBanners[0];
  const ctr = activeAd.impressions_count > 0 
    ? ((activeAd.clicks_count / activeAd.impressions_count) * 100).toFixed(1) 
    : '0.0';

  // Compact Sidebar Variant
  if (zone === 'CALENDAR_SIDEBAR') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:border-[#800020]/40 transition duration-200">
          {/* Top image */}
          <div className="relative h-28 w-full overflow-hidden bg-gray-900">
            <img 
              src={activeAd.image_url} 
              alt={activeAd.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Sponsrat Samarbete</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3.5 space-y-2">
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

          {/* Admin Stats Bar */}
          {isAdmin && (
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
              <span className="font-mono">👁️ {activeAd.impressions_count} | 🖱️ {activeAd.clicks_count} ({ctr}%)</span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[#800020] font-bold hover:underline"
              >
                + Ny
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full-width Landscape Variant (FEED_TOP & COMMUNITY_FEED)
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:border-[#800020]/40 transition duration-200">
        <div className="flex flex-col md:flex-row items-stretch">
          
          {/* Banner Graphic Thumbnail */}
          <div className="relative md:w-2/5 h-36 md:h-auto overflow-hidden bg-gray-900 shrink-0">
            <img 
              src={activeAd.image_url} 
              alt={activeAd.title}
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/30 md:to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Sponsrat Samarbete</span>
            </div>
          </div>

          {/* Banner Text & CTA */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider">
                  {activeAd.advertiser_name}
                </span>
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
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Booster Friends Validerad Partner</span>
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
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-2 py-1 rounded-lg bg-amber-200 text-amber-900 font-bold text-[11px] hover:bg-amber-300"
                  >
                    + Ny Kampanj
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Modal for creating a new ad if admin */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#800020]" />
                <span>Skapa Sponsrad Partnerkampanj ({zone})</span>
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAd} className="space-y-3">
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
  );
};
