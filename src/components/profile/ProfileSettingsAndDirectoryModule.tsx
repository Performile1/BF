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
  HeartHandshake
} from 'lucide-react';
import { Member, MembershipLevel, LunchRequest } from '../../types';

interface ProfileSettingsAndDirectoryModuleProps {
  currentUser: Member;
  allMembers: Member[];
  onUpdateProfile: (updatedData: Partial<Member>) => void;
  onFollowToggle: (targetMemberId: string) => void;
  onOpenDirectChat: (targetMemberId: string) => void;
  onOpenUniversalConnect: (member?: Member) => void;
  onSendLunchRequest: (request: Partial<LunchRequest>) => void;
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
  initialTab?: 'directory' | 'settings';
}

export const ProfileSettingsAndDirectoryModule: React.FC<ProfileSettingsAndDirectoryModuleProps> = ({
  currentUser,
  allMembers,
  onUpdateProfile,
  onFollowToggle,
  onOpenDirectChat,
  onOpenUniversalConnect,
  onSendLunchRequest,
  onAwardPoints,
  initialTab = 'directory'
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'settings'>(initialTab);

  // Directory Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHubFilter, setSelectedHubFilter] = useState<string>('ALL');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | MembershipLevel>('ALL');
  const [tagFilter, setTagFilter] = useState('');
  const [onlyFollowing, setOnlyFollowing] = useState(false);

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
        </div>
      </div>

      {savedSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedSuccessNotice}</span>
        </div>
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

          {/* Members Grid */}
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

            {/* Avatar & Cover selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-gray-100">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt={formData.full_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#800020] shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-[#800020] text-white rounded-full">
                  <Star className="w-3 h-3" />
                </span>
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <label className="text-xs font-bold text-gray-700 block">Profilbild (Bild-URL)</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
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
    </div>
  );
};
