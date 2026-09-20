import React, { useState } from 'react';
import { Coffee, MapPin, Send, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';

export const ProximityRadarWidget: React.FC<WidgetComponentProps> = ({
  currentUser,
  allMembers = [],
  onOpenDirectChat
}) => {
  const [pingSent, setPingSent] = useState(false);

  const nearbyMembers = (allMembers.length > 0 ? allMembers : [
    { id: '1', full_name: 'Sofia Lindqvist', company_name: 'Nordic Growth Capital', role_title: 'Partner', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', city: 'Göteborg' },
    { id: '2', full_name: 'Marcus Ekström', company_name: 'Ekström Advokat', role_title: 'Affärsjurist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', city: 'Göteborg' },
  ]).filter(m => m.id !== currentUser.id).slice(0, 3);

  const handleBroadcastPing = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-gray-900 tracking-tight">Närhetsradar & Spontanfika</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[10px] text-gray-500">Medlemmar i närheten redo för möte</p>
            </div>
          </div>
        </div>

        {pingSent ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-900 my-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-amber-700 mx-auto mb-1" />
            <p className="font-bold">Fika-signal sänd!</p>
            <p className="text-[10px] text-amber-800">Närliggande medlemmar har fått en notis.</p>
          </div>
        ) : (
          <div className="space-y-2 my-2">
            {nearbyMembers.map(m => (
              <div key={m.id} className="p-2 rounded-xl bg-gray-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={m.avatar} alt={m.full_name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{m.full_name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{m.company_name}</p>
                  </div>
                </div>
                {onOpenDirectChat && (
                  <button
                    onClick={() => onOpenDirectChat(m.id)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-gray-200 text-gray-700 hover:text-[#800020] hover:border-[#800020] transition"
                  >
                    Bjud in
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#800020]" />
          {currentUser.city || 'Göteborg'}
        </span>
        <button
          onClick={handleBroadcastPing}
          disabled={pingSent}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <Coffee className="w-3.5 h-3.5" />
          Sänd Fika-Signal
        </button>
      </div>
    </div>
  );
};
