import { 
  BoosterSystemRuleConfig, 
  MembershipPackageDefinition, 
  InvoiceRecord, 
  GiftUpgradeRecord,
  MembershipLevel 
} from '../types';

export const INITIAL_BOOSTER_RULES: BoosterSystemRuleConfig = {
  guest_qr_checkin_bp: 20,
  guest_conversion_bp: 150,
  ai_fact_check_bp: 50,
  cv_parse_bp: 30,
  gift_upgrade_silver_cost_bp: 1000,
  gift_upgrade_gold_cost_bp: 2500,
  grace_period_days: 5,
  freemium_auto_upgrade_bp: 500,
  default_trial_days: 14,
  default_vat_rate: 25,
  eu_reverse_charge_enabled: true
};

export const INITIAL_MEMBERSHIP_PACKAGES: MembershipPackageDefinition[] = [
  {
    level: 'BRONZE',
    name: '🥉 Booster Bronze (Bas / Nätverk)',
    monthly_price_sek: 390,
    annual_price_sek: 3900,
    stripe_monthly_price_id: 'price_1PzBronzeMonth_390SEK',
    stripe_annual_price_id: 'price_1PzBronzeYear_3900SEK',
    description: 'Ett starkt nätverkspaket för dig som vill knyta kontakter, delta i frukostar och bygga relationer.',
    badge_color: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    bg_gradient: 'from-amber-700/20 to-amber-900/40',

    // 1. Profil & Skills
    max_skills: 5,
    max_case_studies: 1,
    priority_directory_placement: false,
    vip_profile_badge: false,
    multi_user_seats: 1,

    // 2. Coworking & Hubbar
    free_hub_flex_bookings_per_month: 1,
    priority_hub_desk: false,
    priority_hub_highlight: false,

    // 3. Webbmöten & Webinarier
    max_web_meetings_per_month: 3,
    can_create_events_and_meetings: false,
    access_executive_webinars: false,
    can_host_webinars: false,
    max_webinar_attendees: 0,
    can_sell_webinar_tickets: false,

    // 4. Akademi & Kurser
    can_sell_courses: false,
    platform_course_fee_percent: 0,
    can_publish_pro_masterclasses: false,

    // 5. Affärer & Leads
    can_sell_services_b2b: false,
    can_publish_sponsored_banners: false,
    ai_matchmaking_warm_leads: false,
    ad_discount_percent: 0,
    free_ad_feed_top_per_year: 0,

    // 6. Forum & Fact-Check
    can_create_forum_topics: false,
    ai_fact_check_bonus_bp: false,
    can_pin_forum_posts: false,
    expert_tag: false,

    // 7. BP & Kickback
    bp_multiplier: 1.0,
    cash_kickback_per_member_sek: 0,
    can_gift_upgrades_bp: false,

    // 8. Proximity Ping
    proximity_ping_allowed: true,
    max_monthly_pings_sent: 1, // Kan se andra och ta emot pings, max 1 skickad ping/mån
    advance_travel_status_allowed: false,

    // 9. VIP QR
    vip_qr_audio_chime: false,
    vip_lounge_access: false
  },
  {
    level: 'SILVER',
    name: '🥈 Booster Silver (Pro / Egenföretagare)',
    monthly_price_sek: 990,
    annual_price_sek: 9900,
    stripe_monthly_price_id: 'price_1PzSilverMonth_990SEK',
    stripe_annual_price_id: 'price_1PzSilverYear_9900SEK',
    description: 'Aktivt tillväxtpaket för egenföretagare. Fria flexdagar, kurssälj, webinarier och obegränsade pings.',
    badge_color: 'bg-slate-100 text-slate-800 border-slate-300 font-bold',
    bg_gradient: 'from-slate-600/20 to-slate-800/40',

    // 1. Profil & Skills
    max_skills: 15,
    max_case_studies: 5,
    priority_directory_placement: false,
    vip_profile_badge: true,
    multi_user_seats: 1,

    // 2. Coworking & Hubbar
    free_hub_flex_bookings_per_month: 4,
    priority_hub_desk: false,
    priority_hub_highlight: false,

    // 3. Webbmöten & Webinarier
    max_web_meetings_per_month: 15,
    can_create_events_and_meetings: true,
    access_executive_webinars: true,
    can_host_webinars: true,
    max_webinar_attendees: 25, // Max 25 deltagare (Standard Webinar)
    can_sell_webinar_tickets: false,

    // 4. Akademi & Kurser
    can_sell_courses: true,
    platform_course_fee_percent: 10, // 10% plattformsavgift
    can_publish_pro_masterclasses: false,

    // 5. Affärer & Leads
    can_sell_services_b2b: true, // Publicera i B2B-marknad
    can_publish_sponsored_banners: false,
    ai_matchmaking_warm_leads: false,
    ad_discount_percent: 0,
    free_ad_feed_top_per_year: 0,

    // 6. Forum & Fact-Check
    can_create_forum_topics: true,
    ai_fact_check_bonus_bp: true, // +50 BP/fact-check
    can_pin_forum_posts: false,
    expert_tag: false,

    // 7. BP & Kickback
    bp_multiplier: 1.5, // 1.5x BP multiplikator
    cash_kickback_per_member_sek: 0,
    can_gift_upgrades_bp: true, // Kan bränna 1000 BP för att bjuda en vän på Silver

    // 8. Proximity Ping
    proximity_ping_allowed: true,
    max_monthly_pings_sent: 999, // Obegränsat med pings på egen ort
    advance_travel_status_allowed: false,

    // 9. VIP QR
    vip_qr_audio_chime: false,
    vip_lounge_access: false
  },
  {
    level: 'GOLD',
    name: '🥇 Booster Gold (VIP / Enterprise)',
    monthly_price_sek: 2490,
    annual_price_sek: 24900,
    stripe_monthly_price_id: 'price_1PzGoldMonth_2490SEK',
    stripe_annual_price_id: 'price_1PzGoldYear_24900SEK',
    description: 'Det exklusiva B2B-paketet för etablerade bolag, scale-ups och experter. Obegränsat allt, AI Warm Leads och VIP-status.',
    badge_color: 'bg-gradient-to-r from-amber-400 to-amber-200 text-amber-950 border-amber-400 font-black shadow-xs',
    bg_gradient: 'from-amber-500/20 to-[#800020]/40',

    // 1. Profil & Skills
    max_skills: 999, // Obegränsat
    max_case_studies: 999, // Obegränsat + Framhävd portfölj
    priority_directory_placement: true, // Smidig topplacering
    vip_profile_badge: true,
    multi_user_seats: 4, // Företagskonto: bjud in upp till 3 kollegor (totalt 4)

    // 2. Coworking & Hubbar
    free_hub_flex_bookings_per_month: 999, // Obegränsat
    priority_hub_desk: true,
    priority_hub_highlight: true, // Guldglänsande ram i 'Vem är på hubben idag?'

    // 3. Webbmöten & Webinarier
    max_web_meetings_per_month: 999, // Obegränsat 1-till-1 möten
    can_create_events_and_meetings: true,
    access_executive_webinars: true,
    can_host_webinars: true,
    max_webinar_attendees: 1000, // Upp till 1000 deltagare (HD stream via LiveKit/Mux)
    can_sell_webinar_tickets: true, // Biljettförsäljning via Swish/Stripe där arrangören behåller intäkten

    // 4. Akademi & Kurser
    can_sell_courses: true,
    platform_course_fee_percent: 0, // 0% plattformsavgift
    can_publish_pro_masterclasses: true, // Förinspelade Pro Masterclasses bakom betalvägg

    // 5. Affärer & Leads
    can_sell_services_b2b: true,
    can_publish_sponsored_banners: true,
    ai_matchmaking_warm_leads: true, // AI Warm Leads direkt i chatten
    ad_discount_percent: 20, // 20% rabatt på alla annonser
    free_ad_feed_top_per_year: 1, // 1 fri FEED_TOP-banner per år

    // 6. Forum & Fact-Check
    can_create_forum_topics: true,
    ai_fact_check_bonus_bp: true,
    can_pin_forum_posts: true, // Nåla fast inlägg (Pin)
    expert_tag: true, // Expert-tagg

    // 7. BP & Kickback
    bp_multiplier: 2.0, // 2x BP multiplikator
    cash_kickback_per_member_sek: 500, // +500 kr cash per ny medlem
    can_gift_upgrades_bp: true,

    // 8. Proximity Ping
    proximity_ping_allowed: true,
    max_monthly_pings_sent: 999,
    advance_travel_status_allowed: true, // "Resestatus" (t.ex. Besöker Stockholm imorgon) med förhandsnotiser

    // 9. VIP QR
    vip_qr_audio_chime: true, // Särskild ton vid scanning
    vip_lounge_access: true // VIP-lounge access
  }
];

