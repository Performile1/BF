import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Search, 
  Filter, 
  Linkedin, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Sparkles, 
  UserPlus, 
  UserCheck, 
  Coffee, 
  QrCode, 
  MessageSquare, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Star, 
  Share2,
  ThumbsUp,
  Tag,
  ArrowRight,
  TrendingUp,
  Shield,
  HeartHandshake,
  FileText,
  UploadCloud,
  ShieldCheck,
  FileCheck,
  Grid,
  List,
  Camera,
  Upload,
  CreditCard,
  X
} from 'lucide-react';
import { Member, MembershipLevel, LunchRequest, MemberMerit, MemberCaseStudy, MemberSkill } from '../../types';
import { AdBannerEngine } from '../ads/AdBannerEngine';
import { MembershipBillingModule } from './MembershipBillingModule';

interface ProfileSettingsAndDirectoryModuleProps {
  currentUser: Member;
  allMembers: Member[];
  skills?: MemberSkill[];
  onEndorseSkill?: (skillId: string) => void;
  onUpdateProfile: (updatedData: Partial<Member>) => void;
  onFollowToggle: (targetMemberId: string) => void;
  onOpenDirectChat: (targetMemberId: string) => void;
  onOpenUniversalConnect: (member?: Member) => void;
  onSendLunchRequest: (request: Partial<LunchRequest>) => void;
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
  onUpdateMemberLevel?: (memberId: string, level: MembershipLevel) => void;
  onSimulateLockout?: () => void;
  initialTab?: 'directory' | 'settings' | 'membership';
}

