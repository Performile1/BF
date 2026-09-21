import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Zap,
  Check,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MembershipLevel } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  invitedByName?: string;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  invitedByName,
  onLoginSuccess
}) => {
  const { 
    signInWithEmail, 
    signInWithOtp, 
    signUp, 
    switchDemoUser, 
    demoProfiles,
    isSupabaseOnline 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic_link'>('password');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState<MembershipLevel>('SILVER');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMethod === 'magic_link') {
        const { error, message } = await signInWithOtp(email);
        if (error) {
          setErrorMsg(error.message || 'Kunde inte skicka inloggningslänk.');
        } else {
          setSuccessMsg(message || `En Magic Link har skickats till ${email}! Klicka på länken i ditt mail.`);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Felaktig e-postadress eller lösenord.');
        } else {
          setSuccessMsg('Välkommen tillbaka!');
          setTimeout(() => {
            onLoginSuccess?.();
            onClose();
          }, 600);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ett oväntat fel inträffade.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { error } = await signUp({
        email,
        password: password || 'DemoPassword123!',
        fullName,
        companyName,
        roleTitle,
        membershipLevel: selectedTier,
        phone
      });

      if (error) {
        setErrorMsg(error.message || 'Kunde inte skapa medlemskonto.');
      } else {
        setSuccessMsg(`Välkommen till Booster Friends! Ditt konto (${selectedTier}-medlem) är aktiverat.`);
        setTimeout(() => {
          onLoginSuccess?.();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ett oväntat fel inträffade vid registrering.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSwitch = (tierKey: 'bronze' | 'silver' | 'gold') => {
    switchDemoUser(tierKey);
    setSuccessMsg(`Loggad in som demo-profil: ${demoProfiles[tierKey].full_name} (${tierKey.toUpperCase()})`);
    setTimeout(() => {
      onLoginSuccess?.();
      onClose();
    }, 400);
  };

  return (
    <AdminInspect
      component="AuthModal.tsx"
      sourceTable="auth.users / public.profiles"
      columns={['id', 'email', 'full_name', 'company_name', 'membership_level', 'role_title']}
      notes="Inloggning, registrering och byte mellan demolägen"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header with Burgundy Accent */}
        <div className="bg-[#800020] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Stäng dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-amber-200 font-bold">
              Booster Friends V12
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Logga in i nätverket' : 'Bli medlem i nätverket'}
          </h2>

          <p className="text-xs text-rose-100 mt-1 max-w-md">
            {invitedByName 
              ? `👋 Inbjuden av ${invitedByName} – flexplatser, matchmaking och B2B-affärer.`
              : 'Sveriges ledande flex- och tillväxtnätverk för entreprenörer och ledare.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 grid grid-cols-2 gap-1 bg-black/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'login' 
                  ? 'bg-white text-[#800020] shadow-xs' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Logga in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'register' 
                  ? 'bg-white text-[#800020] shadow-xs' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Bli Medlem (Skapa konto)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">Fel:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN VIEW */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Method toggle: Password vs Magic Link */}
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Inloggningsmetod:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('password')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                      authMethod === 'password'
                        ? 'bg-rose-50 text-[#800020] border border-[#800020]/20'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Lösenord
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('magic_link')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                      authMethod === 'magic_link'
                        ? 'bg-rose-50 text-[#800020] border border-[#800020]/20'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Magic Link (E-post)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">E-postadress</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="namn@foretag.se"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  />
                </div>
              </div>

              {authMethod === 'password' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Lösenord</label>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('magic_link')}
                      className="text-[11px] text-[#800020] font-semibold hover:underline"
                    >
                      Glömt? Använd Magic Link
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required={authMethod === 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Loggar in...</span>
                ) : authMethod === 'magic_link' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Skicka Magic Link till e-post</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Logga in på medlemskontot</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER VIEW */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Membership Tier Cards */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Välj Medlemskapsnivå:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTier('BRONZE')}
                    className={`p-2.5 rounded-xl border text-left transition relative ${
                      selectedTier === 'BRONZE'
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-[11px] font-black text-orange-950 uppercase">Brons</div>
                    <div className="text-xs font-bold text-gray-900 mt-0.5">390 kr</div>
                    <div className="text-[10px] text-gray-500">/mån</div>
                    <div className="text-[9px] text-gray-600 mt-1 leading-tight">Digitalt nätverk, BP & vCard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier('SILVER')}
                    className={`p-2.5 rounded-xl border text-left transition relative ${
                      selectedTier === 'SILVER'
                        ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-400'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="absolute -top-2 right-1.5 bg-[#800020] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      POPULÄR
                    </span>
                    <div className="text-[11px] font-black text-slate-800 uppercase">Silver</div>
                    <div className="text-xs font-bold text-gray-900 mt-0.5">990 kr</div>
                    <div className="text-[10px] text-gray-500">/mån</div>
                    <div className="text-[9px] text-gray-600 mt-1 leading-tight">2 flexdagar/mån & pings</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier('GOLD')}
                    className={`p-2.5 rounded-xl border text-left transition relative ${
                      selectedTier === 'GOLD'
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-[11px] font-black text-amber-900 uppercase">Guld</div>
                    <div className="text-xs font-bold text-gray-900 mt-0.5">2 490 kr</div>
                    <div className="text-[10px] text-gray-500">/mån</div>
                    <div className="text-[9px] text-gray-600 mt-1 leading-tight">Obegränsad flex & VIP</div>
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">För- och efternamn *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="t.ex. Anna Lindberg"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">E-postadress *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="anna@bolag.se"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Företagsnamn *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Nordic Tech AB"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Roll / Titel *</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={e => setRoleTitle(e.target.value)}
                      placeholder="VD / Grundare"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lösenord *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minst 6 tecken"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobil (för vCard/Pings)</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+46 70 123 45 67"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Skapar konto...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Aktivera mitt {selectedTier}-medlemskap</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Switcher Banner (1-klick för utveckling/testning) */}
          <div className="mt-5 pt-4 border-t border-gray-100 bg-gray-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#800020]" />
                Demo Inloggning (1-klicks persona-växling)
              </span>
              <span className="text-[9px] font-mono text-gray-500">
                {isSupabaseOnline ? 'Supabase Live' : 'Mock-läge aktivt'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('bronze')}
                className="py-2 px-1.5 rounded-xl bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 text-left transition flex items-center gap-1.5 group"
              >
                <img
                  src={demoProfiles.bronze.avatar}
                  alt={demoProfiles.bronze.full_name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-900 truncate">Amanda</div>
                  <div className="text-[8px] text-orange-700 font-bold uppercase">Brons</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('silver')}
                className="py-2 px-1.5 rounded-xl bg-white border border-gray-200 hover:border-slate-400 hover:bg-slate-50 text-left transition flex items-center gap-1.5 group"
              >
                <img
                  src={demoProfiles.silver.avatar}
                  alt={demoProfiles.silver.full_name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-900 truncate">Elena</div>
                  <div className="text-[8px] text-slate-700 font-bold uppercase">Silver</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('gold')}
                className="py-2 px-1.5 rounded-xl bg-white border border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition flex items-center gap-1.5 group"
              >
                <img
                  src={demoProfiles.gold.avatar}
                  alt={demoProfiles.gold.full_name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-900 truncate">Rickard</div>
                  <div className="text-[8px] text-amber-800 font-bold uppercase">Guld/VD</div>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
    </AdminInspect>
  );
};
