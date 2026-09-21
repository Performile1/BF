import React, { useState } from 'react';
import { Coffee, Utensils, Zap, X, Check, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Member, MasterCalendarEvent, LunchInvitation } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface LunchInvitationModalProps {
  attendee: any;
  event?: MasterCalendarEvent;
  currentUser: Member;
  onClose: () => void;
  onSendInvitation: (invitation: Partial<LunchInvitation>) => void;
}

export const LunchInvitationModal: React.FC<LunchInvitationModalProps> = ({
  attendee,
  event,
  currentUser,
  onClose,
  onSendInvitation
}) => {
  const [proposedDate, setProposedDate] = useState('2026-09-17');
  const [proposedTime, setProposedTime] = useState('12:00');
  const [proposedLocation, setProposedLocation] = useState(
    event ? `${event.hub_name || 'Hubb Stockholm'} Lounge / Restaurang i närheten` : 'Central restaurang'
  );
  const [hostPays, setHostPays] = useState(true);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invitation: Partial<LunchInvitation> = {
      id: `lunch_${Date.now()}`,
      sender_member_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_company: currentUser.company_name,
      sender_avatar: currentUser.avatar,
      receiver_member_id: attendee.id,
      receiver_name: attendee.full_name,
      receiver_avatar: attendee.avatar,
      proposed_date: proposedDate,
      location_name: proposedLocation,
      invitation_type: 'LUNCH',
      host_pays: hostPays,
      notes: note,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    onSendInvitation(invitation);
    onClose();
  };

  return (
    <AdminInspect
      component="LunchInvitationModal.tsx"
      sourceTable="public.lunch_invitations"
      columns={['id', 'sender_member_id', 'receiver_member_id', 'proposed_date', 'location_name', 'host_pays', 'status']}
      notes="Skicka lunchinbjudan och schemalägg 1-till-1 möten med medlemmar"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Coffee className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-1">
                <span>Nätverkslunch / Kaffe</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 font-display">
                Bjud {attendee.full_name} på lunch
              </h3>
              <p className="text-xs text-gray-500">
                {attendee.role_title} • {attendee.company_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generosity Callout: +30 BP */}
        {hostPays ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-emerald-600 fill-current shrink-0" />
              <div>
                <span className="font-black text-emerald-900 block">Generöst Värdskap: +30 Booster Points!</span>
                <span className="text-[11px] text-emerald-800 leading-tight">
                  Att bjuda kollegan på lunchen belönas med extra poäng och höjer din Give & Take Ratio.
                </span>
              </div>
            </div>
            <span className="font-black text-xs text-emerald-800 bg-white px-2.5 py-1 rounded-lg shadow-2xs border border-emerald-200">
              +30 BP
            </span>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span>Standard lunch / kaffemöte (var och en betalar för sig)</span>
            <span className="font-bold text-gray-700">+20 BP</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Host pays checkbox */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <label className="text-xs font-bold text-amber-950 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hostPays}
                onChange={(e) => setHostPays(e.target.checked)}
                className="w-4 h-4 rounded text-[#800020] accent-[#800020]"
              />
              <span>Jag bjuder på lunchen! (Visas i inbjudan till kollegan)</span>
            </label>
            <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              HÖG STATUS
            </span>
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Föreslaget datum:</label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Föreslagen tidpunkt:</label>
              <input
                type="time"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                required
              />
            </div>
          </div>

          {/* Proposed location */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Förslag på restaurang / hubblounge:</label>
            <input
              type="text"
              value={proposedLocation}
              onChange={(e) => setProposedLocation(e.target.value)}
              placeholder="T.ex: Convendum Bistro Stureplan eller Taverna Brillo"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Personligt meddelande:</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Hej ${attendee.full_name}! Kul att ses på nätverksträffen. Skulle vara väldigt givande att ta en lunch och sparra vidare kring era planer.`}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs"
            >
              <Utensils className="w-4 h-4 text-amber-300" />
              <span>Skicka Lunchinbjudan ({hostPays ? '+30 BP' : '+20 BP'})</span>
            </button>
          </div>
        </form>

      </div>
    </div>
    </AdminInspect>
  );
};
