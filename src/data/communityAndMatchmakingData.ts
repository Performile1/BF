import { 
  IntroRequest, 
  NetworkGraphNode, 
  MicroHubGroup, 
  SpeedNetworkingMatch, 
  CommunityPost, 
  BannerAd, 
  AdminMemberApplication,
  AdminKpiStats 
} from '../types';

export const INITIAL_INTRO_REQUESTS: IntroRequest[] = [
  {
    id: 'req_1',
    author_id: 'usr_rickard_wigrund',
    author_name: 'Rickard Wigrund',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_company: 'inCtrl .inc',
    author_role: 'CEO & Grundare',
    target_role_or_company: 'Inköpschefen eller Head of Logistics på Dustin Group',
    description: 'Vi söker en varm dörröppnare till beslutshavare inom IT-inköp eller logistikflöden för att presentera vår modulära automationsplattform.',
    bounty_bp: 50,
    status: 'OPEN',
    created_at: '2026-09-06T10:15:00Z',
    comments_count: 3
  },
  {
    id: 'req_2',
    author_id: 'usr_2',
    author_name: 'Sara Lindqvist',
    author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    author_company: 'Nordic AI Solutions',
    author_role: 'Head of Growth',
    target_role_or_company: 'CFO / Ekonomidirektör på Castellum eller Fabege',
    description: 'Har någon en varm relation till ekonomiledningen på de större fastighetsbolagen? Vi har en pilot för prediktiv energianalys som sparar 18% driftkostnad.',
    bounty_bp: 50,
    status: 'IN_PROGRESS',
    connector_member_id: 'usr_3',
    connector_member_name: 'Mikael Blom',
    created_at: '2026-09-05T14:30:00Z',
    comments_count: 5
  },
  {
    id: 'req_3',
    author_id: 'usr_4',
    author_name: 'Johan Ekström',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    author_company: 'Ekström & Partners Advokatbyrå',
    author_role: 'Managing Partner',
    target_role_or_company: 'Grundare / VD för nystartade serie-A SaaS bolag',
    description: 'Vi vill erbjuda pro bono juridisk genomgång av aktieägaravtal till 2 lovande tillväxtbolag i nätverket.',
    bounty_bp: 50,
    status: 'OPEN',
    created_at: '2026-09-04T09:00:00Z',
    comments_count: 2
  }
];

export const INITIAL_NETWORK_GRAPH_NODES: NetworkGraphNode[] = [
  {
    id: 'node_rickard',
    member_id: 'usr_rickard_wigrund',
    full_name: 'Rickard Wigrund (Du)',
    company_name: 'inCtrl .inc',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'CEO & Grundare',
    is_trust_circle: true,
    deals_generated_sek: 850000,
    connection_tier: 1
  },
  {
    id: 'node_mikael',
    member_id: 'usr_3',
    full_name: 'Mikael Blom',
    company_name: 'Blom E-Com Ventures',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Grundare',
    introduced_by_id: 'usr_rickard_wigrund',
    introduced_by_name: 'Rickard Wigrund',
    is_trust_circle: true,
    deals_generated_sek: 320000,
    connection_tier: 1
  },
  {
    id: 'node_sara',
    member_id: 'usr_2',
    full_name: 'Sara Lindqvist',
    company_name: 'Nordic AI Solutions',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Head of Growth',
    introduced_by_id: 'usr_rickard_wigrund',
    introduced_by_name: 'Rickard Wigrund',
    is_trust_circle: true,
    deals_generated_sek: 250000,
    connection_tier: 1
  },
  {
    id: 'node_elena',
    member_id: 'usr_elena',
    full_name: 'Elena Rostova',
    company_name: 'SaaS Metrics AB',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'CTO',
    introduced_by_id: 'usr_3',
    introduced_by_name: 'Mikael Blom',
    is_trust_circle: false,
    deals_generated_sek: 180000,
    connection_tier: 2
  },
  {
    id: 'node_gustav',
    member_id: 'usr_gustav',
    full_name: 'Gustav Berg',
    company_name: 'Nordic Angel Syndicate',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Managing Partner',
    introduced_by_id: 'usr_2',
    introduced_by_name: 'Sara Lindqvist',
    is_trust_circle: false,
    deals_generated_sek: 100000,
    connection_tier: 2
  }
];

