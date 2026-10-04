'use client';

import React, { useState, useRef } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useInspector } from './InspectorContext';

export interface AdminInspectProps {
  component: string;
  sourceTable: string;
  columns: string[];
  notes?: string;
  className?: string;
  children: React.ReactNode;
}

// Kända tabeller i supabase/schema.sql
const KNOWN_SCHEMA_TABLES = new Set([
  'profiles',
  'crm_pipeline_deals',
  'community_posts',
  'post_comments',
  'post_upvotes',
  'post_poll_options',
  'post_poll_votes',
  'master_events',
  'event_addons',
  'event_attendees',
  'event_invitations',
  'event_reviews',
  'event_gallery_images',
  'guest_passes',
  'invoices',
  'gift_upgrades',
  'hubs',
  'partner_coworking_locations',
  'coworking_desk_bookings',
  'desk_swaps',
  'member_coworking_credits',
  'community_resources',
  'community_resource_bookings',
  'booster_score_logs',
  'p2p_allowances',
  'p2p_point_transfers',
  'web_meetings',
  'meeting_participants',
  'lunch_invitations',
  'speed_networking_matches',
  'member_active_locations',
  'proximity_pings',
  'user_dashboard_layouts',
  'user_dashboard_widgets',
  'system_activity_ticker_events',
  'ad_placements_config',
  'ad_campaigns',
  'intro_requests',
  'chat_channels',
  'chat_channel_members',
  'chat_messages',
  'member_skills',
  'skill_endorsements',
  'member_merits',
  'member_case_studies',
  'member_follows',
  'totp_security_settings',
  'membership_packages',
  'system_rule_configs',
  'system_settings',
  'v_who_is_at_hub_today',
  'academy_courses',
  'academy_progress',
  'booster_points_ledger',
  'broadcast_campaigns',
  'friendships',
  'referrals',
  'user_notifications',
  'notification_subscriptions',
  'webinars'
]);

