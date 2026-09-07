import { 
  MasterCalendarEvent, 
  CoworkingDeskBooking, 
  PartnerCoworkingLocation, 
  DeskSwap, 
  PromoCode, 
  FreeTrialPass, 
  LunchMatch, 
  CommunityResource, 
  FlashDeal,
  MemberCoworkingCredits
} from '../types';

export const INITIAL_COWORKING_CREDITS: Record<string, MemberCoworkingCredits> = {
  'usr_johan_lindberg': {
    member_id: 'usr_johan_lindberg',
    included_monthly_quota: 5, // GOLD
    used_monthly_quota: 1,
    purchased_extra_credits: 3, // 3 kvar från 5-klippkort
    unlimited_month_pass_active: false
  },
  'usr_sofia_eklund': {
    member_id: 'usr_sofia_eklund',
    included_monthly_quota: 5,
    used_monthly_quota: 2,
    purchased_extra_credits: 0,
    unlimited_month_pass_active: false
  },
  'usr_marcus_wallin': {
    member_id: 'usr_marcus_wallin',
    included_monthly_quota: 2, // SILVER
    used_monthly_quota: 1,
    purchased_extra_credits: 5,
    unlimited_month_pass_active: false
  },
  'usr_erik_svensson': {
    member_id: 'usr_erik_svensson',
    included_monthly_quota: 0, // BRONZE
    used_monthly_quota: 0,
    purchased_extra_credits: 2,
    unlimited_month_pass_active: false
  }
};

