export type MembershipLevel = 'BRONZE' | 'SILVER' | 'GOLD';

export type TabKey = 
  | 'overview' 
  | 'calendar'
  | 'coworking'
  | 'promos'
  | 'pipeline' 
  | 'gamification' 
  | 'academy' 
  | 'chat' 
  | 'webinars' 
  | 'matchmaking' 
  | 'events' 
  | 'skills' 
  | 'benefits' 
  | 'architecture';

export interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  role_title: string;
  membership_level: MembershipLevel;
  booster_score: number;
  hub_id: string;
  hub_name: string;
  avatar: string;
  bio: string;
  seeking_tags: string[];
  offering_tags: string[];
  city: string;
  deals_closed_sek: number;
  referrals_sent: number;
  rating_avg: number;
  reviews_count: number;
  created_at: string;
  is_online?: boolean;
}

export interface Hub {
  id: string;
  name: string;
  city: string;
  address: string;
  member_count: number;
  meeting_day: string;
  next_event_title: string;
  next_event_date: string;
  geofence_lat: number;
  geofence_lng: number;
  radius_m: number;
}

export type ChannelType = 'DIRECT' | 'GROUP' | 'HUB' | 'EVENT' | 'INTRO';

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  message_text: string;
  attachment_url?: string;
  attachment_type?: 'image' | 'vCard' | 'document' | 'meeting_invite';
  attachment_metadata?: {
    title?: string;
    subtitle?: string;
    file_size?: string;
    meeting_time?: string;
    vcard_phone?: string;
    vcard_email?: string;
  };
  created_at: string;
  read_by_ids?: string[];
  is_self?: boolean;
}

export interface ChatChannel {
  id: string;
  channel_type: ChannelType;
  title: string;
  name?: string;
  role?: string;
  description?: string;
  member_ids?: string[];
  member_id?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  avatar_url?: string;
  avatar?: string;
  is_online?: boolean;
  is_intro_thread?: boolean;
  intro_data?: {
    introducer_name: string;
    introduced_names: [string, string];
    context: string;
  };
}

export interface WebinarPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface WebinarPoll {
  id: string;
  question: string;
  options: WebinarPollOption[];
  hasVoted?: boolean;
}

export interface WebinarQnAItem {
  id: string;
  author_name: string;
  question: string;
  upvotes: number;
  is_answered: boolean;
  user_upvoted?: boolean;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  host_member_id: string;
  host_name: string;
  host_role: string;
  host_company: string;
  start_time: string;
  stream_url: string;
  recording_url?: string;
  required_membership_level: MembershipLevel;
  category: string;
  duration_min: number;
  attendee_count: number;
  is_live: boolean;
  is_registered?: boolean;
  active_poll?: WebinarPoll;
  qna_items?: WebinarQnAItem[];
  slides_url?: string;
}

export interface MemberSkill {
  id: string;
  member_id: string;
  skill_name: string;
  endorsements_count: number;
  max_capacity: number; // for visual skillbar fill percentage
  endorsers: string[]; // names of endorsers
  has_endorsed?: boolean;
}

export interface Review {
  id: string;
  author_member_id: string;
  author_name: string;
  author_company: string;
  target_type: 'MEMBER' | 'HUB' | 'EVENT';
  target_id: string;
  target_title: string;
  rating: number; // 1-5
  review_text: string;
  created_at: string;
}

export type PipelineStage = 
  | 'lead'          // 1. Identifierad Möjlighet (Lead)
  | 'intro_sent'     // 2. Introduktion Skickad / Begärd
  | 'meeting_done'   // 3. 1-till-1 Möte Inbokat / Genomfört
  | 'proposal'       // 4. Offert / Samarbetsexploring
  | 'closed_won'     // 5. Stängd Affär (Won Deal) (+100 BP trigger)
  | 'contact';       // Alias / backwards-compatible with meeting_done

export interface DealPipelineItem {
  id: string;
  title: string;
  client_company: string;
  contact_person: string;
  contact_member_id?: string;
  contact_member_avatar?: string;
  referral_source?: string;
  value_sek: number;
  stage: PipelineStage;
  probability: number;
  next_step: string;
  due_date: string;
  notes?: string;
  created_at?: string;
  won_at?: string;
  points_awarded?: boolean;
}

