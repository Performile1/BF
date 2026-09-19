-- ==============================================================================
-- BOOSTER FRIENDS V12 - PRODUCTION SUPABASE DATABASE SCHEMA
-- Target Database: PostgreSQL 15+ / Supabase
-- Architecture: Multi-tenant, Strict RLS, Event Sourcing Ledger for Booster Points
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------
CREATE TYPE membership_level AS ENUM ('BRONZE', 'SILVER', 'GOLD');
CREATE TYPE payment_status AS ENUM ('PAID', 'DUE', 'OVERDUE', 'TRIAL', 'PAUSED', 'SUSPENDED_PAYMENT');
CREATE TYPE billing_cycle_type AS ENUM ('MONTHLY', 'ANNUAL');
CREATE TYPE ad_format_type AS ENUM ('FULL_WIDTH', 'SIDEBAR', 'IN_FEED', 'COMPACT', 'PANORAMA', 'CUSTOM');
CREATE TYPE ad_pricing_model AS ENUM ('FIXED_MONTHLY', 'CPM');
CREATE TYPE ad_campaign_status AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'EXPIRED', 'PAUSED');
CREATE TYPE merit_category AS ENUM ('BOARD_ROLE', 'CERTIFICATION', 'EDUCATION', 'AWARD', 'EXPERIENCE');
CREATE TYPE proximity_ping_type AS ENUM ('COFFEE', 'LUNCH');
CREATE TYPE proximity_ping_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');
CREATE TYPE meeting_type AS ENUM ('ONE_TO_ONE', 'GROUP');
CREATE TYPE meeting_status AS ENUM ('DRAFT', 'SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE meeting_participant_role AS ENUM ('HOST', 'INVITEE', 'ATTENDEE');
CREATE TYPE meeting_participant_status AS ENUM ('ACCEPTED', 'PENDING', 'DECLINED');
CREATE TYPE meeting_provider AS ENUM ('GOOGLE_MEET', 'MICROSOFT_TEAMS', 'ZOOM', 'SIMULATED');
CREATE TYPE calendar_category AS ENUM ('HUB_MEETING', 'WEBINAR', 'COWORKING_THEME', 'ACADEMY_WORKSHOP', 'SPEED_DATING');
CREATE TYPE coworker_slot_type AS ENUM ('FULL_DAY', 'AM', 'PM');
CREATE TYPE checkin_method_type AS ENUM ('QR', 'GEO', 'MANUAL');
CREATE TYPE desk_swap_status AS ENUM ('AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELLED');
CREATE TYPE promo_discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_CREDITS');
CREATE TYPE pass_status AS ENUM ('ACTIVE', 'USED', 'EXPIRED');
CREATE TYPE pipeline_stage AS ENUM ('lead', 'intro_sent', 'meeting_done', 'proposal', 'closed_won', 'contact');
CREATE TYPE community_post_type AS ENUM ('FORUM_THREAD', 'ARTICLE', 'LINKEDIN_EMBED', 'POLL');
CREATE TYPE community_category AS ENUM ('ALLMANT', 'AFFARER_LEADS', 'FRAGA_EXPERTERNA', 'VERKTYG_TIPS', 'LOKALT_HUBBEN');
CREATE TYPE fact_check_status AS ENUM ('VERIFIED', 'PENDING', 'DISPUTED', 'UNVERIFIED', 'MISLEADING');
CREATE TYPE intro_request_status AS ENUM ('OPEN', 'IN_PROGRESS', 'FULFILLED');
CREATE TYPE channel_type AS ENUM ('DIRECT', 'GROUP', 'HUB', 'EVENT', 'INTRO');
CREATE TYPE ticker_event_type AS ENUM ('NEW_MEMBER', 'COFFEE_PING', 'BADGE_EARNED', 'EVENT_CREATED', 'CASE_ADDED', 'SYSTEM_ANNOUNCEMENT');
CREATE TYPE activity_type_enum AS ENUM (
  'EVENT_CHECKIN', 'EVENT_ATTENDED', 'MEETING_CONFIRMED', 'ONE_ON_ONE_LOGGED', 'MEETING_1ON1',
  'WEB_MEETING_CREATED', 'INTRO_3WAY', 'INTRO_3_WAY', 'INTRO_MADE', 'DEAL_WON', 'WEBINAR_ATTEND',
  'SKILL_ENDORSEMENT', 'GUEST_PASS_ATTEND', 'COURSE_COMPLETED', 'MENTOR_SESSION', 'DESK_SWAP_LEND',
  'DESK_SWAP_LENT', 'DESK_SWAP_CLAIMED', 'FLEX_DESK_BOOKED', 'HUB_CHECK_IN', 'HUB_GEO_CHECKIN',
  'LUNCH_A_FRIEND', 'LUNCH_HOST_INVITE', 'PROMO_REDEEMED', 'TRIAL_PASS_CREATED', 'TRIAL_PASS_REDEEMED',
  'TRIAL_GUEST_CHECKIN', 'REFERRAL_SENT', 'EVENT_INVITE_SENT', 'P2P_TIP_SENT', 'P2P_TIP_RECEIVED',
  'EVENT_REVIEW_SUBMITTED', 'MEMBER_REVIEW_5STAR', 'UNIVERSAL_QR_CONNECT', 'AI_INTRO_REQUEST',
  'PROFILE_FOLLOW', 'PROFILE_UPDATE', 'REWARD_REDEEMED', 'AI_FACT_CHECK_BONUS'
);

-- ------------------------------------------------------------------------------
-- 3. GLOBAL CONFIGURATION & SYSTEM RULES
-- ------------------------------------------------------------------------------
CREATE TABLE system_rule_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_qr_checkin_bp INT NOT NULL DEFAULT 20,
  guest_conversion_bp INT NOT NULL DEFAULT 150,
  ai_fact_check_bp INT NOT NULL DEFAULT 50,
  cv_parse_bp INT NOT NULL DEFAULT 30,
  gift_upgrade_silver_cost_bp INT NOT NULL DEFAULT 1000,
  gift_upgrade_gold_cost_bp INT NOT NULL DEFAULT 2500,
  grace_period_days INT NOT NULL DEFAULT 5,
  freemium_auto_upgrade_bp INT NOT NULL DEFAULT 500,
  default_trial_days INT NOT NULL DEFAULT 14,
  default_vat_rate NUMERIC(5,2) NOT NULL DEFAULT 25.00,
  eu_reverse_charge_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE membership_packages (
  level membership_level PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  monthly_price_sek NUMERIC(10,2) NOT NULL,
  annual_price_sek NUMERIC(10,2) NOT NULL,
  stripe_monthly_price_id VARCHAR(100),
  stripe_annual_price_id VARCHAR(100),
  description TEXT,
  badge_color VARCHAR(100),
  bg_gradient VARCHAR(100),
  max_skills INT NOT NULL DEFAULT 5,
  max_case_studies INT NOT NULL DEFAULT 1,
  priority_directory_placement BOOLEAN NOT NULL DEFAULT FALSE,
  vip_profile_badge BOOLEAN NOT NULL DEFAULT FALSE,
  multi_user_seats INT NOT NULL DEFAULT 1,
  free_hub_flex_bookings_per_month INT NOT NULL DEFAULT 1,
  priority_hub_desk BOOLEAN NOT NULL DEFAULT FALSE,
  priority_hub_highlight BOOLEAN NOT NULL DEFAULT FALSE,
  max_web_meetings_per_month INT NOT NULL DEFAULT 3,
  can_create_events_and_meetings BOOLEAN NOT NULL DEFAULT FALSE,
  access_executive_webinars BOOLEAN NOT NULL DEFAULT FALSE,
  can_host_webinars BOOLEAN NOT NULL DEFAULT FALSE,
  max_webinar_attendees INT NOT NULL DEFAULT 0,
  can_sell_webinar_tickets BOOLEAN NOT NULL DEFAULT FALSE,
  can_sell_courses BOOLEAN NOT NULL DEFAULT FALSE,
  platform_course_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  can_publish_pro_masterclasses BOOLEAN NOT NULL DEFAULT FALSE,
  can_sell_services_b2b BOOLEAN NOT NULL DEFAULT FALSE,
  can_publish_sponsored_banners BOOLEAN NOT NULL DEFAULT FALSE,
  ai_matchmaking_warm_leads BOOLEAN NOT NULL DEFAULT FALSE,
  ad_discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  free_ad_feed_top_per_year INT NOT NULL DEFAULT 0,
  can_create_forum_topics BOOLEAN NOT NULL DEFAULT FALSE,
  ai_fact_check_bonus_bp BOOLEAN NOT NULL DEFAULT FALSE,
  can_pin_forum_posts BOOLEAN NOT NULL DEFAULT FALSE,
  expert_tag BOOLEAN NOT NULL DEFAULT FALSE,
  bp_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  cash_kickback_per_member_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  can_gift_upgrades_bp BOOLEAN NOT NULL DEFAULT FALSE,
  proximity_ping_allowed BOOLEAN NOT NULL DEFAULT TRUE,
  max_monthly_pings_sent INT NOT NULL DEFAULT 1,
  advance_travel_status_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  vip_qr_audio_chime BOOLEAN NOT NULL DEFAULT FALSE,
  vip_lounge_access BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. HUBS & COWORKING SPACES
-- ------------------------------------------------------------------------------
CREATE TABLE hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  meeting_day VARCHAR(50) DEFAULT 'Torsdagar 07:30',
  geofence_lat DOUBLE PRECISION NOT NULL,
  geofence_lng DOUBLE PRECISION NOT NULL,
  radius_m INT NOT NULL DEFAULT 250,
  max_flex_desks INT NOT NULL DEFAULT 20,
  amenities TEXT[] DEFAULT ARRAY['Wifi', 'Kaffe', 'Mötesrum', 'Skrivare']::TEXT[],
  contact_person VARCHAR(100),
  contact_email VARCHAR(150),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE partner_coworking_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  brand_group VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  daily_desk_allocation INT NOT NULL DEFAULT 5,
  policy_allow_desk_swap BOOLEAN NOT NULL DEFAULT TRUE,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  opening_hours VARCHAR(100) DEFAULT '08:00 - 17:00',
  wifi_network VARCHAR(100),
  wifi_pass VARCHAR(100),
  image_url TEXT,
  contact_person VARCHAR(100),
  contact_email VARCHAR(150),
  phone VARCHAR(50),
  rating_score NUMERIC(3,2) DEFAULT 4.8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. MEMBERS / PROFILES (INTEGRATED WITH AUTH.USERS)
-- ------------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(150) NOT NULL DEFAULT '',
  role_title VARCHAR(150) NOT NULL DEFAULT '',
  membership_level membership_level NOT NULL DEFAULT 'BRONZE',
  booster_score INT NOT NULL DEFAULT 100,
  primary_hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  avatar_url TEXT,
  bio TEXT,
  city VARCHAR(100) NOT NULL DEFAULT 'Stockholm',
  seeking_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  offering_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  interest_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  deals_closed_sek NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  referrals_sent INT NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  reviews_count INT NOT NULL DEFAULT 0,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  linkedin_url TEXT,
  website_url TEXT,
  target_audience TEXT,
  give_take_ratio NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  cv_summary TEXT,
  cv_filename TEXT,
  payment_status payment_status NOT NULL DEFAULT 'PAID',
  billing_cycle billing_cycle_type NOT NULL DEFAULT 'MONTHLY',
  next_billing_date DATE,
  trial_ends_at TIMESTAMPTZ,
  is_paused BOOLEAN NOT NULL DEFAULT FALSE,
  paused_until DATE,
  company_group_id UUID,
  vat_number VARCHAR(50),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE totp_security_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_2fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  secret_key TEXT,
  backup_codes TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_verified_at TIMESTAMPTZ,
  enforced_by_role BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_merits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category merit_category NOT NULL,
  title VARCHAR(150) NOT NULL,
  organization VARCHAR(150) NOT NULL,
  year VARCHAR(20) NOT NULL,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  client_name VARCHAR(150) NOT NULL,
  result_metric VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  endorsements_count INT NOT NULL DEFAULT 0,
  max_capacity INT NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, skill_name)
);

