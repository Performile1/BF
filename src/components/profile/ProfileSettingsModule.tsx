import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Linkedin, 
  Phone, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Save, 
  Sparkles,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Briefcase
} from 'lucide-react';
import { Member } from '../../types';

export interface ProfileSettingsModuleProps {
  currentUser: Member;
  onUpdateProfile: (updated: Partial<Member>) => void;
  isSupabaseOnline?: boolean;
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
}

export const ProfileSettingsModule: React.FC<ProfileSettingsModuleProps> = ({
  currentUser,
  onUpdateProfile,
  isSupabaseOnline = false,
  onAwardPoints
}) => {
  const [formData, setFormData] = useState({
    full_name: currentUser.full_name || '',
    role_title: currentUser.role_title || '',
    company_name: currentUser.company_name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    linkedin_url: currentUser.linkedin_url || '',
    website_url: currentUser.website_url || '',
    bio: currentUser.bio || '',
    avatar: currentUser.avatar || '',
    city: currentUser.city || 'Stockholm',
    seeking_tags: currentUser.seeking_tags || [],
    offering_tags: currentUser.offering_tags || []
  });

  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newSeekingTag, setNewSeekingTag] = useState('');
  const [newOfferingTag, setNewOfferingTag] = useState('');

  // LinkedIn URL Validation logic
  const validateLinkedIn = (url: string): boolean => {
    if (!url || url.trim() === '') {
      setLinkedinError(null);
      return true; // Optional field
    }

    const trimmed = url.trim();
    // Accept standard LinkedIn profile URLs
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\.%]+\/?$/i;
    
    if (!linkedinRegex.test(trimmed)) {
      setLinkedinError('Ange en giltig LinkedIn-profiladress, t.ex. https://linkedin.com/in/ditt-namn');
      return false;
    }

    setLinkedinError(null);
    return true;
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, linkedin_url: val }));
    validateLinkedIn(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate LinkedIn before saving
    if (formData.linkedin_url && !validateLinkedIn(formData.linkedin_url)) {
      return;
    }

    // Ensure http prefix if user typed "linkedin.com/in/..."
    let formattedLinkedIn = formData.linkedin_url.trim();
    if (formattedLinkedIn && !formattedLinkedIn.startsWith('http://') && !formattedLinkedIn.startsWith('https://')) {
      formattedLinkedIn = `https://${formattedLinkedIn}`;
    }

    onUpdateProfile({
      ...formData,
      linkedin_url: formattedLinkedIn
    });

    if (onAwardPoints) {
      onAwardPoints(15, 'Uppdaterade grundläggande profiluppgifter och LinkedIn-koppling', 'PROFILE_UPDATE');
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const addTag = (type: 'seeking' | 'offering') => {
    if (type === 'seeking' && newSeekingTag.trim()) {
      if (!formData.seeking_tags.includes(newSeekingTag.trim())) {
        setFormData(prev => ({ ...prev, seeking_tags: [...prev.seeking_tags, newSeekingTag.trim()] }));
      }
      setNewSeekingTag('');
    } else if (type === 'offering' && newOfferingTag.trim()) {
      if (!formData.offering_tags.includes(newOfferingTag.trim())) {
        setFormData(prev => ({ ...prev, offering_tags: [...prev.offering_tags, newOfferingTag.trim()] }));
      }
      setNewOfferingTag('');
    }
  };

  const removeTag = (type: 'seeking' | 'offering', tagToRemove: string) => {
    if (type === 'seeking') {
      setFormData(prev => ({
        ...prev,
        seeking_tags: prev.seeking_tags.filter(t => t !== tagToRemove)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        offering_tags: prev.offering_tags.filter(t => t !== tagToRemove)
      }));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 via-rose-50/30 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Profilinställningar & Visitkort
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
              {currentUser.membership_level}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Hantera dina grunduppgifter, kontaktuppgifter och visitkortsinformation som syns i nätverket och i vCard-exporten.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profilen har sparats!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* SECTION 1: Grunduppgifter */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <User className="w-4 h-4 text-[#800020]" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Grunduppgifter
            </h3>
          </div>

          {/* Avatar Section */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
            <div className="relative">
              <img
                src={formData.avatar}
                alt={formData.full_name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Profilbild URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                placeholder="https://images.unsplash.com/..."
              />
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="text-[10px] text-gray-400">Snabbval:</span>
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                ].map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className="text-[10px] font-semibold text-[#800020] hover:underline"
                  >
                    Avatar {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fullständigt namn */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Fullständigt namn *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                placeholder="Anna Lindqvist"
              />
            </div>

            {/* Roll / Titel */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Roll / Titel *
              </label>
              <input
                type="text"
                required
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                placeholder="VD & Grundare"
              />
            </div>

            {/* Bolagsnamn */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Bolagsnamn *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                placeholder="Nordic Scale AB"
              />
            </div>

            {/* Stad / Region */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Stad / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                placeholder="Stockholm"
              />
            </div>

            {/* E-postadress (Koppling till Supabase Auth) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#800020]" />
                  <span>E-postadress</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                    <span>Supabase Auth</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEmailEditable(!isEmailEditable)}
                    className="text-[10px] text-gray-500 hover:text-[#800020] underline font-medium"
                  >
                    {isEmailEditable ? 'Lås' : 'Ändra'}
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  readOnly={!isEmailEditable}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs border transition ${
                    isEmailEditable 
                      ? 'bg-white border-[#800020]/30 focus:ring-2 focus:ring-[#800020]/20' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 cursor-not-allowed'
                  }`}
                  placeholder="anna@nordicscale.se"
                />
                {!isEmailEditable && (
                  <Lock className="w-3 h-3 text-gray-400 absolute right-3 top-2.5" />
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Används för inloggning, notifieringar och i det digitala vCard-visitkortet.
              </p>
            </div>

            {/* Telefonnummer (för vCard) */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Telefonnummer (för vCard)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+46 70 123 45 67"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
                />
                <Phone className="w-3 h-3 text-gray-400 absolute right-3 top-2.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Inkluderas i exporten till telefonens kontaktbok.
              </p>
            </div>

            {/* LinkedIn-profil med validering */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn-profil</span>
                </label>
                {formData.linkedin_url && !linkedinError && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Giltig LinkedIn-länk</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.linkedin_url}
                  onChange={handleLinkedInChange}
                  placeholder="https://linkedin.com/in/ditt-namn"
                  className={`w-full px-3 py-2 bg-white rounded-xl text-xs border transition ${
                    linkedinError 
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : formData.linkedin_url 
                      ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-200' 
                      : 'border-gray-200 focus:ring-2 focus:ring-[#800020]/20'
                  }`}
                />
                {formData.linkedin_url && !linkedinError && (
                  <a
                    href={formData.linkedin_url.startsWith('http') ? formData.linkedin_url : `https://${formData.linkedin_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-2 text-xs font-bold text-[#0A66C2] hover:underline flex items-center gap-0.5"
                    title="Testa LinkedIn-länk"
                  >
                    <span>Testa länk</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {linkedinError ? (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{linkedinError}</span>
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">
                  Inkluderas automatiskt i ditt digitala vCard-visitkort som <code className="text-gray-600 bg-gray-100 px-1 py-0.5 rounded">URL;TYPE=LinkedIn:...</code> och visar en klickbar ikon på ditt medlemskort.
                </p>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="mt-4">
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Personlig presentation / Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Beskriv kort vad ditt bolag gör, dina styrkor och vad du brinner för..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20"
            />
          </div>
        </div>

        {/* SECTION 2: Söker & Erbjuder Taggar */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <Briefcase className="w-4 h-4 text-[#800020]" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Affärsmatchning & Kompetenser
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Söker */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
              <label className="text-xs font-bold text-amber-900 block mb-1.5">
                Vad söker du just nu? (Affärsbehov)
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newSeekingTag}
                  onChange={(e) => setNewSeekingTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('seeking'); } }}
                  placeholder="T.ex. Såddkapital, B2B Säljare..."
                  className="flex-1 px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="button"
                  onClick={() => addTag('seeking')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.seeking_tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] bg-white text-amber-900 px-2.5 py-1 rounded-lg font-medium border border-amber-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag('seeking', tag)}
                      className="text-amber-500 hover:text-amber-800"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Erbjuder */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
              <label className="text-xs font-bold text-emerald-900 block mb-1.5">
                Vad kan du erbjuda andra medlemmar?
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newOfferingTag}
                  onChange={(e) => setNewOfferingTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('offering'); } }}
                  placeholder="T.ex. SaaS Skalning, Avtalsjuridik..."
                  className="flex-1 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button
                  type="button"
                  onClick={() => addTag('offering')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.offering_tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] bg-white text-emerald-900 px-2.5 py-1 rounded-lg font-medium border border-emerald-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag('offering', tag)}
                      className="text-emerald-500 hover:text-emerald-800"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">
            {isSupabaseOnline ? 'Synkas mot Supabase profiles' : 'Sparat lokalt med Supabase Mock-Fallback'}
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#660018] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Spara profiländringar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