export function AdminInspect({
  component,
  sourceTable,
  columns,
  notes,
  className = '',
  children,
}: AdminInspectProps) {
  const { isSuperAdmin } = usePermissions();
  const { inspectorEnabled, cleanSlateMode } = useInspector();
  const [isHovered, setIsHovered] = useState(false);
  const [copiedSql, setCopiedSql] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Om användaren inte är Super Admin eller inspektorn är av: rendera utan overhead
  if (!isSuperAdmin || !inspectorEnabled) {
    return <div className={className}>{children}</div>;
  }

  // 1. Extrahera Supabase Project Reference
  const supabaseUrl = 
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    '';
  let projectRef = 'iezlcellqjolwncxjavb';
  try {
    if (supabaseUrl && !supabaseUrl.includes('mock-project-id') && !supabaseUrl.includes('your-project-id')) {
      projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    }
  } catch {
    // Fallback till känd ref
  }

  // 2. Analysera sourceTable
  const lowerSource = sourceTable.toLowerCase();
  const isPureClientState = 
    lowerSource.includes('client state') || 
    lowerSource.includes('klient-state') || 
    lowerSource.includes('nav') ||
    lowerSource.includes('local state') ||
    lowerSource.includes('openapi spec');

  const isRpc = lowerSource.includes('rpc');

  // Extrahera enskilda tabellnamn eller RPC-namn
  const rawSegments = sourceTable
    .replace(/^mock\s*\/\s*klient-state:\s*/i, '')
    .replace(/^mock\s*\/\s*klient-state\s*/i, '')
    .split(/[\/,]/)
    .map(s => s.trim())
    .filter(Boolean);

  const parsedTables = rawSegments.map(seg => {
    let clean = seg.replace(/^public\./i, '').replace(/^auth\./i, '').replace(/^rpc:\s*/i, '').trim();
    const isTableInSchema = KNOWN_SCHEMA_TABLES.has(clean);
    return {
      raw: seg,
      cleanName: clean,
      inSchema: isTableInSchema,
      isRpcSegment: seg.toLowerCase().includes('rpc') || seg.includes('('),
    };
  });

  const primaryTable = parsedTables.find(t => !t.isRpcSegment)?.cleanName || 'profiles';

  // 3. Korrekta och säkra Supabase Studio-länkar som ALDRIG 404:ar
  // I Supabase Studio är Table Editor: /editor (inte /editor/tabellnamn)
  // Database Tables: /database/tables (visar schema, rader och kolumner)
  // Database Functions: /database/functions (för alla RPC)
  // SQL Editor: /sql/new (öppnar ny SQL-editor)
  const supabaseTableEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/editor`;
  const supabaseDatabaseTablesUrl = `https://supabase.com/dashboard/project/${projectRef}/database/tables`;
  const supabaseFunctionsUrl = `https://supabase.com/dashboard/project/${projectRef}/database/functions`;
  const supabaseSqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

  // SQL-snippet för snabb kopiering
  const sqlQuery = isRpc
    ? `SELECT * FROM public.${primaryTable.replace(/\(\)/, '')}();`
    : `SELECT * FROM public.${primaryTable} ORDER BY created_at DESC LIMIT 25;`;

  const handleCopySql = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(sqlQuery);
      setCopiedSql(primaryTable);
      setTimeout(() => setCopiedSql(null), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // 4. Beräkna fast position i viewporten förankrad vid komponentens övre högra hörn
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Säkerställ att popupen ryms inom skärmen
    const top = Math.max(12, Math.min(rect.top + 8, window.innerHeight - 340));
    const left = Math.max(12, Math.min(rect.right - 320, window.innerWidth - 336));
    
    setPosition({ top, left });
  };

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-150 ${className} ${
        isHovered ? 'outline-2 outline-dashed outline-amber-500/90 -outline-offset-1 rounded-2xl' : ''
      }`}
      onMouseEnter={() => {
        updatePosition();
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        // Förhindra att tooltipen stängs om musen rör sig in i själva popupen
        const related = e.relatedTarget as HTMLElement;
        if (related?.closest?.('.admin-inspect-tooltip')) return;
        setIsHovered(false);
      }}
    >
      {children}

      {/* Förankrad och klickbar Dev HUD */}
      {isHovered && (
        <div
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="admin-inspect-tooltip fixed z-[9999] pointer-events-auto animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="bg-gray-950/95 backdrop-blur-md text-white border border-gray-700/80 shadow-2xl rounded-2xl p-3.5 text-[11px] font-mono w-80 space-y-2.5 leading-tight ring-1 ring-white/10">
            
            {/* Header: Elementnamn & Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                DB INSPECTOR
              </span>
              <span className="text-gray-200 font-bold text-[10px] bg-gray-800/90 px-2 py-0.5 rounded-md border border-gray-700 truncate max-w-[170px]" title={component}>
                &lt;{component} /&gt;
              </span>
            </div>

            {/* Källa och Tabellstatus */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400">Källa:</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  isPureClientState 
                    ? 'bg-sky-950 text-sky-300 border border-sky-800' 
                    : cleanSlateMode 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}>
                  {isPureClientState ? '⚡ Klient-State' : cleanSlateMode ? '🚀 Clean Slate (Live DB)' : '🧪 Mock / Demo'}
                </span>
              </div>

              {/* Parsade Tabelltaggar */}
              <div className="flex flex-wrap gap-1 items-center">
                {isPureClientState ? (
                  <span className="text-gray-300 text-[10px] bg-gray-900 px-2 py-1 rounded-lg border border-gray-800">
                    Lokal React-state (Inget externt databasanrop)
                  </span>
                ) : (
                  parsedTables.map((t, idx) => (
                    <span 
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                        t.inSchema 
                          ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300' 
                          : t.isRpcSegment
                            ? 'bg-amber-950/70 border-amber-800/80 text-amber-300'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.inSchema ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {t.cleanName}
                    </span>
                  ))
                )}
              </div>

              {/* Kolumner */}
              {columns && columns.length > 0 && (
                <div className="pt-1">
                  <span className="text-gray-400 block text-[10px] mb-0.5">Fält / Kolumner:</span>
                  <div className="text-sky-300 break-words text-[10px] max-h-16 overflow-y-auto leading-relaxed bg-black/40 p-1.5 rounded border border-gray-800/60">
                    {columns.join(', ')}
                  </div>
                </div>
              )}

              {notes && (
                <div className="pt-0.5 text-gray-400 text-[10px] italic leading-tight">
                  ℹ {notes}
                </div>
              )}
            </div>

            {/* Snabblänkar & Handlingar */}
            {!isPureClientState && (
              <div className="pt-2 border-t border-gray-800/80 space-y-1.5">
                {/* Primärknapp till Supabase */}
                <a
                  href={isRpc ? supabaseFunctionsUrl : supabaseTableEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between w-full py-1.5 px-3 bg-[#800020] hover:bg-[#66001a] text-white text-[11px] font-sans font-bold rounded-xl transition shadow-xs group"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>{isRpc ? 'Öppna Funktioner i Supabase' : 'Öppna Table Editor'}</span>
                  </span>
                  <span className="text-white/70 group-hover:translate-x-0.5 transition-transform text-[10px]">↗</span>
                </a>

                {/* Sekundära länkar: Databas-schema & Kopiera SQL */}
                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <a
                    href={supabaseDatabaseTablesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-1 py-1 px-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg text-[10px] border border-gray-800 transition"
                  >
                    <span>Tabellschema</span>
                    <span className="text-gray-500 text-[9px]">↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center justify-center gap-1 py-1 px-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg text-[10px] border border-gray-800 transition cursor-pointer"
                    title={sqlQuery}
                  >
                    <span>{copiedSql ? '✓ Kopierad!' : 'Kopiera SQL'}</span>
                  </button>
                </div>
              </div>
            )}

            {isPureClientState && (
              <div className="pt-1.5 border-t border-gray-800/80 text-[10px] text-gray-400 flex items-center justify-between">
                <span>Ref: <code className="text-gray-300">{projectRef}</code></span>
                <span className="text-emerald-400 font-semibold">100% Client Managed</span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