export type ActivityType = 
  | 'EVENT_CHECKIN'       // +30 BP
  | 'EVENT_ATTENDED'      // +20 BP
  | 'MEETING_CONFIRMED'   // +20 BP
  | 'ONE_ON_ONE_LOGGED'   // +20 BP
  | 'INTRO_3WAY'          // +40 BP
  | 'INTRO_3_WAY'         // +40 BP alias
  | 'INTRO_MADE'          // +40 BP
  | 'DEAL_WON'            // +100 BP
  | 'WEBINAR_ATTEND'      // +15 BP
  | 'SKILL_ENDORSEMENT'   // +10 BP
  | 'GUEST_PASS_ATTEND'   // +50 BP
  | 'COURSE_COMPLETED'    // +75 BP
  | 'MENTOR_SESSION'      // +30 BP
  | 'DESK_SWAP_LEND'      // +25 BP
  | 'DESK_SWAP_LENT'      // +25 BP
  | 'DESK_SWAP_CLAIMED'   // +15 BP
  | 'FLEX_DESK_BOOKED'    // +15 BP
  | 'HUB_CHECK_IN'        // +30 BP
  | 'HUB_GEO_CHECKIN'     // +30 BP
  | 'LUNCH_A_FRIEND'      // +20 BP
  | 'PROMO_REDEEMED'      // +20 BP
  | 'TRIAL_PASS_CREATED'  // +10 BP
  | 'TRIAL_PASS_REDEEMED' // +50 BP
  | 'TRIAL_GUEST_CHECKIN' // +50 BP
  | 'REFERRAL_SENT'       // +15 BP
  | 'EVENT_INVITE_SENT';  // +15 BP

export interface BoosterScoreLog {
  id: string;
  member_id: string;
  points_awarded: number;
  activity_type: ActivityType;
  title: string;
  description?: string;
  created_at: string;
  reference_id?: string;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Mjuka Kompetenser' | 'B2B Tillväxt & Skalning' | 'Ledarskap & Mentorskap' | 'Styrelse & Finans';
  level_required: MembershipLevel;
  booster_pack_price_sek?: number;
  duration_hours: number;
  instructor_name: string;
  instructor_role: string;
  instructor_avatar: string;
  modules_count: number;
  has_certificate: boolean;
  is_unlocked?: boolean;
  learning_outcomes: string[];
}

export interface Certificate {
  id: string;
  certificate_code: string;
  member_id: string;
  member_name: string;
  course_id: string;
  course_title: string;
  instructor_name: string;
  instructor_role: string;
  issue_date: string;
  verification_url: string;
  score_percent: number;
  skills_covered: string[];
  pdf_url?: string;
}

