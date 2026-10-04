import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Gift, 
  Tv, 
  History, 
  UserPlus, 
  Trophy, 
  ChevronRight, 
  Coffee, 
  Users, 
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { formatSek } from '../../../utils/calendar';
import { AdminInspect } from '../../dev/AdminInspect';
import { WebMeeting, DealPipelineItem, BoosterScoreLog } from '../../../types';

// ==========================================
// 1. MINA WEBBMÖTEN WIDGET
// ==========================================
export const MyMeetingsWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  webMeetings = [], 
  onOpenWebMeetingModal, 
  onNavigateTab 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const meetings = webMeetings.length > 0 ? webMeetings : [
    {
      id: 'wm_demo_1',
      title: 'Strategiskt Partnerskap & B2B-samarbete',
      meeting_type: 'ONE_TO_ONE' as const,
      date_str: 'Idag',
      start_time: '14:00',
      end_time: '14:45',
      meeting_link: 'https://meet.google.com/abc-defg-hij',
      organizer_id: currentUser?.id || 'usr_rickard_wigrund',
      participants: [
        {
          member_id: currentUser?.id || 'usr_rickard_wigrund',
          full_name: currentUser?.full_name || 'Rickard Wigrund',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          role: 'ORGANIZER' as const
        },
        {
          member_id: 'usr_sofia_eklund',
          full_name: 'Sofia Eklund',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          role: 'INVITEE' as const
        }
      ],
      agenda: 'Avstämning kring nya enterprise-avtal och IT-säkerhet.'
    }
  ];

  return (
    <AdminInspect
      component="MyMeetingsWidget.tsx"
      sourceTable="public.chat_channels / web_meetings"
      columns={['id', 'title', 'meeting_type', 'date_str', 'start_time', 'meeting_link']}
      notes="Webbmöten 1-till-1 och grupp med direkt anslutningslänk"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Mina Webbmöten</h3>
                <p className="text-[10px] text-gray-500">1-till-1 & Gruppsessioner</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenWebMeetingModal ? onOpenWebMeetingModal(null, 'ONE_TO_ONE') : onNavigateTab && onNavigateTab('calendar')}
              className="inline-flex items-center gap-1 text-[11px] font-black text-[#800020] bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Boka (+20 BP)</span>
            </button>
          </div>

          <div className="space-y-2.5 my-2">
            {meetings.slice(0, 2).map((m: any) => {
              const other = m.participants?.find((p: any) => p.member_id !== currentUser?.id);
              const isCopied = copiedId === m.id;

              return (
                <div key={m.id} className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/70 hover:bg-gray-50 transition space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          m.meeting_type === 'ONE_TO_ONE' ? 'bg-rose-100 text-[#800020]' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {m.meeting_type === 'ONE_TO_ONE' ? '1-till-1' : 'Grupp'}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {m.date_str} • {m.start_time} - {m.end_time}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                        {m.title}
                      </h4>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Bekräftat
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <div className="flex items-center gap-1.5">
                      {other?.avatar && (
                        <img src={other.avatar} alt={other.full_name} className="w-5 h-5 rounded-full object-cover border border-white" />
                      )}
                      <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[120px]">
                        {other ? other.full_name : 'Flera deltagare'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(m.id, m.meeting_link)}
                        title="Kopiera möteslänk"
                        className="p-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition text-[10px] cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <a
                        href={m.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020] text-white font-bold text-[10px] hover:bg-[#600018] transition shadow-2xs"
                      >
                        <span>Anslut</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Automatisk Google/Teams-synk</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('calendar')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Möteskalender
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 2. AI MATCHMAKING SPOTLIGHT WIDGET
// ==========================================
export const AiMatchmakingWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  allMembers = [], 
  onStartIntroWith, 
  onOpenDirectChat, 
  onNavigateTab 
}) => {
  const matchCandidates = allMembers.filter(m => m.id !== currentUser.id && m.is_admin !== true);
  const match = matchCandidates[0] || {
    id: 'usr_sofia_eklund',
    full_name: 'Sofia Eklund',
    role_title: 'Managing Partner & Affärsjurist',
    company_name: 'Eklund & Partners Advokatbyrå',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    seeking_tags: ['Techbolag i scaleup-fas', 'Fintech bolag'],
    offering_tags: ['Avtalsjuridik', 'Due Diligence', 'M&A']
  };

  return (
    <AdminInspect
      component="AiMatchmakingWidget.tsx"
      sourceTable="public.intro_requests / speed_networking_matches"
      columns={['member_id', 'target_member_id', 'match_score', 'synergy_reason']}
      notes="AI-genererade B2B affärsmatcher och sparringsrekommendationer"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">AI Lead Match Spotlight</h3>
                <p className="text-[10px] text-gray-500">Intelligent affärsmatchning</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              96% Synergi
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 my-2 space-y-2">
            <div className="flex items-center gap-2.5">
              <img src={match.avatar} alt={match.full_name} className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs" />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-gray-900 truncate">{match.full_name}</h4>
                <p className="text-[10px] text-gray-600 truncate">{match.role_title} • {match.company_name}</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-700 bg-white/80 p-2 rounded-xl border border-purple-100/60 leading-relaxed">
              💡 <strong>Matchningsskäl:</strong> Söker rådgivning inom SaaS-skalning och IT-säkerhet. Erbjuder expertis inom kommersiella samarbetsavtal.
            </p>

            <div className="flex flex-wrap gap-1 pt-0.5">
              {match.offering_tags?.slice(0, 2).map((t: string) => (
                <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-purple-900 border border-purple-200">
                  +{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onStartIntroWith ? onStartIntroWith(match as any) : onOpenDirectChat ? onOpenDirectChat(match.id) : onNavigateTab && onNavigateTab('matchmaking')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] text-white text-[11px] font-bold hover:bg-[#600018] transition cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-rose-300" />
            <span>Starta Intro (+15 BP)</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('matchmaking')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Fler matcher
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 3. MIN AFFÄRSPIPELINE (CRM) WIDGET
// ==========================================
export const MemberPipelineWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  pipelineItems = [], 
  onNavigateTab 
}) => {
  const deals = pipelineItems.length > 0 ? pipelineItems : [
    { id: 'p_1', title: 'Enterprise Säkerhetsaudit', value_sek: 125000, client_company: 'NordicPay AB', stage: 'meeting_done' },
    { id: 'p_2', title: 'Molnmigrering & GDPR', value_sek: 280000, client_company: 'CareNordic Health', stage: 'proposal' },
    { id: 'p_3', title: 'SaaS Skalningsavtal', value_sek: 85000, client_company: 'LogiTech Nordics', stage: 'closed_won' }
  ];

  const totalValue = deals.reduce((sum, d: any) => sum + (d.value_sek || d.deal_value_sek || 0), 0);

  return (
    <AdminInspect
      component="MemberPipelineWidget.tsx"
      sourceTable="public.crm_pipeline_deals"
      columns={['owner_member_id', 'title', 'value_sek', 'stage', 'probability']}
      notes="Personlig affärspipeline och B2B säljtratt"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Min Affärspipeline (CRM)</h3>
                <p className="text-[10px] text-gray-500">Pågående B2B-affärer</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-[#800020] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {formatSek(totalValue)}
            </span>
          </div>

          <div className="space-y-2 my-2">
            {deals.slice(0, 3).map((d: any) => (
              <div key={d.id} className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between text-xs hover:bg-gray-100/80 transition">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-gray-900 truncate">{d.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{d.client_company || 'Lead'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-[#800020] text-xs">{formatSek(d.value_sek || d.deal_value_sek || 0)}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    d.stage === 'closed_won' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/70 text-gray-700'
                  }`}>
                    {d.stage === 'closed_won' ? 'Vunnen' : d.stage === 'proposal' ? 'Offert' : 'Möte bokat'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{deals.length} aktiva affärsprocesser</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('pipeline')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Öppna Pipeline
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 4. MIN KALENDER & HUBBMÖTEN WIDGET
// ==========================================
export const CalendarUpcomingWidget: React.FC<WidgetComponentProps> = ({ 
  masterEvents = [], 
  onNavigateTab 
}) => {
  const events = masterEvents.length > 0 ? masterEvents : [
    { id: 'ev_1', title: 'Booster Nätverksfrukost: Skalning & M&A', date_str: 'Torsdag 08:30', hub_name: 'Hubb Stockholm City', attendees_count: 24 },
    { id: 'ev_2', title: 'Executive Workshop: AI i Affärsmodeller', date_str: 'Tisdag 16:00', hub_name: 'Hubb Göteborg Avenyn', attendees_count: 18 }
  ];

  return (
    <AdminInspect
      component="CalendarUpcomingWidget.tsx"
      sourceTable="public.hubs / events"
      columns={['id', 'title', 'event_type', 'start_time', 'location']}
      notes="Kommande nätverksevent, hubbfrukostar och workshops"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Kommande Hubbträffar</h3>
                <p className="text-[10px] text-gray-500">Nätverksfrukostar & workshops</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              +15 BP
            </span>
          </div>

          <div className="space-y-2 my-2">
            {events.slice(0, 2).map((ev: any) => (
              <div key={ev.id} className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/70 transition space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                  <span className="text-[#800020] font-bold">{ev.date_str}</span>
                  <span>{ev.hub_name || 'Hubben'}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 leading-snug">{ev.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>{ev.attendees_count || 14} anmälda</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Platser kvar</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Hubbar i Sthlm, Gbg & Malmö</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('calendar')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Hela kalendern
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 5. VIP GÄSTPASS & BJUD IN WIDGET
// ==========================================
export const GuestPassWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  guestPasses = [], 
  onNavigateTab 
}) => {
  return (
    <AdminInspect
      component="GuestPassWidget.tsx"
      sourceTable="public.free_trial_passes"
      columns={['guest_email', 'hub_id', 'code', 'status']}
      notes="Dela ut VIP gästpass till affärskontakter"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">VIP Gästpass</h3>
                <p className="text-[10px] text-gray-500">Bjud in gäster & partners</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              3 kvar
            </span>
          </div>

          <div className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 my-2 space-y-2">
            <p className="text-xs text-gray-700 leading-snug">
              Ge en potentiell kund eller samarbetspartner en dags gratis access till valfri hubb.
            </p>
            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-gray-900">
              <span>BOOST-GUEST-2026</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText('BOOST-GUEST-2026');
                  alert('Gästkod kopierad!');
                }}
                className="text-[10px] text-[#800020] font-sans hover:underline cursor-pointer"
              >
                Kopiera
              </button>
            </div>
            <p className="text-[10px] text-emerald-800 font-semibold">
              🎁 Få +50 BP när gästen checkar in i hubben!
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Gäller 30 dagar</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('promos')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Hantera pass
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 6. LIVE WEBINAR ENGINE WIDGET
// ==========================================
export const WebinarWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  return (
    <AdminInspect
      component="WebinarWidget.tsx"
      sourceTable="Mock / Klient-State: webinars"
      columns={['title', 'speaker_name', 'start_time', 'stream_url', 'is_live']}
      notes="Live-streamade masterclasses och webbinarier"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Live Webinar Engine</h3>
                <p className="text-[10px] text-gray-500">Expertseminarier & Masterclasses</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[9px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              KOMMANDE
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 my-2 space-y-1.5">
            <span className="text-[10px] font-mono text-gray-500">Fredag kl 11:30 (45 min)</span>
            <h4 className="text-xs font-bold text-gray-900 leading-snug">
              B2B SaaS-prissättning: Maximera ARR med värdebaserade paket
            </h4>
            <p className="text-[11px] text-gray-600">
              Gästföreläsare: Marcus Wallin (Nordic Growth Capital)
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Interaktiv Q&A & omröstningar</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('webinars')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Öppna Webinars
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 7. BOOSTER POINTS LEDGER WIDGET
// ==========================================
export const BpLedgerWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  scoreLogs = [], 
  onNavigateTab 
}) => {
  const logs = scoreLogs.length > 0 ? scoreLogs : [
    { id: '1', title: 'Incheckning Hubb Stockholm City', points: 25, created_at: 'Idag 09:15', activity_type: 'CHECK_IN' },
    { id: '2', title: 'Bokat 1-till-1 webbmöte', points: 20, created_at: 'Igår 14:30', activity_type: 'MEETING' },
    { id: '3', title: 'Slutfört certifiering B2B-avtal', points: 50, created_at: '3 dagar sedan', activity_type: 'ACADEMY' }
  ];

  return (
    <AdminInspect
      component="BpLedgerWidget.tsx"
      sourceTable="public.booster_score_logs"
      columns={['member_id', 'activity_type', 'points', 'title', 'created_at']}
      notes="Verifierad transaktionshistorik och poängaudit"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Booster Points Revisionslogg</h3>
                <p className="text-[10px] text-gray-500">Verifierade poängtransaktioner</p>
              </div>
            </div>
            <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              {currentUser?.booster_score || 1850} BP
            </span>
          </div>

          <div className="space-y-1.5 my-2">
            {logs.slice(0, 3).map((l: any) => (
              <div key={l.id} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-gray-900 truncate">{l.title || l.reason}</p>
                  <p className="text-[10px] text-gray-400">{l.created_at || 'Verifierad transaktion'}</p>
                </div>
                <span className="text-xs font-black text-emerald-700 shrink-0">
                  +{l.points} BP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Audit-säkrad med sha256</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('gamification')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Se hela historiken
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 8. NÄTVERKSREKOMMENDATIONER WIDGET
// ==========================================
export const NetworkRecommendationsWidget: React.FC<WidgetComponentProps> = ({ 
  currentUser, 
  allMembers = [], 
  onOpenDirectChat, 
  onNavigateTab 
}) => {
  const candidates = allMembers.filter(m => m.id !== currentUser?.id && !m.is_admin);

  return (
    <AdminInspect
      component="NetworkRecommendationsWidget.tsx"
      sourceTable="public.profiles / member_skills"
      columns={['full_name', 'company_name', 'seeking_tags', 'offering_tags']}
      notes="Rekommenderade kontaktpersoner baserat på branschmatch"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Nätverksrekommendationer</h3>
                <p className="text-[10px] text-gray-500">Relevanta profiler för dig</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 my-2">
            {candidates.slice(0, 2).map((m: any) => (
              <div key={m.id} className="p-2.5 rounded-2xl bg-gray-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={m.avatar} alt={m.full_name} className="w-8 h-8 rounded-full object-cover border border-white shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{m.full_name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{m.role_title} • {m.company_name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenDirectChat ? onOpenDirectChat(m.id) : onNavigateTab && onNavigateTab('chat')}
                  className="px-2 py-1 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-[10px] shrink-0 cursor-pointer"
                >
                  Ta kontakt
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Baserat på dina sparade intressen</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('directory')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Medlemskatalog
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 9. MÅNADENS HUBB BATTLE WIDGET
// ==========================================
export const HubBattleWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  const hubs = [
    { name: 'Stockholm City', score: 14200, rank: 1, color: 'text-amber-600' },
    { name: 'Göteborg Avenyn', score: 11800, rank: 2, color: 'text-gray-400' },
    { name: 'Malmö Dockan', score: 9400, rank: 3, color: 'text-amber-800' }
  ];

  return (
    <AdminInspect
      component="HubBattleWidget.tsx"
      sourceTable="public.hubs / coworking_desk_bookings"
      columns={['hub_id', 'total_points', 'rank', 'monthly_score']}
      notes="Regional hubbranking och gemensam tävling"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Månadens Hubb Battle</h3>
                <p className="text-[10px] text-gray-500">Regional poängliga</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Mars 2026
            </span>
          </div>

          <div className="space-y-2 my-2">
            {hubs.map(h => (
              <div key={h.name} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-xs ${h.color}`}>#{h.rank}</span>
                  <span className="font-bold text-gray-900">{h.name}</span>
                </div>
                <span className="font-black text-[#800020] text-xs">{h.score.toLocaleString()} BP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">+25 BP per incheckning</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('coworking')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Checka in nu
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 10. GEOFENCING RADAR WIDGET
// ==========================================
export const GeofencingWidget: React.FC<WidgetComponentProps> = ({ 
  selectedHub, 
  onNavigateTab 
}) => {
  const hubName = selectedHub?.name || 'Hubb Stockholm City';
  const radius = selectedHub?.radius_m || 250;

  return (
    <AdminInspect
      component="GeofencingWidget.tsx"
      sourceTable="public.hubs / member_active_locations"
      columns={['hub_id', 'geofence_lat', 'geofence_lng', 'radius_m']}
      notes="Automatisk GPS-närvarokontroll inom hubbens radie"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Geo-fencing Radar</h3>
                <p className="text-[10px] text-gray-500">Automatisk närvarokontroll</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Aktiv Radar
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl text-xs space-y-1.5 my-2">
            <div className="flex justify-between font-bold text-emerald-950">
              <span className="truncate pr-1">{hubName}</span>
              <span className="text-emerald-700 shrink-0">Inom radie ({radius}m)</span>
            </div>
            <p className="text-emerald-900 text-[11px] leading-relaxed">
              GPS-lokalisering bekräftad. Närvaro och deltagarlistan synkas automatiskt till loungen.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Automatisk incheckning</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('coworking')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            QR-skanner
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

// ==========================================
// 11. KUNSKAPSPROV & QUIZ WIDGET
// ==========================================
export const KnowledgeQuizWidget: React.FC<WidgetComponentProps> = ({ onNavigateTab }) => {
  return (
    <AdminInspect
      component="KnowledgeQuizWidget.tsx"
      sourceTable="Mock / Klient-State: courses / quiz"
      columns={['id', 'title', 'quiz_completed', 'badge_unlocked']}
      notes="Veckans kunskapsprov och verifierade certifikat"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Kunskapsbank & Quiz</h3>
                <p className="text-[10px] text-gray-500">Booster Badge & Certifiering</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              +50 BP
            </span>
          </div>

          <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-2xl space-y-1.5 my-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Veckans Kunskapsprov</span>
              <span className="text-[9px] font-black bg-[#800020] text-white px-1.5 py-0.5 rounded">
                AKTIVT
              </span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Genomför provet inom B2B Avtal & Pitching för att låsa upp verifierad badge i din profil.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">Tar ca 5 minuter</span>
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('academy')}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
          >
            Starta prov
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </AdminInspect>
  );
};

