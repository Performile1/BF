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
  PartnerPerk,
  BoosterScoreLog,
  Course,
  Certificate,
  MentorSlot,
  QuizQuestion
} from '../types';

export const CURRENT_USER: Member = {
  id: 'usr_rickard_wigrund',
  full_name: 'Rickard Wigrund',
  email: 'rickard@wigrund.se',
  linkedin_url: 'https://linkedin.com/in/rickard-wigrund',
  phone: '+46 70 488 55 62',
  company_name: 'inCtrl .inc',
  role_title: 'VD & Grundare',
  membership_level: 'GOLD',
  booster_score: 890,
  hub_id: 'hub_stockholm',
  hub_name: 'Hubb Stockholm City',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bio: 'Bygger nästa generations molnsäkerhet för nordiska tillväxtbolag. Aktiv medlem sedan 2023, passionerad för B2B-tillväxt och strategiska partnerskap.',
  seeking_tags: ['Serie A Investerare', 'Avtalsjuridik & M&A', 'Enterprise Säljchefer'],
  offering_tags: ['Molninfrastruktur', 'Cybersäkerhet', 'SaaS Skalning', 'Styrelsearbete'],
  city: 'Stockholm',
  deals_closed_sek: 1850000,
  referrals_sent: 14,
  rating_avg: 4.9,
  reviews_count: 19,
  created_at: '2023-04-12T10:00:00Z',
  merits: [
    {
      id: 'm_1',
      category: 'BOARD_ROLE',
      title: 'Styrelseledamot & Tech-Rådgivare',
      organization: 'Nordic Cloud Alliance',
      year: '2023 - Nuvarande',
      description: 'Strategisk ledning för molninfrastruktur och europeisk datasuveränitet.',
      verified: true
    },
    {
      id: 'm_2',
      category: 'CERTIFICATION',
      title: 'Certified Information Systems Security Professional (CISSP)',
      organization: '(ISC)²',
      year: '2022',
      description: 'Internationellt guldstandard-certifikat inom enterprise säkerhetsarkitektur.',
      verified: true
    },
    {
      id: 'm_3',
      category: 'EDUCATION',
      title: 'Civilingenjör Industriell Ekonomi & Datateknik',
      organization: 'KTH Kungliga Tekniska Högskolan',
      year: '2016',
      description: 'Examensarbete inom distribuerade cybersäkerhetssystem.',
      verified: true
    },
    {
      id: 'm_4',
      category: 'AWARD',
      title: 'Årets SaaS Scaleup Founder 2024 (Nominerad)',
      organization: 'Nordic Startup Awards',
      year: '2024',
      description: 'Uppmärksammad för snabb organisk tillväxt inom B2B molnsäkerhet.',
      verified: true
    }
  ],
  case_studies: [
    {
      id: 'cs_1',
      title: 'Skalning av Zero-Trust Säkerhet för FinTech Scaleup',
      client_name: 'NordicPay AB',
      result_metric: '+350% säkerhetsaudit & 0 incidenter',
      description: 'Implementerade ISO27001-kompatibel arkitektur och automatiserad incidentrespons före Serie B-finansiering.',
      tags: ['Fintech', 'Zero-Trust', 'Cloud Security', 'ISO27001'],
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'cs_2',
      title: 'Multi-region Cloud Migrering med bibehållen GDPR Compliance',
      client_name: 'CareNordic Health',
      result_metric: '-42% driftkostnad & 99.99% upptid',
      description: 'Migrerade 40TB patientdata till decentraliserad molnklusterinfrastruktur med svensk datasuveränitet.',
      tags: ['HealthTech', 'GDPR', 'Multi-Cloud', 'DevOps'],
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80'
    }
  ]
};

export const INITIAL_MEMBERS: Member[] = [
  CURRENT_USER,
  {
    id: 'usr_sofia_eklund',
    full_name: 'Sofia Eklund',
    email: 'sofia.eklund@eklundlaw.se',
    linkedin_url: 'https://linkedin.com/in/sofia-eklund-law',
    phone: '+46 72 345 67 89',
    company_name: 'Eklund & Partners Advokatbyrå',
    role_title: 'Managing Partner & Affärsjurist',
    membership_level: 'GOLD',
    booster_score: 940,
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist inom kommersiella avtal, tech-M&A, aktieägaravtal och incitamentsprogram för snabbväxande företag.',
    seeking_tags: ['Techbolag i scaleup-fas', 'Venture Capital kontakter', 'Fintech bolag'],
    offering_tags: ['Avtalsjuridik', 'Due Diligence', 'Aktieägaravtal', 'GDPR/Compliance'],
    city: 'Stockholm',
    deals_closed_sek: 3200000,
    referrals_sent: 26,
    rating_avg: 5.0,
    reviews_count: 32,
    created_at: '2022-09-15T08:30:00Z',
  },
  {
    id: 'usr_marcus_wallin',
    full_name: 'Marcus Wallin',
    email: 'marcus@nordicgrowth.vc',
    linkedin_url: 'https://linkedin.com/in/marcus-wallin-vc',
    phone: '+46 73 987 65 43',
    company_name: 'Nordic Growth Capital',
    role_title: 'Investment Partner',
    membership_level: 'GOLD',
    booster_score: 875,
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Investerar 5–25 MSEK i skalbara B2B mjukvarubolag och industriell grön omställning i Norden.',
    seeking_tags: ['SaaS B2B ARR 5-30M', 'Founders med hög ambition', 'Tech-rekommendationer'],
    offering_tags: ['Sådd- & Serie A kapital', 'Tillväxtstrategi', 'Internationellt nätverk'],
    city: 'Stockholm',
    deals_closed_sek: 8400000,
    referrals_sent: 31,
    rating_avg: 4.8,
    reviews_count: 24,
    created_at: '2023-01-20T11:15:00Z',
  },
  {
    id: 'usr_elena_rostova',
    full_name: 'Elena Rostova',
    email: 'elena@salespeak.io',
    linkedin_url: 'https://linkedin.com/in/elena-rostova-sales',
    phone: '+46 76 112 23 34',
    company_name: 'SalesPeak Academy',
    role_title: 'B2B Sales Strategist & Head Coach',
    membership_level: 'SILVER',
    booster_score: 720,
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Hjälper ledningsgrupper och enterprise-säljare att dubbla closing rate och förhandla affärer över 10 MSEK.',
    seeking_tags: ['VD & Säljchefer B2B', 'SaaS bolag i Göteborg', 'Föreläsningsuppdrag'],
    offering_tags: ['B2B-försäljning', 'Pipeline Management', 'Cold Outreach Träning', 'Closing Tech'],
    city: 'Göteborg',
    deals_closed_sek: 1450000,
    referrals_sent: 18,
    rating_avg: 4.9,
    reviews_count: 17,
    created_at: '2023-08-10T14:00:00Z',
  },
  {
    id: 'usr_peter_dahlgren',
    full_name: 'Peter Dahlgren',
    email: 'peter@urbanestates.se',
    linkedin_url: 'https://linkedin.com/in/peter-dahlgren-estates',
    phone: '+46 70 554 43 21',
    company_name: 'Urban Estates Nordic',
    role_title: 'Partner & Fastighetsutvecklare',
    membership_level: 'SILVER',
    booster_score: 680,
    hub_id: 'hub_malmo',
    hub_name: 'Hubb Malmö Dockan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Kommersiella fastigheter och premium kontorslokaler i Öresundsregionen. Skapar mötesplatser som accelererar affärer.',
    seeking_tags: ['Hyresgäster 20-100 pers', 'Hotelloperatörer', 'Arkitektbyråer'],
    offering_tags: ['Kontorslokaler', 'Fastighetsinvestering', 'Mötesrum i Malmö'],
    city: 'Malmö',
    deals_closed_sek: 4100000,
    referrals_sent: 12,
    rating_avg: 4.7,
    reviews_count: 14,
    created_at: '2023-03-01T09:00:00Z',
  },
  {
    id: 'usr_amanda_berg',
    full_name: 'Amanda Berg',
    email: 'amanda@studionorth.se',
    linkedin_url: 'https://linkedin.com/in/amanda-berg-creative',
    phone: '+46 73 221 14 45',
    company_name: 'Studio North Creative',
    role_title: 'Creative Director & Partner',
    membership_level: 'BRONZE',
    booster_score: 540,
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Varumärkesidentitet, UX-design och digital marknadsföring för tillväxtföretag med höga estetiska krav.',
    seeking_tags: ['B2B bolag med redesignbehov', 'E-handelsvarumärken', 'Fotografer & Filmare'],
    offering_tags: ['Brand Identity', 'UX/UI Design', 'Webbutveckling', 'Konverteringsoptimering'],
    city: 'Stockholm',
    deals_closed_sek: 720000,
    referrals_sent: 9,
    rating_avg: 4.8,
    reviews_count: 11,
    created_at: '2024-02-14T13:20:00Z',
  }
];