export const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv_2026_09',
    invoice_number: 'BF-2026-0891',
    date: '2026-09-01',
    due_date: '2026-09-30',
    amount_sek: 3490,
    status: 'PAID',
    plan: 'GOLD',
    recipient_name: 'Rickard Wigrund',
    recipient_email: 'rickard@wigrund.se',
    company_name: 'inCtrl .inc',
    vat_amount_sek: 872.50,
    pdf_url: '#'
  },
  {
    id: 'inv_2026_08',
    invoice_number: 'BF-2026-0744',
    date: '2026-08-01',
    due_date: '2026-08-31',
    amount_sek: 3490,
    status: 'PAID',
    plan: 'GOLD',
    recipient_name: 'Rickard Wigrund',
    recipient_email: 'rickard@wigrund.se',
    company_name: 'inCtrl .inc',
    vat_amount_sek: 872.50,
    pdf_url: '#'
  },
  {
    id: 'inv_2026_07',
    invoice_number: 'BF-2026-0612',
    date: '2026-07-01',
    due_date: '2026-07-31',
    amount_sek: 3490,
    status: 'PAID',
    plan: 'GOLD',
    recipient_name: 'Rickard Wigrund',
    recipient_email: 'rickard@wigrund.se',
    company_name: 'inCtrl .inc',
    vat_amount_sek: 872.50,
    pdf_url: '#'
  },
  {
    id: 'inv_2026_sofia_overdue',
    invoice_number: 'BF-2026-0811',
    date: '2026-08-15',
    due_date: '2026-09-01',
    amount_sek: 1490,
    status: 'OVERDUE',
    plan: 'SILVER',
    recipient_name: 'Marcus Berg',
    recipient_email: 'marcus.berg@nordicgrowth.se',
    company_name: 'Nordic Growth Capital',
    vat_amount_sek: 372.50,
    payment_link: 'https://buy.stripe.com/test_overdue_mb'
  },
  {
    id: 'inv_2026_elena_due',
    invoice_number: 'BF-2026-0902',
    date: '2026-09-05',
    due_date: '2026-09-25',
    amount_sek: 490,
    status: 'DUE',
    plan: 'BRONZE',
    recipient_name: 'Elena Rostova',
    recipient_email: 'elena@novacode.se',
    company_name: 'NovaCode Studios',
    vat_amount_sek: 122.50,
    payment_link: 'https://buy.stripe.com/test_due_elena'
  }
];

