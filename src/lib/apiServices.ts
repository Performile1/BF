import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * A. Gör ett utskick till Prospects eller Alla
 * Anropar databasens RPC 'send_broadcast'
 *
 * @param title Kampanjrubrik
 * @param body Kampanjtext
 * @param audience Målgrupp: 'ALL' | 'PROSPECTS' | 'MEMBERS'
 * @returns campaign_id från databasen
 */
export async function sendBroadcastCampaign(
  title: string, 
  body: string, 
  audience: 'ALL' | 'PROSPECTS' | 'MEMBERS'
) {
  if (!isSupabaseConfigured) {
    console.info('[sendBroadcastCampaign] Supabase ej konfigurerad i produktionsläge. Returnerar simulerad ID:', {
      title,
      body,
      audience
    });
    return 'sim_broadcast_' + Date.now();
  }

  const { data, error } = await supabase.rpc('send_broadcast', {
    p_title: title,
    p_body: body,
    p_target_audience: audience,
    p_channel: 'IN_APP',
  });

  if (error) {
    console.error('Kunde inte skicka broadcast:', error);
    throw error;
  }
  return data; // Returnerar campaign_id
}

/**
 * B. Sätt en bevakning på en tagg eller person
 * Lägger till eller tar bort rad i notification_subscriptions
 *
 * @param userId Användarens ID
 * @param type Prenumerationstyp ('TAG' | 'TOPIC' | 'PERSON')
 * @param targetId Målets ID (t.ex. tagg-namn eller användar-id)
 * @param active true för att aktivera bevakning, false för att ta bort den
 */
export async function toggleSubscription(
  userId: string, 
  type: 'TAG' | 'TOPIC' | 'PERSON', 
  targetId: string, 
  active: boolean
) {
  if (!isSupabaseConfigured) {
    console.info('[toggleSubscription] Demoläge - sparar bevakning lokalt:', {
      userId,
      type,
      targetId,
      active
    });
    return { data: null, error: null };
  }

  if (active) {
    return await supabase.from('notification_subscriptions').insert({
      user_id: userId,
      subscription_type: type,
      target_id: targetId,
    });
  } else {
    return await supabase
      .from('notification_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('subscription_type', type)
      .eq('target_id', targetId);
  }
}

/**
 * C. Radera konto helt (GDPR)
 * Anropar RPC 'delete_user_account', loggar ut, rensar browser storage och redirectar
 *
 * @param userId Mål-användarens ID som ska raderas
 */
export async function deleteAccount(userId: string) {
  if (isSupabaseConfigured && !userId.startsWith('demo-') && !userId.startsWith('usr_')) {
    const { error } = await supabase.rpc('delete_user_account', {
      p_target_user_id: userId
    });
    
    if (error) {
      console.error('Fel vid radering av användarkonto:', error);
      throw error;
    }
  } else {
    console.info('[deleteAccount] Demo- eller lokalprofil raderas:', userId);
  }
  
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Utloggningsnotis vid radering:', e);
  }

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.warn('Storage clear fel:', e);
  }

  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Koppla samman vCard-vänskap direkt via RPC 'connect_vcard_friend'
 * när en inloggad medlem skannar en annans vCard/QR-kod.
 *
 * @param referrerId ID för medlemmen som delade QR-koden / vCard
 */
export async function connectVCardFriend(referrerId: string) {
  if (!isSupabaseConfigured) {
    console.info('[connectVCardFriend] Demoläge - simulerar vänkoppling med:', referrerId);
    return { error: null };
  }

  const { data, error } = await supabase.rpc('connect_vcard_friend', {
    p_referrer_id: referrerId,
  });

  if (error) {
    console.error('Kunde inte koppla vCard-vän:', error);
  }
  return { data, error };
}

/**
 * Behandla referral-belöningar och kopplingar när en ny användare slutför registrering.
 * Anropar databasens RPC 'process_referral_signup'.
 *
 * @param newUserId Nyregistrerade användarens ID
 * @param referrerId Inbjudarens ID från localStorage ('booster_referral_id')
 */
export async function processReferralSignup(newUserId: string, referrerId: string) {
  if (!isSupabaseConfigured) {
    console.info('[processReferralSignup] Demoläge - simulerar referral-signup för:', {
      newUserId,
      referrerId
    });
    return { error: null };
  }

  const { data, error } = await supabase.rpc('process_referral_signup', {
    p_new_user_id: newUserId,
    p_referrer_id: referrerId,
  });

  if (error) {
    console.error('Kunde inte processa referral signup:', error);
  }
  return { data, error };
}

/**
 * Uppdatera profilbild via den strikta RPC-funktionen 'update_profile_avatar'.
 * Funktionen validerar auth.uid() och kör SECURITY DEFINER på databassidan.
 *
 * @param avatarUrl Ny URL eller dataUrl för profilbilden
 */
export async function updateProfileAvatar(avatarUrl: string) {
  if (!isSupabaseConfigured) {
    console.info('[updateProfileAvatar] Demoläge - sparar avatar i lokalt tillstånd');
    return { data: { success: true, avatar_url: avatarUrl }, error: null };
  }

  const { data, error } = await supabase.rpc('update_profile_avatar', {
    p_avatar_url: avatarUrl
  });

  if (error) {
    console.error('Kunde inte uppdatera profilbild via RPC:', error);
  }
  return { data, error };
}
