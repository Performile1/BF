import React, { useState } from 'react';
import { 
  Video, 
  Play, 
  Calendar, 
  Download, 
  Users, 
  ThumbsUp, 
  MessageCircle, 
  HelpCircle, 
  BarChart2, 
  Lock, 
  Clock, 
  Plus, 
  CheckCircle, 
  Sparkles, 
  Share2, 
  X,
  Radio,
  FileDown
} from 'lucide-react';
import { Webinar, Member, WebinarPoll, WebinarQnAItem } from '../../types';
import { generateIcsCalendarFile } from '../../utils/calendar';

interface WebinarModuleProps {
  currentUser: Member;
  webinars?: Webinar[];
  onRegisterWebinar?: (webinarId: string) => void;
  onVotePoll?: (webinarId: string, optionId: string) => void;
  onAskQuestion?: (webinarId: string, question: string) => void;
  onUpvoteQuestion?: (webinarId: string, qnaId: string) => void;
  onCreateWebinar?: (webinar: Partial<Webinar>) => void;
}

export const WebinarModule: React.FC<WebinarModuleProps> = ({
  currentUser,
  webinars = [],
  onRegisterWebinar = (_id: string) => {},
  onVotePoll = (_webinarId: string, _optionId: string) => {},
  onAskQuestion = (_webinarId: string, _question: string) => {},
  onUpvoteQuestion = (_webinarId: string, _qnaId: string) => {},
  onCreateWebinar = (_webinar: Partial<Webinar>) => {}
}) => {
  const [activeTab, setActiveTab] = useState<'LIVE_UPCOMING' | 'ARCHIVE'>('LIVE_UPCOMING');
  const [selectedWebinarId, setSelectedWebinarId] = useState<string>(
    webinars.find(w => w.is_live)?.id || webinars[0]?.id || ''
  );
  const [newQuestionText, setNewQuestionText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [archiveFilterCategory, setArchiveFilterCategory] = useState<string>('ALL');

  // Form state for creating a new webinar
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Tillväxt & Skalning');
  const [newLevel, setNewLevel] = useState<'BRONZE' | 'SILVER' | 'GOLD'>('BRONZE');
  const [newDate, setNewDate] = useState('2026-09-25T10:00');

  const selectedWebinar = webinars.find(w => w.id === selectedWebinarId) || webinars[0];

  const categories = ['ALL', 'Försäljning & Skalning', 'Juridik & Ledarskap', 'Finansiering & Investering', 'Tillväxt & Skalning'];

  const liveAndUpcoming = webinars.filter(w => !w.recording_url);
  const archiveWebinars = webinars.filter(w => w.recording_url).filter(w => {
    if (archiveFilterCategory === 'ALL') return true;
    return w.category === archiveFilterCategory;
  });

  const handleCalendarSync = (webinar: Webinar) => {
    generateIcsCalendarFile(
      webinar.title,
      webinar.description,
      'Booster Friends Digital Live Studio',
      webinar.start_time,
      webinar.duration_min
    );
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedWebinar) return;
    onAskQuestion(selectedWebinar.id, newQuestionText.trim());
    setNewQuestionText('');
  };

  const handleSaveWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateWebinar({
      title: newTitle,
      description: newDescription,
      category: newCategory,
      required_membership_level: newLevel,
      start_time: new Date(newDate).toISOString(),
      host_member_id: currentUser.id,
      host_name: currentUser.full_name,
      host_role: currentUser.role_title,
      host_company: currentUser.company_name,
      duration_min: 45,
      attendee_count: 1,
      is_live: false,
      is_registered: true,
    });
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const checkHasAccess = (requiredLevel: string) => {
    if (requiredLevel === 'BRONZE') return true;
    if (requiredLevel === 'SILVER') return currentUser.membership_level === 'SILVER' || currentUser.membership_level === 'GOLD';
    if (requiredLevel === 'GOLD') return currentUser.membership_level === 'GOLD';
    return true;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Switcher & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
              <Video className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Webinar Engine & Digitala Sändningar
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Webinar V3
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Streama live masterclasses, ställ frågor till ledande experter och se on-demand arkiv
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F4F5F7] p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('LIVE_UPCOMING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'LIVE_UPCOMING'
                  ? 'bg-white text-[#800020] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              id="tab-webinar-live"
            >
              🔴 Live & Kommande
            </button>
            <button
              onClick={() => setActiveTab('ARCHIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'ARCHIVE'
                  ? 'bg-white text-[#800020] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              id="tab-webinar-archive"
            >
              📼 On-Demand Arkiv
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs"
            id="btn-create-webinar"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schemalägg</span>
          </button>
        </div>
      </div>

      {/* Main View: Live Player & Interactive Room */}
      {activeTab === 'LIVE_UPCOMING' && selectedWebinar && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Video Player & Overview */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Live Video Stage Container */}
            <div className="bg-[#1F2937] rounded-2xl overflow-hidden shadow-lg border border-gray-800 text-white relative">
              
              {/* Video Player Display */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                {selectedWebinar.is_live ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-radial from-neutral-800 to-black">
                    <div className="text-center p-6 space-y-3 z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse">
                        <Radio className="w-3.5 h-3.5" />
                        <span>SÄNDS DIREKT JUST NU</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black max-w-lg text-white font-display">
                        {selectedWebinar.title}
                      </h3>
                      <p className="text-xs text-gray-300">
                        Presenteras av {selectedWebinar.host_name} • {selectedWebinar.host_company}
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-2">
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{selectedWebinar.attendee_count} aktiva deltagare</span>
                        </span>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          <span>42 minuter kvar</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Calendar className="w-12 h-12 text-[#800020] mx-auto opacity-80" />
                    <h3 className="text-lg font-bold text-white max-w-md">
                      Kommande sändning: {selectedWebinar.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Startar {new Date(selectedWebinar.start_time).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {selectedWebinar.is_registered ? (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Du är anmäld! Kalendersynk klar.</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onRegisterWebinar(selectedWebinar.id)}
                        className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-sm"
                      >
                        Anmäl dig gratis (1-Klick)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Player Bottom Control Bar */}
              <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center font-bold text-white text-sm">
                    {selectedWebinar.host_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{selectedWebinar.host_name}</h4>
                    <p className="text-[11px] text-gray-400">{selectedWebinar.host_role} • {selectedWebinar.host_company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCalendarSync(selectedWebinar)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition border border-gray-700"
                    title="Ladda ner .ics kalenderfil för Google/Apple Calendar"
                    id="btn-calendar-sync"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Synka Kalender</span>
                  </button>

                  <button
                    onClick={() => alert(`Laddar ner presentationsmaterial för: ${selectedWebinar.title}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-xs font-bold text-white transition"
                    title="Ladda ner föreläsarens slides som PDF"
                    id="btn-download-slides"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Ladda ner Slides</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Webinar Details & Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#800020]/10 text-[#800020] border border-[#800020]/20">
                    {selectedWebinar.category}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    Kräver: {selectedWebinar.required_membership_level}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Längd: {selectedWebinar.duration_min} minuter
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-gray-900 font-display">
                {selectedWebinar.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {selectedWebinar.description}
              </p>
            </div>

            {/* Other Live/Upcoming Webinars Carousel */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Kommande Webinars i Nätverket
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {liveAndUpcoming.map(w => {
                  const isCur = w.id === selectedWebinar.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWebinarId(w.id)}
                      className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                        isCur
                          ? 'border-[#800020] bg-[#800020]/5 shadow-xs'
                          : 'border-gray-200 hover:bg-[#F4F5F7]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span className="font-semibold text-[#800020]">{w.category}</span>
                          {w.is_live && (
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                              LIVE
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                          {w.title}
                        </h4>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                        <span>{w.host_name}</span>
                        <span>{w.attendee_count} anmälda</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Col: Live Poll & Interactive Q&A Panel */}
          <div className="space-y-4">
            
            {/* Live Poll Card */}
            {selectedWebinar.active_poll ? (
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <BarChart2 className="w-4 h-4 text-[#800020]" />
                    <span>Live Omröstning</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Aktiv nu
                  </span>
                </div>

                <p className="text-xs font-semibold text-gray-800">
                  {selectedWebinar.active_poll.question}
                </p>

                {/* Poll Options with dynamic percentage visual fill */}
                <div className="space-y-2 pt-1">
                  {(() => {
                    const totalVotes = selectedWebinar.active_poll.options.reduce((sum, o) => sum + o.votes, 0);
                    return selectedWebinar.active_poll.options.map(opt => {
                      const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => onVotePoll(selectedWebinar.id, opt.id)}
                          className="w-full text-left relative overflow-hidden rounded-xl border border-gray-200 p-2.5 transition hover:border-[#800020] group"
                        >
                          {/* Background fill based on votes percentage */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-[#800020]/10 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-800 pr-2 group-hover:text-[#800020]">
                              {opt.text}
                            </span>
                            <span className="font-bold text-gray-900 whitespace-nowrap">
                              {pct}% ({opt.votes})
                            </span>
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                  Klicka på ett alternativ för att rösta i realtid.
                </p>
              </div>
            ) : null}

            {/* Interactive Q&A Panel */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col h-[460px]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <HelpCircle className="w-4 h-4 text-[#800020]" />
                  <span>Frågor & Svar (Q&A)</span>
                </span>
                <span className="text-xs text-gray-400">
                  {selectedWebinar.qna_items?.length || 0} frågor
                </span>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {selectedWebinar.qna_items && selectedWebinar.qna_items.length > 0 ? (
                  selectedWebinar.qna_items.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#F4F5F7] border border-gray-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-gray-700">{item.author_name}</span>
                        {item.is_answered && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            ✓ Besvarad
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 leading-snug">{item.question}</p>
                      
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => onUpvoteQuestion(selectedWebinar.id, item.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                            item.user_upvoted
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-gray-600 hover:text-[#800020] border border-gray-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.upvotes}</span>
                        </button>
                        <span className="text-[10px] text-gray-400">Rösta fram frågan</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-gray-400">
                    Inga frågor ännu. Var först med att ställa en fråga till föreläsaren!
                  </div>
                )}
              </div>

              {/* Ask Question Input */}
              <form onSubmit={handleAsk} className="pt-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Ställ en fråga till talaren..."
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  className="flex-1 bg-[#F4F5F7] text-xs rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:border-[#800020] text-gray-800"
                />
                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className="px-3 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition disabled:opacity-50"
                >
                  Skicka
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* Archive View: On-Demand Library with Level Filtering */}
      {activeTab === 'ARCHIVE' && (
        <div className="space-y-4">
          
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-2xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500 mr-1">Filtrera kategori:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setArchiveFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  archiveFilterCategory === cat
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#F4F5F7] text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'Alla Kategorier' : cat}
              </button>
            ))}
          </div>

          {/* Webinar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {archiveWebinars.map(webinar => {
              const hasAccess = checkHasAccess(webinar.required_membership_level);
              return (
                <div
                  key={webinar.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between transition hover:shadow-md"
                >
                  {/* Thumbnail / Video banner */}
                  <div className="aspect-video bg-neutral-900 relative flex items-center justify-center text-white">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80')`
                    }}></div>

                    {hasAccess ? (
                      <button
                        onClick={() => alert(`Startar on-demand uppspelning för: ${webinar.title}`)}
                        className="w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center hover:scale-105 transition shadow-lg z-10"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </button>
                    ) : (
                      <div className="text-center z-10 p-4">
                        <Lock className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-white block">
                          Exklusivt för {webinar.required_membership_level}
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Uppgradera medlemskap för att låsa upp
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white z-10">
                      {webinar.duration_min} min
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#800020]">{webinar.category}</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                        {webinar.required_membership_level}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-gray-900 leading-snug">
                      {webinar.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {webinar.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Talare: {webinar.host_name}</span>
                    {hasAccess ? (
                      <button
                        onClick={() => alert(`Öppnar inspelning: ${webinar.title}`)}
                        className="font-bold text-[#800020] hover:underline"
                      >
                        Titta nu →
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Uppgraderingsflöde till ${webinar.required_membership_level} öppnas.`)}
                        className="font-bold text-amber-700 hover:underline"
                      >
                        Lås upp →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal: Schemalägg Nytt Webinar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-[#800020]" />
                <span>Schemalägg Digitalt Webinar</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWebinar} className="space-y-3.5 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Webinarrubrik</label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. Så bygger du en B2B säljorganisation 2026"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Beskrivning & Agendapunkter</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Kort sammanfattning av vad deltagarna kommer att lära sig..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl p-3 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                  >
                    <option value="Försäljning & Skalning">Försäljning & Skalning</option>
                    <option value="Juridik & Ledarskap">Juridik & Ledarskap</option>
                    <option value="Finansiering & Investering">Finansiering & Investering</option>
                    <option value="Tillväxt & Skalning">Tillväxt & Skalning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Krävd Medlemsnivå</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as any)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                  >
                    <option value="BRONZE">Bronze (Öppet för alla)</option>
                    <option value="SILVER">Silver+</option>
                    <option value="GOLD">Exklusivt för Guld</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Datum & Starttid</label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 border border-gray-200">
                Inbyggd integration med Zoom / AWS IVS genererar automatiskt livestream-URL och kalenderlänkar för alla anmälda medlemmar.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
                >
                  Publicera Webinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
