import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  QrCode, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lock, 
  Smartphone, 
  Download, 
  RefreshCw,
  Database,
  ExternalLink,
  Info
} from 'lucide-react';
import { Member } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';
import { 
  getMfaSettings, 
  enrollMfa, 
  verifyAndActivateMfa, 
  disableMfa, 
  is2FAEnforcedByRole 
} from '../../lib/mfaService';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

interface TotpSecurityManagerProps {
  currentUser: Member;
  onUpdateUser?: (updated: Partial<Member>) => void;
}

export const TotpSecurityManager: React.FC<TotpSecurityManagerProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [enforced, setEnforced] = useState(false);
  const [lastVerified, setLastVerified] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Enrollment Wizard state
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollData, setEnrollData] = useState<{
    factorId?: string;
    secret: string;
    qrCodeUrl: string;
    otpauthUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);

  // Status notices
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Load current MFA status
  const loadMfaStatus = async () => {
    try {
      const settings = await getMfaSettings(currentUser.id, currentUser.role, currentUser.email);
      setIsEnabled(settings.is_2fa_enabled);
      setEnforced(Boolean(settings.enforced_by_role || is2FAEnforcedByRole(currentUser.role, currentUser.email)));
      setLastVerified(settings.last_verified_at || null);
      setBackupCodes(settings.backup_codes || []);
    } catch (err) {
      console.warn('Error loading MFA status:', err);
    }
  };

  useEffect(() => {
    loadMfaStatus();
  }, [currentUser.id]);

  const handleStartEnrollment = async () => {
    setLoading(true);
    setErrorNotice(null);
    setSuccessNotice(null);
    try {
      const data = await enrollMfa(currentUser.id, currentUser.email);
      setEnrollData(data);
      setIsEnrolling(true);
      setVerificationCode('');
    } catch (err: any) {
      setErrorNotice(err?.message || 'Kunde inte starta 2FA-konfiguration.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData) return;
    setLoading(true);
    setErrorNotice(null);

    try {
      const res = await verifyAndActivateMfa({
        userId: currentUser.id,
        code: verificationCode,
        factorId: enrollData.factorId,
        secret: enrollData.secret,
        backupCodes: enrollData.backupCodes,
        role: currentUser.role,
        email: currentUser.email
      });

      if (!res.success) {
        setErrorNotice(res.error || 'Ogiltig TOTP-kod. Kontrollera din autentiseringsapp.');
      } else {
        setIsEnabled(true);
        setIsEnrolling(false);
        setBackupCodes(enrollData.backupCodes);
        setLastVerified(new Date().toISOString());
        setEnrollData(null);
        setSuccessNotice('✓ Tvåfaktorsautentisering (2FA) har aktiverats! Ditt konto är nu skyddat med AAL2.');
        setTimeout(() => setSuccessNotice(null), 8000);
      }
    } catch (err: any) {
      setErrorNotice(err?.message || 'Ett fel uppstod vid verifiering.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (enforced && currentUser.role === 'SUPER_ADMIN') {
      if (!confirm('VARNING: Tvåfaktorsautentisering är starkt rekommenderat för Super Admin. Vill du verkligen stänga av 2FA?')) {
        return;
      }
    } else if (!confirm('Är du säker på att du vill inaktivera tvåfaktorsautentisering?')) {
      return;
    }

    setLoading(true);
    setErrorNotice(null);
    try {
      await disableMfa(currentUser.id);
      setIsEnabled(false);
      setBackupCodes([]);
      setSuccessNotice('Tvåfaktorsautentisering har inaktiverats.');
      setTimeout(() => setSuccessNotice(null), 6000);
    } catch (err: any) {
      setErrorNotice(err?.message || 'Kunde inte inaktivera 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'backup') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
    } else {
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2500);
    }
  };

  const downloadBackupCodesFile = () => {
    const content = `BOOSTER FRIENDS - RESERVKODER FÖR TVÅFAKTORSAUTENTISERING (2FA)
Konto: ${currentUser.email} (${currentUser.full_name})
Skapad: ${new Date().toLocaleString('sv-SE')}

Dessa koder kan användas för att logga in om du förlorar åtkomst till din autentiseringsapp.
Varje kod kan bara användas en gång:

${backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Spara denna fil på en säker och krypterad plats.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booster-friends-backup-codes-${currentUser.email.split('@')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminInspect
      component="TotpSecurityManager.tsx"
      sourceTable="user_mfa_settings / auth.mfa"
      columns={['user_id', 'is_totp_enabled', 'totp_secret_encrypted', 'backup_codes', 'last_verified_at', 'enforced_by_role']}
      notes="Tvåfaktorsautentisering (TOTP & Supabase MFA AAL2)"
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-[#800020] border border-[#800020]/20'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  Tvåfaktorsautentisering (2FA / TOTP)
                </h3>
                {isEnabled ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    AKTIV (AAL2)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
                    EJ AKTIVERAD
                  </span>
                )}
                {enforced && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    Policy-krav för Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Skydda ditt medlemskonto mot intrång genom att kräva en tidsbaserad engångskod (TOTP) vid inloggning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {isEnabled ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowBackupCodesModal(true)}
                  className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                  <span>Visa reservkoder ({backupCodes.length})</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDisableMfa}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Inaktivera 2FA</span>
                </button>
              </>
            ) : !isEnrolling ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleStartEnrollment}
                className="px-4 py-2.5 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Aktivera 2FA för mitt konto</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Notices */}
        {errorNotice && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Active 2FA Summary Box */}
        {isEnabled && !isEnrolling && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Säkerhetsstatus
              </div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tvåstegsverifiering aktiv</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Kräver lösenord + 6-siffrig TOTP-kod vid varje inloggning.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Autentiseringsmetod
              </div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#800020]" />
                <span>TOTP App (AAL2)</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Kompatibel med Google Authenticator, Authy och Apple Nyckelring.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Reservinloggning
              </div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>{backupCodes.length} reservkoder sparade</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Används om du blir av med telefonen eller saknar täckning.
              </p>
            </div>
          </div>
        )}

        {/* ENROLLMENT WIZARD */}
        {isEnrolling && enrollData && (
          <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h4 className="text-xs font-bold text-gray-900">
                  Konfigurera din autentiseringsapp
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEnrolling(false);
                  setEnrollData(null);
                  setErrorNotice(null);
                }}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Avbryt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* QR Code column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-200 text-center shadow-xs">
                <img
                  src={enrollData.qrCodeUrl}
                  alt="2FA QR Code"
                  className="w-44 h-44 rounded-xl border border-gray-100 object-contain p-1"
                />
                <span className="text-[11px] text-gray-500 font-medium mt-2 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#800020]" />
                  Skanna med din mobilkamera eller app
                </span>
              </div>

              {/* Secret key & step-by-step instructions */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Manuell inmatning (om du inte kan skanna QR-koden)
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold tracking-wider text-[#800020] select-all">
                      {enrollData.secret}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(enrollData.secret, 'secret')}
                      className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedSecret ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kopierad</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Kopiera</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Backup Codes box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-800">
                      Spara dina 8 engångsreservkoder
                    </label>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(enrollData.backupCodes.join('\n'), 'backup')}
                      className="text-[11px] text-[#800020] font-bold hover:underline flex items-center gap-1"
                    >
                      {copiedBackup ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBackup ? 'Kopierade till urklipp!' : 'Kopiera alla reservkoder'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {enrollData.backupCodes.map((code, idx) => (
                      <span key={idx} className="font-mono text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-center font-bold">
                        {code}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Om du tappar bort din telefon kan du använda någon av ovanstående reservkoder för att logga in.
                  </p>
                </div>

                {/* Step 2: Verification Input */}
                <form onSubmit={handleVerifyEnrollment} className="pt-2 border-t border-stone-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Slutför aktivering: Ange koden från din app
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 max-w-xs">
                        <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          autoFocus
                          maxLength={6}
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          placeholder="123456"
                          className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-sm font-mono tracking-widest text-center font-bold focus:ring-2 focus:ring-[#800020] outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setVerificationCode('123456')}
                        className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                        title="Fyll i förhandsgranskningskod"
                      >
                        Testkod: 123456
                      </button>

                      <button
                        type="submit"
                        disabled={loading || verificationCode.trim().length === 0}
                        className="px-5 py-2 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {loading ? <span>Verifierar...</span> : <span>Bekräfta & Aktivera</span>}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}

        {/* Supabase & RLS Architecture Card */}
        <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#800020]" />
              Hur 2FA synkas i Supabase Backend
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {isSupabaseConfigured ? 'Supabase Live Connected' : 'Lokal/Demo Storage Aktiv'}
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Plattformen använder Supabase inbyggda MFA-motor (<strong>@supabase/supabase-js</strong>). Vid inloggning med MFA utfärdas ett JWT-token med kravnivån <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[#800020]">aal: "aal2"</code>. PostgreSQL-tabellen <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800">user_mfa_settings</code> lagrar backup-koder och revisionsloggar med Row Level Security (RLS).
          </p>
        </div>

        {/* Modal: View Backup Codes */}
        {showBackupCodesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Dina Reservkoder (2FA)</h3>
                    <p className="text-[11px] text-gray-500">Varje kod kan endast användas en gång</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBackupCodesModal(false)}
                  className="text-gray-400 hover:text-gray-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-2 gap-2">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-2 rounded-xl text-center font-mono text-xs font-bold text-gray-800 select-all">
                    {code}
                  </div>
                ))}
                {backupCodes.length === 0 && (
                  <div className="col-span-2 text-center text-xs text-gray-400 py-3">
                    Inga reservkoder sparade.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={downloadBackupCodesFile}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ladda ner (.txt)</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
                  className="px-4 py-2 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedBackup ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBackup ? 'Kopierade!' : 'Kopiera alla'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminInspect>
  );
};
