import React, { useState } from 'react';
import { 
  MapPin, 
  Coffee, 
  Utensils, 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Member, MemberActiveLocation, ProximityPing, Hub } from '../../types';

interface LocationPingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  allMembers: Member[];
  allHubs: Hub[];
  memberLocations: MemberActiveLocation[];
  onSendPing: (ping: {
    receiver_id: string;
    receiver_name: string;
    ping_type: 'COFFEE' | 'LUNCH';
    suggested_location: string;
    custom_message?: string;
  }) => void;
}

export const LocationPingModal: React.FC<LocationPingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allMembers,
  allHubs,
  memberLocations,
  onSendPing
}) => {
  if (!isOpen) return null;

  const [activeCity, setActiveCity] = useState<string>(currentUser.city || 'Mölnlycke');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [pingType, setPingType] = useState<'COFFEE' | 'LUNCH'>('COFFEE');
  const [customMsg, setCustomMsg] = useState('');
  const [selectedHubOrCafe, setSelectedHubOrCafe] = useState('Booster Friends Hubb Mölnlycke (Lounge)');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Package restrictions
  const isBronze = currentUser.membership_level === 'BRONZE';

  const cities = ['Mölnlycke', 'Göteborg C', 'Borås', 'Stockholm Kista', 'Malmö Västra Hamnen'];

  // Partner cafes & hubs per city
  const meetingSpots: Record<string, string[]> = {
    'Mölnlycke': [
      'Booster Friends Hubb Mölnlycke (Lounge)',
      'Restaurang Wendelsberg (Lunch 12:00–13:00)',
      'Kaffestugan Mölnlycke Fabriker'
    ],
    'Göteborg C': [
      'Convendum Göteborg Avenyn (Partnerhubb)',
      'Da Matteo Magasinsgatan (Kaffe)',
      'Restaurang Avalon (Affärslunch)'
    ],
    'Borås': [
      'Booster Friends Textile Hub Borås',
      'Café Viskan (Kaffe 20m)',
      'Babbel Restaurang & Bar (Lunch)'
    ],
    'Stockholm Kista': [
      'Kista Science Tower Booster Lounge',
      'The Kitchen Kista (Lunch 12:00)',
      'Gateau Kista Galleria (Kaffe)'
    ],
    'Malmö Västra Hamnen': [
      'Turning Torso Hubb Lounge',
      'Restaurang Spill Västra Hamnen',
      'Kaffebaren Kockum Fritid'
    ]
  };

  // Filter members active in chosen city
  const cityLocations = memberLocations.filter(
    l => l.current_city.toLowerCase() === activeCity.toLowerCase() &&
         (l.is_available_for_coffee || l.is_available_for_lunch) &&
         l.member_id !== currentUser.id
  );

  const activeMembers = cityLocations.map(loc => {
    const mem = allMembers.find(m => m.id === loc.member_id);
    return { mem, loc };
  }).filter((item): item is { mem: Member; loc: MemberActiveLocation } => item.mem !== undefined);

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    onSendPing({
      receiver_id: selectedMember.id,
      receiver_name: selectedMember.full_name,
      ping_type: pingType,
      suggested_location: selectedHubOrCafe,
      custom_message: customMsg || (pingType === 'COFFEE' 
        ? 'Hej! Såg att du är i närheten idag. Sugen på en snabb 20 min kaffe & nätverkssparring?' 
        : 'Lunchmöte idag (12:00–13:00)? Jag bjuder gärna!')
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setSelectedMember(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl space-y-5 p-6 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#800020]/10 border border-[#800020]/20 flex items-center justify-center text-[#800020]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <span>Zonkarta & Proximity Ping</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Opt-In Zonnivå
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Hitta kollegor på samma ort och föreslå en fika på anslutet partnercafé eller hubb
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setActiveCity(city);
                setSelectedMember(null);
                const spots = meetingSpots[city];
                if (spots && spots.length > 0) {
                  setSelectedHubOrCafe(spots[0]);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeCity === city
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{city}</span>
            </button>
          ))}
        </div>

        {/* Sent success notice */}
        {sentSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Inbjudan skickad! Mottagaren har fått en pushnotis och kan svara med ett klick.</span>
          </div>
        )}

        {/* Members in city */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-bold text-gray-900">
              Tillgängliga medlemmar i {activeCity} idag ({activeMembers.length})
            </span>
            <span>Automatisk avstängning kl. 17:00</span>
          </div>

          {activeMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeMembers.map(({ mem, loc }) => {
                const isSelected = selectedMember?.id === mem.id;
                const isGold = mem.membership_level === 'GOLD';

                return (
                  <div
                    key={mem.id}
                    onClick={() => setSelectedMember(mem)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#800020] bg-rose-50/40 ring-2 ring-[#800020]/20'
                        : isGold
                          ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/70'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img 
                          src={mem.avatar} 
                          alt={mem.full_name} 
                          className={`w-11 h-11 rounded-2xl object-cover border ${
                            isGold ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-gray-200'
                          }`}
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900 truncate">{mem.full_name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                            isGold ? 'bg-amber-200 text-amber-950' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {mem.membership_level}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">{mem.role_title} • {mem.company_name}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                          {loc.is_available_for_coffee && <span className="text-amber-800 bg-amber-50 px-1 rounded font-semibold">☕ Kaffe</span>}
                          {loc.is_available_for_lunch && <span className="text-rose-800 bg-rose-50 px-1 rounded font-semibold">🥗 Lunch</span>}
                        </div>
                      </div>
                    </div>

                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#800020] text-white border-[#800020]' : 'border-gray-300 text-transparent'
                    }`}>
                      ✓
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
              <Users className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-gray-800">
                Inga andra medlemmar incheckade i {activeCity} just nu
              </div>
              <p className="text-[11px] text-gray-500 max-w-md mx-auto">
                Slå på din egen status via widgeten så får andra medlemmar som rör sig i {activeCity} en notis om att du finns i området.
              </p>
            </div>
          )}
        </div>

        {/* Ping Form when a member is selected */}
        {selectedMember && (
          <form onSubmit={handleSendInvitation} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 space-y-4 animate-in slide-in-from-bottom-2 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-900">
                Skicka förfrågan till {selectedMember.full_name}
              </span>
              <span className="text-[11px] text-gray-500">{selectedMember.company_name}</span>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPingType('COFFEE')}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  pingType === 'COFFEE'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>☕ Ta en spontan kaffe? (15–30 min)</span>
              </button>

              <button
                type="button"
                onClick={() => setPingType('LUNCH')}
                className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  pingType === 'LUNCH'
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <Utensils className="w-4 h-4 text-rose-700" />
                <span>🥗 Lunchmöte idag? (12:00–13:00)</span>
              </button>
            </div>

            {/* Location selector */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Föreslagen mötesplats (Partnercafé eller Hubb i {activeCity}):
              </label>
              <select
                value={selectedHubOrCafe}
                onChange={e => setSelectedHubOrCafe(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium"
              >
                {(meetingSpots[activeCity] || []).map(spot => (
                  <option key={spot} value={spot}>{spot}</option>
                ))}
              </select>
            </div>

            {/* Custom note */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Personligt meddelande (valfritt):
              </label>
              <input
                type="text"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder={pingType === 'COFFEE' ? 'Hej! Är på hubben i 2 timmar. Hinner vi en snabb kaffe?' : 'Sugen på att ta en lunch och bolla samarbete?'}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-100"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Skicka Inbjudan</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
