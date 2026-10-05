import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  LayoutGrid, 
  Sliders, 
  Layers, 
  Columns, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  Maximize2, 
  Move, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { WIDGET_REGISTRY } from '../../types/widgets';
import { ALL_AVAILABLE_WIDGETS } from './CustomizableBentoDashboard';

interface DashboardComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'bento' | 'modular';
  onSelectView: (view: 'bento' | 'modular') => void;
}

export const DashboardComparisonModal: React.FC<DashboardComparisonModalProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'modules' | 'choose'>('comparison');

  if (!isOpen) return null;

  const comparisonRows = [
    {
      feature: 'Designfilosofi',
      bento: 'Asymmetrisk Bento-stil (Apple/Linear-inspirerad) med hero-kort och dynamisk visuell hierarki',
      modular: 'Strukturerat och enhetligt widget-grid (1–4 kolumner) med symmetrisk uppställning',
      winner: 'Bento för estetik, Modulär för ordning'
    },
    {
      feature: 'Kolumnstyrning',
      bento: 'Dynamisk 2, 3 eller 4 kolumners desktop-grid med valbart avstånd (12px, 16px, 24px gap)',
      modular: 'Responsivt 4-kolumners grid med per-widget kolumnbredd (1 kol, 2 kol, Full bredd)',
      winner: 'Lika flexibla (olika teknisk styrning)'
    },
    {
      feature: 'Korthöjd (Row-Span)',
      bento: 'Ja! Växla mellan 1 rad (standard) och 2 rader (utökad höjd) per widget',
      modular: 'Fast automatisk korthöjd baserad på innehåll',
      winner: 'Bento har flexiblare höjder'
    },
    {
      feature: 'Drag & Drop omflyttning',
      bento: 'Fullständig Drag & Drop i redigeringsläge + pilknappar för direkt reflow',
      modular: 'Smidiga upp/ner-knappar per modul med omedelbar sparning',
      winner: 'Bento för drag & drop, Modulär för precision'
    },
    {
      feature: 'Detaljredigering & Ren vy',
      bento: 'Låst i ren presentationsvy tills du klickar "Redigera layout" / "🎨 Detaljredigering"',
      modular: 'Låst i ren presentationsvy tills du klickar "🎨 Detaljredigering"',
      winner: 'Båda har nu 100% ren läsvy utan redigeringsklotter'
    },
    {
      feature: 'Antal moduler tillgängliga',
      bento: 'Samtliga 28 moduler (Mitt, Nätverk, Hubb, Community, Admin)',
      modular: 'Samtliga 28 moduler (Mitt, Nätverk, Hubb, Community, Admin)',
      winner: '100% Paritet – alla moduler finns i båda!'
    },
    {
      feature: 'Bäst lämpad för',
      bento: 'Daglig översikt, inspiration, visuellt starka presentationer och nätverksradar',
      modular: 'Power-användare, admin-kontroll, kompakt datavisning och anpassade arbetsflöden',
      winner: 'Välj efter personlig preferens'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-rose-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#800020] text-white flex items-center justify-center shadow-md shadow-rose-950/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Jämför: Bento Dashboard vs Modulär Dashboard
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Full Paritet
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Båda vyerna innehåller samtliga 28 moduler. Välj den stil som passar ditt arbetsflöde bäst.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-3 border-b border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Jämförelsematris</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Alla 28 Moduler i Båda</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black">
              28 st
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('choose')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'choose'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Välj & Aktivera vy</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bento Card Summary */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  activeView === 'bento' 
                    ? 'border-[#800020] bg-rose-50/20 ring-2 ring-[#800020]/20' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#800020] text-white flex items-center justify-center font-black text-xs">
                        B
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-900">Bento Dashboard</h3>
                        <p className="text-[10px] text-gray-500">Asymmetrisk modern översikt</p>
                      </div>
                    </div>
                    {activeView === 'bento' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#800020] text-white">
                        Aktiv vy nu
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1.5 mt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dynamiskt kolumnval (2, 3 eller 4 kolumner)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Fri kontroll över både bredd (col-span) och höjd (row-span)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Intuitiv Drag & Drop-omflyttning</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hero-kort för live radar, ticker och matchmaking</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectView('bento');
                      onClose();
                    }}
                    className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeView === 'bento'
                        ? 'bg-gray-100 text-gray-700 cursor-default'
                        : 'bg-[#800020] text-white hover:bg-[#580016] shadow-xs'
                    }`}
                  >
                    <span>{activeView === 'bento' ? '✓ Redan vald' : 'Använd Bento Dashboard'}</span>
                  </button>
                </div>

                {/* Modular Card Summary */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  activeView === 'modular' 
                    ? 'border-[#800020] bg-rose-50/20 ring-2 ring-[#800020]/20' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">
                        M
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-900">Modulär Dashboard</h3>
                        <p className="text-[10px] text-gray-500">Strukturerad Widget-Grid</p>
                      </div>
                    </div>
                    {activeView === 'modular' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#800020] text-white">
                        Aktiv vy nu
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1.5 mt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Uniformt 4-kolumners grid med fast anpassningsgrad</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Per-kort breddknappar: 1 kolumn, 2 kolumner eller Full bredd</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Snabb modulväljare med sökning & kategorier</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Perfekt för fokuserat arbete & datadriven översikt</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectView('modular');
                      onClose();
                    }}
                    className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeView === 'modular'
                        ? 'bg-gray-100 text-gray-700 cursor-default'
                        : 'bg-gray-900 text-white hover:bg-black shadow-xs'
                    }`}
                  >
                    <span>{activeView === 'modular' ? '✓ Redan vald' : 'Använd Modulär Dashboard'}</span>
                  </button>
                </div>
              </div>

              {/* Detailed Matrix Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-black">
                      <th className="p-3 w-1/4">Egenskap</th>
                      <th className="p-3 w-3/8 text-[#800020]">Bento Dashboard</th>
                      <th className="p-3 w-3/8 text-gray-900">Modulär Dashboard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comparisonRows.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/60 transition">
                        <td className="p-3 font-bold text-gray-900 align-top">{r.feature}</td>
                        <td className="p-3 text-gray-700 align-top bg-rose-50/20">{r.bento}</td>
                        <td className="p-3 text-gray-700 align-top">{r.modular}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-emerald-900">100% Modulparitet Uppfylld</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Samtliga 28 unika moduler stöds och kan aktiveras i både Bento- och Modulär Dashboard. Du kan när som helst byta vy utan att förlora tillgång till några verktyg.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_AVAILABLE_WIDGETS.map((widget, idx) => (
                  <div 
                    key={widget.id} 
                    className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-[#800020] transition-all flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-[#800020] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          #{idx + 1}
                        </span>
                        <h4 className="text-xs font-black text-gray-900 truncate">{widget.title}</h4>
                        {widget.adminOnly && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                        {widget.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Finns i Båda ✓
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">
                        {widget.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'choose' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-gray-900">Vilken vy vill du använda nu?</h3>
                <p className="text-xs text-gray-500">
                  Du kan byta fram och tillbaka när du vill via knappen längst upp på sidan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => onSelectView('bento')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col justify-between ${
                    activeView === 'bento'
                      ? 'border-[#800020] bg-rose-50/40 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#800020] text-white flex items-center justify-center font-black text-base mx-auto mb-3 shadow-md shadow-rose-950/20">
                      Bento
                    </div>
                    <h4 className="text-sm font-black text-gray-900">Bento Dashboard</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Modern, visuell och dynamisk överblick med hero-kort.
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                      activeView === 'bento' ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {activeView === 'bento' ? '✓ Aktiv standard' : 'Välj Bento'}
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectView('modular')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col justify-between ${
                    activeView === 'modular'
                      ? 'border-[#800020] bg-rose-50/40 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-base mx-auto mb-3 shadow-md shadow-gray-950/20">
                      Grid
                    </div>
                    <h4 className="text-sm font-black text-gray-900">Modulär Dashboard</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Strukturerad 1–4 kolumners widget-layout för power users.
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                      activeView === 'modular' ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {activeView === 'modular' ? '✓ Aktiv standard' : 'Välj Modulär'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Tips: Dina anpassade inställningar för båda dashboard-typerna sparas separat i webbläsaren och Supabase!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-400 font-medium">
            Booster Friends Dashboard Engine • 28 aktiva moduler
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
