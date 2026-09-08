export type MembershipLevel = 'BRONZE' | 'SILVER' | 'GOLD';

export type MainTabKey = 
  | 'home' 
  | 'hub_events' 
  | 'community_network' 
  | 'academy_resources' 
  | 'business_profile';

export type TabKey = 
  | MainTabKey
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
  | 'community'
  | 'blog'
  | 'directory'
  | 'profile_settings'
  | 'admin'
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
  is_admin?: boolean;
  linkedin_url?: string;
  website_url?: string;
  target_audience?: string;
  interest_tags?: string[];
  interests?: string[];
  linkedin_posts?: { title: string; url: string; date: string }[];
  following_member_ids?: string[];
  give_take_ratio?: number;
  merits?: MemberMerit[];
  case_studies?: MemberCaseStudy[];
  cv_summary?: string;
  cv_filename?: string;
  linked_posts?: {
    id: string;
    title: string;
    snippet: string;
    likes_count: number;
    url: string;
  }[];
}

export interface MemberMerit {
  id: string;
  category: 'BOARD_ROLE' | 'CERTIFICATION' | 'EDUCATION' | 'AWARD' | 'EXPERIENCE';
  title: string;
  organization: string;
  year: string;
  description?: string;
  verified?: boolean;
}

export interface MemberCaseStudy {
  id: string;
  title: string;
  client_name: string;
  result_metric: string;
  description: string;
  tags: string[];
  image_url?: string;
  link_url?: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  placement: 'FEED_TOP' | 'CALENDAR_SIDEBAR' | 'HUB_HEADER';
  is_active: boolean;
}

export interface LunchRequest {
  id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  sender_company?: string;
  receiver_id: string;
  receiver_name?: string;
  receiver_avatar?: string;
  proposed_date: string;
  location: string;
  host_pays: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  note?: string;
  created_at?: string;
}

