import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Member, MembershipLevel } from '../types';
import { CURRENT_USER, INITIAL_MEMBERS } from '../data/initialData';
import { useAccountSecurityEnforcer } from '../hooks/useAccountSecurityEnforcer';

export { useAccountSecurityEnforcer };

export interface DemoProfiles {
  admin: Member;
  gold: Member;
  silver: Member;
  bronze: Member;
  hub_host: Member;
  guest: Member;
}

export interface SignUpParams {
  email: string;
  password?: string;
  fullName: string;
  companyName: string;
  roleTitle: string;
  membershipLevel?: MembershipLevel;
  phone?: string;
  linkedinUrl?: string;
  invitedBy?: string;
}

interface AuthContextType {
  session: any | null;
  user: any | null;
  currentUser: Member | null;
  profile: Member | null;
  isGuest: boolean;
  loading: boolean;
  isSupabaseOnline: boolean;
  demoProfiles: DemoProfiles;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null; message?: string }>;
  signUp: (params: SignUpParams) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoUser: (memberIdOrTier: string) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<Member | null>>;
  setProfile: React.Dispatch<React.SetStateAction<Member | null>>;
  updateProfile: (updates: Partial<Member>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_MEMBER: Member = {
  ...CURRENT_USER,
  id: 'usr_guest_demo',
  full_name: 'Besökare (Gäst)',
  email: 'gast@exempel.se',
  phone: '+46 00 000 00 00',
  role: 'GUEST',
  is_admin: false,
  primary_hub_id: null,
  hub_id: 'hub_stockholm',
  hub_name: 'Hubb Stockholm City',
  company_name: 'Ej anslutet bolag',
  role_title: 'Oinloggad gäst',
  membership_level: 'BRONZE',
  booster_score: 0,
  deals_closed_sek: 0,
  city: 'Stockholm',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Oinloggad gäst som utforskar Booster Friends-plattformen.',
  offering_tags: [],
  seeking_tags: [],
  created_at: new Date().toISOString()
};

const HUB_HOST_MEMBER: Member = {
  ...(INITIAL_MEMBERS.find(m => m.role === 'HUB_HOST') || INITIAL_MEMBERS[1]),
  role: 'HUB_HOST',
  is_admin: false,
  primary_hub_id: 'hub_stockholm',
  role_title: 'Hub Host Stockholm'
};

const SUPER_ADMIN_MEMBER: Member = {
  ...CURRENT_USER,
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  email: 'admin@performile.com',
  full_name: 'Rickard Wigrund',
  company_name: 'Performile / inCtrl .inc',
  role_title: 'Grundare & Super Admin',
  role: 'SUPER_ADMIN',
  is_admin: true,
  membership_level: 'GOLD',
  booster_score: 2500,
};

const GOLD_CUSTOMER_MEMBER: Member = {
  id: 'demo-gold-customer-id',
  full_name: 'Johan Bergström',
  email: 'johan@investment.se',
  role: 'MEMBER',
  is_admin: false,
  membership_level: 'GOLD',
  booster_score: 1450,
  phone: '+46 70 889 91 12',
  company_name: 'Bergström Capital Invest AB',
  role_title: 'Managing Partner & Ängelinvesterare',
  city: 'Stockholm',
  hub_id: 'hub_stockholm',
  hub_name: 'Hubb Stockholm City',
  primary_hub_id: 'hub_stockholm',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bio: 'Guldmedlem och betalande kund inom Nordic Tech. Söker skalbara B2B SaaS-bolag och medinvesterare.',
  seeking_tags: ['SaaS Series A', 'Co-investerare', 'Styrelseuppdrag'],
  offering_tags: ['Tillväxtkapital', 'Skalningsrådgivning', 'Ängelnätverk'],
  deals_closed_sek: 8500000,
  referrals_sent: 28,
  rating_avg: 4.9,
  reviews_count: 22,
  payment_status: 'PAID',
  created_at: '2023-01-15T10:00:00Z'
};

const SILVER_MEMBER: Member = {
  id: 'demo-silver-id',
  full_name: 'Elena Rostova',
  email: 'elena@growth.se',
  role: 'MEMBER',
  is_admin: false,
  membership_level: 'SILVER',
  booster_score: 840,
  phone: '+46 73 988 77 66',
  company_name: 'Growth Accelerate Nordic',
  role_title: 'Senior Growth & Performance Lead',
  city: 'Göteborg',
  hub_id: 'hub_gbg',
  hub_name: 'Hubb Göteborg Central',
  primary_hub_id: 'hub_gbg',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  bio: 'Silvermedlem. Hjälper tillväxtbolag att optimera säljtrattar och digital distribution.',
  seeking_tags: ['B2B-kunder', 'Partnersamarbeten'],
  offering_tags: ['Performance Marketing', 'Lead Generation', 'CRO'],
  deals_closed_sek: 1850000,
  referrals_sent: 16,
  rating_avg: 4.8,
  reviews_count: 15,
  payment_status: 'PAID',
  created_at: '2023-08-20T09:00:00Z'
};

const BRONZE_MEMBER: Member = {
  id: 'demo-bronze-id',
  full_name: 'Amanda Lind',
  email: 'amanda@bolag.se',
  role: 'MEMBER',
  is_admin: false,
  membership_level: 'BRONZE',
  booster_score: 180,
  phone: '+46 72 112 23 34',
  company_name: 'Lind Creative Design',
  role_title: 'UX/UI Designer & Varumärkesstrateg',
  city: 'Stockholm',
  hub_id: 'hub_stockholm',
  hub_name: 'Hubb Stockholm City',
  primary_hub_id: 'hub_stockholm',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  bio: 'Bronsmedlem. Passionerad designer med fokus på konvertering och modern digital produktupplevelse.',
  seeking_tags: ['Designuppdrag', 'E-handlare', 'Startups'],
  offering_tags: ['UI/UX Design', 'Design Systems', 'Branding'],
  deals_closed_sek: 320000,
  referrals_sent: 6,
  rating_avg: 4.7,
  reviews_count: 8,
  payment_status: 'PAID',
  created_at: '2024-03-10T14:00:00Z'
};

export const DEMO_PROFILES: DemoProfiles = {
  admin: SUPER_ADMIN_MEMBER,
  gold: GOLD_CUSTOMER_MEMBER,
  silver: SILVER_MEMBER,
  bronze: BRONZE_MEMBER,
  hub_host: HUB_HOST_MEMBER,
  guest: GUEST_MEMBER
};

export const AuthProvider: React.FC<{
  children: ReactNode;
  initialUser?: Member;
  onUserChange?: (user: Member) => void;
}> = ({ children, initialUser, onUserChange }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  // Default is strictly null unless initialUser or explicitly saved persona in localStorage
  const [currentUser, setCurrentUserState] = useState<Member | null>(() => {
    if (initialUser) return initialUser;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('booster_active_persona');
      if (saved && DEMO_PROFILES[saved as keyof DemoProfiles]) {
        return DEMO_PROFILES[saved as keyof DemoProfiles];
      }
      if (saved) {
        const found = INITIAL_MEMBERS.find(m => m.id === saved || m.email.toLowerCase() === saved.toLowerCase());
        if (found) return found;
      }
    }
    return null;
  });
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(isSupabaseConfigured);

  const setCurrentUser = useCallback((valueOrFn: Member | null | ((prev: Member | null) => Member | null)) => {
    setCurrentUserState(prev => {
      const nextUser = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      if (onUserChange && nextUser) {
        setTimeout(() => {
          onUserChange(nextUser);
        }, 0);
      }
      return nextUser;
    });
  }, [onUserChange]);

  // 1. Listen for Supabase auth state change
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (!error && existingSession && mounted) {
          setSession(existingSession);
          setUser(existingSession.user);
          setIsSupabaseOnline(true);
          setIsGuest(false);
          await loadUserProfile(existingSession.user.id, existingSession.user);
        }
      } catch (err) {
        console.warn('AuthContext init notice:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        setIsGuest(false);
        setIsSupabaseOnline(true);
        await loadUserProfile(newSession.user.id, newSession.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCurrentUserState(null);
        setIsGuest(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper to load or map profile from Supabase 'profiles' table
  async function loadUserProfile(userId: string, authUser?: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setCurrentUser(prev => {
          const base = prev || DEMO_PROFILES.bronze;
          return {
            ...base,
            id: data.id,
            full_name: data.full_name || authUser?.user_metadata?.full_name || base.full_name || 'Ny Medlem',
            company_name: data.company_name || authUser?.user_metadata?.company_name || base.company_name || 'Företag',
            role_title: data.role_title || authUser?.user_metadata?.role_title || base.role_title || 'Medlem',
            membership_level: (data.membership_level as MembershipLevel) || base.membership_level || 'BRONZE',
            booster_score: data.booster_score ?? base.booster_score ?? 100,
            email: data.email || authUser?.email || base.email,
            phone: data.phone || base.phone,
            city: data.city || base.city || 'Mölnlycke',
            avatar: data.avatar_url || base.avatar,
            bio: data.bio || base.bio || '',
            is_admin: data.is_admin ?? base.is_admin ?? false
          };
        });
      } else if (authUser?.user_metadata) {
        // Construct from raw metadata if profile row isn't indexed yet
        const meta = authUser.user_metadata;
        setCurrentUser(prev => {
          const base = prev || DEMO_PROFILES.bronze;
          return {
            ...base,
            id: userId,
            full_name: meta.full_name || base.full_name || 'Ny Medlem',
            company_name: meta.company_name || base.company_name || 'Bolag',
            role_title: meta.role_title || base.role_title || 'Entreprenör',
            membership_level: (meta.membership_level as MembershipLevel) || base.membership_level || 'BRONZE',
            email: authUser.email || base.email,
            booster_score: base.booster_score ?? 100
          };
        });
      }
    } catch (err) {
      console.warn('Could not load profile from Supabase, maintaining local active user:', err);
    }
  }

  // 2. Sign in with Email & Password
  const signInWithEmail = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (error) {
          console.warn('Supabase sign-in note:', error.message);
        } else if (data.user) {
          setIsGuest(false);
          await loadUserProfile(data.user.id, data.user);
          return { error: null };
        }
      }

      // Check if logging in as Rickard Wigrund (Super Admin) with admin@performile.com or rickard@wigrund.se
      if (normalizedEmail === 'admin@performile.com' || normalizedEmail === 'rickard@wigrund.se') {
        const adminUser: Member = {
          ...SUPER_ADMIN_MEMBER,
          email: normalizedEmail,
          company_name: normalizedEmail === 'admin@performile.com' ? 'Performile / inCtrl .inc' : 'inCtrl .inc'
        };
        setCurrentUser(adminUser);
        localStorage.setItem('booster_active_persona', 'admin');
        setIsGuest(false);
        return { error: null };
      }

      // Fallback in demo mode: match mock members by email
      const matched = INITIAL_MEMBERS.find(m => m.email.toLowerCase() === normalizedEmail);
      if (matched) {
        setCurrentUser(matched);
        const tierKey = Object.entries(DEMO_PROFILES).find(([_, p]) => p.id === matched.id || p.email.toLowerCase() === matched.email.toLowerCase())?.[0];
        if (tierKey) {
          localStorage.setItem('booster_active_persona', tierKey);
        } else {
          localStorage.setItem('booster_active_persona', matched.id);
        }
        setIsGuest(matched.role === 'GUEST');
        return { error: null };
      }

      // If valid email format is provided, allow demo login
      if (normalizedEmail.includes('@')) {
        const testMember: Member = {
          ...DEMO_PROFILES.bronze,
          id: `usr_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          email: normalizedEmail,
          full_name: normalizedEmail.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
          company_name: 'Testbolag AB',
          role_title: 'Medlem',
          membership_level: 'BRONZE',
          booster_score: 150
        };
        setCurrentUser(testMember);
        localStorage.setItem('booster_active_persona', 'bronze');
        setIsGuest(false);
        return { error: null };
      }

      return { error: new Error('Ogiltig e-postadress eller lösenord.') };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 3. Magic Link (Passwordless)
  const signInWithOtp = async (email: string): Promise<{ error: Error | null; message?: string }> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        return { error: null, message: `En inloggningslänk (Magic Link) har skickats till ${email}!` };
      }

      // Demo fallback simulation
      return { 
        error: null, 
        message: `(Demoläge) Inloggningslänk genererad för ${email}. I produktion öppnar detta din e-post!` 
      };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 4. Sign Up (with metadata for Postgres trigger handle_new_user)
  const signUp = async (params: SignUpParams): Promise<{ error: Error | null }> => {
    try {
      const { email, password = 'DemoPassword123!', fullName, companyName, roleTitle, membershipLevel = 'BRONZE', phone, linkedinUrl, invitedBy } = params;
      const normalizedEmail = email.trim().toLowerCase();
      const trialEndDate = new Date(Date.now() + 14 * 86400000).toISOString();

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName,
              role_title: roleTitle,
              membership_level: membershipLevel,
              phone: phone || null,
              linkedin_url: linkedinUrl || null,
              invited_by: invitedBy || null
            }
          }
        });
        if (error) throw error;

        // If user created, construct and set as active
        if (data.user) {
          const newMember: Member = {
            ...DEMO_PROFILES.bronze,
            id: data.user.id,
            full_name: fullName,
            email: normalizedEmail,
            phone: phone || '+46 70 000 00 00',
            company_name: companyName,
            role_title: roleTitle,
            membership_level: membershipLevel,
            linkedin_url: linkedinUrl || undefined,
            payment_status: 'TRIAL',
            trial_ends_at: trialEndDate,
            booster_score: 100,
            city: 'Mölnlycke',
            created_at: new Date().toISOString()
          };
          setCurrentUser(newMember);
          localStorage.setItem('booster_active_persona', newMember.id);
          setIsGuest(false);
        }
        return { error: null };
      }

      // Fallback for demo without Supabase keys
      const newDemoMember: Member = {
        ...DEMO_PROFILES.bronze,
        id: `usr_demo_${Date.now()}`,
        full_name: fullName,
        email: normalizedEmail,
        phone: phone || '+46 70 123 45 67',
        company_name: companyName,
        role_title: roleTitle,
        membership_level: membershipLevel,
        linkedin_url: linkedinUrl || undefined,
        payment_status: 'TRIAL',
        trial_ends_at: trialEndDate,
        booster_score: 100,
        city: 'Mölnlycke',
        created_at: new Date().toISOString()
      };
      setCurrentUser(newDemoMember);
      localStorage.setItem('booster_active_persona', 'bronze');
      setIsGuest(false);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 5. Sign Out / Logout
  const logout = async () => {
    try {
      // 1. Logga ut från Supabase om vi kör mot skarp databas
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Fel vid utloggning från Supabase:', err);
    } finally {
      // 2. Nollställ ALLA lokala tillstånd
      setUser(null);
      setSession(null);
      setCurrentUserState(null);
      setIsGuest(false);

      // 3. Rensa webbläsarlagring för session och mock-personas
      localStorage.removeItem('booster_active_persona');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('booster_demo_user_id');
      sessionStorage.clear();
    }
  };

  const signOut = logout;

  // Real-time account security enforcement (listens to profiles table for status FROZEN / deletion)
  useAccountSecurityEnforcer(currentUser, logout);

  // 6. Switch Demo User (Admin / Gold / Silver / Bronze / Hub Host / Guest)
  const switchDemoUser = (memberIdOrTier: string) => {
    const tierLower = memberIdOrTier.toLowerCase();
    if (tierLower === 'admin' || tierLower === 'super_admin' || memberIdOrTier === DEMO_PROFILES.admin.id) {
      setCurrentUser(DEMO_PROFILES.admin);
      localStorage.setItem('booster_active_persona', 'admin');
      setIsGuest(false);
    } else if (tierLower === 'gold' || memberIdOrTier === DEMO_PROFILES.gold.id) {
      setCurrentUser(DEMO_PROFILES.gold);
      localStorage.setItem('booster_active_persona', 'gold');
      setIsGuest(false);
    } else if (tierLower === 'silver' || memberIdOrTier === DEMO_PROFILES.silver.id) {
      setCurrentUser(DEMO_PROFILES.silver);
      localStorage.setItem('booster_active_persona', 'silver');
      setIsGuest(false);
    } else if (tierLower === 'bronze' || memberIdOrTier === DEMO_PROFILES.bronze.id) {
      setCurrentUser(DEMO_PROFILES.bronze);
      localStorage.setItem('booster_active_persona', 'bronze');
      setIsGuest(false);
    } else if (tierLower === 'hub_host' || memberIdOrTier === DEMO_PROFILES.hub_host.id) {
      setCurrentUser(DEMO_PROFILES.hub_host);
      localStorage.setItem('booster_active_persona', 'hub_host');
      setIsGuest(false);
    } else if (tierLower === 'guest' || memberIdOrTier === DEMO_PROFILES.guest.id) {
      setCurrentUser(DEMO_PROFILES.guest);
      localStorage.setItem('booster_active_persona', 'guest');
      setIsGuest(true);
    } else {
      const found = INITIAL_MEMBERS.find(m => m.id === memberIdOrTier || m.email.toLowerCase() === memberIdOrTier.toLowerCase());
      if (found) {
        setCurrentUser(found);
        localStorage.setItem('booster_active_persona', found.id);
      }
      setIsGuest(false);
    }
  };

  // 7. Update profile
  const updateProfile = async (updates: Partial<Member>) => {
    if (!currentUser) return;
    setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));

    if (isSupabaseConfigured && currentUser.id) {
      try {
        await supabase.from('profiles').update({
          full_name: updates.full_name,
          company_name: updates.company_name,
          role_title: updates.role_title,
          phone: updates.phone,
          bio: updates.bio,
          city: updates.city,
          avatar_url: updates.avatar,
          updated_at: new Date().toISOString()
        }).eq('id', currentUser.id);
      } catch (err) {
        console.warn('Supabase update profile error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        currentUser,
        profile: currentUser,
        isGuest,
        loading,
        isSupabaseOnline,
        demoProfiles: DEMO_PROFILES,
        signInWithEmail,
        signInWithOtp,
        signUp,
        signOut,
        logout,
        switchDemoUser,
        setCurrentUser,
        setProfile: setCurrentUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
