import { Member } from '../types';

/**
 * Returns the smart connect URL for a given member.
 * When scanned by a mobile camera, this URL opens the web browser directly,
 * evaluates whether the scanner is logged in or new, triggers the friend connection,
 * and awards Booster Points.
 */
export function getConnectUrl(memberId: string): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/connect?ref=${encodeURIComponent(memberId)}`;
  }
  return `https://booster-friends.vercel.app/connect?ref=${encodeURIComponent(memberId)}`;
}

export type VCardMemberInput = Pick<Member, 'id' | 'full_name' | 'company_name' | 'role_title'> & Partial<Member>;

export function generateVCardString(member: VCardMemberInput): string {
  const connectUrl = getConnectUrl(member.id);

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.full_name}`,
    `N:${member.full_name.split(' ').slice(1).join(' ') || ''};${member.full_name.split(' ')[0]};;;`,
    `ORG:${member.company_name}`,
    `TITLE:${member.role_title}`,
    `TEL;TYPE=CELL,VOICE:${member.phone || '+46 70 000 00 00'}`,
    `EMAIL;TYPE=INTERNET,WORK:${member.email || 'kontakt@boosterfriends.se'}`,
    `URL:${connectUrl}`,
  ];

  if (member.linkedin_url && member.linkedin_url.trim() !== '') {
    lines.push(`URL;TYPE=LinkedIn:${member.linkedin_url.trim()}`);
  }

  if (member.website_url && member.website_url.trim() !== '') {
    lines.push(`URL;TYPE=WORK:${member.website_url.trim()}`);
  }

  lines.push(
    `ADR;TYPE=WORK:;;${member.city || 'Stockholm'};;;;Sweden`,
    `NOTE:Booster Friends B2B Nätverk - ${member.membership_level || 'GOLD'} Medlem (Booster Score: ${member.booster_score || 100} BP) • Connect: ${connectUrl}`,
    'END:VCARD'
  );

  return lines.join('\r\n');
}

export function downloadVCard(member: VCardMemberInput): void {
  if (typeof window === 'undefined') return;
  const vcard = generateVCardString(member);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = member.full_name.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, '_');
  link.setAttribute('download', `${safeName}_BoosterFriends.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
