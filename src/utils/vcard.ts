import { Member } from '../types';

export function generateVCardString(member: Member): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.full_name}`,
    `N:${member.full_name.split(' ').slice(1).join(' ') || ''};${member.full_name.split(' ')[0]};;;`,
    `ORG:${member.company_name}`,
    `TITLE:${member.role_title}`,
    `TEL;TYPE=CELL,VOICE:${member.phone || '+46 70 000 00 00'}`,
    `EMAIL;TYPE=INTERNET,WORK:${member.email}`,
  ];

  if (member.linkedin_url && member.linkedin_url.trim() !== '') {
    lines.push(`URL;TYPE=LinkedIn:${member.linkedin_url.trim()}`);
  } else {
    lines.push('URL;TYPE=LinkedIn:https://boosterfriends.se');
  }

  if (member.website_url && member.website_url.trim() !== '') {
    lines.push(`URL;TYPE=WORK:${member.website_url.trim()}`);
  }

  lines.push(
    `ADR;TYPE=WORK:;;${member.city || 'Stockholm'};;;;Sweden`,
    `NOTE:Booster Friends B2B Nätverk - ${member.membership_level} Medlem (Booster Score: ${member.booster_score} BP)`,
    'END:VCARD'
  );

  return lines.join('\r\n');
}

export function downloadVCard(member: Member): void {
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