export const INITIAL_MICRO_HUBS: MicroHubGroup[] = [
  {
    id: 'mhub_1',
    title: 'Guld-VD:ar i Göteborg',
    category: 'Executive Leadership',
    description: 'Sluten mastermind-krets för VD:ar och bolagsägare på Guldnivå. Fokus på skalning, ägardirektiv och ledarskap.',
    city: 'Göteborg',
    icon_name: 'Crown',
    member_count: 14,
    is_member: true,
    is_exclusive_gold: true,
    lead_member_name: 'Rickard Wigrund',
    upcoming_mini_event: 'Middag & Mastermind på Avalon, 18 Sep'
  },
  {
    id: 'mhub_2',
    title: 'E-handlare & Logistik Hubben',
    category: 'E-commerce & Supply Chain',
    description: 'För medlemmar som bygger eller levererar till moderna D2C- och B2B-ehandlar. Erfarenhetsutbyte kring fraktavtal, konvertering och 3PL.',
    city: 'Hela Sverige',
    icon_name: 'ShoppingBag',
    member_count: 28,
    is_member: true,
    is_exclusive_gold: false,
    lead_member_name: 'Mikael Blom',
    upcoming_mini_event: 'Digital Case-review: Black Week-förberedelser, 24 Sep'
  },
  {
    id: 'mhub_3',
    title: 'B2B Sales & Outbound Titans',
    category: 'Sales Acceleration',
    description: 'Vi dissekerar kalla mejlsekvenser, social selling på LinkedIn och hur man stänger 6-siffriga enterprise-affärer.',
    city: 'Stockholm & Online',
    icon_name: 'TrendingUp',
    member_count: 36,
    is_member: false,
    is_exclusive_gold: false,
    lead_member_name: 'Marcus Dahl',
    upcoming_mini_event: 'Pitch-klinik & Cold Outreach Roast, 29 Sep'
  },
  {
    id: 'mhub_4',
    title: 'AI & Automation i Praktiken',
    category: 'Tech & Transformation',
    description: 'Hands-on erfarenhetsdelning av hur medlemmar implementerar LLM-agenter och internautomation för att spara 10h/vecka.',
    city: 'Hela Sverige',
    icon_name: 'Cpu',
    member_count: 42,
    is_member: false,
    is_exclusive_gold: false,
    lead_member_name: 'Sara Lindqvist',
    upcoming_mini_event: 'Live Prompt-verkstad: Från idé till fungerande agent, 1 Okt'
  }
];

export const INITIAL_SPEED_NETWORKING_MATCHES: SpeedNetworkingMatch[] = [
  {
    round_number: 1,
    partner_id: 'usr_anna_k',
    partner_name: 'Anna Karlstein',
    partner_company: 'ScaleCommerce Nordic',
    partner_role: 'COO & Co-Founder',
    partner_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    matching_synergy: 'Du erbjuder Cloud SaaS ↔ Anna söker B2B logistikpartners och affärssystem',
    duration_minutes: 15,
    timer_seconds: 840,
    is_active: true,
    meeting_link: 'https://meet.boosterfriends.se/speed-round-1'
  },
  {
    round_number: 2,
    partner_id: 'usr_johan_v',
    partner_name: 'Johan Vesterberg',
    partner_company: 'Vesterberg Capital',
    partner_role: 'Ängelinvesterare',
    partner_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    matching_synergy: 'Johan letar aktivt efter lönsamma B2B SaaS-grundare i Västra Götaland',
    duration_minutes: 15,
    timer_seconds: 900,
    is_active: false,
    meeting_link: 'https://meet.boosterfriends.se/speed-round-2'
  }
];

