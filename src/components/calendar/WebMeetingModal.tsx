import React, { useState } from 'react';
import { 
  Video, 
  Users, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CalendarPlus
} from 'lucide-react';
import { Member, WebMeeting, MeetingParticipant, MeetingType } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface WebMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  allMembers: Member[];
  initialTargetMember?: Member | null;
  initialType?: MeetingType;
  onCreateMeeting: (meeting: WebMeeting) => void;
  onAwardPoints?: (points: number, reason: string) => void;
}

export const WebMeetingModal: React.FC<WebMeetingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allMembers,
  initialTargetMember = null,
  initialType = 'ONE_TO_ONE',
  onCreateMeeting,
  onAwardPoints
}) => {
  const [meetingType, setMeetingType] = useState<MeetingType>(
    initialTargetMember ? 'ONE_TO_ONE' : initialType
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:45');
  const [provider, setProvider] = useState<'GOOGLE_MEET' | 'MICROSOFT_TEAMS' | 'ZOOM' | 'SIMULATED'>('GOOGLE_MEET');
  
  // Participants selection
  const [selectedSingleMemberId, setSelectedSingleMemberId] = useState<string>(
    initialTargetMember?.id || (allMembers.find(m => m.id !== currentUser.id)?.id || '')
  );
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>(
    initialTargetMember ? [initialTargetMember.id] : []
  );

  const [copiedLink, setCopiedLink] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<WebMeeting | null>(null);

  if (!isOpen) return null;

  const eligibleMembers = allMembers.filter(m => m.id !== currentUser.id);

  // Generate meeting code & link
  const generateMeetingLink = () => {
    const randomSlug = Math.random().toString(36).substring(2, 8);
    if (provider === 'GOOGLE_MEET') {
      return `https://meet.google.com/bf-${currentUser.first_name.toLowerCase()}-${randomSlug}`;
    }
    if (provider === 'MICROSOFT_TEAMS') {
      return `https://teams.microsoft.com/l/meetup-join/bf-call-${randomSlug}`;
    }
    if (provider === 'ZOOM') {
      return `https://zoom.us/j/98${Math.floor(10000000 + Math.random() * 90000000)}`;
    }
    return `https://boosterfriends.se/room/${randomSlug}`;
  };

  const handleToggleGroupMember = (memberId: string) => {
    setSelectedGroupMemberIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let participants: MeetingParticipant[] = [
      {
        member_id: currentUser.id,
        full_name: `${currentUser.first_name} ${currentUser.last_name}`,
        company: currentUser.company_name || 'Booster Friends',
        avatar: currentUser.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'HOST',
        status: 'ACCEPTED',
        email: `${currentUser.first_name.toLowerCase()}@boosterfriends.se`
      }
    ];

    if (meetingType === 'ONE_TO_ONE') {
      const targetMember = allMembers.find(m => m.id === selectedSingleMemberId);
      if (targetMember) {
        participants.push({
          member_id: targetMember.id,
          full_name: `${targetMember.first_name} ${targetMember.last_name}`,
          company: targetMember.company_name || '',
          avatar: targetMember.profile_picture_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          role: 'INVITEE',
          status: 'PENDING',
          email: `${targetMember.first_name.toLowerCase()}@medlem.se`
        });
      }
    } else {
      selectedGroupMemberIds.forEach(id => {
        const m = allMembers.find(mem => mem.id === id);
        if (m) {
          participants.push({
            member_id: m.id,
            full_name: `${m.first_name} ${m.last_name}`,
            company: m.company_name || '',
            avatar: m.profile_picture_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            role: 'ATTENDEE',
            status: 'PENDING',
            email: `${m.first_name.toLowerCase()}@medlem.se`
          });
        }
      });
    }

    const meetingLink = generateMeetingLink();

    const newMeeting: WebMeeting = {
      id: `meet_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Strategiskt digitalt nätverksmöte via Booster Friends.',
      meeting_type: meetingType,
      status: 'CONFIRMED',
      host_member_id: currentUser.id,
      host_name: `${currentUser.first_name} ${currentUser.last_name}`,
      host_avatar: currentUser.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      host_company: currentUser.company_name || 'Booster Friends',
      participants,
      date_str: dateStr,
      start_time: startTime,
      end_time: endTime,
      meeting_link: meetingLink,
      provider,
      created_at: new Date().toISOString(),
      reminder_sent: false,
      notes: ''
    };

    onCreateMeeting(newMeeting);
    setCreatedMeeting(newMeeting);
    setIsSuccess(true);

    if (onAwardPoints) {
      onAwardPoints(20, `Bokat digitalt ${meetingType === 'ONE_TO_ONE' ? '1-till-1 möte' : 'gruppmöte'}`);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCreatedMeeting(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AdminInspect
      component="WebMeetingModal.tsx"
      sourceTable="public.web_meetings / meeting_participants"
      columns={['id', 'host_id', 'title', 'start_time', 'end_time', 'meeting_type', 'join_url', 'provider']}
      notes="Skapa webbmöte via Google Meet, Teams eller Zoom och bjud in deltagare"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0017] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Video className="w-6 h-6 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-rose-100">
                  V12 Webbmöten
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> +20 BP
                </span>
              </div>
              <h2 className="text-xl font-black mt-1">Boka Webbmöte</h2>
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSuccess && createdMeeting ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900">Mötet har bokats och bekräftats!</h3>
              <p className="text-sm text-gray-600">
                Inbjudan och kalendersynk har skickats till alla deltagare. +20 Booster Points har registrerats!
              </p>
            </div>

            {/* Meeting Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-[#800020]/10 text-[#800020]">
                  {createdMeeting.meeting_type === 'ONE_TO_ONE' ? '1-till-1 Möte' : 'Gruppmöte'}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Status: Bekräftat
                </span>
              </div>

              <h4 className="font-bold text-gray-900 text-base">{createdMeeting.title}</h4>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>{createdMeeting.date_str}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{createdMeeting.start_time} - {createdMeeting.end_time}</span>
                </div>
              </div>

              {/* Participants */}
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs font-bold text-gray-500 mb-2">Deltagare ({createdMeeting.participants.length}):</div>
                <div className="flex flex-wrap gap-2">
                  {createdMeeting.participants.map(p => (
                    <div key={p.member_id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
                      <img src={p.avatar} alt={p.full_name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-semibold text-gray-800">{p.full_name}</span>
                      {p.role === 'HOST' && (
                        <span className="text-[10px] text-gray-400 uppercase font-bold">(Värd)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Link Bar */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate text-xs text-gray-700">
                  <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate font-mono">{createdMeeting.meeting_link}</span>
                </div>
                <button
                  onClick={() => handleCopyLink(createdMeeting.meeting_link)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Kopierad' : 'Kopiera länk'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={createdMeeting.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#66001a] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
              >
                <Video className="w-4 h-4" />
                <span>Gå med i mötet nu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
              >
                Klar
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Meeting Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Typ av Webbmöte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMeetingType('ONE_TO_ONE')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                    meetingType === 'ONE_TO_ONE'
                      ? 'border-[#800020] bg-rose-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${meetingType === 'ONE_TO_ONE' ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900">1-till-1 Webbmöte</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Individuell sparring & affärsmöte</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('GROUP')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${
                    meetingType === 'GROUP'
                      ? 'border-[#800020] bg-rose-50/50 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${meetingType === 'GROUP' ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900">Gruppmöte</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Rundabord eller projektmöte</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Target Member or Multi-select */}
            {meetingType === 'ONE_TO_ONE' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Välj Medlem att möta
                </label>
                <select
                  value={selectedSingleMemberId}
                  onChange={(e) => setSelectedSingleMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-[#800020] bg-white"
                >
                  {eligibleMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name} ({m.company_name || 'Medlem'}) - {m.membership_level}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Välj Deltagare ({selectedGroupMemberIds.length} valda)
                  </label>
                  <span className="text-[11px] text-gray-400">Klicka för att välja medlemmar</span>
                </div>
                <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl p-2 space-y-1.5 bg-gray-50">
                  {eligibleMembers.map(m => {
                    const selected = selectedGroupMemberIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleToggleGroupMember(m.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                          selected ? 'bg-white border border-[#800020] shadow-xs' : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={m.profile_picture_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-semibold text-gray-800">{m.first_name} {m.last_name}</span>
                          <span className="text-gray-400 text-[11px]">({m.company_name || 'Medlem'})</span>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          selected ? 'bg-[#800020] border-[#800020] text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {selected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mötestitel *
              </label>
              <input
                type="text"
                required
                placeholder="T.ex. Kvartalssynk, Sparring kring SaaS-försäljning..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Agenda / Beskrivning (valfritt)
              </label>
              <textarea
                rows={2}
                placeholder="Beskriv kort vad ni ska avhandla och målet med mötet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Datum
                </label>
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Starttid
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Sluttid
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>
            </div>

            {/* Platform / Provider */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Videoplattform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'GOOGLE_MEET', label: 'Google Meet' },
                  { id: 'MICROSOFT_TEAMS', label: 'MS Teams' },
                  { id: 'ZOOM', label: 'Zoom' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                      provider === p.id
                        ? 'border-[#800020] bg-rose-50 text-[#800020]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Supabase RLS & Kalendersynk</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#66001a] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Skapa Webbmöte (+20 BP)</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
    </AdminInspect>
  );
};
