import React, { useState } from 'react';
import { 
  Bell, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Award, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Layers,
  MessageSquare,
  ArrowRight,
  Clock,
  Trophy,
  Building2,
  Calendar,
  X,
  QrCode,
  Camera,
  CreditCard,
  LogIn,
  LogOut,
  UserPlus,
  Shield
} from 'lucide-react';
import { Member, Hub, ChatChannel } from '../types';
import { AdminInspect } from './dev/AdminInspect';

interface HeaderProps {
  currentUser: Member;
  allMembers: Member[];
  onSelectUser: (user: Member) => void;
  selectedHub: Hub;
  allHubs: Hub[];
  onSelectHub: (hub: Hub) => void;
  deviceMode?: 'desktop' | 'ios' | 'android';
  setDeviceMode?: (mode: 'desktop' | 'ios' | 'android') => void;
  unreadNotificationsCount: number;
  onOpenNotifications?: () => void;
  onOpenCheckInModal: () => void;
  onOpenQrModal?: () => void;
  onOpenArchitectureSpec: () => void;
  onOpenMembership?: () => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
  channels?: ChatChannel[];
  onSelectChannel?: (channelId: string) => void;
  onOpenFullChat?: () => void;
  isGuest?: boolean;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allMembers,
  onSelectUser,
  selectedHub,
  allHubs,
  onSelectHub,
  deviceMode,
  setDeviceMode,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenCheckInModal,
  onOpenQrModal,
  onOpenArchitectureSpec,
  onOpenMembership,
  onOpenAdmin,
  isAdmin = false,
  channels = [],
  onSelectChannel,
  onOpenFullChat,
  isGuest = false,
  onOpenAuthModal,
  onSignOut
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHubMenu, setShowHubMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'dms' | 'alerts'>('dms');

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'GOLD':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'SILVER':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-orange-100 text-orange-900 border-orange-200';
    }
  };

  const sampleAlerts = [
    {
      id: 'al_1',
      type: 'SCORE',
      icon: Trophy,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      title: '+30 BP erhållet',
      desc: 'Hubb-incheckning på ' + selectedHub.name,
      time: '12 min sedan',
      unread: true
    },
    {
      id: 'al_2',
      type: 'COWORKING',
      icon: Building2,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      title: 'Flexplats bekräftad',
      desc: 'Convendum Stockholm City, skrivbord #14 är reserverat',
      time: '1 tim sedan',
      unread: true
    },
    {
      id: 'al_3',
      type: 'WEBINAR',
      icon: Calendar,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
      title: 'Live Webinar om 15 min',
      desc: "'Scaling Digital Assets with AI' startar alldeles strax",
      time: '2 tim sedan',
      unread: false
    }
  ];

  return (
    <AdminInspect
      component="Header.tsx"
      sourceTable="public.profiles"
      columns={['full_name', 'avatar_url', 'role', 'is_admin']}
      notes="Hämtar aktiv inloggad användare och aviseringsräknare"
      className="w-full sticky top-0 z-40"
    >
      <header className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="bg-[#800020] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#800020] uppercase font-display">
                  Booster  <span className="text-gray-400 font-light ml-1">Friends</span>
                </h1>
                <span className="hidden xl:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                  Bento Edition
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
              
              </p>
            </div>
          </div>

          {/* Quick Hub Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowHubMenu(!showHubMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-[#F4F5F7] hover:bg-gray-100 text-xs font-medium text-gray-700 transition"
              id="hub-selector-button"
            >
              <MapPin className="w-3.5 h-3.5 text-[#800020]" />
              <span className="font-semibold text-gray-900">{selectedHub.name}</span>
              <span className="text-gray-400">({selectedHub.member_count} medlemmar)</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showHubMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Välj Hubb-nätverk
                </div>
                {allHubs.map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      onSelectHub(hub);
                      setShowHubMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F4F5F7] transition ${
                      hub.id === selectedHub.id ? 'bg-[#800020]/5 font-bold text-[#800020]' : 'text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{hub.name}</div>
                      <div className="text-[11px] text-gray-500">{hub.address}</div>
                    </div>
                    {hub.id === selectedHub.id && <Check className="w-4 h-4 text-[#800020]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions: Device Preview Switcher & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Device Mode Switcher (Desktop / iOS / Android) */}
            {setDeviceMode && (
              <div className="hidden md:flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    deviceMode === 'desktop'
                      ? 'bg-white text-[#800020] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Desktop Portal"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('ios')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    deviceMode === 'ios'
                      ? 'bg-white text-[#800020] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Apple iOS Simulator"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iOS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('android')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    deviceMode === 'android'
                      ? 'bg-white text-[#800020] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Google Android Simulator"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android</span>
                </button>
              </div>
            )}

            {/* Booster Score Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser.booster_score}</span>
              <span className="text-[10px] text-amber-700 font-normal">Score</span>
            </div>

            {/* Notification & Direct Messaging Bell Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(prev => !prev)}
                className="relative p-2 rounded-xl text-gray-600 hover:bg-[#F4F5F7] hover:text-gray-900 transition"
                title="Notiser & Direktmeddelanden"
                id="btn-notifications"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-0.5 bg-[#800020] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification & Direct Messaging Flyout */}
              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 animate-in fade-in">
                  {/* Top Bar */}
                  <div className="px-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Notiser & Meddelanden</h3>
                      <p className="text-[11px] text-gray-500">
                        {unreadNotificationsCount > 0 
                          ? `${unreadNotificationsCount} olästa händelser` 
                          : 'Inga olästa aviseringar'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNotificationMenu(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                      title="Stäng"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabs Switcher: Direktmeddelanden vs Aviseringar */}
                  <div className="px-3 pt-2 pb-1 flex gap-1">
                    <button
                      onClick={() => setActiveNotifTab('dms')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        activeNotifTab === 'dms'
                          ? 'bg-[#800020] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Direktmeddelanden</span>
                      {channels.some(c => (c.unread_count || 0) > 0) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveNotifTab('alerts')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        activeNotifTab === 'alerts'
                          ? 'bg-[#800020] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Aviseringar</span>
                    </button>
                  </div>

                  {/* Tab Content: Direktmeddelanden */}
                  {activeNotifTab === 'dms' && (
                    <div className="p-2 max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {channels.length > 0 ? (
                        channels.map(channel => {
                          const hasUnread = (channel.unread_count || 0) > 0;
                          return (
                            <div
                              key={channel.id}
                              onClick={() => {
                                onSelectChannel?.(channel.id);
                                onOpenFullChat?.();
                                setShowNotificationMenu(false);
                              }}
                              className={`p-2.5 rounded-xl flex items-start gap-3 cursor-pointer transition ${
                                hasUnread ? 'bg-[#800020]/5 hover:bg-[#800020]/10' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="relative flex-shrink-0">
                                {channel.avatar_url ? (
                                  <img 
                                    src={channel.avatar_url} 
                                    alt={channel.title} 
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-bold text-xs">
                                    {channel.channel_type === 'HUB' ? 'HUB' : '3P'}
                                  </div>
                                )}
                                {hasUnread && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#800020] ring-2 ring-white absolute top-0 right-0"></span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-gray-900 truncate">
                                    {channel.title}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                                    {channel.last_message_time || 'Idag'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                                  {channel.last_message || 'Inga meddelanden än'}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-xs text-gray-500">
                          Inga aktiva direktmeddelanden
                        </div>
                      )}

                      {/* Footer Link to full chat */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onOpenFullChat?.();
                            setShowNotificationMenu(false);
                          }}
                          className="w-full py-2 px-3 bg-gray-50 hover:bg-[#800020]/5 text-[#800020] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition border border-gray-100"
                        >
                          <span>Öppna hela meddelandecentret</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: Aviseringar */}
                  {activeNotifTab === 'alerts' && (
                    <div className="p-2 max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {sampleAlerts.map(alert => {
                        const Icon = alert.icon;
                        return (
                          <div
                            key={alert.id}
                            className={`p-2.5 rounded-xl flex items-start gap-3 transition ${
                              alert.unread ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${alert.iconColor}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-900">
                                  {alert.title}
                                </h4>
                                <span className="text-[10px] text-gray-400">
                                  {alert.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 mt-0.5">
                                {alert.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-2 text-center">
                        <button
                          onClick={() => setShowNotificationMenu(false)}
                          className="text-[11px] font-semibold text-gray-500 hover:text-gray-800"
                        >
                          Markera alla aviseringar som lästa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Admin Portal Button (Desktop) */}
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hidden md:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-2xs cursor-pointer"
                title="Öppna Adminpanelen, Dev HUD och schema-inspektorn"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin & Dev</span>
              </button>
            )}

            {/* User Profile & Persona Switcher */}
            <div className="relative">
              {isGuest ? (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl bg-[#800020] text-white text-xs font-bold shadow-xs hover:bg-[#68001a] transition"
                  id="btn-guest-login"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Logga in / Skapa konto</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 border-l pl-3 sm:pl-4 border-gray-200 hover:opacity-95 transition"
                  id="btn-user-profile-menu"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{currentUser.full_name}</p>
                    <p className="text-[10px] text-[#800020] font-bold uppercase tracking-wider">{currentUser.membership_level} Member</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 border-2 border-[#800020] overflow-hidden flex-shrink-0 shadow-2xs">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}

              {/* Persona switcher dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 animate-in fade-in">
                  <div className="px-4 pb-2 border-b border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inloggad profil</p>
                    <p className="text-sm font-bold text-gray-900">{currentUser.full_name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role_title} • {currentUser.company_name}</p>
                    <div className="mt-2 flex items-center justify-between text-xs bg-[#F4F5F7] p-2 rounded-lg">
                      <span className="text-gray-600">Booster Score:</span>
                      <span className="font-bold text-[#800020]">{currentUser.booster_score} poäng (Topp 5%)</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenMembership) onOpenMembership();
                        setShowUserMenu(false);
                      }}
                      className="w-full mt-2.5 py-2 px-3 rounded-xl bg-rose-50/70 hover:bg-[#800020] border border-[#800020]/20 text-xs font-bold text-[#800020] hover:text-white transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-[#800020] group-hover:text-white transition" />
                        <span>Medlemskap & Fakturor</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#800020]/70 group-hover:text-white/90">/profile/membership</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (onOpenAdmin) onOpenAdmin();
                          setShowUserMenu(false);
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-950 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-amber-700" />
                          <span>Adminpanel & Dev HUD</span>
                        </div>
                        <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                          DEV
                        </span>
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      <button
                        onClick={() => {
                          if (onOpenAuthModal) onOpenAuthModal();
                          setShowUserMenu(false);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-gray-600" />
                        <span>Byt konto</span>
                      </button>
                      <button
                        onClick={() => {
                          if (onSignOut) onSignOut();
                          setShowUserMenu(false);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-700" />
                        <span>Logga ut</span>
                      </button>
                    </div>

                    {/* Enhetsvy Switcher: Desktop / iOS / Android i Inloggad Profil */}
                    {setDeviceMode && (
                      <div className="mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5 text-[#800020]" />
                            Enhetsvy / Simulator
                          </span>
                          <span className="text-[9px] font-bold text-[#800020] uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Aktiv: {deviceMode || 'desktop'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setDeviceMode('desktop');
                              setShowUserMenu(false);
                            }}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[11px] font-bold transition ${
                              deviceMode === 'desktop'
                                ? 'bg-[#800020] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Monitor className="w-4 h-4 mb-0.5" />
                            <span>Desktop</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeviceMode('ios');
                              setShowUserMenu(false);
                            }}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[11px] font-bold transition ${
                              deviceMode === 'ios'
                                ? 'bg-[#800020] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Smartphone className="w-4 h-4 mb-0.5" />
                            <span>iOS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeviceMode('android');
                              setShowUserMenu(false);
                            }}
                            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-md text-[11px] font-bold transition ${
                              deviceMode === 'android'
                                ? 'bg-[#800020] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Smartphone className="w-4 h-4 mb-0.5" />
                            <span>Android</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pt-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Byt test-persona (Rättigheter & Nivå)
                    </p>
                    <div className="space-y-1">
                      {allMembers.map(member => (
                        <button
                          key={member.id}
                          onClick={() => {
                            onSelectUser(member);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                            member.id === currentUser.id
                              ? 'bg-[#800020]/10 text-[#800020] font-bold'
                              : 'hover:bg-[#F4F5F7] text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={member.avatar} alt={member.full_name} className="w-7 h-7 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-gray-900">{member.full_name}</div>
                              <div className="text-[10px] text-gray-500">{member.company_name}</div>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStyle(member.membership_level)}`}>
                            {member.membership_level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
    </AdminInspect>
  );
};
