import { useState, useEffect } from 'react';
import { Member } from '../types';
import { INITIAL_MEMBERS, CURRENT_USER } from '../data/initialData';

export interface AuthRedirectInfo {
  referralCode: string | null;
  inviter: Member | null;
  isConnectRoute: boolean;
  clearReferral: () => void;
}

export function useAuthRedirect(allMembers: Member[] = INITIAL_MEMBERS): AuthRedirectInfo {
  const [referralCode, setReferralCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('booster_invite_ref') || null;
    }
    return null;
  });

  const [isConnectRoute, setIsConnectRoute] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryRef = urlParams.get('ref') || urlParams.get('invited_by') || urlParams.get('code');
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      const connectDetected = 
        pathname.includes('/connect') || 
        hash.includes('connect') || 
        queryRef !== null;

      if (connectDetected) {
        setIsConnectRoute(true);
      }

      if (queryRef) {
        setReferralCode(queryRef);
        localStorage.setItem('booster_invite_ref', queryRef);
      }
    } catch (e) {
      console.warn('URL parsing notice:', e);
    }
  }, []);

  const clearReferral = () => {
    setReferralCode(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('booster_invite_ref');
    }
  };

  // Resolve inviter member
  const inviter: Member | null = (() => {
    if (!referralCode) return null;
    const cleanRef = referralCode.toLowerCase();
    const found = allMembers.find(m => 
      m.id.toLowerCase() === cleanRef || 
      m.full_name.toLowerCase().includes(cleanRef)
    );
    // If ref is provided but not found, fallback to Founder Rickard Wigrund
    return found || CURRENT_USER;
  })();

  return {
    referralCode,
    inviter,
    isConnectRoute,
    clearReferral
  };
}