export const INITIAL_MASTER_EVENTS: MasterCalendarEvent[] = [
  {
    id: 'evt_past_summer_summit_2026',
    title: 'Booster Friends Sommar-Summit & M&A Mingle',
    description: 'Årets flaggskeppsträff på takterrassen i Stockholm med fokus på tech-affärer, M&A och internationell expansion.',
    category: 'HUB_MEETING',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-08-27',
    display_date: 'Torsdag 27 Aug',
    start_time: '16:00',
    end_time: '19:30',
    location: 'Takterrassen, Stureplan 4, Stockholm',
    required_level: 'BRONZE',
    spots_max: 60,
    attendees_count: 54,
    is_booked: true,
    speaker_or_host: 'Sofia Eklund & Johan Lindberg',
    is_past: true,
    rating_avg: 4.9,
    reviews_count: 18,
    recap_text: 'Årets sommarträff samlade 54 företagsledare på takterrassen i Stockholm. Keynote av Sofia Eklund rörande due diligence och hur man skyddar köpeskillingen ledde till djupgående diskussioner. Under minglet koordinerades 28 strukturerade 1-till-1 möten och flera deltagare inledde pilotsamarbeten.',
    impact_stats: {
      meetings_count: 14,
      intros_count: 6,
      deals_sek: 850000
    },
    gallery_images: [
      {
        id: 'gal_1',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
        caption: 'Mingel och paneldebatt på takterrassen',
        author_name: 'Emma Lind',
        author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'gal_2',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80',
        caption: 'Bordsrunda med 1-till-1 presentationer',
        author_name: 'Marcus Wallin',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'gal_3',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
        caption: 'Fokuserad speed-dating i hubblokalen',
        author_name: 'Sofia Eklund',
        author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      }
    ],
    event_reviews: [
      {
        id: 'rev_ev_1',
        member_id: 'usr_johan_lindberg',
        member_name: 'Johan Lindberg',
        member_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        review_text: 'En av de absolut bästa träffarna hittills. 1-till-1 borden var fantastiskt koordinerade och ledde direkt till två nya pilotkunder.',
        created_at: '2026-08-28T09:12:00Z',
        is_verified: true
      },
      {
        id: 'rev_ev_2',
        member_id: 'usr_amanda_berg',
        member_name: 'Amanda Berg',
        member_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        review_text: 'Klockrena diskussioner och god energi. Har redan bokat uppföljande lunch med 3 deltagare!',
        created_at: '2026-08-27T19:40:00Z',
        is_verified: true
      }
    ],
    checked_in_members: [
      {
        id: 'usr_sofia_eklund',
        full_name: 'Sofia Eklund',
        role_title: 'Senior Affärsjurist',
        company_name: 'Eklund & Partners Advokatbyrå',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        booster_score: 1120,
        membership_level: 'GOLD',
        industry: 'Juridik & M&A',
        competence_tag: 'M&A & Avtal'
      },
      {
        id: 'usr_johan_lindberg',
        full_name: 'Johan Lindberg',
        role_title: 'VD & Grundare',
        company_name: 'Nordic Growth Tech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        booster_score: 940,
        membership_level: 'GOLD',
        industry: 'B2B SaaS',
        competence_tag: 'SaaS Skalning'
      },
      {
        id: 'usr_marcus_wallin',
        full_name: 'Marcus Wallin',
        role_title: 'Venture Partner',
        company_name: 'Apex Growth Ventures',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        booster_score: 870,
        membership_level: 'SILVER',
        industry: 'Investering & Finans',
        competence_tag: 'Venture Capital'
      }
    ],
    attendees: [
      {
        id: 'usr_sofia_eklund',
        full_name: 'Sofia Eklund',
        role_title: 'Senior Affärsjurist',
        company_name: 'Eklund & Partners Advokatbyrå',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        booster_score: 1120,
        membership_level: 'GOLD',
        industry: 'Juridik & M&A',
        competence_tag: 'M&A & Avtal'
      },
      {
        id: 'usr_johan_lindberg',
        full_name: 'Johan Lindberg',
        role_title: 'VD & Grundare',
        company_name: 'Nordic Growth Tech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        booster_score: 940,
        membership_level: 'GOLD',
        industry: 'B2B SaaS',
        competence_tag: 'SaaS Skalning'
      }
    ]
  },
  {
    id: 'evt_past_goteborg_kickoff',
    title: 'Göteborgs B2B Höst-Kickoff & Frukost',
    description: 'Höststarten på Avenyn med fokus på gemensamma anbud, partnerskap och nätverkande inför Q4.',
    category: 'HUB_MEETING',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    is_digital: false,
    date_str: '2026-09-02',
    display_date: 'Onsdag 2 Sep',
    start_time: '07:30',
    end_time: '09:30',
    location: 'Kungsportsavenyen 21, Göteborg',
    required_level: 'BRONZE',
    spots_max: 40,
    attendees_count: 36,
    is_booked: true,
    speaker_or_host: 'Lars Bergqvist (Göteborg Hubb)',
    is_past: true,
    rating_avg: 4.8,
    reviews_count: 12,
    recap_text: 'Kickoffen samlade 36 bolag på Avenyn. Träffen kretsade kring hur vi lokalt kan stötta varandra i större offentliga och privata upphandlingar. 8 nya 1-till-1 kaffemöten och 3 varma introduktioner loggades direkt efter träffen.',
    impact_stats: {
      meetings_count: 8,
      intros_count: 3,
      deals_sek: 320000
    },
    gallery_images: [
      {
        id: 'gal_4',
        url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
        caption: 'Fullsatt i Göteborgs lounge under frukosten',
        author_name: 'Lars Bergqvist',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'gal_5',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
        caption: 'Gemensam strategi-sprint i grupp',
        author_name: 'Peter Dahlgren',
        author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      }
    ],
    event_reviews: [
      {
        id: 'rev_ev_3',
        member_id: 'usr_peter_dahlgren',
        member_name: 'Peter Dahlgren',
        member_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        review_text: 'Mycket bra format! Konkreta affärsdiskussioner och inget fluff. Nätverket levererar verkligt värde.',
        created_at: '2026-09-02T13:10:00Z',
        is_verified: true
      }
    ],
    checked_in_members: [
      {
        id: 'usr_peter_dahlgren',
        full_name: 'Peter Dahlgren',
        role_title: 'Fastighetsstrateg',
        company_name: 'Urban Property Advisory',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        booster_score: 510,
        membership_level: 'SILVER',
        industry: 'Fastighet & Etablering',
        competence_tag: 'Kommersiella Lokaler'
      }
    ],
    attendees: []
  },
  {
    id: 'evt_sthlm_breakfast',
    title: 'Stora Booster-Frukosten & B2B Matchmaking',
    description: 'Nätverkets flaggskeppsträff i Stockholm. Strukturerat 1-till-1 bordssamtal, 60-sekunders presentationsrunda och föreläsning om internationell expansion.',
    category: 'HUB_MEETING',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-10',
    display_date: 'Torsdag 10 Sep',
    start_time: '07:30',
    end_time: '09:30',
    location: 'Stureplan 4, 114 35 Stockholm',
    required_level: 'BRONZE',
    spots_max: 60,
    attendees_count: 48,
    is_booked: true,
    speaker_or_host: 'Johan Lindberg & Sofia Eklund',
    speaker_one_on_one: {
      enabled: true,
      speaker_name: 'Sofia Eklund',
      speaker_title: 'Senior Affärsjurist & Partner',
      speaker_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      duration_minutes: 30,
      price_sek: 1490,
      total_slots: 3,
      booked_slots: 1,
      description: 'Personlig 30-minuters rådgivningssession i styrelserummet direkt efter frukosten. Genomlysning av dina kundavtal, partnerskap eller aktieägaravtal.',
      available_time_slots: ['09:40 - 10:10', '10:15 - 10:45', '10:50 - 11:20'],
      is_booked_by_user: false
    },
    attendees: [
      {
        id: 'usr_johan_lindberg',
        full_name: 'Johan Lindberg',
        role_title: 'VD & Grundare',
        company_name: 'Nordic Growth Tech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        booster_score: 940,
        membership_level: 'GOLD',
        industry: 'B2B SaaS / Tech',
        competence_tag: 'SaaS Skalning & AI'
      },
      {
        id: 'usr_sofia_eklund',
        full_name: 'Sofia Eklund',
        role_title: 'Senior Affärsjurist & Partner',
        company_name: 'Eklund & Partners Advokatbyrå',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        booster_score: 1120,
        membership_level: 'GOLD',
        industry: 'Juridik & Bolagsstyrning',
        competence_tag: 'M&A och Aktieägaravtal'
      },
      {
        id: 'usr_emma_lind',
        full_name: 'Emma Lind',
        role_title: 'Creative Director',
        company_name: 'Studio Forma',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        booster_score: 620,
        membership_level: 'BRONZE',
        industry: 'Design & Varumärke',
        competence_tag: 'Brand Identity & UX'
      }
    ]
  },
  {
    id: 'evt_sales_friday_goteborg',
    title: 'Sälj-fredag & Coworking Sprint',
    description: 'Heldag med fokuserat säljarbete, live pitch-träning och gemensam lunch på Avenyn. Vi sätter möten tillsammans och stänger veckans affärer.',
    category: 'COWORKING_THEME',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    is_digital: false,
    date_str: '2026-09-11',
    display_date: 'Fredag 11 Sep',
    start_time: '09:00',
    end_time: '16:00',
    location: 'Kungsportsavenyen 21, Göteborg',
    required_level: 'SILVER',
    spots_max: 20,
    attendees_count: 16,
    is_booked: false,
    speaker_or_host: 'Marcus Wallin (Apex Sales)',
    attendees: [
      {
        id: 'usr_marcus_wallin',
        full_name: 'Marcus Wallin',
        role_title: 'Head of Sales',
        company_name: 'Apex Sales Accelerator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        booster_score: 780,
        membership_level: 'SILVER',
        industry: 'B2B Försäljning',
        competence_tag: 'Enterprise Pipeline'
      }
    ]
  },
  {
    id: 'evt_webinar_live_ai',
    title: 'Live Webinar: AI-drivet B2B Kundinflöde',
    description: 'Interaktiv digital föreläsning med skärmdelning och live Q&A. Hur du automatiserar outbound-prospektering och kvalificering med moderna AI-agenter.',
    category: 'WEBINAR',
    is_digital: true,
    date_str: '2026-09-15',
    display_date: 'Tisdag 15 Sep',
    start_time: '12:00',
    end_time: '13:00',
    location: 'Booster Live Studio (Digital stream)',
    required_level: 'BRONZE',
    spots_max: 200,
    attendees_count: 135,
    is_booked: true,
    speaker_or_host: 'Johan Lindberg',
    speaker_one_on_one: {
      enabled: true,
      speaker_name: 'Johan Lindberg',
      speaker_title: 'VD & Grundare, Nordic Growth Tech',
      speaker_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      duration_minutes: 25,
      price_sek: 1950,
      total_slots: 2,
      booked_slots: 0,
      description: 'Digital 1-1 AI-genomlysning efter webinaret. Johan granskar ert företags ICP, datakällor och sätter upp promptstrukturer för era outbound-agenter.',
      available_time_slots: ['13:15 - 13:40', '13:45 - 14:10'],
      is_booked_by_user: false
    },
    attendees: [
      {
        id: 'usr_johan_lindberg',
        full_name: 'Johan Lindberg',
        role_title: 'VD & Grundare',
        company_name: 'Nordic Growth Tech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        booster_score: 940,
        membership_level: 'GOLD',
        industry: 'B2B SaaS / Tech',
        competence_tag: 'SaaS Skalning & AI'
      },
      {
        id: 'usr_erik_svensson',
        full_name: 'Erik Svensson',
        role_title: 'E-commerce Director',
        company_name: 'Nordic Retail Group',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        booster_score: 510,
        membership_level: 'BRONZE',
        industry: 'E-handel & Retail',
        competence_tag: 'D2C Skalning & Logistik'
      }
    ]
  },
  {
    id: 'evt_academy_board_cert',
    title: 'Executive Workshop: Styrelsearbete & Finansieringsrunda',
    description: 'Exklusiv 4-timmars certifieringsworkshop för Guld-medlemmar och företagsledare som förbereder A-runda eller emission.',
    category: 'ACADEMY_WORKSHOP',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-17',
    display_date: 'Torsdag 17 Sep',
    start_time: '13:00',
    end_time: '17:00',
    location: 'Styrelserummet, Stureplan 4, Stockholm',
    required_level: 'GOLD',
    spots_max: 12,
    attendees_count: 9,
    is_booked: false,
    speaker_or_host: 'Sofia Eklund & Gästinvesterare',
    attendees: [
      {
        id: 'usr_sofia_eklund',
        full_name: 'Sofia Eklund',
        role_title: 'Senior Affärsjurist & Partner',
        company_name: 'Eklund & Partners Advokatbyrå',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        booster_score: 1120,
        membership_level: 'GOLD',
        industry: 'Juridik & Bolagsstyrning',
        competence_tag: 'M&A och Aktieägaravtal'
      }
    ]
  },
  {
    id: 'evt_malmo_oresund_roundtable',
    title: 'Öresund B2B Roundtable & Nätverkslunch',
    description: 'Cross-border expansion: Hur svenska bolag skalar till Danmark och norra Tyskland med Malmö som brofäste.',
    category: 'HUB_MEETING',
    hub_id: 'hub_malmo',
    hub_name: 'Hubb Malmö Dockan',
    is_digital: false,
    date_str: '2026-09-18',
    display_date: 'Fredag 18 Sep',
    start_time: '11:30',
    end_time: '13:30',
    location: 'Kranen 8, Dockan, Malmö',
    required_level: 'BRONZE',
    spots_max: 35,
    attendees_count: 24,
    is_booked: false,
    speaker_or_host: 'Lars Bergqvist (Malmö Hubbledare)',
    attendees: []
  },
  {
    id: 'evt_uppsala_lifescience',
    title: 'Tech & Innovation Morning Uppsala',
    description: 'Möt 5 snabbväxande DeepTech- och Life Science-bolag. Paneldiskussion och nätverksmingel med inkubatorer och investerare.',
    category: 'HUB_MEETING',
    hub_id: 'hub_uppsala',
    hub_name: 'Hubb Uppsala Innovation',
    is_digital: false,
    date_str: '2026-09-22',
    display_date: 'Tisdag 22 Sep',
    start_time: '07:30',
    end_time: '09:15',
    location: 'Dragarbrunnsgatan 35, Uppsala',
    required_level: 'BRONZE',
    spots_max: 30,
    attendees_count: 21,
    is_booked: false,
    speaker_or_host: 'Karin Söderlund',
    attendees: []
  },
  {
    id: 'evt_kickoff_aw',
    title: 'Höstens Kick-Off & Exklusiv AW med Nätverket',
    description: 'Välkommen till höststarten! Vi firar avslutade sommaraffärer, presenterar höstens hubbmål och har gemensamt nätverksmingel med dryck och tilltugg.',
    category: 'HUB_MEETING',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-04',
    display_date: 'Fredag 4 Sep',
    start_time: '17:00',
    end_time: '20:00',
    location: 'Takbaren Stureplan, Stockholm',
    required_level: 'BRONZE',
    spots_max: 80,
    attendees_count: 65,
    is_booked: true,
    speaker_or_host: 'Johan Lindberg & Booster Ledning',
    attendees: []
  },
  {
    id: 'evt_sales_webinar_funnel',
    title: 'Digital Masterclass: Automatiserade B2B Säljtrattar',
    description: 'Hur du integrerar CRM, AI-outreach och automatiserade bokningar för att fylla din säljkalender med kvalificerade beslutsfattare.',
    category: 'WEBINAR',
    is_digital: true,
    date_str: '2026-09-08',
    display_date: 'Tisdag 8 Sep',
    start_time: '12:00',
    end_time: '13:00',
    location: 'Booster Live Studio (Digital stream)',
    required_level: 'BRONZE',
    spots_max: 250,
    attendees_count: 180,
    is_booked: false,
    speaker_or_host: 'Marcus Wallin (Apex Sales)',
    speaker_one_on_one: {
      enabled: true,
      speaker_name: 'Marcus Wallin',
      speaker_title: 'Head of Sales & Pipeline Strategist',
      speaker_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      duration_minutes: 30,
      price_sek: 1290,
      total_slots: 3,
      booked_slots: 1,
      description: '30-minuters privat genomlysning av din säljtratt direkt efter webinaret. Marcus identifierar flaskhalsar och ger konkreta manus & sekvenser.',
      available_time_slots: ['13:10 - 13:40', '13:45 - 14:15', '14:20 - 14:50'],
      is_booked_by_user: false
    },
    attendees: []
  },
  {
    id: 'evt_sthlm_pitch_dinner',
    title: 'Scaleup Pitch & Investerarmiddag',
    description: 'Sex utvalda bolag i Booster Friends pitchar inför ledande affärsänglar och VC-representanter. Följs av trerätters nätverksmiddag.',
    category: 'HUB_MEETING',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-24',
    display_date: 'Torsdag 24 Sep',
    start_time: '18:00',
    end_time: '21:30',
    location: 'Grand Hôtel Vinterträdgården, Stockholm',
    required_level: 'GOLD',
    spots_max: 40,
    attendees_count: 38,
    is_booked: true,
    speaker_or_host: 'Sofia Eklund & Gästinvesterare',
    price_sek: 1950,
    allows_free_member_invites: true,
    free_invites_allowed_level: 'GOLD',
    free_invites_quota: 2,
    invitations: [
      {
        id: 'inv_1',
        event_id: 'evt_sthlm_pitch_dinner',
        invited_member_id: 'usr_marcus_wallin',
        invited_member_name: 'Marcus Wallin',
        invited_member_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        invited_member_company: 'Apex Sales Accelerator',
        invited_by_id: 'usr_johan_lindberg',
        invited_by_name: 'Johan Lindberg',
        is_free_ticket: true,
        original_price_sek: 1950,
        status: 'CONFIRMED',
        created_at: '2026-09-02T14:30:00Z'
      }
    ],
    attendees: []
  },
  {
    id: 'evt_pricing_workshop',
    title: 'Akademi Workshop: Värdebaserad Prissättning & Avtalsförhandling',
    description: 'Gå från timarvode till värdebaserade retainer-avtal. Praktiska modeller, fallstudier och avtalsmallar godkända av affärsjurist.',
    category: 'ACADEMY_WORKSHOP',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-29',
    display_date: 'Tisdag 29 Sep',
    start_time: '13:00',
    end_time: '16:30',
    location: 'Stureplan 4, 114 35 Stockholm',
    required_level: 'SILVER',
    spots_max: 20,
    attendees_count: 15,
    is_booked: false,
    speaker_or_host: 'Sofia Eklund & Johan Lindberg',
    price_sek: 1490,
    allows_free_member_invites: true,
    free_invites_allowed_level: 'GOLD',
    free_invites_quota: 2,
    speaker_one_on_one: {
      enabled: true,
      speaker_name: 'Sofia Eklund',
      speaker_title: 'Senior Affärsjurist & Partner',
      speaker_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      duration_minutes: 30,
      price_sek: 1790,
      total_slots: 2,
      booked_slots: 0,
      description: '1-1 djupgranskning av ert standardavtal och prissättningsklausuler direkt efter workshopen. Få juridisk trygghet och skarpa förhandlingsargument.',
      available_time_slots: ['16:45 - 17:15', '17:20 - 17:50'],
      is_booked_by_user: false
    },
    attendees: []
  },
  {
    id: 'evt_speeddate_sthlm_b2b',
    title: 'B2B Speed Dating: 10 Kvalificerade Möten på 60 Minuter',
    description: 'Booster Friends strukturerade nätverksformat! 10 intensiva 6-minuters 1-1 sessioner med förvalda företagare. AI matchar schema baserat på din bransch, kompetenser och vad du söker. Inkluderar klockringning och omedelbart digitalt vCard-utbyte.',
    category: 'SPEED_DATING',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    is_digital: false,
    date_str: '2026-09-16',
    display_date: 'Onsdag 16 Sep',
    start_time: '15:00',
    end_time: '16:30',
    location: 'Stureplan 4, 114 35 Stockholm',
    required_level: 'BRONZE',
    spots_max: 30,
    attendees_count: 24,
    is_booked: true,
    speaker_or_host: 'Faciliteras av Booster Teamet',
    price_sek: 950,
    allows_free_member_invites: true,
    free_invites_allowed_level: 'GOLD',
    free_invites_quota: 2,
    speed_dating_details: {
      rounds_count: 10,
      minutes_per_round: 6,
      matching_algorithm: 'AI-algoritm baserad på dina taggar "Söker" och "Erbjuder"',
      format: 'PHYSICAL_TABLES',
      rotations_type: 'Strukturerade rotationer vid numrerade bord med klocksignal'
    },
    attendees: [
      {
        id: 'usr_johan_lindberg',
        full_name: 'Johan Lindberg',
        role_title: 'VD & Grundare',
        company_name: 'Nordic Growth Tech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        booster_score: 940,
        membership_level: 'GOLD',
        industry: 'B2B SaaS / Tech',
        competence_tag: 'SaaS Skalning & AI'
      },
      {
        id: 'usr_marcus_wallin',
        full_name: 'Marcus Wallin',
        role_title: 'Head of Sales',
        company_name: 'Apex Sales Accelerator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        booster_score: 780,
        membership_level: 'SILVER',
        industry: 'B2B Försäljning',
        competence_tag: 'Enterprise Pipeline'
      },
      {
        id: 'usr_emma_lind',
        full_name: 'Emma Lind',
        role_title: 'Creative Director',
        company_name: 'Studio Forma',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        booster_score: 620,
        membership_level: 'BRONZE',
        industry: 'Design & Varumärke',
        competence_tag: 'Brand Identity & UX'
      }
    ]
  },
  {
    id: 'evt_speeddate_digital_tech',
    title: 'Digital Tech & Investerar Speed Match',
    description: 'Effektiv digital speeddating i dedikerade breakout-rum. 8 snabba möten à 6 minuter med grundare, CTOs och ängelinvesterare från hela Norden.',
    category: 'SPEED_DATING',
    is_digital: true,
    date_str: '2026-09-23',
    display_date: 'Onsdag 23 Sep',
    start_time: '13:00',
    end_time: '14:15',
    location: 'Booster Virtual Matchroom (Zoom Breakouts)',
    required_level: 'SILVER',
    spots_max: 40,
    attendees_count: 32,
    is_booked: false,
    speaker_or_host: 'Booster Digital Host',
    speed_dating_details: {
      rounds_count: 8,
      minutes_per_round: 6,
      matching_algorithm: 'Algoritmisk parbildning mellan kapital- och kompetenssökande',
      format: 'DIGITAL_BREAKOUT_ROOMS',
      rotations_type: 'Automatisk förflyttning mellan digitala mötesrum'
    },
    attendees: []
  },
  {
    id: 'evt_speeddate_goteborg',
    title: 'Göteborg B2B Speed Dating & Affärssynergier',
    description: 'Västsvenska företagsträffen med fokus på snabba samarbeten, underleverantörskontakter och korsförsäljning. 8 bordssamtal med kaffe och mingel.',
    category: 'SPEED_DATING',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    is_digital: false,
    date_str: '2026-09-25',
    display_date: 'Fredag 25 Sep',
    start_time: '14:00',
    end_time: '15:30',
    location: 'Kungsportsavenyen 21, Göteborg',
    required_level: 'BRONZE',
    spots_max: 24,
    attendees_count: 18,
    is_booked: false,
    speaker_or_host: 'Marcus Wallin (Värd)',
    speed_dating_details: {
      rounds_count: 8,
      minutes_per_round: 7,
      matching_algorithm: 'Lokal branschdiversifiering för maximala affärsmöjligheter',
      format: 'PHYSICAL_TABLES',
      rotations_type: 'Rotation i cirkulär bordsuppställning'
    },
    attendees: []
  }
];

