import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { Member } from '../../types';

interface MatchmakingModuleProps {
  currentUser: Member;
  allMembers: Member[];
  onOpenDirectChat: (memberId: string) => void;
  onStartIntroWith: (targetMemberId: string) => void;
}

export const MatchmakingModule: React.FC<MatchmakingModuleProps> = ({
  currentUser,
  allMembers = [],
  onOpenDirectChat,
  onStartIntroWith
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [aiAnalysisTarget, setAiAnalysisTarget] = useState<Member | null>(null);

  // Other members
  const candidateMembers = allMembers.filter(m => m.id !== currentUser.id);

  // Calculate matching score and reasons based on seeking vs offering tags
  const calculateMatch = (candidate: Member) => {
    let score = 65; // base score for active verified member
    const matchingTags: string[] = [];

    // Check if what candidate offers matches what current user seeks
    currentUser.seeking_tags.forEach(seekTag => {
      candidate.offering_tags.forEach(offTag => {
        if (
          seekTag.toLowerCase().includes(offTag.toLowerCase()) || 
          offTag.toLowerCase().includes(seekTag.toLowerCase()) ||
          (seekTag.includes('Juridik') && offTag.includes('Avtal')) ||
          (seekTag.includes('Investerare') && offTag.includes('kapital')) ||
          (seekTag.includes('Sälj') && offTag.includes('försäljning'))
        ) {
          score += 15;
          matchingTags.push(`Du söker "${seekTag}" ↔ ${candidate.full_name} erbjuder "${offTag}"`);
        }
      });
    });

    // Check if what candidate seeks matches what current user offers
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

    // Boost score if same Hub
    if (candidate.hub_id === currentUser.hub_id) {
      score += 5;
    }

    const finalScore = Math.min(score, 99);
    return {
      score: finalScore,
      reasons: matchingTags.length > 0 ? matchingTags : ['Gemensam profil i samma regionala tillväxthubb']
    };
  };

  const filteredMembers = candidateMembers.filter(m => {
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.offering_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.seeking_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = selectedCity === 'ALL' || m.city === selectedCity;

    return matchesSearch && matchesCity;
  }).sort((a, b) => {
    return calculateMatch(b).score - calculateMatch(a).score;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020] text-amber-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Digital Matchmaking AI (Lead Suggestion)
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020] border border-[#800020]/20">
              AI Engine V3
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Algoritmen analyserar medlemmars «Söker» och «Erbjuder»-taggar, affärshistorik och geografi för att maximera affärsutbyte.
          </p>
        </div>

        {/* Current User Söker/Erbjuder Summary Pill */}
        <div className="bg-[#F4F5F7] p-3 rounded-xl border border-gray-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1">
            <Zap className="w-3.5 h-3.5 text-[#800020]" />
            <span>Din aktiva profil ({currentUser.full_name})</span>
          </div>
          <div className="text-[11px] text-gray-600">
            <span className="font-semibold text-gray-800">Du söker:</span> {currentUser.seeking_tags.join(', ')}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Sök kompetens, bransch eller tagg (t.ex. Avtalsjuridik, VC, B2B)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F5F7] text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:border-[#800020] text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="bg-[#F4F5F7] text-xs font-semibold rounded-xl px-3 py-2.5 border border-gray-200 text-gray-700 w-full sm:w-44 focus:outline-none focus:border-[#800020]"
          >
            <option value="ALL">Alla Städer & Hubbar</option>
            <option value="Stockholm">Stockholm</option>
            <option value="Göteborg">Göteborg</option>
            <option value="Malmö">Malmö</option>
          </select>
        </div>
      </div>

      {/* Matchmaking Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMembers.map(member => {
          const matchInfo = calculateMatch(member);
          const isHighMatch = matchInfo.score >= 85;

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between transition hover:border-[#800020]/40 hover:shadow-md"
            >
              <div>
                {/* Card Top: Member info & Match badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.full_name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {member.full_name}
                        </h3>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                          member.membership_level === 'GOLD'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-300'
                        }`}>
                          {member.membership_level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        {member.role_title} • {member.company_name}
                      </p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#800020]" />
                        <span>{member.city} ({member.hub_name})</span>
                      </p>
                    </div>
                  </div>

                  {/* AI Match Score Pill */}
                  <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center flex-shrink-0 ${
                    isHighMatch
                      ? 'bg-[#800020] text-white border-[#800020]'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    <span className="text-xs font-black tracking-tight flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {matchInfo.score}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider opacity-85">Match</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  {member.bio}
                </p>

                {/* AI Synergies breakdown */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Algoritmisk synergi:</span>
                  </div>
                  {matchInfo.reasons.map((r, i) => (
                    <div key={i} className="text-[10px] text-amber-900 flex items-center gap-1">
                      <span>•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Söker & Erbjuder Tag Cloud */}
                <div className="mt-3 space-y-2 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Erbjuder kompetens:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {member.offering_tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Söker kontakter inom:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {member.seeking_tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setAiAnalysisTarget(member)}
                  className="text-xs font-bold text-[#800020] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Djupanalys</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartIntroWith(member.id)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[#F4F5F7] transition flex items-center gap-1"
                    title="Skapa en intromatchning via trepartstråd"
                  >
                    <span>Skapa Intro</span>
                  </button>

                  <button
                    onClick={() => onOpenDirectChat(member.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Meddelande</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Deep Analysis Modal */}
      {aiAnalysisTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#800020] text-amber-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    AI Affärsanalys & Mötesagenda
                  </h3>
                  <p className="text-xs text-gray-500">
                    Synergier mellan {currentUser.company_name} och {aiAnalysisTarget.company_name}
                  </p>
                </div>
              </div>
              <button onClick={() => setAiAnalysisTarget(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-xs">
              <div className="p-3 bg-[#F4F5F7] rounded-xl space-y-1">
                <span className="font-bold text-gray-900 block">
                  1. Varför ni bör träffas:
                </span>
                <p className="text-gray-700 leading-relaxed">
                  {currentUser.full_name} söker strategiska råd inom kommersiella avtal och investeringar. {aiAnalysisTarget.full_name} har stängt flera relevanta avtal i samma segment och kan ge direkt avlastning vid nästa expansion.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">
                  2. Rekommenderad 20-minuters agenda vid frukostmöte:
                </span>
                <ul className="list-disc pl-4 text-emerald-900 space-y-0.5">
                  <li>0-5 min: Snabb introduktion av pågående kvartalsmål.</li>
                  <li>5-15 min: Granskning av incitament och avtalsstruktur inför scaleup.</li>
                  <li>15-20 min: Beslut om gemensam kundintroduktion i Booster Friends.</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-950 block mb-0.5">
                  3. Uppskattad pipeline-potential:
                </span>
                <p className="text-amber-900">
                  Genomsnittlig affär mellan dessa två specialistområden i nätverket genererar ca <strong>450 000 – 1 200 000 SEK</strong> i gemensamt affärsvärde.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setAiAnalysisTarget(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
              >
                Stäng
              </button>
              <button
                onClick={() => {
                  const targetId = aiAnalysisTarget.id;
                  setAiAnalysisTarget(null);
                  onOpenDirectChat(targetId);
                }}
                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold"
              >
                Boka 1-on-1 via Chatt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