export const ProfileSettingsAndDirectoryModule: React.FC<ProfileSettingsAndDirectoryModuleProps> = ({
  currentUser,
  allMembers,
  skills = [],
  onEndorseSkill,
  onUpdateProfile,
  onFollowToggle,
  onOpenDirectChat,
  onOpenUniversalConnect,
  onSendLunchRequest,
  onAwardPoints,
  onUpdateMemberLevel,
  onSimulateLockout,
  initialTab = 'directory'
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'settings' | 'membership'>(initialTab);

  // Directory Filters & View Mode
  const [directoryViewMode, setDirectoryViewMode] = useState<'card' | 'list'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubFilter, setSelectedHubFilter] = useState<string>('ALL');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | MembershipLevel>('ALL');
  const [tagFilter, setTagFilter] = useState('');
  const [onlyFollowing, setOnlyFollowing] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Profile Settings Form State
  const [formData, setFormData] = useState({
    full_name: currentUser.full_name,
    role_title: currentUser.role_title,
    company_name: currentUser.company_name,
    phone: currentUser.phone || '',
    linkedin_url: currentUser.linkedin_url || '',
    website_url: currentUser.website_url || '',
    bio: currentUser.bio || '',
    avatar: currentUser.avatar,
    city: currentUser.city || 'Stockholm',
    seeking_tags: currentUser.seeking_tags || [],
    offering_tags: currentUser.offering_tags || [],
    interests: currentUser.interests || ['Tech & SaaS', 'B2B Sälj', 'Investering', 'AI & Automation'],
    merits: currentUser.merits || [],
    case_studies: currentUser.case_studies || [],
    cv_summary: currentUser.cv_summary || '',
    cv_filename: currentUser.cv_filename || '',
    linkedin_posts: currentUser.linkedin_posts || [
      {
        title: 'Hur vi skalade från 0 till 15 MSEK ARR med bootstrapping',
        url: 'https://linkedin.com/posts/example-1',
        date: '2026-08-15'
      },
      {
        title: 'Nordiska B2B-trender: Varför personliga nätverk slår cold outreach 2026',
        url: 'https://linkedin.com/posts/example-2',
        date: '2026-08-28'
      }
    ]
  });

  const [newSeekingTag, setNewSeekingTag] = useState('');
  const [newOfferingTag, setNewOfferingTag] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<string | null>(null);

  // CV Upload & Parsing State
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [cvParseSuccessNotice, setCvParseSuccessNotice] = useState<string | null>(null);

  // New Merit Modal/Form State
  const [showAddMerit, setShowAddMerit] = useState(false);
  const [newMeritCategory, setNewMeritCategory] = useState<'BOARD_ROLE' | 'CERTIFICATION' | 'EDUCATION' | 'AWARD' | 'EXPERIENCE'>('BOARD_ROLE');
  const [newMeritTitle, setNewMeritTitle] = useState('');
  const [newMeritOrg, setNewMeritOrg] = useState('');
  const [newMeritYear, setNewMeritYear] = useState('');
  const [newMeritDesc, setNewMeritDesc] = useState('');

  // New Case Study Modal/Form State
  const [showAddCaseStudy, setShowAddCaseStudy] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseMetric, setNewCaseMetric] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCaseTags, setNewCaseTags] = useState('');
  const [newCaseImage, setNewCaseImage] = useState('');

  // Modal for inspecting any member's case studies
  const [viewingCaseStudiesMember, setViewingCaseStudiesMember] = useState<Member | null>(null);

  // Lunch Request Modal state
  const [lunchTargetMember, setLunchTargetMember] = useState<Member | null>(null);
  const [lunchDate, setLunchDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [lunchLocation, setLunchLocation] = useState('Convendum Stockholm City Lounge');
  const [hostPays, setHostPays] = useState(true);
  const [lunchNote, setLunchNote] = useState('Skulle vara väldigt kul att ta en 1-on-1 lunch och prata om möjliga synergier!');

  const followingIds = currentUser.following_member_ids || [];

  // Filtered members for Directory
  const filteredMembers = allMembers.filter(m => {
    // Exclude self from direct search list or show with badge
    const matchesSearch = 
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.seeking_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.offering_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesHub = selectedHubFilter === 'ALL' || m.hub_id === selectedHubFilter;
    const matchesLevel = selectedLevelFilter === 'ALL' || m.membership_level === selectedLevelFilter;
    const matchesTag = !tagFilter || 
      m.seeking_tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase())) ||
      m.offering_tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase()));
    const matchesFollowing = !onlyFollowing || followingIds.includes(m.id);

    return matchesSearch && matchesHub && matchesLevel && matchesTag && matchesFollowing;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccessNotice('Din profil har uppdaterats framgångsrikt!');
    setTimeout(() => setSavedSuccessNotice(null), 4000);
  };

  const handleAddSeekingTag = () => {
    if (newSeekingTag.trim() && !formData.seeking_tags.includes(newSeekingTag.trim())) {
      setFormData(prev => ({ ...prev, seeking_tags: [...prev.seeking_tags, newSeekingTag.trim()] }));
      setNewSeekingTag('');
    }
  };

  const handleRemoveSeekingTag = (tag: string) => {
    setFormData(prev => ({ ...prev, seeking_tags: prev.seeking_tags.filter(t => t !== tag) }));
  };

  const handleAddOfferingTag = () => {
    if (newOfferingTag.trim() && !formData.offering_tags.includes(newOfferingTag.trim())) {
      setFormData(prev => ({ ...prev, offering_tags: [...prev.offering_tags, newOfferingTag.trim()] }));
      setNewOfferingTag('');
    }
  };

  const handleRemoveOfferingTag = (tag: string) => {
    setFormData(prev => ({ ...prev, offering_tags: prev.offering_tags.filter(t => t !== tag) }));
  };

  const handleAddLinkedInPost = () => {
    if (newPostTitle.trim() && newPostUrl.trim()) {
      const newPost = {
        title: newPostTitle.trim(),
        url: newPostUrl.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      setFormData(prev => ({ ...prev, linkedin_posts: [newPost, ...prev.linkedin_posts] }));
      setNewPostTitle('');
      setNewPostUrl('');
    }
  };

  const handleRemoveLinkedInPost = (index: number) => {
    setFormData(prev => ({
      ...prev,
      linkedin_posts: prev.linkedin_posts.filter((_, i) => i !== index)
    }));
  };

  const handleSimulateUploadCv = (fileName?: string) => {
    setIsParsingCv(true);
    setCvParseSuccessNotice(null);

    setTimeout(() => {
      const detectedFileName = fileName || 'Rickard_Wigrund_Executive_CV.pdf';
      const extractedSummary = 'Grundare och VD med 14+ års erfarenhet av B2B molnsäkerhet, enterprisearkitektur och skalning av nordiska tech-bolag. Dokumenterad meritlista inom styrelsearbete, M&A och strategiska samarbeten.';
      
      const newMeritAuto: MemberMerit = {
        id: `m_${Date.now()}`,
        category: 'EDUCATION',
        title: 'Civilingenjör Industriell Ekonomi & Datateknik',
        organization: 'KTH Kungliga Tekniska Högskolan',
        year: '2014',
        description: 'Inriktning mot distribuerade system, cybersäkerhet och företagsfinansiering.',
        verified: true
      };

      const newMeritBoard: MemberMerit = {
        id: `m_${Date.now() + 1}`,
        category: 'BOARD_ROLE',
        title: 'Styrelseledamot & Strategisk Rådgivare',
        organization: 'Nordic Cloud Alliance',
        year: '2023 - Nuvarande',
        description: 'Leder kommittén för molnsuveränitet och europeisk dataintegritet.',
        verified: true
      };

      const newTags = ['ISO27001', 'Styrelsearbete', 'Cyber Risk'].filter(t => !(formData.offering_tags || []).includes(t));

      setFormData(prev => ({
        ...prev,
        cv_filename: detectedFileName,
        cv_summary: extractedSummary,
        offering_tags: [...prev.offering_tags, ...newTags],
        merits: [newMeritAuto, newMeritBoard, ...(prev.merits || []).filter(m => m.id !== newMeritAuto.id)]
      }));

      setIsParsingCv(false);
      setCvParseSuccessNotice(`CV "${detectedFileName}" analyserades med Booster AI! 2 nya verifierade meriter och kompetenstaggar har lagts till. +50 BP tillagda.`);
      onAwardPoints?.(50, 'Laddat upp och analyserat CV med Booster AI', 'PROFILE_UPDATE');
    }, 750);
  };

  const handleAddMerit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeritTitle.trim() || !newMeritOrg.trim()) return;

    const merit: MemberMerit = {
      id: `m_${Date.now()}`,
      category: newMeritCategory,
      title: newMeritTitle.trim(),
      organization: newMeritOrg.trim(),
      year: newMeritYear.trim() || '2025',
      description: newMeritDesc.trim() || undefined,
      verified: true
    };

    setFormData(prev => ({
      ...prev,
      merits: [merit, ...(prev.merits || [])]
    }));

    setNewMeritTitle('');
    setNewMeritOrg('');
    setNewMeritYear('');
    setNewMeritDesc('');
    setShowAddMerit(false);
    onAwardPoints?.(20, `Lagt till verifierad merit: ${merit.title}`, 'PROFILE_UPDATE');
  };

  const handleRemoveMerit = (id: string) => {
    setFormData(prev => ({
      ...prev,
      merits: (prev.merits || []).filter(m => m.id !== id)
    }));
  };

  const handleAddCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || !newCaseClient.trim()) return;

    const parsedTags = newCaseTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const caseStudy: MemberCaseStudy = {
      id: `cs_${Date.now()}`,
      title: newCaseTitle.trim(),
      client_name: newCaseClient.trim(),
      result_metric: newCaseMetric.trim() || 'Verifierad kundtillväxt',
      description: newCaseDesc.trim() || 'Framgångsrikt B2B-samarbete med mätbara affärsresultat.',
      tags: parsedTags.length > 0 ? parsedTags : ['B2B', 'Tillväxt'],
      image_url: newCaseImage.trim() || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
    };

    setFormData(prev => ({
      ...prev,
      case_studies: [caseStudy, ...(prev.case_studies || [])]
    }));

    setNewCaseTitle('');
    setNewCaseClient('');
    setNewCaseMetric('');
    setNewCaseDesc('');
    setNewCaseTags('');
    setNewCaseImage('');
    setShowAddCaseStudy(false);
    onAwardPoints?.(30, `Publicerat kundcase: ${caseStudy.title}`, 'PROFILE_UPDATE');
  };

  const handleRemoveCaseStudy = (id: string) => {
    setFormData(prev => ({
      ...prev,
      case_studies: (prev.case_studies || []).filter(cs => cs.id !== id)
    }));
  };

  const handleSendLunchInvite = () => {
    if (!lunchTargetMember) return;
    onSendLunchRequest({
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar,
      sender_company: currentUser.company_name,
      receiver_id: lunchTargetMember.id,
      receiver_name: lunchTargetMember.full_name,
      receiver_avatar: lunchTargetMember.avatar,
      proposed_date: lunchDate,
      location: lunchLocation,
      host_pays: hostPays,
      status: 'PENDING',
      note: lunchNote,
      created_at: new Date().toISOString()
    });

    if (onAwardPoints && hostPays) {
      onAwardPoints(30, `Bjudit ${lunchTargetMember.full_name} på nätverkslunch`, 'LUNCH_HOST_INVITE');
    }

    setSavedSuccessNotice(`🍽️ Lunchförfrågan skickad till ${lunchTargetMember.full_name}! ${hostPays ? 'Eftersom du bjuder erhåller du +30 BP vid genomfört möte.' : '+20 BP.'}`);
    setTimeout(() => setSavedSuccessNotice(null), 5000);
    setLunchTargetMember(null);
  };

  const getLevelBadge = (level: MembershipLevel) => {
    switch (level) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-orange-100 text-orange-900 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>Medlemsregister & Profilinställningar</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                V12 Verified
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Sök bland {allMembers.length} verifierade entreprenörer, hantera följare och uppdatera din offentliga profil.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#800020]" />
            <span>Sökbart Medlemsregister</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 text-[10px]">
              {allMembers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#800020]" />
            <span>Min Profil & Inställningar</span>
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'membership'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#800020]" />
            <span>Medlemskap & Fakturering (/profile/membership)</span>
          </button>
        </div>
      </div>

      {savedSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedSuccessNotice}</span>
        </div>
      )}

      {/* MEMBERSHIP & BILLING VIEW (/profile/membership) */}
      {activeTab === 'membership' && (
        <MembershipBillingModule
          currentUser={currentUser}
          allMembers={allMembers}
          onUpdateMemberLevel={onUpdateMemberLevel || (() => {})}
          onAwardPoints={onAwardPoints ? (pts, reason) => onAwardPoints(pts, reason, 'REFERRAL') : undefined}
          onSimulateLockout={onSimulateLockout}
        />
      )}

      {/* DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sök namn, bolag, roll eller taggar (t.ex. 'SaaS', 'VD', 'Kapital')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    Rensa
                  </button>
                )}
              </div>

              {/* Hub Dropdown */}
              <select
                value={selectedHubFilter}
                onChange={(e) => setSelectedHubFilter(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
              >
                <option value="ALL">Alla Hubbar</option>
                <option value="hub_stockholm">Stockholm City</option>
                <option value="hub_goteborg">Göteborg Avenyn</option>
                <option value="hub_malmo">Malmö Västra Hamnen</option>
                <option value="hub_uppsala">Uppsala Tech Hub</option>
              </select>

              {/* Tier Filter */}
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value as any)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
              >
                <option value="ALL">Alla Medlemsnivåer</option>
                <option value="GOLD">Guld-medlemmar</option>
                <option value="SILVER">Silver-medlemmar</option>
                <option value="BRONZE">Brons-medlemmar</option>
              </select>

              {/* Only Following Toggle */}
              <button
                onClick={() => setOnlyFollowing(!onlyFollowing)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  onlyFollowing
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Bara personer jag följer ({followingIds.length})</span>
              </button>

              {/* Card / List View Switcher */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 ml-auto">
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('card')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    directoryViewMode === 'card' 
                      ? 'bg-white text-[#800020] shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Kortvy"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Kortvy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    directoryViewMode === 'list' 
                      ? 'bg-white text-[#800020] shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Listvy"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Listvy</span>
                </button>
              </div>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-gray-400 text-[11px] font-medium mr-1">Populära kompetenser:</span>
              {['SaaS Skalning', 'Avtalsjuridik', 'Sådd- & Serie A kapital', 'B2B Försäljning', 'AI & Automation', 'Cybersäkerhet', 'E-handel'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition border ${
                    tagFilter === tag
                      ? 'bg-[#800020] text-white border-[#800020]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#800020]/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {tagFilter && (
                <button
                  onClick={() => setTagFilter('')}
                  className="text-[11px] text-[#800020] underline ml-2 font-bold"
                >
                  Rensa taggfilter
                </button>
              )}
            </div>
          </div>

          {/* Sponsrad Annonsbanner för Medlemskatalogen */}
          <AdBannerEngine zone="MEMBERS_DIRECTORY" />

          {/* Members Grid or List View */}
          {directoryViewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => {
              const isMe = member.id === currentUser.id;
              const isFollowing = followingIds.includes(member.id);
              const giveTakeRatio = member.give_take_ratio || ((member.referrals_sent || 1) / Math.max(1, (member.deals_closed_sek > 0 ? 2 : 1))).toFixed(1);

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                    isMe ? 'border-[#800020]/30 bg-[#800020]/[0.02]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Top Card Section */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.full_name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-xs"
                          />
                          <span className={`absolute -bottom-1 -right-1 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getLevelBadge(member.membership_level)}`}>
                            {member.membership_level}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">
                              {member.full_name}
                            </h3>
                            {isMe && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#800020] text-white">
                                Du
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 font-medium truncate mt-0.5">
                            {member.role_title}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            <span>{member.company_name}</span>
                          </p>
                        </div>
                      </div>

                      {/* Follow Button */}
                      {!isMe && (
                        <button
                          onClick={() => onFollowToggle(member.id)}
                          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                            isFollowing
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-[#800020]'
                          }`}
                          title={isFollowing ? 'Du följer denna medlem' : 'Följ för att få notiser om artiklar och coworking'}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">Följer</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Följ</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                      {member.bio || 'Erfaren entreprenör och aktiv nätverkare i Booster Friends.'}
                    </p>

                    {/* Give / Take & Booster Score */}
                    <div className="mt-3 py-2 px-3 bg-gray-50 rounded-xl flex items-center justify-between text-[11px] border border-gray-100">
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-gray-500">Booster Score:</span>
                        <span className="font-bold text-gray-900">{member.booster_score} BP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#800020]" />
                        <span className="text-gray-500">Give/Take:</span>
                        <span className="font-bold text-[#800020]">{giveTakeRatio}x</span>
                      </div>
                    </div>

                    {/* Söker / Erbjuder Pills */}
                    <div className="mt-3 space-y-1.5">
                      {member.seeking_tags && member.seeking_tags.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                            Söker:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {member.seeking_tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-medium border border-amber-200/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {member.offering_tags && member.offering_tags.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                            Erbjuder:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {member.offering_tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* LinkedIn Posts preview if any */}
                    {member.linkedin_posts && member.linkedin_posts.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Linkedin className="w-3 h-3 text-[#0077b5]" />
                          <span>Senaste LinkedIn-inlägg:</span>
                        </p>
                        <a
                          href={member.linkedin_posts[0].url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-gray-800 hover:text-[#800020] truncate block mt-0.5"
                        >
                          "{member.linkedin_posts[0].title}"
                        </a>
                      </div>
                    )}

                    {/* Merits & Certifications Preview */}
                    {member.merits && member.merits.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-800 truncate">
                            {member.merits[0].title}
                          </span>
                        </div>
                        {member.merits.length > 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                            +{member.merits.length - 1} meriter
                          </span>
                        )}
                      </div>
                    )}

                    {/* Case Studies quick pill */}
                    {member.case_studies && member.case_studies.length > 0 && (
                      <div className="mt-2 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1.5 rounded-xl">
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span className="text-[11px] font-bold text-emerald-950 truncate">
                            {member.case_studies[0].client_name}: {member.case_studies[0].result_metric}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingCaseStudiesMember(member)}
                          className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 underline flex-shrink-0 ml-1"
                        >
                          Visa {member.case_studies.length} case →
                        </button>
                      </div>
                    )}

                    {/* Skillbars & Kompetensröstning (Endorsements) */}
                    {(() => {
                      const mSkills = skills.filter(s => s.member_id === member.id);
                      if (mSkills.length === 0) return null;
                      return (
                        <div className="mt-3 pt-2.5 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1">
                              <Award className="w-3 h-3 text-[#800020]" />
                              <span>Skillbars & Röster:</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold">{mSkills.length} st</span>
                          </div>
                          <div className="space-y-1.5">
                            {mSkills.slice(0, 2).map(skill => {
                              const pct = Math.min(100, Math.round((skill.endorsements_count / 15) * 100));
                              return (
                                <div key={skill.id} className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-800 mb-1">
                                    <span className="truncate pr-2">{skill.skill_name}</span>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <span className="text-gray-500 font-normal text-[10px]">{skill.endorsements_count} röster</span>
                                      {!isMe && (
                                        <button
                                          type="button"
                                          onClick={() => onEndorseSkill?.(skill.id)}
                                          disabled={skill.has_endorsed}
                                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 transition ${
                                            skill.has_endorsed
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer'
                                          }`}
                                          title={skill.has_endorsed ? 'Du har redan röstat' : 'Rösta på denna kompetens (+5 BP)'}
                                        >
                                          <ThumbsUp className="w-2.5 h-2.5" />
                                          <span>{skill.has_endorsed ? 'Röstat' : '+ Rösta'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-[#800020] h-full rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Direct Message button */}
                      {!isMe && (
                        <button
                          onClick={() => onOpenDirectChat(member.id)}
                          className="p-2 rounded-xl text-gray-600 hover:text-[#800020] hover:bg-[#800020]/5 transition border border-gray-200"
                          title="Skicka direktmeddelande"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Lunch Invite Button */}
                      {!isMe && (
                        <button
                          onClick={() => setLunchTargetMember(member)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition border border-amber-200 flex items-center gap-1"
                          title="Bjud på lunch eller kaffe"
                        >
                          <Coffee className="w-3 h-3 text-amber-700" />
                          <span>Bjud på lunch</span>
                        </button>
                      )}
                    </div>

                    {/* QR & Contact Card button */}
                    <button
                      onClick={() => onOpenUniversalConnect(member)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition border border-gray-200 flex items-center gap-1"
                      title="Visa digitalt visitkort och QR-kod"
                    >
                      <QrCode className="w-3 h-3 text-[#800020]" />
                      <span>Visitkort</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          ) : (
          /* RESPONSIVE LIST VIEW */
          <div className="space-y-3">
            {filteredMembers.map(member => {
              const isMe = member.id === currentUser.id;
              const isFollowing = followingIds.includes(member.id);
              const giveTakeRatio = member.give_take_ratio || ((member.referrals_sent || 1) / Math.max(1, (member.deals_closed_sek > 0 ? 2 : 1))).toFixed(1);
              const mSkills = skills.filter(s => s.member_id === member.id);

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border p-4 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isMe ? 'border-[#800020]/30 bg-[#800020]/[0.02]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Left: Avatar & Member Info */}
                  <div className="flex items-center gap-3.5 min-w-[240px] max-w-sm">
                    <div className="relative flex-shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.full_name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                      />
                      <span className={`absolute -bottom-1 -right-1 text-[8px] font-black uppercase px-1 py-0.5 rounded border ${getLevelBadge(member.membership_level)}`}>
                        {member.membership_level[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {member.full_name}
                        </h4>
                        {isMe && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-semibold">
                            Du
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                          {member.booster_score} BP
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{member.role_title} • {member.company_name}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#800020]" />
                        <span>{member.hub_city || 'Stockholm Hubb'}</span>
                        <span>• Give/Take: {giveTakeRatio}x</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Skillbars & Endorse Voting */}
                  <div className="flex-1 min-w-[200px] max-w-md">
                    {mSkills.length > 0 ? (
                      <div className="space-y-1.5">
                        {mSkills.slice(0, 2).map(skill => {
                          const pct = Math.min(100, Math.round((skill.endorsements_count / 15) * 100));
                          return (
                            <div key={skill.id} className="bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
                              <div className="flex items-center justify-between text-[10px] font-bold text-gray-800 mb-0.5">
                                <span className="truncate pr-1">{skill.skill_name}</span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <span className="text-gray-400 font-normal">{skill.endorsements_count} röster</span>
                                  {!isMe && (
                                    <button
                                      type="button"
                                      onClick={() => onEndorseSkill?.(skill.id)}
                                      disabled={skill.has_endorsed}
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition flex items-center gap-0.5 ${
                                        skill.has_endorsed
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer'
                                      }`}
                                    >
                                      <ThumbsUp className="w-2 h-2" />
                                      <span>{skill.has_endorsed ? 'Röstat' : '+ Rösta'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#800020] h-full rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {(member.offering_tags || []).slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 justify-end flex-wrap">
                    {!isMe && (
                      <button
                        onClick={() => onFollowToggle(member.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                          isFollowing
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-[#800020]'
                        }`}
                        title={isFollowing ? 'Du följer denna medlem' : 'Följ'}
                      >
                        {isFollowing ? <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> : <UserPlus className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isFollowing ? 'Följer' : 'Följ'}</span>
                      </button>
                    )}

                    {!isMe && (
                      <button
                        onClick={() => onOpenDirectChat(member.id)}
                        className="p-2 rounded-xl text-gray-600 hover:text-[#800020] hover:bg-[#800020]/5 transition border border-gray-200"
                        title="Chatta"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isMe && (
                      <button
                        onClick={() => setLunchTargetMember(member)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition border border-amber-200 flex items-center gap-1"
                        title="Bjud på lunch"
                      >
                        <Coffee className="w-3 h-3 text-amber-700" />
                        <span className="hidden sm:inline">Lunch</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenUniversalConnect(member)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition border border-gray-200 flex items-center gap-1"
                      title="Visitkort"
                    >
                      <QrCode className="w-3 h-3 text-[#800020]" />
                      <span className="hidden sm:inline">Visitkort</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {filteredMembers.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">Inga medlemmar matchade din sökning</h3>
              <p className="text-xs text-gray-500 mt-1">
                Prova att söka på en annan kompetens eller rensa filtren ovan.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedHubFilter('ALL');
                  setSelectedLevelFilter('ALL');
                  setTagFilter('');
                  setOnlyFollowing(false);
                }}
                className="mt-4 px-4 py-2 bg-[#800020] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#660018] transition"
              >
                Återställ alla filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Grundläggande Profiluppgifter</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Denna information syns på ditt digitala visitkort, QR-kod och i medlemskatalogen.
              </p>
            </div>

            {/* Avatar & File Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-gray-100">
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt={formData.full_name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#800020] shadow-sm"
                />
                <label 
                  htmlFor="profile-avatar-upload"
                  className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white cursor-pointer"
                  title="Klicka för att ladda upp ny bild från enhet"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Ladda upp</span>
                </label>
                <span className="absolute -bottom-1 -right-1 p-1 bg-[#800020] text-white rounded-full">
                  <Star className="w-3 h-3" />
                </span>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Profilbild (Ladda upp fil eller ange bildlänk)
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Ladda upp en bild direkt från din dator eller mobil, eller klistra in en bild-URL.
                  </p>
                </div>

                {uploadNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{uploadNotice}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    id="profile-avatar-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          alert('Vänligen välj en giltig bildfil (.png, .jpg, .webp).');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            const dataUrl = event.target.result as string;
                            setFormData(prev => ({ ...prev, avatar: dataUrl }));
                            setUploadNotice('✓ Ny profilbild inläst! Klicka "Spara Ändringar" längst ned för att spara.');
                            setTimeout(() => setUploadNotice(null), 6000);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-avatar-upload"
                    className="cursor-pointer px-3.5 py-2 bg-[#800020] hover:bg-[#580016] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ladda upp från enhet</span>
                  </label>

                  <span className="text-xs text-gray-400">eller URL:</span>
                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-gray-400">Snabbval:</span>
                  {[
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className="text-[10px] font-semibold text-[#800020] hover:underline"
                    >
                      Avatar {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Fullständigt namn</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Roll / Titel</label>
                <input
                  type="text"
                  required
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Bolagsnamn</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Stad / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Telefonnummer (för vCard)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+46 70 123 45 67"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/ditt-namn"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>
            </div>

            {/* Bio text */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Personlig presentation / Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Beskriv kort vad ditt bolag gör, dina styrkor och vad du brinner för..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
              />
            </div>
          </div>

          {/* Söker & Erbjuder Taggar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kompetenstaggar & Matchmaking</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Vår AI-Intro motor använder dessa taggar för att rekommendera relevanta affärskontakter varje vecka.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Söker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-900 block">
                  Vad söker du just nu? (Kapital, kompetens, kunder)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSeekingTag}
                    onChange={(e) => setNewSeekingTag(e.target.value)}
                    placeholder="T.ex. 'Serie A Investerare'"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSeekingTag(); }}}
                  />
                  <button
                    type="button"
                    onClick={handleAddSeekingTag}
                    className="px-3 py-1.5 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs hover:bg-amber-200 transition"
                  >
                    Lägg till
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {formData.seeking_tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSeekingTag(tag)}
                        className="text-amber-700 hover:text-amber-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Erbjuder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-900 block">
                  Vad kan du erbjuda andra medlemmar? (Kunskap, tjänster, rådgivning)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOfferingTag}
                    onChange={(e) => setNewOfferingTag(e.target.value)}
                    placeholder="T.ex. 'SaaS Skalning'"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOfferingTag(); }}}
                  />
                  <button
                    type="button"
                    onClick={handleAddOfferingTag}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-200 transition"
                  >
                    Lägg till
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {formData.offering_tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOfferingTag(tag)}
                        className="text-emerald-700 hover:text-emerald-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inbäddade LinkedIn-artiklar & inlägg */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                <span>Bädda in dina LinkedIn-inlägg & Artiklar</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Visa upp dina mest framgångsrika tankeledarinlägg direkt i nätverket så andra medlemmar kan läsa och dela.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Rubrik på ditt LinkedIn-inlägg..."
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
                <input
                  type="url"
                  value={newPostUrl}
                  onChange={(e) => setNewPostUrl(e.target.value)}
                  placeholder="Länk till inlägget (https://linkedin.com/...)"
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
              </div>
              <button
                type="button"
                onClick={handleAddLinkedInPost}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lägg till inbäddat inlägg</span>
              </button>
            </div>

            {/* List of embedded posts */}
            <div className="space-y-2">
              {formData.linkedin_posts.map((post, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Linkedin className="w-4 h-4 text-[#0077b5] flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-gray-900 truncate">{post.title}</p>
                      <a href={post.url} target="_blank" rel="noreferrer" className="text-[11px] text-[#0077b5] hover:underline truncate block">
                        {post.url}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLinkedInPost(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Ta bort inlägg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 📄 CV / PDF-UPPLADDNING & AI-EXTRAKTION */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#800020]" />
                  <h3 className="text-sm font-bold text-gray-900">CV & PDF-analys med Booster AI</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                    +50 BP
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ladda upp ditt CV (PDF eller DOCX). Booster AI analyserar din bakgrund, extraherar dina främsta meriter och uppdaterar dina matchmaking-taggar automatiskt.
                </p>
              </div>
            </div>

            {/* Success Alert */}
            {cvParseSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start justify-between gap-2 text-xs text-emerald-900 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{cvParseSuccessNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCvParseSuccessNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dropzone & Action Bar */}
            <div className="border-2 border-dashed border-gray-200 hover:border-[#800020]/40 rounded-2xl p-5 text-center transition bg-gray-50/50">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#800020]/10 flex items-center justify-center text-[#800020]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Dra & släpp ditt CV här, eller välj fil
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Stöder PDF, DOCX eller TXT (Max 15 MB)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <label className="cursor-pointer px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold shadow-2xs transition inline-flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                    <span>Välj fil manuellt</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSimulateUploadCv(file.name);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    disabled={isParsingCv}
                    onClick={() => handleSimulateUploadCv('Rickard_Wigrund_Executive_CV.pdf')}
                    className="px-4 py-2 bg-[#800020] hover:bg-[#660018] text-white rounded-xl text-xs font-bold shadow-2xs transition inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isParsingCv ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyserar med AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Testa Exempel-CV (Rickard_Wigrund_CV.pdf)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Current File & Summary view */}
            {formData.cv_filename && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-gray-800 truncate">{formData.cv_filename}</span>
                  <span className="text-[10px] text-gray-400">• Verifierad & extraherad</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulateUploadCv(formData.cv_filename)}
                  className="text-[11px] font-semibold text-[#800020] hover:underline"
                >
                  Kör AI-analys igen
                </button>
              </div>
            )}

            {/* Extracted Elevator Summary */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                AI-extraherad yrkessammanfattning (Executive Bio)
              </label>
              <textarea
                rows={2}
                value={formData.cv_summary}
                onChange={(e) => setFormData({ ...formData, cv_summary: e.target.value })}
                placeholder="När du laddar upp ett CV extraheras en sammanfattning här automatiskt. Du kan även justera texten manuellt..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
              />
            </div>
          </div>

          {/* 🏅 VERIFIERAD MERITFÖRTECKNING & CERTIFIERINGAR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">Verifierad Meritförteckning</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                    {(formData.merits || []).length} registrerade
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visa upp dina styrelseuppdrag, internationella certifieringar, akademiska examina och utmärkelser.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMerit(!showAddMerit)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddMerit ? 'Stäng formulär' : 'Lägg till merit (+20 BP)'}</span>
              </button>
            </div>

            {/* Add Merit Form */}
            {showAddMerit && (
              <div className="p-4 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Kategori</label>
                    <select
                      value={newMeritCategory}
                      onChange={(e) => setNewMeritCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="BOARD_ROLE">Styrelseuppdrag & Rådgivning</option>
                      <option value="CERTIFICATION">Professionell Certifiering</option>
                      <option value="EDUCATION">Akademisk Utbildning & Examen</option>
                      <option value="AWARD">Utmärkelse & Pris</option>
                      <option value="EXPERIENCE">Ledande Befattning & Entreprenörskap</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Titel / Roll / Certifikat</label>
                    <input
                      type="text"
                      required
                      placeholder="T.ex. Certifierad Styrelseledamot eller CISSP"
                      value={newMeritTitle}
                      onChange={(e) => setNewMeritTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Organisation / Utfärdare</label>
                    <input
                      type="text"
                      required
                      placeholder="T.ex. StyrelseAkademien, KTH eller (ISC)²"
                      value={newMeritOrg}
                      onChange={(e) => setNewMeritOrg(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">År / Tidsperiod</label>
                    <input
                      type="text"
                      placeholder="T.ex. 2024 eller 2022 - Nuvarande"
                      value={newMeritYear}
                      onChange={(e) => setNewMeritYear(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Kort beskrivning (valfritt)</label>
                  <input
                    type="text"
                    placeholder="T.ex. Inriktning mot revisionsutskott, dataskydd och bolagsstyrning..."
                    value={newMeritDesc}
                    onChange={(e) => setNewMeritDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddMerit(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMerit}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Spara merit (+20 BP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Merits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(formData.merits || []).map((merit) => {
                const categoryLabels: Record<string, { label: string; color: string }> = {
                  BOARD_ROLE: { label: 'Styrelse & Rådgivning', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  CERTIFICATION: { label: 'Certifiering', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  EDUCATION: { label: 'Utbildning', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  AWARD: { label: 'Utmärkelse', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                  EXPERIENCE: { label: 'Erfarenhet', color: 'bg-gray-100 text-gray-800 border-gray-200' }
                };
                const catInfo = categoryLabels[merit.category] || categoryLabels.EXPERIENCE;

                return (
                  <div
                    key={merit.id}
                    className="p-3.5 bg-gray-50/70 border border-gray-200 rounded-xl flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {merit.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-blue-700 font-bold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verifierad</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMerit(merit.id)}
                            className="text-gray-400 hover:text-red-600 p-1 transition"
                            title="Ta bort merit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-gray-900 mt-2">
                        {merit.title}
                      </h4>
                      <p className="text-[11px] font-medium text-gray-600 mt-0.5">
                        {merit.organization} • {merit.year}
                      </p>

                      {merit.description && (
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                          {merit.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {(formData.merits || []).length === 0 && (
                <div className="col-span-2 p-6 border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-500">
                  Inga meriter registrerade än. Ladda upp ditt CV ovan för att extrahera automatiskt eller lägg till manuellt!
                </div>
              )}
            </div>
          </div>

          {/* 💼 KUNDCASE & REFERENSGALLERI */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-bold text-gray-900">Kundcase & Referensgalleri</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    {(formData.case_studies || []).length} publicerade
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visa upp konkreta affärsresultat och leveranser för andra medlemmar och potentiella samarbetspartners.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCaseStudy(!showAddCaseStudy)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddCaseStudy ? 'Stäng formulär' : 'Nytt kundcase (+30 BP)'}</span>
              </button>
            </div>

            {/* Add Case Study Form */}
            {showAddCaseStudy && (
              <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Projektrubrik</label>
                    <input
                      type="text"
                      required
                      placeholder="T.ex. Skalning av B2B SaaS för fintech-scaleup"
                      value={newCaseTitle}
                      onChange={(e) => setNewCaseTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Klientnamn / Bransch</label>
                    <input
                      type="text"
                      required
                      placeholder="T.ex. NordicPay AB (eller anonymiserat 'Ledande Fintech-bank')"
                      value={newCaseClient}
                      onChange={(e) => setNewCaseClient(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Mätbart Resultat / KPI</label>
                    <input
                      type="text"
                      placeholder="T.ex. +140% ARR tillväxt, 99.99% upptid"
                      value={newCaseMetric}
                      onChange={(e) => setNewCaseMetric(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Kompetenstaggar (kommaseparerade)</label>
                    <input
                      type="text"
                      placeholder="T.ex. Cloud Security, SOC2, Tillväxt"
                      value={newCaseTags}
                      onChange={(e) => setNewCaseTags(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Beskrivning av utmaning & lösning</label>
                  <textarea
                    rows={2}
                    placeholder="Beskriv vad klienten behövde hjälp med, vad ni genomförde och vilken effekt samarbetet gav..."
                    value={newCaseDesc}
                    onChange={(e) => setNewCaseDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCaseStudy(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCaseStudy}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Publicera kundcase (+30 BP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Case Studies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(formData.case_studies || []).map((cs) => (
                <div
                  key={cs.id}
                  className="bg-gray-50/70 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between gap-3 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {cs.client_name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCaseStudy(cs.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition"
                        title="Ta bort kundcase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {cs.title}
                    </h4>

                    {cs.result_metric && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>{cs.result_metric}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3">
                      {cs.description}
                    </p>
                  </div>

                  {cs.tags && cs.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-200/60">
                      {cs.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {(formData.case_studies || []).length === 0 && (
                <div className="col-span-2 p-6 border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-500">
                  Inga kundcase registrerade än. Klicka på "Nytt kundcase" ovan för att visa upp dina framgångshistorier!
                </div>
              )}
            </div>
          </div>

          {/* Submit bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#800020] hover:bg-[#660018] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Spara alla profiländringar</span>
            </button>
          </div>
        </form>
      )}

      {/* LUNCH INVITATION MODAL */}
      {lunchTargetMember && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Bjud {lunchTargetMember.full_name} på lunch
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {lunchTargetMember.role_title} • {lunchTargetMember.company_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLunchTargetMember(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Föreslaget datum</label>
                <input
                  type="date"
                  value={lunchDate}
                  onChange={(e) => setLunchDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Plats / Mötespunkt</label>
                <input
                  type="text"
                  value={lunchLocation}
                  onChange={(e) => setLunchLocation(e.target.value)}
                  placeholder="T.ex. Convendum Lounge, Taverna Brillo, eller Teams"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Personligt meddelande</label>
                <textarea
                  rows={2}
                  value={lunchNote}
                  onChange={(e) => setLunchNote(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Host Pays Checkbox */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="host_pays_cb"
                  checked={hostPays}
                  onChange={(e) => setHostPays(e.target.checked)}
                  className="mt-0.5 rounded text-[#800020] focus:ring-[#800020]"
                />
                <label htmlFor="host_pays_cb" className="cursor-pointer">
                  <span className="font-bold text-amber-950 block">
                    [x] Jag bjuder på lunchen! (+30 Booster Points)
                  </span>
                  <span className="text-[11px] text-amber-800 block mt-0.5">
                    Att bjuda en annan medlem signalerar generositet och ger maximal poängutdelning när mötet bekräftas.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setLunchTargetMember(null)}
                className="px-4 py-2 text-gray-600 text-xs font-semibold hover:bg-gray-100 rounded-xl"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleSendLunchInvite}
                className="px-5 py-2 bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Skicka inbjudan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💼 CASE STUDIES MODAL */}
      {viewingCaseStudiesMember && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingCaseStudiesMember.avatar}
                  alt={viewingCaseStudiesMember.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span>Kundcase & Referenser: {viewingCaseStudiesMember.full_name}</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {viewingCaseStudiesMember.role_title} • {viewingCaseStudiesMember.company_name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCaseStudiesMember(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              {(viewingCaseStudiesMember.case_studies || []).map((cs) => (
                <div
                  key={cs.id}
                  className="p-5 bg-gray-50/80 border border-gray-200 rounded-2xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-200 self-start">
                      Klient: {cs.client_name}
                    </span>
                    {cs.result_metric && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold self-start sm:self-auto">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cs.result_metric}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {cs.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                      {cs.description}
                    </p>
                  </div>

                  {cs.tags && cs.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200/60">
                      {cs.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {(!viewingCaseStudiesMember.case_studies || viewingCaseStudiesMember.case_studies.length === 0) && (
                <p className="text-xs text-gray-500 text-center py-6">
                  Denna medlem har inte lagt upp några publika kundcase ännu.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">
                Verifierat av Booster Friends B2B Nätverk
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const m = viewingCaseStudiesMember;
                    setViewingCaseStudiesMember(null);
                    onOpenDirectChat(m.id);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ställ fråga i chatten</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const m = viewingCaseStudiesMember;
                    setViewingCaseStudiesMember(null);
                    setLunchTargetMember(m);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#800020] hover:bg-[#660018] rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Bjud på lunch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