export const INITIAL_HUBS: Hub[] = [
  {
    id: 'hub_stockholm',
    name: 'Hubb Stockholm City',
    city: 'Stockholm',
    address: 'Stureplan 4, 114 35 Stockholm',
    member_count: 142,
    meeting_day: 'Varje torsdag 07:30 - 09:30',
    next_event_title: 'Stora Booster-Frukosten & B2B Matchmaking',
    next_event_date: 'Kommande Torsdag 07:30',
    geofence_lat: 59.3364,
    geofence_lng: 18.0728,
    radius_m: 120,
  },
  {
    id: 'hub_goteborg',
    name: 'Hubb Göteborg Avenyn',
    city: 'Göteborg',
    address: 'Kungsportsavenyen 21, 411 36 Göteborg',
    member_count: 98,
    meeting_day: 'Varje onsdag 07:45 - 09:30',
    next_event_title: 'Tech & Industriell Tillväxt Mingel',
    next_event_date: 'Kommande Onsdag 07:45',
    geofence_lat: 57.7011,
    geofence_lng: 11.9734,
    radius_m: 100,
  },
  {
    id: 'hub_malmo',
    name: 'Hubb Malmö Dockan',
    city: 'Malmö',
    address: 'Kranen 8, Dockan, 211 19 Malmö',
    member_count: 76,
    meeting_day: 'Varje fredag 08:00 - 10:00',
    next_event_title: 'Öresund B2B Roundtable & Lunch',
    next_event_date: 'Kommande Fredag 08:00',
    geofence_lat: 55.6142,
    geofence_lng: 12.9868,
    radius_m: 110,
  },
  {
    id: 'hub_uppsala',
    name: 'Hubb Uppsala Innovation',
    city: 'Uppsala',
    address: 'Dragarbrunnsgatan 35, 753 20 Uppsala',
    member_count: 54,
    meeting_day: 'Varannan tisdag 07:30 - 09:15',
    next_event_title: 'Life Science & Tech Investor Morning',
    next_event_date: 'Tisdag 15 Sep 07:30',
    geofence_lat: 59.8586,
    geofence_lng: 17.6441,
    radius_m: 90,
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan_sofia_direct',
    channel_type: 'DIRECT',
    title: 'Sofia Eklund (Eklund Law)',
    description: '1-till-1 Direktmeddelande',
    member_ids: ['usr_johan_lindberg', 'usr_sofia_eklund'],
    last_message: 'Perfekt! Jag skickar över förslaget till aktieägaravtal nu.',
    last_message_time: '12:44',
    unread_count: 0,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'chan_intro_thread_1',
    channel_type: 'GROUP',
    title: 'Intromatchning: Marcus Wallin & Sofia Eklund',
    description: '3-partstråd skapad av Johan Lindberg',
    member_ids: ['usr_johan_lindberg', 'usr_sofia_eklund', 'usr_marcus_wallin'],
    last_message: 'Tack Johan! Sofia, har du 15 minuter på fredag för en kort avstämning?',
    last_message_time: '11:15',
    unread_count: 1,
    is_intro_thread: true,
    intro_data: {
      introducer_name: 'Johan Lindberg',
      introduced_names: ['Marcus Wallin', 'Sofia Eklund'],
      context: 'Hej Marcus & Sofia! Marcus letar efter expertis inom aktieägaravtal inför nästa runda, och Sofia är en av våra absolut vassaste avtalsjurister i Booster Friends.'
    }
  },
  {
    id: 'chan_hub_stockholm',
    channel_type: 'HUB',
    title: 'Hubb Stockholm City – Officiell',
    description: 'Gemensam kanal för alla 142 medlemmar i Stockholm Hubb',
    member_ids: ['usr_johan_lindberg', 'usr_sofia_eklund', 'usr_marcus_wallin', 'usr_amanda_berg'],
    last_message: 'Glöm inte att anmäla er till torsdagsfrukosten senast tisdag kl 17:00!',
    last_message_time: 'Igår',
    unread_count: 2,
    avatar_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'chan_event_spring',
    channel_type: 'EVENT',
    title: 'Grupp: Stora Booster-Frukosten & B2B Matchmaking',
    description: 'Temporär eventchatt för deltagare torsdag 07:30',
    member_ids: ['usr_johan_lindberg', 'usr_sofia_eklund', 'usr_marcus_wallin'],
    last_message: 'Vi har bokat VIP-loungen på Stureplan 4. Välkomna!',
    last_message_time: '09:20',
    unread_count: 0,
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'chan_sofia_direct': [
    {
      id: 'msg_1',
      channel_id: 'chan_sofia_direct',
      sender_id: 'usr_johan_lindberg',
      sender_name: 'Johan Lindberg',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      message_text: 'Hej Sofia! Tack för en bra diskussion på hubbträffen i morse. Vi skulle behöva se över klausulerna för immateriella rättigheter i vårt nya kundavtal.',
      created_at: '2026-09-05T10:12:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund']
    },
    {
      id: 'msg_2',
      channel_id: 'chan_sofia_direct',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Hej Johan! Absolut, det tar jag gärna en titt på. Har ni ett befintligt utkast eller vill ni utgå från vår standardmall för SaaS?',
      created_at: '2026-09-05T10:18:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund']
    },
    {
      id: 'msg_3',
      channel_id: 'chan_sofia_direct',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Jag bifogar mitt digitala vCard och en preliminär mötesinbjudan för en 30-minuters genomgång.',
      attachment_type: 'vCard',
      attachment_url: '#',
      attachment_metadata: {
        title: 'Sofia Eklund – vCard Kontaktdetaljer',
        subtitle: 'Eklund & Partners Advokatbyrå • Managing Partner',
        vcard_phone: '+46 72 345 67 89',
        vcard_email: 'sofia.eklund@eklundlaw.se'
      },
      created_at: '2026-09-05T10:20:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund']
    },
    {
      id: 'msg_4',
      channel_id: 'chan_sofia_direct',
      sender_id: 'usr_johan_lindberg',
      sender_name: 'Johan Lindberg',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      message_text: 'Strålande! Mötesinbjudan godkänd.',
      attachment_type: 'meeting_invite',
      attachment_metadata: {
        title: 'Möte: Avtalsgenomgång IP & SaaS',
        subtitle: 'Digitalt via Booster Video Room',
        meeting_time: 'Fredag kl 14:00 - 14:30'
      },
      created_at: '2026-09-05T10:25:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund']
    },
    {
      id: 'msg_5',
      channel_id: 'chan_sofia_direct',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Perfekt! Jag skickar över förslaget till aktieägaravtal nu.',
      created_at: '2026-09-05T12:44:00Z',
      read_by_ids: ['usr_johan_lindberg']
    }
  ],
  'chan_intro_thread_1': [
    {
      id: 'msg_intro_1',
      channel_id: 'chan_intro_thread_1',
      sender_id: 'usr_johan_lindberg',
      sender_name: 'Johan Lindberg',
      sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      message_text: '🤝 Automatisk Intromatchning via Booster Friends:\n\n"Hej Marcus & Sofia! Marcus letar efter expertis inom aktieägaravtal inför nästa runda, och Sofia är en av våra absolut vassaste avtalsjurister i Booster Friends. Jag lämnar över ordet till er två!"',
      created_at: '2026-09-05T11:00:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund', 'usr_marcus_wallin']
    },
    {
      id: 'msg_intro_2',
      channel_id: 'chan_intro_thread_1',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Tack för introt Johan! Trevligt att connecta Marcus. Vi har strukturerat avtal för över 20 nordiska VC-rundor de senaste 18 månaderna. Berätta gärna kort om bolagets fas.',
      created_at: '2026-09-05T11:08:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund', 'usr_marcus_wallin']
    },
    {
      id: 'msg_intro_3',
      channel_id: 'chan_intro_thread_1',
      sender_id: 'usr_marcus_wallin',
      sender_name: 'Marcus Wallin',
      sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      message_text: 'Tack Johan! Sofia, har du 15 minuter på fredag för en kort avstämning?',
      created_at: '2026-09-05T11:15:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_marcus_wallin']
    }
  ],
  'chan_hub_stockholm': [
    {
      id: 'msg_hub_1',
      channel_id: 'chan_hub_stockholm',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Hej alla i Stockholm Hubb! Påminnelse om att vi välkomnar 4 nya gäster på torsdag. Se till att checka in via appens geo-fencing så fort ni anländer!',
      created_at: '2026-09-04T15:30:00Z',
      read_by_ids: ['usr_johan_lindberg', 'usr_sofia_eklund']
    },
    {
      id: 'msg_hub_2',
      channel_id: 'chan_hub_stockholm',
      sender_id: 'usr_marcus_wallin',
      sender_name: 'Marcus Wallin',
      sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      message_text: 'Glöm inte att anmäla er till torsdagsfrukosten senast tisdag kl 17:00!',
      created_at: '2026-09-04T16:10:00Z',
      read_by_ids: ['usr_johan_lindberg']
    }
  ],
  'chan_event_spring': [
    {
      id: 'msg_ev_1',
      channel_id: 'chan_event_spring',
      sender_id: 'usr_sofia_eklund',
      sender_name: 'Sofia Eklund',
      sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      message_text: 'Vi har bokat VIP-loungen på Stureplan 4. Välkomna!',
      created_at: '2026-09-05T09:20:00Z',
      read_by_ids: ['usr_johan_lindberg']
    }
  ]
};

