import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Gift, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  HelpCircle, 
  FileText, 
  Send, 
  RefreshCw, 
  Lock,
  Building2,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Member, 
  MembershipLevel, 
  InvoiceRecord, 
  GiftUpgradeRecord, 
  MembershipPackageDefinition, 
  PaymentStatus 
} from '../../types';
import { INITIAL_MEMBERSHIP_PACKAGES, INITIAL_INVOICES } from '../../data/billingAndRulesData';

interface MembershipBillingModuleProps {
  currentUser: Member;
  allMembers: Member[];
  packages?: MembershipPackageDefinition[];
  invoices?: InvoiceRecord[];
  onUpdateMemberLevel: (memberId: string, newLevel: MembershipLevel) => void;
  onAwardPoints?: (points: number, reason: string) => void;
  onSimulateLockout?: () => void;
  onUpdateMemberPaymentStatus?: (memberId: string, status: PaymentStatus) => void;
}

export const MembershipBillingModule: React.FC<MembershipBillingModuleProps> = ({
  currentUser,
  allMembers,
  packages = INITIAL_MEMBERSHIP_PACKAGES,
  invoices = INITIAL_INVOICES,
  onUpdateMemberLevel,
  onAwardPoints,
  onSimulateLockout,
  onUpdateMemberPaymentStatus
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [selectedPlanToChange, setSelectedPlanToChange] = useState<MembershipLevel | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeActionType, setStripeActionType] = useState<'UPGRADE' | 'DOWNGRADE' | 'PORTAL'>('UPGRADE');
  
  // Gift Upgrade via BP modal state
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftRecipientId, setGiftRecipientId] = useState<string>('');
  const [giftTargetTier, setGiftTargetTier] = useState<MembershipLevel>('SILVER');
  const [giftSuccessMessage, setGiftSuccessMessage] = useState<string | null>(null);

  // Sabbatical / Pause state
  const [isPaused, setIsPaused] = useState(currentUser.is_paused || false);
  const [pauseDurationMonths, setPauseDurationMonths] = useState<number>(1);
  const [showPauseModal, setShowPauseModal] = useState(false);

  // Invoice modal view state
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceRecord | null>(null);
  const [userInvoices, setUserInvoices] = useState<InvoiceRecord[]>(() => {
    return invoices.filter(inv => inv.recipient_email === currentUser.email || inv.recipient_name === currentUser.full_name);
  });

  const [notificationNotice, setNotificationNotice] = useState<string | null>(null);

  // Current active package definition
  const currentPkg = packages.find(p => p.level === currentUser.membership_level) || packages[2];
  
  // Pending downgrade notice (if member downgraded during billing cycle)
  const [pendingDowngrade, setPendingDowngrade] = useState<MembershipLevel | null>(null);

  // Filter other members for gift selection
  const eligibleGiftRecipients = allMembers.filter(m => m.id !== currentUser.id);

  // Calculate Proration for upgrade
  const calculateProration = (targetLevel: MembershipLevel) => {
    const targetPkg = packages.find(p => p.level === targetLevel);
    if (!targetPkg) return { diffSek: 0, daysRemaining: 18, proratedAmount: 0 };
    
    const currentMonthly = currentPkg.monthly_price_sek;
    const targetMonthly = targetPkg.monthly_price_sek;
    const priceDiff = Math.max(0, targetMonthly - currentMonthly);
    const daysRemaining = 18; // 18 of 30 days left in current billing period
    const proratedAmount = Math.round((priceDiff / 30) * daysRemaining);

    return {
      diffSek: priceDiff,
      daysRemaining,
      proratedAmount
    };
  };

  // Handle plan change initiation
  const handleInitiatePlanChange = (targetLevel: MembershipLevel) => {
    if (targetLevel === currentUser.membership_level) return;
    
    setSelectedPlanToChange(targetLevel);
    const isUpgrade = 
      (currentUser.membership_level === 'BRONZE') || 
      (currentUser.membership_level === 'SILVER' && targetLevel === 'GOLD');

    setStripeActionType(isUpgrade ? 'UPGRADE' : 'DOWNGRADE');
    setShowStripeModal(true);
  };

  // Confirm plan change via Stripe Customer Portal / Checkout simulation
  const handleConfirmPlanChange = () => {
    if (!selectedPlanToChange) return;

    if (stripeActionType === 'UPGRADE') {
      onUpdateMemberLevel(currentUser.id, selectedPlanToChange);
      setPendingDowngrade(null);
      setNotificationNotice(`🚀 Ditt medlemskap är nu uppgraderat till ${selectedPlanToChange}! Kvittot har skickats till ${currentUser.email}.`);
      
      // Add new paid invoice record
      const proration = calculateProration(selectedPlanToChange);
      const newInv: InvoiceRecord = {
        id: `inv_upg_${Date.now()}`,
        invoice_number: `BF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        amount_sek: proration.proratedAmount,
        status: 'PAID',
        plan: selectedPlanToChange,
        recipient_name: currentUser.full_name,
        recipient_email: currentUser.email,
        company_name: currentUser.company_name,
        vat_amount_sek: Math.round(proration.proratedAmount * 0.25),
        pdf_url: '#'
      };
      setUserInvoices(prev => [newInv, ...prev]);

    } else {
      // Downgrade takes effect at next billing period
      setPendingDowngrade(selectedPlanToChange);
      setNotificationNotice(`ℹ️ Din ändring till ${selectedPlanToChange} är schemalagd och träder i kraft vid nästa faktureringsperiod (2026-10-01). Du behåller full tillgång till ${currentUser.membership_level} fram till dess.`);
    }

    setShowStripeModal(false);
    setSelectedPlanToChange(null);
    setTimeout(() => setNotificationNotice(null), 6000);
  };

  // Handle Gift Upgrade with Booster Points (BP)
  const handleSendGiftUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftRecipientId) return;

    const bpCost = giftTargetTier === 'GOLD' ? 2500 : 1000;
    if (currentUser.booster_score < bpCost) {
      alert(`Du har ${currentUser.booster_score} BP, men behöver ${bpCost} BP för denna gåva.`);
      return;
    }

    const recipient = allMembers.find(m => m.id === giftRecipientId);
    if (!recipient) return;

    // Deduct BP
    if (onAwardPoints) {
      onAwardPoints(-bpCost, `Gåva: 1 månads ${giftTargetTier}-uppgradering till ${recipient.full_name}`);
    }

    // Upgrade recipient tier for 30 days
    onUpdateMemberLevel(recipient.id, giftTargetTier);

    setGiftSuccessMessage(`🎁 Du har bjudit ${recipient.full_name} på 1 månads ${giftTargetTier}-medlemskap! ${bpCost} BP har dragits från ditt saldo och en personlig gåvonotis har skickats till medlemmen.`);
    setShowGiftModal(false);
    setGiftRecipientId('');

    setTimeout(() => setGiftSuccessMessage(null), 6000);
  };

  // Toggle Sabbatical / Pause
  const handleTogglePause = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    setShowPauseModal(false);

    if (nextState) {
      setNotificationNotice(`⏸️ Ditt medlemskap har pausats i ${pauseDurationMonths} månad(er). Inga dragningar görs och ditt medlemskap återupptas automatiskt.`);
    } else {
      setNotificationNotice(`▶️ Välkommen tillbaka! Ditt medlemskap är nu återaktiverat.`);
    }
    setTimeout(() => setNotificationNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      {notificationNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notificationNotice}</span>
          </div>
          <button onClick={() => setNotificationNotice(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Stäng
          </button>
        </div>
      )}

      {giftSuccessMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{giftSuccessMessage}</span>
          </div>
          <button onClick={() => setGiftSuccessMessage(null)} className="text-amber-800 hover:text-amber-950 text-xs font-bold">
            Stäng
          </button>
        </div>
      )}

      {/* 1. AKTUELL STATUS CARD (Hero Dashboard Widget) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#800020]/10 via-amber-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Aktivt Medlemskap
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${currentPkg.badge_color}`}>
                {currentPkg.name}
              </span>
              {isPaused ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <PauseCircle className="w-3 h-3" />
                  <span>Pausat (Sabbatical)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Aktiv & Betald via Stripe</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {currentUser.full_name} ({currentUser.company_name})
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {currentPkg.description}
            </p>

            {pendingDowngrade && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Schemalagd nedgradering till <strong>{pendingDowngrade}</strong> träder i kraft den 2026-10-01.</span>
              </div>
            )}
          </div>

          {/* Quick Metrics & Stripe Portal link */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72 shrink-0">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="text-[11px] text-gray-500 font-semibold flex items-center justify-between">
                <span>Nästa månadsdragning</span>
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="text-sm font-black text-gray-900">
                1 oktober 2026
              </div>
              <div className="text-[11px] text-gray-500">
                {billingCycle === 'MONTHLY' 
                  ? `${currentPkg.monthly_price_sek.toLocaleString('sv-SE')} SEK / månad (exkl. moms)`
                  : `${currentPkg.annual_price_sek.toLocaleString('sv-SE')} SEK / år (exkl. moms)`}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-800 shadow-2xs">
                  <CreditCard className="w-4 h-4 text-[#800020]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Visa •••• 4242</div>
                  <div className="text-[10px] text-gray-500">Går ut 08/29</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setStripeActionType('PORTAL');
                  setShowStripeModal(true);
                }}
                className="text-[11px] font-bold text-[#800020] hover:underline"
              >
                Ändra kort
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGiftModal(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Gift className="w-3.5 h-3.5 text-amber-300" />
                <span>Bjud med BP</span>
              </button>
              <button
                onClick={() => setShowPauseModal(true)}
                className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition"
                title="Pausa medlemskap under resa eller sabbatical"
              >
                {isPaused ? 'Återaktivera' : 'Pausa'}
              </button>
            </div>
          </div>
        </div>

        {/* Simulator Tools (For testing lockout & features directly) */}
        {onSimulateLockout && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span>Testbänk för betalningsspärr och suspension:</span>
            </span>
            <button
              onClick={onSimulateLockout}
              className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>🧪 Testa Betalningsspärr (Lockout Screen)</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. SELF-SERVICE UPGRADE / DOWNGRADE TIERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Välj Medlemskapsnivå (Self-Service)
            </h3>
            <p className="text-xs text-gray-500">
              Uppgradera när som helst med automatisk proration, eller nedgradera inför nästa faktureringsperiod.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingCycle === 'MONTHLY' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Månadsvis
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                billingCycle === 'ANNUAL' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Årsvis</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                Spara 2 mån
              </span>
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const isCurrent = currentUser.membership_level === pkg.level;
            const price = billingCycle === 'MONTHLY' ? pkg.monthly_price_sek : pkg.annual_price_sek;
            const periodText = billingCycle === 'MONTHLY' ? '/mån' : '/år';
            
            const isHigherTier = 
              (currentUser.membership_level === 'BRONZE' && (pkg.level === 'SILVER' || pkg.level === 'GOLD')) ||
              (currentUser.membership_level === 'SILVER' && pkg.level === 'GOLD');

            return (
              <div
                key={pkg.level}
                className={`rounded-3xl p-6 border transition flex flex-col justify-between relative bg-white ${
                  isCurrent 
                    ? 'border-[#800020] ring-2 ring-[#800020]/20 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#800020] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Ditt Nuvarande Paket
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${pkg.badge_color}`}>
                        {pkg.level}
                      </span>
                      {pkg.level === 'GOLD' && (
                        <Crown className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <h4 className="text-base font-black text-gray-900">{pkg.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed min-h-[36px]">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="py-2 border-y border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
                        {price.toLocaleString('sv-SE')}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">SEK {periodText}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">exkl. 25% moms</div>
                  </div>

                  {/* Feature Checkpoints */}
                  <div className="space-y-2.5 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>{pkg.free_hub_flex_bookings_per_month}</strong> fria flexbokningar / månad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 ${pkg.access_executive_webinars ? 'text-emerald-600' : 'text-gray-300'} shrink-0`} />
                      <span className={pkg.access_executive_webinars ? '' : 'text-gray-400'}>
                        Executive Academy & Storskaliga Webinars
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 ${pkg.can_create_events_and_meetings ? 'text-emerald-600' : 'text-gray-300'} shrink-0`} />
                      <span className={pkg.can_create_events_and_meetings ? '' : 'text-gray-400'}>
                        Rättighet att skapa egna events & möten
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 ${pkg.can_publish_sponsored_banners ? 'text-emerald-600' : 'text-gray-300'} shrink-0`} />
                      <span className={pkg.can_publish_sponsored_banners ? '' : 'text-gray-400'}>
                        Publicera sponsrade banners & erbjudanden
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 ${pkg.priority_directory_placement ? 'text-emerald-600' : 'text-gray-300'} shrink-0`} />
                      <span className={pkg.priority_directory_placement ? '' : 'text-gray-400'}>
                        Prioriterad placering i medlemsregistret
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-default"
                    >
                      Aktiv Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInitiatePlanChange(pkg.level)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                        isHigherTier
                          ? 'bg-[#800020] hover:bg-[#660018] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isHigherTier ? (
                        <>
                          <span>Uppgradera till {pkg.level}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Nedgradera till {pkg.level}</span>
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FAKTURAHISTORIK & KVITTON */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-gray-900">Fakturahistorik & Kvitton</h3>
            <p className="text-xs text-gray-500">
              Alla dragningar via Stripe. Ladda ner bokföringsunderlag och momsspecifikationer.
            </p>
          </div>
          <button
            onClick={() => {
              setStripeActionType('PORTAL');
              setShowStripeModal(true);
            }}
            className="text-xs font-bold text-[#800020] hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Öppna Stripe Kundportal</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold">
                <th className="pb-3">Fakturanr</th>
                <th className="pb-3">Datum</th>
                <th className="pb-3">Beskrivning</th>
                <th className="pb-3">Belopp</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {userInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 font-mono font-bold text-gray-900">{inv.invoice_number}</td>
                  <td className="py-3 text-gray-600">{inv.date}</td>
                  <td className="py-3">
                    <span className="font-semibold text-gray-900">Booster Friends {inv.plan} Medlemskap</span>
                    <div className="text-[10px] text-gray-400">Moms: {inv.vat_amount_sek || 0} SEK</div>
                  </td>
                  <td className="py-3 font-mono font-bold text-gray-900">
                    {inv.amount_sek.toLocaleString('sv-SE')} SEK
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {inv.status === 'PAID' ? 'Betald' : 'Förfallen'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-[11px] font-bold transition inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-[#800020]" />
                      <span>Visa Faktura</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STRIPE CHECKOUT / PRORATION MODAL */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  S
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {stripeActionType === 'PORTAL' 
                      ? 'Stripe Kundportal' 
                      : stripeActionType === 'UPGRADE'
                        ? 'Bekräfta Medlemsuppgradering'
                        : 'Schemalägg Nedgradering'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Säker krypterad betalning via Stripe Billing</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStripeModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {stripeActionType === 'UPGRADE' && selectedPlanToChange && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ny medlemsnivå:</span>
                    <strong className="text-gray-900">{selectedPlanToChange}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nuvarande nivå:</span>
                    <span className="text-gray-700">{currentUser.membership_level}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Dagar kvar i månaden:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {calculateProration(selectedPlanToChange).daysRemaining} dagar
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 p-2 rounded-xl">
                    <span className="font-bold">Att betala idag (Proration):</span>
                    <span className="font-mono font-black text-sm">
                      {calculateProration(selectedPlanToChange).proratedAmount.toLocaleString('sv-SE')} SEK
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 leading-relaxed">
                  Ditt kort (Visa •••• 4242) debiteras mellanskillnaden direkt. Din nya nivå aktiveras omedelbart och du får tillgång till alla Gold-förmåner, fler flexbokningar och webinars.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowStripeModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleConfirmPlanChange}
                    className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white font-bold transition flex items-center gap-1.5"
                  >
                    <span>Bekräfta & Debetera</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {stripeActionType === 'DOWNGRADE' && selectedPlanToChange && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600 leading-relaxed">
                  Vill du nedgradera från <strong>{currentUser.membership_level}</strong> till <strong>{selectedPlanToChange}</strong>?
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                  <p className="font-bold">📅 Träder i kraft vid nästa fakturering</p>
                  <p>Du behåller din nuvarande nivå ({currentUser.membership_level}) fram till den 1 oktober 2026. Inga återbetalningar görs för redan påbörjad månad.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowStripeModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleConfirmPlanChange}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
                  >
                    Schemalägg Nedgradering
                  </button>
                </div>
              </div>
            )}

            {stripeActionType === 'PORTAL' && (
              <div className="space-y-4 text-xs">
                <p className="text-gray-600 leading-relaxed">
                  I Stripe Customer Portal kan du uppdatera betalkort, ändra faktureringsadress och ladda ner officiella moms-kvitton.
                </p>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Booster Friends Stripe Billing Sandbox</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">
                    Kort: Visa som slutar på 4242 (3D Secure aktiverat).
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowStripeModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Stäng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: BJUD PÅ UPPGRADERING VIA BOOSTER POINTS */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleSendGiftUpgrade} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Bjud en medlem på uppgradering
                  </h3>
                  <p className="text-[11px] text-gray-500">Nyttja dina Booster Points (BP) för att ge 30 dagars uppgradering</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowGiftModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">Ditt samlade BP-saldo:</span>
              <span className="font-mono font-black text-amber-950 text-sm">{currentUser.booster_score} BP</span>
            </div>

            {/* Select Recipient */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Välj Medlem som ska få gåvan:</label>
              <select
                required
                value={giftRecipientId}
                onChange={e => setGiftRecipientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-800 font-medium"
              >
                <option value="">-- Välj en kollega i nätverket --</option>
                {eligibleGiftRecipients.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.company_name}) - Nuvarande nivå: {m.membership_level}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Target Tier */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gåvopaket (30 dagars access):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGiftTargetTier('SILVER')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    giftTargetTier === 'SILVER'
                      ? 'bg-[#800020]/10 border-[#800020] text-[#800020]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-xs">1 Månad Silver</div>
                  <div className="text-[11px] font-mono mt-1 font-bold">1 000 BP</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGiftTargetTier('GOLD')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    giftTargetTier === 'GOLD'
                      ? 'bg-amber-100 border-amber-400 text-amber-950'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1">
                    <span>1 Månad Gold</span>
                    <Crown className="w-3 h-3 text-amber-500" />
                  </div>
                  <div className="text-[11px] font-mono mt-1 font-bold">2 500 BP</div>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              När du bekräftar dras poängen från din BP Ledger. Mottagaren får en notis och deras konto uppgraderas automatiskt i 30 dagar utan krav på betalkort.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
              >
                Avbryt
              </button>
              <button
                type="submit"
                disabled={!giftRecipientId || currentUser.booster_score < (giftTargetTier === 'GOLD' ? 2500 : 1000)}
                className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Skicka Uppgradering</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: PAUSA MEDLEMSKAP (SABBATICAL) */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                {isPaused ? 'Återuppta medlemskap' : 'Pausa Medlemskap (Sabbatical)'}
              </h3>
              <button onClick={() => setShowPauseModal(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            {isPaused ? (
              <p className="text-gray-600 leading-relaxed">
                Ditt medlemskap är för närvarande pausat. Genom att återuppta medlemskapet aktiveras dina hubbokningar och frukostar omedelbart.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  Ska du resa bort eller vara föräldraledig? Du kan pausa ditt medlemskap i upp till 3 månader. Under pausen görs inga dragningar från ditt kort.
                </p>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Välj längd på paus:</label>
                  <select
                    value={pauseDurationMonths}
                    onChange={e => setPauseDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value={1}>1 Månad (Återupptas 2026-10-10)</option>
                    <option value={2}>2 Månader (Återupptas 2026-11-10)</option>
                    <option value={3}>3 Månader (Återupptas 2026-12-10)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
              >
                Avbryt
              </button>
              <button
                onClick={handleTogglePause}
                className="px-4 py-2 rounded-xl bg-[#800020] text-white font-bold hover:bg-[#660018]"
              >
                {isPaused ? 'Återaktivera Nu' : 'Bekräfta Paus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VISA FAKTURA */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#800020] uppercase tracking-wider">Faktura & Kvitto</span>
                <h3 className="text-xl font-black text-gray-900">{viewingInvoice.invoice_number}</h3>
                <span className="text-xs text-gray-500">Datum: {viewingInvoice.date}</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Status: {viewingInvoice.status === 'PAID' ? 'BETALD' : 'FÖRFALLEN'}
                </span>
                <div className="text-[11px] text-gray-400 mt-1">Stripe Ref: ch_3Pz9810283</div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <strong className="text-gray-900 block">Säljare:</strong>
                <p className="text-gray-600">Booster Friends Sweden AB</p>
                <p className="text-gray-500">Org.nr: 559123-4567</p>
                <p className="text-gray-500">Kungsgatan 12, Stockholm</p>
                <p className="text-gray-500">Momsnr: SE559123456701</p>
              </div>
              <div className="space-y-1">
                <strong className="text-gray-900 block">Köpare / Medlem:</strong>
                <p className="text-gray-800 font-bold">{viewingInvoice.recipient_name}</p>
                <p className="text-gray-600">{viewingInvoice.company_name || 'inCtrl .inc'}</p>
                <p className="text-gray-500">{viewingInvoice.recipient_email}</p>
              </div>
            </div>

            {/* Line item */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 text-xs space-y-2">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Booster Friends {viewingInvoice.plan} Medlemskap</span>
                <span className="font-mono">{(viewingInvoice.amount_sek * 0.8).toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Moms (25% svensk moms)</span>
                <span className="font-mono">{(viewingInvoice.amount_sek * 0.2).toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between font-black text-sm text-gray-900 border-t border-gray-200 pt-2">
                <span>Totalt debiterat:</span>
                <span className="font-mono text-[#800020]">{viewingInvoice.amount_sek.toLocaleString('sv-SE')} SEK</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                onClick={() => alert(`Laddar ner PDF för faktura ${viewingInvoice.invoice_number}...`)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ladda ner PDF</span>
              </button>
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#660018]"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
