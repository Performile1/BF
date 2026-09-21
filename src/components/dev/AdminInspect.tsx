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

export function AdminInspect({
  component,
  sourceTable,
  columns,
  notes,
  className = '',
  children,
}: AdminInspectProps) {
  const { isSuperAdmin } = usePermissions();
  const { inspectorEnabled } = useInspector();
  const [isHovered, setIsHovered] = useState(false);
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
    if (supabaseUrl) {
      projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    }
  } catch {
    // Fallback till känd ref
  }

  // 2. Skapa direktlänk till Table Editor eller Database Functions
  const isRpc = sourceTable.toLowerCase().includes('rpc');
  const cleanTableName = sourceTable.replace(/^public\./, '').trim();

  const supabaseDashboardUrl = isRpc
    ? `https://supabase.com/dashboard/project/${projectRef}/database/functions`
    : `https://supabase.com/dashboard/project/${projectRef}/editor/${cleanTableName}`;

  // 3. Beräkna fast position i viewporten förankrad vid komponentens övre högra hörn
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Säkerställ att popupen ryms inom skärmen
    const top = Math.max(12, Math.min(rect.top + 8, window.innerHeight - 260));
    const left = Math.max(12, Math.min(rect.right - 300, window.innerWidth - 316));
    
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
          <div className="bg-gray-950/95 backdrop-blur-md text-white border border-gray-700 shadow-2xl rounded-2xl p-3.5 text-[11px] font-mono w-72 space-y-2 leading-tight ring-1 ring-white/10">
            
            {/* Header: Elementnamn */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                DB INSPECTOR
              </span>
              <span className="text-gray-200 font-bold text-[10px] bg-gray-800/80 px-2 py-0.5 rounded-md border border-gray-700">
                &lt;{component} /&gt;
              </span>
            </div>

            {/* Tabell & Fält */}
            <div className="space-y-1">
              <div>
                <span className="text-gray-400">Källa: </span>
                <span className="text-emerald-400 font-bold">{sourceTable}</span>
              </div>

              <div>
                <span className="text-gray-400">Kolumner: </span>
                <span className="text-sky-300 break-words">{columns.join(', ')}</span>
              </div>

              {notes && (
                <div className="pt-1 text-gray-400 text-[10px] italic">
                  ℹ {notes}
                </div>
              )}
            </div>

            {/* Klickbar knapp direkt till Supabase Table Editor */}
            <div className="pt-1.5 border-t border-gray-800/80">
              <a
                href={supabaseDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between w-full py-1.5 px-3 bg-[#800020] hover:bg-[#66001a] text-white text-[11px] font-sans font-bold rounded-xl transition shadow-xs group"
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-emerald-400" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {isRpc ? 'Öppna RPC i Supabase' : `Öppna "${cleanTableName}"`}
                </span>
                <span className="text-white/70 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
