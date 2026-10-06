import React, { useEffect, useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Settings, Shield, Building2 } from 'lucide-react';

type Item = { id: string; label: string; icon: React.ElementType; adminOnly?: boolean };
type Category = { id: string; title: string; icon: React.ElementType; subtabs: Item[] };
export function CategorySidebar({ categories, activeTab, onNavigate, compact, onCompactChange, isAdmin, isHubHost, unreadChatCount }: {
  categories: Category[]; activeTab: string; onNavigate: (tab: string) => void;
  compact: boolean; onCompactChange: (compact: boolean) => void;
  isAdmin: boolean; isHubHost: boolean; unreadChatCount: number;
}) {
  const activeCategory = categories.find(cat => cat.subtabs.some(tab => tab.id === activeTab))?.id;
  const [expanded, setExpanded] = useState<string[]>(activeCategory && !compact ? [activeCategory] : []);
  const [search, setSearch] = useState('');
  const root = React.useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (compact && !root.current?.contains(event.target as Node)) setExpanded([]); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { const trigger = root.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]'); setExpanded([]); trigger?.focus(); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); };
  }, [compact]);
  useEffect(() => { if (activeCategory && !compact) setExpanded(previous => previous.includes(activeCategory) ? previous : [...previous, activeCategory]); }, [activeCategory, compact]);
  const toggle = (id: string) => setExpanded(previous => previous.includes(id) ? previous.filter(value => value !== id) : compact ? [id] : [...previous, id]);
  const links = [{ id: 'settings', label: 'Inställningar', icon: Settings }, ...(isHubHost || isAdmin ? [{ id: 'hub_settings', label: 'Hubbinställningar', icon: Building2 }] : []), ...(isAdmin ? [{ id: 'admin_settings', label: 'Admininställningar', icon: Shield }] : [])];
  const visible = categories.map(cat => ({ ...cat, subtabs: cat.subtabs.filter(tab => (!tab.adminOnly || isAdmin) && tab.label.toLocaleLowerCase('sv').includes(search.toLocaleLowerCase('sv'))) })).filter(cat => cat.subtabs.length);
  const renderCategories = (mini: boolean, prefix: string) => visible.map(cat => {
    const open = expanded.includes(cat.id) || !!search;
    return <div key={cat.id} className={`relative ${mini ? 'mb-2' : 'mb-1'}`}>
      <button type="button" aria-label={cat.title} title={mini ? cat.title : undefined} aria-expanded={open} aria-controls={`${prefix}-${cat.id}`} onClick={() => toggle(cat.id)} className={`flex items-center gap-3 rounded-xl min-h-12 p-3 ${mini ? 'justify-center w-12' : 'w-full text-left'} ${activeCategory === cat.id ? 'bg-[#800020] text-white' : 'bg-[#800020]/5 text-[#800020] hover:bg-[#800020]/10'}`}>
        <cat.icon className="w-5 h-5 shrink-0" />{!mini && <><span className="text-sm font-semibold flex-1">{cat.title}</span><ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} /></>}
      </button>
      {open && <div id={`${prefix}-${cat.id}`} className={mini ? 'absolute left-full ml-3 top-0 w-64 bg-white rounded-xl border border-[#800020]/15 shadow-xl p-2 z-50' : 'ml-4 pl-3 border-l border-[#800020]/15 my-2'}>
        {mini && <p className="p-3 text-sm font-semibold text-gray-500">{cat.title}</p>}
        {cat.subtabs.map(tab => <button key={tab.id} type="button" aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => { onNavigate(tab.id); if (mini) setExpanded([]); }} className={`flex items-center gap-2 w-full text-left px-3 py-3 text-sm rounded-lg ${activeTab === tab.id ? 'bg-[#800020] text-white' : 'text-[#800020] hover:bg-[#800020]/10'}`}><tab.icon className="w-4 h-4 shrink-0" /><span>{tab.label}</span>{tab.id === 'chat' && unreadChatCount > 0 && <span className="ml-auto">{unreadChatCount}</span>}</button>)}
      </div>}
    </div>;
  });
  const renderSettings = (mini: boolean) => <div className="border-t border-[#800020]/15 pt-3 mt-3">{links.map(link => <button type="button" key={link.id} title={mini ? link.label : undefined} aria-label={link.label} aria-current={activeTab === link.id ? 'page' : undefined} onClick={() => onNavigate(link.id)} className={`flex items-center gap-3 p-3 rounded-xl min-h-12 ${mini ? 'w-12 justify-center' : 'w-full text-left'} ${activeTab === link.id ? 'bg-[#800020] text-white' : 'text-[#800020] hover:bg-[#800020]/10'}`}><link.icon className="w-5 h-5 shrink-0" />{!mini && <span className="text-sm">{link.label}</span>}</button>)}</div>;
  return <nav ref={root} aria-label="Huvudnavigation" className="bg-white rounded-2xl p-3 lg:sticky lg:top-4">
    <div className="hidden lg:block">
      <button type="button" onClick={() => { onCompactChange(!compact); setSearch(''); setExpanded([]); }} aria-label={compact ? 'Visa fullständig meny' : 'Visa kompakt ikonmeny'} title={compact ? 'Visa fullständig meny' : 'Visa kompakt ikonmeny'} className="flex gap-3 items-center p-3 mb-3 rounded-xl bg-[#800020]/5 text-[#800020] hover:bg-[#800020]/10 min-h-12">{compact ? <PanelLeftOpen className="w-5 h-5" /> : <><PanelLeftClose className="w-5 h-5" /><span className="text-sm">Minimera meny</span></>}</button>
      {!compact && <label className="block text-sm mb-3">Hitta funktion<input type="search" value={search} onChange={e => setSearch(e.target.value)} className="mt-2 border rounded-lg p-3 w-full" placeholder="Sök i menyn" /></label>}
      {!visible.length && <p role="status" className="text-sm p-3">Ingen funktion matchar sökningen.</p>}
      {renderCategories(compact, 'desktop-category')}{renderSettings(compact)}
    </div>
    <details className="lg:hidden"><summary className="p-3 font-semibold cursor-pointer">Alla funktioner & inställningar</summary>{renderCategories(false, 'mobile-category')}{renderSettings(false)}</details>
  </nav>;
}
