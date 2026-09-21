import React, { useState } from 'react';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Sparkles, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  X,
  CreditCard,
  Camera,
  Globe,
  ExternalLink,
  Award
} from 'lucide-react';
import { Member } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface UniversalConnectModalProps {
  currentUser: Member;
  isOpen: boolean;
  onClose: () => void;
  onSimulateConnectSuccess?: (connectedMemberName: string) => void;
  onOpenChatWith?: (memberId: string) => void;
}

export const UniversalConnectModal: React.FC<UniversalConnectModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSimulateConnectSuccess,
  onOpenChatWith
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'MY_QR' | 'WALLET' | 'CAMERA_SIMULATOR'>('MY_QR');
  const [simulatorMode, setSimulatorMode] = useState<'HAS_APP' | 'NO_APP'>('HAS_APP');
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);
  const [downloadedVCard, setDownloadedVCard] = useState(false);

  if (!isOpen) return null;

  const universalLink = `https://boosterfriends.se/connect/${currentUser.id}`;

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(universalLink).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${currentUser.full_name}`,
      `ORG:${currentUser.company_name}`,
      `TITLE:${currentUser.role_title}`,
      `TEL;TYPE=CELL:${currentUser.phone}`,
      `EMAIL:${currentUser.email}`,
      `NOTE:Booster Friends ${currentUser.membership_level}-medlem • ${currentUser.hub_name} • Booster Score: ${currentUser.booster_score} BP`,
      `URL:${universalLink}`,
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentUser.full_name.replace(/\s+/g, '_')}_kontaktkort.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedVCard(true);
    setTimeout(() => setDownloadedVCard(false), 3000);
  };

  const handleRunCameraSimulation = () => {
    setSimulatedSuccess(true);
    if (simulatorMode === 'HAS_APP' && onSimulateConnectSuccess) {
      onSimulateConnectSuccess('Kamera-scannad gäst');
    }
  };

  return (
    <AdminInspect
      component="UniversalConnectModal.tsx"
      sourceTable="public.profiles / connections"
      columns={['id', 'full_name', 'company_name', 'email', 'phone', 'linkedin_url', 'qr_code_token']}
      notes="Digitalt visitkort, QR-kod för nätverkande och Apple Wallet integration"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#5a0016] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <QrCode className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight font-display">
                Digitalt Visitkort & Universal Connect
              </h3>
              <p className="text-xs text-rose-100">
                Låt motparten skanna med sin vanliga mobilkamera
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('MY_QR'); setSimulatedSuccess(false); }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'MY_QR' 
                ? 'border-[#800020] text-[#800020]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Min QR-Kod</span>
          </button>

          <button
            onClick={() => { setActiveTab('WALLET'); setSimulatedSuccess(false); }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'WALLET' 
                ? 'border-[#800020] text-[#800020]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Apple / Google Wallet</span>
          </button>

          <button
            onClick={() => { setActiveTab('CAMERA_SIMULATOR'); setSimulatedSuccess(false); }}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'CAMERA_SIMULATOR' 
                ? 'border-[#800020] text-[#800020]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Testa Mobilkamera</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: MY QR CODE */}
          {activeTab === 'MY_QR' && (
            <div className="space-y-5 text-center">
              
              {/* Card preview */}
              <div className="bg-gradient-to-b from-[#800020]/5 via-white to-gray-50 p-6 rounded-3xl border border-[#800020]/15 shadow-sm max-w-xs mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#800020]/30 shadow-xs">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.full_name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-gray-900 leading-tight">
                      {currentUser.full_name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {currentUser.role_title} • {currentUser.company_name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                        {currentUser.membership_level}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#800020]">
                        {currentUser.booster_score} BP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Styled QR Code Box */}
                <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner inline-block">
                  <svg 
                    className="w-44 h-44 mx-auto text-[#800020]" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* QR Code pattern simulator */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" fill="currentColor" />

                    <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" fill="currentColor" />

                    <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" fill="currentColor" />

                    <rect x="38" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="50" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="50" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="44" y="36" width="12" height="12" rx="2" fill="#800020" />

                    {/* Small center logo */}
                    <circle cx="50" cy="50" r="11" fill="white" />
                    <circle cx="50" cy="50" r="8" fill="#800020" />
                    <text x="50" y="53" fill="white" fontSize="9" fontWeight="900" textAnchor="middle">B</text>

                    <rect x="38" y="68" width="8" height="8" fill="currentColor" />
                    <rect x="50" y="68" width="8" height="8" fill="currentColor" />
                    <rect x="68" y="44" width="8" height="8" fill="currentColor" />
                    <rect x="80" y="44" width="8" height="8" fill="currentColor" />
                    <rect x="68" y="58" width="8" height="8" fill="currentColor" />
                    <rect x="80" y="58" width="8" height="8" fill="currentColor" />
                    <rect x="80" y="80" width="12" height="12" fill="currentColor" />
                    <rect x="40" y="82" width="6" height="6" fill="currentColor" />
                  </svg>
                </div>

                <p className="text-[11px] text-gray-500 mt-3 font-medium">
                  Rikta mobilens kamera hit för att spara kontaktkort eller ansluta direkt.
                </p>
              </div>

              {/* Universal Link & Copy */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center justify-between gap-2">
                <div className="truncate text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Universal Deep Link
                  </span>
                  <span className="text-xs font-mono text-gray-800 truncate block">
                    {universalLink}
                  </span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-800 flex items-center gap-1.5 shrink-0 shadow-2xs transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Kopierad' : 'Kopiera'}</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadVCard}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-800 transition shadow-2xs"
                >
                  {downloadedVCard ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-gray-600" />}
                  <span>{downloadedVCard ? 'Nedladdat!' : 'Ladda ner vCard (.vcf)'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('CAMERA_SIMULATOR')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#800020] hover:bg-[#68001a] text-xs font-bold text-white transition shadow-xs"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Testa scanning</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: APPLE & GOOGLE WALLET */}
          {activeTab === 'WALLET' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#800020] flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase text-amber-300">
                      Booster Friends Pass
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white/90">
                    VIP PASS
                  </span>
                </div>

                <div className="flex items-center gap-3 my-3">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.full_name} 
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400"
                  />
                  <div>
                    <h4 className="text-base font-black text-white leading-tight">
                      {currentUser.full_name}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {currentUser.role_title} • {currentUser.company_name}
                    </p>
                    <p className="text-[11px] text-amber-400 font-bold mt-0.5">
                      {currentUser.hub_name} • {currentUser.booster_score} BP
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Giltigt tom: 31 Dec 2026</span>
                  <span className="text-white font-mono font-bold">NIVÅ: {currentUser.membership_level}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Öppna ditt QR-kort med dubbelklick på låsskärmen</span>
                </div>
                <p className="leading-relaxed">
                  Genom att spara kortet i mobilens plånbok (Apple Wallet eller Google Wallet) behöver du inte ens låsa upp eller leta efter Booster Friends-appen när du träffar en kontakt på en hubb eller ett mingel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => alert('Apple Wallet Pass genererat! I en iOS-enhet läggs passet nu till i Apple Plånbok.')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-gray-900 text-white text-xs font-bold transition shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Lägg till i Apple Wallet</span>
                </button>

                <button
                  onClick={() => alert('Google Wallet Pass genererat! I en Android-enhet sparas kortet i Google Plånbok.')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Spara i Google Wallet</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CAMERA SIMULATOR */}
          {activeTab === 'CAMERA_SIMULATOR' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-xs space-y-2">
                <span className="font-bold text-gray-900 block">
                  Välj vad som händer när motparten riktar sin mobilkamera mot din QR-kod:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setSimulatorMode('HAS_APP'); setSimulatedSuccess(false); }}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      simulatorMode === 'HAS_APP'
                        ? 'bg-white border-[#800020] text-[#800020] shadow-2xs font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <span className="block text-xs font-bold">1. Medlem med App</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Deep Linking & chatt startas</span>
                  </button>

                  <button
                    onClick={() => { setSimulatorMode('NO_APP'); setSimulatedSuccess(false); }}
                    className={`p-2.5 rounded-xl text-left border transition ${
                      simulatorMode === 'NO_APP'
                        ? 'bg-white border-[#800020] text-[#800020] shadow-2xs font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <span className="block text-xs font-bold">2. Extern gäst (Utan app)</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Webb-vCard & rekrytering</span>
                  </button>
                </div>
              </div>

              {/* Interactive camera view preview */}
              <div className="border border-gray-300 rounded-3xl p-5 bg-slate-900 text-white relative shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    Motpartens Mobilkamera
                  </span>
                  <span className="font-mono text-[10px]">boosterfriends.se/connect</span>
                </div>

                {/* Simulated Notification Banner on top of mobile screen */}
                <div className="bg-white/95 text-gray-900 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-white/20 animate-bounce">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#800020] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      B
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black leading-tight text-[#800020]">
                        Öppna boosterfriends.se
                      </p>
                      <p className="text-[11px] text-gray-600 font-medium">
                        Koppla med {currentUser.full_name} ({currentUser.company_name})
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRunCameraSimulation}
                    className="px-3 py-1.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#68001a] shrink-0 shadow-xs"
                  >
                    Klicka länk
                  </button>
                </div>

                {/* Camera Viewfinder frame */}
                <div className="my-5 border-2 border-dashed border-white/30 rounded-2xl p-6 text-center text-slate-400 text-xs">
                  <QrCode className="w-12 h-12 mx-auto mb-2 text-white/40" />
                  <span>Sökare aktiv • QR-kod identifierad i kameravyn</span>
                </div>
              </div>

              {/* Simulation Result */}
              {simulatedSuccess && (
                <div className="p-4 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-sm">
                      {simulatorMode === 'HAS_APP' ? 'App öppnades via Deep Link!' : 'Webb-visitkort öppnat i webbläsaren!'}
                    </span>
                  </div>

                  {simulatorMode === 'HAS_APP' ? (
                    <div className="space-y-2 text-xs text-emerald-900">
                      <p>
                        ✅ Kontakten kopplades omedelbart. En 1-till-1 chattkanal öppnades mellan er.
                      </p>
                      <div className="flex items-center gap-2 font-black text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-300">
                        <Zap className="w-4 h-4 text-amber-500 fill-current" />
                        <span>+20 Booster Points tilldelades till er båda för bekräftad QR-anslutning!</span>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenChatWith) onOpenChatWith('usr_sofia_eklund');
                          }}
                          className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                        >
                          Öppna Chatt med den anslutna kontakten
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-emerald-900">
                      <p>
                        Gästen som saknar appen fick upp ditt responsiva mobil-visitkort och kan spara ditt vCard med 1 klick.
                      </p>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                        <span className="text-[11px] font-bold text-gray-700 block">
                          Gästens skärmvy:
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">{currentUser.full_name}</span>
                          <span className="text-xs text-gray-500">{currentUser.phone}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={handleDownloadVCard}
                            className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-800 text-center"
                          >
                            📥 Spara i mobilbok (.vcf)
                          </button>
                          <button 
                            onClick={() => alert('Gästen omdirigeras till ansökningsformuläret för Booster Friends.')}
                            className="flex-1 py-1.5 rounded-lg bg-[#800020] text-white text-[11px] font-bold text-center"
                          >
                            🌟 Ansök om medlemskap
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#800020]" />
            Verifierat Booster Friends ID
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-800 transition"
          >
            Stäng
          </button>
        </div>

      </div>
    </div>
    </AdminInspect>
  );
};
