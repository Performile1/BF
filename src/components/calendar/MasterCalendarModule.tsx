import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  Video, 
  Filter, 
  Download, 
  Check, 
  Sparkles, 
  Share2, 
  Lock, 
  Search, 
  Briefcase, 
  Flame, 
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Info,
  Layers,
  Award,
  CalendarDays,
  Grid,
  List,
  ArrowRight,
  Plus,
  Zap,
  UserCheck,
  Timer,
  CheckCircle2,
  Crown,
  Copy,
  Send,
  Gift,
  Tag,
  AlertCircle,
  Coffee,
  QrCode
} from 'lucide-react';
import { MasterCalendarEvent, Member, CalendarEventCategory, MembershipLevel } from '../../types';
import { PastEventsRecapView } from './PastEventsRecapView';
import { EventReviewModal } from './EventReviewModal';
import { CreateMemberEventModal } from './CreateMemberEventModal';
import { LunchInvitationModal } from './LunchInvitationModal';
import { AdBannerEngine } from '../ads/AdBannerEngine';
import { LinkedInShareButton } from '../common/LinkedInShareButton';
import { AdminInspect } from '../dev/AdminInspect';

interface MasterCalendarModuleProps {
  currentUser: Member;
  events?: MasterCalendarEvent[];
  allMembers?: Member[];
  onBookEvent: (eventId: string) => void;
  onCancelBooking: (eventId: string) => void;
  onBookSpeakerOneOnOne?: (eventId: string, slotTime: string) => void;
  onShareEventWithMember?: (eventId: string, targetMemberId: string, customNote?: string) => void;
  onInviteMemberFreeTicket?: (eventId: string, targetMemberId: string, guestName?: string, guestEmail?: string) => void;
  onAwardPoints?: (points: number, title: string, activityType: any, verificationMethod?: any) => void;
}