export const INITIAL_COWORKING_BOOKINGS: CoworkingDeskBooking[] = [
  {
    id: 'bk_1',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    member_id: 'usr_sofia_eklund',
    member_name: 'Sofia Eklund',
    member_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    member_company: 'Eklund & Partners Advokatbyrå',
    member_role: 'Senior Affärsjurist',
    competence_tags: ['Juridik', 'M&A', 'Avtal', 'Styrelse'],
    booking_date: new Date().toISOString().split('T')[0],
    slot_type: 'FULL_DAY',
    is_checked_in: true,
    check_in_time: '08:15',
    check_in_method: 'GEO',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'bk_2',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    member_id: 'usr_johan_lindberg',
    member_name: 'Johan Lindberg',
    member_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    member_company: 'Nordic Growth Tech',
    member_role: 'VD & Grundare',
    competence_tags: ['SaaS', 'AI', 'Produktutveckling', 'Investeringar'],
    booking_date: new Date().toISOString().split('T')[0],
    slot_type: 'FULL_DAY',
    is_checked_in: true,
    check_in_time: '08:45',
    check_in_method: 'QR',
    created_at: '2026-09-02T11:00:00Z'
  },
  {
    id: 'bk_3',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    member_id: 'usr_emma_lind',
    member_name: 'Emma Lind',
    member_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    member_company: 'Studio Forma',
    member_role: 'Creative Director',
    competence_tags: ['UX/UI', 'Varumärke', 'Design', 'Webb'],
    booking_date: new Date().toISOString().split('T')[0],
    slot_type: 'AM',
    is_checked_in: true,
    check_in_time: '09:05',
    check_in_method: 'GEO',
    created_at: '2026-09-03T14:20:00Z'
  },
  {
    id: 'bk_4',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    member_id: 'usr_erik_svensson',
    member_name: 'Erik Svensson',
    member_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    member_company: 'Nordic Retail Group',
    member_role: 'E-commerce Director',
    competence_tags: ['E-handel', 'Logistik', 'Shopify', 'Annonsering'],
    booking_date: new Date().toISOString().split('T')[0],
    slot_type: 'PM',
    is_checked_in: false,
    created_at: '2026-09-04T09:00:00Z'
  },
  {
    id: 'bk_5',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    member_id: 'usr_marcus_wallin',
    member_name: 'Marcus Wallin',
    member_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    member_company: 'Apex Sales Accelerator',
    member_role: 'Head of Sales',
    competence_tags: ['B2B Sälj', 'Cold Outreach', 'Förhandling', 'CRM'],
    booking_date: new Date().toISOString().split('T')[0],
    slot_type: 'FULL_DAY',
    is_checked_in: true,
    check_in_time: '08:30',
    check_in_method: 'GEO',
    created_at: '2026-09-04T08:15:00Z'
  }
];

