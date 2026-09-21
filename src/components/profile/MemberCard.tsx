import React from 'react';
import { 
  Building2, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Trophy, 
  UserCheck, 
  UserPlus, 
  HeartHandshake, 
  MessageSquare, 
  Coffee, 
  QrCode, 
  Download,
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ThumbsUp 
} from 'lucide-react';
import { Member, MembershipLevel, MemberSkill } from '../../types';
import { downloadVCard } from '../../utils/vcard';
import { AdminInspect } from '../dev/AdminInspect';

export interface MemberCardProps {
  member: Member;
  currentUser: Member;
  isFollowing?: boolean;
  skills?: MemberSkill[];
  onFollowToggle?: (memberId: string) => void;
  onOpenDirectChat?: (memberId: string) => void;
  onOpenUniversalConnect?: (member: Member) => void;
  onSendLunchRequest?: (member: Member) => void;
  onEndorseSkill?: (skillId: string) => void;
  onViewCaseStudies?: (member: Member) => void;
  onAwardPoints?: (points: number, title: string, activityType: any) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currentUser,
  isFollowing = false,
  skills = [],
  onFollowToggle,
  onOpenDirectChat,
  onOpenUniversalConnect,
  onSendLunchRequest,
  onEndorseSkill,
  onViewCaseStudies,
  onAwardPoints
}) => {
  const isMe = member.id === currentUser.id;
  const giveTakeRatio = member.give_take_ratio || 
    ((member.referrals_sent || 1) / Math.max(1, (member.deals_closed_sek > 0 ? 2 : 1))).toFixed(1);

  const getLevelBadge = (level: MembershipLevel) => {
    switch (level) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'BRONZE':
      default:
        return 'bg-orange-100 text-orange-900 border-orange-200';
    }
  };

  const handleDownloadCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadVCard(member);
    if (onAwardPoints && !isMe) {
      onAwardPoints(10, `Sparat kontaktkort för ${member.full_name}`, 'UNIVERSAL_QR_CONNECT');
    }
  };

  return (
    <AdminInspect
      component="MemberCard.tsx"
      sourceTable="public.profiles / member_skills"
      columns={['id', 'full_name', 'avatar', 'membership_level', 'booster_score', 'company_name', 'role_title', 'city']}
      notes="Medlemskort i nätverkskatalog med visitkort, lunch-inbjudan och vCard"
    >
      <div
        id={`member-card-${member.id}`}
        className={`bg-white rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
          isMe ? 'border-[#800020]/30 bg-[#800020]/[0.02]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
      {/* Top Card Section */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.full_name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <span className={`absolute -bottom-1 -right-1 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getLevelBadge(member.membership_level)}`}>
                {member.membership_level}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {member.full_name}
                </h3>
                {isMe && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#800020] text-white">
                    Du
                  </span>
                )}
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#0A66C2] hover:text-[#004182] hover:bg-blue-50 p-1 rounded-md transition inline-flex items-center justify-center"
                    title={`Öppna ${member.full_name}s LinkedIn-profil`}
                    aria-label={`LinkedIn-profil för ${member.full_name}`}
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-600 font-medium truncate mt-0.5">
                {member.role_title}
              </p>
              <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-gray-400" />
                <span>{member.company_name}</span>
              </p>
            </div>
          </div>

          {/* Follow Button */}
          {!isMe && onFollowToggle && (
            <button
              onClick={() => onFollowToggle(member.id)}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                isFollowing
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-[#800020]'
              }`}
              title={isFollowing ? 'Du följer denna medlem' : 'Följ för att få notiser'}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Följer</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Följ</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* City & Contact Preview */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2.5">
          <span className="flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{member.city}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
              <Trophy className="w-3 h-3 text-amber-600" />
              <span>{member.booster_score} BP</span>
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#800020]" />
              <span className="text-gray-500">G/T:</span>
              <span className="font-bold text-[#800020]">{giveTakeRatio}x</span>
            </div>
          </div>
        </div>

        {/* Söker / Erbjuder Pills */}
        <div className="mt-3 space-y-1.5">
          {member.seeking_tags && member.seeking_tags.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                Söker:
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {member.seeking_tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-medium border border-amber-200/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.offering_tags && member.offering_tags.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                Erbjuder:
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {member.offering_tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Merits & Certifications Preview */}
        {member.merits && member.merits.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-gray-800 truncate">
                {member.merits[0].title}
              </span>
            </div>
            {member.merits.length > 1 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                +{member.merits.length - 1} meriter
              </span>
            )}
          </div>
        )}

        {/* Case Studies quick pill */}
        {member.case_studies && member.case_studies.length > 0 && (
          <div className="mt-2 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="text-[11px] font-bold text-emerald-950 truncate">
                {member.case_studies[0].client_name}: {member.case_studies[0].result_metric}
              </span>
            </div>
            {onViewCaseStudies && (
              <button
                type="button"
                onClick={() => onViewCaseStudies(member)}
                className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 underline flex-shrink-0 ml-1"
              >
                Visa {member.case_studies.length} case →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Direct Message button */}
          {!isMe && onOpenDirectChat && (
            <button
              onClick={() => onOpenDirectChat(member.id)}
              className="p-2 rounded-xl text-gray-600 hover:text-[#800020] hover:bg-[#800020]/5 transition border border-gray-200"
              title="Skicka direktmeddelande"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Lunch Invite Button */}
          {!isMe && onSendLunchRequest && (
            <button
              onClick={() => onSendLunchRequest(member)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition border border-amber-200 flex items-center gap-1"
              title="Bjud på lunch eller kaffe"
            >
              <Coffee className="w-3 h-3 text-amber-700" />
              <span>Bjud på lunch</span>
            </button>
          )}

          {/* Direct vCard download icon */}
          <button
            onClick={handleDownloadCard}
            className="p-2 rounded-xl text-gray-600 hover:text-[#800020] hover:bg-gray-100 transition border border-gray-200"
            title="Ladda ner vCard (.vcf) direkt"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* QR & Contact Card button */}
        {onOpenUniversalConnect && (
          <button
            onClick={() => onOpenUniversalConnect(member)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition border border-gray-200 flex items-center gap-1"
            title="Visa digitalt visitkort och QR-kod"
          >
            <QrCode className="w-3 h-3 text-[#800020]" />
            <span>Visitkort</span>
          </button>
        )}
      </div>
    </div>
    </AdminInspect>
  );
};
