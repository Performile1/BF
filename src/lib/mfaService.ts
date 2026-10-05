import { supabase, isSupabaseConfigured } from './supabaseClient';
import { TotpSecuritySettings, Member } from '../types';

const STORAGE_PREFIX = 'booster_mfa_settings_';

// Generate a random Base32 string (standard for TOTP secrets)
export function generateBase32Secret(length = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Generate 8 backup recovery codes
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let i = 0; i < count; i++) {
    let part1 = '';
    let part2 = '';
    for (let j = 0; j < 4; j++) part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let j = 0; j < 4; j++) part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

// Generate an SVG data URI QR code representing the otpauth:// URL
export function generateOtpAuthQrSvg(otpauthUrl: string): string {
  // Return an SVG QR representation or fallback image URL
  const encoded = encodeURIComponent(otpauthUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&bgcolor=ffffff&color=800020&qzone=2`;
}

export function buildOtpAuthUrl(secret: string, email: string, issuer = 'Booster Friends'): string {
  const cleanEmail = encodeURIComponent(email);
  const cleanIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${cleanIssuer}:${cleanEmail}?secret=${secret}&issuer=${cleanIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Check if 2FA is mandatory by role (e.g. SUPER_ADMIN or HUB_HOST)
 */
export function is2FAEnforcedByRole(role?: string, email?: string): boolean {
  if (role === 'SUPER_ADMIN') return true;
  if (email && (email.toLowerCase() === 'admin@performile.com' || email.toLowerCase() === 'rickard@wigrund.se')) {
    return true;
  }
  return false;
}

/**
 * Get current MFA settings for a user
 */
export async function getMfaSettings(userId: string, role?: string, email?: string): Promise<TotpSecuritySettings> {
  const enforced = is2FAEnforcedByRole(role, email);

  // 1. Try Supabase if configured (checks live factors & user_mfa_settings table)
  if (isSupabaseConfigured) {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const effectiveUserId = authUser?.user?.id || userId;

      // Query live factors directly from Supabase Auth MFA
      let hasVerifiedSupabaseTotp = false;
      try {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        hasVerifiedSupabaseTotp = Boolean(factorsData?.totp?.some(f => f.status === 'verified'));
      } catch (factorErr) {
        console.warn('[MFA] listFactors note:', factorErr);
      }

      // Query user_mfa_settings table
      const { data: dbData } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', effectiveUserId)
        .maybeSingle();

      if (hasVerifiedSupabaseTotp || dbData) {
        return {
          is_2fa_enabled: Boolean(hasVerifiedSupabaseTotp || dbData?.is_totp_enabled),
          secret_key: dbData?.totp_secret_encrypted ? '••••••••' : undefined,
          backup_codes: dbData?.backup_codes || [],
          last_verified_at: dbData?.last_verified_at || (hasVerifiedSupabaseTotp ? new Date().toISOString() : undefined),
          enforced_by_role: enforced || Boolean(dbData?.enforced_by_role)
        };
      }
    } catch (e) {
      console.warn('[MFA] Supabase query fallback:', e);
    }
  }

  // 2. Local storage fallback
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        enforced_by_role: enforced || parsed.enforced_by_role
      };
    }
  } catch (e) {
    console.warn('[MFA] LocalStorage parse notice:', e);
  }

  // Default initial state
  return {
    is_2fa_enabled: false,
    enforced_by_role: enforced,
    backup_codes: []
  };
}

/**
 * Begin 2FA Enrollment: generates secret, QR code, and backup codes
 */
export async function enrollMfa(userId: string, email: string): Promise<{
  factorId?: string;
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
  backupCodes: string[];
}> {
  // If Supabase is online with live auth, attempt native enrollment
  if (isSupabaseConfigured) {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Booster Friends',
          friendlyName: email
        });

        if (!error && data) {
          const secret = data.totp.secret;
          const qrCodeUrl = data.totp.qr_code || generateOtpAuthQrSvg(data.totp.uri);
          const backupCodes = generateBackupCodes(8);

          return {
            factorId: data.id,
            secret,
            qrCodeUrl,
            otpauthUrl: data.totp.uri,
            backupCodes
          };
        }
      }
    } catch (err) {
      console.warn('[MFA] Supabase mfa.enroll fallback to local generator:', err);
    }
  }

  // Local / Demo mode enrollment
  const secret = generateBase32Secret(20);
  const otpauthUrl = buildOtpAuthUrl(secret, email);
  const qrCodeUrl = generateOtpAuthQrSvg(otpauthUrl);
  const backupCodes = generateBackupCodes(8);

  return {
    factorId: 'factor_local_' + Date.now(),
    secret,
    qrCodeUrl,
    otpauthUrl,
    backupCodes
  };
}

/**
 * Verify and finalize 2FA enrollment with an initial TOTP code
 */
export async function verifyAndActivateMfa(params: {
  userId: string;
  code: string;
  factorId?: string;
  secret: string;
  backupCodes: string[];
  role?: string;
  email?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { userId, code, factorId, secret, backupCodes, role, email } = params;
  const cleanCode = code.trim().replace(/\s+/g, '');

  // Live Supabase verification
  if (isSupabaseConfigured && factorId && !factorId.startsWith('factor_local_')) {
    try {
      const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId
      });
      if (challengeErr) throw challengeErr;

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: cleanCode
      });
      if (verifyErr) throw verifyErr;

      // Persist in user_mfa_settings table
      await supabase.from('user_mfa_settings').upsert({
        user_id: userId,
        is_totp_enabled: true,
        totp_secret_encrypted: secret,
        backup_codes: backupCodes,
        enforced_by_role: is2FAEnforcedByRole(role, email),
        last_verified_at: new Date().toISOString()
      });
    } catch (err: any) {
      return { success: false, error: err?.message || 'Felaktig TOTP-kod från autentiseringsapp.' };
    }
  }

  // Demo / local validation: Accept valid 6-digit codes (accepts '123456' or any 6-digit format in preview)
  if (cleanCode.length !== 6 && !backupCodes.includes(cleanCode)) {
    return { success: false, error: 'Koden måste bestå av 6 siffror (eller en giltig 9-teckens reservkod).' };
  }

  // Save state locally
  const settings: TotpSecuritySettings = {
    is_2fa_enabled: true,
    secret_key: secret,
    backup_codes: backupCodes,
    last_verified_at: new Date().toISOString(),
    enforced_by_role: is2FAEnforcedByRole(role, email)
  };

  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(settings));
    // Also mark in persona if needed
    localStorage.setItem(`booster_mfa_active_${userId}`, 'true');
  } catch (e) {
    console.warn('[MFA] LocalStorage write notice:', e);
  }

  return { success: true };
}

/**
 * Verify TOTP or Backup Code during Login (Step 2)
 */
export async function verifyTotpLogin(params: {
  userId: string;
  code: string;
  factorId?: string;
}): Promise<{ success: boolean; error?: string; usedBackupCode?: boolean }> {
  const { userId, code, factorId } = params;
  const cleanCode = code.trim().replace(/\s+/g, '');

  if (isSupabaseConfigured && factorId && !factorId.startsWith('factor_local_')) {
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verifyRes = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: cleanCode
      });
      if (verifyRes.error) throw verifyRes.error;

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Ogiltig 2FA-kod. Kontrollera din app eller prova en reservkod.' };
    }
  }

  // Check saved local settings
  const raw = localStorage.getItem(STORAGE_PREFIX + userId);
  let backupCodes: string[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      backupCodes = parsed.backup_codes || [];
    } catch {}
  }

  // Check if it's a backup code
  if (backupCodes.includes(cleanCode.toUpperCase())) {
    // Consume backup code
    const remaining = backupCodes.filter(c => c !== cleanCode.toUpperCase());
    try {
      const parsed = JSON.parse(raw || '{}');
      parsed.backup_codes = remaining;
      localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(parsed));
    } catch {}

    return { success: true, usedBackupCode: true };
  }

  // Check 6-digit TOTP code (allow 123456 or standard 6 digits in demo mode)
  if (cleanCode === '123456' || (/^\d{6}$/.test(cleanCode) && cleanCode.length === 6)) {
    return { success: true };
  }

  return { 
    success: false, 
    error: 'Felaktig engångskod. Ange den 6-siffriga koden från Google Authenticator eller Authy (testkod: 123456).' 
  };
}

/**
 * Disable 2FA / Remove TOTP factor
 */
export async function disableMfa(userId: string, factorId?: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && factorId && !factorId.startsWith('factor_local_')) {
    try {
      await supabase.auth.mfa.unenroll({ factorId });
      await supabase.from('user_mfa_settings').update({
        is_totp_enabled: false,
        totp_secret_encrypted: null,
        backup_codes: []
      }).eq('user_id', userId);
    } catch (err: any) {
      console.warn('[MFA] Supabase unenroll warning:', err);
    }
  }

  try {
    localStorage.removeItem(STORAGE_PREFIX + userId);
    localStorage.removeItem(`booster_mfa_active_${userId}`);
  } catch {}

  return { success: true };
}