export const INITIAL_PARTNER_LOCATIONS: PartnerCoworkingLocation[] = [
  {
    id: 'ptnr_convendum_kungsgatan',
    name: 'Convendum Stockholm Kungsgatan',
    brand_group: 'Convendum',
    address: 'Kungsgatan 9, 111 43 Stockholm',
    city: 'Stockholm',
    daily_desk_allocation: 8,
    available_today: 4,
    policy_allow_desk_swap: true,
    amenities: ['Baristakaffe', 'Ljudisolerade mötesbås', 'Gym & Dusch', 'Bistro', 'Hög hastighets Wi-Fi (1 Gbps)'],
    opening_hours: '08:00 - 18:00 (Guld 24/7 med tagg)',
    wifi_network: 'Convendum-Guest',
    wifi_pass: 'booster2026',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    contact_person: 'Helena Svanström (Site Manager)',
    contact_email: 'kungsgatan@convendum.se',
    phone: '08-545 000 10',
    rating_score: 4.9
  },
  {
    id: 'ptnr_united_spaces_goteborg',
    name: 'United Spaces Göteborg Östra Hamngatan',
    brand_group: 'United Spaces',
    address: 'Östra Hamngatan 16, 411 10 Göteborg',
    city: 'Göteborg',
    daily_desk_allocation: 6,
    available_today: 3,
    policy_allow_desk_swap: true,
    amenities: ['Takrass med utsikt', 'Podcast-studio', 'Cykelrum med laddning', 'Ergonomiska höj/sänkbara skrivbord'],
    opening_hours: '08:00 - 17:30',
    wifi_network: 'UnitedSpaces-Connect',
    wifi_pass: 'boosterfriends',
    image_url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=600&auto=format&fit=crop&q=80',
    contact_person: 'Carl-Johan Alm',
    contact_email: 'goteborg@unitedspaces.se',
    phone: '031-700 80 00',
    rating_score: 4.8
  },
  {
    id: 'ptnr_mindpark_malmo',
    name: 'Mindpark Malmö City',
    brand_group: 'Mindpark',
    address: 'Rundelsgatan 14, 211 36 Malmö',
    city: 'Malmö',
    daily_desk_allocation: 5,
    available_today: 3,
    policy_allow_desk_swap: true,
    amenities: ['Kreativ lounge', 'Eventyta', 'Frukostservering fre', 'Hundvänligt kontor'],
    opening_hours: '08:30 - 17:00',
    wifi_network: 'Mindpark-Community',
    wifi_pass: 'mindpark2026',
    image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    contact_person: 'Sara Nordin',
    contact_email: 'malmo@mindpark.se',
    phone: '040-600 50 10',
    rating_score: 4.7
  },
  {
    id: 'ptnr_helio_uppsala',
    name: 'Helio Uppsala Kungsgatan',
    brand_group: 'Helio',
    address: 'Kungsgatan 47B, 753 21 Uppsala',
    city: 'Uppsala',
    daily_desk_allocation: 5,
    available_today: 2,
    policy_allow_desk_swap: true,
    amenities: ['Designklassiker', 'Ekologiskt te & espresso', 'Fokusrum', 'Mötesrum med 4K-skärmar'],
    opening_hours: '08:00 - 17:00',
    wifi_network: 'Helio-Guest',
    wifi_pass: 'helioguest',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    contact_person: 'Viktor Melin',
    contact_email: 'uppsala@helio.se',
    phone: '018-400 30 20',
    rating_score: 4.8
  }
];

