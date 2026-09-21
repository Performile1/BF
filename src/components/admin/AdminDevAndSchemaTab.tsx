import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Play, 
  Code2, 
  Shield, 
  Activity, 
  Layers, 
  Settings, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  Eye,
  Check,
  Zap,
  Table,
  Sliders,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useInspector } from '../dev/InspectorContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AdminInspect } from '../dev/AdminInspect';
import { CompactMemberCard } from '../profile/CompactMemberCard';
import { supabase } from '../../lib/supabaseClient';
import { getSystemSettings, updateSystemSettings } from '../../lib/widgetServices';
import { SystemSettings } from '../../types/widgets';

export const AdminDevAndSchemaTab: React.FC = () => {
  const { inspectorEnabled, setInspectorEnabled, toggleInspector } = useInspector();
  const { currentUser } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'info' | 'error'>('info');

  // Maintenance Mode State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenance_mode: false,
    maintenance_message: 'Vi uppdaterar just nu Booster Friends med nya nätverksfunktioner. Vi beräknas vara tillbaka inom kort!',
    estimated_maintenance_end: null
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const s = await getSystemSettings();
      setSystemSettings(s);
    }
    loadSettings();
  }, []);

  const handleToggleMaintenance = async () => {
    try {
      setSavingSettings(true);
      const nextVal = !systemSettings.maintenance_mode;
      await updateSystemSettings({ maintenance_mode: nextVal });
      setSystemSettings(prev => ({ ...prev, maintenance_mode: nextVal }));
      setStatusMessage(nextVal ? '⚠️ Underhållsläge (Maintenance Mode) aktiverat för alla medlemmar.' : '✅ Underhållsläge inaktiverat. Plattformen är öppen.');
      setStatusType(nextVal ? 'info' : 'success');
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setStatusMessage('Kunde inte ändra underhållsläge: ' + (err?.message || 'Ett fel uppstod'));
      setStatusType('error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSeedMock = async () => {
    const targetUserId = currentUser?.id || 'usr_rickard_wigrund';
    setLoading(true);
    setStatusMessage('Exekverar seed_demo_data() i produktionsdatabasen...');
    setStatusType('info');

    try {
      // 1. Försök anropa SQL RPC
      const { data, error: rpcErr } = await supabase.rpc('seed_demo_data', {
        p_target_user_id: targetUserId,
      });

      if (rpcErr) {
        console.warn('RPC seed_demo_data ej registrerad i SQL, kör resilient insert-fallback:', rpcErr.message);
        
        // 2. Resilient frontend fallback: Rensa befintlig demo först
        await supabase.from('community_posts').delete().eq('author_id', targetUserId).eq('is_demo', true);
        await supabase.from('crm_pipeline_deals').delete().eq('owner_member_id', targetUserId).eq('is_demo', true);

        // Skapa demo-inlägg för Community
        const posts = [
          {
            author_id: targetUserId,
            post_type: 'POST',
            category: 'Allmänt',
            title: 'Snabb fråga kring tullregler och 3PL',
            content: 'Någon i hubben som har erfarenhet av automatiserad tulldeklaration via API för e-handelsförsändelser till Norge? Tar gärna en kaffe och bollar tankar i loungen idag!',
            read_time_min: 1,
            is_demo: true,
          },
          {
            author_id: targetUserId,
            post_type: 'ARTICLE',
            category: 'Logistik',
            title: '3 strategier för att sänka fraktkostnader och höja konverteringen 2026',
            content: 'Fraktalternativ i kassan är inte längre bara en logistikfråga – det är ett av dina starkaste verktyg för konverteringsoptimering...',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
            read_time_min: 4,
            is_demo: true,
          },
        ];

        // Skapa demo-deals för CRM
        const deals = [
          {
            owner_member_id: targetUserId,
            client_company: 'Nordic Retail AB',
            value_sek: 250000,
            contact_person: 'Anna Lindqvist',
            stage: 'proposal',
            next_step: 'Skicka offert och prissättning',
            due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            probability: 70,
            is_demo: true,
          },
          {
            owner_member_id: targetUserId,
            client_company: 'Svea Logistik Hub',
            value_sek: 120000,
            contact_person: 'Marcus Berg',
            stage: 'meeting_done',
            next_step: 'Boka uppföljning och demo',
            due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            probability: 50,
            is_demo: true,
          },
        ];

        await supabase.from('community_posts').insert(posts);
        await supabase.from('crm_pipeline_deals').insert(deals);
      }

      setStatusMessage('✓ Mock-data laddad i databasen (community_posts & crm_pipeline_deals med is_demo = true)');
      setStatusType('success');
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err: any) {
      setStatusMessage('Kunde inte lägga till mockdata: ' + err.message);
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePurgeMock = async () => {
    const targetUserId = currentUser?.id || 'usr_rickard_wigrund';
    setLoading(true);
    setStatusMessage('Exekverar purge_demo_data()...');
    setStatusType('info');

    try {
      const { error: rpcErr } = await supabase.rpc('purge_demo_data', {
        p_target_user_id: targetUserId,
      });

      if (rpcErr) {
        console.warn('RPC purge_demo_data ej registrerad i SQL, kör resilient delete-fallback:', rpcErr.message);
        await supabase.from('community_posts').delete().eq('author_id', targetUserId).eq('is_demo', true);
        await supabase.from('crm_pipeline_deals').delete().eq('owner_member_id', targetUserId).eq('is_demo', true);
      }

      setStatusMessage('✓ All mockdata (is_demo = true) har rensats ur databasen.');
      setStatusType('success');
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setStatusMessage('Kunde inte rensa mockdata: ' + err.message);
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Övergripande rubrik och syfte */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-inner">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white">
                  Dev HUD, Databasinspektor & Systeminställningar
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-gray-950 uppercase tracking-wide">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Central styrpanel för utvecklingsverktyg, schemavalidering, mock-data och systemomfattande driftlägen.
              </p>
            </div>
          </div>

          {/* Quick status badges */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold ${
              inspectorEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${inspectorEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
              <span>Inspector: {inspectorEnabled ? 'AKTIV' : 'AV'}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-bold ${
              systemSettings.maintenance_mode ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${systemSettings.maintenance_mode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
              <span>Driftläge: {systemSettings.maintenance_mode ? 'UNDERHÅLL' : 'NORMAL'}</span>
            </div>
          </div>
        </div>

        {/* Global status message feedback */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in ${
            statusType === 'success' ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200' :
            statusType === 'error' ? 'bg-rose-950/80 border border-rose-700/60 text-rose-200' :
            'bg-blue-950/80 border border-blue-700/60 text-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="p-1 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* SEKTION 1: KONTROLLPANEL – DEV HUD & INSPECTOR KNAPPAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Kontroll 1: Hover Inspector Switch */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inspektionsläge</span>
              <span className={`w-2.5 h-2.5 rounded-full ${inspectorEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#800020]" />
              Hover Inspector
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              När detta läge är aktivt markeras alla omslutna frontend-komponenter med en bärnstensfärgad ram vid hover, och visar databastabell, kolumner och triggers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setInspectorEnabled(!inspectorEnabled)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              inspectorEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {inspectorEnabled ? (
              <>
                <Check className="w-4 h-4" />
                <span>Hover Inspector: PÅ</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-gray-400" />
                <span>Hover Inspector: AV (Klicka för att aktivera)</span>
              </>
            )}
          </button>
        </div>

        {/* Kontroll 2: Ladda Mock-data */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mock Data Engine</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                seed_demo_data
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              Ladda Mock-data
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Genererar verifierade exempelrader i <code className="text-gray-800 font-mono text-[11px]">community_posts</code> och <code className="text-gray-800 font-mono text-[11px]">crm_pipeline_deals</code> taggade med <code className="text-blue-700 font-bold">is_demo = true</code>.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleSeedMock}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Ladda Mock-data</span>
          </button>
        </div>

        {/* Kontroll 3: Rensa Mock-data */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Isolering & Rensa</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                purge_demo_data
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              Rensa Mock-data
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Raderar omedelbart alla poster med <code className="text-rose-700 font-bold">is_demo = true</code> från databasen så att endast skarpa produktionsdata kvarstår.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handlePurgeMock}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Rensa Mock-data</span>
          </button>
        </div>

      </div>

      {/* SEKTION 2: FLER SYSTEMINSTÄLLNINGAR (Underhållsläge, Widgets, RPC) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-700" />
              Ytterligare Systeminställningar & Driftläge
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Inställningar sparade i <code className="font-mono text-gray-800">public.system_settings</code> som påverkar hela plattformen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Driftläge / Maintenance Mode */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${systemSettings.maintenance_mode ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className="text-sm font-bold text-gray-900">Systemunderhåll (Maintenance Mode)</span>
              </div>
              <button
                type="button"
                disabled={savingSettings}
                onClick={handleToggleMaintenance}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  systemSettings.maintenance_mode
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {systemSettings.maintenance_mode ? 'AKTIVERAT' : 'AVSTÄNGT'}
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              När underhållsläget är aktivt låses alla vyer för vanliga medlemmar via <code className="font-mono text-[11px] text-gray-800">MaintenanceGate</code>, medan Super Admin och administratörer behåller full tillgång.
            </p>
            <div className="text-[11px] text-gray-500 bg-white p-3 rounded-xl border border-gray-200">
              <strong>Aktivt meddelande:</strong> {systemSettings.maintenance_message}
            </div>
          </div>

          {/* Widget-standarder & Bento-layout */}
          <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-bold text-gray-900">Dashboard & Bento Widgets</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                public.user_dashboard_widgets
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Medlemmar kan anpassa sin översiktssida. Standardwidgetar som bootstrappas för nya konton:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin KPI Stats</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Flex Booking & Coworking</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hub Presence (Incheckad)</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-gray-200 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Booster Score Mätare</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SEKTION 3: INTERAKTIV SANDBOX – TESTA HOVER INSPECTOR HÄR */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Live Förhandsgranskning & Inspector Sandbox
            </h3>
            <p className="text-xs text-gray-500">
              Hovra muspekaren över kortet nedan för att se exakt hur metadatabadgen och ramen ser ut.
            </p>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {inspectorEnabled ? '✓ Inspektorn är igång' : '⚠️ Slå på inspektorn ovan för att testa'}
          </span>
        </div>

        <div className="max-w-md mx-auto py-2">
          <AdminInspect
            component="CompactMemberCard.tsx"
            sourceTable="public.profiles"
            columns={['full_name', 'role_title', 'company_name', 'membership_level', 'booster_score', 'avatar_url', 'city']}
            notes="1:1 med auth.users.id. Account status = ACTIVE. Live demo i Adminpanelen."
          >
            <CompactMemberCard profile={currentUser} />
          </AdminInspect>
        </div>
      </div>

      {/* SEKTION 4: DEN VERIFIERADE DATABASSANNINGEN (SCHEMA-FACIT) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#800020]" />
              Den Verifierade Databassanningen (Facit & Schema)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Samtliga frontend-moduler är strikt mappade mot följande verifierade tabeller och triggers i Supabase.
            </p>
          </div>
          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
            PostgreSQL • Supabase
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tabell 1: public.profiles */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-indigo-600" />
                public.profiles
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                1:1 auth.users
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Kolumner:</strong> <code className="font-mono text-[11px]">id, full_name, role_title, company_name, membership_level, booster_score, avatar_url, city, offering_tags (text[]), seeking_tags (text[]), rating_avg, reviews_count</code></div>
              <div className="text-[11px] text-gray-500"><strong>Regler:</strong> account_status = 'ACTIVE'. Primär profil för medlemskort och expertistaggar.</div>
            </div>
          </div>

          {/* Tabell 2: public.crm_pipeline_deals */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-600" />
                public.crm_pipeline_deals
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Trigger: +100 BP
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Kolumner:</strong> <code className="font-mono text-[11px]">owner_member_id, client_company, value_sek, contact_person, stage, next_step, due_date, probability, points_awarded, is_demo</code></div>
              <div className="text-[11px] text-gray-500"><strong>Faser:</strong> 'lead', 'intro_sent', 'meeting_done', 'proposal', 'closed_won'. Vid 'closed_won' aktiveras trigger_booster_points_deal.</div>
            </div>
          </div>

          {/* Tabell 3: public.community_posts */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-amber-600" />
                public.community_posts
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                POST & ARTICLE
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Kolumner:</strong> <code className="font-mono text-[11px]">author_id, post_type, category, title, content, image_url, read_time_min, upvotes_count, is_demo</code></div>
              <div className="text-[11px] text-gray-500"><strong>Regler:</strong> category och title är NOT NULL. read_time_min beräknas automatiskt.</div>
            </div>
          </div>

          {/* Tabell 4: public.invoices & RPC */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-purple-600" />
                public.invoices & RPC
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                get_admin_dashboard_kpis()
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Invoices:</strong> <code className="font-mono text-[11px]">member_id, invoice_number, amount_sek, total_with_vat_sek, status, due_date</code></div>
              <div className="text-[11px] text-gray-500"><strong>RPC:</strong> get_admin_dashboard_kpis() aggregerar live KPIer för medlemmar, deals och MRR.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
