import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient'; // Din supabase-klient

export function useAccountSecurityEnforcer(
  currentUser: { id: string } | null, 
  onForceLogout: () => void
) {
  useEffect(() => {
    if (!currentUser?.id) return;

    // Om Supabase inte är konfigurerad (t.ex. körs lokalt i förhandsvisnings-/demoläge),
    // eller om användaren är en lokal demoprofil (mock persona), avbryt så inte sessionen nollställs i onödan.
    if (!isSupabaseConfigured) return;
    const isLocalDemoPersona = 
      currentUser.id.startsWith('demo-') || 
      currentUser.id.startsWith('usr_');
    if (isLocalDemoPersona) return;

    // Funktion för att genomföra omedelbar och ren utloggning
    const executeForceLogout = async (reason: 'DELETED' | 'FROZEN') => {
      console.warn(`[Security] Session avbruten: Kontot är ${reason}. Rensar session...`);
      
      // 1. Logga ut från Supabase Auth
      await supabase.auth.signOut().catch(() => {});

      // 2. Rensa all lokal lagring så inget spökar kvar
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Storage clear notice:', e);
      }

      // 3. Informera användaren och uppdatera frontend-state
      try {
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          if (reason === 'FROZEN') {
            alert('Ditt konto har inaktiverats eller frysts. Kontakta administratör.');
          } else {
            alert('Ditt konto hittades inte och har tagits bort.');
          }
        }
      } catch (e) {
        console.warn('Alert notice:', e);
      }

      onForceLogout();
    };

    // A. VALIDERINGS-KONTROLL DIREKT VID START (Gatekeeper)
    const verifyAccountState = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, account_status')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error || !profile) {
        // Profilen finns inte i databasen (t.ex. raderad i backend)
        await executeForceLogout('DELETED');
      } else if (profile.account_status === 'FROZEN') {
        await executeForceLogout('FROZEN');
      }
    };

    verifyAccountState();

    // B. REALTIDS-PRENUMERATION (Om ändringen sker medan användaren är aktiv)
    const channel = supabase
      .channel(`account-enforcement-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`,
        },
        async (payload) => {
          const updatedProfile = payload.new as { account_status?: string };
          if (updatedProfile?.account_status === 'FROZEN') {
            await executeForceLogout('FROZEN');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`,
        },
        async () => {
          await executeForceLogout('DELETED');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, onForceLogout]);
}

export default useAccountSecurityEnforcer;
