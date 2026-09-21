import React, { useState } from 'react';
import { 
  X, 
  Check, 
  RotateCcw, 
  Sliders, 
  Shield, 
  Building2, 
  Users, 
  GraduationCap, 
  Activity, 
  Sparkles,
  Save,
  CheckCircle2,
  Search
} from 'lucide-react';
import { 
  WIDGET_REGISTRY, 
  WidgetCategory, 
  DEFAULT_USER_WIDGET_IDS, 
  DEFAULT_ADMIN_WIDGET_IDS 
} from '../../types/widgets';
import { AdminInspect } from '../dev/AdminInspect';

interface WidgetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgetIds: string[];
  isAdmin: boolean;
  onSavePreferences: (newActiveIds: string[]) => Promise<void> | void;
}

export const WidgetPickerModal: React.FC<WidgetPickerModalProps> = ({
  isOpen,
  onClose,
  activeWidgetIds,
  isAdmin,
  onSavePreferences,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(activeWidgetIds);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Synka när modalen öppnas
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIds(activeWidgetIds);
      setSearchQuery('');
      setSaveFeedback(false);
    }
  }, [isOpen, activeWidgetIds]);

  if (!isOpen) return null;

  // Säkerhetsregel: Alla widgets med adminOnly: true får aldrig visas eller aktiveras för icke-admins
  const allWidgets = Object.values(WIDGET_REGISTRY).filter(w => {
    if (w.adminOnly && !isAdmin) return false;
    return true;
  });

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'ALL', label: 'Alla Widgets', icon: Sliders },
    { id: 'CORE', label: 'Mitt Booster', icon: Sparkles },
    { id: 'HUB', label: 'Hubb & Flex', icon: Building2 },
    { id: 'COMMUNITY', label: 'Community', icon: Users },
    { id: 'ACADEMY', label: 'Akademi', icon: GraduationCap },
  ];

  if (isAdmin) {
    categories.push({ id: 'ADMIN', label: 'Admin Exklusivt', icon: Shield });
  }

  const filteredWidgets = allWidgets.filter(w => {
    const matchCat = selectedCategory === 'ALL' || w.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const toggleWidget = (id: string) => {
    // Om icke-admin försöker toggla en adminOnly widget, blockera
    const widgetDef = WIDGET_REGISTRY[id];
    if (widgetDef?.adminOnly && !isAdmin) return;

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleResetToDefault = () => {
    const defaults = isAdmin ? DEFAULT_ADMIN_WIDGET_IDS : DEFAULT_USER_WIDGET_IDS;
    setSelectedIds(defaults);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Filtrera säkerhetsmässigt så icke-admin inte sparar admin-widgets
      const sanitizedIds = isAdmin ? selectedIds : selectedIds.filter(id => !WIDGET_REGISTRY[id]?.adminOnly);
      await onSavePreferences(sanitizedIds);
      setSaveFeedback(true);
      setTimeout(() => {
        setSaveFeedback(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <AdminInspect
        component="WidgetPickerModal.tsx"
        sourceTable="public.user_dashboard_layouts"
        columns={['user_id', 'columns_count', 'grid_gap', 'updated_at']}
        notes="Fallback till localStorage om backend-tabell saknar enabled_widgets TEXT[]"
        className="w-full max-w-4xl"
      >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-rose-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#800020] text-white flex items-center justify-center shadow-md shadow-rose-950/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Anpassa Dashboard & Widgets
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Välj vilka moduler som ska visas på din personliga startsida
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

        {/* Sökfält & Kategori-tabs */}
        <div className="px-6 pt-4 pb-3 border-b border-gray-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Sök widgets (t.ex. QR, Flex, KPI, Poäng, Hubb)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] outline-hidden bg-gray-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-1">
            <span>
              Visar <strong className="text-gray-900">{filteredWidgets.length}</strong> moduler ({selectedIds.length} aktiva)
            </span>
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 text-[#800020] font-bold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Återställ standard
            </button>
          </div>

          {filteredWidgets.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              Inga widgets matchade din sökning. Prova en annan sökterm eller välj "Alla Widgets".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredWidgets.map(widget => {
                const isActive = selectedIds.includes(widget.id);

                return (
                  <div
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3.5 select-none relative ${
                      isActive
                        ? 'border-[#800020] bg-rose-50/20 ring-1 ring-[#800020]/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200 ${
                          isActive
                            ? 'bg-[#800020] text-white'
                            : 'border-2 border-gray-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {widget.title}
                          </h4>
                          {widget.adminOnly && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {widget.description}
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-gray-400">
                          Format: {widget.defaultWidth === 'span-full' ? 'Fullbredd' : widget.defaultWidth === 'span-2' ? '2 kolumner' : '1 kolumn'}
                        </div>
                      </div>
                    </div>

                    {/* Mjuk Tailwind toggle-switch med accentfärg #800020 */}
                    <div className="shrink-0 mt-1">
                      <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                        isActive ? 'bg-[#800020]' : 'bg-gray-200'
                      }`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
                          isActive ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {saveFeedback ? (
              <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Sparat till din profil och databasen!
              </span>
            ) : (
              <span>Synkas mot Supabase och din lokala session</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#6e001c] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Sparar...' : 'Spara inställningar'}
            </button>
          </div>
        </div>

      </div>
      </AdminInspect>
    </div>
  );
};