export interface MentorSlot {
  id: string;
  mentor_id: string;
  mentor_name: string;
  mentor_role: string;
  mentor_avatar: string;
  company: string;
  speciality: string;
  date_str: string;
  time_slot: string;
  duration_min: number;
  is_booked: boolean;
  booked_by_member_id?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface EventAddon {
  id: string;
  name: string;
  price_sek: number;
  description: string;
  icon: string;
  selected?: boolean;
}

export interface BoosterEvent {
  id: string;
  title: string;
  hub_id: string;
  hub_name: string;
  date_str: string;
  time_str: string;
  location: string;
  base_price_sek: number;
  description: string;
  spots_left: number;
  addons: EventAddon[];
  is_booked?: boolean;
  is_checked_in?: boolean;
}

export interface GuestPass {
  id: string;
  code: string;
  issued_by_member_id?: string;
  invited_by_member_id?: string;
  guest_name: string;
  guest_email: string;
  guest_company: string;
  target_hub: string;
  target_date: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  created_at?: string;
}

export interface PartnerPerk {
  id: string;
  partner_name: string;
  category: 'Hotell & Resor' | 'Restaurang & Möten' | 'B2B Tjänster' | 'Hälsa & Fritid';
  discount_badge: string;
  description: string;
  terms: string;
  promo_code: string;
  qr_value: string;
  logo: string;
}

// ==========================================================
// BOOSTER FRIENDS V6 & V7: MASTERKALENDER, COWORKING, DESK SWAP & PROMOS
// ==========================================================

export type CalendarEventCategory = 
  | 'HUB_MEETING'          // Fysiska Hubbträffar & Frukostmingel
  | 'WEBINAR'              // Webinars & Digitala sändningar
  | 'COWORKING_THEME'      // Coworking-dagar & Temadagar (t.ex. Sälj-fredag)
  | 'ACADEMY_WORKSHOP'     // Utbildningar & Workshops
  | 'SPEED_DATING';        // B2B Speed Dating Sessions (Strukturerade 1-1 snabbmöten)

export interface SpeakerOneOnOneOption {
  enabled: boolean;
  speaker_name: string;
  speaker_title?: string;
  speaker_avatar?: string;
  duration_minutes: number;       // t.ex. 25 eller 30 min
  price_sek: number;              // t.ex. 1490 kr eller 0 kr vid förmån
  total_slots: number;            // t.ex. 3
  booked_slots: number;           // t.ex. 1
  description: string;            // Vad som ingår i 1-1 rådgivningen
  is_booked_by_user?: boolean;
  available_time_slots?: string[]; // t.ex. ["10:00 - 10:30", "10:35 - 11:05", "11:10 - 11:40"]
  selected_time_slot?: string;
}

export interface SpeedDatingDetails {
  rounds_count: number;          // Antal omgångar (t.ex. 8 eller 10)
  minutes_per_round: number;     // Minuter per bordssamtal (t.ex. 6 min)
  matching_algorithm: string;    // "AI-matchat schema efter bransch och synergier"
  format: 'PHYSICAL_TABLES' | 'DIGITAL_BREAKOUT_ROOMS';
  rotations_type: string;        // "Strukturerade rotationer med klockringning"
}

export interface CalendarAttendee {
  id: string;
  full_name: string;
  role_title: string;
  company_name: string;
  avatar: string;
  booster_score: number;
  membership_level: MembershipLevel;
  industry: string;
  competence_tag: string;
  invited_by_name?: string;
  is_free_guest_ticket?: boolean;
}

export interface EventInvitation {
  id: string;
  event_id: string;
  invited_member_id?: string;
  invited_member_name: string;
  invited_member_avatar?: string;
  invited_member_company?: string;
  invited_by_id: string;
  invited_by_name: string;
  is_free_ticket: boolean;
  original_price_sek: number;
  status: 'INVITED' | 'CONFIRMED';
  created_at: string;
}

export interface MasterCalendarEvent {
  id: string;
  title: string;
  description: string;
  category: CalendarEventCategory;
  hub_id?: string;
  hub_name?: string;
  is_digital: boolean;
  date_str: string;        // YYYY-MM-DD
  display_date: string;    // T.ex. "Torsdag 12 Sep"
  start_time: string;      // "07:30"
  end_time: string;        // "09:30"
  location: string;
  required_level: MembershipLevel;
  spots_max: number;
  attendees_count: number;
  attendees: CalendarAttendee[];
  is_booked?: boolean;
  speaker_or_host?: string;
  ics_download_name?: string;
  speaker_one_on_one?: SpeakerOneOnOneOption;
  speed_dating_details?: SpeedDatingDetails;
  price_sek?: number;                     // 0 eller undefined för fria event, > 0 för betalevent
  allows_free_member_invites?: boolean;   // Om medlemskap tillåter att bjuda in andra medlemmar fritt
  free_invites_allowed_level?: MembershipLevel; // Miniminivå för fri inbjudan (default 'GOLD')
  free_invites_quota?: number;            // Antal fria gäster per behörig medlem (t.ex. 2 st)
  invitations?: EventInvitation[];
}

export interface CoworkingDeskBooking {
  id: string;
  hub_id: string;
  hub_name: string;
  is_partner_location?: boolean;
  partner_location_id?: string;
  member_id: string;
  member_name: string;
  member_avatar: string;
  member_company: string;
  member_role: string;
  competence_tags: string[];
  booking_date: string;
  slot_type: 'FULL_DAY' | 'AM' | 'PM';
  is_checked_in: boolean;
  check_in_time?: string;
  check_in_method?: 'QR' | 'GEO';
  created_at: string;
}

export interface MemberCoworkingCredits {
  member_id: string;
  included_monthly_quota: number; // 0 for Bronze, 2 for Silver, 5 for Gold
  used_monthly_quota: number;
  purchased_extra_credits: number; // Single pass / 5-klippkort
  unlimited_month_pass_active: boolean;
  expires_at?: string;
}

export interface PartnerCoworkingLocation {
  id: string;
  name: string;
  brand_group: 'Convendum' | 'United Spaces' | 'Mindpark' | 'Helio' | 'The Park' | 'Oberoende';
  address: string;
  city: string;
  daily_desk_allocation: number; // Antal platser vika för Booster Friends
  available_today: number;
  policy_allow_desk_swap: boolean;
  amenities: string[];
  opening_hours: string;
  wifi_network: string;
  wifi_pass: string;
  image_url: string;
  contact_person: string;
  contact_email: string;
  phone: string;
  rating_score: number;
}

export interface DeskSwap {
  id: string;
  lender_member_id: string;
  lender_member_name: string;
  lender_member_avatar: string;
  lender_company: string;
  location_id: string;
  location_name: string;
  is_partner_location: boolean;
  available_date: string; // YYYY-MM-DD
  desk_label: string; // t.ex. "Plats 14A (Fönsterplats, Tyst zon)"
  notes: string;
  status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED';
  borrower_member_id?: string;
  borrower_member_name?: string;
  borrower_member_avatar?: string;
  points_awarded: boolean;
  created_at: string;
}

export type PromoDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_CREDITS';

export interface PromoCode {
  id: string;
  code: string;
  discount_type: PromoDiscountType;
  discount_value: number; // 20 for 20%, 500 for 500 SEK, 3 for 3 credits
  campaign_name: string;
  description: string;
  target_applicable: 'ALL' | 'SILVER_MEMBERSHIP' | 'GOLD_MEMBERSHIP' | 'BOOSTER_PACK' | 'COWORKING_PASS';
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  hub_attribution?: string;
  ambassador_member_id?: string;
}

export interface FreeTrialPass {
  id: string;
  code: string;
  guest_name: string;
  guest_email: string;
  guest_company: string;
  invited_by_member_id?: string;
  invited_by_member_name?: string;
  target_hub_id: string;
  target_hub_name: string;
  pass_date: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  includes_breakfast: boolean;
  created_at: string;
  claimed_at?: string;
}

export interface LunchMatch {
  id: string;
  city: string;
  match_date: string; // Torsdag/Tisdag
  member_a_id: string;
  member_a_name: string;
  member_a_avatar: string;
  member_a_role: string;
  member_a_company: string;
  member_a_seeking: string[];
  member_b_id: string;
  member_b_name: string;
  member_b_avatar: string;
  member_b_role: string;
  member_b_company: string;
  member_b_offering: string[];
  suggested_restaurant: string;
  restaurant_address: string;
  synergy_reason: string;
  status: 'PROPOSED' | 'CONFIRMED' | 'COMPLETED';
  points_awarded: boolean;
}

export interface CommunityResource {
  id: string;
  hub_id: string;
  hub_name: string;
  name: string;
  category: 'PODCAST_STUDIO' | 'PHOTO_STUDIO' | '3D_PRINTER' | 'AV_GEAR';
  description: string;
  equipment_list: string[];
  hourly_rate_sek: number; // 0 kr för Guld (inkluderat 2h/mån), rabatterat Silver
  image_url: string;
  is_available: boolean;
  current_booking_note?: string;
}

export interface FlashDeal {
  id: string;
  partner_name: string;
  partner_logo?: string;
  category: 'MEETING_ROOM' | 'HOTEL' | 'RESTAURANT' | 'COWORKING';
  title: string;
  description: string;
  original_price_sek: number;
  deal_price_sek: number;
  discount_percent: number;
  expires_at: string; // T.ex. "Idag kl 16:00"
  location: string;
  remaining_deals: number;
  claimed_by_user?: boolean;
}
