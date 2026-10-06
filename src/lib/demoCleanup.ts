import { supabase } from './supabaseClient';
// Same protected server operation for HUD and Dev. No direct-delete fallback.
export async function confirmDemoCleanup(): Promise<boolean> {
  const { data: preview, error } = await supabase.rpc('cleanup_demo_activities', { p_preview: true });
  if (error) throw new Error(`Förhandskontroll misslyckades: ${error.message}`);
  if (!preview?.preview || !preview?.protected_admin_unchanged || !preview?.counts) throw new Error('Ogiltig förhandskontroll. Ingen rensning gjord.');
  const counts = Object.entries(preview.counts).map(([table, count]) => `${table}: ${count}`).join('\n');
  const confirmation = window.prompt(`Rensa demomärkta aktivitetsposter i hela systemet?\n\n${counts}\n\nProfiler, CV, konton, hubbar, fakturor och grundkonfiguration behålls. Poängsaldo återställs inte.\n\nRaderingen är permanent. Säkerhetskopiera först. Skriv RENSA DEMOAKTIVITETER för att fortsätta.`);
  if (confirmation !== 'RENSA DEMOAKTIVITETER') return false;
  const { data, error: cleanupError } = await supabase.rpc('cleanup_demo_activities', { p_preview: false, p_confirmation: confirmation });
  if (cleanupError) throw new Error(`Rensning misslyckades: ${cleanupError.message}`);
  if (data?.preview !== false || !data?.protected_admin_unchanged) throw new Error('Rensningen kunde inte bekräftas. Kontrollera databasen innan nytt försök.');
  return true;
}
