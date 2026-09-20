export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MembershipLevel = 'BRONZE' | 'SILVER' | 'GOLD';
export type PaymentStatus = 'PAID' | 'DUE' | 'OVERDUE' | 'TRIAL' | 'PAUSED' | 'SUSPENDED_PAYMENT';
export type BillingCycleType = 'MONTHLY' | 'ANNUAL';
export type AdFormatType = 'FULL_WIDTH' | 'SIDEBAR' | 'IN_FEED' | 'COMPACT' | 'PANORAMA' | 'CUSTOM';
export type AdPricingModel = 'FIXED_MONTHLY' | 'CPM';
export type AdCampaignStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'EXPIRED' | 'PAUSED';
export type MeritCategory = 'BOARD_ROLE' | 'CERTIFICATION' | 'EDUCATION' | 'AWARD' | 'EXPERIENCE';
export type ProximityPingType = 'COFFEE' | 'LUNCH';
export type ProximityPingStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
export type MeetingType = 'ONE_TO_ONE' | 'GROUP';
export type MeetingStatus = 'DRAFT' | 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type MeetingParticipantRole = 'HOST' | 'INVITEE' | 'ATTENDEE';
export type MeetingParticipantStatus = 'ACCEPTED' | 'PENDING' | 'DECLINED';
export type MeetingProvider = 'GOOGLE_MEET' | 'MICROSOFT_TEAMS' | 'ZOOM' | 'SIMULATED';
export type CalendarCategory = 'HUB_MEETING' | 'WEBINAR' | 'COWORKING_THEME' | 'ACADEMY_WORKSHOP' | 'SPEED_DATING';
export type CoworkerSlotType = 'FULL_DAY' | 'AM' | 'PM';
export type CheckinMethodType = 'QR' | 'GEO' | 'MANUAL';
export type DeskSwapStatus = 'AVAILABLE' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
export type PassStatus = 'ACTIVE' | 'USED' | 'EXPIRED';
export type PipelineStage = 'lead' | 'intro_sent' | 'meeting_done' | 'proposal' | 'closed_won' | 'contact';
export type CommunityPostType = 'FORUM_THREAD' | 'ARTICLE' | 'LINKEDIN_EMBED' | 'POLL';
export type CommunityCategory = 'ALLMANT' | 'AFFARER_LEADS' | 'FRAGA_EXPERTERNA' | 'VERKTYG_TIPS' | 'LOKALT_HUBBEN';
export type FactCheckStatus = 'VERIFIED' | 'PENDING' | 'DISPUTED' | 'UNVERIFIED' | 'MISLEADING';
export type IntroRequestStatus = 'OPEN' | 'IN_PROGRESS' | 'FULFILLED';
export type ChannelType = 'DIRECT' | 'GROUP' | 'HUB' | 'EVENT' | 'INTRO';
export type TickerEventType = 'NEW_MEMBER' | 'COFFEE_PING' | 'BADGE_EARNED' | 'EVENT_CREATED' | 'CASE_ADDED' | 'SYSTEM_ANNOUNCEMENT';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          company_name: string;
          role_title: string;
          membership_level: MembershipLevel;
          booster_score: number;
          primary_hub_id: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string;
          seeking_tags: string[];
          offering_tags: string[];
          interest_tags: string[];
          interests: string[];
          deals_closed_sek: number;
          referrals_sent: number;
          rating_avg: number;
          reviews_count: number;
          is_admin: boolean;
          is_online: boolean;
          linkedin_url: string | null;
          website_url: string | null;
          target_audience: string | null;
          give_take_ratio: number;
          cv_summary: string | null;
          cv_filename: string | null;
          payment_status: PaymentStatus;
          billing_cycle: BillingCycleType;
          next_billing_date: string | null;
          trial_ends_at: string | null;
          is_paused: boolean;
          paused_until: string | null;
          company_group_id: string | null;
          vat_number: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          account_status?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          email: string;
          full_name: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      system_activity_ticker_events: {
        Row: {
          id: string;
          event_type: TickerEventType;
          message: string;
          target_url: string | null;
          target_tab: string | null;
          is_pinned_by_admin: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['system_activity_ticker_events']['Row']> & {
          event_type: TickerEventType;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['system_activity_ticker_events']['Row']>;
      };
      proximity_pings: {
        Row: {
          id: string;
          sender_member_id: string;
          receiver_member_id: string;
          ping_type: ProximityPingType;
          status: ProximityPingStatus;
          suggested_location: string;
          custom_message: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['proximity_pings']['Row']> & {
          sender_member_id: string;
          receiver_member_id: string;
          suggested_location: string;
        };
        Update: Partial<Database['public']['Tables']['proximity_pings']['Row']>;
      };
      member_active_locations: {
        Row: {
          member_id: string;
          current_city: string;
          lat: number | null;
          lng: number | null;
          is_available_for_coffee: boolean;
          is_available_for_lunch: boolean;
          travel_destination: string | null;
          travel_date: string | null;
          expires_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['member_active_locations']['Row']> & {
          member_id: string;
          current_city: string;
          expires_at: string;
        };
        Update: Partial<Database['public']['Tables']['member_active_locations']['Row']>;
      };
      chat_messages: {
        Row: {
          id: string;
          channel_id: string;
          sender_id: string;
          message_text: string;
          attachment_url: string | null;
          attachment_type: string | null;
          attachment_metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['chat_messages']['Row']> & {
          channel_id: string;
          sender_id: string;
          message_text: string;
        };
        Update: Partial<Database['public']['Tables']['chat_messages']['Row']>;
      };
      chat_channels: {
        Row: {
          id: string;
          channel_type: ChannelType;
          title: string;
          description: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['chat_channels']['Row']> & {
          title: string;
        };
        Update: Partial<Database['public']['Tables']['chat_channels']['Row']>;
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          post_type: CommunityPostType;
          category: CommunityCategory;
          title: string;
          content: string;
          image_url: string | null;
          linkedin_post_url: string | null;
          tags: string[];
          upvotes_count: number;
          weighted_score: number;
          comments_count: number;
          read_time_min: number;
          is_featured: boolean;
          is_pinned: boolean;
          is_locked: boolean;
          is_hidden: boolean;
          is_best_answer_awarded: boolean;
          fact_check_status: FactCheckStatus;
          fact_check_score: number | null;
          fact_check_model_pipeline: string | null;
          fact_check_summary: string | null;
          fact_check_citation_url: string | null;
          fact_checked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['community_posts']['Row']> & {
          author_id: string;
          title: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>;
      };
      booster_score_logs: {
        Row: {
          id: string;
          member_id: string;
          points_awarded: number;
          activity_type: string;
          title: string;
          description: string | null;
          reference_id: string | null;
          verification_method: string;
          multiplier_applied: number;
          base_points: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['booster_score_logs']['Row']> & {
          member_id: string;
          points_awarded: number;
          activity_type: string;
          title: string;
          base_points: number;
        };
        Update: Partial<Database['public']['Tables']['booster_score_logs']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          member_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string;
          amount_sek: number;
          vat_rate: number;
          vat_amount_sek: number;
          total_with_vat_sek: number;
          status: PaymentStatus;
          plan: MembershipLevel;
          recipient_name: string;
          recipient_email: string;
          company_name: string | null;
          pdf_url: string | null;
          payment_link: string | null;
          stripe_invoice_id: string | null;
          swish_payment_reference: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['invoices']['Row']> & {
          member_id: string;
          invoice_number: string;
          due_date: string;
          amount_sek: number;
          plan: MembershipLevel;
          recipient_name: string;
          recipient_email: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
    };
    Views: {
      v_who_is_at_hub_today: {
        Row: {
          booking_id: string;
          hub_id: string | null;
          hub_name: string | null;
          hub_city: string | null;
          booking_date: string;
          slot_type: CoworkerSlotType;
          is_checked_in: boolean;
          check_in_time: string | null;
          member_id: string;
          full_name: string;
          role_title: string;
          company_name: string;
          avatar_url: string | null;
          membership_level: MembershipLevel;
          booster_score: number;
          seeking_tags: string[];
          offering_tags: string[];
          has_gold_highlight: boolean;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
}