export const INITIAL_DESK_SWAPS: DeskSwap[] = [
  {
    id: 'swap_1',
    lender_member_id: 'usr_sofia_eklund',
    lender_member_name: 'Sofia Eklund',
    lender_member_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lender_company: 'Eklund & Partners Advokatbyrå',
    location_id: 'hub_stockholm',
    location_name: 'Hubb Stockholm City',
    is_partner_location: false,
    available_date: '2026-09-11',
    desk_label: 'Fast Plats 12B (Fönsterläge mot Stureplan, 34" Curved skärm)',
    notes: 'Jag är i domstolsförhandling hela fredagen! Lånar gärna ut min plats med dubbla skärmar till någon kollega.',
    status: 'AVAILABLE',
    points_awarded: true,
    created_at: '2026-09-04T12:00:00Z'
  },
  {
    id: 'swap_2',
    lender_member_id: 'usr_marcus_wallin',
    lender_member_name: 'Marcus Wallin',
    lender_member_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lender_company: 'Apex Sales Accelerator',
    location_id: 'ptnr_united_spaces_goteborg',
    location_name: 'United Spaces Göteborg Östra Hamngatan',
    is_partner_location: true,
    available_date: '2026-09-14',
    desk_label: 'Dedikerad Flexzon 4 (Tyst avdelning, ergonomisk stol)',
    notes: 'Kundmöten på resande fot i Borås på måndag. Platsen är fri hela dagen.',
    status: 'AVAILABLE',
    points_awarded: true,
    created_at: '2026-09-04T14:30:00Z'
  },
  {
    id: 'swap_3',
    lender_member_id: 'usr_emma_lind',
    lender_member_name: 'Emma Lind',
    lender_member_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    lender_company: 'Studio Forma',
    location_id: 'hub_stockholm',
    location_name: 'Hubb Stockholm City',
    is_partner_location: false,
    available_date: '2026-09-15',
    desk_label: 'Kreativ Flexplats 8 (Nära designstudion och kaffestationen)',
    notes: 'Fotografering on-site hos kund hela tisdagen.',
    status: 'BOOKED',
    borrower_member_id: 'usr_erik_svensson',
    borrower_member_name: 'Erik Svensson',
    borrower_member_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    points_awarded: true,
    created_at: '2026-09-03T09:00:00Z'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo_silver20',
    code: 'SILVER20',
    discount_type: 'PERCENTAGE',
    discount_value: 20,
    campaign_name: 'Tillväxtboost Q3 – Silver 20%',
    description: '20% rabatt på Silver-medlemskap första 3 månaderna.',
    target_applicable: 'SILVER_MEMBERSHIP',
    valid_from: '2026-08-01T00:00:00Z',
    valid_until: '2026-10-31T23:59:59Z',
    max_uses: 100,
    current_uses: 38,
    hub_attribution: 'Hubb Stockholm City',
    ambassador_member_id: 'usr_johan_lindberg'
  },
  {
    id: 'promo_booster500',
    code: 'BOOSTER500',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 500,
    campaign_name: 'Direkt 500 kr rabatt på Booster Pack',
    description: 'Dra av 500 kr direkt vid köp av valfritt Booster Pack eller Klippkort.',
    target_applicable: 'BOOSTER_PACK',
    valid_from: '2026-08-15T00:00:00Z',
    valid_until: '2026-11-30T23:59:59Z',
    max_uses: 250,
    current_uses: 92,
    hub_attribution: 'Rikstäckande Kampanj'
  },
  {
    id: 'promo_freedays3',
    code: 'FREEDAYS3',
    discount_type: 'FREE_CREDITS',
    discount_value: 3,
    campaign_name: '3 Extra Coworking-dagar',
    description: 'Få 3 extra fria Coworking-dagpass laddade på din profil vid tecknande.',
    target_applicable: 'COWORKING_PASS',
    valid_from: '2026-09-01T00:00:00Z',
    valid_until: '2026-12-31T23:59:59Z',
    max_uses: 50,
    current_uses: 14,
    hub_attribution: 'Hubb Göteborg Avenyn'
  }
];