export const INITIAL_WEBINARS: Webinar[] = [
  {
    id: 'web_live_sales',
    title: 'Relationsbaserad B2B-försäljning: Så stänger du 10 MSEK-avtal',
    description: 'Hur du transformerar kalla leads till strategiska affärspartners, strukturerar incitament och förkortar säljcykeln från 9 till 3 månader i komplex enterprise-miljö.',
    host_member_id: 'usr_elena_rostova',
    host_name: 'Elena Rostova',
    host_role: 'Head Coach & VD',
    host_company: 'SalesPeak Academy',
    start_time: '2026-09-05T14:00:00Z',
    stream_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    required_membership_level: 'BRONZE',
    category: 'Försäljning & Skalning',
    duration_min: 60,
    attendee_count: 88,
    is_live: true,
    is_registered: true,
    slides_url: '#',
    active_poll: {
      id: 'poll_1',
      question: 'Vad är er största utmaning i enterprise-säljet just nu?',
      options: [
        { id: 'opt_1', text: 'Hitta rätt beslutsfattare / C-level', votes: 42 },
        { id: 'opt_2', text: 'Långa utdragna förankringsprocesser', votes: 68 },
        { id: 'opt_3', text: 'Prispress och upphandlingskrav', votes: 29 },
        { id: 'opt_4', text: 'Konkurrens från internationella aktörer', votes: 14 }
      ]
    },
    qna_items: [
      {
        id: 'qna_1',
        author_name: 'Johan Lindberg',
        question: 'Hur hanterar du juridiska invändningar tidigt i säljprocessen innan NDA skrivits?',
        upvotes: 19,
        is_answered: true,
        user_upvoted: true,
      },
      {
        id: 'qna_2',
        author_name: 'Marcus Wallin',
        question: 'Finns det några speciella KPI:er för pipeline velocity du rekommenderar för SaaS?',
        upvotes: 14,
        is_answered: false,
      },
      {
        id: 'qna_3',
        author_name: 'Peter Dahlgren',
        question: 'Fungerar samma metodik för fysiska fastighetsavtal med institutionella ägare?',
        upvotes: 8,
        is_answered: false,
      }
    ]
  },
  {
    id: 'web_ai_board',
    title: 'AI i Styrelserummet: Juridiska Risker, Governance & Tillväxt 2026',
    description: 'Praktisk vägledning för styrelseledamöter och grundare: EU AI Act i kraft, upphovsrättsliga fallgropar och hur man skapar en vinnande AI-policy.',
    host_member_id: 'usr_sofia_eklund',
    host_name: 'Sofia Eklund',
    host_role: 'Managing Partner',
    host_company: 'Eklund & Partners Advokatbyrå',
    start_time: '2026-09-12T10:00:00Z',
    stream_url: '',
    recording_url: '',
    required_membership_level: 'SILVER',
    category: 'Juridik & Ledarskap',
    duration_min: 45,
    attendee_count: 124,
    is_live: false,
    is_registered: false,
  },
  {
    id: 'web_vc_gold',
    title: 'Masterclass: Förhandling av Term Sheets & Värdering inför Serie A',
    description: 'Exklusiv genomgång bakom stängda dörrar med ledande nordiska VC-partners. Hur du maximerar värdering utan att offra framtida handlingsfrihet.',
    host_member_id: 'usr_marcus_wallin',
    host_name: 'Marcus Wallin',
    host_role: 'Investment Partner',
    host_company: 'Nordic Growth Capital',
    start_time: '2026-09-18T13:00:00Z',
    stream_url: '',
    recording_url: '',
    required_membership_level: 'GOLD',
    category: 'Finansiering & Investering',
    duration_min: 75,
    attendee_count: 62,
    is_live: false,
    is_registered: false,
  },
  {
    id: 'web_rec_franchise',
    title: 'On-Demand: Från 1 till 10 Hubbar – Skala nätverk med partnerskap',
    description: 'Inspelad masterclass om hur man bygger franchisemodeller och starka regionala affärsklungor.',
    host_member_id: 'usr_johan_lindberg',
    host_name: 'Johan Lindberg',
    host_role: 'VD',
    host_company: 'CloudNordic AB',
    start_time: '2026-08-15T10:00:00Z',
    stream_url: '',
    recording_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    required_membership_level: 'BRONZE',
    category: 'Tillväxt & Skalning',
    duration_min: 52,
    attendee_count: 240,
    is_live: false,
  },
  {
    id: 'web_rec_ma_gold',
    title: 'On-Demand: Tech M&A – Förbered bolaget för exit (Exklusivt Guld)',
    description: 'Djupdykning i DD-processen, representations & warranties och hur man skyddar köpeskillingen vid företagsförsäljning.',
    host_member_id: 'usr_sofia_eklund',
    host_name: 'Sofia Eklund',
    host_role: 'Managing Partner',
    host_company: 'Eklund & Partners Advokatbyrå',
    start_time: '2026-07-20T14:00:00Z',
    stream_url: '',
    recording_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    required_membership_level: 'GOLD',
    category: 'Juridik & M&A',
    duration_min: 68,
    attendee_count: 145,
    is_live: false,
  }
];

