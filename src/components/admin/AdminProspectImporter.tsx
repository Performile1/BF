import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Send, 
  Users, 
  Check, 
  Trash2, 
  RefreshCw, 
  Download, 
  Sparkles,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';
import { Member, Hub, MembershipLevel, ProspectRecord } from '../../types';
import { sendBroadcastCampaign } from '../../lib/apiServices';
import { AdminInspect } from '../dev/AdminInspect';

interface AdminProspectImporterProps {
  currentUser: Member;
  hubs: Hub[];
  existingMembers?: Member[];
  onImportProspects?: (newProspects: ProspectRecord[]) => void;
  onCreateMember?: (memberData: Partial<Member>) => void;
}

// Initial demo prospects for immediate testing
const INITIAL_PROSPECTS: ProspectRecord[] = [
  {
    id: 'prospect_001',
    full_name: 'Henrik Vesterlund',
    email: 'henrik@nordicscale.se',
    phone: '+46 70 455 12 34',
    company_name: 'NordicScale Ventures AB',
    role_title: 'Head of Business Development',
    hub_id: 'hub_stockholm',
    hub_name: 'Hubb Stockholm City',
    trial_days: 14,
    trial_tier: 'GOLD',
    trial_ends_at: new Date(Date.now() + 11 * 86400000).toISOString(),
    status: 'ACTIVE_TRIAL',
    onboarding_token: 'tok_nordicscale_9821',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: 'Träffad under Tech BBQ. Intresserad av mötesrum & investerarnätverket.'
  },
  {
    id: 'prospect_002',
    full_name: 'Karin Dahlström',
    email: 'karin@ecofuture.io',
    phone: '+46 73 881 99 22',
    company_name: 'EcoFuture Analytics',
    role_title: 'Grundare & CEO',
    hub_id: 'hub_gbg',
    hub_name: 'Hubb Göteborg Central',
    trial_days: 30,
    trial_tier: 'SILVER',
    trial_ends_at: new Date(Date.now() + 24 * 86400000).toISOString(),
    status: 'ACTIVE_TRIAL',
    onboarding_token: 'tok_ecofuture_5514',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    notes: 'Rekommenderad av Elena Rostova. Söker flexplatser och B2B-leads.'
  },
  {
    id: 'prospect_003',
    full_name: 'Carl Söderberg',
    email: 'carl@apexconsulting.se',
    phone: '+46 72 334 56 78',
    company_name: 'Apex Strategy Consulting',
    role_title: 'Senior Partner',
    hub_id: 'hub_malmo',
    hub_name: 'Hubb Malmö Västra Hamnen',
    trial_days: 14,
    trial_tier: 'BRONZE',
    trial_ends_at: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'INVITED',
    onboarding_token: 'tok_apex_3319',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    notes: 'Inbjudningslänk skickad via e-post, ännu ej aktiverat profil.'
  }
];

const SAMPLE_CSV_TEMPLATE = `Namn,E-post,Bolag,Roll,Telefon,Ort
Marcus Lindgren,marcus@scaleup.se,ScaleUp Nordic AB,VD & Grundare,+46 70 111 22 33,Stockholm
Sofia Almqvist,sofia@fintechflow.com,Fintech Flow,CTO,+46 73 222 33 44,Göteborg
Fredrik Nordin,fredrik@cloudops.se,CloudOps Solutions,Sales Director,+46 72 333 44 55,Malmö`;

