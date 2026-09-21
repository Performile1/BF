import React, { useState } from 'react';
import { 
  Layout, 
  Columns, 
  Maximize2, 
  Sliders, 
  Sparkles, 
  Eye, 
  MousePointer, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  X, 
  ChevronRight, 
  Info, 
  Monitor, 
  Smartphone, 
  Layers, 
  ShieldCheck,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { AdFormat, AdPlacementType, BannerAd } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

export interface AdZoneMeta {
  id: AdPlacementType;
  title: string;
  category: 'FULL_WIDTH' | 'SIDEBAR' | 'IN_FEED';
  badge: string;
  defaultWidth: string;
  defaultHeight: number;
  allowedHeights: { label: string; height: number }[];
  allowedWidths: { label: string; width: string }[];
  description: string;
  reach: string;
  audience: string;
  recommendedAspect: string;
  sampleImg: string;
  sampleHeadline: string;
  sampleAdvertiser: string;
}

export const AD_ZONES_CATALOG: AdZoneMeta[] = [
  {
    id: 'FEED_TOP',
    title: 'Huvudflöde / Home Top (Fullbredd)',
    category: 'FULL_WIDTH',
    badge: 'Premium Placering • Högst CTR',
    defaultWidth: '100%',
    defaultHeight: 180,
    allowedHeights: [
      { label: 'Kompakt (130px)', height: 130 },
      { label: 'Standard (180px)', height: 180 },
      { label: 'Panorama (240px)', height: 240 }
    ],
    allowedWidths: [
      { label: '100% Fullbredd', width: '100%' },
      { label: 'Max bredd (1140px)', width: 'max-w-6xl' },
      { label: 'Kompakt center (900px)', width: 'max-w-4xl' }
    ],
    description: 'Placerad direkt under toppmenyn på startsidan och Bento-dashboarden. Synlig för samtliga 500+ medlemmar direkt vid inloggning.',
    reach: '100% av aktiva medlemmar',
    audience: 'VD:ar, grundare och styrelseledamöter',
    recommendedAspect: '21:9 eller 16:9',
    sampleImg: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80',
    sampleHeadline: 'Exklusivt mötesrum & executive studio hos Helio – 20% medlemsrabatt',
    sampleAdvertiser: 'Helio Workspace & Lounge'
  },
  {
    id: 'CALENDAR_SIDEBAR',
    title: 'Masterkalender (Sidopanel)',
    category: 'SIDEBAR',
    badge: 'Fokuserad Sidopanel • Hög Konvertering',
    defaultWidth: '320px',
    defaultHeight: 340,
    allowedHeights: [
      { label: 'Medium Box (260px)', height: 260 },
      { label: 'Standard Kort (340px)', height: 340 },
      { label: 'Skyscraper (440px)', height: 440 }
    ],
    allowedWidths: [
      { label: 'Sidopanel Bredd (100% av panel)', width: '100%' },
      { label: 'Fast 320px', width: '320px' },
      { label: 'Fast 360px', width: '360px' }
    ],
    description: 'Följer med i högerkolumnen bredvid månadskalendern, frukostmöten och eventlistan. Perfekt för juridik, rådgivning, hotell och representation.',
    reach: '75% av mötesbokare',
    audience: 'Nätverkare som söker events & affärsmöjligheter',
    recommendedAspect: '4:3 eller 1:1',
    sampleImg: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    sampleHeadline: 'Kostnadsfri 30 min bolagsjuridisk sparring för scale-ups',
    sampleAdvertiser: 'Ekström & Partners Advokatbyrå'
  },
  {
    id: 'COMMUNITY_FEED',
    title: 'Community In-Feed (Sponsrat Inlägg)',
    category: 'IN_FEED',
    badge: 'Naturlig Interaktion • In-Feed',
    defaultWidth: '100%',
    defaultHeight: 160,
    allowedHeights: [
      { label: 'Kompakt In-Feed (130px)', height: 130 },
      { label: 'Standard (160px)', height: 160 },
      { label: 'Utökat Kort (210px)', height: 210 }
    ],
    allowedWidths: [
      { label: '100% av flödet', width: '100%' },
      { label: 'Max 800px', width: 'max-w-3xl' }
    ],
    description: 'Sömlöst integrerat i medlemsflödet mellan diskussionsinlägg, framgångshistorier och expertartiklar. Känns redaktionellt och personligt.',
    reach: '88% av dagliga besökare',
    audience: 'Aktiva diskussionsdeltagare & nätverkare',
    recommendedAspect: '16:9 eller 2:1',
    sampleImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    sampleHeadline: 'Headhunting av C-level techprofiler med rabatterat startpaket',
    sampleAdvertiser: 'Nordic Executive Talent'
  },
  {
    id: 'HUB_HEADER',
    title: 'Hubbar & Coworking (Topp-Banner)',
    category: 'FULL_WIDTH',
    badge: 'Fysiska Mötesplatser • Starkt Lokalt',
    defaultWidth: '100%',
    defaultHeight: 180,
    allowedHeights: [
      { label: 'Kompakt (130px)', height: 130 },
      { label: 'Standard (180px)', height: 180 },
      { label: 'Panorama (230px)', height: 230 }
    ],
    allowedWidths: [
      { label: '100% Fullbredd', width: '100%' },
      { label: 'Max 1100px', width: 'max-w-5xl' }
    ],
    description: 'Visas högst upp i sektionen för hubbar, coworking, lounger och satellitkontor i Stockholm, Göteborg och Malmö.',
    reach: '65% av aktiva medlemmar',
    audience: 'Entreprenörer på resande fot och kontorssökande',
    recommendedAspect: '21:9',
    sampleImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    sampleHeadline: 'Convendum Executive Members Club: Prova gratis en dag på Valhallavägen',
    sampleAdvertiser: 'Convendum Coworking'
  },
  {
    id: 'MEMBERS_DIRECTORY',
    title: 'Medlemskatalogen (B2B Search Leaderboard)',
    category: 'FULL_WIDTH',
    badge: 'B2B Inköpare • Direkt Sökfokus',
    defaultWidth: '100%',
    defaultHeight: 150,
    allowedHeights: [
      { label: 'Slank Leaderboard (120px)', height: 120 },
      { label: 'Standard (150px)', height: 150 },
      { label: 'Tydlig (190px)', height: 190 }
    ],
    allowedWidths: [
      { label: '100% Fullbredd', width: '100%' },
      { label: 'Max 1000px', width: 'max-w-5xl' }
    ],
    description: 'Placerad precis ovanför sök- och filterfälten i medlemskatalogen där bolag söker nya leverantörer, rådgivare och partners.',
    reach: '82% av inköpare',
    audience: 'Medlemmar som aktivt söker kompetens & leverantörer',
    recommendedAspect: '21:9 eller 3:1',
    sampleImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    sampleHeadline: 'Revisions- & skattekonsulter för tillväxtbolag – Första konsultationen ingår',
    sampleAdvertiser: 'BDO Advisory & Tax'
  },
  {
    id: 'DASHBOARD_BENTO',
    title: 'Bento Dashboard (Widget-Annons)',
    category: 'FULL_WIDTH',
    badge: 'Modulär • Valfri Storlek 1-4 Kolumner',
    defaultWidth: '100%',
    defaultHeight: 220,
    allowedHeights: [
      { label: 'Kompakt Widget (150px)', height: 150 },
      { label: 'Standard Bento (220px)', height: 220 },
      { label: 'Utökad (300px)', height: 300 }
    ],
    allowedWidths: [
      { label: '1 Kolumn (1K)', width: 'w-full' },
      { label: '2 Kolumner (2K)', width: 'w-full' },
      { label: 'Fullbredd (4K)', width: 'w-full' }
    ],
    description: 'Placeras som en valbar widget i användarens personliga Bento-grid på startsidan med flexibel kolumnbredd (1K - 4K) och höjd.',
    reach: 'Personlig layout hos medlemmar',
    audience: 'Individuellt anpassad placering',
    recommendedAspect: '16:9 eller Bento-format',
    sampleImg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    sampleHeadline: 'Säkra VIP-biljetter till Årets B2B Tillväxtgala med 15% partner-rabatt',
    sampleAdvertiser: 'Nordic Business Forum'
  }
];

interface AdZonesVisualGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZoneToCreate?: (zone: AdPlacementType, height: number, width: string) => void;
}

