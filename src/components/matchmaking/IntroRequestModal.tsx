import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Zap, 
  Send, 
  Sparkles, 
  Target,
  Award
} from 'lucide-react';
import { Member, IntroRequest } from '../../types';

interface IntroRequestModalProps {
  currentUser: Member;
  onClose: () => void;
  onCreateRequest: (request: Partial<IntroRequest>) => void;
}

export const IntroRequestModal: React.FC<IntroRequestModalProps> = ({
  currentUser,
  onClose,
  onCreateRequest
}) => {
  const [targetRoleOrCompany, setTargetRoleOrCompany] = useState('');
  const [description, setDescription] = useState('');
  const [bountyBp, setBountyBp] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRequest({
      id: `req_${Date.now()}`,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_avatar: currentUser.avatar,
      author_company: currentUser.company_name,
      author_role: currentUser.role_title,
      target_role_or_company: targetRoleOrCompany,
      description,
      bounty_bp: bountyBp,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      comments_count: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0016] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Target className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                Pay It Forward
              </span>
              <h2 className="text-lg font-black text-white">
                Efterfråga Dörröppnare ("Vem känner X?")
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs text-rose-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#800020]">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Bounty-system för dörröppnare (+{bountyBp} BP):</span>
            </div>
            <p className="leading-relaxed">
              Den medlem som gör en bekräftad varm introduktion belönas med <span className="font-bold">+{bountyBp} Booster Points</span> samt en Connector-Badge i nätverket!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Vem eller vilket bolag vill du nå? *
            </label>
            <input
              type="text"
              required
              placeholder="T.ex. Inköpschef på Dustin, CFO på Spotify, eller E-handelschef på NA-KD"
              value={targetRoleOrCompany}
              onChange={(e) => setTargetRoleOrCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-hidden focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Beskrivning & Värdeerbjudande för kontakten *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Varför vill du komma i kontakt? Vad kan du tillföra för värde? Beskriv så att dina kollegor i nätverket tryggt kan öppna dörren..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Utsatt Connector-Bounty (Booster Points):
            </label>
            <div className="flex items-center gap-2">
              {[30, 50, 75, 100].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setBountyBp(pts)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    bountyBp === pts
                      ? 'bg-[#800020] text-white border-[#800020]'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  +{pts} BP
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Publicera Efterfrågan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