CREATE TABLE skill_endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES member_skills(id) ON DELETE CASCADE,
  endorser_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(skill_id, endorser_member_id)
);

CREATE TABLE member_follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- ------------------------------------------------------------------------------
-- 6. INVOICING, BILLING & GIFT UPGRADES
-- ------------------------------------------------------------------------------
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount_sek NUMERIC(10,2) NOT NULL,
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 25.00,
  vat_amount_sek NUMERIC(10,2) GENERATED ALWAYS AS (ROUND((amount_sek * (vat_rate / 100.0)), 2)) STORED,
  total_with_vat_sek NUMERIC(10,2) GENERATED ALWAYS AS (amount_sek + ROUND((amount_sek * (vat_rate / 100.0)), 2)) STORED,
  status payment_status NOT NULL DEFAULT 'DUE',
  plan membership_level NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(150),
  pdf_url TEXT,
  payment_link TEXT,
  stripe_invoice_id VARCHAR(100),
  swish_payment_reference VARCHAR(100),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gift_upgrades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_level membership_level NOT NULL,
  bp_spent INT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. FORUM, BLOG & MULTI-MODEL AI FACT-CHECKING
-- ------------------------------------------------------------------------------
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type community_post_type NOT NULL DEFAULT 'FORUM_THREAD',
  category community_category NOT NULL DEFAULT 'ALLMANT',
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  linkedin_post_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  upvotes_count INT NOT NULL DEFAULT 0,
  weighted_score NUMERIC(8,2) NOT NULL DEFAULT 0.00,
  comments_count INT NOT NULL DEFAULT 0,
  read_time_min INT DEFAULT 3,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_answer_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  fact_check_status fact_check_status NOT NULL DEFAULT 'UNVERIFIED',
  fact_check_score NUMERIC(5,2) DEFAULT NULL, -- 0-100% confidence
  fact_check_model_pipeline VARCHAR(100) DEFAULT 'Gemini-2.5-Pro + Perplexity Grounding',
  fact_check_summary TEXT,
  fact_check_citation_url TEXT,
  fact_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  option_text VARCHAR(255) NOT NULL,
  votes_count INT NOT NULL DEFAULT 0
);

