// src/lib/mockRbacFilter.ts
import { MemberProfile } from '../types';

export interface AuthContextUser {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'HUB_HOST' | 'MEMBER' | 'GUEST' | 'PROSPECT';
  primary_hub_id?: string | null;
  membership_level: 'BRONZE' | 'SILVER' | 'GOLD';
}

/**
 * Helper to normalize any member / user object into AuthContextUser
 */
export function toAuthContextUser(user: any, isGuest?: boolean): AuthContextUser | null {
  if (!user) return null;
  if (isGuest || user.role === 'GUEST' || user.isGuest) {
    return {
      id: user.id || 'guest',
      email: user.email || '',
      role: 'GUEST',
      primary_hub_id: null,
      membership_level: 'BRONZE'
    };
  }

  // Derive role if not explicitly defined
  let derivedRole: 'SUPER_ADMIN' | 'HUB_HOST' | 'MEMBER' | 'GUEST' | 'PROSPECT' = 'MEMBER';
  if (user.role) {
    derivedRole = user.role;
  } else if (user.is_admin || user.id === 'usr_rickard_wigrund') {
    derivedRole = 'SUPER_ADMIN';
  } else if (user.is_hub_host || user.role_title?.toLowerCase().includes('host') || user.role_title?.toLowerCase().includes('värd')) {
    derivedRole = 'HUB_HOST';
  } else {
    derivedRole = 'MEMBER';
  }

  return {
    id: user.id,
    email: user.email || '',
    role: derivedRole,
    primary_hub_id: user.primary_hub_id || user.hub_id || null,
    membership_level: user.membership_level || 'BRONZE'
  };
}

/**
 * Filter för Fakturor:
 * SUPER_ADMIN ser allt.
 * HUB_HOST ser inga fakturor.
 * Vanlig MEMBER ser enbart sina egna fakturor.
 * GUEST ser inga fakturor.
 */
export function filterMockInvoices(invoices: any[], currentUser: AuthContextUser | any | null) {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  if (!user || user.role === 'GUEST' || user.role === 'HUB_HOST') return [];
  if (user.role === 'SUPER_ADMIN') return invoices;
  
  return invoices.filter(inv => 
    inv.member_id === user.id || 
    inv.recipient_email?.toLowerCase() === user.email.toLowerCase()
  );
}

/**
 * Filter för CRM Pipeline / Deals:
 * SUPER_ADMIN ser hela plattformens pipeline.
 * HUB_HOST ser deals för sin specifika hubb eller egna deals.
 * MEMBER ser enbart affärer de själva äger eller skapat.
 * GUEST ser inga deals.
 */
export function filterMockDeals(deals: any[], currentUser: AuthContextUser | any | null) {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  if (!user || user.role === 'GUEST') return [];
  if (user.role === 'SUPER_ADMIN') return deals;

  if (user.role === 'HUB_HOST') {
    return deals.filter(deal => 
      deal.owner_member_id === user.id || 
      deal.contact_member_id === user.id ||
      (user.primary_hub_id && deal.hub_id === user.primary_hub_id)
    );
  }

  return deals.filter(deal => 
    deal.owner_member_id === user.id || 
    deal.contact_member_id === user.id
  );
}

/**
 * Filter för Hubb-hantering och Bokningar:
 * SUPER_ADMIN ser alla bokningar.
 * HUB_HOST ser alla bokningar för sin specifika hubb.
 * MEMBER ser dagens öppna bokningar samt alla sina egna framtida.
 * GUEST ser endast dagens publika platser utan medlemsdetaljer.
 */
export function filterMockBookings(bookings: any[], currentUser: AuthContextUser | any | null) {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  if (!user) return [];
  if (user.role === 'SUPER_ADMIN') return bookings;

  if (user.role === 'HUB_HOST') {
    return bookings.filter(b => b.hub_id === user.primary_hub_id);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (user.role === 'GUEST') {
    return bookings.filter(b => b.booking_date === todayStr);
  }

  return bookings.filter(b => b.member_id === user.id || b.booking_date === todayStr);
}

/**
 * Filter för Proximity Pings (Kaffe & Lunch):
 * SUPER_ADMIN kan pinga och se alla pings.
 * HUB_HOST ser pings i sin hubb eller egna.
 * MEMBER ser enbart pings där man själv är avsändare eller mottagare.
 * GUEST ser inga pings (måste skapa konto först).
 */
export function filterMockPings(pings: any[], currentUser: AuthContextUser | any | null) {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  if (!user || user.role === 'GUEST') return [];
  if (user.role === 'SUPER_ADMIN') return pings;

  if (user.role === 'HUB_HOST') {
    return pings.filter(p => 
      p.hub_id === user.primary_hub_id || 
      p.sender_member_id === user.id || 
      p.receiver_member_id === user.id
    );
  }

  return pings.filter(p => p.sender_member_id === user.id || p.receiver_member_id === user.id);
}

/**
 * Filter för Medlemskatalog (Profiles):
 * SUPER_ADMIN ser full data inklusive e-post, telefon och betalstatus.
 * HUB_HOST ser hubbmedlemmar med fullare data.
 * MEMBER och GUEST ser publik medlemsdata.
 */
export function filterMockProfiles(profiles: MemberProfile[], currentUser: AuthContextUser | any | null): MemberProfile[] {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  if (!user || user.role === 'SUPER_ADMIN') return profiles;

  if (user.role === 'HUB_HOST') {
    // Hub host sees members in their hub with full data, others as public
    return profiles.map(p => {
      if (p.hub_id === user.primary_hub_id || p.id === user.id) {
        return p;
      }
      return {
        ...p,
        phone: 'Dold (Endast för kontakt i samma hubb)',
        payment_status: undefined
      };
    });
  }

  // Regular members & guests see public profile data
  return profiles.map(p => {
    if (p.id === user.id) return p;
    return {
      ...p,
      phone: p.phone ? 'Dold (Kontakt via intro-chatt)' : '',
      payment_status: undefined,
      next_billing_date: undefined,
      billing_cycle: undefined
    };
  });
}

/**
 * Behörighetskontroller för UI & Moduler
 */
export function canManageSystemRules(currentUser: AuthContextUser | any | null): boolean {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  return user?.role === 'SUPER_ADMIN';
}

export function canAccessAdminPortal(currentUser: AuthContextUser | any | null): boolean {
  const user = currentUser?.role ? (currentUser as AuthContextUser) : toAuthContextUser(currentUser);
  return user?.role === 'SUPER_ADMIN';
}
