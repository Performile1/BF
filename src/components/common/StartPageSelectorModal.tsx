import React from 'react';
import { 
  X, 
  Star, 
  Check, 
  Home, 
  Sliders, 
  Users, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  CalendarDays, 
  Video,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AVAILABLE_START_PAGES, StartPageOption } from '../../lib/landingPageService';

interface StartPageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStartPage: string;
  onSelectStartPage: (pageId: string) => void;
  onNavigateToPage?: (pageId: string) => void;
}

export const StartPageSelectorModal: React.FC<StartPageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStartPage,
  onSelectStartPage,
  onNavigateToPage
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Sliders': return Sliders;
      case 'Users': return Users;
      case 'GraduationCap': return GraduationCap;
      case 'Building2': return Building2;
      case 'TrendingUp': return TrendingUp;
      case 'CalendarDays': return CalendarDays;
      case 'Video': return Video;
      default: return Home;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-900/20">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Välj din första sida (Startsida)
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                  Personlig
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Välj vilken sida som automatiskt öppnas när du loggar in eller klickar på logotypen.
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_START_PAGES.map(page => {
              const Icon = getIcon(page.iconName);
              const isSelected = currentStartPage === page.id;

              return (
                <div
                  key={page.id}
                  onClick={() => onSelectStartPage(page.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#800020] bg-rose-50/30 ring-2 ring-[#800020]/20 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${
                          isSelected ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            {page.category}
                          </span>
                          <h4 className="text-xs font-black text-gray-900 leading-tight">
                            {page.title}
                          </h4>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Aktiv</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold hover:text-[#800020]">
                          Välj
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                      {page.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStartPage(page.id);
                        if (onNavigateToPage) {
                          onNavigateToPage(page.id);
                          onClose();
                        }
                      }}
                      className="text-[11px] font-bold text-[#800020] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Välj & Gå dit nu</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-400 font-medium">
            Inställningen sparas automatiskt i din webbläsare
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Klar
          </button>
        </div>
      </div>
    </div>
  );
};