export const INITIAL_SKILLS: MemberSkill[] = [
  {
    id: 'skl_1',
    member_id: 'usr_sofia_eklund',
    skill_name: 'Avtalsjuridik & M&A',
    endorsements_count: 28,
    max_capacity: 30,
    endorsers: ['Johan Lindberg', 'Marcus Wallin', 'Elena Rostova', 'Peter Dahlgren'],
    has_endorsed: true,
  },
  {
    id: 'skl_2',
    member_id: 'usr_sofia_eklund',
    skill_name: 'Aktieägaravtal & Incitament',
    endorsements_count: 24,
    max_capacity: 30,
    endorsers: ['Johan Lindberg', 'Marcus Wallin'],
    has_endorsed: true,
  },
  {
    id: 'skl_3',
    member_id: 'usr_sofia_eklund',
    skill_name: 'EU AI Act & Compliance',
    endorsements_count: 16,
    max_capacity: 30,
    endorsers: ['Johan Lindberg'],
    has_endorsed: false,
  },
  {
    id: 'skl_4',
    member_id: 'usr_johan_lindberg',
    skill_name: 'SaaS Tillväxtstrategi',
    endorsements_count: 22,
    max_capacity: 25,
    endorsers: ['Sofia Eklund', 'Marcus Wallin', 'Elena Rostova'],
    has_endorsed: true,
  },
  {
    id: 'skl_5',
    member_id: 'usr_johan_lindberg',
    skill_name: 'Molnsäkerhet & DevSecOps',
    endorsements_count: 19,
    max_capacity: 25,
    endorsers: ['Sofia Eklund', 'Peter Dahlgren'],
    has_endorsed: false,
  },
  {
    id: 'skl_6',
    member_id: 'usr_marcus_wallin',
    skill_name: 'Venture Capital & Serie A',
    endorsements_count: 27,
    max_capacity: 30,
    endorsers: ['Johan Lindberg', 'Sofia Eklund'],
    has_endorsed: true,
  },
  {
    id: 'skl_7',
    member_id: 'usr_elena_rostova',
    skill_name: 'Enterprise B2B-försäljning',
    endorsements_count: 25,
    max_capacity: 30,
    endorsers: ['Johan Lindberg', 'Amanda Berg'],
    has_endorsed: false,
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    author_member_id: 'usr_johan_lindberg',
    author_name: 'Johan Lindberg',
    author_company: 'CloudNordic AB',
    target_type: 'MEMBER',
    target_id: 'usr_sofia_eklund',
    target_title: 'Sofia Eklund',
    rating: 5,
    review_text: 'Sofia hjälpte oss att navigera ett extremt komplext kundavtal med en tysk bankkoncern. Skarp, snabbfotad och med fantastisk förståelse för tech-affärer. Oumbärlig i nätverket!',
    created_at: '2026-08-28T14:15:00Z',
  },
  {
    id: 'rev_2',
    author_member_id: 'usr_marcus_wallin',
    author_name: 'Marcus Wallin',
    author_company: 'Nordic Growth Capital',
    target_type: 'HUB',
    target_id: 'hub_stockholm',
    target_title: 'Hubb Stockholm City',
    rating: 5,
    review_text: 'Den absolut mest affärsdrivande mötesplatsen i stan. Konkreta intromatchningar och hög kvalitet på varje frukostmöte.',
    created_at: '2026-09-01T09:00:00Z',
  },
  {
    id: 'rev_3',
    author_member_id: 'usr_elena_rostova',
    author_name: 'Elena Rostova',
    author_company: 'SalesPeak Academy',
    target_type: 'EVENT',
    target_id: 'ev_spring_2026',
    target_title: 'Stora Booster-Frukosten & B2B Matchmaking',
    rating: 5,
    review_text: 'Strukturen med snabba 1-on-1 presentationer och tillval som VIP-middag genererade 3 skarpa affärsförslag direkt samma eftermiddag.',
    created_at: '2026-08-15T18:00:00Z',
  }
];

