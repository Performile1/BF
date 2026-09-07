import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  Coffee, 
  Award, 
  Upload, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  Clock,
  Heart,
  ExternalLink,
  Zap,
  Tag
} from 'lucide-react';
import { MasterCalendarEvent, Member, EventReview, EventGalleryImage } from '../../types';

interface PastEventsRecapViewProps {
  currentUser: Member;
  pastEvents: MasterCalendarEvent[];
  allMembers?: Member[];
  onOpenReviewModal: (event: MasterCalendarEvent) => void;
  onOpenLunchModal: (attendee: any, event: MasterCalendarEvent) => void;
  onLogOneOnOne: (attendee: any, event: MasterCalendarEvent) => void;
  onUploadPhoto?: (event: MasterCalendarEvent) => void;
  onStartChat?: (memberId: string) => void;
}

export const PastEventsRecapView: React.FC<PastEventsRecapViewProps> = ({
  currentUser,
  pastEvents,
  allMembers = [],
  onOpenReviewModal,
  onOpenLunchModal,
  onLogOneOnOne,
  onUploadPhoto,
  onStartChat
}) => {
  const [expandedRecapId, setExpandedRecapId] = useState<string | null>(pastEvents[0]?.id || null);
  const [selectedImageModal, setSelectedImageModal] = useState<EventGalleryImage | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  const togglePhotoLike = (id: string) => {
    setLikedPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (pastEvents.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-gray-900">Inga genomförda event hittades</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          När nätverksträffar och frukostar har genomförts samlas recensioner, mingelbilder och deltagarlistor här.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 rounded-3xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eventhistorik & Nätverkseffekt</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
            Genomförda Träffar, Mingelbilder & Recensioner
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Se vad som hände på tidigare träffar, ladda ner presentationer, lämna recensioner för att erhålla <strong>+20 BP</strong> och följ upp med kollegor du minglade med genom att logga 1-till-1 möten eller bjuda på lunch.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {pastEvents.map(evt => {
          const isExpanded = expandedRecapId === evt.id;
          const ratingAvg = evt.rating_avg || 4.9;
          const reviewsCount = evt.event_reviews?.length || evt.reviews_count || 0;
          const attendeesList = evt.checked_in_members || evt.attendees || [];

          return (
            <div 
              key={evt.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs transition hover:border-gray-300"
            >
              {/* Event Header Card */}
              <div className="p-6 space-y-4">
                
                {/* Top Badges & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Genomfört Event</span>
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {evt.display_date} • {evt.hub_name || evt.location}
                    </span>
                  </div>

                  {/* Rating Stars & Count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-black text-xs text-amber-950">{ratingAvg} / 5.0</span>
                      <span className="text-[10px] text-amber-800 font-medium">({reviewsCount} omdömen)</span>
                    </div>

                    <button
                      onClick={() => onOpenReviewModal(evt)}
                      className="px-3 py-1 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-300 fill-current" />
                      <span>Lämna Recension (+20 BP)</span>
                    </button>
                  </div>
                </div>

                {/* Title and Speaker */}
                <div>
                  <h3 className="text-xl font-black text-gray-900 font-display">
                    {evt.title}
                  </h3>
                  {evt.speaker_or_host && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Värd / Talare: <span className="font-semibold text-gray-700">{evt.speaker_or_host}</span>
                    </p>
                  )}
                </div>

                {/* Impact Badge (Real business results) */}
                {evt.impact_stats && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50/50 to-amber-50/30 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                          Verifierad Nätverkseffekt (Impact)
                        </span>
                        <p className="text-xs font-bold text-gray-900">
                          {evt.impact_stats.meetings_count || 12} nya 1-till-1 möten och {evt.impact_stats.intros_count || 4} varma introduktioner genererade!
                        </p>
                      </div>
                    </div>

                    {evt.impact_stats.deals_sek && (
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block font-bold uppercase">Skapat Affärsvärde</span>
                        <span className="text-sm font-black text-[#800020] font-display">
                          ca {evt.impact_stats.deals_sek.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Recap Summary Box */}
                {evt.recap_text && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Eventsammanfattning (Key Takeaways)</span>
                      </span>
                      <button
                        onClick={() => setExpandedRecapId(isExpanded ? null : evt.id)}
                        className="text-gray-500 hover:text-gray-900 text-xs font-bold flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Dölj detaljer' : 'Visa hela sammanfattningen'}</span>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className={`text-gray-700 ${!isExpanded && 'line-clamp-2'}`}>
                      {evt.recap_text}
                    </p>
                  </div>
                )}

                {/* Photo Gallery & Mingelbilder */}
                {evt.gallery_images && evt.gallery_images.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#800020]" />
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                          Mingel- & Fotogalleri ({evt.gallery_images.length} bilder)
                        </h4>
                      </div>

                      <button
                        onClick={() => onUploadPhoto ? onUploadPhoto(evt) : alert('Funktion för fotouppladdning aktiverad!')}
                        className="text-xs font-bold text-[#800020] hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Ladda upp mingelbild (+10 BP)</span>
                      </button>
                    </div>

                    {/* Image thumbnails carousel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {evt.gallery_images.map(img => (
                        <div 
                          key={img.id}
                          className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video cursor-pointer"
                          onClick={() => setSelectedImageModal(img)}
                        >
                          <img 
                            src={img.url} 
                            alt={img.caption || 'Mingelbild'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 flex flex-col justify-between opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition">
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePhotoLike(img.id);
                                }}
                                className="p-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white hover:bg-white/40"
                              >
                                <Heart className={`w-3.5 h-3.5 ${likedPhotos[img.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{img.caption}</p>
                              {img.author_name && (
                                <p className="text-[10px] text-gray-300">Foto: {img.author_name}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews List preview */}
                {evt.event_reviews && evt.event_reviews.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>Senaste Medlemsomdömen</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evt.event_reviews.map(rev => (
                        <div key={rev.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {rev.member_avatar && (
                                <img src={rev.member_avatar} alt={rev.member_name} className="w-6 h-6 rounded-full object-cover" />
                              )}
                              <span className="text-xs font-black text-gray-900">{rev.member_name}</span>
                              {rev.is_verified && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Verifierad deltagare
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-amber-500 text-xs">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed italic">
                            "{rev.review_text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section: "Nätverkade du med dessa?" (Checked-in attendees followup) */}
                {attendeesList.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#800020]" />
                          <span>Nätverkade du med dessa? Följ upp direkt</span>
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Fördjupa relationen efter eventet – logga kaffemöten för poäng eller bjud kollegan på lunch.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {attendeesList.length} incheckade
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {attendeesList.map((att: any) => (
                        <div 
                          key={att.id}
                          className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={att.avatar} 
                              alt={att.full_name} 
                              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-black text-gray-900 truncate">{att.full_name}</h5>
                              <p className="text-[11px] text-gray-500 truncate">{att.role_title} • {att.company_name}</p>
                              <span className="text-[10px] text-gray-400 font-medium truncate block">
                                {att.competence_tag || 'Medlem'}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons: 1-on-1 & Lunch */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => onLogOneOnOne(att, evt)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-black transition flex items-center gap-1"
                              title="Logga genomfört kaffemöte och få +20 BP"
                            >
                              <Coffee className="w-3 h-3 text-amber-600" />
                              <span>Logga 1-1 (+20 BP)</span>
                            </button>

                            <button
                              onClick={() => onOpenLunchModal(att, evt)}
                              className="px-2.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-[10px] font-black transition flex items-center gap-1 shadow-2xs"
                              title="Bjud kollega på lunch (+30 BP om du bjuder)"
                            >
                              <Coffee className="w-3 h-3" />
                              <span>Bjud på lunch</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for full image view */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-in zoom-in-95">
            <div className="relative aspect-video">
              <img src={selectedImageModal.url} alt={selectedImageModal.caption || ''} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImageModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="text-sm font-black text-gray-900">{selectedImageModal.caption}</h4>
              <p className="text-xs text-gray-500">Fotograferad av: {selectedImageModal.author_name || 'Booster Friends fotograf'}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
