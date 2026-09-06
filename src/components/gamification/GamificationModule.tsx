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
  Check
} from 'lucide-react';
import { Member, Hub, BoosterScoreLog, ActivityType } from '../../types';

interface GamificationModuleProps {
  currentUser: Member;
  allMembers?: Member[];
  members?: Member[];
  hubs?: Hub[];
  scoreLogs?: BoosterScoreLog[];
  onAwardPoints: (points: number, title: string, activityType: ActivityType) => void;
  onSimulateScore: (targetScore: number) => void;
}

export const GamificationModule: React.FC<GamificationModuleProps> = ({
  currentUser,
  allMembers,
  members,
  hubs = [],
  scoreLogs = [],
  onAwardPoints,
  onSimulateScore
}) => {
  const memberList = allMembers || members || [];
  const [leaderboardFilter, setLeaderboardFilter] = useState<'MONTH' | 'ALL_TIME'>('MONTH');
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'HUB_BATTLE' | 'LEADERBOARD' | 'RULES' | 'LOGS'>('OVERVIEW');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

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
        perks: 'Exklusiv profilkant i Maroon & Guld samt prioriterad placering överst i medlemsregistret.'
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
        perks: 'VIP-inbjudningar till regionträffar och prioriterad matchningsalgoritm.'
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

  // Point rules from V4 spec
  const pointRules: {
    category: string;
    event: string;
    points: number;
    rule: string;
    activityType: ActivityType;
    icon: any;
  }[] = [
    {
      category: 'Fysisk Närvaro',
      event: 'QR-/Geofencing-incheckning på officiell Hubbträff',
      points: 30,
      rule: 'Max 1 gång per event.',
      activityType: 'EVENT_CHECKIN',
      icon: QrCode
    },
    {
      category: 'Relationsbyggande',
      event: 'Loggat & bekräftat 1-till-1 möte med annan medlem',
      points: 20,
      rule: 'Kräver bekräftelse från båda parter.',
      activityType: 'MEETING_CONFIRMED',
      icon: Users
    },
    {
      category: 'Affärsnytta',
      event: 'Koppla ihop två medlemmar (Genomförd 3-partschatt-intro)',
      points: 40,
      rule: 'Triggers vid aktiv konversation.',
      activityType: 'INTRO_3WAY',
      icon: MessageSquare
    },
    {
      category: 'Affärsnytta',
      event: 'Loggad & verifierad stängd affär i My Booster Pipeline',
      points: 100,
      rule: 'Båda parter godkänner loggningen.',
      activityType: 'DEAL_WON',
      icon: CheckCircle2
    },
    {
      category: 'Community & Kunskap',
      event: 'Delta i ett live-webinar i appen',
      points: 15,
      rule: 'Närvaro i minst 15 minuter.',
      activityType: 'WEBINAR_ATTEND',
      icon: Video
    },
    {
      category: 'Förtroende',
      event: 'Ge en medlem en Skillbar Endorsement eller skriftligt omdöme',
      points: 10,
      rule: 'Max 50 BP per vecka.',
      activityType: 'SKILL_ENDORSEMENT',
      icon: Star
    },
    {
      category: 'Tillväxt',
      event: 'Bjud in en gäst som går på sin första träff (Guest Pass)',
      points: 50,
      rule: 'Vid genomförd incheckning av gästen.',
      activityType: 'GUEST_PASS_ATTEND',
      icon: UserPlus
    }
  ];

  // Hub Battle Ranking (Points per member as per V4 spec)
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

  const handleTriggerAction = (rule: typeof pointRules[0]) => {
    onAwardPoints(rule.points, rule.event, rule.activityType);
    setActionSuccessMessage(`+${rule.points} BP tilldelade för "${rule.event}"!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Notification */}
      {actionSuccessMessage && (
        <div className="bg-[#800020] text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-white/80 hover:text-white">
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

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl font-black text-[#800020] font-display">
                  {currentUser.booster_score}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Booster Points (BP)
                </span>
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
        <div className="flex gap-1 pt-6 mt-6 border-t border-gray-100 overflow-x-auto scrollbar-none">
          {[
            { id: 'OVERVIEW', label: 'Översikt & Nivåer', icon: Sparkles },
            { id: 'HUB_BATTLE', label: 'Månadens Hubb (Hub Battle)', icon: Trophy },
            { id: 'LEADERBOARD', label: 'Medlems-Topplista', icon: Award },
            { id: 'RULES', label: 'Poängmatris (+BP)', icon: Zap },
            { id: 'LOGS', label: `Audit Trail (${scoreLogs.length})`, icon: History }
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
                badgeBg: 'bg-gradient-to-r from-[#800020] via-amber-600 to-amber-500',
                desc: 'Exklusiv profilkant i Maroon/Guld samt prioriterad synlighet överst i medlemslistan.',
                isCurrent: currentLevel.level === 4,
                highlight: true
              }
            ].map(tier => (
              <div
                key={tier.lvl}
                className={`bg-white rounded-2xl border p-5 space-y-3 transition shadow-xs relative ${
                  tier.isCurrent 
                    ? 'border-[#800020] ring-2 ring-[#800020]/20' 
                    : tier.highlight
                    ? 'border-amber-300'
                    : 'border-gray-200'
                }`}
              >
                {tier.isCurrent && (
                  <span className="absolute -top-2.5 right-4 bg-[#800020] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    Din Nuvarande Nivå
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded text-white ${tier.badgeBg}`}>
                    Level {tier.lvl}
                  </span>
                  <span className="text-xs font-bold text-gray-500 font-mono">
                    {tier.range}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-1.5">
                    {tier.lvl === 4 && <Crown className="w-4 h-4 text-amber-500" />}
                    <span>{tier.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Tröskel: {tier.range.split(' – ')[0]}</span>
                  {tier.lvl === 4 ? (
                    <span className="text-amber-600 font-bold">Guld/Maroon Kant</span>
                  ) : (
                    <span>Standard kant</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Rule Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-display">
                  Snabba Åtgärder för att Tjäna Booster Points
                </h3>
                <p className="text-xs text-gray-500">
                  Klicka för att registrera verklig nätverksaktivitet och se poängen uppdateras direkt.
                </p>
              </div>
              <span className="text-xs font-bold text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">
                7 Verifierade Regler
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pointRules.slice(0, 6).map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F4F5F7] border border-gray-200/80 flex items-center justify-between hover:border-[#800020]/40 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#800020] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {rule.category}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate" title={rule.event}>
                          {rule.event}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTriggerAction(rule)}
                      className="ml-2 px-2.5 py-1 rounded-lg bg-[#800020] hover:bg-[#580016] text-white font-bold text-xs shrink-0 transition flex items-center gap-1 shadow-xs"
                      title="Logga aktivitet och få poäng"
                    >
                      <span>+{rule.points} BP</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MÅNADENS HUBB (HUB BATTLE) */}
      {activeSubTab === 'HUB_BATTLE' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#800020] to-[#580016] text-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                    Månadens Hubb – Säsong September 2026
                  </span>
                  <h3 className="text-xl font-bold font-display mt-0.5">
                    Hub Battle: Lokala Hubbar Tävlar om Trofén
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-white/70">Återstår av månaden</div>
                <div className="text-lg font-black font-mono text-amber-300">18 Dagar : 09 Tim</div>
              </div>
            </div>

            <p className="text-xs text-white/80 max-w-3xl leading-relaxed">
              Den fysiska hubb som sammanlagt samlar mest Booster Points per medlem under en månad koras till 
              <strong className="text-white"> "Månadens Hubb"</strong> och belönas med vandringstrofé, sponsrad champagnefrukost och VIP-föreläsare.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-[#F4F5F7] border-b border-gray-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Ställning i Hub Battle (Sorterat på Snittpoäng per Medlem)
              </h4>
              <span className="text-[11px] text-gray-500">Uppdateras i realtid</span>
            </div>

            <div className="divide-y divide-gray-100">
              {hubBattleStandings.map((hub, idx) => (
                <div 
                  key={hub.id} 
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    hub.is_leader ? 'bg-amber-50/40' : 'hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                      idx === 0 
                        ? 'bg-amber-400 text-slate-900 shadow-xs' 
                        : idx === 1 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-gray-900 font-display">
                          {hub.name}
                        </h5>
                        {hub.is_leader && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-600" />
                            <span>Månadens Hubb (Ledare)</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{hub.active_members} aktiva medlemmar</span>
                        <span>•</span>
                        <span>{hub.total_points.toLocaleString('sv-SE')} totala BP</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{hub.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:self-center flex sm:flex-col items-baseline sm:items-end justify-between">
                    <div className="text-2xl font-black text-[#800020] font-display">
                      {hub.avg_points}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      BP / Medlem i Snitt
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INDIVIDUAL LEADERBOARD */}
      {activeSubTab === 'LEADERBOARD' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs space-y-0">
          <div className="p-4 bg-[#F4F5F7] border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Individuell Medlemstopplista (Booster Points)
              </h4>
              <p className="text-[11px] text-gray-500">Master Networkers (2001+ BP) erhåller automatisk prio-visning överst.</p>
            </div>

            <div className="flex bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setLeaderboardFilter('MONTH')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  leaderboardFilter === 'MONTH' ? 'bg-[#800020] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Denna Månad
              </button>
              <button
                onClick={() => setLeaderboardFilter('ALL_TIME')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  leaderboardFilter === 'ALL_TIME' ? 'bg-[#800020] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All-Time
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {sortedMembers.map((mbr, idx) => {
              const isMaster = mbr.booster_score >= 2001;
              const isUser = mbr.id === currentUser.id;

              return (
                <div
                  key={mbr.id}
                  className={`p-4 flex items-center justify-between transition ${
                    isUser ? 'bg-rose-50/40 border-l-4 border-[#800020]' : 'hover:bg-gray-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      idx === 0 
                        ? 'bg-amber-400 text-slate-900' 
                        : idx === 1 
                        ? 'bg-gray-200 text-gray-800' 
                        : idx === 2 
                        ? 'bg-amber-700 text-white' 
                        : 'text-gray-400'
                    }`}>
                      #{idx + 1}
                    </span>

                    <div className="relative shrink-0">
                      <img
                        src={mbr.avatar}
                        alt={mbr.full_name}
                        className={`w-11 h-11 rounded-xl object-cover ${
                          isMaster ? 'ring-2 ring-amber-400 ring-offset-1 shadow-xs' : 'border border-gray-200'
                        }`}
                      />
                      {isMaster && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded shadow-xs">
                          <Crown className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {mbr.full_name}
                        </span>
                        {isUser && (
                          <span className="text-[10px] font-bold bg-[#800020] text-white px-1.5 py-0.2 rounded">
                            Du
                          </span>
                        )}
                        {isMaster && (
                          <span className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-[#800020] text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" />
                            <span>Master</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {mbr.company_name} • {mbr.hub_name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-[#800020] font-display">
                      {mbr.booster_score} BP
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {mbr.membership_level} Medlem
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: POÄNGMATRIS (BOOSTER POINT RULES) */}
      {activeSubTab === 'RULES' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 font-display">
              Officiell Poängmatris (Booster Point Rules V4)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Booster Score driver kontinuerlig aktivitet genom att kombinera fysisk närvaro och digital hjälpsamhet.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F5F7] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Aktivitetskategori</th>
                  <th className="py-3 px-4">Händelse / Handling</th>
                  <th className="py-3 px-4">Poäng (+BP)</th>
                  <th className="py-3 px-4">Maxgräns / Regler</th>
                  <th className="py-3 px-4 text-right">Interaktiv Testning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pointRules.map((rule, idx) => {
                  const Icon = rule.icon;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-800">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#800020]" />
                          <span>{rule.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {rule.event}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-lg text-xs">
                          +{rule.points} BP
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 italic">
                        {rule.rule}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleTriggerAction(rule)}
                          className="px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-[11px] font-bold transition shadow-xs inline-flex items-center gap-1"
                        >
                          <span>Logga Handling</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: BOOSTER SCORE AUDIT TRAIL */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
                <History className="w-5 h-5 text-[#800020]" />
                <span>Booster Score Audit Trail (`booster_score_logs`)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Fullständig verifieringslogg för alla intjänade och krediterade poäng.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#F4F5F7] px-3 py-1 rounded-xl text-gray-700">
              {scoreLogs.length} poster loggade
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {scoreLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-gray-200 flex items-center justify-between gap-4 hover:bg-gray-100/70 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020] shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{log.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                        {log.activity_type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">{log.description}</p>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">
                      Loggad: {new Date(log.created_at).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-[#800020] font-display">
                    +{log.points_awarded} BP
                  </span>
                  <div className="text-[10px] font-semibold text-emerald-700">Verifierad</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
