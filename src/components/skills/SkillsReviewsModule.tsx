import React, { useState } from 'react';
import { 
  Star, 
  Award, 
  ThumbsUp, 
  Plus, 
  Check, 
  MessageSquare, 
  Building2, 
  Calendar, 
  UserCheck, 
  Sparkles,
  X
} from 'lucide-react';
import { Member, MemberSkill, Review } from '../../types';

interface SkillsReviewsModuleProps {
  currentUser: Member;
  allMembers: Member[];
  skills: MemberSkill[];
  reviews: Review[];
  onEndorseSkill: (skillId: string) => void;
  onAddSkill: (skillName: string) => void;
  onAddReview: (review: Omit<Review, 'id' | 'created_at'>) => void;
}

export const SkillsReviewsModule: React.FC<SkillsReviewsModuleProps> = ({
  currentUser,
  allMembers = [],
  skills = [],
  reviews = [],
  onEndorseSkill,
  onAddSkill,
  onAddReview
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('usr_sofia_eklund');
  const [newSkillName, setNewSkillName] = useState('');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'MEMBER' | 'HUB' | 'EVENT'>('ALL');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New review form state
  const [reviewTargetType, setReviewTargetType] = useState<'MEMBER' | 'HUB' | 'EVENT'>('MEMBER');
  const [reviewTargetId, setReviewTargetId] = useState('usr_sofia_eklund');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const selectedMember = allMembers.find(m => m.id === selectedMemberId) || allMembers[0];
  const memberSkills = skills.filter(s => s.member_id === selectedMember.id);

  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === 'ALL') return true;
    return r.target_type === reviewFilter;
  });

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    onAddSkill(newSkillName.trim());
    setNewSkillName('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    let targetTitle = '';
    if (reviewTargetType === 'MEMBER') {
      const targetM = allMembers.find(m => m.id === reviewTargetId);
      targetTitle = targetM ? targetM.full_name : 'Medlem';
    } else if (reviewTargetType === 'HUB') {
      targetTitle = 'Hubb Stockholm City';
    } else {
      targetTitle = 'Stora Booster-Frukosten & B2B Matchmaking';
    }

    onAddReview({
      author_member_id: currentUser.id,
      author_name: currentUser.full_name,
      author_company: currentUser.company_name,
      target_type: reviewTargetType,
      target_id: reviewTargetId,
      target_title: targetTitle,
      rating: reviewRating,
      review_text: reviewText.trim()
    });

    setShowAddReviewModal(false);
    setReviewText('');
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Skillbars & Kompetensröstning (Endorsements) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Skillbars & Kompetensröstning
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Endorse V3
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Medlemmar anger sina specialistområden. Nätverket röstar ("endorse") vilket fyller skillbaren visuellt.
            </p>
          </div>

          {/* Member selector for skills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">Välj medlem:</span>
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800"
            >
              {allMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.company_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Member Header Card */}
        <div className="bg-[#F4F5F7] p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedMember.avatar}
              alt={selectedMember.full_name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white"
            />
            <div>
              <h3 className="font-bold text-sm text-gray-900">{selectedMember.full_name}</h3>
              <p className="text-xs text-gray-500">{selectedMember.role_title} • {selectedMember.company_name}</p>
            </div>
          </div>

          {selectedMember.id === currentUser.id && (
            <form onSubmit={handleAddNewSkill} className="hidden sm:flex items-center gap-2">
              <input
                type="text"
                placeholder="Lägg till kompetens..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 w-48"
              />
              <button
                type="submit"
                disabled={!newSkillName.trim()}
                className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] disabled:opacity-50"
              >
                + Lägg till
              </button>
            </form>
          )}
        </div>

        {/* Skillbars List */}
        <div className="space-y-4">
          {memberSkills.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">
              Inga kompetenser registrerade för denna medlem ännu.
            </div>
          ) : (
            memberSkills.map(skill => {
              const fillPercentage = Math.min(Math.round((skill.endorsements_count / skill.max_capacity) * 100), 100);

              return (
                <div
                  key={skill.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2 hover:border-gray-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-gray-900">
                        {skill.skill_name}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-2">
                        ({skill.endorsements_count} röster från verifierade medlemmar)
                      </span>
                    </div>

                    <button
                      onClick={() => onEndorseSkill(skill.id)}
                      disabled={skill.has_endorsed}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        skill.has_endorsed
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-[#800020] hover:bg-[#580016] text-white shadow-xs'
                      }`}
                      id={`btn-endorse-${skill.id}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{skill.has_endorsed ? 'Röstat ✓' : '+ Rösta (Endorse)'}</span>
                    </button>
                  </div>

                  {/* Visual Skillbar Filling Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#F4F5F7] h-3 rounded-full overflow-hidden border border-gray-100 p-0.5">
                      <div
                        className="bg-gradient-to-r from-[#800020] to-rose-700 h-full rounded-full transition-all duration-700"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Styrkegrad: {fillPercentage}%</span>
                      <span>Senaste röster från: {skill.endorsers.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* SECTION 2: Omdömen (Members, Hubs, Events) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Omdömen & Recensioner (1–5 Stjärnor)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                Trust & Quality
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Betygsätt medlemmar, fysiska hubbar och genomförda event med stjärnor och skriftliga omdömen.
            </p>
          </div>

          <button
            onClick={() => setShowAddReviewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
            id="btn-write-review"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Skriv Omdöme</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F4F5F7] p-1 rounded-xl w-fit">
          {[
            { id: 'ALL', label: 'Alla Omdömen' },
            { id: 'MEMBER', label: 'Medlemmar' },
            { id: 'HUB', label: 'Fysiska Hubbar' },
            { id: 'EVENT', label: 'Genomförda Event' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setReviewFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                reviewFilter === tab.id
                  ? 'bg-white text-[#800020] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map(rev => (
            <div
              key={rev.id}
              className="bg-[#F4F5F7]/60 p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-900 ml-1.5">{rev.rating}.0</span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                    {rev.target_type === 'MEMBER' ? 'Medlem' : rev.target_type === 'HUB' ? 'Hubb' : 'Event'}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#800020]">
                  Gäller: {rev.target_title}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{rev.review_text}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rev.author_name} ({rev.author_company})</span>
                </div>
                <span>{new Date(rev.created_at).toLocaleDateString('sv-SE')}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal: Skriv omdöme */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Skriv Omdöme & Recension</span>
              </h3>
              <button onClick={() => setShowAddReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Typ av omdöme</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MEMBER', 'HUB', 'EVENT'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReviewTargetType(type)}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition ${
                        reviewTargetType === type
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-[#F4F5F7] text-gray-700 border-gray-200'
                      }`}
                    >
                      {type === 'MEMBER' ? 'Medlem' : type === 'HUB' ? 'Hubb' : 'Event'}
                    </button>
                  ))}
                </div>
              </div>

              {reviewTargetType === 'MEMBER' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Välj Medlem</label>
                  <select
                    value={reviewTargetId}
                    onChange={e => setReviewTargetId(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                  >
                    {allMembers.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.company_name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Betyg (1–5 Stjärnor)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{reviewRating} av 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ditt Omdöme</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Beskriv erfarenheten, professionalismen och resultatet av samarbetet..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl p-3 text-xs text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold"
                >
                  Publicera Omdöme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