export const INITIAL_CADENCE_FOLLOWUPS = [
  {
    id: 'cad_1',
    member_id: 'usr_3',
    member_name: 'Mikael Blom',
    member_company: 'Blom E-Com Ventures',
    member_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    last_met_date: '2026-07-08',
    days_since: 61,
    cadence_trigger_text: 'Det var drygt 2 månader sedan du drack kaffe med Mikael i Göteborgshubben. Dags att stämma av läget och bygga vidare på er kontakt?',
    suggested_action: 'Bjud på uppföljningslunch (+20 BP)'
  },
  {
    id: 'cad_2',
    member_id: 'usr_4',
    member_name: 'Johan Ekström',
    member_company: 'Ekström & Partners',
    member_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    last_met_date: '2026-06-15',
    days_since: 84,
    cadence_trigger_text: 'Johan rekommenderade en kund till dig i juni. Skicka ett snabbt tackmeddelande eller bjud in honom till nästa Hub-frukost.',
    suggested_action: 'Skicka chattmeddelande'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    author_id: 'usr_rickard_wigrund',
    author_name: 'Rickard Wigrund',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_company: 'inCtrl .inc',
    author_role: 'CEO & Grundare',
    author_level: 'GOLD',
    author_booster_score: 950,
    post_type: 'ARTICLE',
    category: 'AFFARER_LEADS',
    title: 'Så skalar du B2B-leveranser utan att drunkna i administration (Fallstudie)',
    content: 'Under de senaste 18 månaderna har vi strukturerat om våra leveransflöden på inCtrl .inc. Nyckeln har varit att automatisera överlämningen mellan försäljning och onboarding. Här är de 3 principerna vi följde som dubblade vår kapacitet utan nyanställningar:\n\n1. Standardiserade dataströmmar från start\n2. Självbetjäning för kundens nyckelintressenter\n3. Veckovisa mikro-checkins istället för 2-timmars maratonmöten.\n\nVilka flaskhalsar ser ni i era onboarding-processer?',
    image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    tags: ['B2B', 'Skalning', 'Automation', 'Ledarskap'],
    upvotes_count: 24,
    weighted_score: 41.5,
    has_upvoted: true,
    comments_count: 8,
    comments: [
      {
        id: 'comm_1',
        post_id: 'post_1',
        author_id: 'usr_3',
        author_name: 'Mikael Blom',
        author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        author_company: 'Blom E-Com Ventures',
        author_level: 'GOLD',
        content: 'Punkt 2 förändrade allt för oss också. När kunden själv fyller i sina systemnycklar via säker portal kapade vi 4 dagars väntetid direkt!',
        upvotes: 6,
        has_upvoted: false,
        is_best_answer: true,
        created_at: '2026-09-06T12:00:00Z'
      }
    ],
    is_best_answer_awarded: true,
    created_at: '2026-09-06T08:30:00Z',
    read_time_min: 4,
    is_featured: true,
    fact_check_status: 'VERIFIED',
    fact_check_details: {
      verified_by: 'Booster Knowledge Board & Tillväxtutskottet',
      verified_date: '2026-09-06',
      summary: 'Kvalitetssäkrad fallstudie: Leveransflöden och SLA-mätning verifierade mot bekräftade kundcase.',
      source_citation: 'Metodik baserad på Lean B2B Operations Framework & inCtrl leveransaudit'
    }
  },
  {
    id: 'post_2',
    author_id: 'usr_2',
    author_name: 'Sara Lindqvist',
    author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    author_company: 'Nordic AI Solutions',
    author_role: 'Head of Growth',
    author_level: 'SILVER',
    author_booster_score: 740,
    post_type: 'POLL',
    category: 'FRAGA_EXPERTERNA',
    title: 'Omröstning: Vilken kanal ger er högst ROI för B2B-leads i år?',
    content: 'Vi ser en tydlig förskjutning bort från breda annonser mot nischade ekosystem och varma introduktioner. Hur ser er fördelning ut?',
    poll_options: [
      { id: 'opt_1', text: 'Personliga nätverk & Varma Intros (t.ex. Booster Friends)', votes: 42, has_voted: true },
      { id: 'opt_2', text: 'Social Selling & Organisk LinkedIn', votes: 23, has_voted: false },
      { id: 'opt_3', text: 'Kall outreach via e-post/telefon', votes: 9, has_voted: false },
      { id: 'opt_4', text: 'Mässor & Fysiska Branschevent', votes: 14, has_voted: false }
    ],
    tags: ['Leads', 'B2B Sälj', 'ROI', 'Omröstning'],
    upvotes_count: 18,
    weighted_score: 28.0,
    has_upvoted: false,
    comments_count: 12,
    created_at: '2026-09-05T15:45:00Z',
    is_featured: false
  },
  {
    id: 'post_3',
    author_id: 'usr_3',
    author_name: 'Mikael Blom',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    author_company: 'Blom E-Com Ventures',
    author_role: 'Grundare',
    author_level: 'GOLD',
    author_booster_score: 880,
    post_type: 'LINKEDIN_EMBED',
    category: 'VERKTYG_TIPS',
    title: 'LinkedIn Inlägg: Varför de flesta misslyckas med att behålla sina nyckelkunder',
    content: 'Jag delade mina tankar på LinkedIn igår om varför retention är den enda sanna tillväxtmotorn. Klistrar in inlägget här för Booster Friends-gemenskapen för djupare diskussion!',
    linkedin_post_url: 'https://www.linkedin.com/posts/mikael-blom-growth-retention-playbook',
    linkedin_preview: {
      author: 'Mikael Blom',
      headline: 'Founder @ Blom E-Com Ventures | E-commerce Growth & Retention',
      text: 'Om du tappar 5% av dina kunder per månad måste du springa dubbelt så fort bara för att stå stilla. Här är 4 kundvårds-kadenser som sänkte vår churn med 40% under Q2...',
      likes_count: 342,
      embed_date: 'Igår kl 14:10'
    },
    tags: ['LinkedIn', 'Retention', 'CustomerSuccess'],
    upvotes_count: 31,
    weighted_score: 52.0,
    has_upvoted: true,
    comments_count: 9,
    created_at: '2026-09-04T16:20:00Z',
    is_featured: true,
    fact_check_status: 'VERIFIED',
    fact_check_details: {
      verified_by: 'Booster AI & Retention Specialistgrupp',
      verified_date: '2026-09-05',
      summary: 'Granskad B2B-metodik: Kundkadenser och churnberäkning stämmer överens med etablerad SaaS-best practice.',
      source_citation: 'B2B Cohort Retention Analytics Q2 2026'
    }
  }
];

