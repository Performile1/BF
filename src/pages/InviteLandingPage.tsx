import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Download, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  Mail, 
  Globe, 
  Linkedin, 
  ShieldCheck,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface InviteLandingPageProps {
  onGoToAuth: (mode: 'login' | 'register') => void;
  onBackToApp: () => void;
}

export const InviteLandingPage: React.FC<InviteLandingPageProps> = ({ onGoToAuth, onBackToApp }) => {
  const [inviter, setInviter] = useState<{
    id: string;
    fullName: string;
    roleTitle: string;
    companyName: string;
    city: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
    membershipLevel: string;
  }>({
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    fullName: 'Rickard Wigrund',
    roleTitle: 'Grundare & Super Admin',
    companyName: 'Booster Friends',
    city: 'Göteborg',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    email: 'rickard@wigrund.se',
    phone: '+46 70 123 45 67',
    linkedinUrl: 'https://linkedin.com/in/rickardwigrund',
    membershipLevel: 'GOLD'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fånga parametrar från URL: t.ex. ?ref=UUID&name=Rickard+Wigrund
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref') || params.get('inviter');
    const paramName = params.get('name');

    if (refId) {
      localStorage.setItem('booster_referral_id', refId);
    }

    async function loadInviter() {
      if (refId && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role_title, company_name, city, avatar_url, email, phone, linkedin_url, membership_level')
            .eq('id', refId)
            .single();

          if (data && !error) {
            setInviter({
              id: data.id,
              fullName: data.full_name,
              roleTitle: data.role_title,
              companyName: data.company_name,
              city: data.city,
              avatarUrl: data.avatar_url,
              email: data.email,
              phone: data.phone,
              linkedinUrl: data.linkedin_url,
              membershipLevel: data.membership_level
            });
          }
        } catch (err) {
          console.warn('Kunde inte läsa inbjudare, använder URL/mock data', err);
        }
      } else if (paramName) {
        setInviter(prev => ({ ...prev, fullName: decodeURIComponent(paramName) }));
      }
      setLoading(false);
    }

    loadInviter();
  }, []);

  // Ladda ner digitalt vCard direkt till mobilen/datorn
  const handleDownloadVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${inviter.fullName}`,
      `ORG:${inviter.companyName}`,
      `TITLE:${inviter.roleTitle}`,
      inviter.email ? `EMAIL;TYPE=INTERNET,WORK:${inviter.email}` : '',
      inviter.phone ? `TEL;TYPE=CELL:${inviter.phone}` : '',
      inviter.linkedinUrl ? `URL;TYPE=LinkedIn:${inviter.linkedinUrl}` : '',
      inviter.city ? `ADR;TYPE=WORK:;;;${inviter.city};;Sweden` : '',
      'NOTE:Ansluten via Booster Friends V12 B2B Community',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${inviter.fullName.replace(/\s+/g, '_')}_kontakt.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#800020] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-500">Booster Connect</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#800020] via-[#70001c] to-[#4d0013] text-white p-8 text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Personlig Inbjudan & Digitalt Kontaktkort
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {inviter.fullName} vill ansluta med dig!
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-2 max-w-xl mx-auto">
              Spara kontakten direkt till din adressbok eller skapa ett kostnadsfritt konto för att nätverka och boka flexplatser.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {/* Medlemskort-visning */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={inviter.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={inviter.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                />
                <span className="absolute bottom-0 right-0 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {inviter.membershipLevel}
                </span>
              </div>

              <h2 className="text-lg font-black text-gray-900">{inviter.fullName}</h2>
              <div className="text-xs text-gray-600 font-medium mt-0.5">{inviter.roleTitle}</div>
              <div className="text-xs text-[#800020] font-bold mt-0.5">{inviter.companyName} • {inviter.city}</div>

              {/* Kontaktikoner */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-4 text-gray-500">
                {inviter.email && (
                  <a href={`mailto:${inviter.email}`} className="p-2 hover:bg-white rounded-lg hover:text-[#800020] transition">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {inviter.linkedinUrl && (
                  <a href={inviter.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white rounded-lg hover:text-[#0A66C2] transition">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Ladda ner vCard knapp */}
              <button
                onClick={handleDownloadVCard}
                className="mt-5 w-full py-2.5 px-4 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-xs rounded-xl shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Spara vCard (.vcf) till adressboken</span>
              </button>
            </div>

            {/* CTA för registrering eller inloggning */}
            <div className="max-w-md mx-auto space-y-3">
              <button
                onClick={() => onGoToAuth('register')}
                className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Skapa konto & anslut till {inviter.fullName.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onGoToAuth('login')}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Redan medlem? Logga in här</span>
              </button>
            </div>

            {/* Trygghetsgarantier */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-[11px] text-gray-400">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Kostnadsfritt gästkonto</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verifierat B2B-nätverk</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+150 BP Välkomstbonus</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-400">
        © 2026 Booster Friends AB • Mölnlycke & Göteborg
      </footer>
    </div>
  );
};
