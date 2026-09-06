import React, { useState } from 'react';
import { 
  Gift, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  FileText, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles,
  Award,
  X
} from 'lucide-react';
import { PartnerPerk, Member } from '../../types';

interface BenefitsModuleProps {
  currentUser: Member;
  perks: PartnerPerk[];
}

export const BenefitsModule: React.FC<BenefitsModuleProps> = ({
  currentUser,
  perks
}) => {
  const [activePerkModal, setActivePerkModal] = useState<PartnerPerk | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center text-[#800020]">
              <Gift className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-display">
              Partnerförmåner, Rabatter & Betalsätt
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              Perks V3
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Exklusiva rabatter och dynamiska QR-kuponger för anslutna hotell, restauranger, flyg och SaaS-leverantörer.
          </p>
        </div>

        {/* Member level perk status */}
        <div className="bg-[#F4F5F7] p-3 rounded-2xl border border-gray-200 text-xs flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <span className="font-bold text-gray-900 block">
              {currentUser.membership_level === 'GOLD' ? 'Guldmedlem – Full Access' : `${currentUser.membership_level}-nivå`}
            </span>
            <span className="text-[11px] text-gray-500">Alla representations- och hotellförmåner är upplåsta.</span>
          </div>
        </div>
      </div>

      {/* Partner Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {perks.map(perk => (
          <div
            key={perk.id}
            className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between transition hover:shadow-md"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={perk.logo}
                    alt={perk.partner_name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 font-display">
                      {perk.partner_name}
                    </h3>
                    <span className="text-[11px] text-gray-500">{perk.category}</span>
                  </div>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#800020] text-white tracking-tight">
                  {perk.discount_badge}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {perk.description}
              </p>

              <div className="bg-[#F4F5F7] p-3 rounded-xl text-[11px] text-gray-500">
                <strong>Villkor:</strong> {perk.terms}
              </div>
            </div>

            {/* Actions: Copy Code or Show QR Coupon */}
            <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(perk.promo_code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
                title="Kopiera kampanjkod"
              >
                <Copy className="w-3.5 h-3.5 text-[#800020]" />
                <span>{copiedCode === perk.promo_code ? 'Kopierad! ✓' : perk.promo_code}</span>
              </button>

              <button
                onClick={() => setActivePerkModal(perk)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#800020] hover:bg-[#580016] text-white text-xs font-bold transition shadow-xs"
                id={`btn-open-perk-qr-${perk.id}`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Visa QR-Kupong</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Gateway Architecture Overview */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900 font-display flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#800020]" />
          <span>Integrerade Betalsätt & API:er (V3 Specifikation)</span>
        </h3>
        <p className="text-xs text-gray-500">
          Booster Friends stöder direkta betalningar via ledande nordiska finanstekniska integrationer:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F4F5F7] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Swish Commerce API</span>
              <Smartphone className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-[11px] text-gray-600">
              Direktbetalning via mobilnummer och certifierade Merchant QR-koder. 100% realtidsavstämning vid eventbokning.
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
              ✓ API V3 Aktivt
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F5F7] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Stripe Billing & Checkout</span>
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-[11px] text-gray-600">
              Kortbetalning (Visa, Mastercard, Amex), Apple Pay och Google Pay för månatliga medlemsavgifter och tillval.
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
              ✓ API V3 Aktivt
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F5F7] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-gray-900">Fortnox / Visma B2B API</span>
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-gray-600">
              Automatisk generering av PDF- och e-faktura (Peppol) ställd till företagets organisationsnummer med 30 dagars netto.
            </p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
              ✓ API V3 Aktivt
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic QR Voucher Modal */}
      {activePerkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase">Dynamisk Medlemskupong</span>
              <button onClick={() => setActivePerkModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-gray-900">{activePerkModal.partner_name}</h3>
              <div className="inline-block text-xs font-black px-3 py-1 rounded-full bg-[#800020] text-white">
                {activePerkModal.discount_badge}
              </div>
            </div>

            {/* Dynamic QR Code display */}
            <div className="p-4 bg-white border-2 border-dashed border-[#800020] rounded-2xl inline-block shadow-xs">
              <QrCode className="w-40 h-40 text-gray-900 mx-auto" />
              <span className="text-[10px] font-mono text-gray-500 mt-2 block">
                {activePerkModal.qr_value}
              </span>
            </div>

            <div className="text-xs text-gray-600">
              Visa denna QR-kod i kassan eller vid incheckning. Verifierad medlemsstatus: <strong>{currentUser.full_name} ({currentUser.membership_level})</strong>.
            </div>

            <button
              onClick={() => setActivePerkModal(null)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition"
            >
              Stäng Kupong
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