export const INITIAL_BANNER_ADS: BannerAd[] = [
  {
    id: 'ban_1',
    title: 'Exklusivt partnererbjudande från Convendum',
    advertiser_name: 'Convendum Coworking',
    placement: 'FEED_TOP',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    target_url: 'https://convendum.se/booster-friends',
    is_active: true,
    impressions_count: 1420,
    clicks_count: 88
  },
  {
    id: 'ban_2',
    title: 'Revisions- & Skatterådgivning för snabbväxande bolag',
    advertiser_name: 'BDO Partner Network',
    placement: 'CALENDAR_SIDEBAR',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    target_url: 'https://bdo.se/kontakt',
    is_active: true,
    impressions_count: 890,
    clicks_count: 42
  }
];

export const INITIAL_ADMIN_KPIS: AdminKpiStats = {
  total_members: 148,
  bronze_count: 52,
  silver_count: 64,
  gold_count: 32,
  total_pipeline_deal_value_sek: 14850000,
  active_monthly_checkins: 420,
  monthly_churn_rate_percent: 1.8
};

export const INITIAL_ADMIN_APPLICATIONS: AdminMemberApplication[] = [
  {
    id: 'app_1',
    applicant_name: 'Helena Bergström',
    company_name: 'CloudSecurity Nordics AB',
    org_number: '556982-4411',
    email: 'helena@cloudsec.se',
    phone: '070-988 12 34',
    hub_requested: 'Stockholm Hubb',
    requested_level: 'GOLD',
    status: 'PENDING',
    applied_at: '2026-09-06T14:10:00Z',
    financial_score: 'AAA - Högsta kreditvärdighet'
  },
  {
    id: 'app_2',
    applicant_name: 'David Qvist',
    company_name: 'Nordic Logistics Flow',
    org_number: '556711-2299',
    email: 'david@nordiclogistics.com',
    phone: '073-555 88 11',
    hub_requested: 'Göteborg Hubb',
    requested_level: 'SILVER',
    status: 'PENDING',
    applied_at: '2026-09-05T11:00:00Z',
    financial_score: 'AA - God kreditvärdighet'
  }
];