export const MasterCalendarModule: React.FC<MasterCalendarModuleProps> = ({
  currentUser,
  events = [],
  allMembers = [],
  onBookEvent,
  onCancelBooking,
  onBookSpeakerOneOnOne,
  onShareEventWithMember,
  onInviteMemberFreeTicket,
  onAwardPoints
}) => {
  const [selectedHubFilter, setSelectedHubFilter] = useState<'ALL' | 'MY_HUB' | 'STOCKHOLM' | 'GOTEBORG' | 'MALMO' | 'UPPSALA'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | CalendarEventCategory>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'PHYSICAL' | 'DIGITAL'>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | MembershipLevel>('ALL');
  const [onlyMyBookings, setOnlyMyBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<MasterCalendarEvent | null>(null);
  const [showIcsModal, setShowIcsModal] = useState(false);
  const [copiedIcsUrl, setCopiedIcsUrl] = useState(false);
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'CARDS' | 'TABLE'>('CALENDAR');

  // Speaker 1-on-1 bookings local state
  const [bookedSpeakerOneOnOne, setBookedSpeakerOneOnOne] = useState<Record<string, { slot: string; bookedAt: string }>>({});
  const [selectedSlotByEvent, setSelectedSlotByEvent] = useState<Record<string, string>>({});
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  // Share Event & Free Member Invites state
  const [shareModalEvent, setShareModalEvent] = useState<MasterCalendarEvent | null>(null);
  const [activeShareTab, setActiveShareTab] = useState<'LINK' | 'FREE_INVITE'>('LINK');
  const [copiedEventLink, setCopiedEventLink] = useState(false);
  const [selectedTargetMemberId, setSelectedTargetMemberId] = useState<string>('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [customShareNote, setCustomShareNote] = useState('');
  const [shareSuccessNotice, setShareSuccessNotice] = useState<string | null>(null);

  // Free guest invite form state
  const [inviteType, setInviteType] = useState<'MEMBER' | 'EXTERNAL'>('MEMBER');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCompany, setGuestCompany] = useState('');
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState<string | null>(null);

  // V9 Past Event, Community Expansion & Lunch states
  const [eventTimeTab, setEventTimeTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<MasterCalendarEvent | null>(null);
  const [showLunchModal, setShowLunchModal] = useState<{ attendee: any; event?: MasterCalendarEvent } | null>(null);
  const [localEvents, setLocalEvents] = useState<MasterCalendarEvent[]>(events);

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const handleLogOneOnOne = (attendee: any, event: MasterCalendarEvent) => {
    if (onAwardPoints) {
      onAwardPoints(20, `Loggat 1-till-1 möte med ${attendee.full_name}`, 'ONE_ON_ONE_LOGGED', 'TWO_WAY');
    }
    setBookingSuccessNotice(`☕ Loggat 1-till-1 möte med ${attendee.full_name} registrerat! +20 Booster Points har tilldelats.`);
    setTimeout(() => setBookingSuccessNotice(null), 5000);
  };

  const handleSubmitReview = (eventId: string, rating: number, reviewText: string) => {
    if (onAwardPoints) {
      onAwardPoints(20, `Eventrecension (${rating} stjärnor)`, 'EVENT_REVIEW_SUBMITTED', 'SYSTEM');
    }
    setLocalEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const newReview = {
          id: `rev_${Date.now()}`,
          member_id: currentUser.id,
          member_name: currentUser.full_name,
          member_avatar: currentUser.avatar,
          rating,
          review_text: reviewText,
          created_at: new Date().toISOString(),
          is_verified: true
        };
        const updatedReviews = [newReview, ...(e.event_reviews || [])];
        return {
          ...e,
          event_reviews: updatedReviews,
          reviews_count: updatedReviews.length
        };
      }
      return e;
    }));
    setBookingSuccessNotice(`⭐ Tack för ditt omdöme! +20 Booster Points har lagts till ditt saldo.`);
    setTimeout(() => setBookingSuccessNotice(null), 5000);
  };

  const handleCreateNewMemberEvent = (newEventData: Partial<MasterCalendarEvent>) => {
    const fullEvent = newEventData as MasterCalendarEvent;
    setLocalEvents(prev => [fullEvent, ...prev]);
    if (onAwardPoints) {
      onAwardPoints(30, `Arrangerat nätverksevent: ${fullEvent.title}`, 'EVENT_HOST_INITIATIVE', 'SYSTEM');
    }
    setBookingSuccessNotice(`🎉 Ditt event "${fullEvent.title}" har skapats och publicerats i Masterkalendern! +30 BP erhållet.`);
    setTimeout(() => setBookingSuccessNotice(null), 5000);
  };

  const handleSendLunchInvitation = (invitation: any) => {
    const points = invitation.host_pays ? 30 : 20;
    if (onAwardPoints) {
      onAwardPoints(points, `Lunchinbjudan till ${invitation.invitee_name}${invitation.host_pays ? ' (Du bjuder)' : ''}`, 'LUNCH_HOST_INVITE', 'TWO_WAY');
    }
    setBookingSuccessNotice(`🍽️ Lunchinbjudan skickad till ${invitation.invitee_name}! ${invitation.host_pays ? 'Eftersom du bjuder erhåller du +30 BP vid genomförande.' : '+20 BP vid genomförande.'}`);
    setTimeout(() => setBookingSuccessNotice(null), 5000);
  };

  // Auto open event from URL ?event=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventParam = params.get('event');
    if (eventParam && localEvents.length > 0) {
      const matched = localEvents.find(e => e.id === eventParam);
      if (matched) {
        setSelectedEvent(matched);
        setSelectedDateStr(matched.date_str);
      }
    }
  }, [localEvents]);

  const getUserFreeInvitesCount = (event: MasterCalendarEvent) => {
    return (event.invitations || []).filter(inv => inv.invited_by_id === currentUser.id).length;
  };

  const handleCopyEventLink = (event: MasterCalendarEvent) => {
    const url = `${window.location.origin}/calendar?event=${event.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedEventLink(true);
    setTimeout(() => setCopiedEventLink(false), 2500);
  };

  const handleSendLinkToMember = () => {
    if (!shareModalEvent || !selectedTargetMemberId) return;
    const target = allMembers.find(m => m.id === selectedTargetMemberId);
    if (!target) return;

    if (onShareEventWithMember) {
      onShareEventWithMember(shareModalEvent.id, selectedTargetMemberId, customShareNote);
    }

    setShareSuccessNotice(`Länk till "${shareModalEvent.title}" skickades till ${target.full_name} i chatten! (+10 BP erhållet)`);
    setTimeout(() => setShareSuccessNotice(null), 5000);
    setCustomShareNote('');
  };

  const handleConfirmFreeInvite = () => {
    if (!shareModalEvent) return;

    let targetId = '';
    let name = '';
    let email = '';

    if (inviteType === 'MEMBER') {
      if (!selectedTargetMemberId) return;
      const target = allMembers.find(m => m.id === selectedTargetMemberId);
      if (!target) return;
      targetId = target.id;
      name = target.full_name;
      email = target.city;
    } else {
      if (!guestName.trim()) return;
      name = guestName.trim();
      email = guestEmail.trim();
    }

    if (onInviteMemberFreeTicket) {
      onInviteMemberFreeTicket(shareModalEvent.id, targetId, name, email);
    }

    const price = shareModalEvent.price_sek || 1490;
    setInviteSuccessNotice(`🎉 VIP-Fribiljett bekräftad! ${name} är inbjuden till "${shareModalEvent.title}" (Ord. pris ${price.toLocaleString('sv-SE')} kr - 0 kr via ditt ${currentUser.membership_level === 'GOLD' ? 'Guld' : 'Silver'}medlemskap). Platsen är reserverad! (+25 BP)`);
    setTimeout(() => setInviteSuccessNotice(null), 6000);

    setGuestName('');
    setGuestEmail('');
    setGuestCompany('');
  };

  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      if (m.id === currentUser.id) return false;
      if (!memberSearchQuery.trim()) return true;
      const q = memberSearchQuery.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.company_name.toLowerCase().includes(q) ||
        m.role_title.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      );
    });
  }, [allMembers, currentUser.id, memberSearchQuery]);

  const handleBookOneOnOne = (eventId: string, slotTime?: string) => {
    const event = events.find(e => e.id === eventId);
    const speakerName = event?.speaker_one_on_one?.speaker_name || 'föreläsaren';
    const chosenSlot = slotTime || selectedSlotByEvent[eventId] || event?.speaker_one_on_one?.available_time_slots?.[0] || '10:00 - 10:30';

    setBookedSpeakerOneOnOne(prev => ({
      ...prev,
      [eventId]: { slot: chosenSlot, bookedAt: new Date().toISOString() }
    }));

    setBookingSuccessNotice(`Ditt 1-1 pass med ${speakerName} (${chosenSlot}) är bekräftat! En kalenderinbjudan och förberedelseformulär har skickats.`);
    setTimeout(() => setBookingSuccessNotice(null), 6000);

    if (onBookSpeakerOneOnOne) {
      onBookSpeakerOneOnOne(eventId, chosenSlot);
    }
  };

  // Calendar navigation state (default to September 2026 where events are set)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 1)); // September 2026 (0-indexed 8 = Sep)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-10'); // Default selected date

  const SWEDISH_MONTHS = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ];

  const SWEDISH_WEEKDAYS = [
    { short: 'Mån', full: 'Måndag' },
    { short: 'Tis', full: 'Tisdag' },
    { short: 'Ons', full: 'Onsdag' },
    { short: 'Tor', full: 'Torsdag' },
    { short: 'Fre', full: 'Fredag' },
    { short: 'Lör', full: 'Lördag' },
    { short: 'Sön', full: 'Söndag' },
  ];

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 8, 1));
    setSelectedDateStr('2026-09-10');
  };

  const formatDisplayDateSwedish = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const monthNames = [
      'januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december'
    ];
    return `${dayNames[dateObj.getDay()]} ${d} ${monthNames[m - 1]} ${y}`;
  };

  const getTierBadge = (level: MembershipLevel) => {
    switch (level) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'BRONZE':
      default:
        return 'bg-orange-100 text-orange-900 border-orange-200';
    }
  };

  const getCategoryBadge = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'SPEED_DATING':
        return { label: 'B2B Speed Dating', color: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 'HUB_MEETING':
        return { label: 'Hubbträff & Frukost', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'COWORKING_THEME':
        return { label: 'Coworking & Temadag', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'WEBINAR':
        return { label: 'Live Webinar & Q&A', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'ACADEMY_WORKSHOP':
        return { label: 'Akademi Workshop', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    }
  };

  const filteredEvents = useMemo(() => {
    return localEvents.filter(evt => {
      // Time tab filter (UPCOMING vs PAST)
      if (eventTimeTab === 'UPCOMING' && evt.is_past) return false;
      if (eventTimeTab === 'PAST' && !evt.is_past) return false;

      // Hub filter
      if (selectedHubFilter === 'MY_HUB' && evt.hub_id !== currentUser.hub_id && !evt.is_digital) return false;
      if (selectedHubFilter === 'STOCKHOLM' && evt.hub_id !== 'hub_stockholm' && !evt.is_digital) return false;
      if (selectedHubFilter === 'GOTEBORG' && evt.hub_id !== 'hub_goteborg' && !evt.is_digital) return false;
      if (selectedHubFilter === 'MALMO' && evt.hub_id !== 'hub_malmo' && !evt.is_digital) return false;
      if (selectedHubFilter === 'UPPSALA' && evt.hub_id !== 'hub_uppsala' && !evt.is_digital) return false;

      // Category
      if (categoryFilter !== 'ALL' && evt.category !== categoryFilter) return false;

      // Format
      if (formatFilter === 'PHYSICAL' && evt.is_digital) return false;
      if (formatFilter === 'DIGITAL' && !evt.is_digital) return false;

      // Tier
      if (tierFilter !== 'ALL' && evt.required_level !== tierFilter) return false;

      // My bookings
      if (onlyMyBookings && !evt.is_booked) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        const matchLoc = evt.location.toLowerCase().includes(q);
        const matchHost = evt.speaker_or_host?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchHost) return false;
      }

      return true;
    });
  }, [localEvents, eventTimeTab, selectedHubFilter, categoryFilter, formatFilter, tierFilter, onlyMyBookings, searchQuery, currentUser.hub_id]);

  // Group filtered events by date_str (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, MasterCalendarEvent[]>();
    filteredEvents.forEach(evt => {
      const list = map.get(evt.date_str) || [];
      list.push(evt);
      map.set(evt.date_str, list);
    });
    return map;
  }, [filteredEvents]);

  // Booked upcoming events for the sidebar widget
  const myBookedUpcomingEvents = useMemo(() => {
    return localEvents.filter(e => e.is_booked && !e.is_past);
  }, [localEvents]);

  // Next upcoming speed dating event for highlight widget
  const nextSpeedDatingEvent = useMemo(() => {
    return localEvents.find(e => e.category === 'SPEED_DATING' && !e.is_past);
  }, [localEvents]);

  // Generate complete calendar grid (Monday - Sunday) for current month view
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month
    const firstDay = new Date(year, month, 1);
    // In JS getDay() returns 0 for Sunday, 1 for Monday...
    // We adjust so Monday = 0, Tuesday = 1, ..., Sunday = 6
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Preceding days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        // Match September 6, 2026 or today's date
        isToday: dateStr === '2026-09-06' || dateStr === new Date().toISOString().split('T')[0],
      });
    }

    // Next month trailing days to complete full 7-day rows
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentDate]);

  const handleDownloadIcs = (event: MasterCalendarEvent) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Booster Friends//Master Network Calendar//SE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@boosterfriends.se`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:Booster Friends: ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\\n\\nVärd: ${event.speaker_or_host || 'Booster Friends'}\\nPlats: ${event.location}`,
      `LOCATION:${event.location}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}_booster_event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySubscriptionLink = () => {
    navigator.clipboard?.writeText(`https://boosterfriends.se/api/v1/calendar/feed?token=bf_live_user_${currentUser.id}.ics`);
    setCopiedIcsUrl(true);
    setTimeout(() => setCopiedIcsUrl(false), 2500);
  };

  return (
    <AdminInspect
      component="MasterCalendarModule.tsx"
      sourceTable="public.calendar_events / event_attendees / lunch_invitations"
      columns={['id', 'title', 'start_time', 'end_time', 'location', 'spots_max', 'attendees_count', 'is_booked']}
      notes="Masterkalendern, bokning av träffar, iCal-export och 1-till-1 möten"
    >
      <div className="space-y-6">
      {/* Top Banner: Masterkalender Overview */}
      <div className="bg-gradient-to-r from-[#800020] via-[#5c0017] to-[#3b000f] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Master Kravspecifikation V6 • Centralized Network Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Masterkalendern
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-200 leading-relaxed">
            Allt som händer i Booster Friends-nätverket samlat i en interaktiv vy. Utforska fysiska hubbträffar, live webinars, coworking-sprintar och certifierande workshops med deltagaröversikt och live iCal-synk.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowIcsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#800020] font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Synka med Google/Apple Kalender (ICS)</span>
            </button>
            <div className="text-xs text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{events.filter(e => e.is_booked).length} bokade event i din kalender</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Success Notice */}
      {bookingSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{bookingSuccessNotice}</span>
          </div>
          <button 
            onClick={() => setBookingSuccessNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 p-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Tab Switcher: Kommande Event vs Genomförda Event (Recap & Mingelbilder) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setEventTimeTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              eventTimeTab === 'UPCOMING'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Kommande Evenemang ({localEvents.filter(e => !e.is_past).length})</span>
          </button>
          <button
            onClick={() => setEventTimeTab('PAST')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              eventTimeTab === 'PAST'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Genomförda Träffar & Recaps ({localEvents.filter(e => e.is_past).length})</span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateEventModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Skapa Medlemsevent</span>
        </button>
      </div>

      {/* When Past Events Tab is active */}
      {eventTimeTab === 'PAST' && (
        <PastEventsRecapView
          currentUser={currentUser}
          pastEvents={localEvents.filter(e => e.is_past)}
          allMembers={allMembers}
          onOpenReviewModal={(evt) => setShowReviewModal(evt)}
          onOpenLunchModal={(att, evt) => setShowLunchModal({ attendee: att, event: evt })}
          onLogOneOnOne={handleLogOneOnOne}
          onUploadPhoto={(evt) => {
            setBookingSuccessNotice(`📸 Fotouppladdning för "${evt.title}" aktiverad! Ladda upp din bild så krediteras +10 BP.`);
            setTimeout(() => setBookingSuccessNotice(null), 5000);
          }}
        />
      )}

      {/* When Upcoming Events Tab is active */}
      {eventTimeTab === 'UPCOMING' && (
        <>
          {/* Filter and Control Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Sök träffar, föreläsare, ämne eller stad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#800020]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setOnlyMyBookings(!onlyMyBookings)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                onlyMyBookings
                  ? 'bg-[#800020] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mina Bokningar ({events.filter(e => e.is_booked).length})</span>
            </button>

            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('CALENDAR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'CALENDAR' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visa kalendermånad med klickbara eventkort"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Månadskalender</span>
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'CARDS' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Visa alla event i kortrutnät"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Kortvy</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'TABLE' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Kompakt tabellista"
              >
                <List className="w-3.5 h-3.5" />
                <span>Listvy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
          {/* Hub filter */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Hubb & Stad
            </label>
            <select
              value={selectedHubFilter}
              onChange={(e) => setSelectedHubFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-800 bg-white"
            >
              <option value="ALL">Alla Hubbar & Digitalt</option>
              <option value="MY_HUB">Min Hubb ({currentUser.hub_name})</option>
              <option value="STOCKHOLM">Hubb Stockholm City</option>
              <option value="GOTEBORG">Hubb Göteborg Avenyn</option>
              <option value="MALMO">Hubb Malmö Dockan</option>
              <option value="UPPSALA">Hubb Uppsala Innovation</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-800 bg-white"
            >
              <option value="ALL">Alla Kategorier</option>
              <option value="SPEED_DATING">⚡ B2B Speed Dating (Snabbmöten)</option>
              <option value="HUB_MEETING">Fysiska Hubbträffar</option>
              <option value="COWORKING_THEME">Coworking & Säljsprint</option>
              <option value="WEBINAR">Digitala Webinars</option>
              <option value="ACADEMY_WORKSHOP">Akademi Workshops</option>
            </select>
          </div>

          {/* Format filter */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Format
            </label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-800 bg-white"
            >
              <option value="ALL">Alla Format</option>
              <option value="PHYSICAL">Fysiska Möten på Plats</option>
              <option value="DIGITAL">Digital Livestream / Zoom</option>
            </select>
          </div>

          {/* Level requirement */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Krävd Nivå
            </label>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-800 bg-white"
            >
              <option value="ALL">Alla Medlemsnivåer</option>
              <option value="BRONZE">Brons (Öppet för alla)</option>
              <option value="SILVER">Silver & Guld</option>
              <option value="GOLD">Exklusivt Guld</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content & Dedicated 3-Column Layout: Kalender | Mina Inbokade | Reklam Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Calendar Views & Events (lg:col-span-12 xl:col-span-6) */}
        <div className="lg:col-span-12 xl:col-span-6 space-y-6 min-w-0">
          {/* Events Results Count & Quick Filter Reset */}
          <div className="flex items-center justify-between text-xs text-gray-500 px-1 py-1">
            <span>Visar {filteredEvents.length} av {events.length} nätverksevenemang</span>
            {(selectedHubFilter !== 'ALL' || categoryFilter !== 'ALL' || formatFilter !== 'ALL' || tierFilter !== 'ALL' || onlyMyBookings || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedHubFilter('ALL');
                  setCategoryFilter('ALL');
                  setFormatFilter('ALL');
                  setTierFilter('ALL');
                  setOnlyMyBookings(false);
                  setSearchQuery('');
                }}
                className="text-[#800020] hover:underline font-bold"
              >
                Återställ alla filter
              </button>
            )}
          </div>

      {/* View 1: Månadskalender (Interactive Month Calendar View) */}
      {viewMode === 'CALENDAR' && (
        <div className="space-y-6">
          {/* Calendar Month Navigation Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    {SWEDISH_MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-200 text-xs font-bold">
                    {filteredEvents.filter(e => {
                      const [y, m] = e.date_str.split('-').map(Number);
                      return y === currentDate.getFullYear() && m === (currentDate.getMonth() + 1);
                    }).length} event denna månad
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Klicka på ett event eller ett datum i kalendern för att visa och boka eventkortet.
                </p>
              </div>
            </div>

            {/* Navigation Buttons and Today shortcut */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition flex items-center gap-1 text-xs font-bold"
                title="Föregående månad"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Föregående</span>
              </button>

              <button
                onClick={goToToday}
                className="px-3 py-2 rounded-xl border border-[#800020]/30 text-[#800020] bg-rose-50/50 hover:bg-rose-50 text-xs font-bold transition"
                title="Gå till aktuell månad (Sep 2026)"
              >
                Aktuell månad
              </button>

              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition flex items-center gap-1 text-xs font-bold"
                title="Nästa månad"
              >
                <span className="hidden sm:inline">Nästa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Color Legend Bar */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-[11px] font-medium text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Färgkoder:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>B2B Speed Dating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Fysiska Hubbträffar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Coworking & Sprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Digitala Webinars</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Akademi Workshops</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px] border border-amber-300">1:1</span>
              <span>Köp till 1-1 efter event</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-[#800020] font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bokade markeras med grön bock</span>
            </div>
          </div>

          {/* Monthly Calendar Grid */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            {/* Weekday Column Headers (Mon-Sun) */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center py-2.5 text-xs font-bold text-gray-700">
              {SWEDISH_WEEKDAYS.map((wd, i) => (
                <div key={wd.short} className={i >= 5 ? 'text-gray-400' : 'text-gray-800'}>
                  <span className="hidden sm:inline">{wd.full}</span>
                  <span className="sm:hidden">{wd.short}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {calendarDays.map((day) => {
                const dayEvents = eventsByDate.get(day.dateStr) || [];
                const isSelected = selectedDateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedDateStr(day.dateStr);
                      if (dayEvents.length === 1) {
                        setSelectedEvent(dayEvents[0]);
                      }
                    }}
                    className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors relative cursor-pointer group ${
                      !day.isCurrentMonth
                        ? 'bg-gray-50/50 text-gray-300'
                        : isSelected
                        ? 'bg-rose-50/30 ring-2 ring-inset ring-[#800020]'
                        : 'bg-white hover:bg-gray-50/70'
                    }`}
                  >
                    {/* Top Row: Date Number & Badges */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-xs font-bold inline-flex items-center justify-center rounded-full transition ${
                          day.isToday
                            ? 'w-6 h-6 bg-[#800020] text-white shadow-xs'
                            : !day.isCurrentMonth
                            ? 'text-gray-300'
                            : isSelected
                            ? 'text-[#800020] font-extrabold'
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}
                      >
                        {day.dayNum}
                      </span>

                      {dayEvents.length > 0 && (
                        <div className="flex items-center gap-1">
                          {dayEvents.some(e => e.is_booked) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" title="Du har en bokad träff denna dag" />
                          )}
                          <span className="text-[10px] font-bold text-[#800020] bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full">
                            {dayEvents.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Day Events Stack (Interactive Cards inside day) */}
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const catBadge = getCategoryBadge(evt.category);
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                              setSelectedDateStr(day.dateStr);
                            }}
                            className={`p-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer shadow-2xs hover:shadow-xs group/card hover:scale-[1.02] flex items-center justify-between gap-1 ${
                              evt.is_booked
                                ? 'bg-rose-50 text-[#800020] border-[#800020]/30 ring-1 ring-[#800020]/20 font-bold'
                                : `${catBadge.color} hover:border-gray-300`
                            }`}
                            title={`${evt.title} (${evt.start_time} - ${evt.end_time}) • Klicka för att öppna kort`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {evt.category === 'SPEED_DATING' ? (
                                <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                              ) : evt.is_digital ? (
                                <Video className="w-3 h-3 text-purple-600 shrink-0" />
                              ) : (
                                <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                              )}
                              <span className="font-bold text-[10px] shrink-0 text-gray-900">
                                {evt.start_time}
                              </span>
                              <span className="truncate text-gray-800 group-hover/card:text-gray-900">
                                {evt.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {evt.speaker_one_on_one?.enabled && (
                                <span 
                                  className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-black shrink-0"
                                  title="1-1 session med föreläsaren möjlig efter eventet"
                                >
                                  1:1
                                </span>
                              )}
                              {evt.is_booked && (
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDateStr(day.dateStr);
                          }}
                          className="w-full text-center text-[10px] font-bold text-gray-500 hover:text-[#800020] py-0.5 hover:bg-gray-100 rounded transition"
                        >
                          +{dayEvents.length - 2} fler träffar...
                        </button>
                      )}
                    </div>

                    {/* Subtle click cue */}
                    {dayEvents.length > 0 && (
                      <div className="text-[9px] text-gray-400 mt-1 flex items-center justify-end group-hover:text-[#800020] transition">
                        <span>Visa kort →</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Event Cards Section (Shows cards when user clicks a day in the calendar) */}
          {selectedDateStr && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#800020] text-white flex items-center justify-center font-bold shadow-xs">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Evenemangskort: {formatDisplayDateSwedish(selectedDateStr)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {(eventsByDate.get(selectedDateStr) || []).length === 0
                        ? 'Inga schemalagda aktiviteter på detta datum'
                        : `${(eventsByDate.get(selectedDateStr) || []).length} aktivitet(er) inbokade denna dag. Klicka på ett kort för komplett gästlista och bokningsdetaljer.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Jump to next date with event
                      const nextEvt = filteredEvents.find(e => e.date_str > selectedDateStr) || filteredEvents[0];
                      if (nextEvt) {
                        setSelectedDateStr(nextEvt.date_str);
                        setSelectedEvent(nextEvt);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center gap-1"
                  >
                    <span>Nästa aktivitet</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Day Event Cards Grid */}
              {(eventsByDate.get(selectedDateStr) || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(eventsByDate.get(selectedDateStr) || []).map(evt => {
                    const catBadge = getCategoryBadge(evt.category);
                    const isFull = evt.attendees_count >= evt.spots_max;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer hover:border-[#800020]/40 ${
                          evt.is_booked ? 'border-[#800020]/40 ring-2 ring-[#800020]/10 bg-rose-50/10' : 'border-gray-200'
                        }`}
                      >
                        <div className="p-5">
                          {/* Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${catBadge.color}`}>
                              {catBadge.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {evt.is_booked && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Bokad
                                </span>
                              )}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierBadge(evt.required_level)}`}>
                                {evt.required_level}
                              </span>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2 text-xs font-bold text-[#800020] mb-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{evt.display_date} • {evt.start_time} - {evt.end_time}</span>
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-gray-900 text-base leading-snug mb-2 hover:text-[#800020] transition">
                            {evt.title}
                          </h4>

                          {/* Description snippet */}
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                            {evt.description}
                          </p>

                          {/* Speed Dating Highlight Box */}
                          {evt.category === 'SPEED_DATING' && evt.speed_dating_details && (
                            <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-950 text-xs">
                              <div className="flex items-center justify-between gap-1 font-bold">
                                <span className="flex items-center gap-1 text-amber-800">
                                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                                  {evt.speed_dating_details.rounds_count} ronder à {evt.speed_dating_details.minutes_per_round} min
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 font-bold">
                                  AI-matchat
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-800/90 mt-1 leading-snug">
                                {evt.speed_dating_details.matching_algorithm}
                              </p>
                            </div>
                          )}

                          {/* Speaker 1-1 Add-on Box */}
                          {evt.speaker_one_on_one?.enabled && (
                            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/70 to-rose-50/50 border border-amber-200/70">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded-md bg-[#800020] text-white font-black text-[10px]">
                                    1:1
                                  </span>
                                  <span className="text-xs font-bold text-gray-900">
                                    1-1 med föreläsaren ({evt.speaker_one_on_one.duration_minutes} min)
                                  </span>
                                </div>
                                <span className="text-xs font-extrabold text-[#800020] bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                                  {evt.speaker_one_on_one.price_sek.toLocaleString('sv-SE')} kr
                                </span>
                              </div>

                              <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2">
                                {evt.speaker_one_on_one.description}
                              </p>

                              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-amber-200/50 text-[11px]">
                                <span className="text-gray-500 font-medium">
                                  {evt.speaker_one_on_one.total_slots - evt.speaker_one_on_one.booked_slots - (bookedSpeakerOneOnOne[evt.id] ? 1 : 0)} av {evt.speaker_one_on_one.total_slots} platser kvar
                                </span>

                                {bookedSpeakerOneOnOne[evt.id] ? (
                                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px]">
                                    <Check className="w-3 h-3 text-emerald-600" /> 1-1 Bokad ({bookedSpeakerOneOnOne[evt.id].slot})
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBookOneOnOne(evt.id);
                                    }}
                                    className="font-bold text-[#800020] hover:text-white bg-rose-50 hover:bg-[#800020] border border-rose-200 px-2.5 py-1 rounded-lg transition text-[11px]"
                                  >
                                    + Boka 1-1 Session
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Location & Host */}
                          <div className="space-y-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {evt.is_digital ? (
                                <>
                                  <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span className="truncate text-purple-900 font-medium">Digital Stream & Live Q&A</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  <span className="truncate text-gray-800">{evt.location}</span>
                                </>
                              )}
                            </div>

                            {evt.speaker_or_host && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">Värd: {evt.speaker_or_host}</span>
                              </div>
                            )}
                          </div>

                          {/* Attendees preview */}
                          <div className="mt-4 p-2.5 rounded-xl bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2 overflow-hidden">
                                {evt.attendees.slice(0, 3).map((att) => (
                                  <img
                                    key={att.id}
                                    src={att.avatar}
                                    alt={att.full_name}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-gray-700">
                                {evt.attendees_count} anmälda
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-[#800020] hover:underline">
                              Visa deltagare →
                            </span>
                          </div>
                        </div>

                        {/* Card bottom buttons */}
                        <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadIcs(evt);
                            }}
                            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition"
                            title="Ladda ner iCal (.ics) för Google/Apple Kalender"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2">
                            {evt.is_booked ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancelBooking(evt.id);
                                }}
                                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition"
                              >
                                Avboka
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookEvent(evt.id);
                                }}
                                disabled={isFull}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 ${
                                  isFull
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#800020] hover:bg-[#5a0016] text-white'
                                }`}
                              >
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span>{isFull ? 'Fullbokat' : 'Boka plats (+30 BP)'}</span>
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                              }}
                              className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition"
                            >
                              Kortdetaljer
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 px-4 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">
                    Inga evenemang inbokade den {formatDisplayDateSwedish(selectedDateStr)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    Klicka på ett datum med markeringar i kalendermånaden ovan (t.ex. 4, 8, 10, 11, 15, 17, 18, 22, 24 eller 29 september) för att visa eventkort och säkra din plats.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDateStr('2026-09-10');
                      const evt = filteredEvents.find(e => e.date_str === '2026-09-10');
                      if (evt) setSelectedEvent(evt);
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5a0016] transition shadow-xs"
                  >
                    Gå till Stora Booster-Frukosten (10 Sep) →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* View 2: Cards View */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map(evt => {
            const catBadge = getCategoryBadge(evt.category);
            const isFull = evt.attendees_count >= evt.spots_max;

            return (
              <div
                key={evt.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  evt.is_booked ? 'border-[#800020]/40 ring-2 ring-[#800020]/10' : 'border-gray-200'
                }`}
              >
                <div className="p-5">
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${catBadge.color}`}>
                      {catBadge.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierBadge(evt.required_level)}`}>
                      {evt.required_level}
                    </span>
                  </div>

                  {/* Date and Time Header */}
                  <div className="flex items-center gap-2 text-xs font-bold text-[#800020] mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.display_date} • {evt.start_time} - {evt.end_time}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 hover:text-[#800020] transition cursor-pointer" onClick={() => setSelectedEvent(evt)}>
                    {evt.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {evt.description}
                  </p>

                  {/* Speed Dating Highlight Box */}
                  {evt.category === 'SPEED_DATING' && evt.speed_dating_details && (
                    <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-950 text-xs">
                      <div className="flex items-center justify-between gap-1 font-bold">
                        <span className="flex items-center gap-1 text-amber-800">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          {evt.speed_dating_details.rounds_count} ronder à {evt.speed_dating_details.minutes_per_round} min
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 font-bold">
                          AI-matchat
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 mt-1 leading-snug">
                        {evt.speed_dating_details.matching_algorithm}
                      </p>
                    </div>
                  )}

                  {/* Speaker 1-1 Add-on Box */}
                  {evt.speaker_one_on_one?.enabled && (
                    <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/70 to-rose-50/50 border border-amber-200/70">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-md bg-[#800020] text-white font-black text-[10px]">
                            1:1
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            1-1 med föreläsaren ({evt.speaker_one_on_one.duration_minutes} min)
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#800020] bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                          {evt.speaker_one_on_one.price_sek.toLocaleString('sv-SE')} kr
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2">
                        {evt.speaker_one_on_one.description}
                      </p>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-amber-200/50 text-[11px]">
                        <span className="text-gray-500 font-medium">
                          {evt.speaker_one_on_one.total_slots - evt.speaker_one_on_one.booked_slots - (bookedSpeakerOneOnOne[evt.id] ? 1 : 0)} av {evt.speaker_one_on_one.total_slots} platser kvar
                        </span>

                        {bookedSpeakerOneOnOne[evt.id] ? (
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px]">
                            <Check className="w-3 h-3 text-emerald-600" /> 1-1 Bokad ({bookedSpeakerOneOnOne[evt.id].slot})
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookOneOnOne(evt.id);
                            }}
                            className="font-bold text-[#800020] hover:text-white bg-rose-50 hover:bg-[#800020] border border-rose-200 px-2.5 py-1 rounded-lg transition text-[11px]"
                          >
                            + Boka 1-1 Session
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location / Host */}
                  <div className="space-y-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {evt.is_digital ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate text-purple-900 font-medium">Digital Stream & Q&A</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </>
                      )}
                    </div>

                    {evt.speaker_or_host && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">Värd: {evt.speaker_or_host}</span>
                      </div>
                    )}
                  </div>

                  {/* Attendees sneak peek */}
                  <div 
                    onClick={() => setSelectedEvent(evt)}
                    className="mt-4 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {evt.attendees.slice(0, 3).map((att) => (
                          <img
                            key={att.id}
                            src={att.avatar}
                            alt={att.full_name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {evt.attendees_count} / {evt.spots_max} anmälda
                      </span>
                    </div>
                    <span className="text-[11px] text-[#800020] font-bold flex items-center gap-0.5">
                      Visa ({evt.attendees_count}) <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center gap-2">
                  {evt.is_booked ? (
                    <>
                      <div className="flex-1 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bokad i din kalender</span>
                      </div>
                      <button
                        onClick={() => handleDownloadIcs(evt)}
                        title="Ladda ner iCal (.ics) för denna träff"
                        className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onCancelBooking(evt.id)}
                        className="px-2.5 py-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                      >
                        Avboka
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onBookEvent(evt.id)}
                        disabled={isFull}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2 ${
                          isFull
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#800020] text-white hover:bg-[#5a0016]'
                        }`}
                      >
                        {isFull ? (
                          <span>Fullbokat</span>
                        ) : (
                          <>
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>1-Klicksbokning</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-100 transition"
                      >
                        Detaljer
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Datum & Tid</th>
                  <th className="py-3.5 px-4">Evenemang</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Plats / Hubb</th>
                  <th className="py-3.5 px-4">Platser</th>
                  <th className="py-3.5 px-4">Nivå</th>
                  <th className="py-3.5 px-4 text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map(evt => {
                  const catBadge = getCategoryBadge(evt.category);
                  return (
                    <tr key={evt.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        <div className="text-[#800020]">{evt.display_date}</div>
                        <div className="text-[11px] text-gray-500 font-normal">{evt.start_time} - {evt.end_time}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div 
                          className="font-bold text-gray-900 hover:text-[#800020] cursor-pointer"
                          onClick={() => setSelectedEvent(evt)}
                        >
                          {evt.title}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">{evt.speaker_or_host && `Värd: ${evt.speaker_or_host}`}</div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          {evt.category === 'SPEED_DATING' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                              <Zap className="w-2.5 h-2.5 text-amber-600" /> Speed Dating
                            </span>
                          )}
                          {evt.speaker_one_on_one?.enabled && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#800020] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              ⭐ 1-1 Tillval ({evt.speaker_one_on_one.price_sek.toLocaleString('sv-SE')} kr)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${catBadge.color}`}>
                          {catBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                        {evt.is_digital ? 'Digital Livestream' : evt.hub_name || evt.location}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-gray-700">
                        {evt.attendees_count} / {evt.spots_max}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTierBadge(evt.required_level)}`}>
                          {evt.required_level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {evt.is_booked ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Bokad
                            </span>
                            <button
                              onClick={() => handleDownloadIcs(evt)}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                              title="Ladda ner ICS"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onBookEvent(evt.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#800020] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#5a0016]"
                          >
                            Boka
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>

        {/* Column 2: Mina Inbokade Träffar & Aktiviteter */}
        <aside className="lg:col-span-6 xl:col-span-3 space-y-5 lg:sticky lg:top-24">
          {/* 📅 Mina Inbokade Träffar Widget */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Mina Inbokade Träffar</h4>
                  <p className="text-[10px] text-gray-400">Säkrar +30 BP vid närvaro</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-200 text-[10px] font-black">
                {myBookedUpcomingEvents.length} bokade
              </span>
            </div>

            {myBookedUpcomingEvents.length > 0 ? (
              <div className="space-y-2.5">
                {myBookedUpcomingEvents.slice(0, 4).map((evt) => {
                  const catBadge = getCategoryBadge(evt.category);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => {
                        setSelectedDateStr(evt.date_str);
                        setSelectedEvent(evt);
                      }}
                      className="p-3 rounded-xl border border-gray-100 hover:border-gray-300 bg-gray-50/70 hover:bg-white transition cursor-pointer group space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${catBadge.color}`}>
                          {catBadge.label}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#800020]">
                          <Clock className="w-3 h-3" />
                          <span>{evt.display_date || evt.date_str} • {evt.start_time}</span>
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-gray-900 leading-snug group-hover:text-[#800020] transition line-clamp-1">
                        {evt.title}
                      </h5>

                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-gray-200/50 text-[10px] text-gray-500">
                        <span className="truncate flex items-center gap-1">
                          {evt.is_digital ? (
                            <Video className="w-3 h-3 text-purple-600 shrink-0" />
                          ) : (
                            <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                          )}
                          <span className="truncate">{evt.location}</span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadIcs(evt);
                            }}
                            className="text-gray-400 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition"
                            title="Ladda ner ICS kalenderfil"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelBooking(evt.id);
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition text-[10px] font-bold"
                            title="Avboka plats"
                          >
                            Avboka
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {myBookedUpcomingEvents.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setOnlyMyBookings(true)}
                    className="w-full text-center text-[11px] font-bold text-[#800020] hover:underline py-1"
                  >
                    Visa alla {myBookedUpcomingEvents.length} bokade →
                  </button>
                )}
              </div>
            ) : (
              <div className="py-4 px-2 text-center space-y-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Du har inga inbokade träffar just nu.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const firstEvt = filteredEvents[0];
                    if (firstEvt) {
                      setSelectedDateStr(firstEvt.date_str);
                      setSelectedEvent(firstEvt);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#800020] text-white text-[11px] font-bold hover:bg-[#660018] transition inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Hitta ett event att boka</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* ⚡ Nästa Speed Dating Widget */}
          {nextSpeedDatingEvent && (
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/40 rounded-2xl border border-amber-200 p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between gap-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>Nästa B2B Speed Dating</span>
                </span>
                <span className="text-[10px] font-bold text-amber-800">
                  {nextSpeedDatingEvent.display_date || nextSpeedDatingEvent.date_str}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-950 leading-snug">
                  {nextSpeedDatingEvent.title}
                </h4>
                <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                  {nextSpeedDatingEvent.speed_dating_details?.rounds_count || 10} strukturerade 1-1 snabbmöten med AI-matchade affärskontakter.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200/70">
                <span className="text-[10px] text-amber-900 font-bold">
                  {nextSpeedDatingEvent.attendees_count}/{nextSpeedDatingEvent.spots_max} anmälda
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDateStr(nextSpeedDatingEvent.date_str);
                    setSelectedEvent(nextSpeedDatingEvent);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition shadow-2xs flex items-center gap-1"
                >
                  <span>{nextSpeedDatingEvent.is_booked ? 'Visa detaljer' : 'Säkra plats'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* 🔄 Kalendersynk & QR Incheckning Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Synka med din kalender</h4>
                <p className="text-[10px] text-gray-400">Google, Apple, Outlook (.ics)</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 leading-relaxed">
              Få alla dina inbokade nätverksträffar direkt i din jobbkalender med automatisk uppdatering.
            </p>

            <button
              type="button"
              onClick={() => setShowIcsModal(true)}
              className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#800020]" />
              <span>Konfigurera Kalender-feed (.ics)</span>
            </button>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] text-gray-600 flex items-start gap-2">
              <QrCode className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
              <span>
                <strong>Incheckning på plats:</strong> Visa ditt QR ID i dörren eller skanna hubbens QR-kod för att automatiskt logga närvaro och erhålla +30 BP.
              </span>
            </div>
          </div>
        </aside>

        {/* Column 3: Dedicated Reklam Banners & Sponsrade Partners (Placerad bredvid mina inbokade träffar) */}
        <aside className="lg:col-span-6 xl:col-span-3 space-y-5 lg:sticky lg:top-24">
          {/* Kolumntitel & Sponsringsindikator */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sponsrade Partners</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Annonser
            </span>
          </div>

          {/* 📢 Sponsrad Partner Banner Engine (CALENDAR_SIDEBAR) */}
          <AdBannerEngine
            zone="CALENDAR_SIDEBAR"
            isAdmin={currentUser.membership_level === 'GOLD' || !!currentUser.is_admin}
          />

          {/* 💼 Boka Annonsplats & Nå Beslutsfattare */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-4 shadow-xs space-y-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Annonsera i Kalendern</span>
              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-gray-200">B2B Nätverk</span>
            </div>
            <h4 className="text-xs font-bold leading-snug">
              Nå 1 500+ beslutsfattare och grundare i Booster Friends
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Visa ert erbjudande direkt vid eventbokningar. Garanterad räckvidd till aktiva entreprenörer och chefer.
            </p>
            <a
              href="mailto:partner@boosterfriends.se?subject=Förfrågan%20Annonsplats%20Booster%20Kalender"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold rounded-xl transition shadow-2xs"
            >
              <span>Bli Sponsrad Partner</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* 🎁 Exklusiv Medlemsrabatt Partner-box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Partnerförmån</h4>
                <p className="text-[10px] text-gray-400">Exklusivt för medlemmar</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              20% medlemsrabatt på externa mötesrum och eventlokaler hos Convendum och Helio Workspace.
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono font-bold text-[#800020] bg-rose-50 border border-rose-200 px-2 py-1 rounded-md inline-block">
                RABATTKOD: BOOSTER2026
              </span>
            </div>
          </div>
        </aside>
      </div>
      </>
      )}

      {/* Event Details & Attendees Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadge(selectedEvent.category).color}`}>
                    {getCategoryBadge(selectedEvent.category).label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierBadge(selectedEvent.required_level)}`}>
                    Kräver {selectedEvent.required_level}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {selectedEvent.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold text-[#800020] mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedEvent.display_date} • {selectedEvent.start_time} - {selectedEvent.end_time}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>{selectedEvent.description}</p>
              <div className="pt-2 border-t border-gray-200 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#800020]" />
                  <span>{selectedEvent.location}</span>
                </div>
                {selectedEvent.speaker_or_host && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>Värd / Talare: {selectedEvent.speaker_or_host}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Speed Dating Mechanics (if speed dating event) */}
            {selectedEvent.category === 'SPEED_DATING' && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/50 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-amber-950">Booster B2B Speed Dating Format</h3>
                      <p className="text-[11px] text-amber-800">Strukturerade 1-1 snabbmöten designade för maximal affärsnytta</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-200/70 text-amber-900 text-xs font-black">
                    {selectedEvent.speed_dating_details?.rounds_count || 10} Möten garanterat
                  </span>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                    <div className="font-black text-amber-900 text-base">
                      {selectedEvent.speed_dating_details?.rounds_count || 10}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold uppercase">Omgångar</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                    <div className="font-black text-amber-900 text-base">
                      {selectedEvent.speed_dating_details?.minutes_per_round || 6} min
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold uppercase">Per Samtal</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                    <div className="font-black text-amber-900 text-base">AI</div>
                    <div className="text-[10px] text-amber-700 font-semibold uppercase">Matchat Schema</div>
                  </div>
                </div>

                {/* How it works 3 steps */}
                <div className="space-y-2 text-xs text-amber-950 pt-2 border-t border-amber-200/60">
                  <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Så går träffen till:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white/60 border border-amber-200/40">
                      <div className="font-bold text-amber-900 text-[11px] mb-1">1. Smart matchning</div>
                      <p className="text-[10px] text-amber-800 leading-snug">
                        Ditt personliga bordsschema matchas efter vad du söker och vad du erbjuder.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/60 border border-amber-200/40">
                      <div className="font-bold text-amber-900 text-[11px] mb-1">2. 3+3 minuter</div>
                      <p className="text-[10px] text-amber-800 leading-snug">
                        Klockan ringer efter 3 min för talarbyte så båda hinner presentera sina synergier.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/60 border border-amber-200/40">
                      <div className="font-bold text-amber-900 text-[11px] mb-1">3. Direkt vCard-synk</div>
                      <p className="text-[10px] text-amber-800 leading-snug">
                        Spara mötesanteckningar och kontaktuppgifter direkt i din Booster CRM-pipeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exclusive Speaker 1-on-1 Add-on Section */}
            {selectedEvent.speaker_one_on_one?.enabled && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-amber-50/50 to-white border-2 border-amber-300/80 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {selectedEvent.speaker_one_on_one.speaker_avatar ? (
                      <img 
                        src={selectedEvent.speaker_one_on_one.speaker_avatar} 
                        alt={selectedEvent.speaker_one_on_one.speaker_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                        1:1
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#800020] text-white text-[10px] font-black tracking-wider uppercase">
                          Exklusivt Tillval
                        </span>
                        <span className="text-xs font-bold text-amber-900">
                          {selectedEvent.speaker_one_on_one.duration_minutes} minuter privat rådgivning
                        </span>
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base mt-0.5">
                        Köp till 1-1 med {selectedEvent.speaker_one_on_one.speaker_name}
                      </h3>
                      {selectedEvent.speaker_one_on_one.speaker_title && (
                        <p className="text-xs text-gray-500">{selectedEvent.speaker_one_on_one.speaker_title}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-[#800020]">
                      {selectedEvent.speaker_one_on_one.price_sek.toLocaleString('sv-SE')} kr
                    </div>
                    <div className="text-[10px] text-gray-400">exkl. moms</div>
                  </div>
                </div>

                <p className="text-xs text-gray-700 bg-white/80 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                  {selectedEvent.speaker_one_on_one.description}
                </p>

                {/* Available time slot selection */}
                {selectedEvent.speaker_one_on_one.available_time_slots && (
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1.5 flex items-center justify-between">
                      <span>Välj tid direkt efter eventet:</span>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        {selectedEvent.speaker_one_on_one.total_slots - selectedEvent.speaker_one_on_one.booked_slots - (bookedSpeakerOneOnOne[selectedEvent.id] ? 1 : 0)} av {selectedEvent.speaker_one_on_one.total_slots} platser kvar
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.speaker_one_on_one.available_time_slots.map(slot => {
                        const isCurrentSlot = (selectedSlotByEvent[selectedEvent.id] || selectedEvent.speaker_one_on_one?.available_time_slots?.[0]) === slot;
                        const isBookedThisSlot = bookedSpeakerOneOnOne[selectedEvent.id]?.slot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlotByEvent(prev => ({ ...prev, [selectedEvent.id]: slot }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              isBookedThisSlot
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isCurrentSlot
                                  ? 'bg-[#800020] text-white shadow-xs'
                                  : 'bg-white hover:bg-amber-50 text-gray-700 border border-gray-200'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{slot}</span>
                            {isBookedThisSlot && <Check className="w-3 h-3 text-emerald-700" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Booking status / action button */}
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-500">
                    💡 Guldmedlemmar erhåller 50 bonuspoäng vid bokning av talar-sparring.
                  </div>

                  {bookedSpeakerOneOnOne[selectedEvent.id] ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>1-1 Bokad ({bookedSpeakerOneOnOne[selectedEvent.id].slot})</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBookOneOnOne(selectedEvent.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Köp & Boka 1-1 ({selectedEvent.speaker_one_on_one.price_sek.toLocaleString('sv-SE')} kr)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Event Pricing & VIP Free Guest Invitations Section */}
            {selectedEvent.price_sek ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white border-2 border-amber-300/80 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950">
                          Kostnadsbelagt Event
                        </span>
                        <span className="text-xs font-bold text-amber-900">
                          {selectedEvent.price_sek.toLocaleString('sv-SE')} kr exkl. moms
                        </span>
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-sm mt-0.5">
                        {selectedEvent.allows_free_member_invites ? 'Fria gästbiljetter ingår för Guldmedlemmar' : 'Exklusivt fördjupningsevent'}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShareModalEvent(selectedEvent);
                      setActiveShareTab('FREE_INVITE');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition shrink-0"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Bjud in gäst fritt (0 kr)</span>
                  </button>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {currentUser.membership_level === 'GOLD' 
                        ? 'Guldmedlemsförmån: 2 kostnadsfria gästplatser' 
                        : 'Medlemsförmån: Kostnadsfri gästinbjudan vid Guld'}
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                      {currentUser.membership_level === 'GOLD' 
                        ? `${Math.max(0, (selectedEvent.free_invites_quota || 2) - getUserFreeInvitesCount(selectedEvent))} av ${selectedEvent.free_invites_quota || 2} fribiljetter kvar`
                        : 'Kräver Guldmedlemskap'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {currentUser.membership_level === 'GOLD' 
                      ? `Som Guldmedlem har du rätt att ta med upp till ${selectedEvent.free_invites_quota || 2} kollegor eller nätverksmedlemmar kostnadsfritt (ord. pris ${selectedEvent.price_sek.toLocaleString('sv-SE')} kr/st). Bjud in direkt så får de en VIP-fribiljett och bekräftad plats!`
                      : `Detta event kostar ${selectedEvent.price_sek.toLocaleString('sv-SE')} kr. Medlemmar med Guld-nivå kan bjuda med upp till 2 kollegor eller medlemmar helt kostnadsfritt.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#800020] flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Kostnadsfritt nätverksevent</div>
                    <div className="text-gray-500 text-[11px]">Dela länken med kollegor och vänner i Booster Friends</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShareModalEvent(selectedEvent);
                    setActiveShareTab('LINK');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-[#800020] font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Dela eventlänk</span>
                </button>
              </div>
            )}

            {/* Attendees Drawer (Deltagarsynlighet) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#800020]" />
                  <span>Anmälda Kollegor & Medlemmar ({selectedEvent.attendees.length})</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {selectedEvent.spots_max - selectedEvent.attendees_count} platser kvar
                </span>
              </div>

              {selectedEvent.attendees.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-4 text-center border border-dashed rounded-xl">
                  Bli den första att anmäla dig till denna träff!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {selectedEvent.attendees.map(att => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl border border-gray-200 bg-white hover:border-[#800020]/40 transition flex items-center gap-3"
                    >
                      <img
                        src={att.avatar}
                        alt={att.full_name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-xs truncate">{att.full_name}</h4>
                          <span className="text-[10px] font-bold text-[#800020] bg-rose-50 px-1.5 py-0.2 rounded">
                            {att.booster_score} BP
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{att.role_title} • {att.company_name}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          💡 {att.competence_tag}
                        </p>
                        {att.is_free_guest_ticket && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                              <Crown className="w-2.5 h-2.5 text-amber-600" /> VIP Gäst via {att.invited_by_name || 'Guldmedlem'}
                            </span>
                          </div>
                        )}

                        {att.id !== currentUser.id && (
                          <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowLunchModal({ attendee: att, event: selectedEvent });
                              }}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200 transition flex items-center gap-1"
                            >
                              <Coffee className="w-3 h-3 text-amber-600" />
                              <span>Bjud på lunch</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogOneOnOne(att, selectedEvent);
                              }}
                              className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <span>Logga 1-1 (+20 BP)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadIcs(selectedEvent)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Exportera ICS</span>
                </button>
                <button
                  onClick={() => {
                    setShareModalEvent(selectedEvent);
                    setActiveShareTab(selectedEvent.price_sek ? 'FREE_INVITE' : 'LINK');
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-[#800020] text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4 text-[#800020]" />
                  <span>Dela / Bjud in</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedEvent.is_booked ? (
                  <>
                    <button
                      onClick={() => {
                        onCancelBooking(selectedEvent.id);
                        setSelectedEvent(prev => prev ? { ...prev, is_booked: false, attendees_count: Math.max(0, prev.attendees_count - 1) } : null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition"
                    >
                      Avboka
                    </button>
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Du är anmäld!</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onBookEvent(selectedEvent.id);
                      setSelectedEvent(prev => prev ? { ...prev, is_booked: true, attendees_count: prev.attendees_count + 1 } : null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5a0016] transition shadow-xs flex items-center gap-1.5"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Bekräfta bokning</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iCal/Google Calendar Sync Modal */}
      {showIcsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Synka Masterkalendern</h3>
                  <p className="text-xs text-gray-500">Google Calendar, Apple iCal eller Microsoft Outlook</p>
                </div>
              </div>
              <button
                onClick={() => setShowIcsModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">Prenumerationslänk (Live ICS feed)</h4>
                <p className="text-gray-600">
                  Lägg till denna URL som kalenderprenumeration så hålls alla dina bokade hubbträffar, webinars och coworkingdagar uppdaterade automatiskt.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://boosterfriends.se/api/v1/calendar/feed?token=bf_live_user_${currentUser.id}.ics`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-700 select-all"
                  />
                  <button
                    onClick={handleCopySubscriptionLink}
                    className="px-3 py-2 rounded-xl bg-[#800020] text-white font-bold hover:bg-[#5a0016] transition shrink-0"
                  >
                    {copiedIcsUrl ? 'Kopierad!' : 'Kopiera'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Instruktioner för automatisk synk:</h4>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li><strong>Google Calendar:</strong> Klicka på "+ Andra kalendrar" &gt; "Från webbadress" och klistra in länken ovan.</li>
                  <li><strong>Apple Calendar (iPhone/Mac):</strong> Arkiv &gt; Ny kalenderprenumeration &gt; klistra in webbadressen.</li>
                  <li><strong>Outlook:</strong> Lägg till kalender &gt; "Prenumerera från webben".</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowIcsModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Event & Free Member Invites Modal */}
      {shareModalEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-bold shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-[#800020]">
                      Dela & Bjud in
                    </span>
                    {shareModalEvent.price_sek && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 text-amber-700" />
                        {shareModalEvent.price_sek.toLocaleString('sv-SE')} kr
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug mt-1">
                    {shareModalEvent.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    📅 {shareModalEvent.display_date} kl {shareModalEvent.start_time} - {shareModalEvent.end_time} • {shareModalEvent.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShareModalEvent(null);
                  setShareSuccessNotice(null);
                  setInviteSuccessNotice(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center font-bold text-sm transition shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Notification messages */}
            {shareSuccessNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shareSuccessNotice}</span>
              </div>
            )}
            {inviteSuccessNotice && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{inviteSuccessNotice}</span>
              </div>
            )}

            {/* Tab Selection */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-gray-100/80 border border-gray-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveShareTab('LINK')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeShareTab === 'LINK'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#800020]" />
                <span>Dela eventlänk</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveShareTab('FREE_INVITE')}
                className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeShareTab === 'FREE_INVITE'
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Crown className={`w-4 h-4 ${activeShareTab === 'FREE_INVITE' ? 'text-amber-300' : 'text-amber-600'}`} />
                <span>VIP Fribiljett (0 kr)</span>
              </button>
            </div>

            {/* TAB 1: Share Event Link */}
            {activeShareTab === 'LINK' && (
              <div className="space-y-4 text-xs">
                {/* 1-Click Copy Direct Link */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-[#800020]" />
                      Direktlänk till eventet
                    </label>
                    <span className="text-[11px] text-gray-500">Klickbar för alla medlemmar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/calendar?event=${shareModalEvent.id}`}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-700 select-all focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyEventLink(shareModalEvent)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shrink-0 flex items-center gap-1.5 ${
                        copiedEventLink 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#800020] hover:bg-[#5a0016] text-white'
                      }`}
                    >
                      {copiedEventLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Kopierad!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopiera länk</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* LinkedIn Share Box */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-xs">Dela evenemanget till LinkedIn</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0A66C2] bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      +15 BP Belöning
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Bjud in ditt nätverk till {shareModalEvent.title} och berätta att du deltar.
                  </p>
                  <LinkedInShareButton
                    title={`Jag deltar i "${shareModalEvent.title}" på Booster Friends!`}
                    summary={`Datum: ${shareModalEvent.display_date} kl ${shareModalEvent.start_time} på ${shareModalEvent.location}. ${shareModalEvent.description.slice(0, 150)}...`}
                    url={`${window.location.origin}/calendar?event=${shareModalEvent.id}`}
                    tags={['BoosterFriends', 'B2BNetworking', 'StockholmBusiness', 'Affärsnätverk']}
                    onShared={() => {
                      if (onAwardPoints) {
                        onAwardPoints(15, `Delade eventet "${shareModalEvent.title}" på LinkedIn`, 'REFERRAL_SENT');
                      }
                      setShareSuccessNotice('🎉 Eventet delat på LinkedIn! Du har tilldelats +15 Booster Points.');
                    }}
                  />
                </div>

                {/* Send in Direct Chat */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#800020]" />
                      Skicka tips direkt till en medlem i chatten
                    </h4>
                    <span className="text-[11px] font-bold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-md">
                      +10 Booster Points
                    </span>
                  </div>

                  {/* Search member filter */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Sök medlem, titel eller företag..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-[#800020]"
                    />
                  </div>

                  {/* Member selection pills / list */}
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {filteredMembers.slice(0, 8).map(member => {
                      const isSelected = selectedTargetMemberId === member.id;
                      return (
                        <div
                          key={member.id}
                          onClick={() => setSelectedTargetMemberId(member.id)}
                          className={`p-2 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/80 border-[#800020] ring-1 ring-[#800020]/20'
                              : 'bg-white hover:bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={member.avatar}
                              alt={member.full_name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 text-xs truncate">
                                {member.full_name}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate">
                                {member.role_title} • {member.company_name}
                              </div>
                            </div>
                          </div>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-semibold px-2 py-0.5 rounded hover:bg-gray-100">
                              Välj
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Optional Custom Note */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Personlig hälsning (valfritt):
                    </label>
                    <textarea
                      rows={2}
                      value={customShareNote}
                      onChange={(e) => setCustomShareNote(e.target.value)}
                      placeholder="Hej! Tänkte att detta event passar dina fokusområden..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020]"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSendLinkToMember}
                      disabled={!selectedTargetMemberId}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                        selectedTargetMemberId
                          ? 'bg-[#800020] hover:bg-[#5a0016] text-white shadow-xs'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Skicka länk i chatten</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VIP Free Guest Invite (Fribiljett) */}
            {activeShareTab === 'FREE_INVITE' && (
              <div className="space-y-4 text-xs">
                {/* Gold Tier Benefit Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
                        <Crown className="w-5 h-5 text-amber-100" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-white">Guldmedlemsförmån: Kostnadsfria Gästinbjudningar</div>
                        <div className="text-[11px] text-amber-100">Bjud in medlemmar eller gäster till betalevent helt fritt (0 kr)</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-black/25 text-amber-100 backdrop-blur-xs border border-white/20">
                      {currentUser.membership_level === 'GOLD' 
                        ? `${Math.max(0, (shareModalEvent.free_invites_quota || 2) - getUserFreeInvitesCount(shareModalEvent))} av ${shareModalEvent.free_invites_quota || 2} fribiljetter kvar`
                        : 'Kräver Guld'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/20 text-[11px] text-amber-50 flex items-center justify-between">
                    <span>Ordinarie eventbiljett: <strong>{(shareModalEvent.price_sek || 1490).toLocaleString('sv-SE')} kr exkl. moms</strong></span>
                    <span className="font-black bg-white text-amber-900 px-2 py-0.5 rounded-md">Din gäst betalar: 0 kr</span>
                  </div>
                </div>

                {/* Warning if not Gold tier */}
                {currentUser.membership_level !== 'GOLD' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Endast för Guldmedlemmar</strong>
                      Ditt nuvarande medlemskap ({currentUser.membership_level}) tillåter inte fria gästbiljetter till betalevent. Uppgradera till Guld för att låsa upp obegränsade hubbträffar och 2 fria gästbiljetter per specialevent!
                    </div>
                  </div>
                )}

                {/* Invite Target Selector (Member vs External Guest) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInviteType('MEMBER')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition border ${
                        inviteType === 'MEMBER'
                          ? 'bg-rose-50 border-[#800020] text-[#800020]'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Bjud in Booster-medlem
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteType('EXTERNAL')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition border ${
                        inviteType === 'EXTERNAL'
                          ? 'bg-rose-50 border-[#800020] text-[#800020]'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Bjud in extern gäst/kollega
                    </button>
                  </div>

                  {inviteType === 'MEMBER' ? (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-700 block">
                        Välj medlem som ska få fribiljetten (0 kr):
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Sök medlem att bjuda in..."
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-hidden focus:border-[#800020]"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {filteredMembers.slice(0, 8).map(member => {
                          const isSelected = selectedTargetMemberId === member.id;
                          return (
                            <div
                              key={member.id}
                              onClick={() => setSelectedTargetMemberId(member.id)}
                              className={`p-2 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400/30'
                                  : 'bg-white hover:bg-gray-50 border-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={member.avatar}
                                  alt={member.full_name}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-gray-900 text-xs truncate">
                                    {member.full_name}
                                  </div>
                                  <div className="text-[11px] text-gray-500 truncate">
                                    {member.role_title} • {member.company_name}
                                  </div>
                                </div>
                              </div>
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3" />
                                </div>
                              ) : (
                                <span className="text-[11px] text-gray-400 font-semibold px-2 py-0.5 rounded hover:bg-gray-100">
                                  Välj
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Gästens För- & Efternamn:
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="t.ex. Fredrik Lindqvist"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-700 block mb-1">
                            E-postadress för inbjudan:
                          </label>
                          <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="fredrik@bolag.se"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-700 block mb-1">
                            Företag / Organisation:
                          </label>
                          <input
                            type="text"
                            value={guestCompany}
                            onChange={(e) => setGuestCompany(e.target.value)}
                            placeholder="t.ex. Nordic Ventures AB"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-hidden focus:border-[#800020]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex justify-between text-gray-600">
                      <span>Ordinarie eventpris:</span>
                      <span>{(shareModalEvent.price_sek || 1490).toLocaleString('sv-SE')} kr</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Guldmedlemsrabatt (Fribiljett):</span>
                      <span>-{(shareModalEvent.price_sek || 1490).toLocaleString('sv-SE')} kr (100%)</span>
                    </div>
                    <div className="pt-1.5 border-t border-gray-200 flex justify-between font-black text-gray-900 text-sm">
                      <span>Totalt att betala:</span>
                      <span className="text-emerald-700">0 kr (Kostnadsfritt)</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleConfirmFreeInvite}
                      disabled={currentUser.membership_level !== 'GOLD' || (inviteType === 'MEMBER' ? !selectedTargetMemberId : !guestName.trim())}
                      className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md ${
                        currentUser.membership_level === 'GOLD' && (inviteType === 'MEMBER' ? selectedTargetMemberId : guestName.trim())
                          ? 'bg-[#800020] hover:bg-[#5a0016] text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-4 h-4 text-amber-300" />
                      <span>Bekräfta VIP-Fribiljett (0 kr)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span>💡 Inbjudna gäster läggs direkt till i eventets deltagarlista.</span>
              <button
                onClick={() => {
                  setShareModalEvent(null);
                  setShareSuccessNotice(null);
                  setInviteSuccessNotice(null);
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <EventReviewModal
          event={showReviewModal}
          currentUser={currentUser}
          onClose={() => setShowReviewModal(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Create Member Event Modal */}
      {showCreateEventModal && (
        <CreateMemberEventModal
          currentUser={currentUser}
          onClose={() => setShowCreateEventModal(false)}
          onCreateEvent={handleCreateNewMemberEvent}
        />
      )}

      {/* Lunch Invitation Modal */}
      {showLunchModal && (
        <LunchInvitationModal
          attendee={showLunchModal.attendee}
          event={showLunchModal.event}
          currentUser={currentUser}
          onClose={() => setShowLunchModal(null)}
          onSendInvitation={handleSendLunchInvitation}
        />
      )}
    </div>
    </AdminInspect>
  );
};