export const INITIAL_GIFT_UPGRADES: GiftUpgradeRecord[] = [
  {
    id: 'gift_1',
    sender_id: 'usr_rickard_wigrund',
    sender_name: 'Rickard Wigrund',
    recipient_id: 'usr_elena_rostova',
    recipient_name: 'Elena Rostova',
    target_level: 'SILVER',
    bp_spent: 1000,
    expires_at: '2026-10-08T23:59:59Z',
    created_at: '2026-09-08T10:30:00Z'
  }
];

export const AD_PLACEMENTS_CONFIG: import('../types').AdPlacementConfig[] = [
  {
    id: 'HOME_TOP',
    name: 'Dashboard Hero Banner (HOME_TOP)',
    location_description: 'Topplacering direkt på medlemmarnas personliga Dashboard. Högsta synlighet vid varje inloggning.',
    monthly_fixed_price_sek: 9500,
    cpm_price_sek: 250,
    aspect_ratio: '16:4',
    dimensions_px: '1200 x 280 px',
    format_type: 'full_width',
    example_reach: '~15 000 unika visningar/mån bland beslutsfattare & VD:ar',
    sample_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'FEED_TOP',
    name: 'Community Feed Sponsrat Inlägg (FEED_TOP)',
    location_description: 'Första sponsrade inlägget i det aktiva nätverksflödet och diskussionsforumet med engagerade kommentarer.',
    monthly_fixed_price_sek: 6500,
    cpm_price_sek: 180,
    aspect_ratio: '16:9',
    dimensions_px: '800 x 400 px',
    format_type: 'feed',
    example_reach: '~12 000 aktiva visningar och ~3.8% genomsnittlig CTR',
    sample_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'CALENDAR_SIDEBAR',
    name: 'Kalender & Event Sidopanel (CALENDAR_SIDEBAR)',
    location_description: 'Synlig bredvid alla eventbokningar, masterkalendern och regionala nätverksfrukostar.',
    monthly_fixed_price_sek: 4500,
    cpm_price_sek: 120,
    aspect_ratio: '1:2',
    dimensions_px: '300 x 600 px',
    format_type: 'sidebar',
    example_reach: '~8 500 visningar bland medlemmar som aktivt planerar möten',
    sample_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'HUB_HEADER',
    name: 'Hubb & Flexplats Header (HUB_HEADER)',
    location_description: 'Riktad banner mot medlemmar som bokar flex-skrivbord och mötesrum i fysiska hubbar.',
    monthly_fixed_price_sek: 5000,
    cpm_price_sek: 150,
    aspect_ratio: '16:5',
    dimensions_px: '960 x 220 px',
    format_type: 'full_width',
    example_reach: '~6 200 visningar från coworking-gäster och hubb-besökare',
    sample_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: 'WEBINAR_SPONSOR',
    name: 'Live Webinar Sponsor Overlay (WEBINAR_SPONSOR)',
    location_description: 'Exklusiv logotyp och klickbar popup-CTA under storskaliga Pro Webinars och expertpaneler.',
    monthly_fixed_price_sek: 3500, // Fast pris per event
    cpm_price_sek: 0,
    aspect_ratio: '2:1',
    dimensions_px: '400 x 200 px',
    format_type: 'modal',
    example_reach: '~250–1 000 engagerade deltagare per direktsänt webinar',
    sample_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_AD_CAMPAIGNS: import('../types').AdCampaign[] = [
  {
    id: 'camp_1',
    advertiser_id: 'usr_rickard_wigrund',
    advertiser_name: 'Rickard Wigrund',
    advertiser_company: 'inCtrl .inc',
    placement: 'HOME_TOP',
    title: 'Säkra ditt bolags molninfrastruktur – Boka fri säkerhetsgranskning',
    image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://inctrl.se/security-audit',
    pricing_model: 'FIXED_MONTHLY',
    start_date: '2026-09-01',
    end_date: '2026-09-30',
    status: 'ACTIVE',
    impressions_count: 8420,
    clicks_count: 362,
    conversions_count: 28,
    amount_paid_sek: 7600, // Med 20% Guld-rabatt
    payment_status: 'PAID'
  },
  {
    id: 'camp_2',
    advertiser_id: 'usr_sofia_eklund',
    advertiser_name: 'Sofia Eklund',
    advertiser_company: 'Eklund & Partners Advokatbyrå',
    placement: 'FEED_TOP',
    title: 'Juridiskt stöd vid bolagsförvärv & aktieägaravtal 2026',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
    target_url: 'https://eklundpartners.se/b2b-avtal',
    pricing_model: 'CPM',
    start_date: '2026-09-05',
    end_date: '2026-09-25',
    status: 'ACTIVE',
    impressions_count: 5120,
    clicks_count: 194,
    conversions_count: 14,
    amount_paid_sek: 6500,
    payment_status: 'PAID'
  },
  {
    id: 'camp_3',
    advertiser_id: 'usr_marcus_berg',
    advertiser_name: 'Marcus Berg',
    advertiser_company: 'Nordic Growth Capital',
    placement: 'CALENDAR_SIDEBAR',
    title: 'Söker ni tillväxtkapital? Ansök till Q4 Founders Batch',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80',
    target_url: 'https://nordicgrowth.se/pitch',
    pricing_model: 'FIXED_MONTHLY',
    start_date: '2026-09-10',
    end_date: '2026-10-10',
    status: 'ACTIVE',
    impressions_count: 2840,
    clicks_count: 112,
    conversions_count: 9,
    amount_paid_sek: 4500,
    payment_status: 'PAID'
  }
];

export const INITIAL_MEMBER_LOCATIONS: import('../types').MemberActiveLocation[] = [
  {
    id: 'loc_rickard',
    member_id: 'usr_rickard_wigrund',
    current_city: 'Mölnlycke',
    is_available_for_coffee: true,
    is_available_for_lunch: true,
    travel_destination: 'Stockholm Kista',
    travel_date: '2026-09-12',
    expires_at: new Date(Date.now() + 6 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'loc_sofia',
    member_id: 'usr_sofia_eklund',
    current_city: 'Mölnlycke',
    is_available_for_coffee: true,
    is_available_for_lunch: true,
    expires_at: new Date(Date.now() + 5 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'loc_marcus',
    member_id: 'usr_marcus_berg',
    current_city: 'Mölnlycke',
    is_available_for_coffee: true,
    is_available_for_lunch: false,
    expires_at: new Date(Date.now() + 4 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'loc_elena',
    member_id: 'usr_elena_rostova',
    current_city: 'Göteborg C',
    is_available_for_coffee: true,
    is_available_for_lunch: true,
    expires_at: new Date(Date.now() + 7 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'loc_johan',
    member_id: 'usr_johan_lind',
    current_city: 'Stockholm Kista',
    is_available_for_coffee: false,
    is_available_for_lunch: true,
    expires_at: new Date(Date.now() + 5 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  }
];

export const INITIAL_PROXIMITY_PINGS: import('../types').ProximityPing[] = [
  {
    id: 'ping_1',
    sender_member_id: 'usr_sofia_eklund',
    sender_name: 'Sofia Eklund',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sender_company: 'Eklund & Partners Advokatbyrå',
    sender_city: 'Mölnlycke',
    receiver_member_id: 'usr_rickard_wigrund',
    receiver_name: 'Rickard Wigrund',
    ping_type: 'COFFEE',
    status: 'PENDING',
    suggested_location: 'Booster Friends Mölnlycke Hubb Lounge',
    custom_message: 'Hej Rickard! Är på hubben i Mölnlycke nu. Sugen på en 20 min kaffe?',
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'ping_2',
    sender_member_id: 'usr_marcus_berg',
    sender_name: 'Marcus Berg',
    sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sender_company: 'Nordic Growth Capital',
    sender_city: 'Mölnlycke',
    receiver_member_id: 'usr_rickard_wigrund',
    receiver_name: 'Rickard Wigrund',
    ping_type: 'LUNCH',
    status: 'ACCEPTED',
    suggested_location: 'Restaurang Wendelsberg Mölnlycke',
    custom_message: 'Lunchmöte idag (12:00–13:00) för att sparra kring SaaS-scaling?',
    created_at: new Date(Date.now() - 120 * 60000).toISOString()
  }
];
