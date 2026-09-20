import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  MousePointer, 
  Plus, 
  Edit3, 
  Check, 
  Trash2, 
  FileText, 
  DollarSign, 
  Calendar, 
  BarChart3,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  HelpCircle,
  CheckSquare,
  MapPin,
  X,
  Sparkles,
  UserPlus,
  Layout,
  Sliders,
  CreditCard,
  Clock
} from 'lucide-react';
import { 
  Member, 
  Hub, 
  BannerAd, 
  AdminMemberApplication, 
  AdminKpiStats,
  MembershipLevel,
  QuizQuestion,
  AdFormat,
  AdPlacementType
} from '../../types';
import { 
  INITIAL_BANNER_ADS, 
  INITIAL_ADMIN_KPIS, 
  INITIAL_ADMIN_APPLICATIONS 
} from '../../data/communityAndMatchmakingData';
import { SAMPLE_QUIZ_QUESTIONS } from '../../data/initialData';
import { AdZonesVisualGuide } from '../ads/AdZonesVisualGuide';
import { AdminBillingAndRulesModule } from './AdminBillingAndRulesModule';
import { AdminTrialSettings } from './AdminTrialSettings';
import { AdminProspectImporter } from './AdminProspectImporter';

interface AdminPortalModuleProps {
  currentUser: Member;
  allMembers: Member[];
  hubs: Hub[];
  onUpdateMemberLevel?: (memberId: string, level: 'BRONZE' | 'SILVER' | 'GOLD') => void;
  onSaveHub?: (hub: Hub) => void;
  onCreateHub?: (hubData: Omit<Hub, 'id'>) => void;
  onCreateMember?: (memberData: Partial<Member>) => void;
  quizQuestions?: QuizQuestion[];
  onCreateQuizQuestion?: (question: QuizQuestion) => void;
}

