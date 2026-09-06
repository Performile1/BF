import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Wifi, 
  Car, 
  Clock, 
  Users, 
  CheckCircle2, 
  Repeat, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  CreditCard, 
  Award, 
  QrCode, 
  Smartphone, 
  ChevronRight,
  Sliders,
  Compass,
  Coffee,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  Hub, 
  Member, 
  CoworkingDeskBooking, 
  PartnerCoworkingLocation, 
  DeskSwap, 
  MemberCoworkingCredits,
  MembershipLevel 
} from '../../types';

interface CoworkingHubsModuleProps {
  currentUser: Member;
  hubs: Hub[];
  bookings?: CoworkingDeskBooking[];
  partnerLocations?: PartnerCoworkingLocation[];
  deskSwaps?: DeskSwap[];
  credits?: MemberCoworkingCredits;
  onBookFlexDesk: (hubId: string, slotType: 'FULL_DAY' | 'AM' | 'PM', isPartner?: boolean) => void;
  onCheckInGeoOrQr: (bookingId: string) => void;
  onLendDeskSwap: (locationId: string, availableDate: string, deskLabel: string, notes: string, isPartner: boolean) => void;
  onClaimDeskSwap: (swapId: string) => void;
  onPurchaseCredits: (planType: 'SINGLE' | 'PACK_5' | 'MONTH_UNLIMITED', promoCodeApplied?: string) => void;
  onUpdatePartnerAllocation?: (partnerId: string, newDailyAllocation: number) => void;
}