export const INITIAL_TRIAL_PASSES: FreeTrialPass[] = [
  {
    id: 'trial_pass_1',
    code: 'TRIAL-STHLM-9841',
    guest_name: 'Kajsa Bergström',
    guest_email: 'kajsa@nordicadvisory.se',
    guest_company: 'Nordic Advisory Group',
    invited_by_member_id: 'usr_johan_lindberg',
    invited_by_member_name: 'Johan Lindberg',
    target_hub_id: 'hub_stockholm',
    target_hub_name: 'Hubb Stockholm City',
    pass_date: '2026-09-10',
    status: 'ACTIVE',
    includes_breakfast: true,
    created_at: '2026-09-03T15:00:00Z'
  },
  {
    id: 'trial_pass_2',
    code: 'TRIAL-GBG-3204',
    guest_name: 'Simon Holm',
    guest_email: 'simon@scalecloud.io',
    guest_company: 'ScaleCloud AB',
    invited_by_member_id: 'usr_marcus_wallin',
    invited_by_member_name: 'Marcus Wallin',
    target_hub_id: 'hub_goteborg',
    target_hub_name: 'Hubb Göteborg Avenyn',
    pass_date: '2026-09-11',
    status: 'ACTIVE',
    includes_breakfast: true,
    created_at: '2026-09-04T10:30:00Z'
  }
];

