import React, { useState, useEffect } from 'react';
import { Building2, Users, ArrowUpRight, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { WidgetComponentProps, HubPresenceMember } from '../../../types/widgets';
import { getHubPresenceMembers } from '../../../lib/widgetServices';

export const HubPresenceWidget: React.FC<WidgetComponentProps> = ({
  currentUser,
  selectedHub,
  onNavigateTab,
  onOpenDirectChat
}) => {
  const [members, setMembers] = useState<HubPresenceMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const data = await getHubPresenceMembers(selectedHub?.id);
      if (isMounted) {
        setMembers(data);
        setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [selectedHub?.id]);

  const hubTitle = selectedHub?.name || 'Central Hubb Göteborg';

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">I Hubben Idag</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[10px] text-gray-500">{hubTitle}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-700">
            {members.length} på plats
          </span>
        </div>

        {/* Member list */}
        {loading ? (
          <div className="py-6 text-center text-xs text-gray-400">Laddar närvaro...</div>
        ) : members.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">Inga incheckade medlemmar just nu.</div>
        ) : (
          <div className="space-y-2.5">
            {members.slice(0, 4).map(m => (
              <div
                key={m.booking_id}
                className="p-2.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={m.full_name}
                      className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900 truncate">{m.full_name}</p>
                      {m.membership_level === 'GOLD' && (
                        <span className="text-[8px] font-black px-1 rounded bg-amber-100 text-amber-900">
                          GULD
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">
                      {m.company_name} • <span className="text-gray-400">{m.role_title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono text-gray-400 mr-1 hidden sm:inline">
                    {m.check_in_time}
                  </span>
                  {onOpenDirectChat && m.member_id !== currentUser.id && (
                    <button
                      onClick={() => onOpenDirectChat(m.member_id)}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#800020] hover:border-[#800020] transition shadow-2xs cursor-pointer"
                      title="Skicka meddelande"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          Realtidssynk via hubb-gateways
        </span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('coworking')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
        >
          Visa alla på plats
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