export const CoworkingHubsModule: React.FC<CoworkingHubsModuleProps> = ({
  currentUser,
  hubs = [],
  bookings = [],
  partnerLocations = [],
  deskSwaps = [],
  credits = {
    member_id: currentUser.id,
    included_monthly_quota: currentUser.membership_level === 'GOLD' ? 5 : currentUser.membership_level === 'SILVER' ? 2 : 0,
    used_monthly_quota: 1,
    purchased_extra_credits: 2,
    unlimited_month_pass_active: false
  },
  onBookFlexDesk,
  onCheckInGeoOrQr,
  onLendDeskSwap,
  onClaimDeskSwap,
  onPurchaseCredits,
  onUpdatePartnerAllocation
}) => {
  // Main view navigation tabs
  const [activeSubTab, setActiveSubTab] = useState<'HUB_RADAR' | 'PARTNERS' | 'DESK_SWAP' | 'CREDITS_PASSES' | 'PARTNER_DASHBOARD'>('HUB_RADAR');
  const [selectedHubId, setSelectedHubId] = useState<string>(hubs[0]?.id || 'hub_stockholm');
  const [competenceSearch, setCompetenceSearch] = useState('');
  const [bookingSlot, setBookingSlot] = useState<'FULL_DAY' | 'AM' | 'PM'>('FULL_DAY');

  // Modals
  const [showLendModal, setShowLendModal] = useState(false);
  const [showBuyPassModal, setShowBuyPassModal] = useState(false);
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);

  // Lend form state
  const [lendDate, setLendDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [lendLocationId, setLendLocationId] = useState<string>(hubs[0]?.id || 'hub_stockholm');
  const [lendDeskLabel, setLendDeskLabel] = useState('Skrivbordsplats 12B (Tyst zon, 34" skärm)');
  const [lendNotes, setLendNotes] = useState('Bortrest på kunduppdrag! Lånar ut min skärm och plats med glädje.');

  // Buy pass state
  const [selectedPassType, setSelectedPassType] = useState<'SINGLE' | 'PACK_5' | 'MONTH_UNLIMITED'>('SINGLE');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; valid: boolean } | null>(null);

  // Partner dashboard state (simulated)
  const [selectedPartnerDashboardId, setSelectedPartnerDashboardId] = useState<string>(partnerLocations[0]?.id || '');
  const [partnerDeskLimit, setPartnerDeskLimit] = useState<number>(partnerLocations[0]?.daily_desk_allocation || 8);

  const currentHub = hubs.find(h => h.id === selectedHubId) || hubs[0];

  // Bookings for selected hub today
  const todayStr = new Date().toISOString().split('T')[0];
  const hubBookingsToday = bookings.filter(b => b.hub_id === selectedHubId && b.booking_date === todayStr);
  const checkedInMembers = hubBookingsToday.filter(b => b.is_checked_in);
  const prebookedMembers = hubBookingsToday.filter(b => !b.is_checked_in);

  // Filtered by competence
  const filteredCheckedIn = checkedInMembers.filter(b => {
    if (!competenceSearch.trim()) return true;
    const q = competenceSearch.toLowerCase();
    const matchTag = b.competence_tags?.some(t => t.toLowerCase().includes(q));
    const matchName = b.member_name.toLowerCase().includes(q);
    const matchCompany = b.member_company.toLowerCase().includes(q);
    const matchRole = b.member_role.toLowerCase().includes(q);
    return matchTag || matchName || matchCompany || matchRole;
  });

  const totalCapacity = 20; // Default capacity per hub
  const occupiedSpots = hubBookingsToday.length;
  const availableSpots = Math.max(0, totalCapacity - occupiedSpots);
  const occupancyPercent = Math.min(100, Math.round((occupiedSpots / totalCapacity) * 100));

  // Current user's booking for selected hub today
  const currentUserBooking = hubBookingsToday.find(b => b.member_id === currentUser.id);

  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'SILVER20') {
      setPromoMessage({ text: '20% rabatt applicerad!', valid: true });
    } else if (promoCodeInput.trim().toUpperCase() === 'BOOSTER500') {
      setPromoMessage({ text: '500 kr rabatt applicerad!', valid: true });
    } else if (promoCodeInput.trim().toUpperCase() === 'FREEDAYS3') {
      setPromoMessage({ text: '3 Extra fria coworking-dagar aktiverade!', valid: true });
    } else {
      setPromoMessage({ text: 'Ogiltig kampanjkod.', valid: false });
    }
  };

  const handleExecuteCheckIn = () => {
    if (currentUserBooking) {
      onCheckInGeoOrQr(currentUserBooking.id);
      setShowCheckInSuccess(true);
      setTimeout(() => setShowCheckInSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('HUB_RADAR')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeSubTab === 'HUB_RADAR' ? 'bg-[#800020] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hubbsidan & Flexplatser</span>
          </button>

          <button
            onClick={() => setActiveSubTab('PARTNERS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeSubTab === 'PARTNERS' ? 'bg-[#800020] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Partner-Coworking ({partnerLocations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('DESK_SWAP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeSubTab === 'DESK_SWAP' ? 'bg-[#800020] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Desk Swap & Peer-Lending</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              +25 BP
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('CREDITS_PASSES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
              activeSubTab === 'CREDITS_PASSES' ? 'bg-[#800020] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Klippkort & Kvoter</span>
          </button>
        </div>

        {/* Partner Dashboard toggle */}
        <button
          onClick={() => setActiveSubTab('PARTNER_DASHBOARD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
            activeSubTab === 'PARTNER_DASHBOARD'
              ? 'bg-purple-900 text-white border-purple-950 shadow-xs'
              : 'border-purple-200 text-purple-800 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Partner Dashboard (Admin)</span>
        </button>
      </div>

      {/* SUBTAB 1: HUBBSIDAN & NÄTVERKSRADAR (V6) */}
      {activeSubTab === 'HUB_RADAR' && (
        <div className="space-y-6">
          {/* Hub Selector bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {hubs.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHubId(h.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 border ${
                  selectedHubId === h.id
                    ? 'bg-[#800020] text-white border-[#800020] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{h.name}</span>
                {h.id === currentUser.hub_id && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                    Min Hubb
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Hub Header & Faciliteter */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Hub Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-bold border border-rose-100">
                    Fysisk Booster Hubb
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {currentHub.address}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {currentHub.name}
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Välkommen till Booster Friends hubb i {currentHub.city}. En modern mötesplats och coworking-yta med ergonomiska arbetsplatser, tysta fokusrum, kaffe av baristakvalitet och veckovisa fysiska nätverksträffar.
                </p>

                {/* Facility Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                      <Wifi className="w-4 h-4 text-[#800020]" />
                      <span>Booster-Guest</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono">Kod: boosterfriends2026</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                      <Clock className="w-4 h-4 text-[#800020]" />
                      <span>Öppettider</span>
                    </div>
                    <p className="text-[11px] text-gray-500">Mån-Fre 07:30 - 18:00</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                      <Car className="w-4 h-4 text-[#800020]" />
                      <span>Parkering</span>
                    </div>
                    <p className="text-[11px] text-gray-500">P-hus i anslutning (100m)</p>
                  </div>
                </div>

                {/* Hub Lead */}
                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      alt="Sofia Eklund"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Sofia Eklund • Hubbansvarig</div>
                      <div className="text-[11px] text-gray-600">Finns på plats torsdagar för introduktioner och rundvandring.</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#800020]">142 Medlemmar</span>
                </div>
              </div>

              {/* Right Column: Live Capacity Meter & Quick Booking */}
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Live Flex-Status Idag
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Realtid
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-gray-900">
                    {availableSpots} av {totalCapacity} flexplatser lediga
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        occupancyPercent > 80 ? 'bg-amber-500' : 'bg-[#800020]'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>{occupancyPercent}% beläggning</span>
                    <span>{occupiedSpots} inbokade</span>
                  </div>
                </div>

                {/* Booking controls */}
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-700">Välj tidsslott för idag:</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['FULL_DAY', 'AM', 'PM'] as const).map(slot => (
                      <button
                        key={slot}
                        onClick={() => setBookingSlot(slot)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                          bookingSlot === slot
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {slot === 'FULL_DAY' ? 'Heldag' : slot === 'AM' ? 'Förmiddag' : 'Eftermiddag'}
                      </button>
                    ))}
                  </div>

                  {currentUserBooking ? (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Plats bokad ({currentUserBooking.slot_type})
                        </span>
                        {currentUserBooking.is_checked_in && (
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            Incheckad {currentUserBooking.check_in_time}
                          </span>
                        )}
                      </div>

                      {!currentUserBooking.is_checked_in && (
                        <button
                          onClick={handleExecuteCheckIn}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Checka in nu via Geo/QR (+30 BP)</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onBookFlexDesk(selectedHubId, bookingSlot, false)}
                      className="w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Boka Flexplats (Drar 1 kredit)</span>
                    </button>
                  )}

                  {showCheckInSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs text-center font-bold animate-bounce">
                      🎉 Incheckad! +30 Booster Points tilldelade!
                    </div>
                  )}

                  <div className="text-[11px] text-gray-500 text-center">
                    Du har <strong>{credits.included_monthly_quota + credits.purchased_extra_credits - credits.used_monthly_quota}</strong> pass kvar denna månad.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* "VEM ÄR PÅ PLATS IDAG?" (NÄTVERKSRADARN) */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-1 border border-emerald-200">
                  <Users className="w-3.5 h-3.5" />
                  <span>Nätverksradarn • Who's at the Office</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Vem är på hubben idag?
                </h3>
                <p className="text-xs text-gray-500">
                  Se incheckade kollegor just nu samt förhandsbokade för att planera nätverkskaffe eller spontan sparring.
                </p>
              </div>

              {/* Search competence */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sök jurist, SEO, e-handel, SaaS..."
                  value={competenceSearch}
                  onChange={(e) => setCompetenceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                />
              </div>
            </div>

            {/* Incheckade medlemmar (Just nu) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Fysiskt på plats just nu ({filteredCheckedIn.length})</span>
                </span>
                <span className="text-gray-400 font-normal text-[11px]">Verifierade via QR & Geofence</span>
              </div>

              {filteredCheckedIn.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-500">
                  {competenceSearch ? 'Inga incheckade medlemmar matchade din kompetenssökning.' : 'Inga medlemmar incheckade just nu. Bli den första idag!'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCheckedIn.map(bk => (
                    <div
                      key={bk.id}
                      className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60 transition flex items-start gap-3 relative group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={bk.member_avatar}
                          alt={bk.member_name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{bk.member_name}</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {bk.check_in_time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{bk.member_role} • {bk.member_company}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bk.competence_tags?.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-700 border border-gray-200 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Förhandsbokade medlemmar */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Förhandsbokade flexplatser idag ({prebookedMembers.length})</span>
                <span className="text-gray-400 font-normal text-[11px]">Väntas in under dagen</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {prebookedMembers.map(bk => (
                  <div
                    key={bk.id}
                    className="p-3 rounded-xl border border-gray-200 bg-white flex items-center gap-3"
                  >
                    <img
                      src={bk.member_avatar}
                      alt={bk.member_name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900 truncate">{bk.member_name}</span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                          {bk.slot_type === 'PM' ? 'Eftermiddag' : 'Förmiddag'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{bk.member_role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PARTNER-COWORKINGKONTOR (V7) */}
      {activeSubTab === 'PARTNERS' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
              <Compass className="w-3.5 h-3.5" />
              <span>Master Kravspecifikation V7 • Global Rörlighet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Anslutna Partner-Coworkingkontor
            </h2>
            <p className="mt-2 text-sm text-gray-300 max-w-2xl leading-relaxed">
              Utöver våra egna hubbar ger Booster Friends dig tillgång till ledande kontorshotell som Convendum, United Spaces och Mindpark. Dina inkluderade coworking-dagar och klippkort fungerar med samma gemensamma flex-standard!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerLocations.map(ptnr => (
              <div
                key={ptnr.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={ptnr.image_url}
                      alt={ptnr.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-xs">
                      {ptnr.brand_group}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-xs">
                      {ptnr.available_today} av {ptnr.daily_desk_allocation} platser lediga
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-lg">{ptnr.name}</h3>
                      <span className="text-xs font-bold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-full">
                        ★ {ptnr.rating_score}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{ptnr.address}, {ptnr.city}</span>
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Öppet: {ptnr.opening_hours}</span>
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {ptnr.amenities.map(a => (
                        <span key={a} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Gemensam Flex-Standard (1 kredit)
                  </div>
                  <button
                    onClick={() => onBookFlexDesk(ptnr.id, 'FULL_DAY', true)}
                    className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold uppercase tracking-wider transition"
                  >
                    Boka Flexplats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DESK SWAP & PEER-LENDING (V7) */}
      {activeSubTab === 'DESK_SWAP' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
                <Repeat className="w-3.5 h-3.5" />
                <span>Peer-to-Peer Desk Sharing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Desk Swap & Peer-Lending
              </h2>
              <p className="mt-2 text-sm text-gray-200 max-w-xl leading-relaxed">
                Är du bortrest eller jobbar hemifrån? Låna ut din fasta kontorsplats eller flexkvot till en kollega i nätverket. Du bidrar till resurseffektivitet och belönas direkt med <strong>+25 Booster Points</strong>!
              </p>
            </div>

            <button
              onClick={() => setShowLendModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition shrink-0 shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Låna ut min plats (+25 BP)</span>
            </button>
          </div>

          {/* List of Available Swaps */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Tillgängliga platser utlånade av kollegor</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deskSwaps.map(swap => {
                const isMine = swap.lender_member_id === currentUser.id;
                const isBooked = swap.status === 'BOOKED';

                return (
                  <div
                    key={swap.id}
                    className={`bg-white rounded-3xl border p-5 transition flex flex-col justify-between shadow-xs ${
                      isBooked ? 'border-gray-200 opacity-80' : 'border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top status */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isBooked ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isBooked ? 'Bokad' : 'Tillgänglig för bokning'}
                        </span>
                        <span className="text-xs font-bold text-[#800020]">
                          Datum: {swap.available_date}
                        </span>
                      </div>

                      {/* Desk Label */}
                      <h4 className="font-bold text-gray-900 text-sm">
                        {swap.desk_label}
                      </h4>

                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{swap.location_name}</span>
                      </div>

                      {/* Notes */}
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl italic">
                        "{swap.notes}"
                      </p>

                      {/* Lender profile */}
                      <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100">
                        <img
                          src={swap.lender_member_avatar}
                          alt={swap.lender_member_name}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-gray-900">{swap.lender_member_name}</div>
                          <div className="text-[11px] text-gray-500">{swap.lender_company}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-4 mt-3 border-t border-gray-100">
                      {isBooked ? (
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bokad av {swap.borrower_member_name || 'Kollega'}</span>
                        </div>
                      ) : isMine ? (
                        <div className="text-xs text-emerald-700 font-bold text-center">
                          Du lånar ut denna plats (+25 BP)
                        </div>
                      ) : (
                        <button
                          onClick={() => onClaimDeskSwap(swap.id)}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition"
                        >
                          Boka denna plats (Peer-to-Peer)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: KLIPPKORT & KVOTER (V6 Medlemspaket) */}
      {activeSubTab === 'CREDITS_PASSES' && (
        <div className="space-y-6">
          {/* Member's current quota status */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Ditt personliga Coworking-saldo</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {currentUser.membership_level === 'GOLD' ? 'Guld: 5 fria dagar/månad' : currentUser.membership_level === 'SILVER' ? 'Silver: 2 fria dagar/månad' : 'Brons: Inga inkluderade dagar'}
              </h2>

              <p className="text-sm text-gray-600">
                Inkluderade coworking-dagar förnyas månadsvis. Har du slut på dagar kan du när som helst köpa enstaka pass eller förmånliga 5-klippkort direkt i appen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500 font-bold uppercase">Månadskvot</div>
                  <div className="text-2xl font-bold text-[#800020] mt-1">
                    {credits.included_monthly_quota - credits.used_monthly_quota} / {credits.included_monthly_quota}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">dagar kvar denna månad</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500 font-bold uppercase">Klippkortssaldo</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {credits.purchased_extra_credits} pass
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">brinner aldrig inne</div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500 font-bold uppercase">Total Tillgång</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {credits.included_monthly_quota - credits.used_monthly_quota + credits.purchased_extra_credits} dagar
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">redo att boka direkt</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing table (Kravspec V6) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Tillköp av Coworking-dagar (Coworking Booster Packs)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Single Pass */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Single Flex Pass</span>
                  <div className="text-3xl font-bold text-gray-900">250 SEK</div>
                  <p className="text-xs text-gray-600">
                    1 flexdag på valfri fysisk hubb eller anslutet partner-coworkingkontor.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                    <li className="flex items-center gap-2">✓ Fritt kaffe & te</li>
                    <li className="flex items-center gap-2">✓ Snabbt Wi-Fi (1 Gbps)</li>
                    <li className="flex items-center gap-2">✓ Gäller i 6 månader</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedPassType('SINGLE');
                    setShowBuyPassModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  Köp 1 Dagspass (250 kr)
                </button>
              </div>

              {/* 5-Klippkort (Populärast) */}
              <div className="bg-white rounded-3xl border-2 border-[#800020] p-6 flex flex-col justify-between shadow-md relative">
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#800020] text-white text-[10px] font-bold uppercase tracking-wider">
                  Mest Populärt (200 kr/dag)
                </div>
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">5-Klippkort Flex</span>
                  <div className="text-3xl font-bold text-gray-900">1 000 SEK</div>
                  <p className="text-xs text-gray-600">
                    Laddas direkt på ditt medlemskonto. Perfekt för hybridarbete och kundmöten.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                    <li className="flex items-center gap-2">✓ 20% rabatt jämfört med enstaka pass</li>
                    <li className="flex items-center gap-2">✓ Gäller valfri hubb och Convendum/United Spaces</li>
                    <li className="flex items-center gap-2">✓ Brinner aldrig inne</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedPassType('PACK_5');
                    setShowBuyPassModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs"
                >
                  Köp 5-Klippkort (1 000 kr)
                </button>
              </div>

              {/* Unlimited Month Addon */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Månadspass Obegränsat</span>
                  <div className="text-3xl font-bold text-gray-900">1 990 SEK<span className="text-xs text-gray-500 font-normal">/mån</span></div>
                  <p className="text-xs text-gray-600">
                    Full frihet. Sätt dig och jobba var du vill, hur ofta du vill i hela nätverket.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                    <li className="flex items-center gap-2">✓ Obegränsad flexplats hela månaden</li>
                    <li className="flex items-center gap-2">✓ Faktureras via Fortnox/Stripe</li>
                    <li className="flex items-center gap-2">✓ Ingen bindningstid</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedPassType('MONTH_UNLIMITED');
                    setShowBuyPassModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  Aktivera Månadspass (1 990 kr)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: PARTNER DASHBOARD (ADMIN V7) */}
      {activeSubTab === 'PARTNER_DASHBOARD' && (
        <div className="bg-white rounded-3xl border border-purple-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-200">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
                Partner Administration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                Coworking Partner Dashboard
              </h2>
              <p className="text-xs text-gray-500">
                Dedikerad administrationsvy för anslutna coworkingkontor att styra Booster Friends-kapacitet och incheckningar.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-600">Välj partnerlokal:</label>
              <select
                value={selectedPartnerDashboardId}
                onChange={(e) => {
                  setSelectedPartnerDashboardId(e.target.value);
                  const p = partnerLocations.find(loc => loc.id === e.target.value);
                  if (p) setPartnerDeskLimit(p.daily_desk_allocation);
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold bg-white"
              >
                {partnerLocations.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Allocation settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Daglig Flexplats-allokering
              </h4>
              <p className="text-xs text-gray-600">
                Ställ in hur många flexplatser per dag du reserverar exklusivt åt Booster Friends-medlemmar.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={partnerDeskLimit}
                  onChange={(e) => setPartnerDeskLimit(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl border border-gray-300 font-bold text-center"
                />
                <button
                  onClick={() => onUpdatePartnerAllocation?.(selectedPartnerDashboardId, partnerDeskLimit)}
                  className="px-4 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Uppdatera
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Policy för Medlemsutlåning (Desk Swap)
              </h4>
              <p className="text-xs text-gray-600">
                Tillåt att fasta medlemmar lånar ut sina platser när de reser:
              </p>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  ✓ Desk Swap Aktiverat (Policy: Ja)
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                Snabb Incheckningsskanner (QR)
              </h4>
              <p className="text-xs text-gray-600">
                Scanna medlemmens Booster QR-pass vid receptionen.
              </p>
              <button className="mt-2 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>Öppna Receptionskamera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LÅNA UT MIN PLATS (DESK SWAP V7) */}
      {showLendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+25 Booster Points vid utlåning</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl">
                  Låna ut din kontorsplats
                </h3>
              </div>
              <button
                onClick={() => setShowLendModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Fyll i vilket datum din plats är ledig så görs den omedelbart bokningsbar för andra verifierade medlemmar i nätverket.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Datum då platsen är ledig:</label>
                <input
                  type="date"
                  value={lendDate}
                  onChange={(e) => setLendDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Hubb eller Partnerlokal:</label>
                <select
                  value={lendLocationId}
                  onChange={(e) => setLendLocationId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                >
                  {hubs.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                  {partnerLocations.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Beskrivning av platsen:</label>
                <input
                  type="text"
                  value={lendDeskLabel}
                  onChange={(e) => setLendDeskLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  placeholder="T.ex. Plats 14A, nära fönstret med extern skärm"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Hälsning / Notis till låntagaren:</label>
                <textarea
                  rows={3}
                  value={lendNotes}
                  onChange={(e) => setLendNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  placeholder="T.ex. Jag är i Borås på kundmöte! Lånar ut min skärm."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowLendModal(false)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold text-xs"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  onLendDeskSwap(lendLocationId, lendDate, lendDeskLabel, lendNotes, false);
                  setShowLendModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Bekräfta & Få +25 BP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KÖP FLEXPASS MED KAMPANJKOD */}
      {showBuyPassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Kassa: {selectedPassType === 'SINGLE' ? 'Single Flex Pass (250 kr)' : selectedPassType === 'PACK_5' ? '5-Klippkort Flex (1 000 kr)' : 'Månadspass Obegränsat (1 990 kr/mån)'}
                </h3>
                <p className="text-xs text-gray-500">
                  Betala direkt med Swish, Stripe kort eller Fortnox-faktura.
                </p>
              </div>
              <button
                onClick={() => setShowBuyPassModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Promo Code Input */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                Har du en kampanj- eller rabattkod?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="T.ex. SILVER20 eller BOOSTER500"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs uppercase font-mono"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white font-bold text-xs"
                >
                  Tillämpa
                </button>
              </div>
              {promoMessage && (
                <div className={`text-xs font-bold ${promoMessage.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage.text}
                </div>
              )}
            </div>

            {/* Payment method selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Välj betalsätt:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl border-2 border-[#800020] bg-rose-50/40 text-center text-xs font-bold text-[#800020]">
                  Swish
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs font-medium text-gray-600">
                  Kort (Stripe)
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200 text-center text-xs font-medium text-gray-600">
                  Faktura 30 dgr
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setShowBuyPassModal(false)}
                className="px-4 py-2 rounded-xl text-gray-500 font-bold text-xs"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  onPurchaseCredits(selectedPassType, promoMessage?.valid ? promoCodeInput : undefined);
                  setShowBuyPassModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs"
              >
                Slutför Köp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