export const INITIAL_LUNCH_MATCHES: LunchMatch[] = [
  {
    id: 'lunch_match_1',
    city: 'Stockholm',
    match_date: 'Tisdag 15 Sep kl 12:00',
    member_a_id: 'usr_johan_lindberg',
    member_a_name: 'Johan Lindberg',
    member_a_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    member_a_role: 'VD (SaaS)',
    member_a_company: 'Nordic Growth Tech',
    member_a_seeking: ['Bolagsjurister för avtal & emission', 'Styrelseledamöter'],
    member_b_id: 'usr_sofia_eklund',
    member_b_name: 'Sofia Eklund',
    member_b_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    member_b_role: 'Senior Affärsjurist',
    member_b_company: 'Eklund & Partners Advokatbyrå',
    member_b_offering: ['Avtalsjuridik & M&A', 'Due Diligence', 'Styrelsearbete'],
    suggested_restaurant: 'Restaurang Prinsen, Mäster Samuelsgatan 4',
    restaurant_address: 'Mäster Samuelsgatan 4, 111 44 Stockholm',
    synergy_reason: 'Komplementär matchning: Johan söker rådgivning inför en kommande A-runda och Sofia har bred expertis inom tech-avtal & optionsprogram.',
    status: 'PROPOSED',
    points_awarded: false
  },
  {
    id: 'lunch_match_2',
    city: 'Stockholm',
    match_date: 'Tisdag 22 Sep kl 12:15',
    member_a_id: 'usr_emma_lind',
    member_a_name: 'Emma Lind',
    member_a_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    member_a_role: 'Creative Director',
    member_a_company: 'Studio Forma',
    member_a_seeking: ['E-handelsvarumärken', 'B2B bolag med redesignbehov'],
    member_b_id: 'usr_erik_svensson',
    member_b_name: 'Erik Svensson',
    member_b_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    member_b_role: 'E-commerce Director',
    member_b_company: 'Nordic Retail Group',
    member_b_offering: ['D2C Skalning', 'Logistik', 'Shopify Plus'],
    suggested_restaurant: 'Bistro Rigoletto, Kungsgatan 57',
    restaurant_address: 'Kungsgatan 57, 111 22 Stockholm',
    synergy_reason: 'Hög affärspotential: Erik planerar en komplett omprofilering av sitt flaggskeppsvarumärke inför Black Week och söker en senior designpartner.',
    status: 'CONFIRMED',
    points_awarded: true
  }
];

export const INITIAL_COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    id: 'res_podcast_sthlm',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    name: 'Booster Poddstudio 4K Pro',
    category: 'PODCAST_STUDIO',
    description: 'Professionellt akustikdämpat radiorrum för 4 personer. Shure SM7B-mikrofoner, RØDECaster Pro II mixer och 4K Blackmagic-kameror för videopodd.',
    equipment_list: ['4x Shure SM7B mikrofoner', 'RØDECaster Pro II', '2x Sony A7C II 4K kameror', 'Elgato Key Lights', 'Hörlurar Beyerdynamic DT 770'],
    hourly_rate_sek: 350,
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    current_booking_note: 'Ledig idag efter kl 14:00'
  },
  {
    id: 'res_photo_gbg',
    hub_id: 'hub_goteborg',
    hub_name: 'Hubb Göteborg Avenyn',
    name: 'Kreativ Fotostudio & Produktlabb',
    category: 'PHOTO_STUDIO',
    description: 'Vit rundfond, Profoto-blixtpaket och softboxar för professionella produktfoton, porträtt och social media-kampanjer.',
    equipment_list: ['Profoto B10X Plus kit', 'Bakgrundsrullar (Vit, Grå, Brandgul)', 'Reflektorer & C-stands', 'Tethering-arbetsstation med iMac 27"'],
    hourly_rate_sek: 450,
    image_url: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    current_booking_note: 'Bokad kl 10:00 - 12:00, därefter helt ledig'
  },
  {
    id: 'res_3d_malmo',
    hub_id: 'hub_malmo',
    hub_name: 'Hubb Malmö Dockan',
    name: 'Prototyping Lab & 3D-Skrivare',
    category: '3D_PRINTER',
    description: 'Bambu Lab X1-Carbon för snabb framtagning av hårdvaruprototyper i industriellt filament (PLA, ABS, Carbon Fiber).',
    equipment_list: ['Bambu Lab X1-Carbon Combo', 'Multi-material system (AMS)', 'CAD/CAM slicing-dator', 'Post-processing station'],
    hourly_rate_sek: 200,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    current_booking_note: 'Ledig hela dagen'
  }
];

export const INITIAL_FLASH_DEALS: FlashDeal[] = [
  {
    id: 'deal_room_convendum',
    partner_name: 'Convendum Kungsgatan',
    category: 'MEETING_ROOM',
    title: '50% på Exekutivt Styrelserum (8 pers) i eftermiddag',
    description: 'Ledigt mellan 14:00 - 17:00 idag. Inklusive baristakaffe, 75" videokonferensskärm och fruktfat.',
    original_price_sek: 2400,
    deal_price_sek: 1200,
    discount_percent: 50,
    expires_at: 'Idag kl 14:00 (om 2h)',
    location: 'Kungsgatan 9, Stockholm',
    remaining_deals: 1,
    claimed_by_user: false
  },
  {
    id: 'deal_lunch_riche',
    partner_name: 'Restaurang Riche',
    category: 'RESTAURANT',
    title: 'Nätverksbord för 2 – 30% på à la carte',
    description: 'Perfekt för spontan partnerlunch eller kundmöte. Reserverat bord i Teatergrillen.',
    original_price_sek: 950,
    deal_price_sek: 665,
    discount_percent: 30,
    expires_at: 'Idag kl 12:30',
    location: 'Birger Jarlsgatan 4, Stockholm',
    remaining_deals: 2,
    claimed_by_user: false
  },
  {
    id: 'deal_hotel_clarion_post',
    partner_name: 'Clarion Hotel Post',
    category: 'HOTEL',
    title: 'Sista Minuten Affärsrum Göteborg – 40% rabatt',
    description: 'Gäller övernattning torsdag-fredag i samband med Sälj-fredagen på Hubb Göteborg. Inklusive takterrass-pool & frukost.',
    original_price_sek: 2200,
    deal_price_sek: 1320,
    discount_percent: 40,
    expires_at: 'Torsdag kl 18:00',
    location: 'Drottningtorget 10, Göteborg',
    remaining_deals: 3,
    claimed_by_user: false
  }
];

