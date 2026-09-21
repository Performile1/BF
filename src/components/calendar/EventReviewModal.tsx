import React, { useState } from 'react';
import { Star, Zap, Award, X, Check } from 'lucide-react';
import { MasterCalendarEvent, Member } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface EventReviewModalProps {
  event: MasterCalendarEvent;
  currentUser: Member;
  onClose: () => void;
  onSubmitReview: (eventId: string, rating: number, reviewText: string) => void;
}

export const EventReviewModal: React.FC<EventReviewModalProps> = ({
  event,
  currentUser,
  onClose,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert('Vänligen skriv en kort motivering eller recension.');
      return;
    }
    setIsSubmitting(true);
    onSubmitReview(event.id, rating, reviewText);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <AdminInspect
      component="EventReviewModal.tsx"
      sourceTable="public.event_reviews"
      columns={['id', 'event_id', 'member_id', 'rating', 'review_text', 'created_at']}
      notes="Lämna recension på genomfört event och erhåll bonuspoäng"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider mb-1">
              <Star className="w-3 h-3 text-amber-500 fill-current" />
              <span>Verifierad Eventrecension</span>
            </div>
            <h3 className="text-lg font-black text-gray-900 font-display">
              Recensera "{event.title}"
            </h3>
            <p className="text-xs text-gray-500">
              Dela din upplevelse och hjälp nätverket med värdefull feedback
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bonus Reward callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#800020]" />
            <div>
              <span className="font-bold text-[#800020] block">Du belönas med +20 Booster Points!</span>
              <span className="text-[11px] text-gray-600">Poäng utdelas direkt vid publicerat omdöme.</span>
            </div>
          </div>
          <span className="font-black text-xs text-[#800020] bg-white px-2 py-1 rounded-lg shadow-2xs">
            +20 BP
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star rating selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Ditt betyg på träffen:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-black text-gray-700">
                {rating === 5 ? '5 av 5 (Toppklass!)' : `${rating} av 5 stjärnor`}
              </span>
            </div>
          </div>

          {/* Text feedback */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Din recension & tankar:
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Vad var mest värdefullt? Hur var bordssamtalen och matchningen med andra deltagare?"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              required
            />
          </div>

          {/* User info preview */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
            <span>Publiceras som: <strong>{currentUser.full_name}</strong> ({currentUser.company_name})</span>
            <span className="text-emerald-700 font-bold">Verifierad deltagare</span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reviewText.trim()}
              className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:bg-gray-300"
            >
              <Check className="w-4 h-4" />
              <span>Publicera & Hämta +20 BP</span>
            </button>
          </div>
        </form>

      </div>
    </div>
    </AdminInspect>
  );
};
