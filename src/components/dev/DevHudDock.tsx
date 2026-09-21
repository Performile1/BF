import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { usePermissions } from '../../hooks/usePermissions';
import { useInspector } from './InspectorContext';

export function DevHudDock({ onDataMutated }: { onDataMutated?: () => void }) {
  const { isSuperAdmin, currentUser } = usePermissions();
  const { inspectorEnabled, toggleInspector } = useInspector();
  const [loadingAction, setLoadingAction] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const shouldShow = Boolean(
    isSuperAdmin || 
    inspectorEnabled ||
    currentUser?.email === 'rickard@wigrund.se' ||
    currentUser?.email === 'admin@performile.com' ||
    currentUser?.email === 'wigrund81@gmail.com' ||
    currentUser?.is_admin
  );

  if (!shouldShow) return null;

  const handleSeed = async () => {
    try {
      setLoadingAction(true);
      const { data: { session } } = await supabase.auth.getSession();
      const targetUserId = session?.user?.id || currentUser?.id;
      if (!targetUserId) {
        alert('Ingen inloggad användare hittades.');
        return;
      }

      // Prova först RPC i databasen
      const { error: rpcError } = await supabase.rpc('seed_demo_data', {
        p_target_user_id: targetUserId,
      });

      if (rpcError) {
        console.warn('seed_demo_data RPC fel, provar direkt fallback:', rpcError.message);
        
        // Fallback: skapa demo deals och community posts direkt via klienten om RPC inte är körd i SQL Editor än
        await supabase.from('crm_pipeline_deals').delete().eq('owner_member_id', targetUserId).eq('is_demo', true);
        await supabase.from('community_posts').delete().eq('author_id', targetUserId).eq('is_demo', true);

        const deals = [
          {
            owner_member_id: targetUserId,
            title: 'Logistikoptimering & WMS-analys',
            client_company: 'Nordic Supply AB',
            contact_person: 'Anders Berg',
            value_sek: 45000,
            stage: 'lead',
            probability: 20,
            next_step: 'Koppla i 3-partschatt',
            due_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            notes: 'Demo Lead via AI-matchning.',
            points_awarded: false,
            is_demo: true,
          },
          {
            owner_member_id: targetUserId,
            title: 'Checkout-konvertering & CRO',
            client_company: 'Svea E-Commerce Group',
            contact_person: 'Elin Lundqvist',
            value_sek: 85000,
            stage: 'intro_sent',
            probability: 40,
            next_step: 'Boka 1-till-1 introduktion',
            due_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
            notes: 'Demo Intro skickad.',
            points_awarded: false,
            is_demo: true,
          },
          {
            owner_member_id: targetUserId,
            title: 'Transportupphandling & Avtal',
            client_company: 'Västkust Logistik Partner',
            contact_person: 'Henrik Lind',
            value_sek: 120000,
            stage: 'meeting_done',
            probability: 60,
            next_step: 'Genomföra möte i hubben',
            due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
            notes: 'Demo Kaffemöte inbokat.',
            points_awarded: false,
            is_demo: true,
          },
          {
            owner_member_id: targetUserId,
            title: 'B2B Fulfillment-strategi',
            client_company: 'Designvarumärket Scandinavia',
            contact_person: 'Cecilia Ek',
            value_sek: 175000,
            stage: 'proposal',
            probability: 80,
            next_step: 'Avstämning ledningsgrupp',
            due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            notes: 'Demo Offert skickad.',
            points_awarded: false,
            is_demo: true,
          },
          {
            owner_member_id: targetUserId,
            title: 'Checkout & Skåpsleveranser',
            client_company: 'Retail Expansion Nordics',
            contact_person: 'Marcus Holm',
            value_sek: 240000,
            stage: 'closed_won',
            probability: 100,
            next_step: 'Onboarding startad',
            due_date: new Date().toISOString().split('T')[0],
            notes: 'Demo Stängd affär!',
            points_awarded: true,
            is_demo: true,
          },
        ];

        const { error: dealErr } = await supabase.from('crm_pipeline_deals').insert(deals);
        if (dealErr) console.warn('Direct deal insert warning:', dealErr.message);

        const posts = [
          {
            author_id: targetUserId,
            post_type: 'POST',
            category: 'Allmänt',
            title: 'Snabb fråga kring tullregler och 3PL',
            content: 'Någon i hubben som har erfarenhet av automatiserad tulldeklaration via API för e-handelsförsändelser till Norge? Tar gärna en kaffe och bollar tankar i loungen idag!',
            read_time_min: 1,
            is_demo: true,
          },
          {
            author_id: targetUserId,
            post_type: 'ARTICLE',
            category: 'Logistik',
            title: '3 strategier för att sänka fraktkostnader och höja konverteringen 2026',
            content: 'Fraktalternativ i kassan är inte längre bara en logistikfråga – det är ett av dina starkaste verktyg för konverteringsoptimering. Genom att tydliggöra beräknad leveranstidpunkt och erbjuda paketboxar nära kunden kan övergivna varukorgar minskas markant.\n\nI denna genomgång analyserar vi tre konkreta åtgärder som kan implementeras direkt i er checkout-strategi.',
            image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
            read_time_min: 4,
            is_demo: true,
          }
        ];

        const { error: postErr } = await supabase.from('community_posts').insert(posts);
        if (postErr) console.warn('Direct post insert warning:', postErr.message);
      }

      setStatusMsg('Mockup-data laddad! ✓');
      setTimeout(() => setStatusMsg(null), 3000);
      if (onDataMutated) onDataMutated();
    } catch (err: any) {
      alert(`Fel: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePurge = async () => {
    try {
      setLoadingAction(true);
      const { data: { session } } = await supabase.auth.getSession();
      const targetUserId = session?.user?.id || currentUser?.id;
      if (!targetUserId) return;

      const { error: rpcError } = await supabase.rpc('purge_demo_data', {
        p_target_user_id: targetUserId,
      });

      if (rpcError) {
        console.warn('purge_demo_data RPC fel, provar direkt delete:', rpcError.message);
        await supabase.from('crm_pipeline_deals').delete().eq('owner_member_id', targetUserId).eq('is_demo', true);
        await supabase.from('community_posts').delete().eq('author_id', targetUserId).eq('is_demo', true);
      }

      setStatusMsg('Mockup-data rensad! ✓');
      setTimeout(() => setStatusMsg(null), 3000);
      if (onDataMutated) onDataMutated();
    } catch (err: any) {
      alert(`Fel: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 bg-gray-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-2xl border border-gray-700 text-xs font-medium">
      <div className="flex items-center gap-2 border-r border-gray-700 pr-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span className="font-bold text-[11px] text-gray-300">ADMIN DEV HUD</span>
      </div>

      {/* Inspector Toggle */}
      <button
        type="button"
        onClick={toggleInspector}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
          inspectorEnabled
            ? 'bg-amber-500 text-gray-900 shadow-xs'
            : 'bg-gray-800 text-gray-400 hover:text-white'
        }`}
      >
        Hover Inspector: {inspectorEnabled ? 'PÅ' : 'AV'}
      </button>

      {/* Mock Data Toggles */}
      <div className="flex items-center gap-1 pl-1">
        <button
          type="button"
          onClick={handleSeed}
          disabled={loadingAction}
          className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-[11px] font-bold text-gray-200 transition disabled:opacity-50 cursor-pointer"
        >
          Ladda Mock
        </button>
        <button
          type="button"
          onClick={handlePurge}
          disabled={loadingAction}
          className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-200 rounded-lg text-[11px] font-bold transition disabled:opacity-50 cursor-pointer"
        >
          Rensa Mock
        </button>
      </div>

      {statusMsg && (
        <span className="text-[11px] text-emerald-400 pl-2 animate-in fade-in font-semibold">
          {statusMsg}
        </span>
      )}
    </div>
  );
}
