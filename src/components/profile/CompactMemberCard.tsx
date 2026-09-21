import React from 'react';
import { AdminInspect } from '../dev/AdminInspect';

export function CompactMemberCard({ profile }: { profile: any }) {
  if (!profile) return null;

  const initials = (profile.full_name || profile.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <AdminInspect
      component="CompactMemberCard.tsx"
      sourceTable="public.profiles"
      columns={['id', 'full_name', 'avatar_url', 'membership_level', 'booster_score', 'company_name', 'role_title', 'city']}
      notes="Kompakt medlemskort med profilbild, status och poäng"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-[#800020] via-[#5c0017] to-gray-900 relative">
          <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/20">
            {profile.membership_level || 'MEMBER'}
          </span>
        </div>

        <div className="px-5 pb-5 pt-0 relative">
          <div className="-mt-8 mb-3 flex items-end justify-between">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-base font-black text-[#800020] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booster Score</div>
              <div className="text-sm font-black text-[#800020]">{profile.booster_score || 100} pts</div>
            </div>
          </div>

          <h2 className="text-sm font-bold text-gray-900">{profile.full_name || 'Medlem'}</h2>
          <p className="text-xs text-gray-500">{profile.role_title || 'Medlem'} • {profile.company_name || 'Företag saknas'}</p>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>{profile.city || 'Göteborg'}</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktiv
            </span>
          </div>
        </div>
      </div>
    </AdminInspect>
  );
}
