import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  Filter, 
  Award, 
  CheckCircle2, 
  Star,
  Zap,
  Tag,
  Target,
  Share2,
  Users,
  Timer,
  Play,
  RotateCcw,
  Check,
  TrendingUp,
  Plus,
  ShieldCheck,
  Heart,
  Crown,
  Bell,
  Clock
} from 'lucide-react';
import { Member, IntroRequest, NetworkGraphNode, MicroHubGroup, SpeedNetworkingMatch } from '../../types';
import { 
  INITIAL_INTRO_REQUESTS, 
  INITIAL_NETWORK_GRAPH_NODES, 
  INITIAL_MICRO_HUBS, 
  INITIAL_SPEED_NETWORKING_MATCHES, 
  INITIAL_CADENCE_FOLLOWUPS 
} from '../../data/communityAndMatchmakingData';
import { AiIntroDraftModal } from './AiIntroDraftModal';
import { IntroRequestModal } from './IntroRequestModal';

interface MatchmakingModuleProps {
  currentUser: Member;
  allMembers: Member[];
  onOpenDirectChat: (memberId: string) => void;
  onStartIntroWith?: (targetMemberId: string) => void;
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
  onAddPipelineDeal?: (deal: any) => void;
}

export const MatchmakingModule: React.FC<MatchmakingModuleProps> = ({
  currentUser,
  allMembers = [],
  onOpenDirectChat,
  onStartIntroWith,
  onAwardPoints,
  onAddPipelineDeal
}) => {
  // Navigation tabs inside Matchmaking
  const [activeSubTab, setActiveSubTab] = useState<'WEEKLY_AI' | 'INTRO_REQUESTS' | 'NETWORK_GRAPH' | 'SPEED_NETWORKING' | 'CADENCE'>('WEEKLY_AI');
  
  // Search & Filters for directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  
  // Modals & Interactivity
  const [aiIntroCandidate, setAiIntroCandidate] = useState<Member | null>(null);
  const [aiIntroReason, setAiIntroReason] = useState<string>('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Local state for Requests, Micro-Hubs, and Graph Nodes
  const [introRequests, setIntroRequests] = useState<IntroRequest[]>(INITIAL_INTRO_REQUESTS);
  const [microHubs, setMicroHubs] = useState<MicroHubGroup[]>(INITIAL_MICRO_HUBS);
  const [graphNodes, setGraphNodes] = useState<NetworkGraphNode[]>(INITIAL_NETWORK_GRAPH_NODES);
  const [speedMatches, setSpeedMatches] = useState<SpeedNetworkingMatch[]>(INITIAL_SPEED_NETWORKING_MATCHES);
  const [activeSpeedIndex, setActiveSpeedIndex] = useState(0);
  const [speedTimerSeconds, setSpeedTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [speedPitchNotes, setSpeedPitchNotes] = useState('');

  // Speed timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && speedTimerSeconds > 0) {
      interval = setInterval(() => {
        setSpeedTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (speedTimerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setFeedbackNotice('⏰ 15 minuters speed-networking avslutad! Glöm inte att logga affärsmöjlighet eller kaffemöte.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, speedTimerSeconds]);

  // Candidates list excluding current user
  const candidateMembers = allMembers.filter(m => m.id !== currentUser.id);

  // Calculate matching score and reasons based on seeking vs offering tags
  const calculateMatch = (candidate: Member) => {
    let score = 68; // base score for active verified member
    const matchingTags: string[] = [];

    currentUser.seeking_tags.forEach(seekTag => {
      candidate.offering_tags.forEach(offTag => {
        if (
          seekTag.toLowerCase().includes(offTag.toLowerCase()) || 
          offTag.toLowerCase().includes(seekTag.toLowerCase()) ||
          (seekTag.includes('Juridik') && offTag.includes('Avtal')) ||
          (seekTag.includes('Investerare') && offTag.includes('kapital')) ||
          (seekTag.includes('Sälj') && offTag.includes('försäljning')) ||
          (seekTag.includes('E-handel') && offTag.includes('Logistik'))
        ) {
          score += 14;
          matchingTags.push(`Du söker "${seekTag}" ↔ ${candidate.full_name} erbjuder "${offTag}"`);
        }
      });
    });

    candidate.seeking_tags.forEach(cSeek => {
      currentUser.offering_tags.forEach(myOff => {
        if (
          cSeek.toLowerCase().includes(myOff.toLowerCase()) || 
          myOff.toLowerCase().includes(cSeek.toLowerCase()) ||
          (cSeek.includes('SaaS') && myOff.includes('Moln'))
        ) {
          score += 12;
          matchingTags.push(`${candidate.full_name} söker "${cSeek}" ↔ Du erbjuder "${myOff}"`);
        }
      });
    });

    if (candidate.hub_id === currentUser.hub_id) {
      score += 5;
    }

    const finalScore = Math.min(score, 99);
    return {
      score: finalScore,
      reasons: matchingTags.length > 0 
        ? matchingTags 
        : [`Gemensam affärsaktivitet i ${candidate.city} och kompletterande kompetensprofiler.`]
    };
  };

  // Sorted candidates
  const rankedCandidates = [...candidateMembers].sort((a, b) => {
    return calculateMatch(b).score - calculateMatch(a).score;
  });

  // Weekly 3 Matches: top 3 highest matching members
  const weeklyMatches = rankedCandidates.slice(0, 3);

  // Filtered list for search tab
  const filteredMembers = candidateMembers.filter(m => {
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.offering_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.seeking_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === 'ALL' || m.city === selectedCity;
    return matchesSearch && matchesCity;
  }).sort((a, b) => calculateMatch(b).score - calculateMatch(a).score);

  // Handlers
  const handleOpenAiIntro = (candidate: Member) => {
    const matchData = calculateMatch(candidate);
    setAiIntroCandidate(candidate);
    setAiIntroReason(matchData.reasons.join('. '));
  };

  const handleSendAiIntro = (candidate: Member, messageText: string) => {
    if (onAwardPoints) {
      onAwardPoints(10, `Skickat AI-Smart Intro till ${candidate.full_name}`, 'ONE_ON_ONE_LOGGED');
    }
    setFeedbackNotice(`✨ Smart AI-Intro skickad till ${candidate.full_name}! En ny trepartschatt har öppnats och +10 BP har lagts till.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
    onOpenDirectChat(candidate.id);
  };

  const handleCreateIntroRequest = (reqData: Partial<IntroRequest>) => {
    const newReq = reqData as IntroRequest;
    setIntroRequests(prev => [newReq, ...prev]);
    setFeedbackNotice(`🎯 Din dörröppnare-efterfrågan har publicerats i communityt med en utsatt bounty på +${newReq.bounty_bp} BP!`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleClaimBountyIntro = (req: IntroRequest) => {
    if (onAwardPoints) {
      onAwardPoints(req.bounty_bp, `Dörröppnare genomförd för ${req.target_role_or_company}`, 'REFERRAL_SENT');
    }
    setIntroRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'FULFILLED', connector_member_name: currentUser.full_name } : r));
    setFeedbackNotice(`🎉 Fantastiskt! Du kopplade ihop ${req.author_name} med ${req.target_role_or_company} och belönades med +${req.bounty_bp} Booster Points och Connector-Badge!`);
    setTimeout(() => setFeedbackNotice(null), 6000);
  };

  const handleToggleTrustCircle = (nodeId: string) => {
    setGraphNodes(prev => prev.map(n => n.id === nodeId ? { ...n, is_trust_circle: !n.is_trust_circle } : n));
    setFeedbackNotice(`⭐ Ambassadörsstatus uppdaterad i ditt Warm Intro DNA!`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleToggleMicroHub = (hubId: string) => {
    setMicroHubs(prev => prev.map(h => {
      if (h.id === hubId) {
        const nextIsMember = !h.is_member;
        return {
          ...h,
          is_member: nextIsMember,
          member_count: nextIsMember ? h.member_count + 1 : h.member_count - 1
        };
      }
      return h;
    }));
  };

  const handleConvertCadenceToPipeline = (personName: string, company: string) => {
    if (onAddPipelineDeal) {
      onAddPipelineDeal({
        id: `deal_${Date.now()}`,
        title: `Samarbete med ${company} (${personName})`,
        company: company,
        contact_name: personName,
        stage: 'PROSPECT',
        value_sek: 75000,
        expected_close_date: '2026-10-15',
        notes: `Genererad via automatisk kadensavstämning i Booster Friends efter genomfört 1-1 möte.`
      });
    }
    if (onAwardPoints) {
      onAwardPoints(50, `Ny affärsmöjlighet skapad från relationsvård`, 'DEAL_ADDED');
    }
    setFeedbackNotice(`📈 Ny affärsmöjlighet skapad i My Booster Pipeline för ${company}! +50 BP tilldelat.`);
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Intro-AI & Business Engine */}
      <div className="bg-gradient-to-r from-[#800020] via-[#650019] to-[#3a000e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Booster Friends Intro-AI & Matchmaking Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Intelligent Matchning, Dörröppnare & Warm Intro DNA
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Eliminera manuellt bläddrande. Vår algoritm analyserar vad du Söker och Erbjuder, skapar personliga 3-vägs introduktioner och visualiserar det reella affärsvärdet i ditt nätverk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Target className="w-4 h-4" />
              <span>Efterfråga dörröppnare ("Vem känner X?")</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success / Feedback notice */}
      {feedbackNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{feedbackNotice}</span>
          </div>
          <button 
            onClick={() => setFeedbackNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Feature Navigation Pills */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('WEEKLY_AI')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeSubTab === 'WEEKLY_AI'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Veckans 3 Matchningar & Register</span>
        </button>

        <button
          onClick={() => setActiveSubTab('INTRO_REQUESTS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeSubTab === 'INTRO_REQUESTS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Target className="w-4 h-4 text-rose-300" />
          <span>"Vem känner X?" (Bounties)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-gray-900 font-black">
            {introRequests.filter(r => r.status === 'OPEN').length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('NETWORK_GRAPH')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeSubTab === 'NETWORK_GRAPH'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Share2 className="w-4 h-4 text-blue-300" />
          <span>Warm Intro DNA (Nätverksgraf)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SPEED_NETWORKING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeSubTab === 'SPEED_NETWORKING'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Timer className="w-4 h-4 text-emerald-300" />
          <span>Speed Networking & Micro-Hubbar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('CADENCE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeSubTab === 'CADENCE'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4 text-purple-300" />
          <span>Relationsvård (60d Kadens)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-[#800020] font-black">
            {INITIAL_CADENCE_FOLLOWUPS.length}
          </span>
        </button>
      </div>

      {/* SUB-VIEW 1: Veckans 3 Matchningar & Matchningsregister */}
      {activeSubTab === 'WEEKLY_AI' && (
        <div className="space-y-6">
          {/* Spotlight: Veckans 3 Matchningar */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#800020] px-2 py-0.5 rounded">
                      Måndags-Push
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Vecka 37</span>
                  </div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">
                    Veckans 3 Rekommenderade Matchningar
                  </h2>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Baserat på dina taggar: <span className="font-bold text-[#800020]">{currentUser.seeking_tags.join(', ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weeklyMatches.map((cand, idx) => {
                const matchData = calculateMatch(cand);
                return (
                  <div 
                    key={cand.id} 
                    className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-gray-50/60 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="relative">
                          <img 
                            src={cand.avatar} 
                            alt={cand.full_name} 
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                          />
                          <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-amber-400 text-gray-950 font-black text-xs flex items-center justify-center shadow-xs">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                            <Zap className="w-3.5 h-3.5 fill-current" /> {matchData.score}% Match
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-1">
                            {cand.membership_level} • {cand.booster_score} BP
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base">{cand.full_name}</h3>
                      <p className="text-xs text-gray-600 font-medium">{cand.role_title} • {cand.company_name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">📍 {cand.city} ({cand.hub_name})</p>

                      {/* Synergy explanation */}
                      <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-200/60 text-[11px] text-gray-700 space-y-1">
                        <span className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider">
                          🎯 Varför ni borde ses:
                        </span>
                        <p className="leading-snug text-gray-600">
                          {matchData.reasons[0]}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAiIntro(cand)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>1-Click AI-Intro</span>
                      </button>
                      <button
                        onClick={() => onOpenDirectChat(cand.id)}
                        className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        title="Öppna chatt"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Matchmaking Directory */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Hela Matchningsregistret ({filteredMembers.length} medlemmar)
                </h3>
                <p className="text-xs text-gray-500">
                  Sorterade efter algoritmisk kompatibilitet med din profil
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Sök kompetens, bransch, person..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                  />
                </div>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-700 font-semibold"
                >
                  <option value="ALL">Alla Hubbar</option>
                  <option value="Stockholm">Stockholm</option>
                  <option value="Göteborg">Göteborg</option>
                  <option value="Malmö">Malmö</option>
                  <option value="Uppsala">Uppsala</option>
                </select>
              </div>
            </div>

            {/* Candidate list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((cand) => {
                const matchData = calculateMatch(cand);
                return (
                  <div 
                    key={cand.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-xs flex flex-col justify-between space-y-4 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={cand.avatar} 
                            alt={cand.full_name} 
                            className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{cand.full_name}</h4>
                            <p className="text-xs text-gray-500">{cand.role_title} • {cand.company_name}</p>
                            <p className="text-[11px] text-gray-400">📍 {cand.city} ({cand.hub_name})</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {matchData.score}%
                          </span>
                        </div>
                      </div>

                      {/* Tag badges */}
                      <div className="space-y-2 mt-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Erbjuder:</span>
                          <div className="flex flex-wrap gap-1">
                            {cand.offering_tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 text-[#800020] text-[10px] font-semibold border border-rose-100">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Söker:</span>
                          <div className="flex flex-wrap gap-1">
                            {cand.seeking_tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold border border-gray-200">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenAiIntro(cand)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition flex items-center gap-1.5 border border-amber-200"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Skapa AI-Intro</span>
                      </button>

                      <button
                        onClick={() => onOpenDirectChat(cand.id)}
                        className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direktchatt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: "Vem känner X?" (Pay It Forward & Intro-Requests) */}
      {activeSubTab === 'INTRO_REQUESTS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Pay It Forward Engine
                </span>
                <span className="text-xs text-gray-400">Bountybelöning</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mt-1">
                "Vem känner X?" – Efterfråga Dörröppnare
              </h2>
              <p className="text-xs text-gray-600 max-w-2xl mt-1">
                Nätverkande handlar om att öppna dörrar som annars är stängda. Lägg upp en efterfrågan om en kontakt du söker. Medlemmen som genomför introduktionen premieras med <span className="font-bold text-[#800020]">+50 Booster Points</span> samt Connector-Badge!
              </p>
            </div>

            <button
              onClick={() => setShowNewRequestModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ny Dörröppnare-Efterfrågan</span>
            </button>
          </div>

          <div className="space-y-4">
            {introRequests.map((req) => (
              <div 
                key={req.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:border-gray-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={req.author_avatar} 
                      alt={req.author_name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{req.author_name}</h4>
                        <span className="text-xs text-gray-400">• {req.author_company}</span>
                      </div>
                      <p className="text-xs text-gray-500">{req.author_role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>+{req.bounty_bp} BP Bounty</span>
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      req.status === 'OPEN' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {req.status === 'OPEN' ? 'Öppen efterfrågan' : 'Genomförd'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Target className="w-4 h-4 text-[#800020]" />
                    <span>Söker varm kontakt med:</span>
                    <span className="text-[#800020] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-extrabold">
                      {req.target_role_or_company}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-gray-400">
                    Publicerad {new Date(req.created_at).toLocaleDateString('sv-SE')} • {req.comments_count} kommentarer
                  </span>

                  {req.author_id !== currentUser.id && req.status === 'OPEN' && (
                    <button
                      onClick={() => handleClaimBountyIntro(req)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Jag känner denna person! Gör varm intro (+{req.bounty_bp} BP)</span>
                    </button>
                  )}

                  {req.status === 'FULFILLED' && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Intro genomförd av {req.connector_member_name || 'nätverksmedlem'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Warm Intro DNA (Nätverksgraf) */}
      {activeSubTab === 'NETWORK_GRAPH' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                  Visualisera Dina Kontakter
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  Warm Intro DNA & Nätverksgraf
                </h2>
                <p className="text-xs text-gray-500">
                  Se det konkreta värdet du genererat till och genom nätverket via dina introduktioner.
                </p>
              </div>

              {/* Total KPI Pill */}
              <div className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Affärsvärde via dina intros:</div>
                  <div className="text-lg font-black text-emerald-700">1 700 000 SEK</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Skapade relationer:</div>
                  <div className="text-lg font-black text-[#800020]">{graphNodes.length - 1} st</div>
                </div>
              </div>
            </div>

            {/* Visual SVG Network Tree simulation */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="text-xs font-bold text-gray-400 mb-6 flex items-center justify-between">
                <span>🕸️ Interaktivt Kontakt-Träd (Graph Network)</span>
                <span className="text-[11px] text-amber-300">💡 Klicka på stjärnan för att tagga som Ambassadör</span>
              </div>

              {/* Graphical Layout */}
              <div className="flex flex-col items-center space-y-8 relative">
                {/* Center Root: Current User */}
                <div className="flex flex-col items-center z-10">
                  <div className="relative p-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#800020] shadow-xl">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.full_name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-900"
                    />
                    <Crown className="w-5 h-5 text-amber-400 absolute -top-2 -right-1" />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="font-extrabold text-sm text-white">{currentUser.full_name}</span>
                    <span className="block text-[11px] text-amber-300 font-bold">{currentUser.company_name}</span>
                  </div>
                </div>

                {/* Tier 1 Connections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full pt-4 border-t border-white/10">
                  {graphNodes.filter(n => n.member_id !== currentUser.id).map((node) => (
                    <div 
                      key={node.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/60 backdrop-blur-xs flex flex-col justify-between space-y-3 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <img 
                          src={node.avatar} 
                          alt={node.full_name} 
                          className="w-10 h-10 rounded-xl object-cover border border-white/20"
                        />
                        <button
                          onClick={() => handleToggleTrustCircle(node.id)}
                          title="Tagga som Nyckelkontakt / Ambassadör"
                          className={`p-1.5 rounded-lg border transition ${
                            node.is_trust_circle 
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                              : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${node.is_trust_circle ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-xs">{node.full_name}</h4>
                        <p className="text-[11px] text-gray-400">{node.role} • {node.company_name}</p>
                        {node.introduced_by_name && (
                          <p className="text-[10px] text-amber-300/80 mt-1">
                            🌱 Intro via {node.introduced_by_name}
                          </p>
                        )}
                      </div>

                      {node.deals_generated_sek && (
                        <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-bold flex items-center justify-between">
                          <span>Genererat affärsvärde:</span>
                          <span>+{node.deals_generated_sek.toLocaleString('sv-SE')} kr</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Spontana Mötesformat (Speed-Networking & Micro-Hubs) */}
      {activeSubTab === 'SPEED_NETWORKING' && (
        <div className="space-y-6">
          {/* Digital Speed-Networking Session Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  Strukturerat & Spontant
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  Digital Speed-Networking (15-minuters ronder)
                </h2>
                <p className="text-xs text-gray-500">
                  Månadens matchade ronder för snabba, fokuserade hisspitchar och synergisamtal.
                </p>
              </div>

              {/* Timer status */}
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
                <Timer className="w-5 h-5 text-emerald-700 animate-pulse" />
                <div>
                  <div className="text-[10px] text-emerald-900 font-bold uppercase">Tid kvar i ronden:</div>
                  <div className="text-xl font-black text-emerald-800">{formatTimer(speedTimerSeconds)}</div>
                </div>
              </div>
            </div>

            {/* Current speed partner */}
            {speedMatches[activeSpeedIndex] && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={speedMatches[activeSpeedIndex].partner_avatar} 
                      alt={speedMatches[activeSpeedIndex].partner_name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-[#800020]">
                        Rond {speedMatches[activeSpeedIndex].round_number} av {speedMatches.length}
                      </span>
                      <h3 className="font-extrabold text-gray-900 text-base mt-0.5">
                        {speedMatches[activeSpeedIndex].partner_name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {speedMatches[activeSpeedIndex].partner_role} • {speedMatches[activeSpeedIndex].partner_company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isTimerRunning 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isTimerRunning ? 'Pausa Rond' : 'Starta 15-min Rond'}
                    </button>
                    <button
                      onClick={() => setSpeedTimerSeconds(15 * 60)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
                      title="Återställ timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSpeedIndex((activeSpeedIndex + 1) % speedMatches.length)}
                      className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold"
                    >
                      Nästa Match →
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Algoritmisk synergi i denna rond:</span>
                  </div>
                  <p>{speedMatches[activeSpeedIndex].matching_synergy}</p>
                </div>

                {/* Pitch notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Snabbanteckningar under ronden:
                  </label>
                  <input
                    type="text"
                    placeholder="T.ex. Behöver offert på molndrift, boka uppföljning nästa tisdag..."
                    value={speedPitchNotes}
                    onChange={(e) => setSpeedPitchNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Micro-Hubbar & Intressegrupper */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full">
                Nischade Undergrupper
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">
                Micro-Hubbar & Intressegrupper
              </h3>
              <p className="text-xs text-gray-500">
                Gå med i fokuserade intressegrupper med egna chattkanaler och privata mini-event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {microHubs.map((hub) => (
                <div 
                  key={hub.id}
                  className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-xs flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-sm">{hub.title}</h4>
                          {hub.is_exclusive_gold && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Guld Endast
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">{hub.category} • {hub.city || 'Rikstäckande'}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {hub.member_count} medlemmar
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {hub.description}
                    </p>

                    {hub.upcoming_mini_event && (
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-[11px] text-[#800020] font-semibold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Kommande mini-träff: {hub.upcoming_mini_event}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-gray-400">Hub Lead: {hub.lead_member_name}</span>
                    <button
                      onClick={() => handleToggleMicroHub(hub.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        hub.is_member
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-[#800020] text-white hover:bg-[#5a0016]'
                      }`}
                    >
                      {hub.is_member ? 'Du är medlem ✓' : 'Gå med i Hubben'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: Automatisk Relationsvård & 60d Kadenspåminnelser */}
      {activeSubTab === 'CADENCE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full">
                  Automatisk Relationsvård
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  Kadenspåminnelser & Pipeline-Uppföljning
                </h2>
                <p className="text-xs text-gray-500">
                  Förhindra att värdefulla relationer rinner ut i sanden. Appen påminner dig när det gått 60 dagar sedan senaste kontakten.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {INITIAL_CADENCE_FOLLOWUPS.map((cad) => (
                <div 
                  key={cad.id}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={cad.member_avatar} 
                      alt={cad.member_name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-gray-900 text-sm">{cad.member_name}</h4>
                        <span className="text-xs text-gray-500">• {cad.member_company}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-[#800020]">
                          {cad.days_since} dagar sedan senaste mötet
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed max-w-xl">
                        {cad.cadence_trigger_text}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleConvertCadenceToPipeline(cad.member_name, cad.member_company)}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-black transition flex items-center gap-1.5 shadow-xs"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Skapa Lead i Pipeline (+50 BP)</span>
                    </button>

                    <button
                      onClick={() => onOpenDirectChat(cad.member_id)}
                      className="px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{cad.suggested_action}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Intro Draft Modal */}
      {aiIntroCandidate && (
        <AiIntroDraftModal
          currentUser={currentUser}
          candidate={aiIntroCandidate}
          synergyReason={aiIntroReason}
          onClose={() => setAiIntroCandidate(null)}
          onSendIntro={handleSendAiIntro}
        />
      )}

      {/* New Intro Request Modal */}
      {showNewRequestModal && (
        <IntroRequestModal
          currentUser={currentUser}
          onClose={() => setShowNewRequestModal(false)}
          onCreateRequest={handleCreateIntroRequest}
        />
      )}
    </div>
  );
};
