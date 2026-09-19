import React, { useState, useMemo } from 'react';
import { filterMockDeals } from '../../lib/mockRbacFilter';
import { 
  TrendingUp, 
  DollarSign, 
  Send, 
  Calendar, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  X,
  Briefcase,
  AlertCircle,
  Columns,
  Table as TableIcon,
  Search,
  Filter,
  Sparkles,
  Trophy,
  Scale,
  Activity,
  UserCheck,
  Check,
  Zap,
  Info,
  Layers
} from 'lucide-react';
import { DealPipelineItem, Member, PipelineStage, ActivityType } from '../../types';
import { formatSek } from '../../utils/calendar';

interface CrmPipelineModuleProps {
  currentUser: Member;
  pipelineItems: DealPipelineItem[];
  onUpdateStage: (dealId: string, newStage: PipelineStage) => void;
  onAddDeal: (deal: Omit<DealPipelineItem, 'id'>) => void;
  onAwardBoosterPoints?: (points: number, title: string, activityType: ActivityType) => void;
}

export const CrmPipelineModule: React.FC<CrmPipelineModuleProps> = ({
  currentUser,
  pipelineItems = [],
  onUpdateStage,
  onAddDeal,
  onAwardBoosterPoints
}) => {
  const [activeView, setActiveView] = useState<'kanban' | 'cards' | 'table'>('kanban');
  const [selectedMobileStage, setSelectedMobileStage] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [wonDealCelebration, setWonDealCelebration] = useState<{ title: string; value: number } | null>(null);
  
  // New deal form state
  const [title, setTitle] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [referralSource, setReferralSource] = useState('Nätverksintroduktion');
  const [valueSek, setValueSek] = useState('350000');
  const [stage, setStage] = useState<PipelineStage>('lead');
  const [nextStep, setNextStep] = useState('Boka 1-till-1 möte');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [notes, setNotes] = useState('');

  // 5 Master V4 Kanban Stages
  const stages: { 
    id: PipelineStage; 
    label: string; 
    shortLabel: string;
    subtext: string;
    bg: string; 
    border: string;
    badgeBg: string;
    badgeText: string;
  }[] = [
    { 
      id: 'lead', 
      label: '1. Identifierad Möjlighet (Lead)', 
      shortLabel: '1. Lead',
      subtext: 'Sparad profil, AI-matchning',
      bg: 'bg-slate-50/80', 
      border: 'border-slate-200',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700'
    },
    { 
      id: 'intro_sent', 
      label: '2. Introduktion Skickad / Begärd', 
      shortLabel: '2. Intro',
      subtext: '3-partschatt, Warm Intro',
      bg: 'bg-blue-50/50', 
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800'
    },
    { 
      id: 'meeting_done', 
      label: '3. 1-till-1 Möte Inbokat / Genomfört', 
      shortLabel: '3. Möte',
      subtext: 'Kaffe, lunch, digital synk',
      bg: 'bg-indigo-50/50', 
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800'
    },
    { 
      id: 'proposal', 
      label: '4. Offert / Samarbetsexploring', 
      shortLabel: '4. Offert',
      subtext: 'Affärsförslag, estimerat SEK',
      bg: 'bg-amber-50/50', 
      border: 'border-amber-200',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800'
    },
    { 
      id: 'closed_won', 
      label: '5. Stängd Affär (Won Deal)', 
      shortLabel: '5. Vunnen (+100 BP)',
      subtext: '+100 Booster Points trigger',
      bg: 'bg-emerald-50/60', 
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-900'
    },
  ];

  // Filter deals according to RBAC Matrix
  const userVisiblePipeline = useMemo(() => {
    return filterMockDeals(pipelineItems, currentUser);
  }, [pipelineItems, currentUser]);

  // Calculations for KPIs
  const totalClosedSek = userVisiblePipeline
    .filter(i => i.stage === 'closed_won')
    .reduce((sum, i) => sum + i.value_sek, 0);

  const totalActivePipelineSek = userVisiblePipeline
    .filter(i => i.stage !== 'closed_won')
    .reduce((sum, i) => sum + i.value_sek, 0);

  // Give & Take Ratio metrics (Prompt V4 requirement)
  const givenIntros = currentUser.referrals_sent || 14;
  const receivedIntros = 9; // baseline from profile
  const giveTakeRatio = (givenIntros / Math.max(1, receivedIntros)).toFixed(2);
  const giveRatioPercentage = Math.min(100, Math.round((givenIntros / (givenIntros + receivedIntros)) * 100));

  // Network cadence (past 30 days)
  const activeCadenceCount = 18; // contacts logged last 30 days

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const probMap: Record<PipelineStage, number> = {
      lead: 25,
      intro_sent: 45,
      meeting_done: 60,
      contact: 60,
      proposal: 80,
      closed_won: 100
    };

    onAddDeal({
      title,
      client_company: clientCompany,
      contact_person: contactPerson,
      referral_source: referralSource,
      value_sek: parseInt(valueSek) || 0,
      stage,
      probability: probMap[stage] || 50,
      next_step: nextStep,
      due_date: dueDate,
      notes,
      created_at: new Date().toISOString()
    });

    if (stage === 'closed_won' && onAwardBoosterPoints) {
      onAwardBoosterPoints(100, `Stängd affär: ${title}`, 'DEAL_WON');
      setWonDealCelebration({ title, value: parseInt(valueSek) || 0 });
      setTimeout(() => setWonDealCelebration(null), 5000);
    }

    setShowAddModal(false);
    setTitle('');
    setClientCompany('');
    setContactPerson('');
    setNotes('');
  };

  const stageOrder: PipelineStage[] = ['lead', 'intro_sent', 'meeting_done', 'proposal', 'closed_won'];

  const moveStage = (dealId: string, currentStage: PipelineStage, direction: 'forward' | 'back') => {
    const normalizedStage = currentStage === 'contact' ? 'meeting_done' : currentStage;
    const idx = stageOrder.indexOf(normalizedStage);
    let targetStage: PipelineStage | null = null;
    
    if (direction === 'forward' && idx < stageOrder.length - 1) {
      targetStage = stageOrder[idx + 1];
    } else if (direction === 'back' && idx > 0) {
      targetStage = stageOrder[idx - 1];
    }

    if (targetStage) {
      onUpdateStage(dealId, targetStage);

      // Trigger +100 BP when moved to closed_won!
      if (targetStage === 'closed_won') {
        const item = pipelineItems.find(p => p.id === dealId);
        if (onAwardBoosterPoints && item && !item.points_awarded) {
          onAwardBoosterPoints(100, `Stängd affär: ${item.title}`, 'DEAL_WON');
          setWonDealCelebration({ title: item.title, value: item.value_sek });
          setTimeout(() => setWonDealCelebration(null), 6000);
        }
      }
    }
  };

  // Filter items
  const filteredPipeline = userVisiblePipeline.filter(deal => {
    const matchSearch = 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.client_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.contact_person && deal.contact_person.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStage = selectedStageFilter === 'ALL' || deal.stage === selectedStageFilter;
    return matchSearch && matchStage;
  });

  if (currentUser.role === 'GUEST') {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
          <Briefcase className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">Ingen tillgång till CRM & Deals</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            CRM-pipelinen och B2B affärsmatchning är exklusivt för registrerade medlemmar (Brons, Silver, Guld). Skapa ett konto eller logga in för att registrera och följa dina affärer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Won Deal Celebration Toast / Banner */}
      {wonDealCelebration && (
        <div className="bg-gradient-to-r from-emerald-600 to-[#800020] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Affär Stängd & Verifierad i My Booster Pipeline!</span>
              </div>
              <div className="text-sm font-bold mt-0.5">
                +100 Booster Points tilldelade för "{wonDealCelebration.title}" ({formatSek(wonDealCelebration.value)})!
              </div>
              <p className="text-[11px] text-white/80">
                Poängen har auditerats och krediterats till din profil samt hubbens månadsstrid.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setWonDealCelebration(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Top Banner & Action Controls */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900 font-display">
                    {currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                      ? 'Plattformens Affärspipeline (Super Admin)'
                      : currentUser.role === 'HUB_HOST'
                      ? `Hubb-pipeline (${currentUser.hub_name || 'Sin Hubb'})`
                      : 'My Booster Pipeline – Medlemmens Privata Nätverks-CRM'}
                  </h2>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : currentUser.role === 'HUB_HOST'
                      ? 'bg-slate-100 text-slate-900 border border-slate-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                      ? 'SUPER ADMIN (Alla Deals)'
                      : currentUser.role === 'HUB_HOST'
                      ? 'HUB HOST'
                      : 'MEMBER (Egna Deals)'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                    ? 'Full tillgång: Övervaka och bistå alla medlemmars pågående affärer och stängda kontrakt.'
                    : currentUser.role === 'HUB_HOST'
                    ? 'Hubb-vy: Överblick över affärsflödet kopplat till din tilldelade hubb.'
                    : 'Spåra det kommersiella och relationella värdet av ditt medlemskap genom 5 verifierbara faser.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* View Switcher: Kanban vs Cards (Mobile) vs Table */}
            <div className="flex bg-[#F4F5F7] p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setActiveView('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeView === 'kanban' 
                    ? 'bg-white text-[#800020] shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Kanban-tavla med 5 faser"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
              <button
                onClick={() => setActiveView('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeView === 'cards' 
                    ? 'bg-white text-[#800020] shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobilanpassad Enspaltig Stegvy (V8)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Stegvy (Mobil)</span>
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeView === 'table' 
                    ? 'bg-white text-[#800020] shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tabellvy med sökning och filter"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabell</span>
              </button>
            </div>

            {/* Add Deal Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs"
              id="btn-add-deal"
            >
              <Plus className="w-4 h-4" />
              <span>Registrera Möjlighet</span>
            </button>
          </div>
        </div>

        {/* 3 Core KPI Dashboards on Member Profile as defined in Kravspec V4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* KPI 1: Genererat Affärsvärde (SEK) */}
          <div className="bg-[#F4F5F7] p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-gray-700">Genererat Affärsvärde (SEK)</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 font-display">
                {formatSek(currentUser.deals_closed_sek + totalClosedSek)}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Ackumulerat värde på stängda affärer initierade via nätverket.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-200/80 text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {userVisiblePipeline.filter(i => i.stage === 'closed_won').length} stängda kontrakt
              </span>
              <span className="text-gray-500">
                Aktiv pipeline: {formatSek(totalActivePipelineSek)}
              </span>
            </div>
          </div>

          {/* KPI 2: Give & Take Ratio (Givna vs Mottagna Intros) */}
          <div className="bg-[#F4F5F7] p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-gray-700">Give & Take Ratio (Intros)</span>
              <div className="w-7 h-7 rounded-lg bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900 font-display">{giveTakeRatio}x</span>
                <span className="text-xs font-bold text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded">
                  Givare ({giveRatioPercentage}%)
                </span>
              </div>
              
              {/* Visual Balance Meter */}
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#800020] h-full transition-all duration-500"
                  style={{ width: `${giveRatioPercentage}%` }}
                  title={`${givenIntros} Givna Intros`}
                />
                <div 
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${100 - giveRatioPercentage}%` }}
                  title={`${receivedIntros} Mottagna Intros`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600 pt-0.5">
                <span className="font-bold text-[#800020]">Givna: {givenIntros} st</span>
                <span className="font-bold text-blue-700">Mottagna: {receivedIntros} st</span>
              </div>
            </div>
            
            <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-200/80">
              Du ger 55% mer än du tar – genererar hög förtroendestatus i Hubben.
            </div>
          </div>

          {/* KPI 3: Aktiv Nätverkskadens (Senaste 30 dagarna) */}
          <div className="bg-[#F4F5F7] p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-gray-700">Aktiv Nätverkskadens</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                <span>{activeCadenceCount}</span>
                <span className="text-xs font-semibold text-gray-500">loggade kontakter/30d</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Mäter mötesaktivitet, trepartschattar och fysisk närvaro i hubben.
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-200/80 text-[11px]">
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Hög kadens (Rank #4 i Hubb Stockholm)
              </span>
              <span className="text-gray-400">Puls: Stark</span>
            </div>
          </div>

        </div>
      </div>

      {/* VIEW 1: 5-STAGE KANBAN BOARD */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stages.map(stg => {
            const itemsInStage = userVisiblePipeline.filter(item => {
              if (stg.id === 'meeting_done') {
                return item.stage === 'meeting_done' || item.stage === 'contact';
              }
              return item.stage === stg.id;
            });
            const stageTotal = itemsInStage.reduce((s, i) => s + i.value_sek, 0);

            return (
              <div
                key={stg.id}
                className={`rounded-2xl border ${stg.border} ${stg.bg} p-3 flex flex-col min-h-[500px] shadow-xs`}
              >
                {/* Stage Column Header */}
                <div className="pb-3 mb-3 border-b border-gray-200/90 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${stg.badgeBg} ${stg.badgeText}`}>
                      {stg.shortLabel}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
                      {itemsInStage.length}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">
                    {stg.label.split('. ')[1]}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                    <span>{formatSek(stageTotal)}</span>
                    <span className="text-[10px] italic">{stg.subtext}</span>
                  </div>
                </div>

                {/* Cards List in Stage */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {itemsInStage.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center text-[11px] text-gray-400 italic text-center px-2">
                      <span>Inga affärer i detta steg</span>
                      <span className="text-[10px] text-gray-300 mt-1">Dra eller flytta med pilarna</span>
                    </div>
                  ) : (
                    itemsInStage.map(deal => {
                      const normalizedStage = deal.stage === 'contact' ? 'meeting_done' : deal.stage;
                      return (
                        <div
                          key={deal.id}
                          className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-2 hover:border-[#800020]/40 transition group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-gray-900 leading-snug">
                              {deal.title}
                            </h4>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[11px] text-gray-700 font-semibold flex items-center gap-1.5">
                              <span>🏢</span>
                              <span className="truncate">{deal.client_company}</span>
                            </div>

                            {deal.contact_person && (
                              <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                <UserCheck className="w-3 h-3 text-gray-400" />
                                <span className="truncate">{deal.contact_person}</span>
                              </div>
                            )}

                            {deal.referral_source && (
                              <div className="text-[10px] text-[#800020] font-medium bg-[#800020]/5 px-2 py-0.5 rounded">
                                Ref: {deal.referral_source}
                              </div>
                            )}
                          </div>

                          <div className="flex items-baseline justify-between pt-1">
                            <span className="text-xs font-black text-[#800020] font-display">
                              {formatSek(deal.value_sek)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">
                              {deal.probability}% sannolikh.
                            </span>
                          </div>

                          {deal.next_step && (
                            <div className="text-[10px] text-gray-600 bg-[#F4F5F7] p-1.5 rounded-lg border border-gray-100">
                              <span className="font-bold text-gray-700">Nästa:</span> {deal.next_step}
                            </div>
                          )}

                          {/* Move Stage Controls & Due date */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                            <span className="truncate">Förfall: {deal.due_date}</span>
                            
                            <div className="flex items-center gap-1">
                              {normalizedStage !== 'lead' && (
                                <button
                                  onClick={() => moveStage(deal.id, normalizedStage, 'back')}
                                  className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                                  title="Flytta bakåt i fasen"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              
                              {normalizedStage !== 'closed_won' ? (
                                <button
                                  onClick={() => moveStage(deal.id, normalizedStage, 'forward')}
                                  className="px-1.5 py-1 rounded bg-[#800020] hover:bg-[#580016] text-white flex items-center gap-1 font-bold text-[10px]"
                                  title="Flytta framåt till nästa fas"
                                >
                                  <span>Fram</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> +100 BP
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MOBILE-OPTIMIZED ENSPALTIG STEGVY (V8 KRAVSPEC) */}
      {activeView === 'cards' && (
        <div className="space-y-4">
          {/* Horizontal stage pill selector */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedMobileStage('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedMobileStage === 'ALL'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alla Affärer ({userVisiblePipeline.length})
            </button>
            {stages.map(stg => {
              const count = userVisiblePipeline.filter(i => {
                const norm = i.stage === 'contact' ? 'meeting_done' : i.stage;
                return norm === stg.id;
              }).length;
              return (
                <button
                  key={stg.id}
                  onClick={() => setSelectedMobileStage(stg.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    selectedMobileStage === stg.id
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{stg.shortLabel}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedMobileStage === stg.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {userVisiblePipeline
              .filter(i => {
                const norm = i.stage === 'contact' ? 'meeting_done' : i.stage;
                if (selectedMobileStage === 'ALL') return true;
                return norm === selectedMobileStage;
              })
              .map(deal => {
                const normalizedStage = deal.stage === 'contact' ? 'meeting_done' : deal.stage;
                const stageMeta = stages.find(s => s.id === normalizedStage) || stages[0];
                const stageIndex = stages.findIndex(s => s.id === normalizedStage);
                const nextStage = stageIndex < stages.length - 1 ? stages[stageIndex + 1] : null;

                return (
                  <div
                    key={deal.id}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:border-[#800020]/30 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stageMeta.badgeBg} ${stageMeta.badgeText} ${stageMeta.border}`}>
                            {stageMeta.shortLabel}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Förfaller {deal.due_date}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mt-1">
                          {deal.title}
                        </h4>
                        <div className="text-xs text-gray-600 font-medium">
                          {deal.client_company} {deal.contact_person && `• Kontakt: ${deal.contact_person}`}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-[#800020] font-display">
                          {formatSek(deal.value_sek)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {deal.probability}% sannolikhet
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Nästa steg: {deal.next_step}</span>
                      </div>
                      {deal.notes && (
                        <p className="text-[11px] text-gray-500 italic pl-5">
                          "{deal.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-[11px] text-gray-400">
                        Källa: {deal.referral_source || 'Nätverket'}
                      </span>

                      <div className="flex items-center gap-2">
                        {nextStage ? (
                          <button
                            onClick={() => {
                              onUpdateStage(deal.id, nextStage.id);
                              if (nextStage.id === 'closed_won' && onAwardBoosterPoints) {
                                onAwardBoosterPoints(100, `Stängd affär: ${deal.title}`, 'DEAL_WON');
                                setWonDealCelebration({ title: deal.title, value: deal.value_sek });
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white font-bold text-xs flex items-center gap-1.5 transition"
                          >
                            <span>Flytta till {nextStage.shortLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Vunnen affär (+100 BP)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 3: DETAILED TABLE VIEW (TABELLVY) */}
      {activeView === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          
          {/* Table Filters Header */}
          <div className="p-4 border-b border-gray-200 bg-[#F4F5F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Sök på titel, företag eller kontaktperson..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Fas:
              </span>
              <select
                value={selectedStageFilter}
                onChange={e => setSelectedStageFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 font-semibold focus:outline-none"
              >
                <option value="ALL">Alla faser ({userVisiblePipeline.length})</option>
                <option value="lead">1. Lead</option>
                <option value="intro_sent">2. Intro skickad</option>
                <option value="meeting_done">3. 1-till-1 möte</option>
                <option value="proposal">4. Offert / Förslag</option>
                <option value="closed_won">5. Vunnen affär (+100 BP)</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Affär / Uppdrag</th>
                  <th className="py-3 px-4">Kundföretag & Kontakt</th>
                  <th className="py-3 px-4">Referenskälla</th>
                  <th className="py-3 px-4">Estimerat Värde</th>
                  <th className="py-3 px-4">Nuvarande Fas</th>
                  <th className="py-3 px-4">Nästa Steg</th>
                  <th className="py-3 px-4 text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPipeline.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                      Inga affärer matchade din sökning eller fasfilter.
                    </td>
                  </tr>
                ) : (
                  filteredPipeline.map(deal => {
                    const normalizedStage = deal.stage === 'contact' ? 'meeting_done' : deal.stage;
                    const stageMeta = stages.find(s => s.id === normalizedStage) || stages[0];

                    return (
                      <tr key={deal.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{deal.title}</div>
                          <div className="text-[10px] text-gray-400">Förfall: {deal.due_date}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800">{deal.client_company}</div>
                          <div className="text-[11px] text-gray-500">{deal.contact_person || 'Ej angiven'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[10px] font-semibold text-[#800020] bg-[#800020]/5 px-2 py-0.5 rounded">
                            {deal.referral_source || 'Booster Friends Nätverk'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-black text-[#800020] font-display">
                            {formatSek(deal.value_sek)}
                          </div>
                          <div className="text-[10px] text-gray-400">{deal.probability}% sannolikh.</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={normalizedStage}
                            onChange={e => {
                              const newStg = e.target.value as PipelineStage;
                              onUpdateStage(deal.id, newStg);
                              if (newStg === 'closed_won' && onAwardBoosterPoints) {
                                onAwardBoosterPoints(100, `Stängd affär: ${deal.title}`, 'DEAL_WON');
                                setWonDealCelebration({ title: deal.title, value: deal.value_sek });
                              }
                            }}
                            className={`border rounded-lg px-2.5 py-1 text-xs font-bold ${stageMeta.badgeBg} ${stageMeta.badgeText} ${stageMeta.border} focus:outline-none`}
                          >
                            <option value="lead">1. Lead</option>
                            <option value="intro_sent">2. Intro skickad</option>
                            <option value="meeting_done">3. 1-till-1 möte</option>
                            <option value="proposal">4. Offert / Förslag</option>
                            <option value="closed_won">5. Vunnen (+100 BP)</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-[11px] text-gray-700 truncate" title={deal.next_step}>
                            {deal.next_step}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {normalizedStage !== 'closed_won' ? (
                            <button
                              onClick={() => {
                                onUpdateStage(deal.id, 'closed_won');
                                if (onAwardBoosterPoints) {
                                  onAwardBoosterPoints(100, `Stängd affär: ${deal.title}`, 'DEAL_WON');
                                  setWonDealCelebration({ title: deal.title, value: deal.value_sek });
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition inline-flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Markera Vunnen</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                              WON +100 BP
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRERA NY AFFÄRSMÖJLIGHET (V4) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Registrera Ny Affärsmöjlighet
                  </h3>
                  <p className="text-[11px] text-gray-500">My Booster Pipeline CRM (V4)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3.5 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Affärens titel / leverans *
                </label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. Årligt SaaS Licensavtal eller M&A Rådgivning"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kundföretag *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="t.ex. Nordic Tech Group AB"
                    value={clientCompany}
                    onChange={e => setClientCompany(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kontaktperson hos kund
                  </label>
                  <input
                    type="text"
                    placeholder="t.ex. Sara Lind, IT-chef"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Uppskattat värde (SEK) *
                  </label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={valueSek}
                    onChange={e => setValueSek(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Initial fas i pipelinen
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as PipelineStage)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none"
                  >
                    <option value="lead">1. Identifierad Möjlighet (Lead)</option>
                    <option value="intro_sent">2. Introduktion Skickad</option>
                    <option value="meeting_done">3. 1-till-1 Möte Genomfört</option>
                    <option value="proposal">4. Offert / Förslag</option>
                    <option value="closed_won">5. Stängd Affär (+100 BP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Referenskälla / Introducerad av
                </label>
                <input
                  type="text"
                  placeholder="t.ex. Sofia Eklund (Warm Intro i appen)"
                  value={referralSource}
                  onChange={e => setReferralSource(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nästa planerade åtgärd
                  </label>
                  <input
                    type="text"
                    placeholder="t.ex. Skicka presentationsutkast"
                    value={nextStep}
                    onChange={e => setNextStep(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Förfallodatum
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Privata anteckningar
                </label>
                <textarea
                  rows={2}
                  placeholder="Kontext, kundbehov, kontaktpunkter..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Spara i Min Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
