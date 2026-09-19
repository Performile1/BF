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
  ArrowLeft,
  Building,
  Users,
  Coffee,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MembershipLevel } from '../types';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onBackToApp }) => {
  const { 
    signInWithEmail, 
    signInWithOtp, 
    signUp, 
    switchDemoUser, 
    demoProfiles,
    isSupabaseOnline 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [authMethod, setAuthMethod] = useState<'password' | 'magic_link'>('password');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedTier, setSelectedTier] = useState<MembershipLevel>('SILVER');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
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
          setSuccessMsg(message || `En Magic Link har skickats till ${email}! Kontrollera din inkorg.`);
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Felaktig e-post eller lösenord.');
        } else {
          setSuccessMsg('Inloggad! Omdirigerar till nätverket...');
          setTimeout(onBackToApp, 500);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Ett fel uppstod vid inloggning.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
        phone,
        linkedinUrl
      });

      if (error) {
        setErrorMsg(error.message || 'Kunde inte slutföra registrering.');
      } else {
        setSuccessMsg(`Välkommen till Booster Friends! Ditt ${selectedTier}-konto är aktiverat.`);
        setTimeout(onBackToApp, 800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registreringen misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSwitch = (tierKey: 'bronze' | 'silver' | 'gold') => {
    switchDemoUser(tierKey);
    setSuccessMsg(`Loggad in som demo-persona: ${demoProfiles[tierKey].full_name}`);
    setTimeout(onBackToApp, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#800020] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka till översikten</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-500">
              {isSupabaseOnline ? 'Supabase Auth Online' : 'Mock Auth Aktivt'}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#800020] via-[#70001c] to-[#4d0013] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center font-black text-2xl mb-6 shadow-inner">
                B
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Booster Friends V12
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Där affärer görs och nätverk växer.
              </h1>

              <p className="text-xs sm:text-sm text-rose-100 mt-3 leading-relaxed">
                Logga in för att hantera dina flexplatser, svara på kaffe-pings, delta i frukostevent och maximera ditt Booster Score.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 space-y-3 text-xs text-rose-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Flexplatser på Convendum & The Park</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Geofencing & pings för kaffe och lunch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Digitalt vCard & QR-inbjudningar</span>
              </div>
            </div>
          </div>

          {/* Right Auth Card Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            
            <div>
              {/* Tab Switcher */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`py-1.5 px-4 text-xs font-bold rounded-lg transition ${
                      mode === 'login'
                        ? 'bg-white text-[#800020] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
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
                    className={`py-1.5 px-4 text-xs font-bold rounded-lg transition ${
                      mode === 'register'
                        ? 'bg-white text-[#800020] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Bli Medlem
                  </button>
                </div>

                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
                  {mode === 'login' ? 'Befintlig medlem' : 'Nytt medlemskap'}
                </span>
              </div>

              {/* Status alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Metod:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthMethod('password')}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                          authMethod === 'password'
                            ? 'bg-rose-50 text-[#800020] border border-[#800020]/20'
                            : 'text-gray-500'
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
                            : 'text-gray-500'
                        }`}
                      >
                        Magic Link
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
                        placeholder="namn@bolag.se"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
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
                          className="text-[11px] text-[#800020] hover:underline"
                        >
                          Lösenordsfri länk?
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
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
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
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Skicka inloggningslänk via e-post</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Logga in på nätverket</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Tier Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Välj Paket:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTier('BRONZE')}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          selectedTier === 'BRONZE'
                            ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-400'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-[10px] font-black text-orange-950 uppercase">Brons</div>
                        <div className="text-xs font-bold text-gray-900">390 kr</div>
                        <div className="text-[9px] text-gray-500">Digitalt nätverk</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier('SILVER')}
                        className={`p-2.5 rounded-xl border text-left transition relative ${
                          selectedTier === 'SILVER'
                            ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-400'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="absolute -top-1.5 right-1 bg-[#800020] text-white text-[7px] font-bold px-1 rounded-full">
                          MEST VALD
                        </span>
                        <div className="text-[10px] font-black text-slate-800 uppercase">Silver</div>
                        <div className="text-xs font-bold text-gray-900">990 kr</div>
                        <div className="text-[9px] text-gray-500">2 flexdagar/mån</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier('GOLD')}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          selectedTier === 'GOLD'
                            ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-[10px] font-black text-amber-900 uppercase">Guld</div>
                        <div className="text-xs font-bold text-gray-900">2 490 kr</div>
                        <div className="text-[9px] text-gray-500">Obegränsad flex</div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Namn *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="För- och efternamn"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">E-postadress *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="namn@bolag.se"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Företag *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ditt bolag AB"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Roll / Titel *</label>
                      <input
                        type="text"
                        required
                        value={roleTitle}
                        onChange={e => setRoleTitle(e.target.value)}
                        placeholder="t.ex. VD / Säljchef"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn-profil (valfritt)</label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/ditt-namn"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Lösenord *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minst 6 tecken"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#800020] outline-hidden"
                    />
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
                        <span>Skapa {selectedTier}-medlemskonto</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Demo / Mock Switcher Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/80 -mx-6 -mb-6 p-4 rounded-b-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#800020]" />
                  Snabbtesta som Demo Persona:
                </span>
                <span className="text-[9px] font-mono text-gray-400">1-klicks login</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('bronze')}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:border-orange-400 text-left transition flex items-center gap-1.5"
                >
                  <img
                    src={demoProfiles.bronze.avatar}
                    alt={demoProfiles.bronze.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-gray-900 truncate">Amanda</div>
                    <div className="text-[8px] text-orange-700 font-bold uppercase">Brons</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('silver')}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:border-slate-400 text-left transition flex items-center gap-1.5"
                >
                  <img
                    src={demoProfiles.silver.avatar}
                    alt={demoProfiles.silver.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-gray-900 truncate">Elena</div>
                    <div className="text-[8px] text-slate-700 font-bold uppercase">Silver</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('gold')}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:border-amber-400 text-left transition flex items-center gap-1.5"
                >
                  <img
                    src={demoProfiles.gold.avatar}
                    alt={demoProfiles.gold.full_name}
                    className="w-6 h-6 rounded-full object-cover"
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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-400">
        © 2026 Booster Friends AB
      </footer>
    </div>
  );
};
