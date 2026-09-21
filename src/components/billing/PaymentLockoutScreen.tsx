import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  LogOut,
  Clock,
  PhoneCall
} from 'lucide-react';
import { Member, MembershipLevel } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface PaymentLockoutScreenProps {
  member: Member;
  amountDueSek?: number;
  daysOverdue?: number;
  onPaymentSuccess: () => void;
  onLogout?: () => void;
}

export const PaymentLockoutScreen: React.FC<PaymentLockoutScreenProps> = ({
  member,
  amountDueSek = 3490,
  daysOverdue = 7,
  onPaymentSuccess,
  onLogout
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'SWISH' | 'CARD'>('SWISH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [swishPhone, setSwishPhone] = useState(member.phone || '070-123 45 67');

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 1200);
  };

  return (
    <AdminInspect
      component="PaymentLockoutScreen.tsx"
      sourceTable="public.member_billing_status / invoices"
      columns={['member_id', 'status', 'amount_due_sek', 'days_overdue', 'payment_method']}
      notes="Spärrvy vid obetald faktura eller utgången provperiod med Swish/Kort-betalning"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#3b000f] to-gray-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md text-gray-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-200/50 space-y-6 relative z-10 animate-in zoom-in-95 duration-300">
        
        {/* Warning Icon Badge */}
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Spärrat Konto • Utebliven Betalning</span>
          </span>
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Ditt medlemskap är förfallet
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Hej <strong>{member.full_name}</strong>. Den ordinarie månadsdragningen för ditt <strong>{member.membership_level}</strong>-medlemskap ({member.company_name}) kunde inte genomföras och respittiden på {daysOverdue} dagar har passerats.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
            ⚠️ För att få tillgång till Booster Friends, hubbar, inpassering och events behöver du slutföra din betalning. Ditt konto låses upp omedelbart så fort betalningen är godkänd.
          </div>
        </div>

        {/* Invoice Summary Box */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Faktura / Månadsavgift:</span>
            <span className="font-mono text-gray-800">BF-2026-0891</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Plan & Period:</span>
            <span className="font-semibold text-gray-800">{member.membership_level} (Månadsvis)</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Förfallodatum:</span>
            <span className="text-rose-600 font-bold">{daysOverdue} dagar försenad</span>
          </div>
          <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-200 pt-2">
            <span>Totalt att betala:</span>
            <span className="font-mono text-lg text-[#800020]">{amountDueSek.toLocaleString('sv-SE')} SEK</span>
          </div>
        </div>

        {/* Instant Payment Form */}
        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-black text-base">Betalning Godkänd!</h3>
            <p className="text-xs text-emerald-700">Ditt medlemskap är nu återställt och spärren har lyfts. Omdirigerar till plattformen...</p>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Välj direktbetalningsmetod:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('SWISH')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    paymentMethod === 'SWISH'
                      ? 'bg-rose-50/50 border-[#800020] ring-1 ring-[#800020]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Swish</div>
                      <div className="text-[10px] text-gray-500">Direkt upplåsning</div>
                    </div>
                  </div>
                  {paymentMethod === 'SWISH' && <CheckCircle2 className="w-4 h-4 text-[#800020]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    paymentMethod === 'CARD'
                      ? 'bg-rose-50/50 border-[#800020] ring-1 ring-[#800020]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Betalkort</div>
                      <div className="text-[10px] text-gray-500">Stripe Checkout</div>
                    </div>
                  </div>
                  {paymentMethod === 'CARD' && <CheckCircle2 className="w-4 h-4 text-[#800020]" />}
                </button>
              </div>
            </div>

            {paymentMethod === 'SWISH' && (
              <div className="space-y-2 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 text-xs">
                <label className="block font-semibold text-emerald-900 text-[11px]">
                  Swish-nummer (kopplat till din BankID-app):
                </label>
                <input
                  type="tel"
                  required
                  value={swishPhone}
                  onChange={e => setSwishPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-gray-900 font-mono text-xs font-bold"
                  placeholder="070-XXX XX XX"
                />
                <span className="text-[10px] text-emerald-700 block">
                  En Swish-begäran skickas automatiskt till din mobil för signering med Mobilt BankID.
                </span>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs text-gray-600">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Stripe 3D-Secure Direktbetalning</span>
                </div>
                <p className="text-[11px]">
                  Ditt kort debiteras {amountDueSek} SEK och framtida månadsdragningar återupptas på detta kort.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-[#800020] hover:bg-[#660018] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-rose-900/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Behandlar och verifierar betalning...</span>
                </>
              ) : (
                <>
                  <span>Slutför Betalning & Lås Upp Kontot Nu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Support and Exit */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-gray-400" />
            <span>Behöver du hjälp? Kontakta <a href="mailto:billing@boosterfriends.se" className="text-[#800020] font-semibold hover:underline">ekonomi@boosterfriends.se</a></span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-700 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logga ut</span>
            </button>
          )}
        </div>

      </div>
    </div>
    </AdminInspect>
  );
};
