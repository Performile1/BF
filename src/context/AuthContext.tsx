import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Member, MembershipLevel } from '../types';
import { CURRENT_USER, INITIAL_MEMBERS } from '../data/initialData';

export interface DemoProfiles {
  bronze: Member;
  silver: Member;
  gold: Member;
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
  currentUser: Member;
  isGuest: boolean;
  loading: boolean;
  isSupabaseOnline: boolean;
  demoProfiles: DemoProfiles;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (email: string) => Promise<{ error: Error | null; message?: string }>;
  signUp: (params: SignUpParams) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  switchDemoUser: (memberIdOrTier: string) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<Member>>;
  updateProfile: (updates: Partial<Member>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Identified 3 archetypal demo personas for rapid 1-click B2B testing
const DEMO_PROFILES: DemoProfiles = {
  gold: CURRENT_USER, // Rickard Wigrund (Gold / Founder)
  silver: INITIAL_MEMBERS.find(m => m.membership_level === 'SILVER') || INITIAL_MEMBERS[3], // Elena Rostova
  bronze: INITIAL_MEMBERS.find(m => m.membership_level === 'BRONZE') || INITIAL_MEMBERS[5]  // Amanda Berg
};

export const AuthProvider: React.FC<{
  children: ReactNode;
  initialUser?: Member;
  onUserChange?: (user: Member) => void;
}> = ({ children, initialUser, onUserChange }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [currentUser, setCurrentUserState] = useState<Member>(initialUser || DEMO_PROFILES.gold);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(isSupabaseConfigured);

  const setCurrentUser = useCallback((valueOrFn: Member | ((prev: Member) => Member)) => {
    setCurrentUserState(prev => {
      const nextUser = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      if (onUserChange) {
        queueMicrotask(() => {
          onUserChange(nextUser);
        });
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
        setIsGuest(true);
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
        setCurrentUser(prev => ({
          ...prev,
          id: data.id,
          full_name: data.full_name || authUser?.user_metadata?.full_name || prev.full_name || 'Ny Medlem',
          company_name: data.company_name || authUser?.user_metadata?.company_name || prev.company_name || 'Företag',
          role_title: data.role_title || authUser?.user_metadata?.role_title || prev.role_title || 'Medlem',
          membership_level: (data.membership_level as MembershipLevel) || prev.membership_level || 'BRONZE',
          booster_score: data.booster_score ?? prev.booster_score ?? 100,
          email: data.email || authUser?.email || prev.email,
          phone: data.phone || prev.phone,
          city: data.city || prev.city || 'Mölnlycke',
          avatar: data.avatar_url || prev.avatar,
          bio: data.bio || prev.bio || '',
          is_admin: data.is_admin ?? prev.is_admin ?? false
        }));
      } else if (authUser?.user_metadata) {
        // Construct from raw metadata if profile row isn't indexed yet
        const meta = authUser.user_metadata;
        setCurrentUser(prev => ({
          ...prev,
          id: userId,
          full_name: meta.full_name || prev.full_name || 'Ny Medlem',
          company_name: meta.company_name || prev.company_name || 'Bolag',
          role_title: meta.role_title || prev.role_title || 'Entreprenör',
          membership_level: (meta.membership_level as MembershipLevel) || prev.membership_level || 'BRONZE',
          email: authUser.email || prev.email,
          booster_score: prev.booster_score ?? 100
        }));
      }
    } catch (err) {
      console.warn('Could not load profile from Supabase, maintaining local active user:', err);
    }
  }

  // 2. Sign in with Email & Password
  const signInWithEmail = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setIsGuest(false);
          await loadUserProfile(data.user.id, data.user);
        }
        return { error: null };
      }

      // Fallback in demo mode: match mock members by email
      const matched = INITIAL_MEMBERS.find(m => m.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        setIsGuest(false);
        return { error: null };
      }

      // Otherwise log in as current mock user
      setIsGuest(false);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 3. Magic Link (Passwordless)
  const signInWithOtp = async (email: string): Promise<{ error: Error | null; message?: string }> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
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

      const trialEndDate = new Date(Date.now() + 14 * 86400000).toISOString();

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
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
            email: email,
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
          setIsGuest(false);
        }
        return { error: null };
      }

      // Fallback for demo without Supabase keys
      const newDemoMember: Member = {
        ...DEMO_PROFILES.bronze,
        id: `usr_demo_${Date.now()}`,
        full_name: fullName,
        email: email,
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
      setIsGuest(false);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 5. Sign Out
  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('SignOut warning:', err);
    } finally {
      setSession(null);
      setUser(null);
      setIsGuest(true);
    }
  };

  // 6. Switch Demo User (Bronze / Silver / Gold)
  const switchDemoUser = (memberIdOrTier: string) => {
    const tierLower = memberIdOrTier.toLowerCase();
    if (tierLower === 'gold' || memberIdOrTier === DEMO_PROFILES.gold.id) {
      setCurrentUser(DEMO_PROFILES.gold);
    } else if (tierLower === 'silver' || memberIdOrTier === DEMO_PROFILES.silver.id) {
      setCurrentUser(DEMO_PROFILES.silver);
    } else if (tierLower === 'bronze' || memberIdOrTier === DEMO_PROFILES.bronze.id) {
      setCurrentUser(DEMO_PROFILES.bronze);
    } else {
      const found = INITIAL_MEMBERS.find(m => m.id === memberIdOrTier);
      if (found) setCurrentUser(found);
    }
    setIsGuest(false);
  };

  // 7. Update profile
  const updateProfile = async (updates: Partial<Member>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));

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
        isGuest,
        loading,
        isSupabaseOnline,
        demoProfiles: DEMO_PROFILES,
        signInWithEmail,
        signInWithOtp,
        signUp,
        signOut,
        switchDemoUser,
        setCurrentUser,
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