CREATE TABLE post_poll_votes (
  option_id UUID NOT NULL REFERENCES post_poll_options(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (option_id, voter_id)
);

CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT NOT NULL DEFAULT 0,
  is_best_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_upvotes (
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, member_id)
);

-- ------------------------------------------------------------------------------
-- 8. COWOKING, FLEX DESK & DESK SWAP
-- ------------------------------------------------------------------------------
CREATE TABLE member_coworking_credits (
  member_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  included_monthly_quota INT NOT NULL DEFAULT 0,
  used_monthly_quota INT NOT NULL DEFAULT 0,
  purchased_extra_credits INT NOT NULL DEFAULT 0,
  unlimited_month_pass_active BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coworking_desk_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  partner_location_id UUID REFERENCES partner_coworking_locations(id) ON DELETE SET NULL,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  slot_type coworker_slot_type NOT NULL DEFAULT 'FULL_DAY',
  is_checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_time TIMESTAMPTZ,
  check_in_method checkin_method_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_location_exclusive CHECK (hub_id IS NOT NULL OR partner_location_id IS NOT NULL)
);

CREATE TABLE desk_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  partner_location_id UUID REFERENCES partner_coworking_locations(id) ON DELETE SET NULL,
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  available_date DATE NOT NULL,
  desk_label VARCHAR(100) NOT NULL,
  notes TEXT,
  status desk_swap_status NOT NULL DEFAULT 'AVAILABLE',
  borrower_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  points_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE community_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  equipment_list TEXT[] DEFAULT ARRAY[]::TEXT[],
  hourly_rate_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE community_resource_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES community_resources(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_cost_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. EVENTS, ATTENDEES, ADDONS & REVIEWS
-- ------------------------------------------------------------------------------
CREATE TABLE master_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category calendar_category NOT NULL,
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  is_digital BOOLEAN NOT NULL DEFAULT FALSE,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  required_level membership_level NOT NULL DEFAULT 'BRONZE',
  spots_max INT NOT NULL DEFAULT 50,
  attendees_count INT NOT NULL DEFAULT 0,
  speaker_or_host VARCHAR(150),
  price_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  allows_free_member_invites BOOLEAN NOT NULL DEFAULT FALSE,
  free_invites_allowed_level membership_level DEFAULT 'GOLD',
  free_invites_quota INT DEFAULT 2,
  is_past BOOLEAN NOT NULL DEFAULT FALSE,
  recap_text TEXT,
  rating_avg NUMERIC(3,2) DEFAULT NULL,
  reviews_count INT NOT NULL DEFAULT 0,
  created_by_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES master_events(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  price_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Coffee'
);

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES master_events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_time TIMESTAMPTZ,
  invited_by_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_free_guest_ticket BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

CREATE TABLE event_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES master_events(id) ON DELETE CASCADE,
  invited_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name VARCHAR(150) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_company VARCHAR(150),
  is_free_ticket BOOLEAN NOT NULL DEFAULT TRUE,
  original_price_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) NOT NULL DEFAULT 'INVITED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES master_events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES master_events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  uploaded_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE guest_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  issued_by_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name VARCHAR(150) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_company VARCHAR(150),
  target_hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  target_date DATE NOT NULL,
  status pass_status NOT NULL DEFAULT 'ACTIVE',
  conversion_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONVERTED_PAID
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. BOOSTER POINTS LEDGER & P2P TIPPING
-- ------------------------------------------------------------------------------
CREATE TABLE booster_score_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points_awarded INT NOT NULL,
  activity_type activity_type_enum NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  reference_id UUID,
  verification_method VARCHAR(50) DEFAULT 'SYSTEM',
  multiplier_applied NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  base_points INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE p2p_allowances (
  member_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  monthly_allowance INT NOT NULL DEFAULT 100,
  used_allowance INT NOT NULL DEFAULT 0,
  reset_date DATE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE p2p_point_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INT NOT NULL CHECK (points > 0),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. WEBBMÖTEN, KALENDER & SPEED NETWORKING
-- ------------------------------------------------------------------------------
CREATE TABLE web_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  meeting_type meeting_type NOT NULL DEFAULT 'ONE_TO_ONE',
  status meeting_status NOT NULL DEFAULT 'SCHEDULED',
  meeting_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  meeting_link TEXT NOT NULL,
  provider meeting_provider NOT NULL DEFAULT 'GOOGLE_MEET',
  related_deal_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES web_meetings(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role meeting_participant_role NOT NULL DEFAULT 'INVITEE',
  status meeting_participant_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(meeting_id, member_id)
);

CREATE TABLE lunch_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_name VARCHAR(150) NOT NULL,
  proposed_date DATE NOT NULL,
  invitation_type VARCHAR(50) NOT NULL DEFAULT 'LUNCH',
  host_pays BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE speed_networking_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  round_number INT NOT NULL,
  member_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matching_synergy TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 15,
  meeting_link TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. GEOFENCING & NÄRHETSRADAR (COFFEE & LUNCH PINGS)
-- ------------------------------------------------------------------------------
CREATE TABLE member_active_locations (
  member_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_city VARCHAR(100) NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_available_for_coffee BOOLEAN NOT NULL DEFAULT FALSE,
  is_available_for_lunch BOOLEAN NOT NULL DEFAULT FALSE,
  travel_destination VARCHAR(100),
  travel_date DATE,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proximity_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ping_type proximity_ping_type NOT NULL DEFAULT 'COFFEE',
  status proximity_ping_status NOT NULL DEFAULT 'PENDING',
  suggested_location VARCHAR(200) NOT NULL,
  custom_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. DASHBOARD WIDGETS & SYSTEM ACTIVITY TICKER
-- ------------------------------------------------------------------------------
CREATE TABLE user_dashboard_layouts (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  columns_count INT NOT NULL DEFAULT 3 CHECK (columns_count IN (2, 3, 4)),
  grid_gap VARCHAR(20) NOT NULL DEFAULT '16px',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  widget_id VARCHAR(100) NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  col_span INT NOT NULL DEFAULT 1,
  row_span INT NOT NULL DEFAULT 1,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB DEFAULT '{}'::JSONB,
  UNIQUE(user_id, widget_id)
);

CREATE TABLE system_activity_ticker_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type ticker_event_type NOT NULL,
  message TEXT NOT NULL,
  target_url TEXT,
  target_tab VARCHAR(50),
  is_pinned_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. ANNONSSERVER, KAMPANJER & SPONSRING
-- ------------------------------------------------------------------------------
CREATE TABLE ad_placements_config (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location_description TEXT,
  monthly_fixed_price_sek NUMERIC(10,2) NOT NULL DEFAULT 2990.00,
  cpm_price_sek NUMERIC(10,2) NOT NULL DEFAULT 150.00,
  aspect_ratio VARCHAR(20) NOT NULL DEFAULT '16:9',
  dimensions_px VARCHAR(50) NOT NULL DEFAULT '1200x300',
  format_type VARCHAR(50) NOT NULL DEFAULT 'full_width',
  example_reach VARCHAR(100) NOT NULL DEFAULT '1 200 VD:ar & beslutsfattare/vecka'
);

CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  placement_code VARCHAR(50) NOT NULL REFERENCES ad_placements_config(code),
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  format ad_format_type NOT NULL DEFAULT 'FULL_WIDTH',
  custom_height INT DEFAULT 180,
  custom_width VARCHAR(50) DEFAULT '100%',
  cta_text VARCHAR(50) DEFAULT 'Läs mer & Boka',
  badge_text VARCHAR(50) DEFAULT 'Sponsrat partnerskap',
  pricing_model ad_pricing_model NOT NULL DEFAULT 'FIXED_MONTHLY',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ad_campaign_status NOT NULL DEFAULT 'PENDING_APPROVAL',
  impressions_count INT NOT NULL DEFAULT 0,
  clicks_count INT NOT NULL DEFAULT 0,
  conversions_count INT NOT NULL DEFAULT 0,
  amount_paid_sek NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'DUE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. CRM PIPELINE, INTRO-AI & BOUNTIES
-- ------------------------------------------------------------------------------
CREATE TABLE crm_pipeline_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  client_company VARCHAR(150) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  contact_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_source VARCHAR(150),
  value_sek NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  stage pipeline_stage NOT NULL DEFAULT 'lead',
  probability INT CHECK (probability BETWEEN 0 AND 100) NOT NULL DEFAULT 20,
  next_step VARCHAR(255) NOT NULL DEFAULT '',
  due_date DATE NOT NULL,
  notes TEXT,
  points_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  won_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE intro_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_role_or_company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  bounty_bp INT NOT NULL DEFAULT 50,
  status intro_request_status NOT NULL DEFAULT 'OPEN',
  connector_member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. CHAT & MEDDELANDEN
-- ------------------------------------------------------------------------------
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type channel_type NOT NULL DEFAULT 'DIRECT',
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_channel_members (
  channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (channel_id, member_id)
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type VARCHAR(50),
  attachment_metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_profiles_membership ON profiles(membership_level);
CREATE INDEX idx_profiles_hub ON profiles(primary_hub_id);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_booster_score ON profiles(booster_score DESC);
CREATE INDEX idx_profiles_seeking_gin ON profiles USING GIN(seeking_tags);
CREATE INDEX idx_profiles_offering_gin ON profiles USING GIN(offering_tags);

CREATE INDEX idx_invoices_member ON invoices(member_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_category ON community_posts(category);
CREATE INDEX idx_posts_weighted_score ON community_posts(weighted_score DESC);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_posts_tags_gin ON community_posts USING GIN(tags);

CREATE INDEX idx_desk_bookings_date ON coworking_desk_bookings(booking_date);
CREATE INDEX idx_desk_bookings_member ON coworking_desk_bookings(member_id);
CREATE INDEX idx_desk_bookings_hub ON coworking_desk_bookings(hub_id);

CREATE INDEX idx_master_events_date ON master_events(event_date);
CREATE INDEX idx_master_events_hub ON master_events(hub_id);
CREATE INDEX idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_member ON event_attendees(member_id);

CREATE INDEX idx_booster_logs_member ON booster_score_logs(member_id);
CREATE INDEX idx_booster_logs_activity ON booster_score_logs(activity_type);

CREATE INDEX idx_meetings_host ON web_meetings(host_member_id);
CREATE INDEX idx_meetings_date ON web_meetings(meeting_date);

CREATE INDEX idx_proximity_locations_expires ON member_active_locations(expires_at);
CREATE INDEX idx_proximity_pings_receiver ON proximity_pings(receiver_member_id);

CREATE INDEX idx_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_campaigns_placement ON ad_campaigns(placement_code);

CREATE INDEX idx_crm_deals_owner ON crm_pipeline_deals(owner_member_id);
CREATE INDEX idx_crm_deals_stage ON crm_pipeline_deals(stage);

-- ------------------------------------------------------------------------------
-- 18. AUTOMATION: TRIGGERS & BUSINESS LOGIC
-- ------------------------------------------------------------------------------

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_crm_deals_updated_at BEFORE UPDATE ON crm_pipeline_deals
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 1. Helper Function: Non-recursive Admin Check (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Anti-Privilege Escalation Trigger: Protect is_admin, booster_score, membership_level, payment_status
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.is_admin := OLD.is_admin;
    NEW.booster_score := OLD.booster_score;
    NEW.membership_level := OLD.membership_level;
    NEW.payment_status := OLD.payment_status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON profiles;
CREATE TRIGGER trg_protect_profile_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_escalation();

-- 3. Auto-sync new Auth users to public.profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role_title, company_name, membership_level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Ny Medlem'),
    COALESCE(NEW.raw_user_meta_data->>'role_title', 'Grundare'),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Bolag AB'),
    'BRONZE'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.member_coworking_credits (member_id, included_monthly_quota)
  VALUES (NEW.id, 0)
  ON CONFLICT (member_id) DO NOTHING;

  INSERT INTO public.p2p_allowances (member_id, reset_date)
  VALUES (NEW.id, CURRENT_DATE + INTERVAL '1 month')
  ON CONFLICT (member_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update profile booster_score when ledger entry is inserted
CREATE OR REPLACE FUNCTION apply_booster_score_log()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET booster_score = booster_score + NEW.points_awarded
  WHERE id = NEW.member_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_apply_booster_score ON booster_score_logs;
CREATE TRIGGER trg_apply_booster_score
  AFTER INSERT ON booster_score_logs
  FOR EACH ROW EXECUTE FUNCTION apply_booster_score_log();

-- Dynamic View: "Vem är på hubben idag?" with Gold Priority Highlight
CREATE OR REPLACE VIEW v_who_is_at_hub_today AS
SELECT 
  b.id AS booking_id,
  b.hub_id,
  h.name AS hub_name,
  h.city AS hub_city,
  b.booking_date,
  b.slot_type,
  b.is_checked_in,
  b.check_in_time,
  p.id AS member_id,
  p.full_name,
  p.role_title,
  p.company_name,
  p.avatar_url,
  p.membership_level,
  p.booster_score,
  p.seeking_tags,
  p.offering_tags,
  pkg.priority_hub_highlight AS has_gold_highlight
FROM coworking_desk_bookings b
JOIN profiles p ON b.member_id = p.id
JOIN membership_packages pkg ON p.membership_level = pkg.level
LEFT JOIN hubs h ON b.hub_id = h.id
WHERE b.booking_date = CURRENT_DATE
ORDER BY 
  pkg.priority_hub_highlight DESC,
  p.booster_score DESC;

-- ------------------------------------------------------------------------------
-- 19. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE totp_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_merits ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coworking_desk_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE desk_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booster_score_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE p2p_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE p2p_point_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_active_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proximity_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_pipeline_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by authenticated members"
  ON profiles FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 2. TOTP 2FA Settings Policies
CREATE POLICY "Users can manage their own 2FA"
  ON totp_security_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 3. Merits, Case Studies & Skills Policies
CREATE POLICY "Anyone can view merits" ON member_merits FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own merits" ON member_merits FOR ALL TO authenticated USING (auth.uid() = member_id OR public.is_admin()) WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Anyone can view case studies" ON member_case_studies FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own case studies" ON member_case_studies FOR ALL TO authenticated USING (auth.uid() = member_id OR public.is_admin()) WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Anyone can view skills" ON member_skills FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own skills" ON member_skills FOR ALL TO authenticated USING (auth.uid() = member_id OR public.is_admin()) WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Anyone can view endorsements" ON skill_endorsements FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users insert endorsements" ON skill_endorsements FOR INSERT TO authenticated WITH CHECK (auth.uid() = endorser_member_id);
CREATE POLICY "Users delete own endorsements" ON skill_endorsements FOR DELETE TO authenticated USING (auth.uid() = endorser_member_id OR public.is_admin());

CREATE POLICY "Anyone can view follows" ON member_follows FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own follows" ON member_follows FOR ALL TO authenticated USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- 4. Invoices & Gift Upgrades Policies
CREATE POLICY "Members view their own invoices"
  ON invoices FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR (auth.jwt() ->> 'role' = 'ADMIN') OR public.is_admin());

CREATE POLICY "Admins manage invoices"
  ON invoices FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Members view their gift upgrades"
  ON gift_upgrades FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id OR public.is_admin());

CREATE POLICY "Members send gift upgrades"
  ON gift_upgrades FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- 5. Community Posts, Comments, Polls & Upvotes Policies
CREATE POLICY "Members can view all non-hidden posts"
  ON community_posts FOR SELECT TO authenticated
  USING (is_hidden = FALSE OR auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Members can create posts"
  ON community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors or Admins can update posts"
  ON community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Authors or Admins can delete posts"
  ON community_posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users create comments" ON post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors or Admins update comments" ON post_comments FOR UPDATE TO authenticated USING (auth.uid() = author_id OR public.is_admin());
CREATE POLICY "Authors or Admins delete comments" ON post_comments FOR DELETE TO authenticated USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Anyone can view post upvotes" ON post_upvotes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users manage own upvotes" ON post_upvotes FOR ALL TO authenticated USING (auth.uid() = member_id) WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Anyone can view poll options" ON post_poll_options FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Post authors manage poll options" ON post_poll_options FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM community_posts WHERE id = post_poll_options.post_id AND (author_id = auth.uid() OR public.is_admin())));

CREATE POLICY "Anyone can view poll votes" ON post_poll_votes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users vote in polls" ON post_poll_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "Users revoke poll vote" ON post_poll_votes FOR DELETE TO authenticated USING (auth.uid() = voter_id);

-- 6. Coworking Bookings & Desk Swaps Policies
CREATE POLICY "Members can see bookings for today and their own bookings"
  ON coworking_desk_bookings FOR SELECT TO authenticated
  USING (booking_date = CURRENT_DATE OR auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Members can insert their own bookings"
  ON coworking_desk_bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Members can update their own bookings"
  ON coworking_desk_bookings FOR UPDATE TO authenticated
  USING (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Anyone can view desk swaps" ON desk_swaps FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Lenders or Borrowers manage desk swaps" ON desk_swaps FOR ALL TO authenticated
  USING (auth.uid() = lender_member_id OR auth.uid() = borrower_member_id OR public.is_admin())
  WITH CHECK (auth.uid() = lender_member_id OR auth.uid() = borrower_member_id OR public.is_admin());

-- 7. Master Events, Attendees, Invites & Reviews Policies
CREATE POLICY "Anyone can view master events" ON master_events FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Hosts or Admins manage events" ON master_events FOR ALL TO authenticated
  USING (auth.uid() = created_by_member_id OR public.is_admin())
  WITH CHECK (auth.uid() = created_by_member_id OR public.is_admin());

CREATE POLICY "Anyone can view event attendees" ON event_attendees FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Members register or cancel attendance" ON event_attendees FOR ALL TO authenticated
  USING (auth.uid() = member_id OR public.is_admin())
  WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "View event invitations" ON event_invitations FOR SELECT TO authenticated
  USING (auth.uid() = invited_by_id OR auth.uid() = invited_member_id OR public.is_admin());
CREATE POLICY "Members send event invitations" ON event_invitations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = invited_by_id);
CREATE POLICY "Members update event invitations" ON event_invitations FOR UPDATE TO authenticated
  USING (auth.uid() = invited_by_id OR auth.uid() = invited_member_id OR public.is_admin());

CREATE POLICY "Anyone can view event reviews" ON event_reviews FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Members create reviews" ON event_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "Members update own reviews" ON event_reviews FOR UPDATE TO authenticated USING (auth.uid() = member_id OR public.is_admin());

-- 8. Booster Score Ledger & P2P Allowance Policies
CREATE POLICY "Members view their own points history"
  ON booster_score_logs FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Members view their p2p allowance"
  ON p2p_allowances FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Users view own transfers"
  ON p2p_point_transfers FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin());

CREATE POLICY "Users make transfers"
  ON p2p_point_transfers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- 9. Web Meetings & Participants Policies
CREATE POLICY "Participants and Host can view meeting"
  ON web_meetings FOR SELECT TO authenticated
  USING (
    auth.uid() = host_member_id OR
    EXISTS (SELECT 1 FROM meeting_participants WHERE meeting_id = web_meetings.id AND member_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Host can manage meeting"
  ON web_meetings FOR ALL TO authenticated
  USING (auth.uid() = host_member_id OR public.is_admin())
  WITH CHECK (auth.uid() = host_member_id OR public.is_admin());

CREATE POLICY "Participants can view their meeting assignments"
  ON meeting_participants FOR SELECT TO authenticated
  USING (
    auth.uid() = member_id OR
    EXISTS (SELECT 1 FROM web_meetings WHERE id = meeting_participants.meeting_id AND host_member_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Host or Invitee manage participant status"
  ON meeting_participants FOR ALL TO authenticated
  USING (
    auth.uid() = member_id OR
    EXISTS (SELECT 1 FROM web_meetings WHERE id = meeting_participants.meeting_id AND host_member_id = auth.uid()) OR
    public.is_admin()
  )
  WITH CHECK (
    auth.uid() = member_id OR
    EXISTS (SELECT 1 FROM web_meetings WHERE id = meeting_participants.meeting_id AND host_member_id = auth.uid()) OR
    public.is_admin()
  );

-- 10. Proximity Pings & Active Locations Policies
CREATE POLICY "Anyone can view member active locations"
  ON member_active_locations FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Users manage own active location"
  ON member_active_locations FOR ALL TO authenticated
  USING (auth.uid() = member_id OR public.is_admin())
  WITH CHECK (auth.uid() = member_id OR public.is_admin());

CREATE POLICY "Sender or Receiver can view ping"
  ON proximity_pings FOR SELECT TO authenticated
  USING (auth.uid() = sender_member_id OR auth.uid() = receiver_member_id OR public.is_admin());

CREATE POLICY "Sender can create ping"
  ON proximity_pings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_member_id);

CREATE POLICY "Receiver or Sender can update ping status"
  ON proximity_pings FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_member_id OR auth.uid() = sender_member_id OR public.is_admin());

-- 11. Dashboard Layout Policies
CREATE POLICY "User manages own dashboard"
  ON user_dashboard_layouts FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "User manages own dashboard widgets"
  ON user_dashboard_widgets FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 12. CRM Pipeline Deals & Intro Requests Policies
CREATE POLICY "Members manage their own deals"
  ON crm_pipeline_deals FOR ALL TO authenticated
  USING (auth.uid() = owner_member_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_member_id OR public.is_admin());

CREATE POLICY "Anyone can view open intro requests"
  ON intro_requests FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Members create intro requests"
  ON intro_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Author or Connector update intro request"
  ON intro_requests FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR auth.uid() = connector_member_id OR public.is_admin());

-- 13. Ad Campaigns Policies
CREATE POLICY "Active ads are viewable by all authenticated members"
  ON ad_campaigns FOR SELECT TO authenticated
  USING (status = 'ACTIVE' OR auth.uid() = advertiser_id OR public.is_admin());

CREATE POLICY "Advertisers create their own campaign"
  ON ad_campaigns FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = advertiser_id OR public.is_admin());

CREATE POLICY "Advertisers or Admins update campaign"
  ON ad_campaigns FOR UPDATE TO authenticated
  USING (auth.uid() = advertiser_id OR public.is_admin());

-- 14. Chat Channels & Messages Policies
CREATE POLICY "Members view relevant channels"
  ON chat_channels FOR SELECT TO authenticated
  USING (
    channel_type = 'HUB' OR 
    EXISTS (SELECT 1 FROM chat_channel_members WHERE channel_id = chat_channels.id AND member_id = auth.uid()) OR 
    public.is_admin()
  );

CREATE POLICY "Members can create channels"
  ON chat_channels FOR INSERT TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Channel creator or Admin updates channel"
  ON chat_channels FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "Members view channel membership"
  ON chat_channel_members FOR SELECT TO authenticated
  USING (
    member_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM chat_channel_members ccm WHERE ccm.channel_id = chat_channel_members.channel_id AND ccm.member_id = auth.uid()) OR 
    public.is_admin()
  );

CREATE POLICY "Members join channels"
  ON chat_channel_members FOR INSERT TO authenticated
  WITH CHECK (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "Members leave channels"
  ON chat_channel_members FOR DELETE TO authenticated
  USING (member_id = auth.uid() OR public.is_admin());

CREATE POLICY "Channel members view messages"
  ON chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM chat_channel_members WHERE channel_id = chat_messages.channel_id AND member_id = auth.uid()) OR 
    public.is_admin()
  );

CREATE POLICY "Channel members send messages"
  ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (SELECT 1 FROM chat_channel_members WHERE channel_id = chat_messages.channel_id AND member_id = auth.uid())
  );

-- ------------------------------------------------------------------------------
-- 20. SUPABASE REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE 
  public.system_activity_ticker_events,
  public.chat_messages,
  public.proximity_pings,
  public.member_active_locations;
