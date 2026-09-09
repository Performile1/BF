import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Video, 
  Star, 
  UserPlus, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  ChevronRight,
  Flame,
  Crown,
  History,
  Info,
  Check,
  Gift,
  Send,
  Coffee,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  BadgePercent,
  TrendingUp,
  Sliders,
  AlertCircle,
  Download,
  Search,
  Filter,
  FileText,
  X
} from 'lucide-react';
import { 
  Member, 
  Hub, 
  BoosterScoreLog, 
  ActivityType, 
  GiveTakeMetrics, 
  P2PAllowance, 
  P2PPointTransfer,
  RewardShopItem 
} from '../../types';

interface GamificationModuleProps {
  currentUser: Member;
  allMembers?: Member[];
  members?: Member[];
  hubs?: Hub[];
  scoreLogs?: BoosterScoreLog[];
  onAwardPoints: (points: number, title: string, activityType: ActivityType, verificationMethod?: 'QR' | 'TWO_WAY' | 'GEO' | 'WARM_INTRO' | 'SYSTEM' | 'P2P') => void;
  onSimulateScore: (targetScore: number) => void;
  onOpenConnectModal?: () => void;
  onRedeemReward?: (item: RewardShopItem) => void;
}

export const GamificationModule: React.FC<GamificationModuleProps> = ({
  currentUser,
  allMembers,
  members,
  hubs = [],
  scoreLogs = [],
  onAwardPoints,
  onSimulateScore,
  onOpenConnectModal,
  onRedeemReward
}) => {
  const memberList = allMembers || members || [];
  const [leaderboardFilter, setLeaderboardFilter] = useState<'MONTH' | 'ALL_TIME'>('MONTH');
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'GIVE_TAKE' | 'REWARDS' | 'P2P_TIPPING' | 'HUB_BATTLE' | 'LEADERBOARD' | 'RULES' | 'LOGS'>('OVERVIEW');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Peer-to-Peer tipping state
  const [p2pMonthlyAllowance, setP2pMonthlyAllowance] = useState<number>(100);
  const [p2pUsed, setP2pUsed] = useState<number>(25);
  const [selectedP2PRecipient, setSelectedP2PRecipient] = useState<string>('');
  const [selectedP2PAmount, setSelectedP2PAmount] = useState<number>(25);
  const [p2pMessage, setP2pMessage] = useState<string>('');
  const [showP2PModal, setShowP2PModal] = useState<boolean>(false);

  // BP Ledger state
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'EARNED' | 'REDEEMED' | 'P2P' | 'DEALS' | 'EVENTS'>('ALL');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [selectedLedgerLog, setSelectedLedgerLog] = useState<BoosterScoreLog | null>(null);

  // Give & Take Metrics (Rickard: 1.8x ratio -> Generös Givar-status -> 1.25x Multiplikator)
  const [giveTakeMetrics, setGiveTakeMetrics] = useState<GiveTakeMetrics>({
    give_count: 18,
    take_count: 10,
    ratio: 1.8,
    status: 'GENEROUS',
    multiplier: 1.25,
    give_breakdown: {
      intros_sent: 7,
      skill_endorsements: 5,
      desk_swaps_lent: 2,
      guest_passes_invited: 3,
      lunch_hosted: 1
    },
    take_breakdown: {
      deals_received: 4,
      intros_received: 3,
      coworking_desks_used: 3
    }
  });

  // Reward Shop items (Inlösen & Värde)
  const [rewardItems, setRewardItems] = useState<RewardShopItem[]>([
    {
      id: 'rew_flex_pass',
      title: '1x Extra Flexpass (Coworking)',
      description: 'Lös in 250 BP mot 1 extra dagsbiljett till valfritt Convendum, Helio eller Booster Hubb i nätverket.',
      points_cost: 250,
      category: 'FLEX_PASS',
      icon: 'Ticket',
      is_available: true,
      action_label: 'Växla In Flexpass'
    },
    {
      id: 'rew_stage_pitch',
      title: 'Pitch & Scenutrymme på Stor Hubbträff',
      description: 'Presentera ditt bolag i 3 minuter inför hela regionens medlemmar under storfrukosten.',
      points_cost: 500,
      category: 'STAGE_PITCH',
      icon: 'Megaphone',
      is_available: true,
      action_label: 'Boka Scenplats'
    },
    {
      id: 'rew_course_discount',
      title: '50% Rabattkod på Booster Pack Utbildning',
      description: 'Gäller certifieringarna Tech M&A, B2B Skalning eller Styrelsearbete i Booster Academy.',
      points_cost: 400,
      category: 'COURSE_DISCOUNT',
      icon: 'BadgePercent',
      is_available: true,
      action_label: 'Hämta Rabattkod'
    },
    {
      id: 'rew_webinar_host',
      title: 'Håll ett Live Webinar (Expert-spotlight)',
      description: 'Positionera dig som branschexpert och få nätverksbred exponering med livestream i appen.',
      points_cost: 1000,
      category: 'WEBINAR_HOST',
      icon: 'Video',
      is_available: true,
      action_label: 'Ansök om Sändning'
    }
  ]);

  // Level calculations
  const getLevelInfo = (score: number) => {
    if (score >= 2001) {
      return {
        level: 4,
        name: 'Master Networker',
        tag: 'Level 4: Master Networker (2001+ BP)',
        min: 2001,
        max: 3500,
        badgeBg: 'bg-gradient-to-r from-[#800020] via-amber-600 to-amber-500',
        textCol: 'text-amber-300',
        borderCol: 'border-amber-400',
        isMax: true,
        perks: 'Exklusiv profilkant i Maroon & Guld samt prioriterad placering överst i leverantörssök.'
      };
    } else if (score >= 751) {
      return {
        level: 3,
        name: 'Power Booster',
        tag: 'Level 3: Power Booster (751–2000 BP)',
        min: 751,
        max: 2000,
        badgeBg: 'bg-[#800020]',
        textCol: 'text-rose-100',
        borderCol: 'border-[#800020]',
        isMax: false,
        perks: 'Förtur till populära VIP-event, frukostar och 1.25x poängmultiplikator vid balanserad Give-ratio.'
      };
    } else if (score >= 251) {
      return {
        level: 2,
        name: 'Connector',
        tag: 'Level 2: Connector (251–750 BP)',
        min: 251,
        max: 750,
        badgeBg: 'bg-indigo-700',
        textCol: 'text-indigo-100',
        borderCol: 'border-indigo-400',
        isMax: false,
        perks: 'Tillgång till regionala samarbetstrådar och gästpasskvoter.'
      };
    } else {
      return {
        level: 1,
        name: 'Networker',
        tag: 'Level 1: Networker (0–250 BP)',
        min: 0,
        max: 250,
        badgeBg: 'bg-slate-700',
        textCol: 'text-slate-100',
        borderCol: 'border-slate-400',
        isMax: false,
        perks: 'Grundläggande åtkomst till veckoträffar och digital hubbprofil.'
      };
    }
  };

  const currentLevel = getLevelInfo(currentUser.booster_score);
  
  // Progress towards next level
  const nextLevelMin = currentLevel.level === 1 ? 251 : currentLevel.level === 2 ? 751 : 2001;
  const prevLevelMin = currentLevel.level === 1 ? 0 : currentLevel.level === 2 ? 251 : 751;
  const progressPercent = currentLevel.level === 4 
    ? 100 
    : Math.min(100, Math.max(0, Math.round(((currentUser.booster_score - prevLevelMin) / (nextLevelMin - prevLevelMin)) * 100)));

  // Real business value point matrix
  const pointMatrix = [
    {
      group: 'Direkt Affärsnytta (Högsta Värdet)',
      items: [
        {
          title: 'Skapa en verifierad 3-partschatt / Warm Intro',
          basePoints: 40,
          desc: 'Koppla ihop två relevanta medlemmar med motivering.',
          verification: 'WARM_INTRO' as const,
          type: 'INTRO_3WAY' as ActivityType,
          icon: MessageSquare
        },
        {
          title: 'Stängd affär i My Booster Pipeline (< 10 000 kr)',
          basePoints: 30,
          desc: 'Bekräftad mindre leverans eller konsultinsats.',
          verification: 'TWO_WAY' as const,
          type: 'DEAL_WON' as ActivityType,
          icon: CheckCircle2
        },
        {
          title: 'Stängd affär i My Booster Pipeline (10 000 – 50 000 kr)',
          basePoints: 75,
          desc: 'Avtal signerat och verifierat av köpare och säljare.',
          verification: 'TWO_WAY' as const,
          type: 'DEAL_WON' as ActivityType,
          icon: CheckCircle2
        },
        {
          title: 'Stängd affär i My Booster Pipeline (50 000 – 200 000 kr)',
          basePoints: 150,
          desc: '+50 BP delas även ut till medlemmen som gjorde introt!',
          verification: 'TWO_WAY' as const,
          type: 'DEAL_WON' as ActivityType,
          icon: CheckCircle2
        },
        {
          title: 'Major Deal: Stängd affär > 200 000 kr',
          basePoints: 300,
          desc: 'Låser även upp hedersutmärkelsen "Deal Maker Badge".',
          verification: 'TWO_WAY' as const,
          type: 'DEAL_WON' as ActivityType,
          icon: Trophy
        },
        {
          title: 'Buda in en gäst som går på hubbträff (Guest Pass)',
          basePoints: 50,
          desc: 'Gästen checkar in fysiskt med QR eller geofencing.',
          verification: 'QR' as const,
          type: 'GUEST_PASS_ATTEND' as ActivityType,
          icon: UserPlus
        }
      ]
    },
    {
      group: 'Förtroende & Kvalitet',
      items: [
        {
          title: 'Verifierad Skillbar Endorsement till kollega',
          basePoints: 10,
          desc: 'Betygsätt specifik expertis du själv anlitat.',
          verification: 'SYSTEM' as const,
          type: 'SKILL_ENDORSEMENT' as ActivityType,
          icon: Star
        },
        {
          title: 'Positivt medlemsomdöme (5 stjärnor med recension)',
          basePoints: 25,
          desc: 'Skriftligt omdöme efter genomfört projekt.',
          verification: 'SYSTEM' as const,
          type: 'MEMBER_REVIEW_5STAR' as ActivityType,
          icon: Star
        },
        {
          title: 'Låna ut fast flexplats på Hubb (Desk Swap)',
          basePoints: 25,
          desc: 'När du reser bort och lånar ut till en kollega.',
          verification: 'SYSTEM' as const,
          type: 'DESK_SWAP_LEND' as ActivityType,
          icon: Sliders
        }
      ]
    },
    {
      group: 'Engagemang & Närvaro',
      items: [
        {
          title: 'Fysisk incheckning på officiell Hubbträff (QR / Geo)',
          basePoints: 30,
          desc: 'Verifierad fysisk närvaro i hubblokalen.',
          verification: 'QR' as const,
          type: 'EVENT_CHECKIN' as ActivityType,
          icon: QrCode
        },
        {
          title: 'Loggat & bekräftat 1-till-1 kaffemöte',
          basePoints: 20,
          desc: 'Tvåvägsverifiering krävs: båda bekräftar mötet.',
          verification: 'TWO_WAY' as const,
          type: 'ONE_ON_ONE_LOGGED' as ActivityType,
          icon: Coffee
        },
        {
          title: 'Bjud kollega på lunch ("Jag bjuder på lunchen")',
          basePoints: 30,
          desc: 'Generöst initiativ för att stärka relationen.',
          verification: 'TWO_WAY' as const,
          type: 'LUNCH_HOST_INVITE' as ActivityType,
          icon: Coffee
        },
        {
          title: 'Delta i ett live-webinar i appen',
          basePoints: 15,
          desc: 'Aktiv närvaro i minst 20 minuter.',
          verification: 'SYSTEM' as const,
          type: 'WEBINAR_ATTEND' as ActivityType,
          icon: Video
        },
        {
          title: 'Recensera genomfört event (+20 BP om inom 24h)',
          basePoints: 20,
          desc: 'Hjälp nätverket med värdefull feedback efter träffen.',
          verification: 'SYSTEM' as const,
          type: 'EVENT_REVIEW_SUBMITTED' as ActivityType,
          icon: Star
        }
      ]
    }
  ];

  // Hub Battle Standings
  const hubBattleStandings = [
    {
      id: 'hub_stockholm',
      name: 'Hubb Stockholm City',
      avg_points: 745,
      total_points: 105790,
      active_members: 142,
      trend: '+18% denna månad',
      is_leader: true,
      trophy: 'Månadens Hubb (Ledare)'
    },
    {
      id: 'hub_goteborg',
      name: 'Hubb Göteborg Avenyn',
      avg_points: 692,
      total_points: 65740,
      active_members: 95,
      trend: '+12% denna månad',
      is_leader: false
    },
    {
      id: 'hub_malmo',
      name: 'Hubb Malmö Dockan',
      avg_points: 620,
      total_points: 44640,
      active_members: 72,
      trend: '+15% denna månad',
      is_leader: false
    },
    {
      id: 'hub_uppsala',
      name: 'Hubb Uppsala Slottet',
      avg_points: 585,
      total_points: 28080,
      active_members: 48,
      trend: '+9% denna månad',
      is_leader: false
    }
  ];

  // Sorted members for leaderboard
  const sortedMembers = [...memberList].sort((a, b) => b.booster_score - a.booster_score);

  const handleSendP2P = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedP2PRecipient) {
      alert('Vänligen välj en mottagare.');
      return;
    }

    if (selectedP2PAmount > (p2pMonthlyAllowance - p2pUsed)) {
      alert('Du har inte tillräckligt med P2P-poäng kvar i månadens pott.');
      return;
    }

    const recipient = memberList.find(m => m.id === selectedP2PRecipient);
    const recipientName = recipient ? recipient.full_name : 'kollega';

    // Update local allowance
    setP2pUsed(prev => prev + selectedP2PAmount);

    // Trigger point award for recipient (simulation)
    setActionSuccessMessage(`🎉 Du skickade ${selectedP2PAmount} BP till ${recipientName}! Meddelande: "${p2pMessage || 'Tack för gott samarbete'}" (Dras från din fria givarpott)`);
    setTimeout(() => setActionSuccessMessage(null), 5000);

    // Reset form
    setP2pMessage('');
    setShowP2PModal(false);
  };

  const handleRedeemItem = (item: RewardShopItem) => {
    if (currentUser.booster_score < item.points_cost) {
      alert(`Du behöver ${item.points_cost} BP för att lösa in "${item.title}". Du har ${currentUser.booster_score} BP.`);
      return;
    }

    if (onRedeemReward) {
      onRedeemReward(item);
    } else {
      onAwardPoints(-item.points_cost, `Inlöst i Belöningsbutiken: ${item.title}`, 'REWARD_REDEEMED', 'SYSTEM');
    }

    setActionSuccessMessage(`🎁 Du har löst in "${item.title}" för ${item.points_cost} BP! Ett bekräftelsemail och kvitto har skapats.`);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleTriggerMatrixRule = (item: typeof pointMatrix[0]['items'][0]) => {
    // Apply multiplier if Give/Take ratio > 1.5
    const multiplier = giveTakeMetrics.multiplier;
    const finalPoints = Math.round(item.basePoints * multiplier);
    const titleWithNote = multiplier > 1 
      ? `${item.title} (${item.basePoints} BP × ${multiplier}x Give-Bonus)`
      : item.title;

    onAwardPoints(finalPoints, titleWithNote, item.type, item.verification);
    setActionSuccessMessage(`+${finalPoints} BP erhållet för "${item.title}"! (Verifierad metod: ${item.verification})`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Notification */}
      {actionSuccessMessage && (
        <div className="bg-[#800020] text-white p-4 rounded-2xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-white/80 hover:text-white font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {/* Hero: Level Banner & Master Networker Status */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-amber-100/40 via-rose-50/30 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar with optional Level 4 Maroon/Gold master ring */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl overflow-hidden ${
                currentUser.booster_score >= 2001
                  ? 'ring-4 ring-amber-400 ring-offset-2 shadow-lg shadow-amber-500/20'
                  : 'border-2 border-gray-200'
              }`}>
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.full_name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {currentUser.booster_score >= 2001 && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-[#800020] text-white p-1 rounded-lg shadow-xs" title="Level 4: Master Networker">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 font-display">
                  {currentUser.full_name}
                </h2>
                <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white ${currentLevel.badgeBg} shadow-xs flex items-center gap-1.5`}>
                  {currentLevel.level === 4 && <Crown className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{currentLevel.name}</span>
                </span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {currentUser.hub_name}
                </span>
              </div>

              <p className="text-xs text-gray-600">
                {currentLevel.perks}
              </p>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black text-[#800020] font-display">
                  {currentUser.booster_score.toLocaleString('sv-SE')}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Booster Points (BP)
                </span>
                
                {/* Universal Connect shortcut */}
                {onOpenConnectModal && (
                  <button
                    onClick={onOpenConnectModal}
                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition shadow-2xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Mitt QR-Kort</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress to next level / Simulator */}
          <div className="bg-[#F4F5F7] p-4 rounded-2xl border border-gray-200 min-w-[280px] lg:max-w-md w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">Framsteg till nästa nivå</span>
              {currentLevel.level < 4 ? (
                <span className="font-bold text-[#800020]">
                  {nextLevelMin - currentUser.booster_score} BP kvar till Level {currentLevel.level + 1}
                </span>
              ) : (
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Maxnivå nådd!
                </span>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#800020] to-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>Nivå {currentLevel.level} ({prevLevelMin} BP)</span>
              <span>{progressPercent}% uppnått</span>
              <span>Nivå {Math.min(4, currentLevel.level + 1)} ({nextLevelMin} BP)</span>
            </div>

            {/* Quick test buttons for simulator */}
            <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 font-medium">Testa nivåprofil:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onSimulateScore(890)}
                  className="px-2 py-0.5 rounded bg-white border border-gray-300 text-[10px] font-bold text-gray-700 hover:bg-gray-100"
                >
                  L3 (890 BP)
                </button>
                <button
                  onClick={() => onSimulateScore(2150)}
                  className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-[10px] font-black text-white shadow-xs flex items-center gap-1"
                  title="Aktivera Master Networker Maroon/Guld ram"
                >
                  <Crown className="w-3 h-3" />
                  <span>L4 Master (2150 BP)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-1.5 pt-6 mt-6 border-t border-gray-100 overflow-x-auto scrollbar-none">
          {[
            { id: 'OVERVIEW', label: 'Översikt & Nivåer', icon: Sparkles },
            { id: 'GIVE_TAKE', label: 'Give & Take Balans (1.25x)', icon: TrendingUp },
            { id: 'REWARDS', label: 'Belöningsbutik (Inlösen)', icon: Gift },
            { id: 'P2P_TIPPING', label: `Ge BP (${p2pMonthlyAllowance - p2pUsed} kvar)`, icon: Send },
            { id: 'RULES', label: 'Värdeskapande Poängmatris', icon: Zap },
            { id: 'LOGS', label: `BP Ledger & Revision (${scoreLogs.length})`, icon: History },
            { id: 'HUB_BATTLE', label: 'Månadens Hubb', icon: Trophy },
            { id: 'LEADERBOARD', label: 'Topplista', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'bg-[#F4F5F7] text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: OVERVIEW & 4 LEVEL TIERS */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Bento Summary row: Give & Take status + P2P Allowance Quick card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Give & Take summary card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    GIVE & TAKE BALANS
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                    🟢 Generös Givar-status ({giveTakeMetrics.ratio}x)
                  </span>
                </div>
                <h3 className="text-lg font-black text-emerald-950 mt-1">
                  Din Poängmultiplikator: {giveTakeMetrics.multiplier}x Aktiv!
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Eftersom du ger mer än du tar (ratio &gt; 1.5) multipliceras alla dina intjänade poäng med 1.25x. Fortsätt bjuda på intros och rekommendationer!
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-semibold">18 Givande handlingar vs 10 Mottagna</span>
                <button
                  onClick={() => setActiveSubTab('GIVE_TAKE')}
                  className="font-bold text-emerald-900 hover:text-emerald-950 underline flex items-center gap-1"
                >
                  <span>Visa detaljerad analys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* P2P Tipping Quick card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                    PEER-TO-PEER GIVARPOTT
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-black text-[10px]">
                    Månatlig Gratispott
                  </span>
                </div>
                <h3 className="text-lg font-black text-purple-950 mt-1">
                  {p2pMonthlyAllowance - p2pUsed} P2P BP kvar att ge bort
                </h3>
                <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                  Varje månad får du 100 fria poäng av Booster Friends att ge bort till kollegor som hjälpt dig med sparring, råd eller feedback.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-purple-200/80 flex items-center justify-between text-xs">
                <span className="text-purple-900 font-semibold">Nollställs vid månadsskifte</span>
                <button
                  onClick={() => setActiveSubTab('P2P_TIPPING')}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ge poäng till en kollega</span>
                </button>
              </div>
            </div>

          </div>

          {/* 4 Level Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                lvl: 1,
                name: 'Networker',
                range: '0 – 250 BP',
                badgeBg: 'bg-slate-800',
                desc: 'Nya medlemmar som tar sina första steg. Tillgång till veckovisa hubbträffar och digital profil.',
                isCurrent: currentLevel.level === 1
              },
              {
                lvl: 2,
                name: 'Connector',
                range: '251 – 750 BP',
                badgeBg: 'bg-indigo-700',
                desc: 'Aktiv relationsbyggare som loggar 1-till-1 möten och deltar i webinars. Får digitala gästpass.',
                isCurrent: currentLevel.level === 2
              },
              {
                lvl: 3,
                name: 'Power Booster',
                range: '751 – 2000 BP',
                badgeBg: 'bg-[#800020]',
                desc: 'Drivande kraft i nätverket med stängda affärer och 3-partschattar. Prioriterad AI-matchning.',
                isCurrent: currentLevel.level === 3
              },
              {
                lvl: 4,
                name: 'Master Networker',
                range: '2001+ BP',
                badgeBg: 'bg-gradient-to-r from-[#800020] to-amber-500',
                desc: 'Högsta status i Booster Friends. Exklusiv Maroon & Guld-profilram och förtur till VIP-event.',
                isCurrent: currentLevel.level === 4
              }
            ].map(tier => (
              <div 
                key={tier.lvl}
                className={`rounded-2xl p-5 border transition ${
                  tier.isCurrent
                    ? 'bg-white border-[#800020] shadow-md ring-2 ring-[#800020]/20'
                    : 'bg-white border-gray-200 shadow-2xs opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${tier.badgeBg}`}>
                    Level {tier.lvl}
                  </span>
                  {tier.isCurrent && (
                    <span className="text-[10px] font-extrabold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-full">
                      DIN NIVÅ
                    </span>
                  )}
                </div>

                <h4 className="font-black text-gray-900 text-base">{tier.name}</h4>
                <p className="text-xs font-mono font-bold text-gray-400 mt-0.5">{tier.range}</p>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>

          {/* Point Exchange / Quick Reward preview */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900 font-display flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#800020]" />
                  <span>Lås upp Belöningar (Belöningsbutik / Point Exchange)</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Gör dina poäng meningsfulla – växla in mot praktiskt och ekonomiskt affärsvärde
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('REWARDS')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Visa hela butiken ({rewardItems.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewardItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#800020] bg-rose-50 px-2 py-0.5 rounded-lg">
                        {item.points_cost} BP
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{item.category}</span>
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mt-2">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeemItem(item)}
                    className="w-full py-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold text-gray-800 transition shadow-2xs"
                  >
                    {item.action_label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: GIVE & TAKE BALANS */}
      {activeSubTab === 'GIVE_TAKE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            
            <div className="border-b border-gray-100 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Balansmodellen (Give & Take Ratio)</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 font-display">
                Varför Give & Take Ratio är nätverkets viktigaste hävstång
              </h3>
              <p className="text-xs text-gray-600 max-w-3xl mt-1 leading-relaxed">
                För att skydda nätverket från freeloaders och belöna de som driver affärer till andra har Booster Friends en inbyggd ratio-multiplikator. 
                De som bidrar mer än de konsumerar erhåller en 1.25x multiplikator på samtliga poäng som genereras.
              </p>
            </div>

            {/* Ratio rules visual bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900">🟢 Generös Givar-status</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">1.25x Multiplier</span>
                </div>
                <p className="text-xs font-bold text-emerald-950 mt-1">Ratio &gt; 1.5</p>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Du ger mer än du tar. Dina framtida poäng multipliceras med 1.25x och din profil lyfts fram i AI-matchningar.
                </p>
                <div className="mt-3 text-[10px] font-bold text-emerald-900 bg-white/60 p-1.5 rounded-lg">
                  DIN AKTUELLA STATUS ({giveTakeMetrics.ratio}x Ratio)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-800">🟡 Neutral / Balanserad</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gray-400 text-white">1.0x Multiplier</span>
                </div>
                <p className="text-xs font-bold text-gray-900 mt-1">Ratio 0.8 – 1.4</p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Standardläge. Du ger ungefär lika mycket värde som du tar emot från ekosystemet.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-800">🔴 Konsument-status</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">0.75x Multiplier</span>
                </div>
                <p className="text-xs font-bold text-rose-950 mt-1">Ratio &lt; 0.7</p>
                <p className="text-[11px] text-rose-800 mt-1">
                  Medlemmen tar emot affärer och intros utan att bidra tillbaka. Poängintjäning dämpas tills balansen återställs.
                </p>
              </div>
            </div>

            {/* Detailed activity metrics breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              
              {/* Give breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Vad du har gett ekosystemet ({giveTakeMetrics.give_count} st)</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">+18 Give-poäng</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Varma Introduktioner (3-partschattar) skickade</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.give_breakdown.intros_sent} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Gästpass-inbjudningar som checkat in</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.give_breakdown.guest_passes_invited} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Skillbar Endorsements & Omdömen lämnade</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.give_breakdown.skill_endorsements} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Utlånade flexplatser (Desk Swaps)</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.give_breakdown.desk_swaps_lent} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Bjudit kollega på lunch/kaffe</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.give_breakdown.lunch_hosted} st</span>
                  </div>
                </div>
              </div>

              {/* Take breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Vad du har mottagit från ekosystemet ({giveTakeMetrics.take_count} st)</span>
                  </h4>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">10 Take-poäng</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Affärer vunna/mottagna som leverantör</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.take_breakdown.deals_received} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Varma intros mottagna från andra</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.take_breakdown.intros_received} st</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Utnyttjade Coworking-skrivbord från kvot</span>
                    <span className="font-bold text-gray-900">{giveTakeMetrics.take_breakdown.coworking_desks_used} st</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold">💡 Tips för att behålla 1.25x multiplikatorn:</p>
                  <p>
                    Fortsätt koppla ihop medlemmar med varma intros när du ser synergier. Ett enda godkänt intro ger +40 BP och ökar din Give-kvot!
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SUB-VIEW 3: BELÖNINGSBUTIK (INLÖSEN) */}
      {activeSubTab === 'REWARDS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 font-display">
                    Belöningsbutik (Point Exchange)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Växla dina Booster Points mot faktiskt affärsvärde, exponering och coworking-dagar
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 block">DITT SALDO</span>
                  <span className="text-xl font-black text-[#800020] font-display">
                    {currentUser.booster_score.toLocaleString('sv-SE')} BP
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewardItems.map(item => (
                <div key={item.id} className="p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#800020] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        {item.points_cost} Booster Points
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      {currentUser.booster_score >= item.points_cost ? '✅ Du har tillräckligt med poäng' : `⚠️ Saknar ${item.points_cost - currentUser.booster_score} BP`}
                    </span>
                    <button
                      onClick={() => handleRedeemItem(item)}
                      disabled={currentUser.booster_score < item.points_cost}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                        currentUser.booster_score >= item.points_cost
                          ? 'bg-[#800020] hover:bg-[#68001a] text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {item.action_label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PEER-TO-PEER POINT TIPPING */}
      {activeSubTab === 'P2P_TIPPING' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            
            <div className="border-b border-gray-100 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-bold mb-2">
                <Send className="w-3.5 h-3.5 text-purple-600" />
                <span>Peer-to-Peer Tipping (Månatlig Givarpott)</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 font-display">
                Ge Booster Points direkt till en kollega
              </h3>
              <p className="text-xs text-gray-600 max-w-3xl mt-1 leading-relaxed">
                Varje månad tilldelas varje aktiv medlem <strong>100 P2P Booster Points</strong> från nätverkets centrala pott. 
                Dessa kan du ge till kollegor som ställt upp med värdefull sparring, feedback, ett varmt råd eller en ovärderlig kontakt. 
                Poängen dras <em>inte</em> från ditt eget saldo – men nollställs vid månadsskifte!
              </p>
            </div>

            {/* Monthly allowance status box */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Månadens Givarpott (September 2026)
                </span>
                <span className="text-2xl font-black text-purple-950 font-display">
                  {p2pMonthlyAllowance - p2pUsed} BP kvar
                </span>
                <span className="text-xs text-purple-800 ml-2">av {p2pMonthlyAllowance} BP</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-purple-900">
                  {p2pUsed} BP utdelat denna månad
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            {/* Interactive Send Form */}
            <form onSubmit={handleSendP2P} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 max-w-2xl">
              <h4 className="text-sm font-black text-gray-900">Skicka direkt-tack till en kollega:</h4>

              {/* Recipient select */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Välj mottagare i Booster Friends:
                </label>
                <select
                  value={selectedP2PRecipient}
                  onChange={(e) => setSelectedP2PRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:border-[#800020]"
                >
                  <option value="">-- Välj kollega i nätverket --</option>
                  {memberList
                    .filter(m => m.id !== currentUser.id)
                    .map(m => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.company_name} • {m.hub_name})
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount options */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Antal poäng att ge:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedP2PAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-black transition border ${
                        selectedP2PAmount === amt
                          ? 'bg-[#800020] text-white border-[#800020] shadow-xs'
                          : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      +{amt} BP
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Personlig hälsning / motivering (visas i kollegans feed):
                </label>
                <textarea
                  rows={2}
                  placeholder="T.ex: Stort tack för fantastisk sparring kring vår varumärkesstrategi inför expansionen!"
                  value={p2pMessage}
                  onChange={(e) => setP2pMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedP2PRecipient || (p2pMonthlyAllowance - p2pUsed) < selectedP2PAmount}
                className="w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Skicka +{selectedP2PAmount} Booster Points</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* SUB-VIEW 5: VÄRDESKAPANDE POÄNGMATRIS */}
      {activeSubTab === 'RULES' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            
            <div className="border-b border-gray-100 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 font-display">
                    Värdeskapande Poängmatris (Kravspecifikation V4/V5)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Endast reellt affärsvärde, förtroende och aktivt bidrag till ekosystemet belönas.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  <span>Din Multiplikator: {giveTakeMetrics.multiplier}x Aktiv</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {pointMatrix.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {section.group}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item, i) => {
                      const Icon = item.icon;
                      const calculatedPoints = Math.round(item.basePoints * giveTakeMetrics.multiplier);
                      return (
                        <div 
                          key={i}
                          className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition flex items-start justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#800020] shrink-0 shadow-2xs mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-gray-900 leading-snug">
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-gray-500 leading-relaxed">
                                {item.desc}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-white border border-gray-200 text-gray-600">
                                  Verifiering: {item.verification}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-[#800020] font-display block">
                              +{calculatedPoints} BP
                            </span>
                            {giveTakeMetrics.multiplier > 1 && (
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                (Bas {item.basePoints} BP)
                              </span>
                            )}
                            <button
                              onClick={() => handleTriggerMatrixRule(item)}
                              className="mt-2 text-[10px] font-bold text-[#800020] hover:underline"
                            >
                              Testa trigga →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* SUB-VIEW 6: AUDIT TRAIL / BP LEDGER */}
      {activeSubTab === 'LOGS' && (() => {
        // Calculate ledger metrics
        const totalEarned = scoreLogs.filter(l => l.points_awarded > 0).reduce((acc, l) => acc + l.points_awarded, 0);
        const totalRedeemed = Math.abs(scoreLogs.filter(l => l.points_awarded < 0).reduce((acc, l) => acc + l.points_awarded, 0));

        // Filtered logs
        const filteredLogs = scoreLogs.filter(log => {
          // Category filter
          if (ledgerFilter === 'EARNED' && log.points_awarded <= 0) return false;
          if (ledgerFilter === 'REDEEMED' && log.points_awarded >= 0) return false;
          if (ledgerFilter === 'P2P' && log.verification_method !== 'P2P' && !log.title.toLowerCase().includes('p2p')) return false;
          if (ledgerFilter === 'DEALS' && !log.title.toLowerCase().includes('affär') && !log.title.toLowerCase().includes('deal')) return false;
          if (ledgerFilter === 'EVENTS' && !log.title.toLowerCase().includes('hubb') && !log.title.toLowerCase().includes('event') && !log.title.toLowerCase().includes('webinar')) return false;

          // Search
          if (ledgerSearch.trim()) {
            const q = ledgerSearch.toLowerCase();
            const matchTitle = log.title?.toLowerCase().includes(q);
            const matchDesc = log.description?.toLowerCase().includes(q);
            const matchMethod = log.verification_method?.toLowerCase().includes(q);
            const matchId = log.id?.toLowerCase().includes(q);
            if (!matchTitle && !matchDesc && !matchMethod && !matchId) return false;
          }

          return true;
        });

        // Compute running balance from initial score
        let running = currentUser.booster_score;
        const logsWithBalance = filteredLogs.map((log, index) => {
          const bal = running;
          running = running - log.points_awarded;
          return { ...log, runningBalance: bal };
        });

        const handleExportCsv = () => {
          const headers = ['Transaktions-ID', 'Datum', 'Titel', 'Beskrivning', 'Typ', 'Verifieringsmetod', 'Multiplikator', 'Poängändring (BP)', 'Saldo efter (BP)'];
          const rows = logsWithBalance.map(l => [
            `"${l.id}"`,
            `"${l.created_at || 'N/A'}"`,
            `"${l.title.replace(/"/g, '""')}"`,
            `"${(l.description || '').replace(/"/g, '""')}"`,
            `"${l.activity_type || 'STANDARD'}"`,
            `"${l.verification_method || 'SYSTEM'}"`,
            `"${l.multiplier_applied || 1}x"`,
            l.points_awarded,
            l.runningBalance
          ]);

          const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `Booster_Points_Ledger_${currentUser.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            
            {/* Header with Title & Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-bold mb-2">
                  <History className="w-3.5 h-3.5" />
                  <span>Booster Points (BP) Officiell Huvudbok</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 font-display">
                  Transaktionshistorik & Revisionskedja
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Full transparens: Varje poängpost har en låst tidsstämpel, verifieringsmetod, base score och multiplikator.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportera Kontoutdrag (CSV)</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#800020]/5 border border-[#800020]/20">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aktuellt Saldo</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-2xl font-black text-[#800020]">{currentUser.booster_score.toLocaleString('sv-SE')}</p>
                  <span className="text-xs font-bold text-gray-400">BP</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Nivå {currentLevel.level} • {currentLevel.name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Totala Intjänade</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-2xl font-black text-emerald-700">+{totalEarned.toLocaleString('sv-SE')}</p>
                  <span className="text-xs font-bold text-emerald-600">BP</span>
                </div>
                <p className="text-[10px] text-emerald-800/80 mt-0.5">{scoreLogs.filter(l => l.points_awarded > 0).length} intjänade poster</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Totala Inlösta</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-2xl font-black text-rose-700">-{totalRedeemed.toLocaleString('sv-SE')}</p>
                  <span className="text-xs font-bold text-rose-600">BP</span>
                </div>
                <p className="text-[10px] text-rose-800/80 mt-0.5">Belöningar & utnyttjade förmåner</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Aktiv Give-Bonus</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-2xl font-black text-amber-800">{giveTakeMetrics.multiplier}x</p>
                  <span className="text-xs font-bold text-amber-700">Bonus</span>
                </div>
                <p className="text-[10px] text-amber-800/80 mt-0.5">Give/Take ratio: {giveTakeMetrics.ratio}x</p>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
              {/* Category chips */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                {[
                  { id: 'ALL', label: 'Alla Poster' },
                  { id: 'EARNED', label: 'Intjänade (+BP)' },
                  { id: 'REDEEMED', label: 'Inlösta (-BP)' },
                  { id: 'P2P', label: 'P2P Tipping' },
                  { id: 'DEALS', label: 'Affärer & CRM' },
                  { id: 'EVENTS', label: 'Hubb & Träffar' }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setLedgerFilter(chip.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      ledgerFilter === chip.id
                        ? 'bg-[#800020] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sök transaktion, metod eller ID..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#800020]"
                />
                {ledgerSearch && (
                  <button
                    onClick={() => setLedgerSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Ledger Table / List */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
              <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-2 items-center">
                <span className="col-span-5 md:col-span-4">Transaktion & Händelse</span>
                <span className="hidden md:block md:col-span-2">Verifieringsmetod</span>
                <span className="col-span-3 md:col-span-2">Datum & Tid</span>
                <span className="col-span-2 text-right">Poängändring</span>
                <span className="col-span-2 text-right">Löpande Saldo</span>
              </div>

              <div className="divide-y divide-gray-100 bg-white">
                {logsWithBalance.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    Inga transaktioner matchar dina filterkriterier.
                  </div>
                ) : (
                  logsWithBalance.map((log) => {
                    const isPositive = log.points_awarded > 0;
                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedLedgerLog(log)}
                        className="px-4 py-3.5 hover:bg-gray-50/80 transition cursor-pointer grid grid-cols-12 gap-2 items-center text-xs"
                      >
                        {/* Transaction title & details */}
                        <div className="col-span-5 md:col-span-4 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <h4 className="font-bold text-gray-900 truncate">{log.title}</h4>
                          </div>
                          {log.description && (
                            <p className="text-[11px] text-gray-500 truncate mt-0.5 pl-4">
                              {log.description}
                            </p>
                          )}
                        </div>

                        {/* Verification Method Badge */}
                        <div className="hidden md:flex md:col-span-2 items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 font-mono">
                            {log.verification_method || 'SYSTEM'}
                          </span>
                          {log.multiplier_applied && log.multiplier_applied > 1 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              {log.multiplier_applied}x
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div className="col-span-3 md:col-span-2 text-[11px] text-gray-500">
                          {log.created_at ? new Date(log.created_at).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Nyligen'}
                        </div>

                        {/* Points change */}
                        <div className="col-span-2 text-right font-black font-mono">
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${
                            isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                          }`}>
                            {isPositive ? `+${log.points_awarded}` : log.points_awarded} BP
                          </span>
                        </div>

                        {/* Running balance */}
                        <div className="col-span-2 text-right font-black font-mono text-gray-900">
                          {log.runningBalance.toLocaleString('sv-SE')} BP
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Receipt Modal / Audit Details */}
            {selectedLedgerLog && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#800020]" />
                      <h3 className="text-base font-bold text-gray-900">Transaktionskvitto & Revision</h3>
                    </div>
                    <button
                      onClick={() => setSelectedLedgerLog(null)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Händelse</p>
                      <p className="text-sm font-bold text-gray-900">{selectedLedgerLog.title}</p>
                      {selectedLedgerLog.description && (
                        <p className="text-gray-600 mt-1">{selectedLedgerLog.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Belopp (BP)</p>
                        <p className={`text-lg font-black font-mono mt-0.5 ${selectedLedgerLog.points_awarded > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {selectedLedgerLog.points_awarded > 0 ? `+${selectedLedgerLog.points_awarded}` : selectedLedgerLog.points_awarded} BP
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verifieringsmetod</p>
                        <p className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          {selectedLedgerLog.verification_method || 'SYSTEM'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaktions-ID:</span>
                        <span className="font-mono text-gray-900 font-bold">{selectedLedgerLog.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tidsstämpel:</span>
                        <span className="text-gray-900 font-bold">{selectedLedgerLog.created_at ? new Date(selectedLedgerLog.created_at).toLocaleString('sv-SE') : 'Realtid'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verifierad & Låst
                        </span>
                      </div>
                      {selectedLedgerLog.multiplier_applied && selectedLedgerLog.multiplier_applied > 1 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tillämpad Give-bonus:</span>
                          <span className="text-amber-800 font-bold">{selectedLedgerLog.multiplier_applied}x</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setSelectedLedgerLog(null)}
                      className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition text-center"
                    >
                      Stäng Kvitto
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* SUB-VIEW 7: HUB BATTLE */}
      {activeSubTab === 'HUB_BATTLE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>Månadens Hubb (Hub Battle)</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 font-display">
                Regional Hubb-Topplista
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Baserat på snittpoäng per aktiv medlem för rättvis tävling mellan stora och mindre städer.
              </p>
            </div>

            <div className="space-y-3">
              {hubBattleStandings.map((h, i) => (
                <div 
                  key={h.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                    h.is_leader
                      ? 'bg-gradient-to-r from-amber-50/50 to-white border-amber-300 shadow-sm'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      i === 0 ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">{h.name}</h4>
                      <p className="text-xs text-gray-500">{h.active_members} aktiva medlemmar • {h.trend}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-[#800020] font-display block">
                      {h.avg_points} BP
                    </span>
                    <span className="text-[10px] text-gray-400">snitt per medlem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: LEADERBOARD */}
      {activeSubTab === 'LEADERBOARD' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 font-display">
                Medlems-Topplista (Master Networkers)
              </h3>
              <p className="text-xs text-gray-500">
                Medlemmarna som skapar mest värde, introduktioner och affärer i nätverket
              </p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLeaderboardFilter('MONTH')}
                className={`px-3 py-1 rounded-lg transition ${
                  leaderboardFilter === 'MONTH' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                }`}
              >
                Denna Månad
              </button>
              <button
                onClick={() => setLeaderboardFilter('ALL_TIME')}
                className={`px-3 py-1 rounded-lg transition ${
                  leaderboardFilter === 'ALL_TIME' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'
                }`}
              >
                Totalt (All-Time)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {sortedMembers.slice(0, 10).map((m, idx) => (
              <div 
                key={m.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  m.id === currentUser.id 
                    ? 'bg-rose-50/50 border-[#800020] shadow-2xs ring-1 ring-[#800020]' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-600 text-white' : 'text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-gray-200 shrink-0">
                    <img src={m.avatar} alt={m.full_name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-gray-900">{m.full_name}</h4>
                      {m.booster_score >= 2001 && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                        {m.membership_level}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {m.role_title} • {m.company_name} ({m.hub_name})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#800020] font-display block">
                    {m.booster_score.toLocaleString('sv-SE')} BP
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Level {m.booster_score >= 2001 ? 4 : m.booster_score >= 751 ? 3 : m.booster_score >= 251 ? 2 : 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
