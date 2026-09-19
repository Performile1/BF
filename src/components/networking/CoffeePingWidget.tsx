import React, { useState, useMemo } from 'react';
import { filterMockPings } from '../../lib/mockRbacFilter';
import { 
  Coffee, 
  Utensils, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plane, 
  Users, 
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { Member, MemberActiveLocation, ProximityPing } from '../../types';

interface CoffeePingWidgetProps {
  currentUser: Member;
  allMembers: Member[];
  memberLocations: MemberActiveLocation[];
  proximityPings: ProximityPing[];
  onSendPing: (ping: {
    receiver_id: string;
    receiver_name: string;
    ping_type: 'COFFEE' | 'LUNCH';
    suggested_location: string;
    custom_message?: string;
  }) => void;
  onRespondPing: (pingId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  onUpdateLocationStatus: (status: Partial<MemberActiveLocation>) => void;
  onOpenFullModal?: () => void;
  mode?: 'compact' | 'extended';
}

export const CoffeePingWidget: React.FC<CoffeePingWidgetProps> = ({
  currentUser,
  allMembers,
  memberLocations,
  proximityPings,
  onSendPing,
  onRespondPing,
  onUpdateLocationStatus,
  onOpenFullModal,
  mode = 'extended'
}) => {
  // Current user's location state
  const myLocation = memberLocations.find(l => l.member_id === currentUser.id) || {
    id: `loc_${currentUser.id}`,
    member_id: currentUser.id,
    current_city: currentUser.city || 'Mölnlycke',
    is_available_for_coffee: true,
    is_available_for_lunch: true,
    expires_at: new Date(Date.now() + 8 * 3600000).toISOString(),
    created_at: new Date().toISOString()
  };

  const isVisibleToday = myLocation.is_available_for_coffee || myLocation.is_available_for_lunch;

  // RBAC filter for pings
  const userVisiblePings = useMemo(() => {
    return filterMockPings(proximityPings, currentUser);
  }, [proximityPings, currentUser]);

  // Selected city/zone (defaults to user's city or Mölnlycke)
  const [activeZone, setActiveZone] = useState<string>(myLocation.current_city || 'Mölnlycke');
  const [selectedQuickTarget, setSelectedQuickTarget] = useState<Member | null>(null);
  const [pingType, setPingType] = useState<'COFFEE' | 'LUNCH'>('COFFEE');
  const [customMsg, setCustomMsg] = useState('');
  const [locationSuggestion, setLocationSuggestion] = useState('Booster Friends Mölnlycke Hubb');
  const [showSendSuccess, setShowSendSuccess] = useState<string | null>(null);

  // Gold travel status state
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [travelDestination, setTravelDestination] = useState(myLocation.travel_destination || 'Stockholm Kista');
  const [travelDate, setTravelDate] = useState(myLocation.travel_date || '2026-09-12');

  // If GUEST: return protected screen according to permission matrix
  if (currentUser.role === 'GUEST') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto">
          <Coffee className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-gray-900 font-display">Kaffe- & Lunch-pings (Gästläge)</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Spontana kaffe- och lunchinbjudningar samt geobaserad närvaroradar är reserverade för registrerade medlemmar. Skapa ett medlemskonto för att börja pinga kollegor i din närhet!
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <ShieldCheck className="w-4 h-4" />
            Måste skapa konto först
          </span>
        </div>
      </div>
    );
  }

  // Package permissions
  const isBronze = currentUser.membership_level === 'BRONZE';
  const isSilver = currentUser.membership_level === 'SILVER';
  const isGold = currentUser.membership_level === 'GOLD';

  // Count sent pings this month by current user
  const monthlyPingsSent = userVisiblePings.filter(
    p => p.sender_member_id === currentUser.id
  ).length;
  const isBronzeLimitReached = isBronze && monthlyPingsSent >= 1;

  // Other members in the same zone who have opt-in turned on
  const zoneLocations = memberLocations.filter(
    l => l.member_id !== currentUser.id && 
         l.current_city.toLowerCase() === activeZone.toLowerCase() &&
         (l.is_available_for_coffee || l.is_available_for_lunch)
  );

  const availableMembersInZone = zoneLocations.map(loc => {
    const mem = allMembers.find(m => m.id === loc.member_id);
    return {
      member: mem,
      location: loc
    };
  }).filter((item): item is { member: Member; location: MemberActiveLocation } => item.member !== undefined);

  // Inbound pings for current user (PENDING)
  const incomingPings = userVisiblePings.filter(
    p => (p.receiver_member_id === currentUser.id || currentUser.role === 'SUPER_ADMIN') && p.status === 'PENDING'
  );

  // Handle toggling overall visibility
  const handleToggleVisibility = () => {
    if (isVisibleToday) {
      onUpdateLocationStatus({
        is_available_for_coffee: false,
        is_available_for_lunch: false
      });
    } else {
      onUpdateLocationStatus({
        is_available_for_coffee: true,
        is_available_for_lunch: true,
        current_city: activeZone
      });
    }
  };

  const handleToggleCoffee = () => {
    onUpdateLocationStatus({
      is_available_for_coffee: !myLocation.is_available_for_coffee
    });
  };

  const handleToggleLunch = () => {
    onUpdateLocationStatus({
      is_available_for_lunch: !myLocation.is_available_for_lunch
    });
  };

  const handleSaveTravelStatus = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocationStatus({
      travel_destination: travelDestination,
      travel_date: travelDate
    });
    setShowTravelModal(false);
    setShowSendSuccess(`✈️ Resestatus sparad! Medlemmar i ${travelDestination} notifieras om ditt besök ${travelDate}.`);
    setTimeout(() => setShowSendSuccess(null), 5000);
  };

  const handleExecutePing = (targetMember: Member, type: 'COFFEE' | 'LUNCH') => {
    if (isBronzeLimitReached) {
      alert('🥉 Bronsmedlemmar kan skicka max 1 spontan ping per månad. Uppgradera till Silver eller Guld för obegränsade pings!');
      return;
    }

    const defaultLoc = type === 'COFFEE' 
      ? `Booster Friends Hubb Lounge (${activeZone}) / Espresso House` 
      : `Restaurang i ${activeZone} (12:00–13:00)`;

    onSendPing({
      receiver_id: targetMember.id,
      receiver_name: targetMember.full_name,
      ping_type: type,
      suggested_location: locationSuggestion || defaultLoc,
      custom_message: customMsg || (type === 'COFFEE' 
        ? 'Hej! Såg att du är öppen för kaffe i området idag. Sugen på 20 min?' 
        : 'Lunchmöte idag (12:00–13:00)? Jag bjuder gärna på lite sparring.')
    });

    setSelectedQuickTarget(null);
    setCustomMsg('');
    setShowSendSuccess(`☕ Förfrågan skickad till ${targetMember.full_name}! En pushnotis har levererats.`);
    setTimeout(() => setShowSendSuccess(null), 4500);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-5 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-gray-900">
                Proximity Ping (Kaffe & Lunch-Radar)
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : currentUser.role === 'HUB_HOST'
                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {currentUser.role === 'SUPER_ADMIN' || currentUser.is_admin
                  ? 'SUPER ADMIN'
                  : currentUser.role === 'HUB_HOST'
                  ? 'HUB HOST'
                  : 'Live Radar'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Integritetssäker platsdelning på zonnivå – slås av automatiskt kl 17:00
            </p>
          </div>
        </div>

        {/* Zone Selector & Travel Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#800020]" />
            <select
              value={activeZone}
              onChange={e => {
                setActiveZone(e.target.value);
                onUpdateLocationStatus({ current_city: e.target.value });
              }}
              className="bg-transparent font-bold text-gray-800 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="Mölnlycke">Mölnlycke</option>
              <option value="Göteborg C">Göteborg C</option>
              <option value="Borås">Borås</option>
              <option value="Stockholm Kista">Stockholm Kista</option>
              <option value="Malmö Västra Hamnen">Malmö Västra Hamnen</option>
            </select>
          </div>

          {/* Guld Resestatus Button */}
          {isGold ? (
            <button
              onClick={() => setShowTravelModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-200 text-amber-950 font-black text-xs border border-amber-400 hover:brightness-105 transition flex items-center gap-1 shadow-2xs"
              title="Guld-förmån: Ställ in planerad resa i förväg"
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Planerad Resa</span>
            </button>
          ) : (
            <span 
              className="px-2 py-1 rounded-xl bg-gray-100 text-gray-400 text-[10px] font-bold border border-gray-200 hidden sm:flex items-center gap-1 cursor-help"
              title="Endast Guldmedlemmar kan ställa in framtida resestatus och skicka pings i förväg."
            >
              <Plane className="w-3 h-3 text-gray-400" />
              <span>Resestatus (Guld)</span>
            </span>
          )}
        </div>
      </div>

      {/* Success alert message */}
      {showSendSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{showSendSuccess}</span>
          </div>
          <button onClick={() => setShowSendSuccess(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* 1. Status Toggle Section (Kompakt läge) */}
      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleVisibility}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                isVisibleToday ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isVisibleToday ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                {isVisibleToday ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Öppen för fika/lunch i {activeZone} idag</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-gray-500">Osynlig idag (Ingen plats delad)</span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-gray-500">
                {isVisibleToday 
                  ? 'Andra medlemmar i zonen kan se din tillgänglighet och skicka förfrågan.'
                  : 'Klicka för att aktivera din närvaro under arbetsdagen.'}
              </span>
            </div>
          </div>

          {/* Quick checkboxes for what user is open for */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggleCoffee}
              disabled={!isVisibleToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                myLocation.is_available_for_coffee && isVisibleToday
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-gray-400 border-gray-200 opacity-60'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-700" />
              <span>Kaffe (15–30 min)</span>
            </button>

            <button
              onClick={handleToggleLunch}
              disabled={!isVisibleToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                myLocation.is_available_for_lunch && isVisibleToday
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-white text-gray-400 border-gray-200 opacity-60'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-rose-700" />
              <span>Lunch (12:00–13:00)</span>
            </button>
          </div>
        </div>

        {/* Bronze quota notice */}
        {isBronze && (
          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-600">
            <span>
              🥉 Bronsmedlemskap: <strong>{1 - monthlyPingsSent} av 1</strong> skickad ping kvar denna månad.
            </span>
            <span className="text-[#800020] font-bold">Obegränsat mottagande ingår</span>
          </div>
        )}
      </div>

      {/* 2. Inbound Pending Pings (Notifiering med 1-klicks svarsknappar) */}
      {incomingPings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Inkommande förfrågningar i närheten ({incomingPings.length})</span>
          </div>

          <div className="space-y-2">
            {incomingPings.map((ping) => (
              <div 
                key={ping.id} 
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in slide-in-from-top-1"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={ping.sender_avatar} 
                    alt={ping.sender_name} 
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{ping.sender_name}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({ping.sender_company})</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        ping.ping_type === 'COFFEE' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                      }`}>
                        {ping.ping_type === 'COFFEE' ? '☕ Kaffe (20m)' : '🥗 Lunchmöte'}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950 font-medium mt-0.5">
                      "{ping.custom_message || 'Sugen på spontan sparring?'}"
                    </p>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#800020]" />
                      <span>Föreslagen plats: {ping.suggested_location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => onRespondPing(ping.id, 'ACCEPTED')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Jag är på!</span>
                  </button>
                  <button
                    onClick={() => onRespondPing(ping.id, 'DECLINED')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-600 font-bold text-xs transition border border-gray-200"
                  >
                    Hinner inte idag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2b. Supervisory Pings (For Super Admin and Hub Host) */}
      {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HUB_HOST') && userVisiblePings.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span>{currentUser.role === 'SUPER_ADMIN' ? 'Alla Pings i Plattformen' : `Pings i ${currentUser.hub_name || 'Hubben'}`} ({userVisiblePings.length})</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Övervakningsvy</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {userVisiblePings.map(p => (
              <div key={p.id} className="text-[11px] bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">{p.sender_name}</span>
                  <span className="text-gray-400 mx-1">➜</span>
                  <span className="font-semibold text-gray-700">{p.receiver_name}</span>
                  <span className="ml-1 text-[10px] text-gray-500">({p.suggested_location})</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  p.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                  p.status === 'DECLINED' ? 'bg-gray-100 text-gray-600' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Utökat Läge (Närhetslista med andra medlemmar på samma ort) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#800020]" />
            <span>
              {availableMembersInZone.length > 0 
                ? `${availableMembersInZone.length} medlemmar är öppna för kaffe/lunch i ${activeZone} idag`
                : `Inga andra medlemmar har slagit på status i ${activeZone} just nu`}
            </span>
          </div>

          {onOpenFullModal && (
            <button
              onClick={onOpenFullModal}
              className="text-xs font-bold text-[#800020] hover:underline flex items-center gap-1"
            >
              <span>Se zonkarta</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Member cards in the zone */}
        {availableMembersInZone.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableMembersInZone.map(({ member, location }) => {
              const isMemGold = member.membership_level === 'GOLD';
              const isMemSilver = member.membership_level === 'SILVER';

              return (
                <div 
                  key={member.id}
                  className={`p-3.5 rounded-2xl border transition hover:shadow-xs flex items-center justify-between gap-3 ${
                    isMemGold 
                      ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/60' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img 
                        src={member.avatar} 
                        alt={member.full_name} 
                        className={`w-11 h-11 rounded-2xl object-cover border ${
                          isMemGold ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-gray-200'
                        }`}
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900 truncate">
                          {member.full_name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                          isMemGold 
                            ? 'bg-amber-200 text-amber-950' 
                            : isMemSilver 
                              ? 'bg-slate-200 text-slate-800' 
                              : 'bg-orange-100 text-orange-900'
                        }`}>
                          {member.membership_level}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-500 truncate">
                        {member.role_title} • {member.company_name}
                      </div>

                      {/* Badges for coffee/lunch */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {location.is_available_for_coffee && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            ☕ Kaffe
                          </span>
                        )}
                        {location.is_available_for_lunch && (
                          <span className="text-[10px] text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            🥗 Lunch
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Ping Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleExecutePing(member, 'COFFEE')}
                      disabled={!location.is_available_for_coffee}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs disabled:opacity-40"
                      title={`Bjud ${member.full_name} på kaffe`}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Kaffe</span>
                    </button>

                    <button
                      onClick={() => handleExecutePing(member, 'LUNCH')}
                      disabled={!location.is_available_for_lunch}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs disabled:opacity-40"
                      title={`Bjud ${member.full_name} på lunch`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Lunch</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
            <MapPin className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="text-xs font-bold text-gray-700">
              Var först att aktivera i {activeZone}!
            </div>
            <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
              När andra medlemmar rör sig i området under dagen får de en diskret närhetsnotis och kan bjuda in till spontan fika eller lunch.
            </p>
          </div>
        )}
      </div>

      {/* Gold Travel Destination Modal */}
      {showTravelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-amber-300 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  ✈️
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900">Planerad Resa / Resestatus</h4>
                  <span className="text-[10px] font-bold text-amber-700">Exklusiv Guld-funktion</span>
                </div>
              </div>
              <button 
                onClick={() => setShowTravelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTravelStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Destinationsort:</label>
                <select
                  value={travelDestination}
                  onChange={e => setTravelDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                >
                  <option value="Stockholm Kista">Stockholm Kista</option>
                  <option value="Stockholm City">Stockholm City</option>
                  <option value="Göteborg C">Göteborg C</option>
                  <option value="Borås">Borås</option>
                  <option value="Malmö Västra Hamnen">Malmö Västra Hamnen</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Datum för besök:</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={e => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                💡 Medlemmar i {travelDestination} kommer att se: <em>"{currentUser.full_name} besöker {travelDestination} {travelDate}, vem vill käka lunch?"</em> och kan skicka bokningar till dig i förväg.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTravelModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#800020] text-white font-bold hover:bg-[#660018] shadow-xs"
                >
                  Aktivera Resestatus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