export const AdminPortalModule: React.FC<AdminPortalModuleProps> = ({
  currentUser,
  allMembers = [],
  hubs = [],
  onUpdateMemberLevel,
  onSaveHub,
  onCreateHub,
  onCreateMember,
  quizQuestions = SAMPLE_QUIZ_QUESTIONS,
  onCreateQuizQuestion
}) => {
  // Strict RBAC Guard: Only SUPER_ADMIN can view or interact with the Admin Portal
  if (currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl text-center space-y-6" id="admin-access-denied-screen">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center mx-auto shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black">
            Åtkomst Nekad • Endast Super Admin
          </div>
          <h2 className="text-2xl font-black text-gray-900 font-display">
            Behörighetskontroll: Adminpanelen är låst
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Du är inloggad som <strong className="text-gray-900">{currentUser.full_name}</strong> med rollen <strong className="text-red-700">{currentUser.role}</strong> ({currentUser.membership_level} Member). Denna panel är uteslutande reserverad för användare med rollen <strong>SUPER_ADMIN</strong>.
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Snabbtest i Demo-läge:
          </div>
          <p className="text-[11px] leading-relaxed">
            För att komma åt och testa adminverktygen, använd demo-profilväljaren i sidhuvudet och växla till <strong>Rickard Wigrund (SUPER_ADMIN)</strong>.
          </p>
        </div>
      </div>
    );
  }

  const [activeAdminTab, setActiveAdminTab] = useState<'KPIS' | 'PROSPECTS' | 'BILLING' | 'RULES' | 'APPLICATIONS' | 'BANNERS' | 'HUBS' | 'MEMBERS' | 'QUIZ' | 'TRIAL'>('KPIS');
  const [applications, setApplications] = useState<AdminMemberApplication[]>(INITIAL_ADMIN_APPLICATIONS);
  const [bannerAds, setBannerAds] = useState<BannerAd[]>(INITIAL_BANNER_ADS);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // New banner form modal state
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [showVisualGuide, setShowVisualGuide] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerAdvertiser, setNewBannerAdvertiser] = useState('');
  const [newBannerPlacement, setNewBannerPlacement] = useState<BannerAd['placement']>('FEED_TOP');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80');
  const [newBannerUrl, setNewBannerUrl] = useState('https://boosterfriends.se/partners');
  const [newBannerFormat, setNewBannerFormat] = useState<AdFormat>('FULL_WIDTH');
  const [newBannerHeight, setNewBannerHeight] = useState<number>(180);
  const [newBannerWidth, setNewBannerWidth] = useState<string>('100%');

  // Hub Form Modal State (Create or Edit)
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [showCreateHubModal, setShowCreateHubModal] = useState(false);
  const [hubFormName, setHubFormName] = useState('');
  const [hubFormCity, setHubFormCity] = useState('Stockholm');
  const [hubFormAddress, setHubFormAddress] = useState('');
  const [hubFormMemberCount, setHubFormMemberCount] = useState<number>(24);
  const [hubFormMeetingDay, setHubFormMeetingDay] = useState('Torsdagar kl 07:30');
  const [hubFormNextEventTitle, setHubFormNextEventTitle] = useState('Booster Breakfast & Nätverksfrukost');
  const [hubFormNextEventDate, setHubFormNextEventDate] = useState('Kommande torsdag kl 07:30');
  const [hubFormRadiusM, setHubFormRadiusM] = useState<number>(150);

  // Member Creation Modal State
  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);
  const [memName, setMemName] = useState('');
  const [memRole, setMemRole] = useState('');
  const [memCompany, setMemCompany] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memPhone, setMemPhone] = useState('+46 8 ');
  const [memCity, setMemCity] = useState('Stockholm');
  const [memLevel, setMemLevel] = useState<MembershipLevel>('SILVER');
  const [memAvatar, setMemAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [memBio, setMemBio] = useState('');
  const [memHubId, setMemHubId] = useState(hubs[0]?.id || 'hub_stockholm');

  // Quiz Question Creation Modal State
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [quizQuestionText, setQuizQuestionText] = useState('');
  const [quizOpt0, setQuizOpt0] = useState('');
  const [quizOpt1, setQuizOpt1] = useState('');
  const [quizOpt2, setQuizOpt2] = useState('');
  const [quizOpt3, setQuizOpt3] = useState('');
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  // Hub Edit Helpers
  const handleOpenEditHub = (hub: Hub) => {
    setEditingHub(hub);
    setHubFormName(hub.name);
    setHubFormCity(hub.city);
    setHubFormAddress(hub.address);
    setHubFormMemberCount(hub.member_count);
    setHubFormMeetingDay(hub.meeting_day);
    setHubFormNextEventTitle(hub.next_event_title);
    setHubFormNextEventDate(hub.next_event_date);
    setHubFormRadiusM(hub.radius_m);
  };

  const handleSaveEditedHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHub) return;
    const updated: Hub = {
      ...editingHub,
      name: hubFormName,
      city: hubFormCity,
      address: hubFormAddress,
      member_count: Number(hubFormMemberCount) || 10,
      meeting_day: hubFormMeetingDay,
      next_event_title: hubFormNextEventTitle,
      next_event_date: hubFormNextEventDate,
      radius_m: Number(hubFormRadiusM) || 150
    };
    if (onSaveHub) {
      onSaveHub(updated);
    }
    setEditingHub(null);
    setFeedbackNotice(`✓ Hubben "${updated.name}" har sparats och synkas i alla moduler och KPI!`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleCreateNewHubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHubData: Omit<Hub, 'id'> = {
      name: hubFormName,
      city: hubFormCity,
      address: hubFormAddress,
      member_count: Number(hubFormMemberCount) || 12,
      meeting_day: hubFormMeetingDay || 'Onsdagar kl 07:30',
      next_event_title: hubFormNextEventTitle || 'Introduktionsfrukost & Nätverk',
      next_event_date: hubFormNextEventDate || 'Nästa vecka kl 07:30',
      radius_m: Number(hubFormRadiusM) || 150,
      geofence_lat: 59.33,
      geofence_lng: 18.06
    };
    if (onCreateHub) {
      onCreateHub(newHubData);
    }
    setShowCreateHubModal(false);
    setFeedbackNotice(`🎉 Ny hubb "${newHubData.name}" skapad och synlig i nätverket och KPI!`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleCreateNewMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateMember) {
      onCreateMember({
        full_name: memName,
        role_title: memRole,
        company_name: memCompany,
        email: memEmail,
        phone: memPhone,
        city: memCity,
        membership_level: memLevel,
        avatar: memAvatar,
        bio: memBio || `${memRole} på ${memCompany}. Ny medlem i Booster Friends.`,
        hub_id: memHubId,
        booster_score: 150,
        seeking_tags: ['B2B Samarbeten', 'Tillväxt'],
        offering_tags: ['Expertis', 'Affärsrådgivning']
      });
    }
    setShowCreateMemberModal(false);
    setFeedbackNotice(`🎉 Ny medlem "${memName}" har lagts till i nätverket och katalogen!`);
    setTimeout(() => setFeedbackNotice(null), 3500);
    setMemName('');
    setMemRole('');
    setMemCompany('');
    setMemEmail('');
  };

  const handleCreateQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = [quizOpt0, quizOpt1, quizOpt2, quizOpt3].filter(o => o.trim().length > 0);
    if (opts.length < 2) {
      alert('Vänligen ange minst två svarsalternativ.');
      return;
    }
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: quizQuestionText,
      options: opts,
      correct_index: Math.min(Number(quizCorrectIndex), opts.length - 1),
      explanation: quizExplanation || 'Korrekt svar enligt Booster standard och certifiering.'
    };
    if (onCreateQuizQuestion) {
      onCreateQuizQuestion(newQ);
    }
    setShowCreateQuizModal(false);
    setQuizQuestionText('');
    setQuizOpt0('');
    setQuizOpt1('');
    setQuizOpt2('');
    setQuizOpt3('');
    setQuizExplanation('');
    setFeedbackNotice(`🎯 Nytt kunskapsprov sparat! Medlemmar kan nu genomföra testet i Akademin.`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Dynamic KPI calculations
  const totalMembersCount = Math.max(allMembers.length, INITIAL_ADMIN_KPIS.total_members);
  const goldCount = allMembers.filter(m => m.membership_level === 'GOLD').length || 32;
  const silverCount = allMembers.filter(m => m.membership_level === 'SILVER').length || 64;
  const bronzeCount = allMembers.filter(m => m.membership_level === 'BRONZE').length || 52;
  const totalHubsCount = hubs.length;
  const totalHubCapacity = hubs.reduce((acc, h) => acc + (h.member_count || 20), 0);

  // Approve / Reject Application Handlers
  const handleApproveApp = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'APPROVED' } : a));
    setFeedbackNotice(`✅ Ansökan godkänd! Välkomstpaket och faktura för medlemskap har skickats till bolaget.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleRejectApp = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'REJECTED' } : a));
    setFeedbackNotice(`Ansökan avslogs.`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Toggle Banner Active
  const handleToggleBanner = (bannerId: string) => {
    setBannerAds(prev => prev.map(b => b.id === bannerId ? { ...b, is_active: !b.is_active } : b));
  };

  // Add Banner Handler with placement & size persistence
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBan: BannerAd = {
      id: `ban_${Date.now()}`,
      title: newBannerTitle,
      advertiser_name: newBannerAdvertiser,
      placement: newBannerPlacement,
      image_url: newBannerImage,
      target_url: newBannerUrl,
      is_active: true,
      impressions_count: 0,
      clicks_count: 0,
      format: newBannerFormat,
      custom_height: newBannerHeight,
      custom_width: newBannerWidth
    };
    setBannerAds(prev => [newBan, ...prev]);
    setShowAddBanner(false);
    setNewBannerTitle('');
    setNewBannerAdvertiser('');
    setFeedbackNotice(`🎉 Ny annonsbanner (${newBannerFormat}, ${newBannerWidth} × ${newBannerHeight}px) aktiverad i Booster Friends!`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const handleSelectFromGuide = (selectedZone: AdPlacementType, height: number, width: string) => {
    setNewBannerPlacement(selectedZone as BannerAd['placement']);
    setNewBannerHeight(height);
    setNewBannerWidth(width);
    setNewBannerFormat(selectedZone === 'CALENDAR_SIDEBAR' ? 'SIDEBAR' : 'FULL_WIDTH');
    setShowVisualGuide(false);
    setShowAddBanner(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#800020] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Super Admin & Hub Lead Portal (V12)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Central Affärs- & Nätverksadministration
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Hantera medlemsansökningar med kreditkontroll, övervaka hubbkapacitet, följ pipeline-omsättning och styr partnerbanners.
          </p>
        </div>

        <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-xs space-y-1">
          <div className="font-bold text-amber-300">Inloggad Administratör:</div>
          <div className="font-black text-white">{currentUser.full_name}</div>
          <div className="text-[11px] text-white/70">Behörighet: Full Super Admin</div>
        </div>
      </div>

      {/* Feedback notice */}
      {feedbackNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{feedbackNotice}</span>
          </div>
          <button 
            onClick={() => setFeedbackNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('KPIS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'KPIS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>KPI Dashboard & Tillväxt</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('PROSPECTS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'PROSPECTS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Prospekts & Bulkimport</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
            Ny
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('BILLING')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'BILLING'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fakturering (/admin/billing)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('RULES')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'RULES'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Booster Rules & Paket</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('APPLICATIONS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'APPLICATIONS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Medlemsansökningar</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-gray-950 font-black">
            {applications.filter(a => a.status === 'PENDING').length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('BANNERS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'BANNERS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Annonser & Banners ({bannerAds.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('HUBS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'HUBS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hubbar & Coworking ({hubs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('MEMBERS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'MEMBERS'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Moderering & Medlemmar ({allMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('QUIZ')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'QUIZ'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Kunskapsprov & Cert ({quizQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('TRIAL')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeAdminTab === 'TRIAL'
              ? 'bg-[#800020] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Provperiod & Trial</span>
        </button>
      </div>

      {/* TAB 1: KPI Dashboard */}
      {activeAdminTab === 'KPIS' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Totala Medlemmar</span>
              <div className="text-2xl font-black text-gray-900">{totalMembersCount} st</div>
              <div className="text-xs text-gray-500 pt-1 flex items-center gap-2">
                <span className="text-amber-800 font-bold">🥇 {goldCount} Guld</span> • 
                <span className="text-slate-600 font-bold">🥈 {silverCount} Silver</span> • 
                <span className="text-amber-950 font-bold">🥉 {bronzeCount} Brons</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Genererat Affärsvärde</span>
              <div className="text-2xl font-black text-emerald-700">14.85 Mkr</div>
              <div className="text-xs text-emerald-800 font-semibold pt-1">
                Genomförda affärer via Booster Pipeline
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aktiva Partner-Hubbar</span>
              <div className="text-2xl font-black text-[#800020]">{totalHubsCount} st Hubbar</div>
              <div className="text-xs text-gray-600 pt-1 font-medium">
                {totalHubCapacity} flexplatser i nätverket
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Månatlig Churn Rate</span>
              <div className="text-2xl font-black text-blue-700">{INITIAL_ADMIN_KPIS.monthly_churn_rate_percent}%</div>
              <div className="text-xs text-blue-800 font-semibold pt-1">
                Extremt stark medlemslojalitet
              </div>
            </div>
          </div>

          {/* Hub Checkin Utilization Table */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Kapacitet & Flexbordsbeläggning per Partner-Hubb ({hubs.length} st)
                </h3>
                <p className="text-xs text-gray-500">Realtidsuppdaterad status för samtliga etablerade hubbar</p>
              </div>
              <button
                onClick={() => {
                  setHubFormName('');
                  setHubFormAddress('');
                  setShowCreateHubModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Etablera Hubb</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Hubbnamn</th>
                    <th className="pb-3 font-bold">Stad</th>
                    <th className="pb-3 font-bold">Medlemsantal</th>
                    <th className="pb-3 font-bold">Kapacitetstak</th>
                    <th className="pb-3 font-bold">Aktuell Beläggning</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold text-right">Åtgärd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hubs.map((hub) => (
                    <tr key={hub.id} className="hover:bg-gray-50/80">
                      <td className="py-3.5 font-bold text-gray-900">{hub.name}</td>
                      <td className="py-3.5 text-gray-600">{hub.city}</td>
                      <td className="py-3.5 font-semibold text-gray-900">{hub.member_count} st</td>
                      <td className="py-3.5 text-gray-600">{hub.member_count || 20} flexbord/dag</td>
                      <td className="py-3.5">
                        <div className="w-24 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '68%' }} />
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Aktiv & Tillgänglig
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleOpenEditHub(hub)}
                          className="px-2.5 py-1 text-xs font-bold text-[#800020] hover:bg-rose-50 rounded-lg transition"
                        >
                          Redigera
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Prospekts & Bulkimport */}
      {activeAdminTab === 'PROSPECTS' && (
        <AdminProspectImporter
          currentUser={currentUser}
          hubs={hubs}
          existingMembers={allMembers}
          onCreateMember={onCreateMember}
        />
      )}

      {/* TAB: Fakturering & Betalningsstatus (/admin/billing) & Booster Rules */}
      {(activeAdminTab === 'BILLING' || activeAdminTab === 'RULES') && (
        <AdminBillingAndRulesModule
          allMembers={allMembers}
          onUpdateMemberLevel={onUpdateMemberLevel}
        />
      )}

      {/* TAB 2: Medlemsansökningar */}
      {activeAdminTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900">Nya Medlemsansökningar</h3>
              <p className="text-xs text-gray-500">Alla ansökningar verifieras mot Bolagsverket och kreditupplysning</p>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {applications.filter(a => a.status === 'PENDING').length} väntar på godkännande
            </span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div 
                key={app.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-gray-900 text-sm">{app.applicant_name}</h4>
                    <span className="text-xs text-gray-500">({app.company_name})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#800020] border border-rose-200">
                      Sökt nivå: {app.requested_level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Org.nr: <span className="font-semibold">{app.org_number}</span> • Hubb: <span className="font-semibold">{app.hub_requested}</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block border border-emerald-200">
                    🛡️ Kreditbetyg: {app.financial_score}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleApproveApp(app.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Godkänn Medlem</span>
                      </button>
                      <button
                        onClick={() => handleRejectApp(app.id)}
                        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Avslå</span>
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      app.status === 'APPROVED' 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : 'bg-rose-100 text-rose-900'
                    }`}>
                      {app.status === 'APPROVED' ? 'Godkänd ✓' : 'Avslagen'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Annonser & Banners */}
      {activeAdminTab === 'BANNERS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">Partnerannonser & Sponsrade Banners</h3>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  {bannerAds.length} st
                </span>
              </div>
              <p className="text-xs text-gray-500">Styr visning, format (fullbredd / sidopanel) och storlekar i feed, kalender och hubbdetaljer</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVisualGuide(true)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs"
              >
                <Layout className="w-4 h-4 text-[#800020]" />
                <span>🗺️ Visuell Zon-guide</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddBanner(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Ny Annonsbanner</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerAds.map((ban) => {
              const isSidebar = ban.placement === 'CALENDAR_SIDEBAR' || ban.format === 'SIDEBAR';
              const dispWidth = ban.custom_width || (isSidebar ? '320px' : '100%');
              const dispHeight = ban.custom_height || (isSidebar ? 340 : 180);
              const dispFormat = ban.format || (isSidebar ? 'Sidopanel' : 'Fullbredd');

              return (
                <div 
                  key={ban.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 overflow-hidden relative bg-gray-900">
                      <img 
                        src={ban.image_url} 
                        alt={ban.title} 
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {ban.placement}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#800020] text-white">
                          {dispFormat}
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/90 backdrop-blur-xs">
                        {dispWidth} × {dispHeight}px
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Annonsör: <strong className="text-gray-800">{ban.advertiser_name}</strong></span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {dispWidth}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm leading-snug">{ban.title}</h4>

                      <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 font-semibold">
                          <Eye className="w-3.5 h-3.5 text-gray-400" /> {ban.impressions_count} visningar
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <MousePointer className="w-3.5 h-3.5 text-gray-400" /> {ban.clicks_count} klick
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          CTR: {((ban.clicks_count / (ban.impressions_count || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-medium">Status: {ban.is_active ? 'Aktiv' : 'Pausad'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVisualGuide(true)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-100"
                        title="Förhandsgranska i visuell zon-karta"
                      >
                        Förhandsgranska
                      </button>
                      <button
                        onClick={() => handleToggleBanner(ban.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          ban.is_active 
                            ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {ban.is_active ? 'Pausa Banner' : 'Aktivera'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Banner Form Modal */}
          {showAddBanner && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
              <form onSubmit={handleCreateBanner} className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-3.5 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <h3 className="font-black text-gray-900 text-base">Skapa Ny Annonsbanner</h3>
                    <p className="text-xs text-gray-500">Ställ in annonsörens erbjudande, format och dimensioner</p>
                  </div>
                  <button type="button" onClick={() => setShowAddBanner(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Titel / Kampanjbudskap:</label>
                  <input 
                    type="text" 
                    required 
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="T.ex. Exklusivt skatteupplägg för entreprenörer"
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Annonsörens Företagsnamn:</label>
                  <input 
                    type="text" 
                    required 
                    value={newBannerAdvertiser}
                    onChange={(e) => setNewBannerAdvertiser(e.target.value)}
                    placeholder="T.ex. BDO / Convendum"
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Placering / Annonszon:</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddBanner(false);
                        setShowVisualGuide(true);
                      }}
                      className="text-[11px] text-[#800020] font-bold hover:underline flex items-center gap-1"
                    >
                      <Layout className="w-3 h-3" />
                      <span>Se placeringar i guiden</span>
                    </button>
                  </div>
                  <select 
                    value={newBannerPlacement}
                    onChange={(e: any) => {
                      const sel = e.target.value;
                      setNewBannerPlacement(sel);
                      if (sel === 'CALENDAR_SIDEBAR') {
                        setNewBannerFormat('SIDEBAR');
                        setNewBannerHeight(340);
                        setNewBannerWidth('320px');
                      } else {
                        setNewBannerFormat('FULL_WIDTH');
                        setNewBannerHeight(180);
                        setNewBannerWidth('100%');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white font-medium text-gray-800"
                  >
                    <option value="FEED_TOP">Högst upp i Feed / Community (Fullbredd)</option>
                    <option value="CALENDAR_SIDEBAR">Sidopanel i Masterkalendern (Sidopanel 320px)</option>
                    <option value="HUB_DETAILS">Inuti Hubb & Coworking</option>
                    <option value="MEMBERS_DIRECTORY">Medlemskatalogen (Directory Leaderboard)</option>
                    <option value="EVENT_LIST">Eventlistan & Frukostar</option>
                    <option value="HUB_HEADER">Topp-banner i Coworking Hubbar</option>
                  </select>
                </div>

                {/* Sizing & Dimensions Box */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Storlek & Format för vald zon</span>
                    </span>
                    <span className="text-[11px] font-mono text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {newBannerWidth} × {newBannerHeight}px
                    </span>
                  </div>

                  {/* Format Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewBannerFormat('FULL_WIDTH');
                        setNewBannerWidth('100%');
                        setNewBannerHeight(180);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newBannerFormat === 'FULL_WIDTH'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Fullbredd (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBannerFormat('SIDEBAR');
                        setNewBannerWidth('320px');
                        setNewBannerHeight(340);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newBannerFormat === 'SIDEBAR'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Sidopanel (320px)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBannerFormat('IN_FEED');
                        setNewBannerWidth('100%');
                        setNewBannerHeight(150);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                        newBannerFormat === 'IN_FEED'
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      In-Feed Kort
                    </button>
                  </div>

                  {/* Height presets and slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-700">Höjd i pixlar:</span>
                      <span className="font-mono text-[#800020] font-bold">{newBannerHeight}px</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[130, 160, 180, 240, 340].map(h => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setNewBannerHeight(h)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            newBannerHeight === h
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {h}px
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={440}
                      step={10}
                      value={newBannerHeight}
                      onChange={e => setNewBannerHeight(Number(e.target.value))}
                      className="w-full accent-[#800020] cursor-pointer"
                    />
                  </div>

                  {/* Width selector */}
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-bold text-gray-700">Bredd-begränsning:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['100%', '320px', '360px', 'max-w-4xl', 'max-w-6xl'].map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setNewBannerWidth(w)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                            newBannerWidth === w
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mål-URL (Klicklänk):</label>
                  <input 
                    type="url" 
                    required 
                    value={newBannerUrl}
                    onChange={(e) => setNewBannerUrl(e.target.value)}
                    placeholder="https://foretag.se/erbjudande"
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bild-URL:</label>
                  <input 
                    type="url" 
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <button 
                    type="button" 
                    onClick={() => setShowAddBanner(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold"
                  >
                    Avbryt
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
                  >
                    Spara & Publicera
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Visual Guide Modal */}
          <AdZonesVisualGuide
            isOpen={showVisualGuide}
            onClose={() => setShowVisualGuide(false)}
            onSelectZoneToCreate={handleSelectFromGuide}
          />
        </div>
      )}

      {/* TAB 4: Hubbar & Coworking manager */}
      {activeAdminTab === 'HUBS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Partner-Coworking & Hubbar ({hubs.length} st)</h3>
              <p className="text-xs text-gray-500">Administrera adresser, mötestider, geofence och kapacitet</p>
            </div>
            <button
              onClick={() => {
                setHubFormName('');
                setHubFormAddress('');
                setHubFormMemberCount(20);
                setShowCreateHubModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Etablera Ny Hubb</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubs.map((hub) => (
              <div key={hub.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#800020]" />
                      <span>{hub.name}</span>
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{hub.address}, {hub.city}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#800020] border border-rose-100">
                    {hub.member_count} medlemmar
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 text-xs text-gray-700 space-y-1.5 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">📍 Geofence Radie:</span>
                    <span className="font-bold">{hub.radius_m} meter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">📅 Veckodag för Frukost:</span>
                    <span className="font-bold">{hub.meeting_day}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">🎯 Nästa Event:</span>
                    <span className="font-bold text-[#800020]">{hub.next_event_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">⏰ Tidpunkt:</span>
                    <span className="font-medium text-gray-800">{hub.next_event_date}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Automatisk incheckning aktiv
                  </span>
                  <button
                    onClick={() => handleOpenEditHub(hub)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#800020] hover:text-white text-gray-800 font-bold transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Redigera Inställningar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Medlemsmoderering & Nivåer */}
      {activeAdminTab === 'MEMBERS' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">Medlemsregister & Nivåstyrning ({allMembers.length} st)</h3>
              <p className="text-xs text-gray-500">Hantera manuella uppgraderingar, skapa nya medlemmar och administrera behörigheter</p>
            </div>
            <button
              onClick={() => setShowCreateMemberModal(true)}
              className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Registrera Ny Medlem</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {allMembers.map((mem) => (
              <div key={mem.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={mem.avatar} alt={mem.full_name} className="w-10 h-10 rounded-2xl object-cover border" />
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>{mem.full_name}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                        {mem.membership_level}
                      </span>
                    </div>
                    <p className="text-gray-500">{mem.role_title} • {mem.company_name} ({mem.city})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#800020] mr-2">{mem.booster_score} BP</span>
                  {onUpdateMemberLevel && (
                    <select
                      value={mem.membership_level}
                      onChange={(e: any) => onUpdateMemberLevel(mem.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold bg-white"
                    >
                      <option value="BRONZE">Brons</option>
                      <option value="SILVER">Silver</option>
                      <option value="GOLD">Guld</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Kunskapsprov & Certifieringar */}
      {activeAdminTab === 'QUIZ' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#800020]" />
                <span>Kunskapsprov & Certifieringsfrågor ({quizQuestions.length} provfrågor)</span>
              </h3>
              <p className="text-xs text-gray-500">Skapa och redigera kunskapsprov som ger medlemmar certifikat och Booster Points</p>
            </div>
            <button
              onClick={() => setShowCreateQuizModal(true)}
              className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016] transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Skapa Nytt Kunskapsprov</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizQuestions.map((q, qIndex) => (
              <div key={q.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-50 text-[#800020] font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{q.question}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 shrink-0">
                    +50 BP
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correct_index;
                    return (
                      <div 
                        key={optIdx} 
                        className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                          isCorrect 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold' 
                            : 'bg-gray-50 border-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-600 text-white rounded">
                            Korrekt svar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600">
                  <span className="font-bold text-gray-700">Förklaring:</span> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Provperiod & Trial */}
      {activeAdminTab === 'TRIAL' && (
        <AdminTrialSettings />
      )}

      {/* MODAL: Redigera Hubb */}
      {editingHub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleSaveEditedHub} className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#800020]" />
                <span>Redigera Hubb: {editingHub.name}</span>
              </h3>
              <button type="button" onClick={() => setEditingHub(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hubbnamn:</label>
              <input 
                type="text" 
                required 
                value={hubFormName}
                onChange={(e) => setHubFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Stad:</label>
                <input 
                  type="text" 
                  required 
                  value={hubFormCity}
                  onChange={(e) => setHubFormCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kapacitet / Medlemmar:</label>
                <input 
                  type="number" 
                  required 
                  value={hubFormMemberCount}
                  onChange={(e) => setHubFormMemberCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Adress:</label>
              <input 
                type="text" 
                required 
                value={hubFormAddress}
                onChange={(e) => setHubFormAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mötesdag (frukost):</label>
                <input 
                  type="text" 
                  value={hubFormMeetingDay}
                  onChange={(e) => setHubFormMeetingDay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Geofence Radie (meter):</label>
                <input 
                  type="number" 
                  value={hubFormRadiusM}
                  onChange={(e) => setHubFormRadiusM(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nästa event rubrik:</label>
              <input 
                type="text" 
                value={hubFormNextEventTitle}
                onChange={(e) => setHubFormNextEventTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nästa event tidpunkt:</label>
              <input 
                type="text" 
                value={hubFormNextEventDate}
                onChange={(e) => setHubFormNextEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button 
                type="button" 
                onClick={() => setEditingHub(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
              >
                Spara Ändringar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Etablera Ny Hubb */}
      {showCreateHubModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleCreateNewHubSubmit} className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#800020]" />
                <span>Etablera Ny Partner-Hubb</span>
              </h3>
              <button type="button" onClick={() => setShowCreateHubModal(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hubbnamn:</label>
              <input 
                type="text" 
                required 
                value={hubFormName}
                onChange={(e) => setHubFormName(e.target.value)}
                placeholder="T.ex. Helsingborg Port Tech Hub"
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Stad:</label>
                <input 
                  type="text" 
                  required 
                  value={hubFormCity}
                  onChange={(e) => setHubFormCity(e.target.value)}
                  placeholder="T.ex. Helsingborg"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kapacitet / Flexbord:</label>
                <input 
                  type="number" 
                  required 
                  value={hubFormMemberCount}
                  onChange={(e) => setHubFormMemberCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Adress & Lokal:</label>
              <input 
                type="text" 
                required 
                value={hubFormAddress}
                onChange={(e) => setHubFormAddress(e.target.value)}
                placeholder="T.ex. Järnvägsgatan 12"
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mötesdag (frukost):</label>
                <input 
                  type="text" 
                  value={hubFormMeetingDay}
                  onChange={(e) => setHubFormMeetingDay(e.target.value)}
                  placeholder="Torsdagar kl 07:30"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Geofence Radie (meter):</label>
                <input 
                  type="number" 
                  value={hubFormRadiusM}
                  onChange={(e) => setHubFormRadiusM(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
              ✓ Hubben synkas omedelbart till KPI-översikten, Coworking-kartan och flexbokningssystemet.
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button 
                type="button" 
                onClick={() => setShowCreateHubModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
              >
                Etablera Hubb
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Registrera Ny Medlem */}
      {showCreateMemberModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewMemberSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#800020]" />
                <span>Registrera Ny Medlem</span>
              </h3>
              <button type="button" onClick={() => setShowCreateMemberModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Fullständigt Namn:</label>
              <input 
                type="text" 
                required 
                value={memName}
                onChange={(e) => setMemName(e.target.value)}
                placeholder="T.ex. Cecilia Lindgren"
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Roll / Titel:</label>
                <input 
                  type="text" 
                  required 
                  value={memRole}
                  onChange={(e) => setMemRole(e.target.value)}
                  placeholder="T.ex. CEO & Grundare"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bolagsnamn:</label>
                <input 
                  type="text" 
                  required 
                  value={memCompany}
                  onChange={(e) => setMemCompany(e.target.value)}
                  placeholder="T.ex. Nordic Growth AB"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">E-post:</label>
                <input 
                  type="email" 
                  required 
                  value={memEmail}
                  onChange={(e) => setMemEmail(e.target.value)}
                  placeholder="cecilia@nordicgrowth.se"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Telefon:</label>
                <input 
                  type="text" 
                  value={memPhone}
                  onChange={(e) => setMemPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Medlemsnivå:</label>
                <select
                  value={memLevel}
                  onChange={(e: any) => setMemLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white font-medium"
                >
                  <option value="BRONZE">Brons Medlem</option>
                  <option value="SILVER">Silver Medlem</option>
                  <option value="GOLD">Guld Medlem</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tillhör Hubb:</label>
                <select
                  value={memHubId}
                  onChange={(e) => setMemHubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white font-medium"
                >
                  {hubs.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Profilbild (URL):</label>
              <input 
                type="url" 
                value={memAvatar}
                onChange={(e) => setMemAvatar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kort Biografi:</label>
              <textarea 
                rows={2}
                value={memBio}
                onChange={(e) => setMemBio(e.target.value)}
                placeholder="Beskriv kort vad personen och bolaget gör..."
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button 
                type="button" 
                onClick={() => setShowCreateMemberModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
              >
                Skapa Medlem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Skapa Nytt Kunskapsprov */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateQuizSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#800020]" />
                <span>Skapa Nytt Kunskapsprov</span>
              </h3>
              <button type="button" onClick={() => setShowCreateQuizModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Testfråga:</label>
              <input 
                type="text" 
                required 
                value={quizQuestionText}
                onChange={(e) => setQuizQuestionText(e.target.value)}
                placeholder="T.ex. Vad är den viktigaste faktorn för framgångsrik B2B referral marketing?"
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Svarsalternativ (ange minst 2-4 st):</label>
              <div>
                <span className="text-[10px] text-gray-500 font-bold">Alternativ 1:</span>
                <input 
                  type="text" 
                  required 
                  value={quizOpt0}
                  onChange={(e) => setQuizOpt0(e.target.value)}
                  placeholder="Alternativ A"
                  className="w-full px-3 py-1.5 rounded-xl border text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold">Alternativ 2:</span>
                <input 
                  type="text" 
                  required 
                  value={quizOpt1}
                  onChange={(e) => setQuizOpt1(e.target.value)}
                  placeholder="Alternativ B"
                  className="w-full px-3 py-1.5 rounded-xl border text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold">Alternativ 3 (valfritt):</span>
                <input 
                  type="text" 
                  value={quizOpt2}
                  onChange={(e) => setQuizOpt2(e.target.value)}
                  placeholder="Alternativ C"
                  className="w-full px-3 py-1.5 rounded-xl border text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold">Alternativ 4 (valfritt):</span>
                <input 
                  type="text" 
                  value={quizOpt3}
                  onChange={(e) => setQuizOpt3(e.target.value)}
                  placeholder="Alternativ D"
                  className="w-full px-3 py-1.5 rounded-xl border text-xs mt-0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vilket alternativ är det korrekta svaret?</label>
              <select
                value={quizCorrectIndex}
                onChange={(e) => setQuizCorrectIndex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-white font-medium text-emerald-800"
              >
                <option value={0}>Alternativ 1 ({quizOpt0 ? `"${quizOpt0.slice(0, 30)}..."` : 'Alternativ A'})</option>
                <option value={1}>Alternativ 2 ({quizOpt1 ? `"${quizOpt1.slice(0, 30)}..."` : 'Alternativ B'})</option>
                {quizOpt2 && <option value={2}>Alternativ 3 ("{quizOpt2.slice(0, 30)}...")</option>}
                {quizOpt3 && <option value={3}>Alternativ 4 ("{quizOpt3.slice(0, 30)}...")</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Pedagogisk förklaring efter svar:</label>
              <textarea 
                rows={2}
                value={quizExplanation}
                onChange={(e) => setQuizExplanation(e.target.value)}
                placeholder="Förklara varför svaret är rätt..."
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <button 
                type="button" 
                onClick={() => setShowCreateQuizModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
              >
                Spara Kunskapsprov
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