export const POSTGRESQL_V6_V7_SCHEMA_SQL = `-- ==========================================================
-- BOOSTER FRIENDS V6: MASTERKALENDER, HUBBAR & COWORKING FLEX
-- ==========================================================

-- 1. Hubbar & Fysisk Flexkapacitet
CREATE TABLE hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, -- T.ex. "Hubb Stockholm City", "Hubb Göteborg Avenyn"
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  total_flex_desks INT NOT NULL DEFAULT 15,
  hub_lead_member_id UUID REFERENCES members(id),
  geofence_lat DECIMAL(9,6),
  geofence_lng DECIMAL(9,6),
  radius_m INT DEFAULT 100,
  wifi_network VARCHAR(100),
  wifi_password VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Flexplatsbokningar & Närvarospårning
CREATE TABLE flex_desk_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  slot_type VARCHAR(20) CHECK (slot_type IN ('FULL_DAY', 'AM', 'PM')) DEFAULT 'FULL_DAY',
  is_checked_in BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_in_method VARCHAR(20) CHECK (check_in_method IN ('QR', 'GEO')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id, member_id, booking_date)
);

-- 3. Medlemmars Coworking-saldo (Klippkort & Månadskvoter)
CREATE TABLE member_coworking_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  included_monthly_quota INT DEFAULT 0, -- Brons: 0, Silver: 2, Guld: 5
  used_monthly_quota INT DEFAULT 0,
  purchased_extra_credits INT DEFAULT 0, -- Köpta dagspass (250 kr) eller 5-klippkort (1 000 kr)
  unlimited_month_pass_active BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Masterkalender (Alla evenemang i en vy)
CREATE TABLE master_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(30) CHECK (category IN ('HUB_MEETING', 'WEBINAR', 'COWORKING_THEME', 'ACADEMY_WORKSHOP')),
  hub_id UUID REFERENCES hubs(id),
  is_digital BOOLEAN DEFAULT FALSE,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  required_membership_level VARCHAR(20) DEFAULT 'BRONZE',
  spots_max INT DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- BOOSTER FRIENDS V7: PARTNER COWORKING, DESK SWAP, PROMOS & LUNCH
-- ==========================================================

-- 5. Anslutna Partner-Coworkingkontor (Convendum, United Spaces, Mindpark)
CREATE TABLE partner_coworking_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand_group VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  daily_desk_allocation INT DEFAULT 5, -- Antal reserverade platser för Booster Friends
  policy_allow_desk_swap BOOLEAN DEFAULT TRUE,
  opening_hours VARCHAR(100),
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Desk Swap & Peer-Lending ("Låna ut din plats")
CREATE TABLE desk_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  location_id UUID, -- Kan referera hubs(id) eller partner_coworking_locations(id)
  is_partner_location BOOLEAN DEFAULT FALSE,
  available_date DATE NOT NULL,
  desk_label VARCHAR(100), -- T.ex. "Plats 12B vid fönstret"
  notes TEXT,
  status VARCHAR(20) CHECK (status IN ('AVAILABLE', 'BOOKED', 'COMPLETED')) DEFAULT 'AVAILABLE',
  borrower_member_id UUID REFERENCES members(id),
  points_awarded BOOLEAN DEFAULT FALSE, -- +25 BP till utlånaren
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Dynamiska Kampanj- & Rabattkoder
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- T.ex. 'SILVER20', 'BOOSTER500'
  discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_CREDITS')),
  discount_value DECIMAL(10,2) NOT NULL,
  campaign_name VARCHAR(255),
  target_applicable VARCHAR(50) DEFAULT 'ALL',
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INT DEFAULT 100,
  current_uses INT DEFAULT 0,
  hub_attribution UUID REFERENCES hubs(id),
  ambassador_member_id UUID REFERENCES members(id)
);

-- 8. Prova-på-dagar (Free Trial Pass)
CREATE TABLE free_trial_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- T.ex. 'TRIAL-STHLM-9841'
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_company VARCHAR(255),
  invited_by_member_id UUID REFERENCES members(id),
  target_hub_id UUID REFERENCES hubs(id),
  pass_date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED')) DEFAULT 'ACTIVE',
  includes_breakfast BOOLEAN DEFAULT TRUE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. "Lunch-A-Friend" (Slumpmässig Nätverkslunch)
CREATE TABLE lunch_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL,
  match_date DATE NOT NULL,
  member_a_id UUID REFERENCES members(id) ON DELETE CASCADE,
  member_b_id UUID REFERENCES members(id) ON DELETE CASCADE,
  suggested_restaurant VARCHAR(255),
  synergy_reason TEXT,
  status VARCHAR(20) CHECK (status IN ('PROPOSED', 'CONFIRMED', 'COMPLETED')) DEFAULT 'PROPOSED',
  points_awarded BOOLEAN DEFAULT FALSE, -- +20 BP per person
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Resource Sharing & Maskinpark (Poddstudio, Fotostudio, 3D-skrivare)
CREATE TABLE community_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('PODCAST_STUDIO', 'PHOTO_STUDIO', '3D_PRINTER', 'AV_GEAR')),
  description TEXT,
  hourly_rate_sek DECIMAL(10,2) DEFAULT 0.00,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Flash Deals / Sista Minuten (Hotell, Mötesrum, Lunch)
CREATE TABLE flash_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('MEETING_ROOM', 'HOTEL', 'RESTAURANT', 'COWORKING')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  original_price_sek DECIMAL(10,2) NOT NULL,
  deal_price_sek DECIMAL(10,2) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  remaining_deals INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;
