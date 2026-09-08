import React, { useState } from 'react';
import { 
  INITIAL_MEMBERS, 
  INITIAL_HUBS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_WEBINARS, 
  INITIAL_SKILLS, 
  INITIAL_REVIEWS, 
  INITIAL_PIPELINE, 
  INITIAL_EVENTS, 
  INITIAL_PARTNER_PERKS,
  INITIAL_SCORE_LOGS,
  INITIAL_COURSES,
  INITIAL_CERTIFICATES,
  INITIAL_MENTOR_SLOTS,
  SAMPLE_QUIZ_QUESTIONS
} from './data/initialData';
import { 
  Member, 
  Hub, 
  ChatChannel, 
  ChatMessage, 
  Webinar, 
  MemberSkill, 
  Review, 
  DealPipelineItem, 
  BoosterEvent, 
  GuestPass, 
  PipelineStage,
  BoosterScoreLog,
  Course,
  Certificate,
  MentorSlot,
  QuizQuestion,
  ActivityType,
  EventInvitation,
  CalendarAttendee,
  MembershipLevel
} from './types';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { ChatModule } from './components/chat/ChatModule';
import { WebinarModule } from './components/webinars/WebinarModule';
import { MatchmakingModule } from './components/matchmaking/MatchmakingModule';
import { CrmPipelineModule } from './components/crm/CrmPipelineModule';
import { EventBookingModule } from './components/events/EventBookingModule';
import { SkillsReviewsModule } from './components/skills/SkillsReviewsModule';
import { BenefitsModule } from './components/benefits/BenefitsModule';
import { SpecAndSchemaModule } from './components/architecture/SpecAndSchemaModule';
import { GamificationModule } from './components/gamification/GamificationModule';
import { AcademyModule } from './components/academy/AcademyModule';
import { MasterCalendarModule } from './components/calendar/MasterCalendarModule';
import { CoworkingHubsModule } from './components/coworking/CoworkingHubsModule';
import { PromoAndTrialsModule } from './components/promos/PromoAndTrialsModule';
import { CommunityAndBlogModule } from './components/community/CommunityAndBlogModule';
import { AdminPortalModule } from './components/admin/AdminPortalModule';
import { ProfileSettingsAndDirectoryModule } from './components/profile/ProfileSettingsAndDirectoryModule';
import { AdBannerEngine } from './components/ads/AdBannerEngine';
import { QrScannerModal } from './components/common/QrScannerModal';
import {
  MasterCalendarEvent,
  CoworkingDeskBooking,
  PartnerCoworkingLocation,
  DeskSwap,
  PromoCode,
  FreeTrialPass,
  MemberCoworkingCredits,
  LunchRequest
} from './types';
import {
  INITIAL_MASTER_EVENTS,
  INITIAL_COWORKING_BOOKINGS,
  INITIAL_PARTNER_LOCATIONS,
  INITIAL_DESK_SWAPS,
  INITIAL_PROMO_CODES,
  INITIAL_TRIAL_PASSES,
  INITIAL_COWORKING_CREDITS
} from './data/calendarAndCoworkingData';
import { 
  Smartphone, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Video, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  DollarSign,
  Send,
  Gift,
  Trophy,
  GraduationCap,
  Award,
  Crown,
  Building2,
  CalendarDays,
  Tag,
  Plus,
  Repeat,
  Coffee,
  CheckCircle2,
  Share2,
  MapPin,
  X,
  Clock,
  Compass,
  Home,
  QrCode,
  Bell,
  Briefcase,
  Layers,
  BookOpen,
  Shield,
  User,
  Camera
} from 'lucide-react';
import { formatSek } from './utils/calendar';

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<Member>(INITIAL_MEMBERS[0]);
  const [selectedHub, setSelectedHub] = useState<Hub>(INITIAL_HUBS[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [quickChatInput, setQuickChatInput] = useState('');

  // V8 Mobile FAB & Quick Action Bottom Sheet
  const [showFabModal, setShowFabModal] = useState(false);
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [activeFabAction, setActiveFabAction] = useState<'MEETING' | 'INTRO' | 'FLEX' | 'DEAL' | null>(null);
  const [qrModalMember, setQrModalMember] = useState<Member | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // V12 Lunch Requests & Follow State
  const [lunchRequests, setLunchRequests] = useState<LunchRequest[]>([
    {
      id: 'lunch_1',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      sender_company: 'Eklund & Partners Advokatbyrå',
      receiver_id: 'usr_rickard_wigrund',
      receiver_name: 'Rickard Wigrund',
      receiver_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      proposed_date: '2026-09-15',
      location: 'Convendum Stockholm City Lounge',
      host_pays: true,
      status: 'PENDING',
      note: 'Hej Rickard! Skulle gärna ta en 1-on-1 lunch och prata om era nya cybersäkerhetsavtal. Jag bjuder!'
    }
  ]);

  const handleFollowToggle = (targetMemberId: string) => {
    const currentFollowing = currentUser.following_member_ids || [];
    const isFollowing = currentFollowing.includes(targetMemberId);
    const updatedFollowing = isFollowing
      ? currentFollowing.filter(id => id !== targetMemberId)
      : [...currentFollowing, targetMemberId];

    setCurrentUser(prev => ({
      ...prev,
      following_member_ids: updatedFollowing
    }));
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, following_member_ids: updatedFollowing } : m));

    if (!isFollowing) {
      handleAwardPoints(5, 'Följt en medlem i nätverket', 'PROFILE_FOLLOW');
    }
  };

  const handleUpdateProfile = (updatedData: Partial<Member>) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, ...updatedData } : m));
    handleAwardPoints(15, 'Uppdaterat profil och kompetenser', 'PROFILE_UPDATE');
  };

  const handleSendLunchRequest = (request: Partial<LunchRequest>) => {
    const fullRequest: LunchRequest = {
      id: `lunch_${Date.now()}`,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      sender_company: currentUser.company_name,
      receiver_id: request.receiver_id || 'usr_3',
      receiver_name: request.receiver_name || 'Medlem',
      receiver_avatar: request.receiver_avatar || '',
      proposed_date: request.proposed_date || new Date().toISOString().split('T')[0],
      location: request.location || 'Convendum Lounge',
      host_pays: request.host_pays ?? true,
      status: 'PENDING',
      note: request.note,
      created_at: new Date().toISOString()
    };
    setLunchRequests(prev => [fullRequest, ...prev]);
  };

  // Quick Action Form states
  const [fabMeetingPartner, setFabMeetingPartner] = useState(INITIAL_MEMBERS[1].full_name);
  const [fabMeetingDate, setFabMeetingDate] = useState('2026-09-12');
  const [fabMeetingNotes, setFabMeetingNotes] = useState('Kaffemöte & strategiskt B2B-samarbete');

  const [fabIntroContactA, setFabIntroContactA] = useState(INITIAL_MEMBERS[1].full_name);
  const [fabIntroContactB, setFabIntroContactB] = useState(INITIAL_MEMBERS[2].full_name);
  const [fabIntroReason, setFabIntroReason] = useState('Synergier inom SaaS & E-handelsexpansion');

  const [fabDealTitle, setFabDealTitle] = useState('');
  const [fabDealCompany, setFabDealCompany] = useState('');
  const [fabDealValue, setFabDealValue] = useState('150000');
  const [fabDeskLocId, setFabDeskLocId] = useState('hub_gbg');

  // Domain States
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(INITIAL_CHANNELS[0].id);

  const [webinars, setWebinars] = useState<Webinar[]>(INITIAL_WEBINARS);
  const [skills, setSkills] = useState<MemberSkill[]>(INITIAL_SKILLS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [pipelineItems, setPipelineItems] = useState<DealPipelineItem[]>(INITIAL_PIPELINE);
  const [events, setEvents] = useState<BoosterEvent[]>(INITIAL_EVENTS);

  // V6 & V7 States (Masterkalender, Coworking, Partner Hubs, Desk Swap, Promos)
  const [masterEvents, setMasterEvents] = useState<MasterCalendarEvent[]>(INITIAL_MASTER_EVENTS);
  const [coworkingBookings, setCoworkingBookings] = useState<CoworkingDeskBooking[]>(INITIAL_COWORKING_BOOKINGS);
  const [partnerLocations, setPartnerLocations] = useState<PartnerCoworkingLocation[]>(INITIAL_PARTNER_LOCATIONS);
  const [deskSwaps, setDeskSwaps] = useState<DeskSwap[]>(INITIAL_DESK_SWAPS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [trialPasses, setTrialPasses] = useState<FreeTrialPass[]>(INITIAL_TRIAL_PASSES);
  const [memberCredits, setMemberCredits] = useState<MemberCoworkingCredits>(
    INITIAL_COWORKING_CREDITS[currentUser.id] || {
      member_id: currentUser.id,
      included_monthly_quota: 5,
      used_monthly_quota: 1,
      purchased_extra_credits: 3,
      unlimited_month_pass_active: false
    }
  );
  const [guestPasses, setGuestPasses] = useState<GuestPass[]>([
    {
      id: 'gp_1',
      guest_name: 'Helena Lindqvist',
      guest_email: 'helena@vcfund.se',
      guest_company: 'Nordic Growth Capital',
      invited_by_member_id: 'usr_johan_lindberg',
      target_hub: 'Hubb Stockholm City',
      target_date: '10 Sep 2026',
      status: 'ACTIVE',
      code: 'BOOST-GUEST-4921'
    }
  ]);

  // V4 & V5 States (Gamification, Academy, Mentorship)
  const [scoreLogs, setScoreLogs] = useState<BoosterScoreLog[]>(INITIAL_SCORE_LOGS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [mentorSlots, setMentorSlots] = useState<MentorSlot[]>(INITIAL_MENTOR_SLOTS);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(SAMPLE_QUIZ_QUESTIONS);

  // Unread badge count for chat
  const unreadChatCount = channels.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  // Chat Actions
  const handleSendMessage = (channelId: string, text: string, attachmentTypeOrData?: any, metadata?: any) => {
    let attachmentObj: any = undefined;
    let attachmentTypeStr: any = undefined;

    if (typeof attachmentTypeOrData === 'string') {
      attachmentTypeStr = attachmentTypeOrData;
      attachmentObj = {
        type: attachmentTypeOrData,
        ...metadata
      };
    } else if (attachmentTypeOrData) {
      attachmentObj = attachmentTypeOrData;
      attachmentTypeStr = attachmentTypeOrData.type;
    }

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      channel_id: channelId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      message_text: text,
      created_at: new Date().toISOString(),
      is_self: true,
      attachment_type: attachmentTypeStr,
      attachment_metadata: attachmentObj
    };

    setMessagesByChannel(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));

    // Update last message preview in channel
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          last_message: text || (attachmentObj ? `[Bilaga: ${attachmentObj.title || 'Fil'}]` : ''),
          last_message_time: 'Just nu'
        };
      }
      return c;
    }));
  };

  const handleCreateIntroThread = (memberBId: string, memberCId: string, contextReason: string) => {
    const memberB = members.find(m => m.id === memberBId);
    const memberC = members.find(m => m.id === memberCId);
    if (!memberB || !memberC) return;

    const introChanId = 'chan_intro_' + Date.now();
    const newIntroChan: ChatChannel = {
      id: introChanId,
      title: `3-Partsintro: ${memberB.full_name.split(' ')[0]} & ${memberC.full_name.split(' ')[0]}`,
      name: `3-Partsintro: ${memberB.full_name.split(' ')[0]} & ${memberC.full_name.split(' ')[0]}`,
      avatar: memberB.avatar,
      avatar_url: memberB.avatar,
      role: `Faciliterad av ${currentUser.full_name}`,
      last_message: 'Hej! Jag vill introducera er två till varandra.',
      last_message_time: 'Just nu',
      is_online: true,
      channel_type: 'GROUP',
      is_intro_thread: true
    };

    const initialMsg: ChatMessage = {
      id: 'msg_intro_' + Date.now(),
      channel_id: introChanId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      message_text: `Hej ${memberB.full_name} och ${memberC.full_name}! Jag sätter upp denna 3-partstråd för att introducera er två till varandra. Bakgrund: ${contextReason}.`,
      created_at: new Date().toISOString(),
      is_self: true
    };

    setChannels(prev => [newIntroChan, ...prev]);
    setMessagesByChannel(prev => ({
      ...prev,
      [introChanId]: [initialMsg]
    }));
    setSelectedChannelId(introChanId);
    handleAwardPoints(40, `3-Partsintro: ${memberB.full_name} & ${memberC.full_name}`, 'INTRO_3_WAY');
  };

  const handleCreateChannel = (targetMember: Member) => {
    const existing = channels.find(c => c.member_id === targetMember.id || c.title.includes(targetMember.full_name));
    if (existing) {
      setSelectedChannelId(existing.id);
      setActiveTab('chat');
      return;
    }

    const newChan: ChatChannel = {
      id: 'chan_' + targetMember.id,
      title: targetMember.full_name,
      name: targetMember.full_name,
      avatar: targetMember.avatar,
      avatar_url: targetMember.avatar,
      role: `${targetMember.role_title} • ${targetMember.company_name}`,
      last_message: 'Kanal skapad',
      last_message_time: 'Just nu',
      is_online: targetMember.is_online ?? true,
      channel_type: 'DIRECT',
      member_id: targetMember.id
    };

    setChannels(prev => [newChan, ...prev]);
    setSelectedChannelId(newChan.id);
    setActiveTab('chat');
  };

  const handleStartIntroWith = (targetMemberId: string) => {
    const target = members.find(m => m.id === targetMemberId);
    if (!target) return;

    const introChanId = 'chan_intro_' + Date.now();
    const newIntroChan: ChatChannel = {
      id: introChanId,
      title: `Intromatchning: ${currentUser.full_name.split(' ')[0]} & ${target.full_name.split(' ')[0]}`,
      name: `Intromatchning: ${currentUser.full_name.split(' ')[0]} & ${target.full_name.split(' ')[0]}`,
      avatar: target.avatar,
      avatar_url: target.avatar,
      role: `3-partstråd initierad av Booster Friends AI`,
      last_message: 'Hej! Jag kopplar ihop er för strategiskt samarbete.',
      last_message_time: 'Just nu',
      is_online: true,
      channel_type: 'GROUP',
      is_intro_thread: true
    };

    const initialIntroMsg: ChatMessage = {
      id: 'msg_intro_init',
      channel_id: introChanId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      message_text: `Hej ${target.full_name}! Jag såg via Booster Friends AI att du söker samarbete inom ${target.seeking_tags[0] || 'affärsutveckling'} och erbjuder ${target.offering_tags[0] || 'kompetens'}. Vore givande med ett digitalt eller fysiskt frukostmöte!`,
      created_at: new Date().toISOString(),
      is_self: true
    };

    setChannels(prev => [newIntroChan, ...prev]);
    setMessagesByChannel(prev => ({
      ...prev,
      [introChanId]: [initialIntroMsg]
    }));
    setSelectedChannelId(introChanId);
    setActiveTab('chat');
  };

  // Webinar Actions
  const handleRegisterWebinar = (webinarId: string) => {
    setWebinars(prev => prev.map(w => {
      if (w.id === webinarId) {
        return {
          ...w,
          is_registered: true,
          attendee_count: w.attendee_count + 1
        };
      }
      return w;
    }));
  };

  // Event & Tillval Actions
  const handleToggleEventAddon = (eventId: string, addonId: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          addons: ev.addons.map(add => {
            if (add.id === addonId) {
              return { ...add, selected: !add.selected };
            }
            return add;
          })
        };
      }
      return ev;
    }));
  };

  const handleBookEvent = (eventId: string, paymentMethod: 'SWISH' | 'STRIPE' | 'FAKTURA', totalAmount: number) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          is_booked: true,
          spots_left: Math.max(0, ev.spots_left - 1)
        };
      }
      return ev;
    }));

    setCurrentUser(prev => ({
      ...prev,
      booster_score: prev.booster_score + 35
    }));
  };

  const handleCheckInEvent = (eventId: string) => {
    setCurrentUser(prev => ({
      ...prev,
      booster_score: prev.booster_score + 50
    }));
  };

  const handleCreateGuestPass = (guestData: { guest_name: string; guest_email: string; guest_company: string; target_hub: string; target_date: string }) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newPass: GuestPass = {
      id: 'gp_' + Date.now(),
      guest_name: guestData.guest_name,
      guest_email: guestData.guest_email,
      guest_company: guestData.guest_company,
      invited_by_member_id: currentUser.id,
      target_hub: guestData.target_hub,
      target_date: guestData.target_date,
      status: 'ACTIVE',
      code: `BOOST-GUEST-${codeNum}`
    };
    setGuestPasses(prev => [newPass, ...prev]);
  };

  // CRM Pipeline Actions
  const handleUpdateDealStage = (dealId: string, newStage: PipelineStage) => {
    setPipelineItems(prev => prev.map(item => {
      if (item.id === dealId) {
        return { ...item, stage: newStage };
      }
      return item;
    }));
  };

  const handleAddDeal = (newDeal: Omit<DealPipelineItem, 'id'>) => {
    const item: DealPipelineItem = {
      ...newDeal,
      id: 'deal_' + Date.now()
    };
    setPipelineItems(prev => [item, ...prev]);
  };

  const handleUpdateMemberLevel = (memberId: string, level: 'BRONZE' | 'SILVER' | 'GOLD') => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, membership_level: level } : m));
    if (currentUser.id === memberId) {
      setCurrentUser(prev => ({ ...prev, membership_level: level }));
    }
  };

  // Skills & Review Actions
  const handleEndorseSkill = (skillId: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId && !s.has_endorsed) {
        return {
          ...s,
          endorsements_count: s.endorsements_count + 1,
          has_endorsed: true,
          endorsers: [currentUser.full_name, ...s.endorsers]
        };
      }
      return s;
    }));
  };

  const handleAddSkill = (skillName: string) => {
    const newS: MemberSkill = {
      id: 'sk_' + Date.now(),
      member_id: currentUser.id,
      skill_name: skillName,
      endorsements_count: 1,
      max_capacity: 40,
      has_endorsed: true,
      endorsers: [currentUser.full_name]
    };
    setSkills(prev => [...prev, newS]);
  };

  const handleAddReview = (newReview: Omit<Review, 'id' | 'created_at'>) => {
    const rev: Review = {
      ...newReview,
      id: 'rev_' + Date.now(),
      created_at: new Date().toISOString()
    };
    setReviews(prev => [rev, ...prev]);
  };

  // V4 Gamification Actions
  const handleAwardPoints = (points: number, title: string, activityType: ActivityType) => {
    setCurrentUser(prev => {
      const updatedScore = prev.booster_score + points;
      const updatedUser = { ...prev, booster_score: updatedScore };
      setMembers(mList => mList.map(m => m.id === prev.id ? { ...m, booster_score: updatedScore } : m));
      return updatedUser;
    });

    const newLog: BoosterScoreLog = {
      id: 'log_' + Date.now(),
      member_id: currentUser.id,
      points_awarded: points,
      activity_type: activityType,
      title: title,
      created_at: new Date().toISOString()
    };
    setScoreLogs(prev => [newLog, ...prev]);
  };

  const handleSimulateScore = (targetScore: number) => {
    setCurrentUser(prev => {
      const updatedUser = { ...prev, booster_score: targetScore };
      setMembers(mList => mList.map(m => m.id === prev.id ? { ...m, booster_score: targetScore } : m));
      return updatedUser;
    });
  };

  // V5 Academy Actions
  const handleBookMentorSlot = (slotId: string) => {
    setMentorSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          is_booked: true,
          booked_by_member_id: currentUser.id
        };
      }
      return s;
    }));
    handleAwardPoints(30, 'Bokade Mentor Sparring-session (Academy)', 'MENTOR_SESSION');
  };

  const handleAwardCertificate = (newCert: Certificate) => {
    setCertificates(prev => [newCert, ...prev]);
    handleAwardPoints(75, `Certifierad: ${newCert.course_title}`, 'COURSE_COMPLETED');
  };

  const handleUnlockCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, is_unlocked: true };
      }
      return c;
    }));
  };

  // V6 Master Calendar Handlers
  const handleBookMasterEvent = (eventId: string) => {
    setMasterEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const isCurrentlyBooked = ev.is_booked;
        if (isCurrentlyBooked) {
          return {
            ...ev,
            is_booked: false,
            attendees_count: Math.max(0, ev.attendees_count - 1),
            attendees: ev.attendees.filter(m => m.id !== currentUser.id)
          };
        } else {
          return {
            ...ev,
            is_booked: true,
            attendees_count: ev.attendees_count + 1,
            attendees: [currentUser, ...ev.attendees]
          };
        }
      }
      return ev;
    }));

    const eventObj = masterEvents.find(e => e.id === eventId);
    if (eventObj && !eventObj.is_booked) {
      handleAwardPoints(20, `Anmäld till ${eventObj.title}`, 'EVENT_ATTENDED');
    }
  };

  const handleBookSpeakerOneOnOne = (eventId: string, slotTime: string) => {
    setMasterEvents(prev => prev.map(ev => {
      if (ev.id === eventId && ev.speaker_one_on_one) {
        return {
          ...ev,
          speaker_one_on_one: {
            ...ev.speaker_one_on_one,
            is_booked_by_user: true,
            booked_slots: Math.min(ev.speaker_one_on_one.total_slots, ev.speaker_one_on_one.booked_slots + 1),
            selected_time_slot: slotTime
          }
        };
      }
      return ev;
    }));

    const eventObj = masterEvents.find(e => e.id === eventId);
    const speakerName = eventObj?.speaker_one_on_one?.speaker_name || 'föreläsaren';
    handleAwardPoints(50, `Bokade 1-1 rådgivning med ${speakerName} (${slotTime})`, 'MENTOR_SESSION');
  };

  const handleShareEventWithMember = (eventId: string, targetMemberId: string, customNote?: string) => {
    const eventObj = masterEvents.find(e => e.id === eventId);
    const target = members.find(m => m.id === targetMemberId);
    if (!eventObj || !target) return;

    // Find or create direct chat channel
    let existingChan = channels.find(c => c.channel_type === 'DIRECT' && (c.title?.includes(target.full_name) || c.name?.includes(target.full_name)));
    let channelId = existingChan?.id;

    if (!existingChan) {
      channelId = 'chan_dm_' + target.id;
      const newChannel: ChatChannel = {
        id: channelId,
        title: target.full_name,
        name: target.full_name,
        avatar: target.avatar,
        avatar_url: target.avatar,
        role: target.company_name,
        last_message: `Tips om event: ${eventObj.title}`,
        last_message_time: 'Just nu',
        is_online: true,
        channel_type: 'DIRECT'
      };
      setChannels(prev => [newChannel, ...prev]);
    }

    const shareUrl = `${window.location.origin}/calendar?event=${eventObj.id}`;
    const shareMessage: ChatMessage = {
      id: 'msg_share_' + Date.now(),
      channel_id: channelId!,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      message_text: customNote 
        ? `${customNote}\n\n📅 ${eventObj.title} (${eventObj.display_date} kl ${eventObj.start_time})\n📍 ${eventObj.location}\n🔗 Länk: ${shareUrl}`
        : `Hej ${target.full_name.split(' ')[0]}! Tänkte tipsa dig om detta Booster Friends-event:\n\n📅 ${eventObj.title}\n⏰ ${eventObj.display_date} kl ${eventObj.start_time} - ${eventObj.end_time}\n📍 ${eventObj.location}\n🔗 Direktlänk för anmälan: ${shareUrl}`,
      created_at: new Date().toISOString(),
      is_self: true
    };

    setMessagesByChannel(prev => ({
      ...prev,
      [channelId!]: [...(prev[channelId!] || []), shareMessage]
    }));

    handleAwardPoints(10, `Delade eventlänk med ${target.full_name}`, 'REFERRAL_SENT');
  };

  const handleInviteMemberFreeTicket = (eventId: string, targetMemberId: string, guestName?: string, guestEmail?: string) => {
    const eventObj = masterEvents.find(e => e.id === eventId);
    if (!eventObj) return;

    let attendeeName = guestName || '';
    let attendeeAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    let attendeeCompany = 'Gästinbjudan';
    let attendeeRole = 'Inbjuden Gäst';
    let attendeeLevel: MembershipLevel = 'BRONZE';
    let attendeeScore = 500;
    let attendeeIndustry = 'Affärsnätverk';
    let attendeeTag = 'VIP Fribiljett';

    if (targetMemberId) {
      const targetMember = members.find(m => m.id === targetMemberId);
      if (targetMember) {
        attendeeName = targetMember.full_name;
        attendeeAvatar = targetMember.avatar;
        attendeeCompany = targetMember.company_name;
        attendeeRole = targetMember.role_title;
        attendeeLevel = targetMember.membership_level;
        attendeeScore = targetMember.booster_score;
        attendeeIndustry = targetMember.city;
        attendeeTag = targetMember.seeking_tags[0] || 'Nätverkspartner';
      }
    }

    if (!attendeeName) return;

    const newInvitation: EventInvitation = {
      id: 'inv_' + Date.now(),
      event_id: eventId,
      invited_member_id: targetMemberId || undefined,
      invited_member_name: attendeeName,
      invited_member_avatar: attendeeAvatar,
      invited_member_company: attendeeCompany,
      invited_by_id: currentUser.id,
      invited_by_name: currentUser.full_name,
      is_free_ticket: true,
      original_price_sek: eventObj.price_sek || 1490,
      status: 'CONFIRMED',
      created_at: new Date().toISOString()
    };

    const newAttendee: CalendarAttendee = {
      id: targetMemberId || 'guest_' + Date.now(),
      full_name: attendeeName,
      role_title: attendeeRole,
      company_name: attendeeCompany,
      avatar: attendeeAvatar,
      booster_score: attendeeScore,
      membership_level: attendeeLevel,
      industry: attendeeIndustry,
      competence_tag: attendeeTag,
      invited_by_name: currentUser.full_name,
      is_free_guest_ticket: true
    };

    setMasterEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const existingAttendees = ev.attendees.filter(a => a.id !== newAttendee.id);
        const existingInvites = (ev.invitations || []).filter(i => i.invited_member_name !== attendeeName);
        return {
          ...ev,
          attendees_count: ev.attendees_count + (ev.attendees.some(a => a.id === newAttendee.id) ? 0 : 1),
          attendees: [newAttendee, ...existingAttendees],
          invitations: [...existingInvites, newInvitation]
        };
      }
      return ev;
    }));

    handleAwardPoints(25, `Bjudit in ${attendeeName} till ${eventObj.title} (Fribiljett Guld)`, 'REFERRAL_SENT');

    // Send direct notification in chat if member
    if (targetMemberId) {
      handleShareEventWithMember(
        eventId,
        targetMemberId,
        `🌟 VIP-Inbjudan! Jag har bjudit in dig kostnadsfritt (0 kr fribiljett via mitt Guldmedlemskap, ord. pris ${(eventObj.price_sek || 1490).toLocaleString('sv-SE')} kr) till "${eventObj.title}"! Platsen är bekräftad och reserverad för dig.`
      );
    }
  };

  // V6 & V7 Coworking Handlers
  const handleBookFlexDesk = (hubOrPartnerId: string, slotType: 'FULL_DAY' | 'AM' | 'PM', isPartner?: boolean) => {
    const todayStr = '2026-09-10';
    const locName = isPartner 
      ? partnerLocations.find(p => p.id === hubOrPartnerId)?.name || 'Partner Coworking'
      : INITIAL_HUBS.find(h => h.id === hubOrPartnerId)?.name || 'Booster Hubb';

    const newBooking: CoworkingDeskBooking = {
      id: 'bk_' + Date.now(),
      hub_id: hubOrPartnerId,
      hub_name: locName,
      is_partner_location: !!isPartner,
      partner_location_id: isPartner ? hubOrPartnerId : undefined,
      member_id: currentUser.id,
      member_name: currentUser.full_name,
      member_company: currentUser.company_name,
      member_role: currentUser.role_title,
      member_avatar: currentUser.avatar,
      competence_tags: currentUser.industry ? [currentUser.industry, 'Affärsutveckling'] : ['Networking'],
      booking_date: todayStr,
      slot_type: slotType,
      is_checked_in: false,
      created_at: new Date().toISOString()
    };

    setCoworkingBookings(prev => [newBooking, ...prev]);

    // Deduct credit
    setMemberCredits(prev => ({
      ...prev,
      purchased_extra_credits: Math.max(0, prev.purchased_extra_credits - 1)
    }));

    handleAwardPoints(15, `Bokade Flexplats på ${locName}`, 'FLEX_DESK_BOOKED');
  };

  const handleCheckInGeoOrQr = (bookingId: string) => {
    setCoworkingBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          is_checked_in: true,
          check_in_time: 'Just nu (09:42)',
          check_in_method: 'QR' as const
        };
      }
      return b;
    }));
    handleAwardPoints(30, 'QR/Geo-incheckning på Hubben (+30 BP)', 'HUB_CHECK_IN');
  };

  const handleLendDeskSwap = (locationId: string, availableDate: string, deskLabel: string, notes: string, isPartner: boolean) => {
    const locName = isPartner
      ? partnerLocations.find(p => p.id === locationId)?.name || 'Partner Coworking'
      : INITIAL_HUBS.find(h => h.id === locationId)?.name || 'Booster Hubb';

    const newSwap: DeskSwap = {
      id: 'swap_' + Date.now(),
      lender_member_id: currentUser.id,
      lender_member_name: currentUser.full_name,
      lender_member_avatar: currentUser.avatar,
      lender_company: currentUser.company_name,
      location_id: locationId,
      location_name: locName,
      is_partner_location: isPartner,
      available_date: availableDate,
      desk_label: deskLabel || 'Fast Plats med dubbelskärm',
      status: 'AVAILABLE',
      notes: notes,
      points_awarded: true,
      created_at: new Date().toISOString()
    };

    setDeskSwaps(prev => [newSwap, ...prev]);
    handleAwardPoints(25, `Lånade ut skrivbordsplats (${availableDate})`, 'DESK_SWAP_LENT');
  };

  const handleClaimDeskSwap = (swapId: string) => {
    setDeskSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        return {
          ...s,
          status: 'BOOKED',
          borrower_member_id: currentUser.id,
          borrower_member_name: currentUser.full_name
        };
      }
      return s;
    }));
    handleAwardPoints(15, 'Bokade peer-lånad Desk Swap', 'DESK_SWAP_CLAIMED');
  };

  const handlePurchaseCredits = (plan: 'SINGLE' | 'PACK_5' | 'MONTH_UNLIMITED' | 'UNLIMITED', _promoCodeApplied?: string) => {
    const addCredits = plan === 'SINGLE' ? 1 : plan === 'PACK_5' ? 5 : 30;
    setMemberCredits(prev => ({
      ...prev,
      purchased_extra_credits: prev.purchased_extra_credits + addCredits
    }));
    handleAwardPoints(20, `Köpte Coworking Flexpass (${plan})`, 'PROMO_REDEEMED');
  };

  const handleUpdatePartnerAllocation = (partnerId: string, newLimit: number) => {
    setPartnerLocations(prev => prev.map(p => {
      if (p.id === partnerId) {
        return { ...p, daily_desk_allocation: newLimit };
      }
      return p;
    }));
  };

  const handleCreateTrialPass = (guestName: string, guestEmail: string, hubId: string) => {
    const hubObj = INITIAL_HUBS.find(h => h.id === hubId);
    const newPass: FreeTrialPass = {
      id: 'tp_' + Date.now(),
      code: 'TRIAL-BF-' + Math.floor(1000 + Math.random() * 9000),
      guest_name: guestName,
      guest_email: guestEmail,
      guest_company: 'Gästbolag',
      invited_by_member_id: currentUser.id,
      invited_by_member_name: currentUser.full_name,
      target_hub_id: hubId,
      target_hub_name: hubObj?.name || 'Hubb Stockholm City',
      pass_date: '2026-09-18',
      status: 'ACTIVE',
      includes_breakfast: true,
      created_at: new Date().toISOString()
    };
    setTrialPasses(prev => [newPass, ...prev]);
    handleAwardPoints(10, `Skapade Prova-på-pass för ${guestName}`, 'TRIAL_PASS_CREATED');
  };

  const handleRedeemTrialPass = (passId: string) => {
    setTrialPasses(prev => prev.map(p => {
      if (p.id === passId) {
        return { ...p, status: 'USED' as const, claimed_at: new Date().toISOString() };
      }
      return p;
    }));
    handleAwardPoints(50, 'Gäst incheckad via Prova-på-pass (+50 BP)', 'TRIAL_PASS_REDEEMED');
  };

  const handleCreatePromoCode = (codeData: any) => {
    const newPromo: PromoCode = {
      id: 'promo_' + Date.now(),
      code: (codeData.code || 'PROMO').toUpperCase().trim(),
      discount_type: codeData.discount_type || 'PERCENTAGE',
      discount_value: codeData.discount_value || 20,
      campaign_name: codeData.description || codeData.code,
      description: codeData.description || 'Kampanjkod',
      target_applicable: 'ALL',
      valid_from: new Date().toISOString(),
      valid_until: codeData.valid_until || '2026-12-31T23:59:59Z',
      max_uses: codeData.max_redemptions || 100,
      current_uses: 0,
      hub_attribution: 'Booster Friends Network'
    };
    setPromoCodes(prev => [newPromo, ...prev]);
    handleAwardPoints(15, `Skapade kampanjkod ${newPromo.code}`, 'PROMO_REDEEMED');
  };

  // V8 Quick Action Form Submissions (FAB)
  const handleQuickLogMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    handleAwardPoints(20, `1-till-1 möte genomfört med ${fabMeetingPartner}`, 'ONE_ON_ONE_LOGGED');
    setShowFabModal(false);
    setActiveFabAction(null);
  };

  const handleQuickCreateIntro = (e: React.FormEvent) => {
    e.preventDefault();
    handleAwardPoints(40, `Introduktion skapad: ${fabIntroContactA} & ${fabIntroContactB}`, 'INTRO_MADE');
    setShowFabModal(false);
    setActiveFabAction(null);
  };

  const handleQuickBookFlex = () => {
    handleBookFlexDesk(fabDeskLocId, 'FULL_DAY', fabDeskLocId.startsWith('part_'));
    setShowFabModal(false);
    setActiveFabAction(null);
  };

  const handleQuickAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabDealTitle.trim()) return;
    handleAddDeal({
      title: fabDealTitle,
      client_company: fabDealCompany || 'Klient AB',
      contact_person: 'Kontaktperson',
      referral_source: 'Booster Friends Nätverk',
      value_sek: parseInt(fabDealValue) || 100000,
      stage: 'lead',
      probability: 30,
      next_step: 'Följ upp med kaffe/demo',
      due_date: '2026-09-30',
      notes: 'Skapad via snabbknapp (V8 FAB)',
      created_at: new Date().toISOString()
    });
    setFabDealTitle('');
    setFabDealCompany('');
    setShowFabModal(false);
    setActiveFabAction(null);
  };

  // Switch Active User Persona
  const handleSelectUser = (user: Member) => {
    setCurrentUser(user);
    const userHub = INITIAL_HUBS.find(h => h.id === user.hub_id);
    if (userHub) {
      setSelectedHub(userHub);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1F2937] font-sans antialiased">
      
      {/* Top Main Navigation & Hub Header */}
      <Header
        currentUser={currentUser}
        allMembers={members}
        selectedHub={selectedHub}
        allHubs={INITIAL_HUBS}
        onSelectHub={setSelectedHub}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onSelectUser={handleSelectUser}
        unreadNotificationsCount={unreadChatCount + 2}
        channels={channels}
        onSelectChannel={setSelectedChannelId}
        onOpenFullChat={() => setActiveTab('chat')}
        onOpenNotifications={() => setActiveTab('chat')}
        onOpenCheckInModal={() => setShowScannerModal(true)}
        onOpenQrModal={() => setQrModalMember(currentUser)}
        onOpenArchitectureSpec={() => setActiveTab('architecture')}
      />

      {/* Main Container / Mobile Device Frame */}
      <div className={`transition-all duration-300 ${
        deviceMode === 'desktop' 
          ? 'w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6' 
          : 'flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-80px)]'
      }`}>
        
        {deviceMode !== 'desktop' ? (
          /* Mobile Device Frame (iOS / Android) */
          <div className="relative">
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500 px-2">
              <span className="font-bold flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#800020]" />
                {deviceMode === 'ios' ? 'Apple iOS Simulator (iPhone 16 Pro)' : 'Google Android Simulator (Pixel 9)'}
              </span>
              <button
                onClick={() => setDeviceMode('desktop')}
                className="text-xs text-[#800020] hover:underline font-semibold"
              >
                Växla till Full Webbportal
              </button>
            </div>

            <div className={`w-[390px] sm:w-[420px] h-[840px] bg-white rounded-[50px] shadow-2xl border-[10px] ${
              deviceMode === 'ios' ? 'border-gray-900 ring-2 ring-gray-400/40' : 'border-slate-800'
            } overflow-hidden flex flex-col relative`}>
              
              {/* Status Bar */}
              <div className="h-9 bg-white w-full flex items-center justify-between px-6 pt-2 flex-shrink-0 select-none z-30">
                <span className="text-[11px] font-bold text-gray-900 font-mono">09:41</span>
                {deviceMode === 'ios' ? (
                  <div className="w-24 h-5 bg-black rounded-full mx-auto" />
                ) : (
                  <div className="w-4 h-4 bg-black rounded-full" />
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile App Bar */}
              <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#800020] text-white flex items-center justify-center font-black text-xs">
                    BF
                  </div>
                  <div>
                    <h1 className="text-xs font-bold text-gray-900 leading-tight">Booster Friends</h1>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 truncate max-w-[130px]">
                      <MapPin className="w-2.5 h-2.5 text-[#800020]" />
                      <span>{selectedHub.name.replace('Hubb ', '')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      handleCheckInGeoOrQr('bk_today_quick');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition shadow-xs"
                    title="Snabb QR-incheckning"
                  >
                    <QrCode className="w-3 h-3 text-emerald-600" />
                    <span>Checka in (+30)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileNotifications(prev => !prev);
                      setShowMobileMoreMenu(false);
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition relative"
                    title="Notiser & Direktmeddelanden"
                  >
                    <Bell className="w-4 h-4 text-gray-700" />
                    {unreadChatCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#800020] absolute top-1 right-1" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowMobileMoreMenu(prev => !prev);
                      setShowMobileNotifications(false);
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition relative"
                    title="Fler moduler"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Notifications & Direct Messaging Drawer */}
              {showMobileNotifications && (
                <div className="bg-white border-b border-gray-200 p-3 shadow-md z-20 animate-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">Notiser & Meddelanden</span>
                    <button 
                      onClick={() => setShowMobileNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {channels.slice(0, 3).map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChannelId(c.id);
                          setActiveTab('chat');
                          setShowMobileNotifications(false);
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 hover:bg-[#800020]/5 cursor-pointer transition border border-gray-100"
                      >
                        {c.avatar_url ? (
                          <img src={c.avatar_url} alt={c.title} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#800020]/10 text-[#800020] text-[10px] font-bold flex items-center justify-center">
                            DM
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{c.title}</p>
                          <p className="text-[10px] text-gray-500 truncate">{c.last_message || 'Öppna chatt'}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        setShowMobileNotifications(false);
                      }}
                      className="w-full py-1.5 text-center text-xs font-bold text-[#800020] bg-[#800020]/5 hover:bg-[#800020]/10 rounded-lg transition mt-1"
                    >
                      Öppna alla meddelanden →
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile "Mer..." Sheet Drawer */}
              {showMobileMoreMenu && (
                <div className="bg-white border-b border-gray-200 p-3 shadow-md z-20 grid grid-cols-4 gap-2 text-center text-[10px] animate-in slide-in-from-top-2 duration-150">
                  {[
                    { id: 'community', label: 'Community', icon: Users },
                    { id: 'directory', label: 'Register', icon: Users },
                    { id: 'blog', label: 'Blogg', icon: BookOpen },
                    { id: 'matchmaking', label: 'Matchmaking', icon: Sparkles },
                    { id: 'chat', label: 'Chatt', icon: Send, badge: unreadChatCount },
                    { id: 'gamification', label: 'Scoreboard', icon: Trophy },
                    { id: 'academy', label: 'Academy', icon: GraduationCap },
                    { id: 'webinars', label: 'Webinars', icon: Video },
                    { id: 'promos', label: 'Kampanjer', icon: Tag },
                    { id: 'benefits', label: 'Förmåner', icon: Gift },
                    { id: 'profile_settings', label: 'Min Profil', icon: User },
                    { id: 'admin', label: 'Admin', icon: Shield },
                    { id: 'architecture', label: 'Arkitektur', icon: ShieldCheck },
                  ].map(item => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as ActiveTab);
                          setShowMobileMoreMenu(false);
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                          activeTab === item.id 
                            ? 'bg-[#800020]/10 border-[#800020] text-[#800020] font-bold' 
                            : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="relative">
                          <IconComponent className="w-4 h-4" />
                          {item.badge ? (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#800020]" />
                          ) : null}
                        </div>
                        <span className="truncate w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Mobile Body Viewport */}
              <div className="flex-1 overflow-y-auto p-3.5 bg-[#F4F5F7] space-y-4">
                {renderActiveContent()}
              </div>

              {/* V8 Mobile Bottom Navigation Bar with Center Elevated FAB */}
              <div className="bg-white border-t border-gray-200 px-3 py-1.5 flex items-center justify-between flex-shrink-0 z-20 relative">
                {/* Tab 1: Hem */}
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                    activeTab === 'overview' ? 'text-[#800020] font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">Hem</span>
                </button>

                {/* Tab 2: Coworking */}
                <button
                  onClick={() => setActiveTab('coworking')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                    activeTab === 'coworking' ? 'text-[#800020] font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">Hubbar</span>
                </button>

                {/* V8 Center Elevated Maroon FAB (+) */}
                <div className="relative -top-5 flex flex-col items-center">
                  <button
                    onClick={() => {
                      setShowFabModal(true);
                      setActiveFabAction(null);
                    }}
                    className="w-12 h-12 rounded-full bg-[#800020] hover:bg-[#580016] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ring-4 ring-white"
                    title="Snabbåtgärd: Logga möte, intro, flex eller deal"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                  <span className="text-[9px] font-bold text-[#800020] mt-0.5">Logga</span>
                </div>

                {/* Tab 4: Kalender */}
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                    activeTab === 'calendar' ? 'text-[#800020] font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">Kalender</span>
                </button>

                {/* Tab 5: Pipeline */}
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                    activeTab === 'pipeline' ? 'text-[#800020] font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">Pipeline</span>
                </button>
              </div>

              {/* Home indicator bar */}
              <div className="h-4 bg-white flex items-center justify-center flex-shrink-0">
                <div className="w-28 h-1 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Portal Layout */
          <div className="space-y-6 relative">
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              unreadChatCount={unreadChatCount}
            />

            <main>
              {renderActiveContent()}
            </main>

            {/* Desktop Floating Action Button (FAB) in lower right corner */}
            <div className="fixed bottom-6 right-8 z-40">
              <button
                onClick={() => {
                  setShowFabModal(true);
                  setActiveFabAction(null);
                }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#800020] hover:bg-[#580016] text-white font-bold text-xs shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 border border-white/20"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Snabbåtgärd / Logga (+BP)</span>
              </button>
            </div>
          </div>
        )}

        {/* V8 Quick Action Bottom Sheet / Floating Modal */}
        {showFabModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6 duration-200">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 font-display">
                      Snabbåtgärd & Poängregistrering
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      V8 Snabbmeny: Logga nätverksaktivitet och tjäna Booster Points
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowFabModal(false);
                    setActiveFabAction(null);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto space-y-4">
                
                {/* 4 Action Cards Grid */}
                {!activeFabAction ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Action 1: Logga 1-till-1 Möte */}
                    <button
                      onClick={() => setActiveFabAction('MEETING')}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#800020] hover:bg-[#800020]/5 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          +20 BP
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800020]">
                          Logga 1-till-1 Möte
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Registrera genomfört medlemsfika eller sparringmöte
                        </p>
                      </div>
                    </button>

                    {/* Action 2: Skapa Introduktion */}
                    <button
                      onClick={() => setActiveFabAction('INTRO')}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#800020] hover:bg-[#800020]/5 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                          +40 BP
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800020]">
                          Skapa Introduktion
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Koppla ihop två medlemmar i en trepartschatt
                        </p>
                      </div>
                    </button>

                    {/* Action 3: Boka Flexplats */}
                    <button
                      onClick={() => setActiveFabAction('FLEX')}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#800020] hover:bg-[#800020]/5 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          +15 BP
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800020]">
                          Boka Flexplats
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Reservera flexskrivbord på hubb eller Convendum/Mindpark
                        </p>
                      </div>
                    </button>

                    {/* Action 4: Registrera Ny Affär */}
                    <button
                      onClick={() => setActiveFabAction('DEAL')}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#800020] hover:bg-[#800020]/5 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                          +100 BP
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800020]">
                          Ny Affärsmöjlighet
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Lägg till lead i My Booster Pipeline
                        </p>
                      </div>
                    </button>

                    {/* Action 5: Visa Mitt QR ID (Visitkort) */}
                    <button
                      onClick={() => {
                        setShowFabModal(false);
                        setQrModalMember(currentUser);
                      }}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#800020] hover:bg-[#800020]/5 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#800020]">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#800020]">
                          Mitt ID
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800020]">
                          Visa Mitt QR ID (Visitkort)
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Öppna personlig QR-kod för vCard och kontaktutbyte
                        </p>
                      </div>
                    </button>

                    {/* Action 6: Skanna QR / Checka In */}
                    <button
                      onClick={() => {
                        setShowFabModal(false);
                        setShowScannerModal(true);
                      }}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                          +30 BP
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">
                          Skanna QR / Checka In
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Skanna hubbens skylt eller en medlems QR-visitkort
                        </p>
                      </div>
                    </button>

                  </div>
                ) : (
                  <div>
                    {/* Back Button */}
                    <button
                      onClick={() => setActiveFabAction(null)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-3"
                    >
                      ← Tillbaka till val
                    </button>

                    {/* Form 1: Möte */}
                    {activeFabAction === 'MEETING' && (
                      <form onSubmit={handleQuickLogMeeting} className="space-y-3.5">
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                          <span className="font-bold">Regel:</span> 1-till-1 möten med andra medlemmar premieras med +20 BP efter genomfört kaffe.
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Mötespartner:</label>
                          <select
                            value={fabMeetingPartner}
                            onChange={e => setFabMeetingPartner(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                          >
                            {members.filter(m => m.id !== currentUser.id).map(m => (
                              <option key={m.id} value={m.full_name}>
                                {m.full_name} ({m.company_name})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Datum:</label>
                            <input
                              type="date"
                              value={fabMeetingDate}
                              onChange={e => setFabMeetingDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Plats:</label>
                            <input
                              type="text"
                              defaultValue="Booster Hubb Frukostlounge"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Mötesanteckningar / Syfte:</label>
                          <textarea
                            rows={2}
                            value={fabMeetingNotes}
                            onChange={e => setFabMeetingNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition shadow-xs"
                        >
                          Registrera Möte (+20 BP)
                        </button>
                      </form>
                    )}

                    {/* Form 2: Intro */}
                    {activeFabAction === 'INTRO' && (
                      <form onSubmit={handleQuickCreateIntro} className="space-y-3.5">
                        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900">
                          <span className="font-bold">Booster Match:</span> Att introducera två medlemmar är plattformens högst värderade community-aktivitet (+40 BP).
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Medlem A:</label>
                            <select
                              value={fabIntroContactA}
                              onChange={e => setFabIntroContactA(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                            >
                              {members.filter(m => m.id !== currentUser.id).map(m => (
                                <option key={m.id} value={m.full_name}>
                                  {m.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Medlem B:</label>
                            <select
                              value={fabIntroContactB}
                              onChange={e => setFabIntroContactB(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                            >
                              {members.filter(m => m.id !== currentUser.id).map(m => (
                                <option key={m.id} value={m.full_name}>
                                  {m.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Synergimotivering:</label>
                          <input
                            type="text"
                            value={fabIntroReason}
                            onChange={e => setFabIntroReason(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-purple-800 text-white text-xs font-bold hover:bg-purple-900 transition shadow-xs"
                        >
                          Skapa Intro & Trepartschatt (+40 BP)
                        </button>
                      </form>
                    )}

                    {/* Form 3: Flex Desk */}
                    {activeFabAction === 'FLEX' && (
                      <div className="space-y-3.5">
                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                          <span className="font-bold">Flex-Standard:</span> Välj valfri egen hubb eller anslutet partner-coworkingkontor.
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Välj Hubb / Kontorshotell:</label>
                          <select
                            value={fabDeskLocId}
                            onChange={e => setFabDeskLocId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                          >
                            <optgroup label="Egna Hubbar">
                              {INITIAL_HUBS.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Partner-Coworking (Convendum, Mindpark, etc)">
                              {partnerLocations.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                          <span className="text-gray-600">Ditt Flexsaldo:</span>
                          <span className="font-bold text-[#800020] font-mono">
                            {memberCredits.included_monthly_quota + memberCredits.purchased_extra_credits} dagar kvar
                          </span>
                        </div>

                        <button
                          onClick={handleQuickBookFlex}
                          className="w-full py-2.5 px-4 rounded-xl bg-blue-800 text-white text-xs font-bold hover:bg-blue-900 transition shadow-xs"
                        >
                          Boka Dagsplats (+15 BP)
                        </button>
                      </div>
                    )}

                    {/* Form 4: Deal */}
                    {activeFabAction === 'DEAL' && (
                      <form onSubmit={handleQuickAddDeal} className="space-y-3.5">
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                          <span className="font-bold">Affärsutveckling:</span> Fyll pipelinen för att visualisera värdet från nätverket. När affären flyttas till Won utlöses +100 BP.
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Affärens titel / Projekt:</label>
                          <input
                            type="text"
                            required
                            placeholder="t.ex. CRM & E-handelsexpansion"
                            value={fabDealTitle}
                            onChange={e => setFabDealTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Klient / Bolag:</label>
                            <input
                              type="text"
                              required
                              placeholder="t.ex. Volvo Group"
                              value={fabDealCompany}
                              onChange={e => setFabDealCompany(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Uppskattat värde (SEK):</label>
                            <input
                              type="number"
                              required
                              value={fabDealValue}
                              onChange={e => setFabDealValue(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
                        >
                          Lägg till i Pipelinen
                        </button>
                      </form>
                    )}

                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* V12 Universal QR Visitkort & Connect Modal */}
        {qrModalMember && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-gray-200 max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                  Digitalt Visitkort & vCard
                </span>
                <button
                  onClick={() => setQrModalMember(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={qrModalMember.avatar}
                    alt={qrModalMember.full_name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#800020] shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                    {qrModalMember.membership_level}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{qrModalMember.full_name}</h3>
                <p className="text-xs text-gray-600 font-medium">{qrModalMember.role_title}</p>
                <p className="text-xs text-[#800020] font-bold">{qrModalMember.company_name}</p>
              </div>

              {/* High-res styled QR code display */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `BEGIN:VCARD\nVERSION:3.0\nN:${qrModalMember.full_name}\nORG:${qrModalMember.company_name}\nTITLE:${qrModalMember.role_title}\nTEL:${qrModalMember.phone || '+46700000000'}\nEMAIL:${qrModalMember.email}\nURL:${qrModalMember.linkedin_url || 'https://boosterfriends.se'}\nEND:VCARD`
                  )}`}
                  alt="QR Visitkort"
                  className="w-40 h-40 mx-auto rounded-xl mix-blend-multiply"
                />
                <p className="text-[10px] text-gray-500 mt-2 font-mono">
                  Skanna för att spara kontakt direkt i mobilen
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${qrModalMember.full_name}\nORG:${qrModalMember.company_name}\nTITLE:${qrModalMember.role_title}\nTEL:${qrModalMember.phone || ''}\nEMAIL:${qrModalMember.email}\nURL:${qrModalMember.linkedin_url || ''}\nEND:VCARD`;
                    const blob = new Blob([vcardData], { type: 'text/vcard' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${qrModalMember.full_name.replace(/\s+/g, '_')}_vcard.vcf`;
                    a.click();
                    URL.revokeObjectURL(url);
                    handleAwardPoints(20, `Delat QR-visitkort med ${qrModalMember.full_name}`, 'UNIVERSAL_QR_CONNECT');
                  }}
                  className="w-full py-2.5 bg-[#800020] hover:bg-[#660018] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Ladda ner vCard (.vcf kontakt)</span>
                </button>

                <button
                  onClick={() => setQrModalMember(null)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Universal QR Scanner & Check-In Modal */}
        <QrScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          currentUser={currentUser}
          selectedHub={selectedHub}
          allMembers={members}
          onCheckInHub={(hubId) => {
            handleCheckInGeoOrQr('bk_today_quick');
          }}
          onAwardPoints={handleAwardPoints}
          onOpenDirectChat={(memberId) => {
            const target = members.find(m => m.id === memberId);
            if (target) {
              handleCreateChannel(target);
              setActiveTab('chat');
            }
          }}
        />

      </div>

    </div>
  );

  // Helper to render the active module
  function renderActiveContent() {
    switch (activeTab) {
      case 'overview':
        return renderOverviewDashboard();

      case 'matchmaking':
        return (
          <MatchmakingModule
            currentUser={currentUser}
            allMembers={members}
            onOpenDirectChat={(memberId) => {
              const target = members.find(m => m.id === memberId);
              if (target) handleCreateChannel(target);
            }}
            onStartIntroWith={handleStartIntroWith}
            onAwardPoints={handleAwardPoints}
            onAddPipelineDeal={handleAddDeal}
          />
        );

      case 'chat':
        return (
          <ChatModule
            currentUser={currentUser}
            channels={channels}
            selectedChannelId={selectedChannelId}
            activeChannelId={selectedChannelId}
            messages={messagesByChannel}
            messagesByChannel={messagesByChannel}
            allMembers={members}
            onSelectChannel={setSelectedChannelId}
            onSendMessage={handleSendMessage}
            onCreateChannel={handleCreateChannel}
            onCreateIntroThread={handleCreateIntroThread}
          />
        );

      case 'webinars':
        return (
          <WebinarModule
            currentUser={currentUser}
            webinars={webinars}
            onRegisterWebinar={handleRegisterWebinar}
          />
        );

      case 'pipeline':
        return (
          <CrmPipelineModule
            currentUser={currentUser}
            pipelineItems={pipelineItems}
            onUpdateStage={handleUpdateDealStage}
            onAddDeal={handleAddDeal}
            onAwardBoosterPoints={handleAwardPoints}
          />
        );

      case 'gamification':
        return (
          <GamificationModule
            currentUser={currentUser}
            allMembers={members}
            members={members}
            hubs={INITIAL_HUBS}
            scoreLogs={scoreLogs}
            onAwardPoints={handleAwardPoints}
            onSimulateScore={handleSimulateScore}
          />
        );

      case 'academy':
        return (
          <AcademyModule
            currentUser={currentUser}
            courses={courses}
            certificates={certificates}
            mentorSlots={mentorSlots}
            quizQuestions={quizQuestions}
            onBookMentorSlot={handleBookMentorSlot}
            onAwardCertificate={handleAwardCertificate}
            onUnlockCourse={handleUnlockCourse}
            onAwardPoints={handleAwardPoints}
          />
        );

      case 'events':
        return (
          <EventBookingModule
            currentUser={currentUser}
            events={events}
            guestPasses={guestPasses}
            selectedHub={selectedHub}
            onToggleAddon={handleToggleEventAddon}
            onBookEvent={handleBookEvent}
            onCheckInEvent={handleCheckInEvent}
            onCreateGuestPass={handleCreateGuestPass}
          />
        );

      case 'skills':
        return (
          <SkillsReviewsModule
            currentUser={currentUser}
            allMembers={members}
            skills={skills}
            reviews={reviews}
            onEndorseSkill={handleEndorseSkill}
            onAddSkill={handleAddSkill}
            onAddReview={handleAddReview}
          />
        );

      case 'benefits':
        return (
          <BenefitsModule
            currentUser={currentUser}
            perks={INITIAL_PARTNER_PERKS}
          />
        );

      case 'calendar':
        return (
          <MasterCalendarModule
            currentUser={currentUser}
            events={masterEvents}
            allMembers={members}
            onBookEvent={handleBookMasterEvent}
            onCancelBooking={handleBookMasterEvent}
            onBookSpeakerOneOnOne={handleBookSpeakerOneOnOne}
            onShareEventWithMember={handleShareEventWithMember}
            onInviteMemberFreeTicket={handleInviteMemberFreeTicket}
            onAwardPoints={handleAwardPoints}
          />
        );

      case 'coworking':
        return (
          <CoworkingHubsModule
            currentUser={currentUser}
            hubs={INITIAL_HUBS}
            partnerLocations={partnerLocations}
            bookings={coworkingBookings}
            deskSwaps={deskSwaps}
            credits={memberCredits}
            onBookFlexDesk={handleBookFlexDesk}
            onCheckInGeoOrQr={handleCheckInGeoOrQr}
            onLendDeskSwap={handleLendDeskSwap}
            onClaimDeskSwap={handleClaimDeskSwap}
            onPurchaseCredits={handlePurchaseCredits}
            onUpdatePartnerAllocation={handleUpdatePartnerAllocation}
          />
        );

      case 'promos':
        return (
          <PromoAndTrialsModule
            currentUser={currentUser}
            hubs={INITIAL_HUBS}
            promoCodes={promoCodes}
            trialPasses={trialPasses}
            onCreateTrialPass={handleCreateTrialPass}
            onRedeemTrialPass={handleRedeemTrialPass}
            onCreatePromoCode={handleCreatePromoCode}
          />
        );

      case 'architecture':
        return (
          <SpecAndSchemaModule
            members={members}
            webinars={webinars}
            channels={channels}
          />
        );

      case 'community':
      case 'blog':
      case 'community_network':
        return (
          <CommunityAndBlogModule
            currentUser={currentUser}
            allMembers={members}
            onAwardPoints={handleAwardPoints}
            onOpenDirectChat={(memberId) => {
              const target = members.find(m => m.id === memberId);
              if (target) {
                handleCreateChannel(target);
                setActiveTab('chat');
              }
            }}
          />
        );

      case 'directory':
      case 'profile_settings':
        return (
          <ProfileSettingsAndDirectoryModule
            currentUser={currentUser}
            allMembers={members}
            onUpdateProfile={handleUpdateProfile}
            onFollowToggle={handleFollowToggle}
            onOpenDirectChat={(memberId) => {
              const target = members.find(m => m.id === memberId);
              if (target) {
                handleCreateChannel(target);
                setActiveTab('chat');
              }
            }}
            onOpenUniversalConnect={(member) => {
              setQrModalMember(member || currentUser);
            }}
            onSendLunchRequest={handleSendLunchRequest}
            onAwardPoints={handleAwardPoints}
            initialTab={activeTab === 'profile_settings' ? 'settings' : 'directory'}
          />
        );

      case 'home':
        return renderOverviewDashboard();

      case 'hub_events':
        return (
          <CoworkingHubsModule
            currentUser={currentUser}
            hubs={INITIAL_HUBS}
            partnerLocations={partnerLocations}
            bookings={coworkingBookings}
            deskSwaps={deskSwaps}
            credits={memberCredits}
            onBookFlexDesk={handleBookFlexDesk}
            onCheckInGeoOrQr={handleCheckInGeoOrQr}
            onLendDeskSwap={handleLendDeskSwap}
            onClaimDeskSwap={handleClaimDeskSwap}
            onPurchaseCredits={handlePurchaseCredits}
            onUpdatePartnerAllocation={handleUpdatePartnerAllocation}
          />
        );

      case 'academy_resources':
        return (
          <AcademyModule
            currentUser={currentUser}
            courses={courses}
            certificates={certificates}
            mentorSlots={mentorSlots}
            quizQuestions={quizQuestions}
            onBookMentorSlot={handleBookMentorSlot}
            onAwardCertificate={handleAwardCertificate}
            onUnlockCourse={handleUnlockCourse}
            onAwardPoints={handleAwardPoints}
          />
        );

      case 'business_profile':
        return (
          <CrmPipelineModule
            currentUser={currentUser}
            pipelineItems={pipelineItems}
            onUpdateStage={handleUpdateDealStage}
            onAddDeal={handleAddDeal}
            onAwardBoosterPoints={handleAwardPoints}
          />
        );

      case 'admin':
        return (
          <AdminPortalModule
            currentUser={currentUser}
            allMembers={members}
            hubs={INITIAL_HUBS}
            onUpdateMemberLevel={handleUpdateMemberLevel}
          />
        );

      default:
        return null;
    }
  }

  // Dashboard Overview - Bento Grid Design Theme
  function renderOverviewDashboard() {
    return (
      <div className="space-y-4">
        {/* 📢 SPONSRAD BANNER ENGINE (FEED_TOP) */}
        <AdBannerEngine 
          zone="FEED_TOP" 
          isAdmin={currentUser.membership_level === 'GOLD' || currentUser.is_admin} 
        />

        {/* Top 12-column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Bento Card 1: Professional Profile & Gamification (col-span-12 md:col-span-4) */}
          <section className="col-span-12 md:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Profil & Gamification
                </h2>
                <button
                  onClick={() => setActiveTab('gamification')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Scoreboard →
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => setActiveTab('gamification')}
                  className="p-3 bg-[#800020]/5 rounded-xl border border-[#800020]/20 cursor-pointer hover:bg-[#800020]/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Booster Score</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800020] text-white flex items-center gap-1">
                      <Trophy className="w-2.5 h-2.5" /> Level 4
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-black text-[#800020]">{currentUser.booster_score}</p>
                    <span className="text-xs text-gray-400">/ 1 000 BP</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-[#800020] h-full rounded-full transition-all" 
                      style={{ width: `${Math.min(100, (currentUser.booster_score / 1000) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {Math.max(0, 1000 - currentUser.booster_score)} BP till Level 5 Master
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2 uppercase tracking-wider text-gray-700">
                    TOP SKILLS (ENDORSED)
                  </p>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-600">
                        <span>B2B SALES & STRATEGI</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#800020] h-full w-[92%] rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-600">
                        <span>STRATEGIC PARTNERSHIP</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#800020] h-full w-[78%] rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-600">
                        <span>FINTECH & INVESTERING</span>
                        <span>64%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#800020] h-full w-[64%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 border border-dashed border-[#800020] rounded-xl bg-[#800020]/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">Aktiv Utmaning</p>
                <p className="text-xs font-medium text-gray-800">
                  Stäng 1 affär i CRM (+100 BP)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pipeline')}
                className="text-[11px] font-bold text-[#800020] hover:underline"
              >
                Gå till CRM →
              </button>
            </div>
          </section>

          {/* Bento Card 2: My Booster Pipeline (col-span-12 md:col-span-8) */}
          <section className="col-span-12 md:col-span-8 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  My Booster Pipeline
                </h2>
                <button 
                  onClick={() => setActiveTab('pipeline')}
                  className="bg-[#800020] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#580016] transition shadow-xs"
                >
                  Generate Report
                </button>
              </div>

              {/* 3 Metric cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
                <div className="bg-[#F4F5F7] p-3.5 sm:p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue Generated</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{formatSek(currentUser.deals_closed_sek)}</p>
                </div>
                <div className="bg-[#F4F5F7] p-3.5 sm:p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recommendations</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">24</p>
                </div>
                <div className="bg-[#F4F5F7] p-3.5 sm:p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Deals</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{pipelineItems.length}</p>
                </div>
              </div>

              {/* Pipeline deals table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-gray-50 grid grid-cols-4 p-2.5 sm:p-3 text-[10px] font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                  <span>Entity</span>
                  <span>Status</span>
                  <span>Potential</span>
                  <span className="text-right">Last Action</span>
                </div>
                <div className="divide-y divide-gray-50">
                  <div 
                    onClick={() => setActiveTab('pipeline')} 
                    className="grid grid-cols-4 p-2.5 sm:p-3 text-xs items-center hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <span className="font-bold text-gray-900 truncate">Global Logistics AB</span>
                    <span className="text-emerald-700 font-semibold text-[11px]">Follow-up</span>
                    <span className="text-gray-700 font-medium">120k kr</span>
                    <span className="text-gray-400 text-[11px] text-right">2h sedan</span>
                  </div>
                  <div 
                    onClick={() => setActiveTab('pipeline')} 
                    className="grid grid-cols-4 p-2.5 sm:p-3 text-xs items-center hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <span className="font-bold text-gray-900 truncate">Svea Tech Solutions</span>
                    <span className="text-amber-700 font-semibold text-[11px]">Proposal</span>
                    <span className="text-gray-700 font-medium">350k kr</span>
                    <span className="text-gray-400 text-[11px] text-right">Igår</span>
                  </div>
                  <div 
                    onClick={() => setActiveTab('pipeline')} 
                    className="grid grid-cols-4 p-2.5 sm:p-3 text-xs items-center hover:bg-gray-50/80 cursor-pointer transition"
                  >
                    <span className="font-bold text-gray-900 truncate">Nordic FinCorp</span>
                    <span className="text-blue-700 font-semibold text-[11px]">Intro Sent</span>
                    <span className="text-gray-700 font-medium">85k kr</span>
                    <span className="text-gray-400 text-[11px] text-right">10 Sep</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Sammanlagd aktiv pipeline: <strong>{formatSek(555000)}</strong></span>
              <button 
                onClick={() => setActiveTab('pipeline')} 
                className="text-xs text-[#800020] font-bold hover:underline"
              >
                Öppna CRM Kanban →
              </button>
            </div>
          </section>

          {/* Bento Card 4: Live Webinar Engine (col-span-12 md:col-span-8 - Maroon Bento Theme) */}
          <section className="col-span-12 md:col-span-8 bg-[#800020] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center overflow-hidden relative shadow-sm text-white gap-6">
            <div className="relative z-10 max-w-xl">
              <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded mb-2.5 inline-block uppercase tracking-wider">
                Live Webinar Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-display">
                Scaling Digital Assets with <br className="hidden sm:block" />Matchmaking AI Architecture
              </h3>
              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Interaktiv live-sändning med realtidsomröstning och Q&A för verifierade medlemmar.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setActiveTab('webinars')}
                  className="bg-white text-[#800020] px-5 py-2 rounded-full font-bold text-xs uppercase hover:bg-gray-100 transition shadow-sm"
                >
                  Gå till Live Stream
                </button>
                <button
                  onClick={() => setActiveTab('webinars')}
                  className="bg-transparent border border-white text-white px-5 py-2 rounded-full font-bold text-xs uppercase hover:bg-white/10 transition"
                >
                  Kalender (.ics)
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 relative z-10 flex-shrink-0">
              <div className="bg-black/20 p-3.5 sm:p-4 rounded-xl border border-white/10 text-center w-24 backdrop-blur-sm shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-white">120</p>
                <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Registered</p>
              </div>
              <div className="bg-black/20 p-3.5 sm:p-4 rounded-xl border border-white/10 text-center w-24 backdrop-blur-sm shadow-xs">
                <p className="text-xl sm:text-2xl font-bold text-white">14</p>
                <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Questions</p>
              </div>
            </div>

            {/* Ambient Bento glow */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          </section>

          {/* Bento Card 5: Smart Hub Radar & Geo-fencing (col-span-12 md:col-span-4) */}
          <section className="col-span-12 md:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Geo-fencing Radar</span>
                </h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  Aktiv Radar
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-semibold text-emerald-950">
                  <span>{selectedHub.name}</span>
                  <span className="text-emerald-700 font-bold">18m kvar (Inom radie)</span>
                </div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  Du befinner dig inom radien ({selectedHub.radius_m}m). Närvaron registreras och deltagarlistan synkas automatiskt.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setActiveTab('events')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-xs"
              >
                Incheckning & QR-skanner →
              </button>
            </div>
          </section>

          {/* Bento Card 6: AI Matchmaking Spotlight (col-span-12 md:col-span-6) */}
          <section className="col-span-12 md:col-span-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                  <span>AI Lead Match Spotlight</span>
                </h2>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#800020] text-white">
                  98% Match
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F5F7] flex items-start gap-3.5 border border-gray-100">
                <img
                  src={INITIAL_MEMBERS[1].avatar}
                  alt={INITIAL_MEMBERS[1].full_name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#800020] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{INITIAL_MEMBERS[1].full_name}</h4>
                  <p className="text-xs text-gray-500 truncate">{INITIAL_MEMBERS[1].role_title} • {INITIAL_MEMBERS[1].company_name}</p>
                  <p className="text-xs text-gray-700 mt-1.5">
                    Erbjuder: <strong>{INITIAL_MEMBERS[1].offering_tags.join(', ')}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => handleCreateChannel(INITIAL_MEMBERS[1])}
                className="flex-1 px-3 py-2 rounded-lg bg-[#800020] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#580016] transition text-center shadow-xs"
              >
                Starta Direktchatt
              </button>
              <button
                onClick={() => handleStartIntroWith(INITIAL_MEMBERS[1].id)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition text-center"
              >
                3-Partsmatchning
              </button>
            </div>
          </section>

          {/* Bento Card 7: VIP Gästpass & Partnerperks (col-span-12 md:col-span-6) */}
          <section className="col-span-12 md:col-span-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>VIP Gästpass & Partnerförmåner</span>
                </h2>
                <button
                  onClick={() => setActiveTab('benefits')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Se alla förmåner →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    <span>Aktivt Gästpass</span>
                    <span>Giltigt</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{guestPasses[0]?.guest_name}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{guestPasses[0]?.code}</p>
                </div>

                <div className="p-3 bg-[#F4F5F7] border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    <span>Hotell & Konferens</span>
                    <span className="text-[#800020]">-20%</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">Grand Hôtel Nordic Lounges</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">VIP-access & frukostmöten</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setActiveTab('events')}
                className="w-full py-2 px-3 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition text-center shadow-xs"
              >
                Skapa Nytt Gästpass (VIP) →
              </button>
            </div>
          </section>

          {/* Bento Card 8: Executive Academy & Certifikat (col-span-12 md:col-span-7) */}
          <section className="col-span-12 md:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#800020]" />
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Booster Friends Executive Academy
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('academy')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Utforska alla kurser ({courses.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setActiveTab('academy')}
                  className="p-3.5 bg-[#F4F5F7] rounded-xl border border-gray-200 hover:border-[#800020]/40 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {courses[0]?.is_unlocked ? 'LÅST UPP' : 'BOOSTER PACK'}
                      </span>
                      <span className="text-gray-400">{courses[0]?.duration_hours}h</span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mt-1">
                      {courses[0]?.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {courses[0]?.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-bold text-[#800020]">
                    <span>Starta Quiz & Certifiering</span>
                    <span>→</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('academy')}
                  className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 hover:border-amber-400 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1 text-amber-800">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" /> DIPLOM VERIFIERAT
                      </span>
                      <span className="font-mono">QR KOD</span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mt-1">
                      {certificates[0]?.course_title || 'Enterprise B2B Sales'}
                    </h4>
                    <p className="text-[11px] text-gray-600 mt-1 font-mono">
                      Kod: {certificates[0]?.certificate_code}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between text-[10px] font-bold text-amber-800">
                    <span>Visa & Ladda ner PDF</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Mentor Office Hours tillgängliga denna vecka</span>
              </div>
              <button
                onClick={() => setActiveTab('academy')}
                className="px-3 py-1.5 rounded-lg bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs"
              >
                Boka Mentor Sparring
              </button>
            </div>
          </section>

          {/* Bento Card 9: Hub Battle & Gamification Standings (col-span-12 md:col-span-5) */}
          <section className="col-span-12 md:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Månadens Hubb Battle
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('gamification')}
                  className="text-xs text-[#800020] font-bold hover:underline"
                >
                  Topplista →
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Hubb Stockholm City', points: '745 BP / medl', isCurrent: true },
                  { rank: 2, name: 'Hubb Göteborg Avenyn', points: '692 BP / medl', isCurrent: false },
                  { rank: 3, name: 'Hubb Malmö Dockan', points: '620 BP / medl', isCurrent: false }
                ].map((item) => (
                  <div
                    key={item.rank}
                    onClick={() => setActiveTab('gamification')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      item.isCurrent 
                        ? 'bg-[#800020]/5 border-[#800020]/30' 
                        : 'bg-[#F4F5F7] border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        item.rank === 1 ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {item.rank}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{item.name}</span>
                      {item.isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#800020] text-white">
                          Din Hubb
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#800020] font-mono">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Omgången avslutas om 18 dagar</span>
              <button
                onClick={() => setActiveTab('gamification')}
                className="text-xs font-bold text-[#800020] hover:underline"
              >
                Bidra med poäng →
              </button>
            </div>
          </section>

        </div>
      </div>
    );
  }
}