export const INITIAL_PIPELINE: DealPipelineItem[] = [
  {
    id: 'deal_1',
    title: 'Enterprise Molnsäkerhetsavtal',
    client_company: 'Nordic Logistics Group AB',
    contact_person: 'Henrik Alm',
    contact_member_id: 'usr_sofia_eklund',
    contact_member_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    referral_source: 'Sofia Eklund (Guldmedlem)',
    value_sek: 680000,
    stage: 'proposal',
    probability: 80,
    next_step: 'Genomgång av SLA och IT-säkerhetsbilaga fredag kl 11',
    due_date: '2026-09-18',
    notes: 'Initierat via Booster Friends Hubb Stockholm introduktion. Offert skickad och under slutlig styrelsegranskning.'
  },
  {
    id: 'deal_2',
    title: '1-till-1 Strategimöte: SaaS Pentest & Compliance',
    client_company: 'Fintech Scandinavia AB',
    contact_person: 'Therese Blomqvist',
    contact_member_id: 'usr_marcus_wallin',
    contact_member_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    referral_source: 'Marcus Wallin (VC)',
    value_sek: 320000,
    stage: 'meeting_done',
    probability: 60,
    next_step: 'Genomfört kaffemöte på Stureplan, förbereda offertutkast',
    due_date: '2026-09-22',
    notes: 'Fysiskt möte genomfört i Hubb Stockholm City. Mycket positiv respons.'
  },
  {
    id: 'deal_3',
    title: 'Infrastrukturmigrering till Dedicated Hybrid Cloud',
    client_company: 'Scandi Retail Group',
    contact_person: 'Mikael Sjöberg',
    contact_member_id: 'usr_elena_rostova',
    contact_member_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    referral_source: 'Elena Rostova (Sales Coach)',
    value_sek: 850000,
    stage: 'closed_won',
    probability: 100,
    next_step: 'Projektstart vecka 38, fakturerad via Fortnox B2B',
    due_date: '2026-09-01',
    notes: 'Stängd affär! Båda parter bekräftat i plattformen. +100 Booster Points tilldelat.',
    points_awarded: true
  },
  {
    id: 'deal_4',
    title: 'AI Matchning: DevSecOps Förstudie',
    client_company: 'MedTech Nordics',
    contact_person: 'Karin Nilsson',
    contact_member_id: 'usr_amanda_berg',
    referral_source: 'AI Matchmaking Algoritm',
    value_sek: 190000,
    stage: 'lead',
    probability: 25,
    next_step: 'Boka intro-samtal och skicka 1-sidas förstudieförslag',
    due_date: '2026-09-29',
    notes: 'AI-matchningsförslag med 94% affinitet baserat på offering-tags.'
  },
  {
    id: 'deal_5',
    title: 'Warm Intro Trepartschatt: Nordisk Expansion',
    client_company: 'Urban Tech Alliance',
    contact_person: 'Peter Dahlgren',
    contact_member_id: 'usr_peter_dahlgren',
    contact_member_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    referral_source: 'Trepartschatt skapad i appen',
    value_sek: 450000,
    stage: 'intro_sent',
    probability: 45,
    next_step: 'Uppföljning i chatten efter delat vCard',
    due_date: '2026-09-25',
    notes: 'Aktiv 3-partschatt. Intro skickat och godkänt av Peter.'
  }
];

