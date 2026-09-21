import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Check, 
  Plus, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Users, 
  Hotel, 
  Utensils, 
  Gift, 
  Smartphone, 
  X,
  Share2,
  Copy,
  ChevronRight
} from 'lucide-react';
import { BoosterEvent, GuestPass, Member, Hub } from '../../types';
import { formatSek } from '../../utils/calendar';
import { AdminInspect } from '../dev/AdminInspect';

interface EventBookingModuleProps {
  currentUser: Member;
  events: BoosterEvent[];
  guestPasses: GuestPass[];
  selectedHub: Hub;
  onToggleAddon: (eventId: string, addonId: string) => void;
  onBookEvent: (eventId: string, paymentMethod: 'SWISH' | 'STRIPE' | 'FAKTURA', totalAmount: number) => void;
  onCheckInEvent: (eventId: string) => void;
  onCreateGuestPass: (guest: { guest_name: string; guest_email: string; guest_company: string; target_hub: string; target_date: string }) => void;
}

export const EventBookingModule: React.FC<EventBookingModuleProps> = ({
  currentUser,
  events = [],
  guestPasses = [],
  selectedHub,
  onToggleAddon,
  onBookEvent,
  onCheckInEvent,
  onCreateGuestPass
}) => {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'CHECKIN' | 'GUEST_PASS'>('EVENTS');
  const [checkoutEvent, setCheckoutEvent] = useState<BoosterEvent | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'SWISH' | 'STRIPE' | 'FAKTURA'>('SWISH');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);

  // Guest pass form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCompany, setGuestCompany] = useState('');
  const [guestDate, setGuestDate] = useState('10 Sep 2026');

  // Check-in simulator state
  const [geoDistance, setGeoDistance] = useState(18); // 18m from Stureplan 4
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);

  const calculateTotal = (event: BoosterEvent) => {
    const addonsTotal = event.addons
      .filter(a => a.selected)
      .reduce((sum, a) => sum + a.price_sek, 0);
    return event.base_price_sek + addonsTotal;
  };

  const handleCompletePayment = () => {
    if (!checkoutEvent) return;
    const total = calculateTotal(checkoutEvent);
    onBookEvent(checkoutEvent.id, selectedPaymentMethod, total);
    setShowCheckoutSuccess(true);
  };

  const handleIssueGuestPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    onCreateGuestPass({
      guest_name: guestName,
      guest_email: guestEmail,
      guest_company: guestCompany,
      target_hub: selectedHub.name,
      target_date: guestDate
    });
    setShowNewGuestModal(false);
    setGuestName('');
    setGuestEmail('');
    setGuestCompany('');
  };

  const isGoldOrSilver = currentUser.membership_level === 'GOLD' || currentUser.membership_level === 'SILVER';

  return (
    <AdminInspect
      component="EventBookingModule.tsx"
      sourceTable="public.events / event_addons / guest_passes"
      columns={['id', 'title', 'location', 'spots_remaining', 'is_booked', 'addons', 'check_in_status']}
      notes="Eventbokning med tillval, gästpass och geo-fencing incheckning"
    >
      <div className="space-y-6">
      
      {/* Top Banner & Module Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Event med Tillval, Incheckning & Gästpass
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              Modul V3
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Boka fysiska hubbträffar med hotell/VIP-tillval, checka in via geo-fencing och bjud in kollegor.
          </p>
        </div>

        <div className="flex bg-[#F4F5F7] p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'EVENTS' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nätverksträffar & Tillval
          </button>
          <button
            onClick={() => setActiveTab('CHECKIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'CHECKIN' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Smart Incheckning
          </button>
          <button
            onClick={() => setActiveTab('GUEST_PASS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'GUEST_PASS' ? 'bg-white text-[#800020] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gästinbjudningar (Pass)
          </button>
        </div>
      </div>

      {/* View 1: Event List with Tillval */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map(event => {
              const total = calculateTotal(event);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between space-y-4 transition hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">
                        {event.hub_name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {event.spots_left} platser kvar
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 font-display leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-gray-600">
                      {event.description}
                    </p>

                    <div className="bg-[#F4F5F7] p-3 rounded-xl space-y-1.5 text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                        <span className="font-semibold">{event.date_str}</span>
                        <span className="text-gray-400">•</span>
                        <span>{event.time_str}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#800020]" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Tillval / Add-ons Selector */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Exklusiva Tillval (Bokas i samma utcheckning)</span>
                      </h4>

                      <div className="space-y-2">
                        {event.addons.map(addon => (
                          <div
                            key={addon.id}
                            onClick={() => onToggleAddon(event.id, addon.id)}
                            className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                              addon.selected
                                ? 'bg-[#800020]/5 border-[#800020]'
                                : 'bg-white border-gray-200 hover:bg-[#F4F5F7]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                addon.selected ? 'bg-[#800020] border-[#800020] text-white' : 'border-gray-300'
                              }`}>
                                {addon.selected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-900">{addon.name}</div>
                                <div className="text-[10px] text-gray-500">{addon.description}</div>
                              </div>
                            </div>
                            <span className="text-xs font-extrabold text-[#800020] whitespace-nowrap">
                              +{formatSek(addon.price_sek)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Totalt pris:</span>
                      <span className="text-lg font-black text-gray-900 font-display">
                        {total === 0 ? '0 SEK (Medlemsförmån)' : formatSek(total)}
                      </span>
                    </div>

                    {event.is_booked ? (
                      <button
                        onClick={() => setActiveTab('CHECKIN')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Bokad • Checka in</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCheckoutEvent(event)}
                        className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs"
                        id={`btn-checkout-event-${event.id}`}
                      >
                        Gå till Utcheckning →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Smart Incheckning med Geo-fencing & QR */}
      {activeTab === 'CHECKIN' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display">
              Smart Incheckning med Geo-fencing
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              När du närmar dig den fysiska hubben detekteras din position automatiskt via GPS och du kan bekräfta din ankomst med ett klick eller via QR-kod.
            </p>
          </div>

          {/* Geo-fencing status card */}
          <div className="p-5 rounded-2xl bg-[#F4F5F7] border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#800020]" />
                <span className="text-xs font-bold text-gray-900">Mötesplats: {selectedHub.address}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Inom Geo-fence ({geoDistance} meter kvar)
              </span>
            </div>

            {/* Visual Radar Distance indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Avstånd till entrén:</span>
                <span className="font-bold text-emerald-700">{geoDistance} m (Radie: {selectedHub.radius_m}m)</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: '92%' }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
              💡 <strong>Geo-fencing verifierad:</strong> Du befinner dig på plats för <em>Stora Booster-Frukosten & B2B Matchmaking</em>.
            </div>
          </div>

          {/* Check-in Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setCheckInDone(true);
                onCheckInEvent('ev_spring_2026');
              }}
              className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-2 ${
                checkInDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-[#800020] hover:bg-[#580016] text-white'
              }`}
              id="btn-auto-checkin-geofence"
            >
              <Check className="w-6 h-6" />
              <div className="font-bold text-sm">
                {checkInDone ? '✓ Incheckad på frukostmötet' : '1-Klick Snabb-Incheckning'}
              </div>
              <span className="text-[11px] opacity-80">
                {checkInDone ? 'Registrerad i deltagarlistan' : 'Använder verifierat GPS-läge'}
              </span>
            </button>

            <button
              onClick={() => setIsScanningQr(!isScanningQr)}
              className="p-4 rounded-2xl border border-gray-200 hover:bg-[#F4F5F7] text-gray-800 text-center transition flex flex-col items-center justify-center space-y-2"
              id="btn-scan-qr-checkin"
            >
              <QrCode className="w-6 h-6 text-[#800020]" />
              <div className="font-bold text-sm">Skanna Hubbens QR-kod</div>
              <span className="text-[11px] text-gray-500">Om GPS-precisionen är låg</span>
            </button>
          </div>

          {/* Simulated QR Code Camera Scanner */}
          {isScanningQr && (
            <div className="p-4 bg-gray-900 text-white rounded-2xl text-center space-y-3 animate-in fade-in">
              <div className="w-48 h-48 border-2 border-dashed border-emerald-400 mx-auto rounded-2xl flex items-center justify-center relative overflow-hidden bg-black">
                <div className="w-full h-1 bg-emerald-400 absolute top-1/2 -translate-y-1/2 animate-bounce" />
                <QrCode className="w-16 h-16 text-gray-600" />
              </div>
              <p className="text-xs text-gray-300">Rikta kameran mot QR-skylten vid entrén på Stureplan 4.</p>
              <button
                onClick={() => {
                  setCheckInDone(true);
                  setIsScanningQr(false);
                  onCheckInEvent('ev_spring_2026');
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold"
              >
                Simulera godkänd QR-skanning
              </button>
            </div>
          )}

          {checkInDone && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 text-center">
              <span className="font-bold block text-sm">🎉 Välkommen till Hubb Stockholm City!</span>
              <p>+50 Booster Score har tilldelats din profil. Du syns nu som aktiv i nätverksminglet.</p>
            </div>
          )}

        </div>
      )}

      {/* View 3: Gästinbjudningssystem (Guest Pass) */}
      {activeTab === 'GUEST_PASS' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base font-display flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#800020]" />
                <span>Gästinbjudningssystem (Digital Guest Pass)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Som Guld- och Silvermedlem kan du bjuda in externa beslutsfattare och potentiella nya medlemmar till din hubbträff.
              </p>
            </div>

            {isGoldOrSilver ? (
              <button
                onClick={() => setShowNewGuestModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs"
                id="btn-issue-guest-pass"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Skapa Gästpass</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl">
                Kräver Silver- eller Guldmedlemskap
              </span>
            )}
          </div>

          {/* Active Guest Passes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guestPasses.map(pass => (
              <div
                key={pass.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Gold VIP border on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#800020] to-amber-600" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#800020]/10 text-[#800020]">
                      VIP Guest Pass
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pass.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pass.status === 'ACTIVE' ? 'Aktivt' : 'Nyttjat'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{pass.guest_name}</h4>
                    <p className="text-xs text-gray-500">{pass.guest_company} • {pass.guest_email}</p>
                  </div>

                  <div className="bg-[#F4F5F7] p-3 rounded-xl space-y-1 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mötesplats:</span>
                      <span className="font-semibold">{pass.target_hub}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giltigt datum:</span>
                      <span className="font-semibold">{pass.target_date}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200">
                      <span className="text-gray-500">Inbjudningskod:</span>
                      <span className="font-mono font-bold text-[#800020]">{pass.code}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Inbjuden av {currentUser.full_name}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://boosterfriends.se/pass/${pass.code}`);
                      alert(`Kopierade direktlänk för ${pass.guest_name} till urklipp!`);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#800020] hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Dela inbjudningslänk</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal with Payment Gateways */}
      {checkoutEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#800020]" />
                <span>Kassa: Boka Nätverksträff</span>
              </h3>
              <button onClick={() => setCheckoutEvent(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showCheckoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Bokning Bekräftad!</h4>
                <p className="text-xs text-gray-600">
                  Bekräftelse och kalenderinbjudan har skickats till {currentUser.email}.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setShowCheckoutSuccess(false);
                      setCheckoutEvent(null);
                      setActiveTab('CHECKIN');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#580016]"
                  >
                    Klar • Se Incheckning
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <div className="p-3 bg-[#F4F5F7] rounded-xl text-xs space-y-1">
                  <div className="font-bold text-gray-900">{checkoutEvent.title}</div>
                  <div className="text-gray-600">{checkoutEvent.date_str} • {checkoutEvent.time_str}</div>
                  <div className="text-gray-500">{checkoutEvent.location}</div>
                </div>

                {/* Selected addons breakdown */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Träffinträde:</span>
                    <span>{checkoutEvent.base_price_sek === 0 ? '0 SEK (Medlem)' : formatSek(checkoutEvent.base_price_sek)}</span>
                  </div>
                  {checkoutEvent.addons.filter(a => a.selected).map(a => (
                    <div key={a.id} className="flex justify-between text-xs text-gray-800 font-medium">
                      <span>+ {a.name}:</span>
                      <span>{formatSek(a.price_sek)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                    <span>Att betala:</span>
                    <span className="text-[#800020] font-display text-base">
                      {formatSek(calculateTotal(checkoutEvent))}
                    </span>
                  </div>
                </div>

                {/* Payment Methods as requested: Swish Commerce, Stripe, Fortnox B2B Faktura */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Välj betalsätt (V3 API Gateways):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('SWISH')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                        selectedPaymentMethod === 'SWISH'
                          ? 'border-[#800020] bg-[#800020]/10 text-[#800020]'
                          : 'border-gray-200 hover:bg-[#F4F5F7] text-gray-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Swish API</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('STRIPE')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                        selectedPaymentMethod === 'STRIPE'
                          ? 'border-[#800020] bg-[#800020]/10 text-[#800020]'
                          : 'border-gray-200 hover:bg-[#F4F5F7] text-gray-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>Stripe Kort</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('FAKTURA')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                        selectedPaymentMethod === 'FAKTURA'
                          ? 'border-[#800020] bg-[#800020]/10 text-[#800020]'
                          : 'border-gray-200 hover:bg-[#F4F5F7] text-gray-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>B2B Faktura</span>
                    </button>
                  </div>
                </div>

                {selectedPaymentMethod === 'SWISH' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Swish Commerce öppnar automatiskt appen eller visar betalnings-QR för mobilbetalning.</span>
                  </div>
                )}

                {selectedPaymentMethod === 'FAKTURA' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <span className="font-bold block">Fortnox / Visma B2B API:</span>
                    <p>Faktura ställs direkt till {currentUser.company_name} med 30 dagars betalvillkor.</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCheckoutEvent(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    className="px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition"
                    id="btn-confirm-payment"
                  >
                    Slutför Betalning & Boka
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal: Skapa Nytt Gästpass */}
      {showNewGuestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#800020]" />
                <span>Skapa Digitalt Gästpass</span>
              </h3>
              <button onClick={() => setShowNewGuestModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueGuestPass} className="space-y-3 my-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gästens Fullständiga Namn</label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. Anders Svensson"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gästens E-postadress</label>
                <input
                  type="email"
                  required
                  placeholder="anders@foretaget.se"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Företag & Roll</label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. Nordic Sales Group • COO"
                  value={guestCompany}
                  onChange={e => setGuestCompany(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Giltig på frukostmöte</label>
                <input
                  type="text"
                  value={guestDate}
                  onChange={e => setGuestDate(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewGuestModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold"
                >
                  Generera & Skicka Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </AdminInspect>
  );
};