export const AdZonesVisualGuide: React.FC<AdZonesVisualGuideProps> = ({
  isOpen,
  onClose,
  onSelectZoneToCreate
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<AdPlacementType>('FEED_TOP');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Dynamic size configuration in the guide
  const currentZone = (selectedZoneId ? AD_ZONES_CATALOG.find(z => z.id === selectedZoneId) : undefined) || AD_ZONES_CATALOG[0] || {
    id: 'FEED_TOP',
    title: 'Huvudflöde',
    category: 'FULL_WIDTH',
    badge: '',
    defaultWidth: '100%',
    defaultHeight: 180,
    allowedHeights: [
      { label: 'Kompakt (130px)', height: 130 },
      { label: 'Standard (180px)', height: 180 },
      { label: 'Panorama (240px)', height: 240 }
    ],
    allowedWidths: [
      { label: '100% Fullbredd', width: '100%' },
      { label: 'Max bredd (1140px)', width: 'max-w-6xl' }
    ],
    description: '',
    reach: '',
    audience: '',
    recommendedAspect: '',
    sampleImg: '',
    sampleHeadline: '',
    sampleAdvertiser: ''
  };
  const [customHeight, setCustomHeight] = useState<number>(currentZone?.defaultHeight || 180);
  const [customWidth, setCustomWidth] = useState<string>(currentZone?.defaultWidth || '100%');

  // Update defaults when zone changes
  const handleZoneChange = (zoneId: AdPlacementType) => {
    setSelectedZoneId(zoneId);
    const z = AD_ZONES_CATALOG.find(item => item.id === zoneId);
    if (z) {
      setCustomHeight(z.defaultHeight);
      setCustomWidth(z.defaultWidth);
    }
  };

  if (!isOpen) return null;

  return (
    <AdminInspect
      component="AdZonesVisualGuide.tsx"
      sourceTable="public.ad_zones / banner_ads"
      columns={['id', 'placement', 'title', 'category', 'default_width', 'default_height', 'reach']}
      notes="Interaktiv katalog och förhandsgranskning av alla annonszoner och format"
    >
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#800020] text-white flex items-center justify-center shadow-xs">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900">
                  Visuell Annonsguide & Placeringar
                </h2>
                <span className="text-[10px] bg-[#800020]/10 text-[#800020] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Booster Ad Engine V12
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Översikt över alla annonszoner, rekommenderade mått och storleksjustering (Fullbredd vs Sidopanel).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl gap-1 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobil</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              title="Stäng guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* 1. Interactive Architectural Layout Map (Wireframe) */}
          <div className="bg-gray-900 text-white p-5 rounded-2xl border border-gray-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Plattforms-Karta: Klicka på en zon för att inspektera
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">
                Aktiv zon: <strong className="text-amber-300">{currentZone.title}</strong>
              </span>
            </div>

            {/* Wireframe Mockup of Booster Friends */}
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3 max-w-4xl mx-auto">
              
              {/* Fake App Top Nav */}
              <div className="h-8 bg-gray-800/80 rounded-lg flex items-center justify-between px-3 text-[10px] text-gray-400">
                <span className="font-black text-[#800020] bg-white px-2 py-0.5 rounded">BOOSTER FRIENDS</span>
                <span className="hidden sm:inline">Home • Kalender • Medlemmar • Community • Hubbar</span>
                <span>👤 Mitt Konto</span>
              </div>

              {/* Zone A: Feed Top Full Width */}
              <button
                type="button"
                onClick={() => handleZoneChange('FEED_TOP')}
                className={`w-full p-2.5 rounded-lg text-left transition border flex items-center justify-between text-xs ${
                  selectedZoneId === 'FEED_TOP'
                    ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">1</span>
                  <span className="font-bold">Zon 1: Home / Feed Top (Fullbredd Panorama)</span>
                </div>
                <span className="text-[10px] opacity-80">Fullbredd (100% × 180px)</span>
              </button>

              {/* Two Column Section in Wireframe (Left Content / Right Sidebar) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Left: Main feeds & Hubs (2 cols) */}
                <div className="md:col-span-2 space-y-3">
                  {/* Zone C: Community In-Feed */}
                  <button
                    type="button"
                    onClick={() => handleZoneChange('COMMUNITY_FEED')}
                    className={`w-full p-2.5 rounded-lg text-left transition border flex items-center justify-between text-xs ${
                      selectedZoneId === 'COMMUNITY_FEED'
                        ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">2</span>
                      <span className="font-bold">Zon 2: Community In-Feed (Sponsrat Kort)</span>
                    </div>
                    <span className="text-[10px] opacity-80">In-Feed (800 × 160px)</span>
                  </button>

                  {/* Zone D: Hubbar & Coworking */}
                  <button
                    type="button"
                    onClick={() => handleZoneChange('HUB_HEADER')}
                    className={`w-full p-2.5 rounded-lg text-left transition border flex items-center justify-between text-xs ${
                      selectedZoneId === 'HUB_HEADER'
                        ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">3</span>
                      <span className="font-bold">Zon 3: Hubbar & Coworking Header</span>
                    </div>
                    <span className="text-[10px] opacity-80">Fullbredd Hero (100% × 180px)</span>
                  </button>

                  {/* Zone E: Directory Leaderboard */}
                  <button
                    type="button"
                    onClick={() => handleZoneChange('MEMBERS_DIRECTORY')}
                    className={`w-full p-2.5 rounded-lg text-left transition border flex items-center justify-between text-xs ${
                      selectedZoneId === 'MEMBERS_DIRECTORY'
                        ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">4</span>
                      <span className="font-bold">Zon 4: Medlemskatalog Sök-Leaderboard</span>
                    </div>
                    <span className="text-[10px] opacity-80">Fullbredd (100% × 150px)</span>
                  </button>
                </div>

                {/* Right: Masterkalender Sidopanel */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleZoneChange('CALENDAR_SIDEBAR')}
                    className={`w-full h-full min-h-[140px] p-3 rounded-lg text-left transition border flex flex-col justify-between text-xs ${
                      selectedZoneId === 'CALENDAR_SIDEBAR'
                        ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">5</span>
                        <span className="font-bold">Zon 5: Sidopanel</span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        Masterkalender & Events (320px × 340px)
                      </p>
                    </div>
                    <span className="text-[9px] font-mono text-amber-300">Fast Kolumnbredd</span>
                  </button>
                </div>
              </div>

              {/* Zone F: Bento Dashboard Widget */}
              <button
                type="button"
                onClick={() => handleZoneChange('DASHBOARD_BENTO')}
                className={`w-full p-2.5 rounded-lg text-left transition border flex items-center justify-between text-xs ${
                  selectedZoneId === 'DASHBOARD_BENTO'
                    ? 'bg-[#800020] text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-gray-800/60 hover:bg-gray-800 text-gray-300 border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-bold">6</span>
                  <span className="font-bold">Zon 6: Bento Dashboard Grid-Widget</span>
                </div>
                <span className="text-[10px] opacity-80">Modulär Bento (1K–4K, 1–2 Rader)</span>
              </button>

            </div>
          </div>

          {/* 2. Zone Detail Card & Interactive Size Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            
            {/* Zone Specs & Placement Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider block">
                  {currentZone.category === 'FULL_WIDTH' ? 'Fullbredd Placering' : currentZone.category === 'SIDEBAR' ? 'Sidopanel Placering' : 'In-Feed Placering'}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  {currentZone.title}
                </h3>
                <span className="inline-block text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200 mt-1">
                  {currentZone.badge}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {currentZone.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 font-medium">Räckvidd:</span>
                  <span className="font-bold text-gray-900">{currentZone.reach}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 font-medium">Målgrupp:</span>
                  <span className="font-bold text-gray-900 text-right max-w-[60%]">{currentZone.audience}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 font-medium">Rekommenderat format:</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentZone.recommendedAspect}</span>
                </div>
              </div>

              {/* Action Button */}
              {onSelectZoneToCreate && (
                <button
                  type="button"
                  onClick={() => onSelectZoneToCreate(currentZone.id, customHeight, customWidth)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Skapa annons i denna zon</span>
                </button>
              )}
            </div>

            {/* Interactive Sizing Control & Live Settings (Höjd & Bredd beroende på placering) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#800020]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Ställ in Annonsstorlek (Höjd & Bredd)
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    Mått: {customWidth} × {customHeight}px
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Höjd-inställning */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Höjd (Vertikalt): <span className="text-[#800020]">{customHeight}px</span>
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(currentZone?.allowedHeights || []).map(h => (
                        <button
                          key={h.height}
                          type="button"
                          onClick={() => setCustomHeight(h.height)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            customHeight === h.height
                              ? 'bg-[#800020] text-white shadow-2xs'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                    {/* Fine-tune Slider */}
                    <input
                      type="range"
                      min={100}
                      max={440}
                      step={10}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-full accent-[#800020] cursor-pointer mt-1"
                    />
                  </div>

                  {/* Bredd-inställning (Beroende på placering) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Bredd (Horisontellt): <span className="text-[#800020]">{customWidth}</span>
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(currentZone?.allowedWidths || []).map(w => (
                        <button
                          key={w.width}
                          type="button"
                          onClick={() => setCustomWidth(w.width)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            customWidth === w.width
                              ? 'bg-[#800020] text-white shadow-2xs'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {currentZone.category === 'SIDEBAR' 
                        ? 'Sidopanel anpassas bäst till 300-360px eller 100% av panelens kolumn.'
                        : 'Fullbredd expanderar till 100% eller centreras med maxbredd.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Live Preview of the selected Ad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Live Förhandsvisning ({previewDevice === 'desktop' ? 'Desktop vy' : 'Mobil vy'})</span>
                  </span>
                  <span>Skala: 1:1 verklig rendering</span>
                </div>

                {/* Preview Container */}
                <div className={`p-4 bg-gray-100/70 rounded-2xl border border-gray-200 flex justify-center overflow-hidden ${
                  previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}>
                  
                  {/* The Simulated Ad Box */}
                  <div 
                    className={`rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col sm:flex-row transition-all duration-200 ${
                      currentZone.category === 'SIDEBAR' ? 'max-w-[340px] flex-col' : 'w-full'
                    }`}
                    style={{
                      minHeight: `${customHeight}px`,
                      maxHeight: currentZone.category === 'SIDEBAR' ? undefined : `${customHeight + 50}px`
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div className={`relative overflow-hidden bg-gray-900 shrink-0 ${
                      currentZone.category === 'SIDEBAR' ? 'h-32 w-full' : 'sm:w-2/5 h-32 sm:h-auto'
                    }`}>
                      <img
                        src={currentZone.sampleImg}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold border border-white/20">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Sponsrat Samarbete</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between space-y-2 bg-white">
                      <div>
                        <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider block">
                          {currentZone.sampleAdvertiser}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug mt-0.5 line-clamp-2">
                          {currentZone.sampleHeadline}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          Förmånligt medlemserbjudande för medlemmar i Booster Friends.
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span className="hidden sm:inline">Verifierad Partner</span>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>Ta del av erbjudandet</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Alla annonser mäts med klick- och visningsspårning (CTR) och granskas av Booster Friends Admin.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition"
          >
            Stäng guide
          </button>
        </div>

      </div>
    </div>
    </AdminInspect>
  );
};