export const INITIAL_SCORE_LOGS: BoosterScoreLog[] = [
  {
    id: 'log_1',
    member_id: 'usr_johan_lindberg',
    points_awarded: 100,
    activity_type: 'DEAL_WON',
    title: 'Stängd affär i My Booster Pipeline',
    description: 'Affär värd 850 000 SEK signerad med Scandi Retail Group. Båda parter bekräftade.',
    created_at: '2026-09-01T14:30:00Z',
    reference_id: 'deal_3'
  },
  {
    id: 'log_2',
    member_id: 'usr_johan_lindberg',
    points_awarded: 30,
    activity_type: 'EVENT_CHECKIN',
    title: 'QR / Geofencing Incheckning',
    description: 'Fysisk närvaro verifierad vid Stora Booster-Frukosten i Hubb Stockholm City.',
    created_at: '2026-08-28T07:35:00Z',
    reference_id: 'ev_spring_2026'
  },
  {
    id: 'log_3',
    member_id: 'usr_johan_lindberg',
    points_awarded: 40,
    activity_type: 'INTRO_3WAY',
    title: 'Trepartschatt Introduktion',
    description: 'Kopplade ihop Sofia Eklund och Marcus Wallin för M&A due diligence.',
    created_at: '2026-08-25T11:20:00Z'
  },
  {
    id: 'log_4',
    member_id: 'usr_johan_lindberg',
    points_awarded: 20,
    activity_type: 'MEETING_CONFIRMED',
    title: '1-till-1 Möte Genomfört',
    description: 'Bekräftat kaffemöte med Peter Dahlgren rörande kontorslokaler i Malmö.',
    created_at: '2026-08-21T09:45:00Z'
  },
  {
    id: 'log_5',
    member_id: 'usr_johan_lindberg',
    points_awarded: 50,
    activity_type: 'GUEST_PASS_ATTEND',
    title: 'Gästpass Genomförd Träff',
    description: 'Gästen Lisa Månsson checkade in på sin första fysiska hubbträff med Guest Pass.',
    created_at: '2026-08-15T08:00:00Z',
    reference_id: 'gp_2'
  },
  {
    id: 'log_6',
    member_id: 'usr_johan_lindberg',
    points_awarded: 15,
    activity_type: 'WEBINAR_ATTEND',
    title: 'Live Webinar Närvaro',
    description: 'Deltog i "Mastering B2B Sales & Pipeline Velocity" med Elena Rostova.',
    created_at: '2026-08-10T13:45:00Z'
  },
  {
    id: 'log_7',
    member_id: 'usr_johan_lindberg',
    points_awarded: 10,
    activity_type: 'SKILL_ENDORSEMENT',
    title: 'Skillbar Endorsement',
    description: 'Gav Sofia Eklund en verifierad röst på kompetensen "Avtalsjuridik & M&A".',
    created_at: '2026-08-04T16:10:00Z'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_b2b_sales',
    title: 'Mastering Enterprise B2B Sales & Closing',
    tagline: 'Stäng affärer över 1 000 000 SEK och bygg en förutsägbar säljmaskin',
    description: 'En intensivutbildning i avancerad förhandling, pipeline management och hantering av motpartens inköpskommittéer. Byggd specifikt för nordiska grundare och enterprise-säljare.',
    category: 'B2B Tillväxt & Skalning',
    level_required: 'GOLD',
    booster_pack_price_sek: 1490,
    duration_hours: 6.5,
    instructor_name: 'Elena Rostova',
    instructor_role: 'B2B Sales Strategist & Head Coach',
    instructor_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    modules_count: 8,
    has_certificate: true,
    is_unlocked: true,
    learning_outcomes: [
      'Strukturering av värdebaserad prissättning istället för timpris',
      'Skapa 3-parts allianser och utnyttja varma nätverksintron',
      'Avancerad closing tech för enterprise-avtal i Norden'
    ]
  },
  {
    id: 'crs_board_governance',
    title: 'Styrelsearbete & Finansiell Skalning för Scaleups',
    tagline: 'Från ägarlett till professionell styrelse och förberedelse inför Serie A',
    description: 'Lär dig hur du strukturerar styrelsearbetet, hanterar aktieägaravtal, incitamentsprogram och navigerar due diligence inför institutionellt kapital.',
    category: 'Styrelse & Finans',
    level_required: 'GOLD',
    booster_pack_price_sek: 1990,
    duration_hours: 8,
    instructor_name: 'Marcus Wallin',
    instructor_role: 'Investment Partner, Nordic Growth VC',
    instructor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    modules_count: 10,
    has_certificate: true,
    is_unlocked: true,
    learning_outcomes: [
      'Upprätta skarpa VD-instruktioner och finansiella KPI-krav',
      'Strukturera optionsprogram enligt skattemässiga 3:12-regler',
      'Genomföra framgångsrika presentationsrundor mot riskkapital'
    ]
  },
  {
    id: 'crs_leadership_mentorship',
    title: 'Det Värderingsstyrda Ledarskapet & Mjuka Kompetenser',
    tagline: 'Bygg högpresterande team utan att bränna ut nyckelpersoner',
    description: 'Utveckla din förmåga att coacha, delegera och leda genom tillit. Innehåller nedladdningsbara arbetsböcker, 1-till-1 coachningsmallar och praktiska övningar.',
    category: 'Mjuka Kompetenser',
    level_required: 'SILVER',
    booster_pack_price_sek: 990,
    duration_hours: 4.5,
    instructor_name: 'Sofia Eklund',
    instructor_role: 'Managing Partner & Executive Mentor',
    instructor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    modules_count: 6,
    has_certificate: true,
    is_unlocked: true,
    learning_outcomes: [
      'Aktivt lyssnande och konstruktiv feedbackkultur',
      'Hantera konflikter och prestationssvackor i teamet',
      'Skapa en personlig utvecklingsplan med din mentor'
    ]
  },
  {
    id: 'crs_networking_foundations',
    title: 'Nätverksarkitektur: Ge Före Du Tar',
    tagline: 'Grundkurs i hur du maximerar din ROI i Booster Friends',
    description: 'Så använder du Give & Take Ratio, loggar dina första 1-till-1 möten, aktiverar 3-partschattar och bygger ett personligt varumärke som attraherar affärer.',
    category: 'Ledarskap & Mentorskap',
    level_required: 'BRONZE',
    booster_pack_price_sek: 0,
    duration_hours: 3,
    instructor_name: 'Johan Lindberg',
    instructor_role: 'VD CloudNordic & Styrgruppsordförande',
    instructor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    modules_count: 5,
    has_certificate: true,
    is_unlocked: true,
    learning_outcomes: [
      'Formulera en skarp 60-sekunders nätverkspitch',
      'Systematiskt följa upp affärsmöjligheter i pipelinen',
      'Tjäna Booster Points genom fysisk och digital närvaro'
    ]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    certificate_code: 'BF-CERT-2026-9842',
    member_id: 'usr_johan_lindberg',
    member_name: 'Johan Lindberg',
    course_id: 'crs_b2b_sales',
    course_title: 'Mastering Enterprise B2B Sales & Closing',
    instructor_name: 'Elena Rostova',
    instructor_role: 'Head Coach, SalesPeak Academy',
    issue_date: '02 Sep 2026',
    verification_url: 'https://boosterfriends.se/verify/BF-CERT-2026-9842',
    score_percent: 96,
    skills_covered: ['Enterprise B2B-försäljning', 'Pipeline Management', 'Closing Tech']
  }
];

