import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Check, 
  Save, 
  AlertCircle, 
  Users, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { AdminInspect } from '../dev/AdminInspect';

export interface AdminTrialSettingsProps {
  onExtendTrialMember?: (memberId: string, newEndDate: string) => void;
}

export const AdminTrialSettings: React.FC<AdminTrialSettingsProps> = ({ onExtendTrialMember }) => {
  const [trialDays, setTrialDays] = useState<number>(14);
  const [configId, setConfigId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Lista över medlemmar under provperiod
  const [trialMembers, setTrialMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      if (!isSupabaseConfigured) {
        setTrialMembers([
          {
            id: 'm1',
            full_name: 'Sara Lindqvist',
            company_name: 'Nordic Growth AB',
            email: 'sara@nordicgrowth.se',
            trial_ends_at: new Date(Date.now() + 6 * 86400000).toISOString(),
            payment_status: 'TRIAL'
          },
          {
            id: 'm2',
            full_name: 'Carl Berglund',
            company_name: 'SaaS Solutions',
            email: 'carl@saassolutions.se',
            trial_ends_at: new Date(Date.now() + 2 * 86400000).toISOString(),
            payment_status: 'TRIAL'
          },
          {
            id: 'm3',
            full_name: 'Jonas Falk',
            company_name: 'Falk Media & Brand',
            email: 'jonas@falkmedia.se',
            trial_ends_at: new Date(Date.now() + 11 * 86400000).toISOString(),
            payment_status: 'TRIAL'
          }
        ]);
        setLoadingMembers(false);
        return;
      }

      try {
        // 1. Hämta system-regler
        const { data: config } = await supabase
          .from('system_rule_configs')
          .select('id, default_trial_days')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (config) {
          setConfigId(config.id);
          setTrialDays(config.default_trial_days || 14);
        }

        // 2. Hämta medlemmar med aktiv TRIAL
        const { data: members } = await supabase
          .from('profiles')
          .select('id, full_name, company_name, email, trial_ends_at, payment_status, membership_level')
          .eq('payment_status', 'TRIAL')
          .order('trial_ends_at', { ascending: true });

        if (members && members.length > 0) {
          setTrialMembers(members);
        } else {
          // Mock fallback if table empty
          setTrialMembers([
            {
              id: 'm1',
              full_name: 'Sara Lindqvist',
              company_name: 'Nordic Growth AB',
              email: 'sara@nordicgrowth.se',
              trial_ends_at: new Date(Date.now() + 6 * 86400000).toISOString(),
              payment_status: 'TRIAL'
            },
            {
              id: 'm2',
              full_name: 'Carl Berglund',
              company_name: 'SaaS Solutions',
              email: 'carl@saassolutions.se',
              trial_ends_at: new Date(Date.now() + 2 * 86400000).toISOString(),
              payment_status: 'TRIAL'
            }
          ]);
        }
      } catch (err) {
        console.warn('Kunde inte läsa trial settings från Supabase:', err);
      } finally {
        setLoadingMembers(false);
      }
    }

    loadConfig();
  }, []);

  // Spara global standard för provperiod
  const handleSaveDefaultTrial = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (isSupabaseConfigured && configId) {
        const { error } = await supabase
          .from('system_rule_configs')
          .update({ default_trial_days: trialDays, updated_at: new Date().toISOString() })
          .eq('id', configId);

        if (error) throw error;
      }

      setMessage({ text: `Standard provperiod uppdaterad till ${trialDays} dagar!`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Kunde inte spara konfigurationen.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Förläng provperiod för specifik medlem med 7 dagar
  const handleExtendTrial = async (memberId: string, currentEndDate: string) => {
    const baseDate = currentEndDate ? new Date(currentEndDate) : new Date();
    const newEndDate = new Date(baseDate.getTime() + 7 * 86400000).toISOString();

    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('profiles')
          .update({ trial_ends_at: newEndDate })
          .eq('id', memberId);
      }

      setTrialMembers(prev =>
        prev.map(m => m.id === memberId ? { ...m, trial_ends_at: newEndDate } : m)
      );

      if (onExtendTrialMember) {
        onExtendTrialMember(memberId, newEndDate);
      }
    } catch (err) {
      console.error('Kunde inte förlänga provperiod:', err);
    }
  };

  return (
    <AdminInspect
      component="AdminTrialSettings.tsx"
      sourceTable="public.system_settings / profiles"
      columns={['default_trial_days', 'trial_ends_at', 'payment_status']}
      notes="Konfiguration av provperiodslängd och förlängning av medlemmars testperiod"
    >
      <div className="space-y-6">
      {/* Global Konfiguration */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Standard Provperiod (Trial Period)</h2>
            <p className="text-xs text-gray-500">
              Antal dagar nya medlemmar får testa Booster Friends kostnadsfritt innan betalning krävs.
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="90"
              value={trialDays}
              onChange={(e) => setTrialDays(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm font-black text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
            />
            <span className="text-sm font-semibold text-gray-700">dagar fri provperiod</span>
          </div>

          <button
            onClick={handleSaveDefaultTrial}
            disabled={saving}
            className="py-2 px-5 bg-[#800020] hover:bg-[#68001a] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Sparar...' : 'Spara inställning'}</span>
          </button>
        </div>
      </div>

      {/* Lista över aktiva Trials & Snabbförlängning */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Medlemmar med aktiv provperiod ({trialMembers.length})</h3>
          </div>
        </div>

        {loadingMembers ? (
          <div className="text-xs text-gray-400 py-4">Laddar medlemmar...</div>
        ) : trialMembers.length === 0 ? (
          <div className="text-xs text-gray-400 py-4">Inga medlemmar har en aktiv provperiod just nu.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {trialMembers.map((member) => {
              const daysLeft = Math.ceil(
                (new Date(member.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{member.full_name}</div>
                    <div className="text-[11px] text-gray-500">{member.companyName || member.company_name} • {member.email}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        daysLeft <= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} dagar kvar` : 'Utgången'}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        T.o.m. {new Date(member.trial_ends_at).toLocaleDateString('sv-SE')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleExtendTrial(member.id, member.trial_ends_at)}
                      className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                      title="Förläng med 7 dagar"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+7 dgr</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </AdminInspect>
  );
};
