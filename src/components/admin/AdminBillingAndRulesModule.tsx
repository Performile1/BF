import React, { useState } from 'react';
import { 
  DollarSign, 
  Settings, 
  Sliders, 
  FileText, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldAlert, 
  RefreshCw, 
  UserCheck, 
  Users, 
  Building2, 
  Crown, 
  Gift, 
  Percent, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  Download,
  Filter,
  Search,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { 
  Member, 
  MembershipLevel, 
  PaymentStatus, 
  InvoiceRecord, 
  BoosterSystemRuleConfig, 
  MembershipPackageDefinition 
} from '../../types';
import { 
  INITIAL_BOOSTER_RULES, 
  INITIAL_MEMBERSHIP_PACKAGES, 
  INITIAL_INVOICES 
} from '../../data/billingAndRulesData';
import { AdminInspect } from '../dev/AdminInspect';

interface AdminBillingAndRulesModuleProps {
  allMembers: Member[];
  onUpdateMemberLevel?: (memberId: string, level: MembershipLevel) => void;
  onUpdateMemberPaymentStatus?: (memberId: string, status: PaymentStatus) => void;
}

interface MemberBillingStatusInfo {
  status: PaymentStatus;
  daysOverdue: number;
  trialDaysLeft?: number;
  companyGroup?: string;
}

export const AdminBillingAndRulesModule: React.FC<AdminBillingAndRulesModuleProps> = ({
  allMembers,
  onUpdateMemberLevel,
  onUpdateMemberPaymentStatus
}) => {
  const [subTab, setSubTab] = useState<'BILLING_OVERVIEW' | 'RULES_CONFIG' | 'PACKAGES' | 'COMPANY_INVOICING'>('BILLING_OVERVIEW');

  // Rules State
  const [rules, setRules] = useState<BoosterSystemRuleConfig>(INITIAL_BOOSTER_RULES);
  const [packages, setPackages] = useState<MembershipPackageDefinition[]>(INITIAL_MEMBERSHIP_PACKAGES);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);

  // Billing Member Statuses local state
  const [memberStatuses, setMemberStatuses] = useState<Record<string, { status: PaymentStatus; daysOverdue: number; trialDaysLeft?: number; companyGroup?: string }>>(() => {
    const initial: Record<string, { status: PaymentStatus; daysOverdue: number; trialDaysLeft?: number; companyGroup?: string }> = {};
    allMembers.forEach((m, idx) => {
      if (m.id === 'usr_marcus_berg' || idx === 3) {
        initial[m.id] = { status: 'OVERDUE', daysOverdue: 6, companyGroup: 'Nordic Growth AB' };
      } else if (m.id === 'usr_elena_rostova' || idx === 4) {
        initial[m.id] = { status: 'TRIAL', daysOverdue: 0, trialDaysLeft: 12, companyGroup: 'NovaCode AB' };
      } else if (idx === 5) {
        initial[m.id] = { status: 'PAUSED', daysOverdue: 0 };
      } else if (idx === 6) {
        initial[m.id] = { status: 'SUSPENDED_PAYMENT', daysOverdue: 14 };
      } else {
        initial[m.id] = { status: 'PAID', daysOverdue: 0, companyGroup: m.company_name };
      }
    });
    return initial;
  });

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [memberSearch, setMemberSearch] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Trial Modal State
  const [trialModalMember, setTrialModalMember] = useState<Member | null>(null);
  const [trialDays, setTrialDays] = useState<number>(14);
  const [trialPlan, setTrialPlan] = useState<MembershipLevel>('GOLD');

  // Manual Invoice / Reminder Modal
  const [reminderModalMember, setReminderModalMember] = useState<Member | null>(null);

  // Company Group Invoicing Modal
  const [companyName, setCompanyName] = useState('inCtrl Group AB');
  const [companyVat, setCompanyVat] = useState('SE559123456701');
  const [selectedCompanyMembers, setSelectedCompanyMembers] = useState<string[]>([allMembers[0]?.id || '']);

  // Handle Rule changes
  const handleRuleChange = (field: keyof BoosterSystemRuleConfig, value: number | boolean) => {
    setRules(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveRules = () => {
    setNotice('✅ Booster Rules & Poängvärden har sparats i systemkonfigurationen!');
    setTimeout(() => setNotice(null), 4000);
  };

  // Handle Package changes
  const handlePackageToggle = (level: MembershipLevel, key: keyof MembershipPackageDefinition, val: any) => {
    setPackages(prev => prev.map(p => p.level === level ? { ...p, [key]: val } : p));
  };

  const handlePackagePriceChange = (level: MembershipLevel, isAnnual: boolean, value: number) => {
    setPackages(prev => prev.map(p => {
      if (p.level === level) {
        return isAnnual ? { ...p, annual_price_sek: value } : { ...p, monthly_price_sek: value };
      }
      return p;
    }));
  };

  const handleSavePackages = () => {
    setNotice('✅ Paketkonfiguration & priser synkroniserade mot Stripe Product IDs!');
    setTimeout(() => setNotice(null), 4000);
  };

  // Trigger Stripe card charge / payment link resend
  const handleResendPaymentLink = (member: Member) => {
    setNotice(`🔗 Ny Stripe betallänk och kortdragningsförsök skickat till ${member.email}!`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Generate and send manual PDF invoice
  const handleSendManualInvoice = (member: Member) => {
    const newInvoiceNumber = `BF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: InvoiceRecord = {
      id: `inv_manual_${Date.now()}`,
      invoice_number: newInvoiceNumber,
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + rules.grace_period_days * 86400000).toISOString().split('T')[0],
      amount_sek: member.membership_level === 'GOLD' ? 3490 : member.membership_level === 'SILVER' ? 1490 : 490,
      status: 'DUE',
      plan: member.membership_level,
      recipient_name: member.full_name,
      recipient_email: member.email,
      company_name: member.company_name,
      vat_amount_sek: Math.round((member.membership_level === 'GOLD' ? 3490 : 1490) * 0.25)
    };
    setInvoices(prev => [newInv, ...prev]);
    setNotice(`📄 Manuell PDF-faktura ${newInvoiceNumber} genererad och skickad per e-post till ${member.email}!`);
    setReminderModalMember(null);
    setTimeout(() => setNotice(null), 5000);
  };

  // Toggle Suspended Lockout status
  const handleToggleLockout = (memberId: string) => {
    setMemberStatuses(prev => {
      const current = prev[memberId]?.status || 'PAID';
      const nextStatus = current === 'SUSPENDED_PAYMENT' ? 'PAID' : 'SUSPENDED_PAYMENT';
      if (onUpdateMemberPaymentStatus) {
        onUpdateMemberPaymentStatus(memberId, nextStatus);
      }
      return {
        ...prev,
        [memberId]: {
          ...prev[memberId],
          status: nextStatus,
          daysOverdue: nextStatus === 'SUSPENDED_PAYMENT' ? 14 : 0
        }
      };
    });

    const m = allMembers.find(item => item.id === memberId);
    setNotice(`🔒 Status för ${m?.full_name || 'medlemmen'} uppdaterad!`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Assign Free Trial Period
  const handleAssignTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialModalMember) return;

    setMemberStatuses(prev => ({
      ...prev,
      [trialModalMember.id]: {
        ...prev[trialModalMember.id],
        status: 'TRIAL',
        trialDaysLeft: trialDays,
        daysOverdue: 0
      }
    }));

    if (onUpdateMemberLevel) {
      onUpdateMemberLevel(trialModalMember.id, trialPlan);
    }

    setNotice(`🎁 ${trialDays} dagars fri testperiod på ${trialPlan} tilldelad ${trialModalMember.full_name}! Ett välkomstmeddelande har skickats.`);
    setTrialModalMember(null);
    setTimeout(() => setNotice(null), 5000);
  };

  // Filtered members for billing view
  const filteredMembers = allMembers.filter(m => {
    const memStatus = memberStatuses[m.id]?.status || 'PAID';
    if (statusFilter !== 'ALL' && memStatus !== statusFilter) return false;
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.company_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unpaidCount = allMembers.filter(m => {
    const s = memberStatuses[m.id]?.status;
    return s === 'OVERDUE' || s === 'SUSPENDED_PAYMENT' || s === 'DUE';
  }).length;

  return (
    <AdminInspect
      component="AdminBillingAndRulesModule.tsx"
      sourceTable="public.invoices / member_billing_status / booster_rules"
      columns={['id', 'member_id', 'status', 'amount_sek', 'due_date', 'rule_key', 'rule_value']}
      notes="Fakturering, betalningsregler, provperioder och spärrhantering"
    >
      <div className="space-y-6">
      
      {/* Feedback notice */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 font-bold text-xs">
            Stäng
          </button>
        </div>
      )}

      {/* Sub-navigation for Admin Billing & Rules */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('BILLING_OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            subTab === 'BILLING_OVERVIEW'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fakturering & Betalningsstatus (/admin/billing)</span>
          {unpaidCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
              {unpaidCount} förfallna
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('RULES_CONFIG')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            subTab === 'RULES_CONFIG'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Booster Rules & BP-poäng</span>
        </button>

        <button
          onClick={() => setSubTab('PACKAGES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            subTab === 'PACKAGES'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Pakethantering (Bronze, Silver, Gold)</span>
        </button>

        <button
          onClick={() => setSubTab('COMPANY_INVOICING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            subTab === 'COMPANY_INVOICING'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Företagsfakturering & Samlingsfaktura</span>
        </button>
      </div>

      {/* 1. BILLING OVERVIEW (/admin/billing) */}
      {subTab === 'BILLING_OVERVIEW' && (
        <div className="space-y-5">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Månatlig MRR</span>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">184 600 SEK</div>
              <span className="text-[10px] text-emerald-600 font-semibold">+14.2% denna månad</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Obetalda / Förfallna</span>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono">{unpaidCount} st</div>
              <span className="text-[10px] text-rose-600 font-semibold">Kräver åtgärd / dunning</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Aktiva Testperioder</span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                {(Object.values(memberStatuses) as MemberBillingStatusInfo[]).filter(s => s.status === 'TRIAL').length} st
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">14 / 30 dagars fri trial</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Pausade (Sabbatical)</span>
              <div className="text-xl sm:text-2xl font-black text-gray-600 font-mono">
                {(Object.values(memberStatuses) as MemberBillingStatusInfo[]).filter(s => s.status === 'PAUSED').length} st
              </div>
              <span className="text-[10px] text-gray-500 font-semibold">Upp till 3 mån frysning</span>
            </div>
          </div>

          {/* Filters and search */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
              </span>
              {(['ALL', 'PAID', 'OVERDUE', 'TRIAL', 'PAUSED', 'SUSPENDED_PAYMENT'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    statusFilter === st
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st === 'ALL' ? 'Alla Medlemmar' : st === 'PAID' ? 'Betald' : st === 'OVERDUE' ? 'Förfallen' : st === 'TRIAL' ? 'Testperiod' : st === 'PAUSED' ? 'Pausad' : 'Spärrad (Lockout)'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                placeholder="Sök medlem eller företag..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Member Billing Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold bg-gray-50/50">
                  <th className="p-4">Medlem & Bolag</th>
                  <th className="p-4">Nivå & Paket</th>
                  <th className="p-4">Betalningsstatus</th>
                  <th className="p-4">Förfallodatum / Respittid</th>
                  <th className="p-4 text-right">Åtgärder & Påminnelser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredMembers.map((m) => {
                  const s = memberStatuses[m.id] || { status: 'PAID', daysOverdue: 0 };
                  const isSuspended = s.status === 'SUSPENDED_PAYMENT';
                  const isOverdue = s.status === 'OVERDUE';
                  const isTrial = s.status === 'TRIAL';

                  return (
                    <tr key={m.id} className="hover:bg-gray-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={m.avatar} alt={m.full_name} className="w-9 h-9 rounded-xl object-cover border border-gray-200" />
                          <div>
                            <div className="font-bold text-gray-900">{m.full_name}</div>
                            <div className="text-[11px] text-gray-500">{m.company_name} • {m.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          m.membership_level === 'GOLD'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : m.membership_level === 'SILVER'
                              ? 'bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-orange-50 text-orange-800 border-orange-200'
                        }`}>
                          {m.membership_level}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {m.membership_level === 'GOLD' ? '3 490 SEK/mån' : m.membership_level === 'SILVER' ? '1 490 SEK/mån' : '490 SEK/mån'}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          isSuspended
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isOverdue
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isTrial
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                : s.status === 'PAUSED'
                                  ? 'bg-gray-200 text-gray-800 border border-gray-300'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isSuspended ? (
                            <>
                              <Lock className="w-3 h-3 text-rose-700" />
                              <span>SPÄRRAD (Lockout)</span>
                            </>
                          ) : isOverdue ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>FÖRFALLEN</span>
                            </>
                          ) : isTrial ? (
                            <>
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>GRATIS TESTPERIOD ({s.trialDaysLeft || 14}d)</span>
                            </>
                          ) : s.status === 'PAUSED' ? (
                            <>
                              <Pause className="w-3 h-3" />
                              <span>PAUSAD</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>BETALD</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-4">
                        {isOverdue || isSuspended ? (
                          <div className="text-rose-600 font-bold">
                            {s.daysOverdue} dagar försenad
                            <div className="text-[10px] text-gray-400 font-normal">
                              Respittid ({rules.grace_period_days}d) överskriden
                            </div>
                          </div>
                        ) : isTrial ? (
                          <div className="text-indigo-900 font-medium">
                            Testperiod aktiv
                            <div className="text-[10px] text-gray-400">Går ut om {s.trialDaysLeft || 14} dagar</div>
                          </div>
                        ) : (
                          <div className="text-gray-600">
                            Nästa dragning 1 okt 2026
                            <div className="text-[10px] text-emerald-600">Automatisk kortdragning</div>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* 1-click Stripe reminder / retry */}
                          <button
                            onClick={() => handleResendPaymentLink(m)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
                            title="Skicka om Stripe betallänk / gör ny dragning"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-[#800020]" />
                          </button>

                          {/* Manual PDF Invoice */}
                          <button
                            onClick={() => handleSendManualInvoice(m)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
                            title="Skapa manuell PDF-faktura och skicka påminnelse"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          </button>

                          {/* Trial Period assign */}
                          <button
                            onClick={() => setTrialModalMember(m)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
                            title="Tilldela fri testmånad (Trial)"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          </button>

                          {/* Lockout / Unlock Toggle */}
                          <button
                            onClick={() => handleToggleLockout(m.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                              isSuspended
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                            title={isSuspended ? 'Lås upp konto' : 'Spärra konto vid utebliven betalning'}
                          >
                            {isSuspended ? (
                              <>
                                <Unlock className="w-3 h-3" />
                                <span>Lås upp</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Spärra</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. RULES CONFIG (A. Konfiguration av Booster Rules) */}
      {subTab === 'RULES_CONFIG' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">
                A. Konfiguration av Booster Rules (BP-justeringar)
              </h3>
              <p className="text-xs text-gray-500">
                Ändra poängvärdet för systemhändelser direkt i gränssnittet utan ombyggnation av kod.
              </p>
            </div>
            <button
              onClick={handleSaveRules}
              className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Spara Ändringar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rule 1: Guest Check-in */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">Guest Check-in via QR</label>
                <span className="font-mono text-xs font-black text-[#800020]">+{rules.guest_qr_checkin_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Poäng som tilldelas en medlem när deras inbjudna gäst scannar QR-koden vid frukost eller event.
              </p>
              <input
                type="number"
                value={rules.guest_qr_checkin_bp}
                onChange={e => handleRuleChange('guest_qr_checkin_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>

            {/* Rule 2: Guest Conversion */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">Gäst blir betalande medlem</label>
                <span className="font-mono text-xs font-black text-emerald-700">+{rules.guest_conversion_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Bonus till ambassadören när en gäst tecknar betalt abonnemang (Bronze/Silver/Gold).
              </p>
              <input
                type="number"
                value={rules.guest_conversion_bp}
                onChange={e => handleRuleChange('guest_conversion_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>

            {/* Rule 3: Fact Checked Post */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">AI Fact-Checked inlägg i forum</label>
                <span className="font-mono text-xs font-black text-indigo-700">+{rules.ai_fact_check_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Poäng för verifierade expertråd och kunskapsdelning i community-flödet.
              </p>
              <input
                type="number"
                value={rules.ai_fact_check_bp}
                onChange={e => handleRuleChange('ai_fact_check_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>

            {/* Rule 4: CV Upload & Parsing */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">Uppladdning & parsing av CV</label>
                <span className="font-mono text-xs font-black text-amber-700">+{rules.cv_parse_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Incitament för medlemmar att komplettera profil och CV för automatisk matchmaking.
              </p>
              <input
                type="number"
                value={rules.cv_parse_bp}
                onChange={e => handleRuleChange('cv_parse_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>

            {/* Rule 5: Gift Upgrade Silver Cost */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">BP-kostnad: Gåva 1 mån Silver</label>
                <span className="font-mono text-xs font-black text-gray-700">{rules.gift_upgrade_silver_cost_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Antal Booster Points som krävs för att bjuda en kollega på 30 dagars Silver.
              </p>
              <input
                type="number"
                value={rules.gift_upgrade_silver_cost_bp}
                onChange={e => handleRuleChange('gift_upgrade_silver_cost_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>

            {/* Rule 6: Gift Upgrade Gold Cost */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-900">BP-kostnad: Gåva 1 mån Gold</label>
                <span className="font-mono text-xs font-black text-gray-700">{rules.gift_upgrade_gold_cost_bp} BP</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Antal Booster Points som krävs för att bjuda en kollega på 30 dagars Gold Executive.
              </p>
              <input
                type="number"
                value={rules.gift_upgrade_gold_cost_bp}
                onChange={e => handleRuleChange('gift_upgrade_gold_cost_bp', Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white font-mono"
              />
            </div>
          </div>

          {/* Advanced Rules & System Policies */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-gray-500" />
              <span>System- & Faktureringsregler</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <label className="font-bold text-gray-900 block">Respittid / Grace Period (Dagar)</label>
                <p className="text-[11px] text-gray-500">Antal dagar efter förfallodatum innan kontot spärras.</p>
                <input
                  type="number"
                  value={rules.grace_period_days}
                  onChange={e => handleRuleChange('grace_period_days', Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-mono"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <label className="font-bold text-gray-900 block">Auto-Upgrade Hook (BP-gräns)</label>
                <p className="text-[11px] text-gray-500">Poäng för att automatiskt trigga en gratis testvecka på Gold.</p>
                <input
                  type="number"
                  value={rules.freemium_auto_upgrade_bp}
                  onChange={e => handleRuleChange('freemium_auto_upgrade_bp', Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-mono"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <label className="font-bold text-gray-900 block">EU Reverse Charge (Moms)</label>
                <p className="text-[11px] text-gray-500">0% moms vid godkänt europeiskt VAT-nummer.</p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleRuleChange('eu_reverse_charge_enabled', !rules.eu_reverse_charge_enabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      rules.eu_reverse_charge_enabled ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{rules.eu_reverse_charge_enabled ? 'Aktiverat' : 'Avstängt'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PACKAGES (B. Pakethantering Bronze, Silver, Gold) */}
      {subTab === 'PACKAGES' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  B. Pakethantering (Bronze, Silver, Gold)
                </h3>
                <p className="text-xs text-gray-500">
                  Definiera priser, funktioner och rättigheter per medlemsnivå. Synkas automatiskt mot Stripe Price IDs.
                </p>
              </div>
              <button
                onClick={handleSavePackages}
                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Spara Paket</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.level} className="bg-gray-50/60 rounded-3xl p-6 border border-gray-200 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${pkg.badge_color}`}>
                      {pkg.level}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{pkg.stripe_monthly_price_id}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-gray-900">{pkg.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                  </div>

                  {/* Price inputs */}
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Månadspris (SEK exkl. moms):</label>
                      <input
                        type="number"
                        value={pkg.monthly_price_sek}
                        onChange={e => handlePackagePriceChange(pkg.level, false, Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Årspris (SEK exkl. moms):</label>
                      <input
                        type="number"
                        value={pkg.annual_price_sek}
                        onChange={e => handlePackagePriceChange(pkg.level, true, Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Feature Toggles & Rights Matrix */}
                  <div className="space-y-4 pt-3 border-t border-gray-200 text-xs">
                    {/* Profil & Varumärke */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Profil & Portfölj</div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Max antal skills:</span>
                        <input
                          type="text"
                          value={pkg.max_skills ?? ''}
                          onChange={e => handlePackageToggle(pkg.level, 'max_skills', e.target.value)}
                          placeholder="t.ex. 5, 15, Obegränsat"
                          className="w-28 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Cases i portfölj:</span>
                        <input
                          type="text"
                          value={pkg.max_cases_in_gallery ?? ''}
                          onChange={e => handlePackageToggle(pkg.level, 'max_cases_in_gallery', e.target.value)}
                          placeholder="t.ex. 1, 5, Obegränsat"
                          className="w-28 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Framhävd portfölj:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.featured_portfolio}
                          onChange={e => handlePackageToggle(pkg.level, 'featured_portfolio', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Pro-badge & utökad profil:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.pro_badge_and_expanded_profile}
                          onChange={e => handlePackageToggle(pkg.level, 'pro_badge_and_expanded_profile', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">VIP/Guld-Badge (Smidig topplacering):</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.vip_gold_badge}
                          onChange={e => handlePackageToggle(pkg.level, 'vip_gold_badge', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Prioriterad placering i medlemsregister:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.priority_directory_placement}
                          onChange={e => handlePackageToggle(pkg.level, 'priority_directory_placement', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>
                    </div>

                    {/* Hubbar & Möten */}
                    <div className="space-y-2 pt-2 border-t border-gray-200/60">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hubbar & Möten</div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Flexbokningar/mån:</span>
                        <input
                          type="text"
                          value={pkg.free_hub_flex_bookings_per_month ?? ''}
                          onChange={e => handlePackageToggle(pkg.level, 'free_hub_flex_bookings_per_month', e.target.value)}
                          placeholder="t.ex. 1, 4, Obegränsat"
                          className="w-28 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Webbmöten (1-till-1):</span>
                        <input
                          type="text"
                          value={pkg.web_meetings_per_month ?? ''}
                          onChange={e => handlePackageToggle(pkg.level, 'web_meetings_per_month', e.target.value)}
                          placeholder="t.ex. 3, 15, Obegränsat"
                          className="w-28 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Egna Webinars (Grupp):</span>
                        <input
                          type="text"
                          value={pkg.webinars_per_month ?? ''}
                          onChange={e => handlePackageToggle(pkg.level, 'webinars_per_month', e.target.value)}
                          placeholder="t.ex. Endast deltagare, 1/mån, Obegränsat"
                          className="w-28 px-2 py-1 rounded-lg border border-gray-200 bg-white text-[11px] text-right"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Guldram i "Vem är på hubben":</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.who_is_at_hub_priority}
                          onChange={e => handlePackageToggle(pkg.level, 'who_is_at_hub_priority', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Skapa events & hubbmöten:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.can_create_events_and_meetings}
                          onChange={e => handlePackageToggle(pkg.level, 'can_create_events_and_meetings', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Tillgång Executive Webinars:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.access_executive_webinars}
                          onChange={e => handlePackageToggle(pkg.level, 'access_executive_webinars', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>
                    </div>

                    {/* Akademi & Annonser */}
                    <div className="space-y-2 pt-2 border-t border-gray-200/60">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Akademi & Annonser</div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Sälja egna kurser:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.can_sell_courses}
                          onChange={e => handlePackageToggle(pkg.level, 'can_sell_courses', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Plattformsavgift kurser:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={pkg.course_platform_fee_percent ?? 0}
                            onChange={e => handlePackageToggle(pkg.level, 'course_platform_fee_percent', Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-lg border border-gray-200 bg-white font-mono text-right text-[11px]"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Publicera annonser/banners:</span>
                        <input
                          type="checkbox"
                          checked={!!pkg.can_publish_ads}
                          onChange={e => handlePackageToggle(pkg.level, 'can_publish_ads', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#800020]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Rabatt på annonsering:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={pkg.ad_discount_percent ?? 0}
                            onChange={e => handlePackageToggle(pkg.level, 'ad_discount_percent', Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-lg border border-gray-200 bg-white font-mono text-right text-[11px]"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPANY INVOICING (Företagsfakturering / Samlingsfaktura) */}
      {subTab === 'COMPANY_INVOICING' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-black text-gray-900">
              Företagsfakturering & Samlingsfaktura
            </h3>
            <p className="text-xs text-gray-500">
              Koppla flera medlemmar till ett moderbolag där en administrerande kontaktperson får en gemensam samlingsfaktura per månad eller år.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Moderbolagets Namn:</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Organisationsnummer / Momsnr (VAT):</label>
                <input
                  type="text"
                  value={companyVat}
                  onChange={e => setCompanyVat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Välj medlemmar som ingår i bolagsavtalet:
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-2 space-y-1 bg-gray-50">
                  {allMembers.map(m => {
                    const isChecked = selectedCompanyMembers.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-xl cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCompanyMembers(prev => 
                              isChecked ? prev.filter(id => id !== m.id) : [...prev, m.id]
                            );
                          }}
                          className="w-4 h-4 rounded text-[#800020]"
                        />
                        <span className="font-bold text-gray-800">{m.full_name}</span>
                        <span className="text-gray-500">({m.membership_level})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  setNotice(`🏢 Samlingsfaktura skapad för ${companyName} (${selectedCompanyMembers.length} anslutna medlemmar)!`);
                  setTimeout(() => setNotice(null), 4000);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <Building2 className="w-4 h-4" />
                <span>Generera Månatlig Samlingsfaktura</span>
              </button>
            </div>

            {/* Invoice Spec Preview */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-900">Förhandsgranskning Samlingsfaktura</span>
                <span className="text-[11px] text-gray-500">Stripe Invoicing B2B</span>
              </div>

              <div className="space-y-1">
                <div className="text-gray-500">Faktureras:</div>
                <div className="font-bold text-gray-900">{companyName}</div>
                <div className="text-gray-500">Org: {companyVat}</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="font-semibold text-gray-700">Specifikation:</div>
                {selectedCompanyMembers.map(id => {
                  const m = allMembers.find(item => item.id === id);
                  if (!m) return null;
                  const price = m.membership_level === 'GOLD' ? 3490 : m.membership_level === 'SILVER' ? 1490 : 490;
                  return (
                    <div key={id} className="flex justify-between text-gray-600 text-[11px]">
                      <span>1x {m.full_name} ({m.membership_level})</span>
                      <span className="font-mono">{price.toLocaleString('sv-SE')} SEK</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-gray-900">
                <span>Summa exkl. moms:</span>
                <span className="font-mono text-[#800020]">
                  {selectedCompanyMembers.reduce((sum, id) => {
                    const m = allMembers.find(item => item.id === id);
                    const p = m?.membership_level === 'GOLD' ? 3490 : m?.membership_level === 'SILVER' ? 1490 : 490;
                    return sum + p;
                  }, 0).toLocaleString('sv-SE')} SEK
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TILLDELA FRI TESTPERIOD (TRIAL PERIOD) */}
      {trialModalMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleAssignTrial} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Tilldela Fri Testperiod
                  </h3>
                  <p className="text-[11px] text-gray-500">{trialModalMember.full_name} ({trialModalMember.company_name})</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setTrialModalMember(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Välj Testpaket:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BRONZE', 'SILVER', 'GOLD'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTrialPlan(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        trialPlan === lvl
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Längd på testperiod:</label>
                <select
                  value={trialDays}
                  onChange={e => setTrialDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  <option value={14}>14 Dagars Fri Trial</option>
                  <option value={30}>30 Dagars Fri Trial (1 full månad)</option>
                  <option value={60}>60 Dagars Kampanj-access</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                <p className="font-bold">🔔 Automatisk Avisering</p>
                <p>Systemet skickar en automatisk påminnelse 3 dagar innan testperioden går ut med instruktion om att ange betalkort för att fortsätta.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTrialModalMember(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aktivera Testperiod</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
    </AdminInspect>
  );
};