export const INITIAL_MENTOR_SLOTS: MentorSlot[] = [
  {
    id: 'ms_1',
    mentor_id: 'usr_elena_rostova',
    mentor_name: 'Elena Rostova',
    mentor_role: 'B2B Sales Head Coach',
    mentor_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    company: 'SalesPeak Academy',
    speciality: 'Säljstrategi & Enterprise Closing (1-on-1 sparring)',
    date_str: 'Måndag, 14 Sep',
    time_slot: '10:00 - 10:45',
    duration_min: 45,
    is_booked: false
  },
  {
    id: 'ms_2',
    mentor_id: 'usr_marcus_wallin',
    mentor_name: 'Marcus Wallin',
    mentor_role: 'Investment Partner',
    mentor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'Nordic Growth VC',
    speciality: 'Pitch Deck Review & Värdering inför Serie A',
    date_str: 'Onsdag, 16 Sep',
    time_slot: '14:30 - 15:15',
    duration_min: 45,
    is_booked: false
  },
  {
    id: 'ms_3',
    mentor_id: 'usr_sofia_eklund',
    mentor_name: 'Sofia Eklund',
    mentor_role: 'Managing Partner',
    mentor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Eklund & Partners',
    speciality: 'Aktieägaravtal & Incitamentsprogram för nyckelpersoner',
    date_str: 'Torsdag, 17 Sep',
    time_slot: '11:00 - 11:45',
    duration_min: 45,
    is_booked: true,
    booked_by_member_id: 'usr_johan_lindberg'
  }
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Vad är huvudsyftet med Give & Take Ratio i Booster Friends nätverksarkitektur?',
    options: [
      'Att säkerställa att medlemmar bidrar med värde och rekommendationer innan de förväntar sig returer.',
      'Att debitera extra plattformsavgifter för passiva medlemmar.',
      'Att begränsa antalet meddelanden i direktchatten.'
    ],
    correct_index: 0,
    explanation: 'Give & Take Ratio stimulerar generositet och förtroendebaserat affärsbyggande genom att mäta givna kontra mottagna introduktioner.'
  },
  {
    id: 'q2',
    question: 'Vilken handling i My Booster Pipeline triggar automatiskt +100 Booster Points?',
    options: [
      'Skapa ett nytt tomt lead.',
      'Flytta en affärsmöjlighet till Stängd Affär (Won Deal) efter att båda parter bekräftat.',
      'Boka om ett digitalt möte mer än två gånger.'
    ],
    correct_index: 1,
    explanation: 'Stängd affär belönas med +100 BP till köpare, säljare samt introduktören för att främja verklig kommersiell affärsnytta.'
  },
  {
    id: 'q3',
    question: 'Vad krävs för att uppnå nivån Level 4: Master Networker?',
    options: [
      'Minst 500 BP och registrering av bolagsadress.',
      'Att betala en engångsavgift för VIP-badge.',
      '2001+ Booster Points genom fysisk närvaro, verifierade affärer och hjälpsamhet i nätverket.'
    ],
    correct_index: 2,
    explanation: 'Master Networker erhåller exklusiv Maroon/Guld profilram och prioriterad synlighet överst i medlemsregistret.'
  }
];

export const INITIAL_EVENTS: BoosterEvent[] = [
  {
    id: 'ev_spring_2026',
    title: 'Stora Booster-Frukosten & B2B Matchmaking',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    date_str: 'Kommande Torsdag, 10 Sep',
    time_str: '07:30 - 09:30',
    location: 'Stureplan 4, 114 35 Stockholm',
    base_price_sek: 0, // gratis för medlemmar
    description: 'Veckans officiella nätverksträff med speed-networking, lead exchange och keynote med inbjuden tech-profil. Kaffe, färsk juice och hotellfrukost ingår.',
    spots_left: 8,
    is_booked: true,
    is_checked_in: false,
    addons: [
      {
        id: 'add_hotel',
        name: 'Hotellövernattning (Grand Hotel / Nobis)',
        price_sek: 1890,
        description: 'Deluxe-rum natten innan nätverksträffen med sen utcheckning.',
        icon: 'Hotel',
        selected: false,
      },
      {
        id: 'add_vip_dinner',
        name: 'Exklusiv VIP-Middag & Gästföreläsare',
        price_sek: 750,
        description: '3-rätters representationsmiddag kvällen innan med Hubbens styrgrupp och hedersgäster.',
        icon: 'Utensils',
        selected: true,
      },
      {
        id: 'add_spa',
        name: 'Morgon-SPA & Relax Access',
        price_sek: 350,
        description: 'Bastu, pool och relax innan frukostmötet startar.',
        icon: 'Sparkles',
        selected: false,
      }
    ]
  },
  {
    id: 'ev_gbg_summit',
    title: 'Nordic Growth Summit: Göteborg',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    date_str: 'Torsdag, 24 Sep',
    time_str: '14:00 - 19:30',
    location: 'Kungsportsavenyen 21, Göteborg',
    base_price_sek: 495,
    description: 'Regional heldagsträff med fokus på skalning, internationell expansion och B2B matchningsrum.',
    spots_left: 18,
    is_booked: false,
    is_checked_in: false,
    addons: [
      {
        id: 'add_vip_dinner_gbg',
        name: 'VIP Nätverksmiddag på Sjömagasinet',
        price_sek: 950,
        description: 'Havsmeny med utvalda viner och direkt dialog med talarna.',
        icon: 'Utensils',
        selected: false,
      }
    ]
  }
];

export const INITIAL_GUEST_PASSES: GuestPass[] = [
  {
    id: 'gp_1',
    code: 'BOOST-GUEST-9481',
    issued_by_member_id: 'usr_johan_lindberg',
    guest_name: 'Carl-Henrik Ström',
    guest_email: 'carl.strom@nordiccloud.io',
    guest_company: 'Ström & Partners Capital',
    target_hub: 'Hubb Stockholm City',
    target_date: '10 Sep 2026',
    status: 'ACTIVE',
    created_at: '2026-09-04T12:00:00Z',
  },
  {
    id: 'gp_2',
    code: 'BOOST-GUEST-8120',
    issued_by_member_id: 'usr_johan_lindberg',
    guest_name: 'Lisa Månsson',
    guest_email: 'lisa@innovativedesign.se',
    guest_company: 'Månsson Growth Lab',
    target_hub: 'Hubb Stockholm City',
    target_date: '03 Sep 2026',
    status: 'USED',
    created_at: '2026-08-29T10:00:00Z',
  }
];

