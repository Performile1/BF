import React, { useState } from 'react';
import { 
  Tag, 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Calendar, 
  Users, 
  Plus, 
  ArrowRight, 
  Percent, 
  Clock, 
  Award, 
  ShieldCheck, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { PromoCode, FreeTrialPass, Member, Hub } from '../../types';

interface PromoAndTrialsModuleProps {
  currentUser: Member;
  hubs: Hub[];
  promoCodes?: PromoCode[];
  trialPasses?: FreeTrialPass[];
  onCreateTrialPass: (guestName: string, guestEmail: string, hubId: string) => void;
  onRedeemTrialPass: (passId: string) => void;
  onCreatePromoCode: (code: Omit<PromoCode, 'id' | 'current_redemptions'>) => void;
}

export const PromoAndTrialsModule: React.FC<PromoAndTrialsModuleProps> = ({
  currentUser,
  hubs = [],
  promoCodes = [],
  trialPasses = [],
  onCreateTrialPass,
  onRedeemTrialPass,
  onCreatePromoCode
}) => {
  const [activeTab, setActiveTab] = useState<'TRIAL_PASSES' | 'PROMO_CODES' | 'CREATE_PROMO'>('TRIAL_PASSES');

  // Trial Pass creation state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedTrialHub, setSelectedTrialHub] = useState(hubs[0]?.id || 'hub_stockholm');
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);
  const [passCreatedNotification, setPassCreatedNotification] = useState(false);

  // New promo code form state
  const [newCodeName, setNewCodeName] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | 'EXTRA_DAYS' | 'FREE_MONTH'>('PERCENTAGE');
  const [newDiscountValue, setNewDiscountValue] = useState<number>(20);
  const [newDescription, setNewDescription] = useState('');
  const [newMaxRedemptions, setNewMaxRedemptions] = useState<number>(50);
  const [newValidUntil, setNewValidUntil] = useState('2026-12-31');

  const handleCopyLink = (passId: string) => {
    const url = `https://boosterfriends.se/trial?pass_token=${passId}`;
    navigator.clipboard?.writeText(url);
    setCopiedPassId(passId);
    setTimeout(() => setCopiedPassId(null), 2500);
  };

  const handleSubmitTrialPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    onCreateTrialPass(guestName, guestEmail, selectedTrialHub);
    setGuestName('');
    setGuestEmail('');
    setPassCreatedNotification(true);
    setTimeout(() => setPassCreatedNotification(false), 3000);
  };

  const handleCreatePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;
    onCreatePromoCode({
      code: newCodeName.toUpperCase(),
      discount_type: newDiscountType,
      discount_value: newDiscountValue,
      description: newDescription || `Kampanjrabatt ${newCodeName.toUpperCase()}`,
      valid_until: newValidUntil,
      max_redemptions: newMaxRedemptions,
      is_active: true
    });
    setNewCodeName('');
    setNewDescription('');
    setActiveTab('PROMO_CODES');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-rose-900 to-[#800020] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
          <Gift className="w-3.5 h-3.5" />
          <span>Master Kravspecifikation V7 • Growth & Referrals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kampanjer & Prova-På-Dagar (Trial Passes)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed">
          Bjud in potentiella medlemmar till fria testdagar på hubben eller tillämpa dynamiska rabattkoder för medlemskap och extra coworking-klippkort. När en inbjuden gäst checkar in belönas både du och gästen med <strong>+50 Booster Points</strong>!
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('TRIAL_PASSES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'TRIAL_PASSES'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Prova-på-dagar (Free Trial Passes)
          </button>
          <button
            onClick={() => setActiveTab('PROMO_CODES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'PROMO_CODES'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Aktiva Kampanjkoder ({promoCodes.length})
          </button>
          <button
            onClick={() => setActiveTab('CREATE_PROMO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CREATE_PROMO'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            + Skapa Kampanjkod (Admin)
          </button>
        </div>
      </div>

      {/* TAB 1: TRIAL PASSES */}
      {activeTab === 'TRIAL_PASSES' && (
        <div className="space-y-6">
          {/* Create Trial Pass Box */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ge bort 1 gratis coworking-dag (+50 BP referral-bonus)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Skapa ett personligt Prova-på-pass (Free Trial)
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Känner du en företagare eller frilansare som borde uppleva Booster Friends? Skicka en personlig inbjudan med QR-kod och tillgång till flexplats, kaffe och nätverksmingel.
              </p>

              <form onSubmit={handleSubmitTrialPass} className="mt-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Gästens Namn:</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="T.ex. Johan Lindström"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Gästens E-postadress:</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="johan@foretag.se"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Hubb för prova-på-dagen:</label>
                  <select
                    value={selectedTrialHub}
                    onChange={(e) => setSelectedTrialHub(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {hubs.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    Giltigt i 30 dagar från utskick.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Generera Gästpass</span>
                  </button>
                </div>

                {passCreatedNotification && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
                    ✓ Prova-på-pass genererat! Länk finns i listan nedan redo att delas.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Active and Issued Trial Passes */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Utfärdade Prova-På-Pass ({trialPasses.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Håll koll på dina inbjudna gäster och se när de löser in sitt pass på hubben.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trialPasses.map(pass => {
                const isRedeemed = pass.status === 'REDEEMED';
                return (
                  <div
                    key={pass.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                      isRedeemed
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-gray-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isRedeemed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isRedeemed ? 'Incheckad & Förbrukad' : 'Aktiv Inbjudan'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {pass.pass_code}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm">
                        {pass.guest_name}
                      </h4>
                      <p className="text-xs text-gray-500">{pass.guest_email}</p>

                      <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                        <div>📍 Plats: <strong>{pass.assigned_hub_name}</strong></div>
                        <div>📅 Giltigt t.o.m: <strong>{pass.valid_until}</strong></div>
                        <div>👤 Inbjudare: {pass.invited_by_name}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      {!isRedeemed ? (
                        <>
                          <button
                            onClick={() => handleCopyLink(pass.id)}
                            className="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100 transition flex items-center justify-center gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{copiedPassId === pass.id ? 'Kopierad!' : 'Dela länk'}</span>
                          </button>
                          <button
                            onClick={() => onRedeemTrialPass(pass.id)}
                            title="Receptionen validerar pass"
                            className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                          >
                            Validera vid disk
                          </button>
                        </>
                      ) : (
                        <div className="w-full text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>+50 BP utbetalda till båda</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMO CODES OVERVIEW */}
      {activeTab === 'PROMO_CODES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promoCodes.map(promo => (
              <div
                key={promo.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-[#800020] font-mono font-bold text-sm tracking-wider">
                      {promo.code}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Aktiv
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">
                    {promo.description}
                  </h3>

                  <div className="text-2xl font-bold text-gray-900">
                    {promo.discount_type === 'PERCENTAGE' && `${promo.discount_value}% Rabatt`}
                    {promo.discount_type === 'FIXED_AMOUNT' && `${promo.discount_value} kr Rabatt`}
                    {promo.discount_type === 'EXTRA_DAYS' && `+${promo.discount_value} Fria Flexdagar`}
                    {promo.discount_type === 'FREE_MONTH' && `1 Månad 100% Fri`}
                  </div>

                  <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                    <div>📅 Gäller t.o.m: <strong>{promo.valid_until}</strong></div>
                    <div>🎯 Utnyttjad: <strong>{promo.current_redemptions}</strong> av max {promo.max_redemptions} gånger</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(promo.code);
                      alert(`Kampanjkod ${promo.code} kopierad till urklipp!`);
                    }}
                    className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopiera Kod ({promo.code})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE PROMO CODE (ADMIN) */}
      {activeTab === 'CREATE_PROMO' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] text-xs font-bold">
              Admin & Marknad
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Skapa Ny Dynamisk Kampanjkod
            </h2>
          </div>

          <form onSubmit={handleCreatePromoSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Kampanjkod (Versaler):</label>
              <input
                type="text"
                required
                value={newCodeName}
                onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                placeholder="T.ex. SOMMAR2026 eller GULDSTART"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Typ av förmån:</label>
                <select
                  value={newDiscountType}
                  onChange={(e) => setNewDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                >
                  <option value="PERCENTAGE">Procentuell rabatt (%)</option>
                  <option value="FIXED_AMOUNT">Fast beloppsavdrag (SEK)</option>
                  <option value="EXTRA_DAYS">Extra fria coworking-dagar</option>
                  <option value="FREE_MONTH">1 Månad fri prova-på</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Förmånens värde:</label>
                <input
                  type="number"
                  min={1}
                  value={newDiscountValue}
                  onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Beskrivning av kampanj:</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="T.ex. 20% på årsavgiften för nya medlemmar"
                className="w-full px-3 py-2 rounded-xl border border-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Max antal inlösningar:</label>
                <input
                  type="number"
                  min={1}
                  value={newMaxRedemptions}
                  onChange={(e) => setNewMaxRedemptions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Giltig till och med:</label>
                <input
                  type="date"
                  value={newValidUntil}
                  onChange={(e) => setNewValidUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('PROMO_CODES')}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#5a0016] text-white font-bold uppercase tracking-wider"
              >
                Publicera Kampanjkod
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