export interface EventRecap {
  event_id: string;
  recap_text: string;
  gallery_images: string[];
  average_rating: number;
  reviews: {
    member_id: string;
    rating: number;
    comment: string;
    member_name?: string;
    member_avatar?: string;
    created_at?: string;
  }[];
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
  | 'DEAL_WON'            // Scaled based on deal value (+30, +75, +150, +300 BP)
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
  | 'LUNCH_HOST_INVITE'   // +30 BP ("Jag bjuder på lunchen")
  | 'PROMO_REDEEMED'      // +20 BP
  | 'TRIAL_PASS_CREATED'  // +10 BP
  | 'TRIAL_PASS_REDEEMED' // +50 BP
  | 'TRIAL_GUEST_CHECKIN' // +50 BP
  | 'REFERRAL_SENT'       // +15 BP
  | 'EVENT_INVITE_SENT'   // +15 BP
  | 'P2P_TIP_SENT'        // Sent from monthly allowance (0 score deducted)
  | 'P2P_TIP_RECEIVED'    // +10 / +25 / +50 BP received from peer
  | 'EVENT_REVIEW_SUBMITTED' // +10 BP (+20 BP if within 24 hours)
  | 'MEMBER_REVIEW_5STAR' // +25 BP
  | 'UNIVERSAL_QR_CONNECT' // +20 BP
  | 'AI_INTRO_REQUEST'    // +40 BP
  | 'PROFILE_FOLLOW'      // +5 BP
  | 'PROFILE_UPDATE'      // +15 BP
  | 'REWARD_REDEEMED';    // Negative points cost (e.g. -250 BP)

export interface BoosterScoreLog {
  id: string;
  member_id: string;
  points_awarded: number;
  activity_type: ActivityType;
  title: string;
  description?: string;
  created_at: string;
  reference_id?: string;
  verification_method?: 'QR' | 'TWO_WAY' | 'GEO' | 'WARM_INTRO' | 'SYSTEM' | 'P2P';
  multiplier_applied?: number;
  base_points?: number;
}

export interface P2PPointTransfer {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  receiver_id: string;
  receiver_name: string;
  receiver_avatar?: string;
  points: number; // e.g. 10, 25, 50
  message: string;
  created_at: string;
}

export interface P2PAllowance {
  member_id: string;
  monthly_allowance: number; // 100 BP default
  used_allowance: number;
  reset_date: string;
}

export interface GiveTakeMetrics {
  give_count: number;
  take_count: number;
  ratio: number; // give / take
  status: 'GENEROUS' | 'BALANCED' | 'CONSUMER';
  multiplier: number; // 1.25, 1.0, or 0.75
  give_breakdown: {
    intros_sent: number;
    skill_endorsements: number;
    desk_swaps_lent: number;
    guest_passes_invited: number;
    lunch_hosted: number;
  };
  take_breakdown: {
    deals_received: number;
    intros_received: number;
    coworking_desks_used: number;
  };
}

export interface RewardShopItem {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  category: 'FLEX_PASS' | 'WEBINAR_HOST' | 'STAGE_PITCH' | 'COURSE_DISCOUNT';
  icon: string;
  is_available: boolean;
  action_label: string;
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

export interface EventGalleryImage {
  id: string;
  url: string;
  caption: string;
  author_name: string;
  author_avatar?: string;
}

export interface EventReview {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_verified?: boolean;
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
  // V9 Past Event & Community Expansion
  is_past?: boolean;
  recap_text?: string;
  gallery_images?: EventGalleryImage[];
  event_reviews?: EventReview[];
  rating_avg?: number;
  reviews_count?: number;
  impact_stats?: {
    meetings_count: number;
    intros_count: number;
    deals_sek?: number;
  };
  checked_in_members?: CalendarAttendee[];
  is_member_created?: boolean;
  creator_member_id?: string;
  creator_member_name?: string;
  creator_member_avatar?: string;
  creator_member_level?: MembershipLevel;
  platform_fee_percent?: number;
  video_highlight_url?: string;
}

export interface LunchInvitation {
  id: string;
  sender_member_id: string;
  sender_name: string;
  sender_avatar: string;
  sender_company: string;
  receiver_member_id: string;
  receiver_name: string;
  receiver_avatar?: string;
  location_name: string;
  proposed_date: string;
  invitation_type: 'LUNCH' | 'COFFEE' | 'MEETING';
  host_pays: boolean; // "Jag bjuder på lunchen!"
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  notes?: string;
  created_at: string;
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

// V10 Intro-AI, Network Graph, Micro-Hubs & Cadence Follow-up
export interface IntroRequest {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_company: string;
  author_role: string;
  target_role_or_company: string; // T.ex. "Inköpschef på Bolag Y"
  description: string;
  bounty_bp: number; // T.ex. 50
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';
  connector_member_id?: string;
  connector_member_name?: string;
  created_at: string;
  comments_count: number;
}

export interface NetworkGraphNode {
  id: string;
  member_id: string;
  full_name: string;
  company_name: string;
  avatar: string;
  role: string;
  introduced_by_id?: string;
  introduced_by_name?: string;
  is_trust_circle: boolean; // Ambassadör / Nyckelkontakt
  deals_generated_sek?: number;
  connection_tier: 1 | 2 | 3;
}

export interface MicroHubGroup {
  id: string;
  title: string;
  category: string;
  description: string;
  city?: string;
  icon_name?: string;
  member_count: number;
  is_member: boolean;
  is_exclusive_gold: boolean;
  lead_member_name: string;
  upcoming_mini_event?: string;
}

export interface SpeedNetworkingMatch {
  round_number: number;
  partner_id: string;
  partner_name: string;
  partner_company: string;
  partner_role: string;
  partner_avatar: string;
  matching_synergy: string;
  duration_minutes: number;
  timer_seconds: number;
  is_active: boolean;
  meeting_link: string;
}

// V11 & V12 Community, Blog, Weighted Upvotes & Following
export type CommunityPostType = 'FORUM_THREAD' | 'ARTICLE' | 'LINKEDIN_EMBED' | 'POLL';

export interface CommunityPollOption {
  id: string;
  text: string;
  votes: number;
  has_voted?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_company: string;
  author_level: MembershipLevel;
  content: string;
  upvotes: number;
  has_upvoted: boolean;
  is_best_answer: boolean; // Trådskaparen markerar (+25 BP)
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_company: string;
  author_role: string;
  author_level: MembershipLevel;
  author_booster_score: number;
  post_type: CommunityPostType;
  category: 'ALLMANT' | 'AFFARER_LEADS' | 'FRAGA_EXPERTERNA' | 'VERKTYG_TIPS' | 'LOKALT_HUBBEN';
  title: string;
  content: string;
  image_url?: string;
  linkedin_post_url?: string;
  linkedin_preview?: {
    author: string;
    headline: string;
    text: string;
    likes_count: number;
    embed_date: string;
  };
  poll_options?: CommunityPollOption[];
  tags: string[];
  upvotes_count: number;
  weighted_score: number;
  has_upvoted: boolean;
  comments_count: number;
  comments?: PostComment[];
  is_best_answer_awarded?: boolean;
  created_at: string;
  read_time_min?: number;
  is_featured?: boolean;
  fact_check_status?: 'VERIFIED' | 'PENDING' | 'DISPUTED';
  fact_check_details?: {
    verified_by?: string;
    verified_date?: string;
    summary?: string;
    source_citation?: string;
  };
}

export interface MemberFollow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

// V11 Admin Panel
export interface AdminKpiStats {
  total_members: number;
  bronze_count: number;
  silver_count: number;
  gold_count: number;
  total_pipeline_deal_value_sek: number;
  active_monthly_checkins: number;
  monthly_churn_rate_percent: number;
}

export interface BannerAd {
  id: string;
  title: string;
  advertiser_name: string;
  placement: 'FEED_TOP' | 'CALENDAR_SIDEBAR' | 'HUB_PORTAL';
  image_url: string;
  target_url: string;
  is_active: boolean;
  impressions_count: number;
  clicks_count: number;
}

export interface AdminMemberApplication {
  id: string;
  applicant_name: string;
  company_name: string;
  org_number: string;
  email: string;
  phone: string;
  hub_requested: string;
  requested_level: MembershipLevel;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applied_at: string;
  financial_score: string;
}
