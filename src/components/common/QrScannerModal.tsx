import React, { useState } from 'react';
import { 
  Camera, 
  X, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Sparkles, 
  User, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import { Member, Hub } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  selectedHub: Hub;
  allMembers: Member[];
  onCheckInHub: (hubId: string) => void;
  onAwardPoints: (points: number, title: string, activityType: any) => void;
  onOpenDirectChat?: (memberId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  selectedHub,
  allMembers,
  onCheckInHub,
  onAwardPoints,
  onOpenDirectChat
}) => {
  const [scanResult, setScanResult] = useState<{
    type: 'HUB' | 'MEMBER' | 'EVENT' | 'CUSTOM';
    title: string;
    subtitle: string;
    points: number;
    details?: any;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');

  if (!isOpen) return null;

  const handleSimulateScanHub = () => {
    setIsScanning(false);
    onCheckInHub(selectedHub.id);
    setScanResult({
      type: 'HUB',
      title: `Incheckad på ${selectedHub.name}`,
      subtitle: `Verifierad närvaro på ${selectedHub.address}. Dagens hubbaktivitet är registrerad.`,
      points: 30
    });
  };

  const handleSimulateScanMember = (member: Member) => {
    setIsScanning(false);
    onAwardPoints(20, `Skannat QR-visitkort från ${member.full_name}`, 'UNIVERSAL_QR_CONNECT');
    setScanResult({
      type: 'MEMBER',
      title: `Kontakt hittad: ${member.full_name}`,
      subtitle: `${member.role_title} på ${member.company_name} • ${member.membership_level} Member`,
      points: 20,
      details: member
    });
  };

  const handleSimulateScanEvent = () => {
    setIsScanning(false);
    onAwardPoints(25, 'Eventincheckning: B2B Breakfast Sparring', 'HUB_CHECK_IN');
    setScanResult({
      type: 'EVENT',
      title: 'Incheckad på Booster Breakfast Club',
      subtitle: 'Frukostmingel & B2B Matchmaking (Convendum Lounge)',
      points: 25
    });
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsScanning(false);
    const codeUpper = manualCode.trim().toUpperCase();

    if (codeUpper.includes('HUB') || codeUpper.includes('STOCKHOLM') || codeUpper.includes('CHECKIN')) {
      onCheckInHub(selectedHub.id);
      setScanResult({
        type: 'HUB',
        title: `Manuell QR-kod verifierad: ${selectedHub.name}`,
        subtitle: `Kod "${manualCode}" godkänd och registrerad.`,
        points: 30
      });
    } else {
      onAwardPoints(15, `Skannat QR-kod "${manualCode}"`, 'HUB_CHECK_IN');
      setScanResult({
        type: 'CUSTOM',
        title: `QR-kod registrerad: ${manualCode}`,
        subtitle: 'Extern partner- eller nätverkskod verifierad.',
        points: 15
      });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-display">
                QR-Skanner & Incheckning
              </h3>
              <p className="text-[11px] text-gray-500">
                Skanna hubb-skylt eller en medlems personliga visitkort
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-5 space-y-4">
          
          {!scanResult ? (
            <div>
              {/* Simulated Camera Viewfinder */}
              <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-gray-900 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-inner flex flex-col items-center justify-center text-white">
                
                {/* Viewfinder corners */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-4 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce top-1/2" />

                {/* Central Target Reticle */}
                <div className="w-32 h-32 border border-dashed border-emerald-500/40 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-emerald-400/40 animate-pulse" />
                </div>

                {/* Camera Overlay Info */}
                <div className="absolute bottom-3 inset-x-4 text-center">
                  <span className="text-[10px] font-mono tracking-wider bg-black/60 px-2.5 py-1 rounded-full text-emerald-300 border border-emerald-500/30">
                    KAMERA AKTIV • AUTOFOKUS
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                Rikta kameran mot en QR-kod för automatisk inläsning
              </p>

              {/* Quick Simulation Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block text-center">
                  Simulera skanning med ett klick:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleSimulateScanHub}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-emerald-950 truncate">Skanna Hubb (+30 BP)</p>
                      <p className="text-[10px] text-emerald-700 truncate">{selectedHub.name.replace('Hubb ', '')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const other = allMembers.find(m => m.id !== currentUser.id) || allMembers[1];
                      handleSimulateScanMember(other);
                    }}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-blue-950 truncate">Skanna Medlem (+20 BP)</p>
                      <p className="text-[10px] text-blue-700 truncate">Visitkort (Sofia E.)</p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleSimulateScanEvent}
                  className="w-full py-1.5 px-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-900 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Skanna Frukostmingel / Event (+25 BP)</span>
                </button>
              </div>

              {/* Manual code fallback */}
              <form onSubmit={handleManualCodeSubmit} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  placeholder="Eller ange kod manuellt (t.ex. HUB-STHLM-2026)"
                  className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
                >
                  Läs av
                </button>
              </form>
            </div>
          ) : (
            /* Result View */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                  Skanning Lyckades
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2 font-display">
                  {scanResult.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  {scanResult.subtitle}
                </p>
              </div>

              {/* Points Award Badge */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center gap-2 max-w-xs mx-auto">
                <Award className="w-5 h-5 text-amber-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-950">+{scanResult.points} Booster Points tillagda</p>
                  <p className="text-[10px] text-amber-700">Ditt nya saldo har uppdaterats i realtid</p>
                </div>
              </div>

              {/* Member details if member was scanned */}
              {scanResult.details && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={scanResult.details.avatar}
                      alt={scanResult.details.full_name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#800020]"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{scanResult.details.full_name}</p>
                      <p className="text-[11px] text-gray-500">{scanResult.details.company_name}</p>
                    </div>
                  </div>

                  {onOpenDirectChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDirectChat(scanResult.details.id);
                      }}
                      className="px-3 py-1.5 bg-[#800020] text-white rounded-xl text-xs font-bold hover:bg-[#660018] transition flex items-center gap-1"
                    >
                      <span>Chatta</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={resetScanner}
                  className="flex-1 py-2 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100 transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Skanna igen</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition"
                >
                  Klar
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
