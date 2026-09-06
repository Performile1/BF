import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Palette, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Server,
  FileCode
} from 'lucide-react';
import { POSTGRESQL_SCHEMA_SQL } from '../../data/initialData';
import { POSTGRESQL_V6_V7_SCHEMA_SQL } from '../../data/calendarAndCoworkingData';
import { Member, Webinar, ChatChannel } from '../../types';

interface SpecAndSchemaModuleProps {
  members: Member[];
  webinars: Webinar[];
  channels: ChatChannel[];
}

export const SpecAndSchemaModule: React.FC<SpecAndSchemaModuleProps> = ({
  members = [],
  webinars = [],
  channels = []
}) => {
  const [activeTab, setActiveTab] = useState<'SCHEMA' | 'API' | 'PALETTE'>('SCHEMA');
  const [schemaVersion, setSchemaVersion] = useState<'ALL' | 'BASE' | 'V6_V7'>('ALL');
  const [copiedSql, setCopiedSql] = useState(false);
  
  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET_WEBINARS');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiStatusCode, setApiStatusCode] = useState<number | null>(null);

  const handleCopySql = () => {
    navigator.clipboard?.writeText(POSTGRESQL_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExecuteApi = () => {
    setApiLoading(true);
    setTimeout(() => {
      if (selectedEndpoint === 'GET_WEBINARS') {
        setApiStatusCode(200);
        setApiResponse({
          status: 'success',
          count: webinars.length,
          data: webinars.map(w => ({
            id: w.id,
            title: w.title,
            host: w.host_name,
            level_required: w.required_membership_level,
            is_live: w.is_live,
            start_time: w.start_time
          }))
        });
      } else if (selectedEndpoint === 'POST_REGISTER') {
        setApiStatusCode(200);
        setApiResponse({
          status: 'success',
          message: 'Member successfully registered to webinar',
          webinar_id: webinars[0]?.id || 'web_live_sales',
          calendar_sync_url: 'https://boosterfriends.se/api/v1/calendar/event.ics',
          seat_status: 'CONFIRMED'
        });
      } else if (selectedEndpoint === 'POST_CHANNEL') {
        setApiStatusCode(201);
        setApiResponse({
          status: 'created',
          channel_id: 'chan_' + Math.random().toString(36).substring(7),
          channel_type: 'GROUP',
          title: 'Intromatchning: Marcus & Sofia',
          created_at: new Date().toISOString()
        });
      } else if (selectedEndpoint === 'POST_MESSAGE') {
        setApiStatusCode(201);
        setApiResponse({
          status: 'created',
          message_id: 'msg_' + Math.random().toString(36).substring(7),
          sender_id: 'usr_johan_lindberg',
          delivered: true,
          read_receipt_enabled: true
        });
      } else if (selectedEndpoint === 'POST_PIPELINE_DEAL') {
        setApiStatusCode(201);
        setApiResponse({
          status: 'created',
          deal_id: 'deal_9941',
          title: 'SaaS Expansion & Cloud Security',
          stage: 'closed_won',
          value_sek: 850000,
          gamification_event: {
            points_awarded: 100,
            recipient_id: 'usr_johan_lindberg',
            activity_type: 'DEAL_WON',
            audit_log_id: 'log_audit_981'
          }
        });
      } else if (selectedEndpoint === 'GET_HUB_BATTLE') {
        setApiStatusCode(200);
        setApiResponse({
          season: 'September 2026',
          days_remaining: 18,
          current_leader: 'Hubb Stockholm City',
          standings: [
            { rank: 1, hub_name: 'Hubb Stockholm City', avg_bp_per_member: 745, total_points: 105790 },
            { rank: 2, hub_name: 'Hubb Göteborg Avenyn', avg_bp_per_member: 692, total_points: 65740 },
            { rank: 3, hub_name: 'Hubb Malmö Dockan', avg_bp_per_member: 620, total_points: 44640 }
          ]
        });
      } else if (selectedEndpoint === 'POST_VERIFY_CERT') {
        setApiStatusCode(200);
        setApiResponse({
          valid: true,
          certificate_code: 'BF-CERT-2026-9842',
          member_name: 'Johan Lindberg',
          course_title: 'Mastering Enterprise B2B Sales & Closing',
          issued_date: '2026-09-02',
          issuer: 'Booster Friends Executive Academy',
          grade: '96% (Distinction)',
          qr_signature_verified: true
        });
      } else if (selectedEndpoint === 'GET_CALENDAR_EVENTS') {
        setApiStatusCode(200);
        setApiResponse({
          status: 'success',
          category_filters: ['HUB_MEETUP', 'WEBINAR', 'COWORKING_DAY', 'WORKSHOP'],
          sync_ics_url: 'https://boosterfriends.se/api/v1/calendar/feed.ics',
          events_count: 8,
          next_event: {
            id: 'ev_sthlm_breakfast',
            title: 'Exekutiv Frukost & B2B Matchmaking',
            hub: 'Hubb Stockholm City',
            date: '10 Sep 2026',
            attendees_count: 14,
            category: 'HUB_MEETUP'
          }
        });
      } else if (selectedEndpoint === 'GET_HUB_FLEX_STATUS') {
        setApiStatusCode(200);
        setApiResponse({
          hub_id: 'hub_gbg',
          hub_name: 'Hubb Göteborg Avenyn',
          total_flex_desks: 20,
          occupied_today: 8,
          available_today: 12,
          checked_in_members_count: 5,
          prebooked_members_count: 3,
          skills_present_now: ['SEO & Ads', 'E-commerce', 'SaaS Law', 'Tech Due Diligence']
        });
      } else if (selectedEndpoint === 'POST_BOOK_FLEX') {
        setApiStatusCode(201);
        setApiResponse({
          booking_id: 'bk_' + Math.random().toString(36).substring(7),
          hub_name: 'Convendum Kungsportsavenyen (Partner Hub)',
          slot_type: 'FULL_DAY',
          booking_date: '2026-09-12',
          status: 'CONFIRMED',
          credit_deducted: 1,
          remaining_credits: 4,
          qr_checkin_token: 'GEO_QR_CONV_9281'
        });
      } else if (selectedEndpoint === 'POST_DESK_SWAP') {
        setApiStatusCode(201);
        setApiResponse({
          swap_id: 'swap_' + Math.random().toString(36).substring(7),
          lender: 'Johan Lindberg',
          available_date: '2026-09-14',
          desk_label: 'Fast Plats #14 (Skrivbord + Dubbla Skärmar)',
          status: 'AVAILABLE',
          gamification_event: {
            points_awarded: 25,
            activity_type: 'DESK_SWAP_LENT',
            reason: 'Bidrog till nätverkets resurseffektivitet (+25 BP)'
          }
        });
      } else if (selectedEndpoint === 'POST_PROMOS_VALIDATE') {
        setApiStatusCode(200);
        setApiResponse({
          valid: true,
          code: 'SILVER20',
          discount_type: 'PERCENTAGE',
          discount_value: 20,
          applies_to: 'Silver Medlemskap',
          savings_sek: 598,
          description: '20% rabatt på Silver-medlemskap första 3 månaderna'
        });
      } else if (selectedEndpoint === 'POST_TRIALS_CLAIM') {
        setApiStatusCode(201);
        setApiResponse({
          pass_code: 'TRIAL-2026-' + Math.floor(1000 + Math.random() * 9000),
          guest_name: 'Karin Söderberg',
          status: 'ACTIVE',
          included: ['1 dag valfri hubb / partner-coworking', '1 fysisk frukostträff'],
          referral_bonus_pending: 'Bjudande medlem tilldelas +50 BP vid genomförd incheckning'
        });
      }
      setApiLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Master Kravspecifikation, Databas & API V3
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#800020] text-white">
              Systemarkitektur
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Teknisk dokumentation, komplett PostgreSQL/Supabase schema och levande REST API-konsol för vidareutveckling.
          </p>
        </div>

        <div className="flex bg-[#F4F5F7] p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('SCHEMA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'SCHEMA' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('API')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'API' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            REST API Explorer
          </button>
          <button
            onClick={() => setActiveTab('PALETTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'PALETTE' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Designsystem Palett
          </button>
        </div>
      </div>

      {/* View 1: PostgreSQL Schema */}
      {activeTab === 'SCHEMA' && (
        <div className="space-y-6">
          <div className="bg-gray-950 text-gray-100 rounded-3xl p-6 border border-gray-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <FileCode className="w-4 h-4 text-[#800020]" />
                <span>PostgreSQL / Supabase Schema V6 & V7 (Master DDL)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-[11px]">
                  <button
                    onClick={() => setSchemaVersion('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      schemaVersion === 'ALL' ? 'bg-[#800020] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Full Unified (V1-V7)
                  </button>
                  <button
                    onClick={() => setSchemaVersion('V6_V7')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      schemaVersion === 'V6_V7' ? 'bg-[#800020] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    V6/V7 Coworking & Promos
                  </button>
                  <button
                    onClick={() => setSchemaVersion('BASE')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      schemaVersion === 'BASE' ? 'bg-[#800020] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Base Schema (V1-V5)
                  </button>
                </div>

                <button
                  onClick={() => {
                    const sqlToCopy = schemaVersion === 'V6_V7' 
                      ? POSTGRESQL_V6_V7_SCHEMA_SQL 
                      : schemaVersion === 'BASE' 
                        ? POSTGRESQL_SCHEMA_SQL 
                        : `${POSTGRESQL_SCHEMA_SQL}\n\n-- ==========================================\n-- V6 & V7 EXPANSION (Coworking, Desk Swap & Promos)\n-- ==========================================\n${POSTGRESQL_V6_V7_SCHEMA_SQL}`;
                    navigator.clipboard?.writeText(sqlToCopy);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition border border-gray-700 shrink-0"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Kopierad SQL!' : 'Kopiera Schema'}</span>
                </button>
              </div>
            </div>

            <pre className="text-xs font-mono overflow-x-auto text-emerald-400 leading-relaxed max-h-[460px]">
              {schemaVersion === 'V6_V7' 
                ? POSTGRESQL_V6_V7_SCHEMA_SQL 
                : schemaVersion === 'BASE' 
                  ? POSTGRESQL_SCHEMA_SQL 
                  : `${POSTGRESQL_SCHEMA_SQL}\n\n-- ==========================================\n-- V6 & V7 EXPANSION (Coworking, Desk Swap & Promos)\n-- ==========================================\n${POSTGRESQL_V6_V7_SCHEMA_SQL}`}
            </pre>
          </div>

          {/* Database Entities Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { name: 'members', cols: 'id, full_name, email, phone, company_name, membership_level, booster_score, hub_id', rows: members.length },
              { name: 'hubs (V6)', cols: 'id, name, address, total_flex_desks, hub_lead_member_id, wifi_ssid, wifi_password', rows: '3 Egna Hubbar' },
              { name: 'partner_coworking (V7)', cols: 'id, name, address, daily_desk_allocation, policy_allow_desk_swap, brand_tier', rows: '4 Partners' },
              { name: 'flex_desk_bookings (V6)', cols: 'id, hub_id, member_id, booking_date, slot_type, is_checked_in, check_in_time', rows: 'Realtidsradar' },
              { name: 'desk_swaps (V7)', cols: 'id, lender_member_id, location_id, available_date, status, borrower_member_id (+25 BP)', rows: 'P2P Platser' },
              { name: 'promo_codes (V7)', cols: 'id, code, discount_type, discount_value, valid_until, max_uses, current_uses', rows: 'Kampanjer' },
              { name: 'free_trial_passes (V7)', cols: 'id, guest_name, guest_email, invited_by_member_id, status, code (+50 BP)', rows: 'Prova-på-pass' },
              { name: 'member_credits (V6)', cols: 'id, member_id, included_monthly_quota, purchased_extra_credits', rows: 'Kvoter & Saldo' },
              { name: 'pipeline_deals (V4)', cols: 'id, member_id, deal_title, client_company, estimated_value, stage, probability, due_date', rows: 'Aktiv Pipeline' },
              { name: 'booster_score_logs (V4)', cols: 'id, member_id, points_awarded, activity_type, title, reference_id, created_at', rows: 'Audit Trail' },
              { name: 'courses (V5)', cols: 'id, title, category, level_required, booster_pack_price_sek, duration_hours, instructor_id', rows: 'Katalog' },
              { name: 'certificates (V5)', cols: 'id, certificate_code, member_id, course_id, score_percent, verification_url', rows: 'QR Verifierad' },
            ].map(table => (
              <div key={table.name} className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#800020]">TABLE {table.name}</span>
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {table.rows}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono line-clamp-2">
                  {table.cols}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: REST API Explorer */}
      {activeTab === 'API' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 font-display">
              Interaktiv REST API Testbänk (V4 & V5 Moduler)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Kör riktiga API-anrop direkt mot de definierade ändpunkterna i masterkravspecifikationen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Endpoint Selector & Request Config */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-700">Välj API-ändpunkt:</label>
              
              <div className="space-y-2">
                {[
                  { id: 'POST_PIPELINE_DEAL', method: 'POST', path: '/api/v1/pipeline/deals', desc: 'Registrerar/uppdaterar affär i My Booster Pipeline (+100 BP vid WON)' },
                  { id: 'GET_CALENDAR_EVENTS', method: 'GET', path: '/api/v1/calendar/events', desc: 'V6: Hämtar Masterkalendern (hubbträffar, webinars, workshops) med ICS-synk' },
                  { id: 'GET_HUB_FLEX_STATUS', method: 'GET', path: '/api/v1/hubs/{id}/flex-status', desc: 'V6: Live flex-kapacitet och "Vem är på plats?" med kompetenstags' },
                  { id: 'POST_BOOK_FLEX', method: 'POST', path: '/api/v1/hubs/book-flex-desk', desc: 'V6/V7: Boka flexplats på egen hubb eller anslutet partnerkontor' },
                  { id: 'POST_DESK_SWAP', method: 'POST', path: '/api/v1/desk-swap/lend', desc: 'V7: Låna ut fast/flexplats när man jobbar hemifrån (+25 BP)' },
                  { id: 'POST_PROMOS_VALIDATE', method: 'POST', path: '/api/v1/promos/validate', desc: 'V7: Validera rabattkod (procent, belopp, fria extradagar)' },
                  { id: 'POST_TRIALS_CLAIM', method: 'POST', path: '/api/v1/trials/claim-pass', desc: 'V7: Aktivera digitalt 1-dagars prova-på-pass för gäster (+50 BP referral)' },
                  { id: 'GET_HUB_BATTLE', method: 'GET', path: '/api/v1/gamification/hub-battle', desc: 'Hämtar aktuell ställning i Månadens Hubb (snittpoäng per medlem)' },
                  { id: 'POST_VERIFY_CERT', method: 'GET', path: '/api/v1/academy/certificates/{code}/verify', desc: 'Publik QR-verifiering av examensdiplom med betyg & signatur' },
                  { id: 'GET_WEBINARS', method: 'GET', path: '/api/v1/webinars', desc: 'Hämtar kommande och inspelade webinars' },
                  { id: 'POST_REGISTER', method: 'POST', path: '/api/v1/webinars/{id}/register', desc: 'Anmäler medlem till webinar & ger kalenderlänk' },
                  { id: 'POST_CHANNEL', method: 'POST', path: '/api/v1/chat/channels', desc: 'Skapar en ny direct- eller gruppchattkanal' },
                  { id: 'POST_MESSAGE', method: 'POST', path: '/api/v1/chat/messages', desc: 'Skickar ett chattmeddelande med bilaga' }
                ].map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpoint(ep.id);
                      setApiResponse(null);
                      setApiStatusCode(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      selectedEndpoint === ep.id
                        ? 'bg-[#800020]/5 border-[#800020] shadow-xs'
                        : 'border-gray-200 hover:bg-[#F4F5F7]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-900">{ep.path}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{ep.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              <button
                onClick={handleExecuteApi}
                disabled={apiLoading}
                className="w-full py-3 rounded-2xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                id="btn-execute-api"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{apiLoading ? 'Kör anrop...' : 'Testa & Kör API-anrop'}</span>
              </button>
            </div>

            {/* Right: Live JSON Response View */}
            <div className="bg-gray-950 rounded-2xl p-4 border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-xs">
                  <span className="font-mono text-gray-400">Response Inspector</span>
                  {apiStatusCode && (
                    <span className="font-mono font-bold text-emerald-400">
                      HTTP {apiStatusCode} OK (24ms)
                    </span>
                  )}
                </div>

                <div className="pt-3 font-mono text-xs text-emerald-400 max-h-[380px] overflow-y-auto">
                  {apiResponse ? (
                    <pre className="leading-relaxed">{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-500 italic py-12 text-center">
                      Klicka på "Testa & Kör API-anrop" för att inspektera svaret.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 text-[10px] text-gray-500 font-mono flex items-center justify-between">
                <span>Authorization: Bearer booster_session_token_jwt</span>
                <span>Content-Type: application/json</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* View 3: Design System Palette */}
      {activeTab === 'PALETTE' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#800020]" />
              <span>Visuell Profil & Designsystem (AI Studios Palette)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Strikt implementerad färgskala baserad på Vit, Grå och Maroon (#800020).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Maroon (Primär / Accent)', hex: '#800020', role: 'Knappar (CTA), badges, aktiva flikar, höjdpunktselement, Guldmedlems-ikoner.', textWhite: true },
              { name: 'Mörk Maroon (Hover/Press)', hex: '#580016', role: 'Interaktiva tillstånd på knappar och länkar.', textWhite: true },
              { name: 'Vit (Bakgrund / Kassetter)', hex: '#FFFFFF', role: 'Huvudbakgrund, kortkomponenter, innehållsytor för hög läsbarhet.', border: true },
              { name: 'Ljusgrå (Surface)', hex: '#F4F5F7', role: 'Sektionsbakgrunder, kortkanter, inmatningsfält, sekundära knappar.' },
              { name: 'Koksgrå (Text / Ikoner)', hex: '#1F2937', role: 'Brödtext, rubriker, högkontrastikoner för god tillgänglighet.', textWhite: true }
            ].map(col => (
              <div key={col.hex} className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div
                  className={`h-24 p-3 flex flex-col justify-between ${col.border ? 'border-b border-gray-200' : ''}`}
                  style={{ backgroundColor: col.hex }}
                >
                  <span className={`text-[11px] font-mono font-bold ${col.textWhite ? 'text-white' : 'text-gray-900'}`}>
                    {col.hex}
                  </span>
                </div>
                <div className="p-3 bg-white space-y-1">
                  <div className="font-bold text-xs text-gray-900">{col.name}</div>
                  <p className="text-[10px] text-gray-500 leading-snug">{col.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