export const AdminProspectImporter: React.FC<AdminProspectImporterProps> = ({
  currentUser,
  hubs = [],
  existingMembers = [],
  onImportProspects,
  onCreateMember
}) => {
  // Mode: list vs bulk import form vs single add vs broadcast
  const [activeSubView, setActiveSubView] = useState<'list' | 'bulk_import' | 'manual_add' | 'broadcast'>('bulk_import');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'ALL' | 'PROSPECTS' | 'MEMBERS'>('PROSPECTS');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Prospect list state
  const [prospects, setProspects] = useState<ProspectRecord[]>(INITIAL_PROSPECTS);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Bulk import form state
  const [rawCsvText, setRawCsvText] = useState(SAMPLE_CSV_TEMPLATE);
  const [defaultTrialDays, setDefaultTrialDays] = useState<number>(14);
  const [defaultTier, setDefaultTier] = useState<MembershipLevel>('SILVER');
  const [defaultHubId, setDefaultHubId] = useState<string>(hubs[0]?.id || 'hub_stockholm');
  const [sendInvitationEmail, setSendInvitationEmail] = useState<boolean>(true);
  const [customWelcomeNote, setCustomWelcomeNote] = useState('Välkommen att testa Booster Friends! Din provperiod ger full access till coworking, matchmaking och events.');

  // Manual single prospect state
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualRole, setManualRole] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualHubId, setManualHubId] = useState(hubs[0]?.id || 'hub_stockholm');
  const [manualTier, setManualTier] = useState<MembershipLevel>('SILVER');
  const [manualDays, setManualDays] = useState(14);
  const [manualNotes, setManualNotes] = useState('');

  // Parse CSV rows dynamically
  const parsedRows = useMemo(() => {
    if (!rawCsvText.trim()) return [];

    const lines = rawCsvText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length <= 1) return [];

    // Header line detection
    const firstLine = lines[0].toLowerCase();
    const startIndex = firstLine.includes('namn') || firstLine.includes('name') || firstLine.includes('e-post') || firstLine.includes('email') ? 1 : 0;

    const results = [];

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Support comma or semicolon or tab
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else {
        parts = line.split(',');
      }

      const cleanParts = parts.map(p => p.replace(/^["']|["']$/g, '').trim());

      const fullName = cleanParts[0] || '';
      const email = cleanParts[1] || '';
      const company = cleanParts[2] || 'Ej angivet bolag';
      const roleTitle = cleanParts[3] || 'Entreprenör / Medlem';
      const phone = cleanParts[4] || '';
      const cityOrHub = cleanParts[5] || '';

      const isValidEmail = email.includes('@') && email.includes('.');
      const isDuplicate = existingMembers.some(m => m.email?.toLowerCase() === email.toLowerCase()) ||
                          prospects.some(p => p.email?.toLowerCase() === email.toLowerCase());

      results.push({
        fullName,
        email,
        company,
        roleTitle,
        phone,
        cityOrHub,
        isValid: fullName.length > 1 && isValidEmail,
        isDuplicate,
        errorReason: !fullName ? 'Saknar namn' : !isValidEmail ? 'Ogiltig e-post' : isDuplicate ? 'Redan registrerad' : null
      });
    }

    return results;
  }, [rawCsvText, existingMembers, prospects]);

  const validCount = parsedRows.filter(r => r.isValid && !r.isDuplicate).length;
  const invalidCount = parsedRows.filter(r => !r.isValid || r.isDuplicate).length;

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4500);
  };

  // Send Broadcast Campaign handler (RPC send_broadcast)
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      showNotification('Vänligen fyll i både rubrik och meddelandetext.', 'error');
      return;
    }

    setIsSendingBroadcast(true);
    try {
      const campaignId = await sendBroadcastCampaign(
        broadcastTitle.trim(),
        broadcastBody.trim(),
        broadcastAudience
      );
      showNotification(
        `Utskick skickat till målgrupp ${broadcastAudience === 'ALL' ? 'Alla' : broadcastAudience === 'PROSPECTS' ? 'Prospekts' : 'Medlemmar'}! (ID: ${campaignId || 'Kampanj sparad'})`,
        'success'
      );
      setBroadcastTitle('');
      setBroadcastBody('');
    } catch (err: any) {
      showNotification('Kunde inte skicka utskick: ' + (err?.message || 'Ett fel uppstod.'), 'error');
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  // Copy onboarding magic link
  const handleCopyOnboardingLink = (prospect: ProspectRecord) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://boosterfriends.se';
    const link = `${origin}/#connect?token=${prospect.onboarding_token}&email=${encodeURIComponent(prospect.email)}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedToken(prospect.onboarding_token);
    showNotification(`Onboarding-länk kopierad för ${prospect.full_name}!`, 'success');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Execute bulk import
  const handleExecuteBulkImport = () => {
    const validRows = parsedRows.filter(r => r.isValid && !r.isDuplicate);
    if (validRows.length === 0) {
      showNotification('Inga giltiga prospekts att importera. Kontrollera formatet.', 'error');
      return;
    }

    const targetHub = hubs.find(h => h.id === defaultHubId) || hubs[0] || { id: 'hub_stockholm', name: 'Hubb Stockholm' };
    const trialEnds = new Date(Date.now() + defaultTrialDays * 86400000).toISOString();

    const newProspects: ProspectRecord[] = validRows.map((row, idx) => {
      const cleanName = row.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const token = `tok_${cleanName || 'prospect'}_${Math.random().toString(36).substring(2, 7)}`;

      return {
        id: `prospect_${Date.now()}_${idx}`,
        full_name: row.fullName,
        email: row.email,
        phone: row.phone || undefined,
        company_name: row.company,
        role_title: row.roleTitle,
        hub_id: targetHub.id,
        hub_name: targetHub.name,
        trial_days: defaultTrialDays,
        trial_tier: defaultTier,
        trial_ends_at: trialEnds,
        status: sendInvitationEmail ? 'ACTIVE_TRIAL' : 'INVITED',
        onboarding_token: token,
        created_at: new Date().toISOString(),
        notes: customWelcomeNote
      };
    });

    // Also register in main members directory as PROSPECT role if onCreateMember provided
    if (onCreateMember) {
      newProspects.forEach(p => {
        onCreateMember({
          id: `usr_${p.id}`,
          full_name: p.full_name,
          email: p.email,
          phone: p.phone || '+46 70 000 00 00',
          company_name: p.company_name,
          role_title: p.role_title,
          role: 'PROSPECT',
          is_admin: false,
          membership_level: p.trial_tier,
          payment_status: 'TRIAL',
          trial_ends_at: p.trial_ends_at,
          primary_hub_id: p.hub_id,
          hub_id: p.hub_id,
          hub_name: p.hub_name,
          city: targetHub.city || 'Stockholm',
          booster_score: 50,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
        });
      });
    }

    setProspects(prev => [...newProspects, ...prev]);
    if (onImportProspects) {
      onImportProspects(newProspects);
    }

    showNotification(`Framgångsrikt importerat ${newProspects.length} prospekts med ${defaultTrialDays} dagars ${defaultTier}-provperiod!`, 'success');
    setActiveSubView('list');
  };

  // Execute manual single add
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualEmail.trim()) {
      showNotification('Vänligen fyll i namn och e-post.', 'error');
      return;
    }

    const targetHub = hubs.find(h => h.id === manualHubId) || hubs[0] || { id: 'hub_stockholm', name: 'Hubb Stockholm' };
    const trialEnds = new Date(Date.now() + manualDays * 86400000).toISOString();
    const token = `tok_${manualName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 7)}`;

    const newProspect: ProspectRecord = {
      id: `prospect_${Date.now()}`,
      full_name: manualName,
      email: manualEmail,
      phone: manualPhone || undefined,
      company_name: manualCompany || 'Ej angivet',
      role_title: manualRole || 'Entreprenör',
      hub_id: targetHub.id,
      hub_name: targetHub.name,
      trial_days: manualDays,
      trial_tier: manualTier,
      trial_ends_at: trialEnds,
      status: 'ACTIVE_TRIAL',
      onboarding_token: token,
      created_at: new Date().toISOString(),
      notes: manualNotes
    };

    if (onCreateMember) {
      onCreateMember({
        id: `usr_${newProspect.id}`,
        full_name: newProspect.full_name,
        email: newProspect.email,
        phone: newProspect.phone || '+46 70 000 00 00',
        company_name: newProspect.company_name,
        role_title: newProspect.role_title,
        role: 'PROSPECT',
        is_admin: false,
        membership_level: newProspect.trial_tier,
        payment_status: 'TRIAL',
        trial_ends_at: newProspect.trial_ends_at,
        primary_hub_id: newProspect.hub_id,
        hub_id: newProspect.hub_id,
        hub_name: newProspect.hub_name,
        city: targetHub.city || 'Stockholm',
        booster_score: 50
      });
    }

    setProspects(prev => [newProspect, ...prev]);
    if (onImportProspects) {
      onImportProspects([newProspect]);
    }

    showNotification(`Prospekt ${newProspect.full_name} tillagt med ${manualDays} dagars provperiod!`, 'success');
    setManualName('');
    setManualEmail('');
    setManualCompany('');
    setManualRole('');
    setManualPhone('');
    setManualNotes('');
    setActiveSubView('list');
  };

  // Extend trial days for prospect
  const handleExtendTrial = (prospectId: string, additionalDays = 14) => {
    setProspects(prev => prev.map(p => {
      if (p.id === prospectId) {
        const currentEnd = new Date(p.trial_ends_at).getTime();
        const newEnd = new Date(Math.max(Date.now(), currentEnd) + additionalDays * 86400000).toISOString();
        return {
          ...p,
          trial_days: p.trial_days + additionalDays,
          trial_ends_at: newEnd,
          status: 'ACTIVE_TRIAL'
        };
      }
      return p;
    }));
    showNotification(`Provperioden förlängdes med +${additionalDays} dagar!`, 'info');
  };

  // Convert prospect directly to regular paying/active member
  const handleConvertToMember = (prospect: ProspectRecord) => {
    setProspects(prev => prev.map(p => {
      if (p.id === prospect.id) {
        return { ...p, status: 'CONVERTED' };
      }
      return p;
    }));

    if (onCreateMember) {
      onCreateMember({
        id: `usr_converted_${prospect.id}`,
        full_name: prospect.full_name,
        email: prospect.email,
        phone: prospect.phone || '+46 70 000 00 00',
        company_name: prospect.company_name,
        role_title: prospect.role_title,
        role: 'MEMBER',
        is_admin: false,
        membership_level: prospect.trial_tier,
        payment_status: 'PAID',
        primary_hub_id: prospect.hub_id,
        hub_id: prospect.hub_id,
        hub_name: prospect.hub_name,
        booster_score: 250
      });
    }

    showNotification(`${prospect.full_name} har konverterats till fullvärdig aktiv MEMBER!`, 'success');
  };

  // Delete prospect
  const handleDeleteProspect = (prospectId: string) => {
    setProspects(prev => prev.filter(p => p.id !== prospectId));
    showNotification('Prospekt raderades.', 'info');
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (text) {
        setRawCsvText(text);
        showNotification(`Laddade upp ${file.name}! Förhandsgranska raderna nedan.`, 'info');
      }
    };
    reader.readAsText(file);
  };

  // Export prospects to CSV
  const handleExportCsv = () => {
    const headers = ['Namn', 'E-post', 'Telefon', 'Bolag', 'Roll', 'Hubb', 'Nivå', 'Dagar', 'Går ut', 'Status', 'Token'];
    const rows = prospects.map(p => [
      `"${p.full_name}"`,
      `"${p.email}"`,
      `"${p.phone || ''}"`,
      `"${p.company_name}"`,
      `"${p.role_title}"`,
      `"${p.hub_name}"`,
      `"${p.trial_tier}"`,
      p.trial_days,
      `"${p.trial_ends_at.split('T')[0]}"`,
      `"${p.status}"`,
      `"${p.onboarding_token}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `booster_prospects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Prospekts exporterades till CSV!', 'success');
  };

  return (
    <AdminInspect
      component="AdminProspectImporter.tsx"
      sourceTable="public.prospects / broadcast_campaigns"
      columns={['id', 'full_name', 'email', 'company_name', 'status', 'trial_tier', 'trial_ends_at']}
      notes="CSV-import av prospekts, generering av onboarding-länkar och broadcast-utskick"
    >
      <div className="space-y-6" id="admin-prospect-importer">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg transition animate-in fade-in slide-in-from-top-2 ${
          notificationMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : notificationMsg.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-3">
            {notificationMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
            {notificationMsg.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
            {notificationMsg.type === 'info' && <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />}
            <span className="text-xs sm:text-sm font-bold">{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-xs font-bold underline ml-4">Stäng</button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin • Tillväxt & Prospektering</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 font-display">
            Bulkimport av Prospekts & Provperioder
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
            Importera potentiella medlemmar från Excel, eventlistor eller CRM. Tilldela provperioder med automatisk behörighetsbegränsning och unika onboarding-länkar.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setActiveSubView('list')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubView === 'list'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Aktiva Prospekts ({prospects.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('bulk_import')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubView === 'bulk_import'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Bulkimport</span>
          </button>

          <button
            onClick={() => setActiveSubView('manual_add')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubView === 'manual_add'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Lägg till enskild</span>
          </button>

          <button
            onClick={() => setActiveSubView('broadcast')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubView === 'broadcast'
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Skicka utskick (RPC)</span>
          </button>

          <button
            onClick={handleExportCsv}
            title="Exportera till CSV"
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW 1: BULK IMPORT CSV */}
      {activeSubView === 'bulk_import' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Configuration Column */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#800020]" />
                1. Provperiod & Behörighet
              </h3>

              {/* Trial duration days */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Längd på Provperiod (Dagar)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[7, 14, 30, 60].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDefaultTrialDays(days)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                        defaultTrialDays === days
                          ? 'bg-[#800020] border-[#800020] text-white shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {days} dgr
                    </button>
                  ))}
                </div>
              </div>

              {/* Trial tier */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Medlemsnivå under Provperiod
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BRONZE', 'SILVER', 'GOLD'] as MembershipLevel[]).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setDefaultTier(tier)}
                      className={`py-2 px-2 rounded-xl text-xs font-black border transition flex flex-col items-center justify-center gap-0.5 ${
                        defaultTier === tier
                          ? tier === 'GOLD'
                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                            : tier === 'SILVER'
                            ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-xs'
                            : 'bg-orange-100 border-orange-400 text-orange-900 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{tier}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        {tier === 'GOLD' ? 'Full access' : tier === 'SILVER' ? '1 pass/vecka' : 'Event-access'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Hub */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                  Tilldelad Primärhubb
                </label>
                <select
                  value={defaultHubId}
                  onChange={e => setDefaultHubId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#800020] outline-hidden"
                >
                  {hubs.map(hub => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name} ({hub.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Send email toggle */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendInvitationEmail}
                    onChange={e => setSendInvitationEmail(e.target.checked)}
                    className="mt-0.5 rounded text-[#800020] focus:ring-[#800020]"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Generera och skicka inbjudningsmail direkt
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                      Skickar välkomstmeddelande med unik Magic Link för direkt aktivering utan lösenord.
                    </span>
                  </div>
                </label>
              </div>

              {/* Custom welcome note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Personligt Välkomstmeddelande
                </label>
                <textarea
                  rows={3}
                  value={customWelcomeNote}
                  onChange={e => setCustomWelcomeNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>
            </div>

            {/* Right CSV Input & Preview Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#800020]" />
                    2. Klistra in data eller ladda upp CSV
                  </h3>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Ladda upp .csv fil</span>
                      <input
                        type="file"
                        accept=".csv,.txt,.tsv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setRawCsvText(SAMPLE_CSV_TEMPLATE)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-[#800020] text-xs font-bold hover:bg-rose-100 transition"
                    >
                      Återställ mall
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={rawCsvText}
                    onChange={e => setRawCsvText(e.target.value)}
                    placeholder="Namn, E-post, Bolag, Roll, Telefon, Ort"
                    className="w-full p-3 font-mono text-xs text-gray-800 bg-gray-50/80 rounded-2xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#800020] outline-hidden"
                  />
                  <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                    <span>Format: Namn, E-post, Bolag, Roll, Telefon, Ort (komma- eller semikolonseparerat)</span>
                    <span>{parsedRows.length} rader identifierade</span>
                  </div>
                </div>

                {/* Parsed Preview Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Förhandsgranskning av rader:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {validCount} Giltiga
                      </span>
                      {invalidCount > 0 && (
                        <span className="text-red-600 flex items-center gap-1 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {invalidCount} Fel / Dubbletter
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-2xl divide-y divide-gray-100">
                    {parsedRows.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400">
                        Klistra in CSV-rader ovan för att förhandsgranska
                      </div>
                    ) : (
                      parsedRows.map((row, i) => (
                        <div
                          key={i}
                          className={`p-2.5 text-xs flex items-center justify-between gap-2 transition ${
                            !row.isValid || row.isDuplicate ? 'bg-red-50/40 text-red-900' : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-[10px] font-mono text-gray-400 w-5">#{i + 1}</span>
                            <div className="min-w-0">
                              <span className="font-bold block truncate">{row.fullName || '—'}</span>
                              <span className="text-[11px] text-gray-500 block truncate">{row.email}</span>
                            </div>
                          </div>

                          <div className="hidden sm:block min-w-0 flex-1">
                            <span className="font-medium text-gray-700 block truncate">{row.company}</span>
                            <span className="text-[10px] text-gray-400 block truncate">{row.roleTitle}</span>
                          </div>

                          <div>
                            {row.isValid && !row.isDuplicate ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Redo
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {row.errorReason}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Execution CTA */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Total provperiod: <strong className="text-gray-900">{defaultTrialDays} dagar {defaultTier}</strong> per prospekt.
                </div>

                <button
                  type="button"
                  onClick={handleExecuteBulkImport}
                  disabled={validCount === 0}
                  className="py-3 px-6 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>Importera {validCount} Prospekts nu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MANUAL SINGLE PROSPECT FORM */}
      {activeSubView === 'manual_add' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-lg font-black text-gray-900 font-display">Lägg till enskilt prospekt</h3>
            <p className="text-xs text-gray-500">Skapar ett direkt prospektkonto med tilldelad provperiod och länk.</p>
          </div>

          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fullständigt Namn *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  placeholder="t.ex. Johan Lind"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">E-postadress *</label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={e => setManualEmail(e.target.value)}
                  placeholder="johan@bolag.se"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bolagsnamn</label>
                <input
                  type="text"
                  value={manualCompany}
                  onChange={e => setManualCompany(e.target.value)}
                  placeholder="Lind Strategy AB"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Yrkestitel / Roll</label>
                <input
                  type="text"
                  value={manualRole}
                  onChange={e => setManualRole(e.target.value)}
                  placeholder="Senior Advisor"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Telefonnummer</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={e => setManualPhone(e.target.value)}
                  placeholder="+46 70 123 45 67"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primär Coworking-hubb</label>
                <select
                  value={manualHubId}
                  onChange={e => setManualHubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-[#800020] outline-hidden"
                >
                  {hubs.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Provperiods-nivå</label>
                <select
                  value={manualTier}
                  onChange={e => setManualTier(e.target.value as MembershipLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-[#800020] outline-hidden"
                >
                  <option value="BRONZE">BRONZE (Bas / Nätverk)</option>
                  <option value="SILVER">SILVER (Coworking 1 d/v)</option>
                  <option value="GOLD">GOLD (Premium VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Antal provdagar</label>
                <select
                  value={manualDays}
                  onChange={e => setManualDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:ring-2 focus:ring-[#800020] outline-hidden"
                >
                  <option value="7">7 Dagar</option>
                  <option value="14">14 Dagar (Rekommenderat)</option>
                  <option value="30">30 Dagar</option>
                  <option value="60">60 Dagar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Intern anteckning</label>
              <textarea
                rows={2}
                value={manualNotes}
                onChange={e => setManualNotes(e.target.value)}
                placeholder="Var träffades ni? Vad är kundens primära behov?"
                className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubView('list')}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Avbryt
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#68001a] shadow-xs"
              >
                Spara & Skapa Prospekt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: ACTIVE PROSPECTS DIRECTORY */}
      {activeSubView === 'list' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 font-display">Registrerade Prospekts ({prospects.length})</h3>
              <p className="text-xs text-gray-500">Hantera inbjudningslänkar, återstående provdagar och konverteringar till betalande medlemmar.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubView('bulk_import')}
                className="px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#68001a] transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Importera fler</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="pb-3 px-3">Prospekt</th>
                  <th className="pb-3 px-3">Bolag & Roll</th>
                  <th className="pb-3 px-3">Hubb</th>
                  <th className="pb-3 px-3">Provnivå</th>
                  <th className="pb-3 px-3">Återstår</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {prospects.map(prospect => {
                  const msLeft = new Date(prospect.trial_ends_at).getTime() - Date.now();
                  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));
                  const isCopied = copiedToken === prospect.onboarding_token;

                  return (
                    <tr key={prospect.id} className="hover:bg-gray-50/60 transition group">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-gray-900">{prospect.full_name}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{prospect.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-medium text-gray-800">{prospect.company_name}</div>
                        <div className="text-[11px] text-gray-500">{prospect.role_title}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-gray-700">{prospect.hub_name}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                          prospect.trial_tier === 'GOLD'
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : prospect.trial_tier === 'SILVER'
                            ? 'bg-slate-100 border-slate-300 text-slate-900'
                            : 'bg-orange-100 border-orange-300 text-orange-900'
                        }`}>
                          {prospect.trial_tier}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${daysLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                          <span className={`font-bold ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                            {daysLeft} dagar kvar
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">Slutar {prospect.trial_ends_at.split('T')[0]}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          prospect.status === 'CONVERTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prospect.status === 'ACTIVE_TRIAL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {prospect.status === 'CONVERTED' ? 'Konverterad' : prospect.status === 'ACTIVE_TRIAL' ? 'Aktiv provperiod' : 'Inbjuden'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy link */}
                          <button
                            type="button"
                            onClick={() => handleCopyOnboardingLink(prospect)}
                            title="Kopiera onboarding-länk för prospektet"
                            className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                              isCopied
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-gray-200 hover:border-[#800020] text-gray-700'
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                            <span className="hidden sm:inline">{isCopied ? 'Kopierad' : 'Länk'}</span>
                          </button>

                          {/* Extend trial */}
                          <button
                            type="button"
                            onClick={() => handleExtendTrial(prospect.id, 14)}
                            title="Förläng provperiod (+14 dagar)"
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Convert to Member */}
                          {prospect.status !== 'CONVERTED' && (
                            <button
                              type="button"
                              onClick={() => handleConvertToMember(prospect)}
                              title="Konvertera till aktiv betalande medlem"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold transition"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProspect(prospect.id)}
                            title="Ta bort prospekt"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: BROADCAST CAMPAIGN (RPC send_broadcast) */}
      {activeSubView === 'broadcast' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-bold">
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Engine • RPC send_broadcast</span>
            </div>
            <h3 className="text-lg font-black text-gray-900 font-display">
              Skicka In-App utskick till Prospekts, Medlemmar eller Alla
            </h3>
            <p className="text-xs text-gray-500">
              Utskicket skickas och distribueras i realtid via Supabase Database Function (<code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">send_broadcast</code>).
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            {/* Audience selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Målgrupp för utskick
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'PROSPECTS', label: 'Prospekts & Trials', desc: 'Bara potentiella medlemmar' },
                  { key: 'MEMBERS', label: 'Aktiva Medlemmar', desc: 'Brons, Silver & Guld' },
                  { key: 'ALL', label: 'Alla Användare', desc: 'Hela nätverket' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setBroadcastAudience(item.key as any)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      broadcastAudience === item.key
                        ? 'border-[#800020] bg-rose-50/50 text-[#800020] shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs font-black">{item.label}</span>
                    <span className="text-[10px] text-gray-500 mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Rubrik på meddelandet
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="T.ex. Exklusiv inbjudan till nästa veckas Founder Afterwork!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#800020] outline-hidden"
              />
            </div>

            {/* Campaign body */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Meddelandetext (Brödtext)
              </label>
              <textarea
                rows={5}
                required
                value={broadcastBody}
                onChange={e => setBroadcastBody(e.target.value)}
                placeholder="Skriv informationen som ska visas som en in-app push och notifiering..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#800020] outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                <span>Kanal: IN_APP notifiering & feed banner</span>
              </div>

              <button
                type="submit"
                disabled={isSendingBroadcast}
                className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSendingBroadcast ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Skickar via RPC...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Skicka Utskick Direkt</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </AdminInspect>
  );
};
