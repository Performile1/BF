import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Contact, 
  Calendar, 
  Users, 
  CheckCheck, 
  Search, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Info,
  X,
  UserCheck,
  Download,
  ExternalLink,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { ChatChannel, ChatMessage, Member, Hub } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface ChatModuleProps {
  currentUser: Member;
  allMembers?: Member[];
  channels: ChatChannel[];
  messages?: Record<string, ChatMessage[]>;
  messagesByChannel?: Record<string, ChatMessage[]>;
  activeChannelId?: string;
  selectedChannelId?: string;
  onSelectChannel: (channelId: string) => void;
  onSendMessage: (channelId: string, text: string, attachmentType?: 'image' | 'vCard' | 'document' | 'meeting_invite', metadata?: any) => void;
  onCreateIntroThread?: (memberBId: string, memberCId: string, contextReason: string) => void;
  onCreateChannel?: (targetMember: Member) => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({
  currentUser,
  allMembers = [],
  channels = [],
  messages,
  messagesByChannel,
  activeChannelId,
  selectedChannelId,
  onSelectChannel,
  onSendMessage,
  onCreateIntroThread
}) => {
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DIRECT' | 'HUB' | 'INTRO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Intro thread creator state
  const [introMemberB, setIntroMemberB] = useState<string>(allMembers.find(m => m.id !== currentUser.id)?.id || '');
  const [introMemberC, setIntroMemberC] = useState<string>(allMembers.filter(m => m.id !== currentUser.id)[1]?.id || '');
  const [introReason, setIntroReason] = useState<string>('Kapitalanskaffning och aktieägaravtal inför stundande Serie A.');

  // Meeting invite modal state
  const [meetingTitle, setMeetingTitle] = useState('1-on-1 Strategiavstämning');
  const [meetingDate, setMeetingDate] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toISOString().split('T')[0];
  });
  const [meetingStartTime, setMeetingStartTime] = useState('10:00');
  const [meetingEndTime, setMeetingEndTime] = useState('10:45');
  const [meetingLocation, setMeetingLocation] = useState('Booster Video Room');
  const [meetingDescription, setMeetingDescription] = useState('1-on-1 Strategisamtal & Nätverksavstämning i Booster Friends');
  const [acceptedMeetings, setAcceptedMeetings] = useState<Record<string, boolean>>({});

  // Helper: Download .ics file
  const handleDownloadIcs = (title: string, dateStr: string, startTime: string, endTime: string, location: string, description: string) => {
    const cleanDate = (dateStr || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const cleanStart = (startTime || '10:00').replace(':', '');
    const cleanEnd = (endTime || '10:45').replace(':', '');
    const dtStart = `${cleanDate}T${cleanStart}00`;
    const dtEnd = `${cleanDate}T${cleanEnd}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Booster Friends//Meeting Invite//SV',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: Open Google Calendar Web link
  const handleOpenGoogleCalendar = (title: string, dateStr: string, startTime: string, endTime: string, location: string, description: string) => {
    const cleanDate = (dateStr || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const cleanStart = (startTime || '10:00').replace(':', '');
    const cleanEnd = (endTime || '10:45').replace(':', '');
    const dates = `${cleanDate}T${cleanStart}00/${cleanDate}T${cleanEnd}00`;
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  const channelStore = messages || messagesByChannel || {};
  const currentChannelId = activeChannelId || selectedChannelId;
  const activeChannel = channels.find(c => c.id === currentChannelId) || channels[0];
  const channelMessages = activeChannel ? (channelStore[activeChannel.id] || []) : [];

  const filteredChannels = channels.filter(c => {
    if (filterType === 'DIRECT') return c.channel_type === 'DIRECT';
    if (filterType === 'HUB') return c.channel_type === 'HUB' || c.channel_type === 'EVENT';
    if (filterType === 'INTRO') return c.is_intro_thread;
    return true;
  }).filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChannel) return;
    onSendMessage(activeChannel.id, inputText.trim());
    setInputText('');
    setShowAttachMenu(false);
  };

  const handleSendVCard = () => {
    if (!activeChannel) return;
    onSendMessage(
      activeChannel.id,
      `Här är mina officiella kontaktuppgifter i Booster Friends.`,
      'vCard',
      {
        title: `${currentUser.full_name} – Digitalt vCard`,
        subtitle: `${currentUser.role_title} • ${currentUser.company_name}`,
        vcard_phone: currentUser.phone,
        vcard_email: currentUser.email,
      }
    );
    setShowAttachMenu(false);
  };

  const handleSendDocument = () => {
    if (!activeChannel) return;
    onSendMessage(
      activeChannel.id,
      `Bifogar underlag och presentation inför vårt möte.`,
      'document',
      {
        title: 'Booster_Friends_Partnership_Overview.pdf',
        subtitle: 'PDF-dokument • 2.4 MB',
        file_size: '2.4 MB'
      }
    );
    setShowAttachMenu(false);
  };

  const handleSendMeetingInvite = () => {
    if (!activeChannel) return;
    const formattedTime = `${meetingDate} kl ${meetingStartTime} - ${meetingEndTime}`;
    onSendMessage(
      activeChannel.id,
      `📅 Mötesinbjudan skickad: "${meetingTitle}" den ${formattedTime}`,
      'meeting_invite',
      {
        title: meetingTitle,
        subtitle: `${meetingLocation} • ${meetingDescription}`,
        meeting_time: formattedTime,
        meeting_date: meetingDate,
        meeting_start_time: meetingStartTime,
        meeting_end_time: meetingEndTime,
        meeting_location: meetingLocation,
        meeting_description: meetingDescription,
      }
    );
    setShowMeetingModal(false);
    setShowAttachMenu(false);
  };

  const submitIntroThread = () => {
    if (!introMemberB || !introMemberC || introMemberB === introMemberC) {
      alert('Välj två olika medlemmar att introducera.');
      return;
    }
    onCreateIntroThread(introMemberB, introMemberC, introReason);
    setShowIntroModal(false);
  };

  return (
    <AdminInspect
      component="ChatModule.tsx"
      sourceTable="public.chat_channels / chat_messages"
      columns={['id', 'channel_type', 'title', 'sender_id', 'message_text', 'attachment_type', 'created_at']}
      notes="Realtidschatt, direktmeddelanden, hubbkanaler och 3-vägs introduktionstrådar"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[640px] flex flex-col md:flex-row">
      
      {/* Channels Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-[#F4F5F7]/40 flex-shrink-0">
        
        {/* Sidebar Header & Action */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#800020]" />
              <span>Nätverkschatt</span>
            </h2>
            <button
              onClick={() => setShowIntroModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition shadow-xs"
              title="Skapa 3-parts intromatchningstråd"
              id="btn-create-intro-thread"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Skapa Intro</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Sök kontakt, hubb eller intromatchning..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F5F7] text-xs rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:outline-none focus:border-[#800020] text-gray-800"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 mt-3">
            {[
              { id: 'ALL', label: 'Alla' },
              { id: 'DIRECT', label: '1-till-1' },
              { id: 'INTRO', label: 'Intromatchningar' },
              { id: 'HUB', label: 'Hubbar & Event' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  filterType === tab.id
                    ? 'bg-[#800020] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Channel List */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
          {filteredChannels.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">
              Inga konversationer hittades.
            </div>
          ) : (
            filteredChannels.map(channel => {
              const isSelected = channel.id === activeChannel?.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition hover:bg-gray-100/80 ${
                    isSelected ? 'bg-white border-l-4 border-[#800020] shadow-xs' : ''
                  }`}
                  id={`channel-item-${channel.id}`}
                >
                  <div className="relative flex-shrink-0">
                    {channel.is_intro_thread ? (
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                      </div>
                    ) : channel.channel_type === 'HUB' ? (
                      <div className="w-11 h-11 rounded-xl bg-[#800020]/10 border border-[#800020]/20 flex items-center justify-center text-[#800020]">
                        <Users className="w-5 h-5" />
                      </div>
                    ) : channel.avatar_url ? (
                      <img
                        src={channel.avatar_url}
                        alt={channel.title}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                        {channel.title.charAt(0)}
                      </div>
                    )}

                    {channel.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#800020] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {channel.unread_count}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {channel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {channel.last_message_time || 'Idag'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {channel.last_message || 'Starta konversation...'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      {channel.is_intro_thread && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          Intromatchning (3p)
                        </span>
                      )}
                      {channel.channel_type === 'HUB' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#800020]/10 text-[#800020]">
                          Hubbkanal
                        </span>
                      )}
                      {channel.channel_type === 'DIRECT' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          1-till-1 Direkt
                        </span>
                      )}
                      {channel.channel_type === 'EVENT' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          Eventgrupp
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* Main Chat Conversation Area */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Active Channel Header */}
        {activeChannel ? (
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020] font-bold">
                {activeChannel.is_intro_thread ? '🤝' : activeChannel.title.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">
                    {activeChannel.title}
                  </h3>
                  {activeChannel.is_intro_thread && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Trepartstråd
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  {activeChannel.description || 'Krypterad meddelandekanal • Läsbekräftelse aktiv'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMeetingModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[#F4F5F7] transition"
                id="btn-schedule-quick-meeting"
              >
                <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                <span className="hidden sm:inline">Boka Möte</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Intro banner if this is an intro thread */}
        {activeChannel?.is_intro_thread && activeChannel.intro_data && (
          <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Intromatchning initierad av {activeChannel.intro_data.introducer_name}:</strong>{' '}
                {activeChannel.intro_data.introduced_names.join(' & ')}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              Aktiv dialog
            </span>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F4F5F7]/25">
          {channelMessages.map(msg => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                  isMe ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <img
                  src={msg.sender_avatar}
                  alt={msg.sender_name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-200 flex-shrink-0 mt-1"
                />

                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-[11px] text-gray-400 ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-gray-700">{msg.sender_name}</span>
                    <span>{new Date(msg.created_at).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#800020] text-white rounded-tr-xs shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message_text}</p>

                    {/* vCard Attachment Render */}
                    {msg.attachment_type === 'vCard' && msg.attachment_metadata && (
                      <div className={`mt-3 p-3 rounded-xl border ${
                        isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-[#F4F5F7] border-gray-200 text-gray-800'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Contact className="w-4 h-4 text-amber-300" />
                          <span>{msg.attachment_metadata.title}</span>
                        </div>
                        <p className="text-[11px] opacity-90 mt-0.5">{msg.attachment_metadata.subtitle}</p>
                        
                        <div className="mt-2 pt-2 border-t border-current/10 space-y-1 text-[11px]">
                          {msg.attachment_metadata.vcard_phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3" />
                              <span>{msg.attachment_metadata.vcard_phone}</span>
                            </div>
                          )}
                          {msg.attachment_metadata.vcard_email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3" />
                              <span>{msg.attachment_metadata.vcard_email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meeting Invite Attachment Render */}
                    {msg.attachment_type === 'meeting_invite' && msg.attachment_metadata && (
                      <div className={`mt-3 p-3.5 rounded-xl border ${
                        isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Mötesinbjudan</span>
                          </span>
                          <span className="text-[11px] font-semibold flex items-center gap-1 opacity-90">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {msg.attachment_metadata.meeting_time}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm mt-2">{msg.attachment_metadata.title}</h4>
                        
                        <div className="text-[11px] opacity-85 mt-1 space-y-0.5">
                          {msg.attachment_metadata.meeting_location && (
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{msg.attachment_metadata.meeting_location}</span>
                            </p>
                          )}
                          <p>{msg.attachment_metadata.subtitle}</p>
                        </div>

                        {/* Calendar export buttons */}
                        <div className="mt-3 pt-2.5 border-t border-current/15 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenGoogleCalendar(
                              msg.attachment_metadata.title,
                              msg.attachment_metadata.meeting_date,
                              msg.attachment_metadata.meeting_start_time,
                              msg.attachment_metadata.meeting_end_time,
                              msg.attachment_metadata.meeting_location || 'Booster Video Room',
                              msg.attachment_metadata.meeting_description || msg.attachment_metadata.subtitle
                            )}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white text-emerald-900 hover:bg-emerald-100 transition shadow-xs flex items-center gap-1 border border-emerald-200"
                            title="Öppna i Google Calendar"
                          >
                            <Calendar className="w-3 h-3 text-emerald-700" />
                            <span>Google Kalender</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadIcs(
                              msg.attachment_metadata.title,
                              msg.attachment_metadata.meeting_date,
                              msg.attachment_metadata.meeting_start_time,
                              msg.attachment_metadata.meeting_end_time,
                              msg.attachment_metadata.meeting_location || 'Booster Video Room',
                              msg.attachment_metadata.meeting_description || msg.attachment_metadata.subtitle
                            )}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white text-emerald-900 hover:bg-emerald-100 transition shadow-xs flex items-center gap-1 border border-emerald-200"
                            title="Ladda ner .ics kalenderfil för Apple Calendar, Outlook m.fl."
                          >
                            <Download className="w-3 h-3 text-emerald-700" />
                            <span>Ladda ner (.ics)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAcceptedMeetings(prev => ({ ...prev, [msg.id]: true }));
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                              acceptedMeetings[msg.id]
                                ? 'bg-emerald-600 text-white'
                                : isMe
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{acceptedMeetings[msg.id] ? 'Accepterad ✓' : 'Acceptera'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Document Attachment Render */}
                    {msg.attachment_type === 'document' && msg.attachment_metadata && (
                      <div className={`mt-3 p-2.5 rounded-xl flex items-center justify-between border ${
                        isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-[#F4F5F7] border-gray-200 text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-xs font-bold">{msg.attachment_metadata.title}</p>
                            <p className="text-[10px] opacity-75">{msg.attachment_metadata.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold underline cursor-pointer hover:opacity-80">
                          Öppna
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Read Receipts (Läskvittens) */}
                  {isMe && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                      <CheckCheck className="w-3 h-3 text-[#800020]" />
                      <span>Läskvittens: Läst av deltagare</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input & Attachments Bar */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white relative">
          
          {/* Attach Menu Popover */}
          {showAttachMenu && (
            <div className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-30 w-64 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1">
                Bifoga i nätverkschatt
              </div>
              <button
                onClick={handleSendVCard}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#F4F5F7] rounded-xl transition text-left"
              >
                <Contact className="w-4 h-4 text-[#800020]" />
                <div>
                  <div className="font-semibold text-gray-900">Skicka digitalt vCard</div>
                  <div className="text-[10px] text-gray-500">Dela kontakt- & företagsuppgifter</div>
                </div>
              </button>
              <button
                onClick={() => { setShowAttachMenu(false); setShowMeetingModal(true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#F4F5F7] rounded-xl transition text-left"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-gray-900">Skicka mötesinbjudan</div>
                  <div className="text-[10px] text-gray-500">1-klick kalendersynk</div>
                </div>
              </button>
              <button
                onClick={handleSendDocument}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#F4F5F7] rounded-xl transition text-left"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Bifoga dokument (PDF)</div>
                  <div className="text-[10px] text-gray-500">Avtal, pitchdeck eller underlag</div>
                </div>
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 rounded-xl text-gray-500 hover:bg-[#F4F5F7] hover:text-[#800020] transition border border-gray-200"
              title="Bifoga vCard, möte eller fil"
              id="btn-attach-menu"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Skriv meddelande till ${activeChannel?.title || 'gruppen'}...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-[#F4F5F7] text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-[#800020] text-gray-800"
              id="chat-input-text"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                inputText.trim()
                  ? 'bg-[#800020] hover:bg-[#580016] text-white shadow-xs cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              id="btn-chat-send"
            >
              <span className="hidden sm:inline">Skicka</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Modal: Skapa 3-partstråd (Intromatchning) */}
      {showIntroModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Skapa Intromatchnings-tråd</h3>
                  <p className="text-xs text-gray-500">Introducera två medlemmar i en automatisk trepartschatt</p>
                </div>
              </div>
              <button onClick={() => setShowIntroModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Introducera Medlem B:
                </label>
                <select
                  value={introMemberB}
                  onChange={e => setIntroMemberB(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                >
                  {allMembers.filter(m => m.id !== currentUser.id).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.company_name}) – {m.role_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ...Med Medlem C:
                </label>
                <select
                  value={introMemberC}
                  onChange={e => setIntroMemberC(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                >
                  {allMembers.filter(m => m.id !== currentUser.id && m.id !== introMemberB).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.company_name}) – {m.role_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kontext & Anledning till Introt:
                </label>
                <textarea
                  rows={3}
                  value={introReason}
                  onChange={e => setIntroReason(e.target.value)}
                  placeholder="Beskriv varför dessa två borde connecta (t.ex. kapitalanskaffning, avtal eller säljutbildning)..."
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#800020]"
                />
              </div>

              {/* Quick Template Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase w-full">Snabbmallar:</span>
                {[
                  'Kapitalanskaffning & VC',
                  'Avtalsjuridik & M&A',
                  'Enterprise B2B Säljcoaching',
                  'Kontorslokaler & Etablering'
                ].map(tmpl => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => setIntroReason(`Jag vill koppla ihop er gällande ${tmpl}. Ni har båda stark kompetens och synergier här.`)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#800020]/10 hover:text-[#800020] text-gray-700 transition"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowIntroModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Avbryt
              </button>
              <button
                onClick={submitIntroThread}
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1.5"
                id="btn-submit-intro-thread"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Starta Trepartstråd</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schemalägg snabbt möte */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#800020]" />
                <span>Skicka Mötesinbjudan</span>
              </h3>
              <button onClick={() => setShowMeetingModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mötets syfte / rubrik</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  placeholder="t.ex. 1-on-1 Strategiavstämning"
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-2.5 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Starttid</label>
                  <input
                    type="time"
                    value={meetingStartTime}
                    onChange={e => setMeetingStartTime(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sluttid</label>
                  <input
                    type="time"
                    value={meetingEndTime}
                    onChange={e => setMeetingEndTime(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plats / Mötesform</label>
                <select
                  value={meetingLocation}
                  onChange={e => setMeetingLocation(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                >
                  <option value="Booster Video Room">Booster Video Room (Virtuellt)</option>
                  <option value="Stockholm City Hubb Lounge">Stockholm City Hubb Lounge</option>
                  <option value="Göteborg Avenyn Hubb">Göteborg Avenyn Hubb</option>
                  <option value="Malmö Västra Hamnen Hubb">Malmö Västra Hamnen Hubb</option>
                  <option value="Telefonmöte">Telefonmöte</option>
                  <option value="Google Meet">Google Meet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mötesbeskrivning / Agenda</label>
                <textarea
                  rows={2}
                  value={meetingDescription}
                  onChange={e => setMeetingDescription(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                  placeholder="Kort agenda för mötet..."
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                ✓ Inbjudan skickas direkt med integrerade knappar för <strong>Google Kalender</strong> och export av standard <strong>.ics-fil</strong> (Apple & Outlook).
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
              >
                Avbryt
              </button>
              <button
                onClick={handleSendMeetingInvite}
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
              >
                Skicka till Chatten
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </AdminInspect>
  );
};
