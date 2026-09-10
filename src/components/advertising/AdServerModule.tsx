import React, { useState } from 'react';
import { 
  Megaphone, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Upload, 
  CreditCard, 
  QrCode, 
  Calendar, 
  Sliders, 
  ShieldCheck, 
  Maximize2, 
  Layout, 
  Layers, 
  Smartphone, 
  Monitor, 
  Building2, 
  Coffee,
  HelpCircle,
  Plus
} from 'lucide-react';
import { Member, AdPlacementConfig, AdCampaign, AdPlacementType } from '../../types';
import { AD_PLACEMENTS_CONFIG, INITIAL_AD_CAMPAIGNS } from '../../data/billingAndRulesData';

interface AdServerModuleProps {
  currentUser: Member;
  onBackToHome?: () => void;
}

export const AdServerModule: React.FC<AdServerModuleProps> = ({
  currentUser,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'visual_guide' | 'pricing' | 'self_service' | 'analytics'>('visual_guide');
  const [selectedPlacement, setSelectedPlacement] = useState<AdPlacementType>('HOME_TOP');
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_AD_CAMPAIGNS);

  // Self-service form state
  const [formPlacement, setFormPlacement] = useState<AdPlacementType>('HOME_TOP');
  const [formPricingModel, setFormPricingModel] = useState<'FIXED_MONTHLY' | 'CPM'>('FIXED_MONTHLY');
  const [formTitle, setFormTitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80');
  const [formTargetUrl, setFormTargetUrl] = useState('https://mittforetag.se/erbjudande');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'STRIPE' | 'SWISH'>('STRIPE');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Check gold member benefits
  const isGold = currentUser.membership_level === 'GOLD';
  const discountMultiplier = isGold ? 0.8 : 1.0; // 20% discount for Gold

  const currentConfig = AD_PLACEMENTS_CONFIG.find(c => c.id === selectedPlacement) || AD_PLACEMENTS_CONFIG[0];
  const formConfig = AD_PLACEMENTS_CONFIG.find(c => c.id === formPlacement) || AD_PLACEMENTS_CONFIG[0];

  // Calculate pricing for current form selection
  const rawPrice = formPricingModel === 'FIXED_MONTHLY' 
    ? formConfig.monthly_fixed_price_sek 
    : formConfig.cpm_price_sek * 20; // estimate 20k impressions for CPM package
  const finalPrice = Math.round(rawPrice * discountMultiplier);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsPublishing(true);
    setTimeout(() => {
      const newCamp: AdCampaign = {
        id: `camp_${Date.now()}`,
        advertiser_id: currentUser.id,
        advertiser_name: currentUser.full_name,
        advertiser_company: currentUser.company_name,
        placement: formPlacement,
        title: formTitle,
        image_url: formImageUrl,
        target_url: formTargetUrl,
        pricing_model: formPricingModel,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        impressions_count: 0,
        clicks_count: 0,
        conversions_count: 0,
        amount_paid_sek: finalPrice,
        payment_status: 'PAID'
      };

      setCampaigns([newCamp, ...campaigns]);
      setIsPublishing(false);
      setPublishSuccess(`🎉 Kampanj "${formTitle}" är nu publicerad i Booster Friends Ad Server!`);
      setFormTitle('');
      setActiveTab('analytics');
      setTimeout(() => setPublishSuccess(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#4A0013] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 flex items-center gap-1.5 shadow-xs">
              <Megaphone className="w-3.5 h-3.5" />
              Booster Ad Server Engine
            </span>
            {isGold && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                ⭐ Guld-förmån: 20% Rabatt aktiverad
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Nå 5 000+ Verifierade VD:ar, Investerare & Entreprenörer
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Booster Friends interna annonsserver ger dig 100% räckvidd mot aktiva beslutsfattare. Välj mellan fullbredds-banners på Dashboard, sponsrade flödesinlägg eller riktade sidopaneler.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('visual_guide')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'visual_guide'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🗺️ Visuell Placeringsguide & Mått
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'pricing'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              💎 Prislista (Månad / CPM)
            </button>
            <button
              onClick={() => setActiveTab('self_service')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'self_service'
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'bg-amber-400/20 text-amber-200 hover:bg-amber-400/30'
              }`}
            >
              ⚡ Boka Annons (Självbetjäning)
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📊 Live Tracker & Kampanjer
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {publishSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-900 font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{publishSuccess}</span>
          </div>
          <button onClick={() => setPublishSuccess(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* TAB 1: VISUELL GUIDE ÖVER ANNONSER (MÅTT, BREDD, HÖJD, PLACERING) */}
      {activeTab === 'visual_guide' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#800020]" />
                  <span>Visuell Guide: Var kan man lägga till annonser?</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Klicka på en annonsposition nedan för att se exakta pixelmått, förhållande, placeringstyp och interaktiv förhandsgranskning.
                </p>
              </div>

              {/* Placement selector pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {AD_PLACEMENTS_CONFIG.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedPlacement(config.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedPlacement === config.id
                        ? 'bg-[#800020] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{config.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Placement Specs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Format & Typ</span>
                <div className="text-base font-black text-gray-900 capitalize">
                  {currentConfig.format_type === 'full_width' && 'Fullbredd (Topp / Hero)'}
                  {currentConfig.format_type === 'sidebar' && 'Sidopanel (Skyskrapa)'}
                  {currentConfig.format_type === 'feed' && 'Flöde (Community Card)'}
                  {currentConfig.format_type === 'modal' && 'Modal / Overlay (Live Stream)'}
                </div>
                <span className="text-xs text-gray-500">Aspekt: {currentConfig.aspect_ratio}</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pixeldimensioner</span>
                <div className="text-base font-black text-[#800020] font-mono">
                  {currentConfig.dimensions_px}
                </div>
                <span className="text-xs text-gray-500">Optimerad för Retina & Hög DPI</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pris & Räckvidd</span>
                <div className="text-base font-black text-emerald-700">
                  {currentConfig.monthly_fixed_price_sek.toLocaleString('sv-SE')} kr/mån
                </div>
                <span className="text-xs text-gray-500">{currentConfig.example_reach}</span>
              </div>
            </div>

            {/* Interactive Layout Mockup Visualizer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Interaktiv Applikations-Layout (Var visas annonsen i portalen?)</span>
                <span className="text-[#800020]">Markerat i rött/gult: Vald position ({selectedPlacement})</span>
              </div>

              {/* Wireframe Mockup of App Portal */}
              <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
                
                {/* Mock Header */}
                <div className="h-10 bg-slate-800 rounded-xl flex items-center justify-between px-4 border border-slate-700 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#800020]" />
                    <span className="font-bold text-white">Booster Friends Portal</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>Dashboard</span>
                    <span>Hubbar</span>
                    <span>Community</span>
                    <span>Akademi</span>
                  </div>
                </div>

                {/* 1. HOME_TOP Zone */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                  selectedPlacement === 'HOME_TOP'
                    ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20 shadow-lg'
                    : 'border-dashed border-slate-700 bg-slate-800/40 opacity-60'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <Maximize2 className="w-4 h-4" />
                    <span>POSITION: HOME_TOP (Fullbredd 1200 x 280 px)</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1 max-w-md">
                    Topplacering direkt ovanför widgets på startsidan. Visas för varje inloggad medlem vid sessionstart.
                  </p>
                </div>

                {/* Mock Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  {/* Left 2 Cols: Feed & Content */}
                  <div className="lg:col-span-2 space-y-4">
                    
                    {/* 2. FEED_TOP Zone */}
                    <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                      selectedPlacement === 'FEED_TOP'
                        ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20 shadow-lg'
                        : 'border-dashed border-slate-700 bg-slate-800/40 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                        <Layers className="w-4 h-4" />
                        <span>POSITION: FEED_TOP (Flöde 800 x 400 px)</span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-1">
                        Sponsrat inlägg nummer 1 i nätverksflödet. Integreras snyggt bland diskussioner och medlemsinlägg.
                      </p>
                    </div>

                    {/* Mock Regular Feed Items */}
                    <div className="h-20 bg-slate-800/60 rounded-xl border border-slate-700/60 p-3 text-xs text-gray-400 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700" />
                      <div className="space-y-1">
                        <div className="w-36 h-3 bg-slate-700 rounded" />
                        <div className="w-56 h-2 bg-slate-700/60 rounded" />
                      </div>
                    </div>

                    {/* 3. HUB_HEADER Zone */}
                    <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                      selectedPlacement === 'HUB_HEADER'
                        ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20 shadow-lg'
                        : 'border-dashed border-slate-700 bg-slate-800/40 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                        <Building2 className="w-4 h-4" />
                        <span>POSITION: HUB_HEADER (Flexplats Banner 960 x 220 px)</span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-1">
                        Visas högst upp när medlemmar bokar flex-skrivbord och mötesrum på hubbarna i Mölnlycke, Göteborg, Kista etc.
                      </p>
                    </div>
                  </div>

                  {/* Right 1 Col: Sidebar & Overlay */}
                  <div className="space-y-4">
                    
                    {/* 4. CALENDAR_SIDEBAR Zone */}
                    <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center min-h-[220px] ${
                      selectedPlacement === 'CALENDAR_SIDEBAR'
                        ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20 shadow-lg'
                        : 'border-dashed border-slate-700 bg-slate-800/40 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                        <Layout className="w-4 h-4" />
                        <span>POSITION: CALENDAR_SIDEBAR</span>
                      </div>
                      <span className="text-[11px] font-mono text-amber-200 mt-1">(300 x 600 px Skyskrapa)</span>
                      <p className="text-[11px] text-gray-300 mt-2">
                        Följer med användaren vid rullning bredvid event- och möteskalendern.
                      </p>
                    </div>

                    {/* 5. WEBINAR_SPONSOR Zone */}
                    <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                      selectedPlacement === 'WEBINAR_SPONSOR'
                        ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20 shadow-lg'
                        : 'border-dashed border-slate-700 bg-slate-800/40 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                        <Sparkles className="w-4 h-4" />
                        <span>WEBINAR_SPONSOR</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-200">(400 x 200 px Overlay)</span>
                      <p className="text-[10px] text-gray-300 mt-1">
                        Klickbar CTA-badge under direktsända Pro Webinars.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Live Preview of the Selected Banner format */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-700">
                Förhandsvisning av vald banner: {currentConfig.name} ({currentConfig.dimensions_px})
              </span>
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm relative group">
                <img 
                  src={currentConfig.sample_image} 
                  alt={currentConfig.name}
                  className="w-full h-48 sm:h-64 object-cover group-hover:scale-101 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase font-black tracking-wider bg-[#800020] text-white px-2 py-0.5 rounded w-fit mb-1">
                    Sponsrad Annons
                  </span>
                  <h4 className="text-base sm:text-lg font-black">{currentConfig.name}</h4>
                  <p className="text-xs text-gray-300 mt-0.5">{currentConfig.location_description}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PRISLISTA PER ANNONSPOSITION */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#800020]" />
                  <span>Officiell Prislista & Annonsformat</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Välj mellan fast månadsabonnemang (exklusiv ensamrätt på positionen) eller rörlig CPM (pris per 1 000 visningar).
                </p>
              </div>

              {isGold && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 font-bold flex items-center gap-2">
                  <span>🏆 Du är Guldmedlem: 20% rabatt dras automatiskt i kassan.</span>
                </div>
              )}
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Annonsposition</th>
                    <th className="py-3 px-4">Format & Placering</th>
                    <th className="py-3 px-4">Dimensioner</th>
                    <th className="py-3 px-4">Fast Månadspris</th>
                    <th className="py-3 px-4">CPM (Per 1k visningar)</th>
                    <th className="py-3 px-4 text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {AD_PLACEMENTS_CONFIG.map((item) => {
                    const discountedFixed = Math.round(item.monthly_fixed_price_sek * discountMultiplier);
                    const discountedCpm = Math.round(item.cpm_price_sek * discountMultiplier);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-4 px-4 font-black text-gray-900">
                          <div>{item.name}</div>
                          <span className="text-[10px] text-gray-400 font-mono">{item.id}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 font-bold uppercase text-[10px]">
                            {item.format_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-gray-700">
                          {item.dimensions_px}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-black text-gray-900">
                            {discountedFixed.toLocaleString('sv-SE')} kr/mån
                          </div>
                          {isGold && (
                            <span className="text-[10px] text-gray-400 line-through">
                              Ord: {item.monthly_fixed_price_sek.toLocaleString('sv-SE')} kr
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {item.cpm_price_sek > 0 ? (
                            <div>
                              <span className="font-bold text-gray-900">{discountedCpm} kr</span>
                              <span className="text-gray-400 text-[10px]"> / 1 000 visningar</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Fast pris per event</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setFormPlacement(item.id);
                              setActiveTab('self_service');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#660018] text-white font-bold transition shadow-2xs"
                          >
                            Boka nu
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Gold Benefits Explainer */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Exklusiva Annonsförmåner i Guld-paketet (2 490 kr/mån)</span>
              </div>
              <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                <li><strong>20% rabatt</strong> på samtliga annonsbokningar och CPM-kampanjer i nätverket.</li>
                <li><strong>1 fri FEED_TOP-banner</strong> ingår per år utan extra kostnad (Värde: 6 500 kr).</li>
                <li><strong>Prioriterad AI Matchmaking</strong> i chatten som lyfter fram ditt bolag som "Verifierad Leverantör".</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SELF-SERVICE BOKNING / KAMPANJBYGGARE */}
      {activeTab === 'self_service' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#800020]" />
                <span>Skapa & Publicera Annons (Self-Service)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ladda upp material, välj mållänk och aktivera direkt via Swish eller Kreditkort.
              </p>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              
              {/* Placement selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Välj Annonsplacering:</label>
                <select
                  value={formPlacement}
                  onChange={e => setFormPlacement(e.target.value as AdPlacementType)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-[#800020]"
                >
                  {AD_PLACEMENTS_CONFIG.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.dimensions_px} ({p.monthly_fixed_price_sek.toLocaleString('sv-SE')} kr/mån)
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing model */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Prismodell:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormPricingModel('FIXED_MONTHLY')}
                    className={`p-3 rounded-xl border font-bold transition text-left ${
                      formPricingModel === 'FIXED_MONTHLY'
                        ? 'border-[#800020] bg-rose-50/40 text-[#800020] ring-2 ring-[#800020]/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-black">Fast Månad (30 dagar)</div>
                    <span className="text-[11px] text-gray-500 font-normal">Ensamrätt och maximal räckvidd</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPricingModel('CPM')}
                    className={`p-3 rounded-xl border font-bold transition text-left ${
                      formPricingModel === 'CPM'
                        ? 'border-[#800020] bg-rose-50/40 text-[#800020] ring-2 ring-[#800020]/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-black">CPM (Per 1k visningar)</div>
                    <span className="text-[11px] text-gray-500 font-normal">Rörligt paket (20 000 visningar)</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Annonsrubrik & Call to Action:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="t.ex. Boka fri tillväxtkonsultation med våra Senior Advisors"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              {/* Banner Image URL or preset */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Banner Bild-URL (Mått: {formConfig.dimensions_px}):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-hidden focus:border-[#800020]"
                  />
                  <button
                    type="button"
                    onClick={() => setFormImageUrl(formConfig.sample_image)}
                    className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold whitespace-nowrap"
                  >
                    Exempelbild
                  </button>
                </div>
              </div>

              {/* Destination URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mållänk (När medlemmen klickar på annonsen):</label>
                <input
                  type="url"
                  required
                  value={formTargetUrl}
                  onChange={e => setFormTargetUrl(e.target.value)}
                  placeholder="https://dittforetag.se/erbjudande"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              {/* Payment Method */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-2">Välj Betalningsmetod:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormPaymentMethod('STRIPE')}
                    className={`p-3 rounded-xl border font-bold transition flex items-center gap-2 ${
                      formPaymentMethod === 'STRIPE'
                        ? 'border-[#800020] bg-rose-50/40 text-[#800020] ring-2 ring-[#800020]/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Kort / Företagsfaktura (Stripe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPaymentMethod('SWISH')}
                    className={`p-3 rounded-xl border font-bold transition flex items-center gap-2 ${
                      formPaymentMethod === 'SWISH'
                        ? 'border-[#800020] bg-rose-50/40 text-[#800020] ring-2 ring-[#800020]/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Swish Företag</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 block">Totalt belopp att betala:</span>
                  <span className="text-lg font-black text-gray-900">
                    {finalPrice.toLocaleString('sv-SE')} kr exkl. moms
                  </span>
                  {isGold && <span className="text-[10px] text-emerald-600 block font-bold">Inkluderar 20% Guld-rabatt</span>}
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-3 rounded-2xl bg-[#800020] hover:bg-[#660018] text-white font-black text-xs transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Initierar betalning...</span>
                  ) : (
                    <>
                      <span>Slutför & Publicera Annons</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Live Förhandsgranskning
              </span>

              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs relative">
                <img 
                  src={formImageUrl || formConfig.sample_image} 
                  alt="Förhandsgranskning" 
                  className="w-full h-44 object-cover"
                />
                <div className="p-3 bg-white space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#800020] text-white">
                    Sponsrat • {currentUser.company_name}
                  </span>
                  <h4 className="text-xs font-black text-gray-900 line-clamp-2">
                    {formTitle || 'Din annonsrubrik visas här i skarpt läge'}
                  </h4>
                  <div className="text-[10px] text-blue-600 truncate flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span>{formTargetUrl}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Placering:</span>
                  <strong className="text-gray-900">{formPlacement}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mått:</span>
                  <span className="font-mono">{formConfig.dimensions_px}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Annonsör:</span>
                  <strong>{currentUser.full_name} ({currentUser.company_name})</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Alla annonser granskas och aktiveras i realtid via automated quality compliance.</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: REAL-TIME ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">Totala Visningar</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {campaigns.reduce((acc, c) => acc + c.impressions_count, 0).toLocaleString('sv-SE')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">+18.4% senaste 7 dagarna</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">Unika Klick</span>
                <MousePointerClick className="w-4 h-4 text-[#800020]" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {campaigns.reduce((acc, c) => acc + c.clicks_count, 0).toLocaleString('sv-SE')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Genomsnittlig CTR: 3.92%</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">Konverteringar</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {campaigns.reduce((acc, c) => acc + c.conversions_count, 0)}
              </div>
              <span className="text-[11px] text-gray-500">Bokade möten & leads</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold">Aktiva Kampanjer</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">
                {campaigns.filter(c => c.status === 'ACTIVE').length} st
              </div>
              <span className="text-[11px] text-gray-500">Booster Friends Ad Server</span>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-gray-900">
                Aktiva Annonser & Prestanda i Realtid
              </h3>
              <button
                onClick={() => setActiveTab('self_service')}
                className="px-3.5 py-1.5 rounded-xl bg-[#800020] text-white font-bold text-xs hover:bg-[#660018] transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Skapa Ny Kampanj</span>
              </button>
            </div>

            <div className="space-y-4">
              {campaigns.map((camp) => {
                const ctr = camp.impressions_count > 0 
                  ? ((camp.clicks_count / camp.impressions_count) * 100).toFixed(2)
                  : '0.00';

                return (
                  <div 
                    key={camp.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img 
                        src={camp.image_url} 
                        alt={camp.title} 
                        className="w-20 h-14 rounded-xl object-cover shrink-0 border border-gray-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#800020] text-white">
                            {camp.placement}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {camp.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {camp.start_date} – {camp.end_date}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate mt-1">
                          {camp.title}
                        </h4>
                        <div className="text-[11px] text-gray-500 truncate">
                          Annonsör: {camp.advertiser_name} ({camp.advertiser_company})
                        </div>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="flex items-center gap-5 shrink-0 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Visningar</span>
                        <strong className="text-gray-900 font-mono">{camp.impressions_count.toLocaleString('sv-SE')}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Klick</span>
                        <strong className="text-gray-900 font-mono">{camp.clicks_count}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">CTR</span>
                        <strong className="text-emerald-700 font-mono">{ctr}%</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Konv.</span>
                        <strong className="text-blue-700 font-mono">{camp.conversions_count}</strong>
                      </div>
                      <a 
                        href={camp.target_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Öppna mållänk"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
