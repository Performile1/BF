import React from 'react';
import { Award, Coffee, QrCode, Users, LucideIcon, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Member, MemberActiveLocation } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface MiniWidgetContainerProps {
  isEditMode?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const MiniWidgetContainer: React.FC<MiniWidgetContainerProps> = ({
  isEditMode,
  children,
  className = ''
}) => {
  return (
    <AdminInspect
      component="MiniWidgets.tsx"
      sourceTable="public.profiles / active_locations"
      columns={['booster_score', 'is_available_for_coffee', 'current_city']}
      notes="Dashboard snabb-indikatorer och miniwidgets"
      className={className}
    >
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 w-full ${className}`}>
        {children}
      </div>
    </AdminInspect>
  );
};

interface MiniStatWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  isEditMode?: boolean;
}

export const MiniStatWidget: React.FC<MiniStatWidgetProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-[#800020]/10',
  iconColor = 'text-[#800020]',
  onClick,
  isEditMode
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer ${
        onClick ? 'active:scale-98' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`p-2 ${iconBgColor} ${iconColor} rounded-xl shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
            {title}
          </p>
          <p className="text-sm font-black text-slate-900 truncate">{value}</p>
          {subtitle && (
            <p className="text-[9px] text-slate-500 font-medium truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {onClick && (
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
      )}

      {isEditMode && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 bg-amber-500 rounded-full animate-ping" />
      )}
    </div>
  );
};

// Mini Widget 1: BP-Saldo (1x1)
export const MiniBpCounterWidget: React.FC<{
  currentUser: Member;
  onClick?: () => void;
  isEditMode?: boolean;
}> = ({ currentUser, onClick, isEditMode }) => {
  return (
    <MiniStatWidget
      title="BP Saldo"
      value={`${currentUser.booster_score?.toLocaleString('sv-SE') || 0} p`}
      subtitle={`Multiplikator: ${currentUser.membership_level === 'GOLD' ? '2.0x' : currentUser.membership_level === 'SILVER' ? '1.5x' : '1.0x'}`}
      icon={Award}
      iconBgColor="bg-amber-100"
      iconColor="text-amber-700"
      onClick={onClick}
      isEditMode={isEditMode}
    />
  );
};

// Mini Widget 2: Kaffe-Toggle (1x1)
export const MiniCoffeeToggleWidget: React.FC<{
  currentUser: Member;
  myLocation?: MemberActiveLocation;
  onToggleStatus: () => void;
  onOpenPingModal?: () => void;
  isEditMode?: boolean;
}> = ({ currentUser, myLocation, onToggleStatus, onOpenPingModal, isEditMode }) => {
  const isAvailable = myLocation ? (myLocation.is_available_for_coffee || myLocation.is_available_for_lunch) : false;
  const city = myLocation?.current_city || currentUser.city || 'Mölnlycke';

  return (
    <div
      onClick={onToggleStatus}
      className={`relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
        isAvailable
          ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/40 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isAvailable ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Coffee className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
            Kaffe/Lunch
          </p>
          <p className="text-xs font-black truncate text-slate-900">
            {isAvailable ? 'Aktiv idag' : 'Osynlig'}
          </p>
          <p className="text-[9px] text-slate-500 font-medium truncate">
            {city}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center">
        <span
          className={`w-3 h-3 rounded-full border-2 border-white shadow-xs ${
            isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
          }`}
        />
      </div>

      {isEditMode && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 bg-amber-500 rounded-full animate-ping" />
      )}
    </div>
  );
};

// Mini Widget 3: Snabb-QR (1x1)
export const MiniQuickQrWidget: React.FC<{
  currentUser: Member;
  onClick: () => void;
  isEditMode?: boolean;
}> = ({ currentUser, onClick, isEditMode }) => {
  return (
    <MiniStatWidget
      title="Medlemskort"
      value="Mitt vCard & QR"
      subtitle={`${currentUser.membership_level}-status`}
      icon={QrCode}
      iconBgColor="bg-slate-100"
      iconColor="text-slate-800"
      onClick={onClick}
      isEditMode={isEditMode}
    />
  );
};

// Mini Widget 4: Hubb-Närvaro (1x1 eller 2x1)
export const MiniHubAttendanceWidget: React.FC<{
  members: Member[];
  currentUser: Member;
  onClick?: () => void;
  isEditMode?: boolean;
}> = ({ members, currentUser, onClick, isEditMode }) => {
  const otherMembers = members.filter(m => m.id !== currentUser.id).slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-between p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 bg-blue-50 text-blue-700 rounded-xl shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
            På Hubben Idag
          </p>
          <div className="flex items-center -space-x-1.5 mt-0.5">
            {otherMembers.map((m) => (
              <img
                key={m.id}
                src={m.profile_picture_url || m.avatar}
                alt={m.first_name || m.full_name}
                className="w-5 h-5 rounded-full object-cover border-2 border-white shadow-xs"
              />
            ))}
            <span className="text-[10px] font-bold text-slate-600 pl-1.5">+4 till</span>
          </div>
        </div>
      </div>

      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

      {isEditMode && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 bg-amber-500 rounded-full animate-ping" />
      )}
    </div>
  );
};
