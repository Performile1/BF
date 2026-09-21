import React, { useState } from 'react';
import { 
  MessageSquare, 
  GraduationCap, 
  Bell, 
  Tag, 
  TrendingUp, 
  Receipt, 
  Users, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { formatSek } from '../../../utils/calendar';
import { AdminInspect } from '../../dev/AdminInspect';

export const CommunityFeedWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const posts = [
    { id: '1', title: 'Erfarenheter kring upphandling av molntjänster?', author: 'Rickard W.', replies: 7 },
    { id: '2', title: 'Söker samarbetspartner inom AI-automatisering och n8n', author: 'Elena V.', replies: 12 },
    { id: '3', title: 'Frukostseminarium: Nyheter inom B2B-skatt och moms', author: 'Marcus E.', replies: 4 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Community & Forum</h3>
              <p className="text-[10px] text-gray-500">Aktuella diskussioner & leads</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 my-2">
          {posts.map(p => (
            <div key={p.id} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{p.title}</p>
                <p className="text-[10px] text-gray-500">Av {p.author}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">
                {p.replies} svar
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Över 500 diskussioner</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('community')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Öppna Community
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const AcademyProgressWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Akademi & Kurser</h3>
              <p className="text-[10px] text-gray-500">Kompetensutveckling</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Aktiv kurs
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 my-2">
          <p className="text-xs font-bold text-gray-900">B2B Förhandling & Värdeskapande</p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '65%' }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5">
            <span>Modul 3 av 5</span>
            <span className="font-bold text-gray-700">65% klart</span>
          </div>
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">+50 BP vid slutförande</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('academy')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Fortsätt kurs
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const NotificationsInboxWidget: React.FC<WidgetComponentProps> = () => {
  const [unreadCount, setUnreadCount] = useState(2);
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Marcus Ekström svarade i din tråd om avtal', read: false, time: '10m' },
    { id: '2', text: 'Sofia Lindqvist skickade en kaffe-invit', read: false, time: '1h' },
    { id: '3', text: 'Välkommen till morgonens frukostmöte kl 08:30', read: true, time: '1d' },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Mina Aviseringar</h3>
              <p className="text-[10px] text-gray-500">Notiser och omnämnanden</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#800020] text-white text-[10px] font-black">
              {unreadCount} nya
            </span>
          )}
        </div>
        <div className="space-y-1.5 my-2">
          {notifications.map(n => (
            <div key={n.id} className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 ${n.read ? 'bg-gray-50 text-gray-500' : 'bg-rose-50/40 font-semibold text-gray-900'}`}>
              <span className="truncate">{n.text}</span>
              <span className="text-[10px] font-mono text-gray-400 shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <button
          onClick={markAllRead}
          className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition"
        >
          Markera alla som lästa
        </button>
      </div>
    </div>
  );
};

export const TagSubscriptionsWidget: React.FC<WidgetComponentProps> = ({ currentUser }) => {
  const [activeTags, setActiveTags] = useState<string[]>(['B2B', 'SaaS', 'Göteborg', 'Investerare']);
  const availableTags = ['B2B', 'SaaS', 'Göteborg', 'Investerare', 'Juridik', 'AI', 'Marknadsföring', 'Fintech'];

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Taggbevakningar</h3>
              <p className="text-[10px] text-gray-500">Få notiser om ämnen</p>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mb-2.5">
          Klicka på en tagg för att aktivera eller inaktivera direktnotiser vid nya inlägg eller leads:
        </p>
        <div className="flex flex-wrap gap-1.5 my-2">
          {availableTags.map(tag => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                  active
                    ? 'bg-[#800020] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 text-[10px] text-gray-400">
        Sparat i notification_subscriptions
      </div>
    </div>
  );
};

export const AdminDealsPipelineWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const deals = [
    { id: '1', title: 'SaaS Avtal CRM', value: 145000, parties: 'Performile & CloudCraft', stage: 'Stängd vinst' },
    { id: '2', title: 'Rådgivning M&A', value: 220000, parties: 'Ekström & Nordic Growth', stage: 'Offert sänd' },
    { id: '3', title: 'Brand Identity', value: 85000, parties: 'Studio Alpha & Nordic Health', stage: 'Möte genomfört' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Nätverkets B2B-affärer</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">Admin</span>
              </div>
              <p className="text-[10px] text-gray-500">Pipeline & omsättning mellan medlemmar</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 my-2">
          {deals.map(d => (
            <div key={d.id} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{d.title}</p>
                <p className="text-[10px] text-gray-500">{d.parties}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#800020]">{formatSek(d.value)}</p>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">{d.stage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Totalt: 1 850 000 kr</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('pipeline')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Visa fullständig pipeline
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const AdminInvoicesWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const invoices = [
    { id: '1', num: 'INV-2026-089', member: 'Performile AB', amount: 2490, status: 'PAID' },
    { id: '2', num: 'INV-2026-092', member: 'Nordic Growth', amount: 4980, status: 'PAID' },
    { id: '3', num: 'INV-2026-094', member: 'Ekström Law', amount: 2490, status: 'OVERDUE' },
    { id: '4', num: 'INV-2026-095', member: 'CloudCraft Solutions', amount: 990, status: 'DUE' },
  ];

  return (
    <AdminInspect
      component="AdminInvoicesWidget"
      sourceTable="public.invoices"
      columns={['invoice_number', 'member_name', 'amount_sek', 'status', 'due_date']}
      notes="Adminöversikt över medlemsfakturor och betalstatus"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Medlemsfakturor</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">Admin</span>
              </div>
              <p className="text-[10px] text-gray-500">Reglerade och obetalda avgifter</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 my-2">
          {invoices.map(inv => (
            <div key={inv.id} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{inv.member}</p>
                <p className="text-[10px] text-gray-400 font-mono">{inv.num}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatSek(inv.amount)}</p>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                  inv.status === 'PAID' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : inv.status === 'OVERDUE' 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {inv.status === 'PAID' ? 'Betald' : inv.status === 'OVERDUE' ? 'Förfallen' : 'Obetald'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Automatisk OCR & Stripe-synk</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('admin')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Hantera fakturor
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
    </AdminInspect>
  );
};

export const AdminAccountLifecycleWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const accounts = [
    { id: '1', name: 'Sofia Lindqvist', company: 'Nordic Growth', role: 'MEMBER', status: 'ACTIVE' },
    { id: '2', name: 'Johan Bergström', company: 'Bergström Invest', role: 'PROSPECT', status: 'TRIAL' },
    { id: '3', name: 'Klara Sjöberg', company: 'DesignLab AB', role: 'MEMBER', status: 'FROZEN' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Kontolivscykel & Roller</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">Admin</span>
              </div>
              <p className="text-[10px] text-gray-500">Snabbsök, frys, återaktivera användare</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 my-2">
          {accounts.map(acc => (
            <div key={acc.id} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{acc.name}</p>
                <p className="text-[10px] text-gray-500">{acc.company} • {acc.role}</p>
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                acc.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : acc.status === 'TRIAL'
                  ? 'bg-sky-100 text-sky-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {acc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">142 totala användare</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('admin')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Användaradministration
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
