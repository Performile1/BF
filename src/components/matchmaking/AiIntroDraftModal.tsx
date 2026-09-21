import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { Member } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface AiIntroDraftModalProps {
  currentUser: Member;
  candidate: Member;
  synergyReason: string;
  onClose: () => void;
  onSendIntro: (candidate: Member, messageText: string) => void;
}

export const AiIntroDraftModal: React.FC<AiIntroDraftModalProps> = ({
  currentUser,
  candidate,
  synergyReason,
  onClose,
  onSendIntro
}) => {
  const defaultDraft = `Hej ${candidate.full_name.split(' ')[0]}!\n\nJag såg via Booster Friends AI-matchning att du är verksam inom ${candidate.industry || candidate.company_name} och erbjuder expertis inom "${candidate.offering_tags.slice(0, 2).join(' och ')}".\n\nEftersom vi på ${currentUser.company_name} just nu söker "${currentUser.seeking_tags.slice(0, 2).join(' och ')}" tror jag vi har en stark affärssynergi. Vore väldigt kul att ta en digital eller fysisk kaffe (15-20 min) och utbyta erfarenheter!\n\nAllt gott,\n${currentUser.full_name}`;

  const [messageDraft, setMessageDraft] = useState(defaultDraft);
  const [includeCadenceReminder, setIncludeCadenceReminder] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendIntro(candidate, messageDraft);
    onClose();
  };

  return (
    <AdminInspect
      component="AiIntroDraftModal.tsx"
      sourceTable="public.direct_chats / ai_matchmaking"
      columns={['sender_id', 'receiver_id', 'draft_content', 'synergy_score', 'status']}
      notes="AI-genererat introduktionsmeddelande för direktkontakt mellan medlemmar"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0016] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                  Intro-AI Generator
                </span>
                <span className="text-xs text-white/70">3-vägs introduktion</span>
              </div>
              <h2 className="text-lg font-black text-white">
                Skapa Smart Intro med {candidate.full_name}
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

        {/* Synergy Justification Card */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>AI Matchningsmotivering:</span>
            </div>
            <p className="leading-relaxed">
              {synergyReason}
            </p>
            <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
              <span>🎯 Rekommenderat nästa steg:</span>
              <span className="underline">15 minuters fokuserat synergimöte</span>
            </div>
          </div>

          {/* Member mini-card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200">
            <img 
              src={candidate.avatar} 
              alt={candidate.full_name} 
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">{candidate.full_name}</h4>
                <span className="text-[10px] font-bold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {candidate.membership_level} • {candidate.booster_score} BP
                </span>
              </div>
              <p className="text-xs text-gray-500">{candidate.role_title} • {candidate.company_name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">📍 {candidate.city} ({candidate.hub_name})</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Personligt Introduktionsutkast:
                </label>
                <span className="text-[11px] text-gray-400">Kan redigeras fritt</span>
              </div>
              <textarea
                rows={6}
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020] leading-relaxed"
                required
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCadenceReminder}
                onChange={(e) => setIncludeCadenceReminder(e.target.checked)}
                className="mt-0.5 rounded text-[#800020] focus:ring-[#800020]"
              />
              <span className="text-xs text-gray-600 leading-snug">
                <span className="font-bold text-gray-800">Aktivera automatisk relationsvård:</span> Skicka kadenspåminnelse och pipeline-avstämning om möte inte loggats inom 14 dagar.
              </span>
            </label>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
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
                <span>Skicka Intro i Direktchatt (+10 BP)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AdminInspect>
  );
};
