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
  ToggleRight
} from 'lucide-react';
import { 
  Member, 
  Hub, 
  BannerAd, 
  AdminMemberApplication, 
  AdminKpiStats 
} from '../../types';
import { 
  INITIAL_BANNER_ADS, 
  INITIAL_ADMIN_KPIS, 
  INITIAL_ADMIN_APPLICATIONS 
} from '../../data/communityAndMatchmakingData';

interface AdminPortalModuleProps {
  currentUser: Member;
  allMembers: Member[];
  hubs: Hub[];
  onUpdateMemberLevel?: (memberId: string, level: 'BRONZE' | 'SILVER' | 'GOLD') => void;
}

export const AdminPortalModule: React.FC<AdminPortalModuleProps> = ({
  currentUser,
  allMembers = [],
  hubs = [],
  onUpdateMemberLevel
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'KPIS' | 'APPLICATIONS' | 'BANNERS' | 'HUBS' | 'MEMBERS'>('KPIS');
  const [applications, setApplications] = useState<AdminMemberApplication[]>(INITIAL_ADMIN_APPLICATIONS);
  const [bannerAds, setBannerAds] = useState<BannerAd[]>(INITIAL_BANNER_ADS);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // New banner form modal state
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerAdvertiser, setNewBannerAdvertiser] = useState('');
  const [newBannerPlacement, setNewBannerPlacement] = useState<'FEED_TOP' | 'CALENDAR_SIDEBAR' | 'HUB_DETAILS'>('FEED_TOP');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80');
  const [newBannerUrl, setNewBannerUrl] = useState('https://boosterfriends.se/partners');

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

  // Add Banner Handler
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
      clicks_count: 0
    };
    setBannerAds(prev => [newBan, ...prev]);
    setShowAddBanner(false);
    setNewBannerTitle('');
    setNewBannerAdvertiser('');
    setFeedbackNotice(`🎉 Ny annonsbanner aktiverad i Booster Friends!`);
    setTimeout(() => setFeedbackNotice(null), 3000);
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
          <span>Hubbar & Coworking</span>
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
          <span>Moderering & Nivåer</span>
        </button>
      </div>

      {/* TAB 1: KPI Dashboard */}
      {activeAdminTab === 'KPIS' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Totala Medlemmar</span>
              <div className="text-2xl font-black text-gray-900">{INITIAL_ADMIN_KPIS.total_members} st</div>
              <div className="text-xs text-gray-500 pt-1 flex items-center gap-2">
                <span className="text-amber-800 font-bold">🥇 32 Guld</span> • 
                <span className="text-slate-600 font-bold">🥈 64 Silver</span> • 
                <span className="text-amber-950 font-bold">🥉 52 Brons</span>
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
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Månatliga Incheckningar</span>
              <div className="text-2xl font-black text-[#800020]">{INITIAL_ADMIN_KPIS.active_monthly_checkins} st</div>
              <div className="text-xs text-gray-500 pt-1">
                Fysiska kaffemöten & coworking-pass
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
            <h3 className="text-base font-black text-gray-900">
              Kapacitet & Flexbordsbeläggning per Partner-Hubb
            </h3>

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hubs.map((hub) => (
                    <tr key={hub.id} className="hover:bg-gray-50/80">
                      <td className="py-3.5 font-bold text-gray-900">{hub.name}</td>
                      <td className="py-3.5 text-gray-600">{hub.city}</td>
                      <td className="py-3.5 font-semibold text-gray-900">{hub.member_count} st</td>
                      <td className="py-3.5 text-gray-600">20 flexbord/dag</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900">Partnerannonser & Sponsrade Banners</h3>
              <p className="text-xs text-gray-500">Styr visning i feed, kalender och hubbdetaljer</p>
            </div>
            <button
              onClick={() => setShowAddBanner(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ny Annonsbanner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerAds.map((ban) => (
              <div 
                key={ban.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src={ban.image_url} 
                      alt={ban.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                      {ban.placement}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-extrabold text-gray-900 text-sm">{ban.title}</h4>
                    <p className="text-xs text-gray-500">Annonsör: <span className="font-bold text-gray-800">{ban.advertiser_name}</span></p>

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
            ))}
          </div>

          {/* Add Banner Form Modal */}
          {showAddBanner && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <form onSubmit={handleCreateBanner} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <h3 className="font-black text-gray-900 text-base">Skapa Ny Annonsbanner</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Titel:</label>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Placering:</label>
                  <select 
                    value={newBannerPlacement}
                    onChange={(e: any) => setNewBannerPlacement(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white"
                  >
                    <option value="FEED_TOP">Högst upp i Feed / Community</option>
                    <option value="CALENDAR_SIDEBAR">Sidopanel i Masterkalendern</option>
                    <option value="HUB_DETAILS">Inuti Hubb & Coworking</option>
                  </select>
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
                    className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold"
                  >
                    Spara & Publicera
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Hubbar & Coworking manager */}
      {activeAdminTab === 'HUBS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900">Partner-Coworking & Hubbar</h3>
              <p className="text-xs text-gray-500">Administrera öppettider, geofence och mötesdagar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubs.map((hub) => (
              <div key={hub.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">{hub.name}</h4>
                    <p className="text-xs text-gray-500">{hub.address}, {hub.city}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#800020]">
                    {hub.member_count} medlemmar
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 text-xs text-gray-700 space-y-1">
                  <div>📍 Geofence Radie: <span className="font-bold">{hub.radius_m} meter</span></div>
                  <div>📅 Veckodag för Hubb-frukost: <span className="font-bold">{hub.meeting_day}</span></div>
                  <div>🎯 Nästa Event: <span className="font-bold text-[#800020]">{hub.next_event_title}</span></div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold">● Automatisk incheckning aktiv</span>
                  <button className="text-[#800020] font-bold hover:underline">Redigera Inställningar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Medlemsmoderering & Nivåer */}
      {activeAdminTab === 'MEMBERS' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-gray-900">Medlemsmoderering & Booster Score-Styrning</h3>
          <p className="text-xs text-gray-500">Hantera manuella uppgraderingar, ge Master Networker status och granska profiler</p>

          <div className="divide-y divide-gray-100">
            {allMembers.slice(0, 8).map((mem) => (
              <div key={mem.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={mem.avatar} alt={mem.full_name} className="w-10 h-10 rounded-xl object-cover" />
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
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
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
    </div>
  );
};