export const INITIAL_PARTNER_PERKS: PartnerPerk[] = [
  {
    id: 'perk_elite',
    partner_name: 'Elite Hotels of Sweden',
    category: 'Hotell & Resor',
    discount_badge: '20% Rabatt',
    description: 'Gäller alla hotell i Sverige inklusive fri uppgradering i mån av plats för Guld- och Silvermedlemmar.',
    terms: 'Bokas online med kampanjkod eller genom att visa appens dynamiska QR-kod i receptionen.',
    promo_code: 'BOOSTER-ELITE20',
    qr_value: 'BOOSTER-PASS:ELITE:JOHAN-LINDBERG:GOLD',
    logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'perk_sturehof',
    partner_name: 'Restaurang Sturehof',
    category: 'Restaurang & Möten',
    discount_badge: '15% på Representationslunch',
    description: 'VIP-bord och 15% rabatt på nota vid affärsluncher för sällskap upp till 6 personer.',
    terms: 'Uppge Booster Friends vid bordsbokning.',
    promo_code: 'STUREHOF-BOOSTER',
    qr_value: 'BOOSTER-PASS:STUREHOF:JOHAN-LINDBERG',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'perk_fortnox',
    partner_name: 'Fortnox Business Suite',
    category: 'B2B Tjänster',
    discount_badge: '3 Månader Fritt',
    description: 'Kostnadsfri onboarding och 3 månaders licens på Bokföring, Fakturering och Lön för nya bolag.',
    terms: 'Kopplat direkt mot Booster Friends Faktura API.',
    promo_code: 'FORTNOX-BOOST3M',
    qr_value: 'BOOSTER-PASS:FORTNOX:API',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'perk_sas',
    partner_name: 'SAS Corporate Credits',
    category: 'Hotell & Resor',
    discount_badge: 'Upp till 12% Credits',
    description: 'Företagsrabatt på inrikes- och Europaflyg med fast track och lounge-access för Guldmedlemmar.',
    terms: 'Gäller SAS Plus och Go Pro.',
    promo_code: 'SAS-BOOSTER-CORP',
    qr_value: 'BOOSTER-PASS:SAS:CORP-991',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=80',
  }
];

export const POSTGRESQL_SCHEMA_SQL = `-- Medlemmar
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255),
  membership_level VARCHAR(20) CHECK (membership_level IN ('BRONZE', 'SILVER', 'GOLD')),
  booster_score INT DEFAULT 0,
  hub_id UUID REFERENCES hubs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Direkta Meddelanden & Chattar
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type VARCHAR(20) CHECK (channel_type IN ('DIRECT', 'GROUP', 'HUB', 'EVENT')),
  title VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES members(id),
  message_text TEXT NOT NULL,
  attachment_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webinars
CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  host_member_id UUID REFERENCES members(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  stream_url VARCHAR(500),
  recording_url VARCHAR(500),
  required_membership_level VARCHAR(20) DEFAULT 'BRONZE'
);

-- Skillbars & Endorsements
CREATE TABLE member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL
);

CREATE TABLE skill_endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES member_skills(id) ON DELETE CASCADE,
  endorser_member_id UUID REFERENCES members(id),
  UNIQUE(skill_id, endorser_member_id)
);

-- Omdömen (Members, Hubs, Events)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_member_id UUID REFERENCES members(id),
  target_type VARCHAR(20) CHECK (target_type IN ('MEMBER', 'HUB', 'EVENT')),
  target_id UUID NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- BOOSTER FRIENDS V4: MY BOOSTER PIPELINE & GAMIFICATION
-- ==========================================================

-- CRM Pipeline Deals
CREATE TABLE pipeline_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  contact_member_id UUID REFERENCES members(id), -- Medlemmen affären gäller / intro från
  deal_title VARCHAR(255) NOT NULL,
  client_company VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  estimated_value DECIMAL(12,2) DEFAULT 0.00,
  stage VARCHAR(50) CHECK (stage IN ('LEAD', 'INTRO_SENT', 'MEETING_DONE', 'PROPOSAL', 'WON', 'LOST')),
  probability INT DEFAULT 25,
  next_step TEXT,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booster Score Loggar (Audit Trail för Poäng)
CREATE TABLE booster_score_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  points_awarded INT NOT NULL,
  activity_type VARCHAR(100) NOT NULL, -- T.ex. 'EVENT_CHECKIN', 'MEETING_CONFIRMED', 'INTRO_3WAY', 'DEAL_WON', 'WEBINAR_ATTEND', 'SKILL_ENDORSEMENT', 'GUEST_PASS_ATTEND'
  title VARCHAR(255),
  reference_id UUID, -- Valfri koppling till event_id, deal_id eller review_id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gästpass och Inbjudningar
CREATE TABLE guest_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  host_member_id UUID REFERENCES members(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_company VARCHAR(255),
  target_hub_id UUID REFERENCES hubs(id),
  status VARCHAR(20) CHECK (status IN ('INVITED', 'REGISTERED', 'ATTENDED', 'ACTIVE', 'USED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- BOOSTER FRIENDS V5: KURSER, BOOSTER PACKS & CERTIFIKAT
-- ==========================================================

-- Kurskatalog (Brons, Silver, Guld eller Booster Pack)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  level_required VARCHAR(20) CHECK (level_required IN ('BRONZE', 'SILVER', 'GOLD')),
  booster_pack_price_sek DECIMAL(10,2) DEFAULT 0.00, -- Engångsköp för lägre nivåer
  duration_hours DECIMAL(4,1) DEFAULT 3.0,
  instructor_id UUID REFERENCES members(id),
  modules_count INT DEFAULT 5,
  has_certificate BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medlemmars Kursåtkomst (prenumeration eller engångsköpt Booster Pack)
CREATE TABLE member_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  access_type VARCHAR(50) CHECK (access_type IN ('MEMBERSHIP_TIER', 'BOOSTER_PACK_PURCHASE', 'GIFT_GRANT')),
  payment_method VARCHAR(50), -- 'SWISH', 'STRIPE', 'FORTNOX_INVOICE'
  paid_amount_sek DECIMAL(10,2),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, course_id)
);

-- Verifierbara Certifikat (PDF & QR-kod)
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code VARCHAR(100) UNIQUE NOT NULL, -- T.ex. 'BF-CERT-2026-9842'
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  score_percent INT NOT NULL CHECK (score_percent >= 0 AND score_percent <= 100),
  issue_date DATE DEFAULT CURRENT_DATE,
  verification_url VARCHAR(500) NOT NULL, -- boosterfriends.se/verify/{code}
  pdf_storage_path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor Office Hours & 1-on-1 Sparring
CREATE TABLE mentor_office_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES members(id) ON DELETE CASCADE,
  speciality VARCHAR(255) NOT NULL,
  slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_min INT DEFAULT 45,
  is_booked BOOLEAN DEFAULT FALSE,
  booked_by_member_id UUID REFERENCES members(id),
  meeting_link VARCHAR(500)
);`;
