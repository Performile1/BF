import React, { useState } from 'react';
import { Plus, X, Calendar, MapPin, Clock, Users, Crown, Sparkles, Check, DollarSign } from 'lucide-react';
import { MasterCalendarEvent, Member, CalendarEventCategory } from '../../types';
import { AdminInspect } from '../dev/AdminInspect';

interface CreateMemberEventModalProps {
  currentUser: Member;
  onClose: () => void;
  onCreateEvent: (eventData: Partial<MasterCalendarEvent>) => void;
}

export const CreateMemberEventModal: React.FC<CreateMemberEventModalProps> = ({
  currentUser,
  onClose,
  onCreateEvent
}) => {
  const isGold = currentUser.membership_level === 'GOLD';
  const isSilver = currentUser.membership_level === 'SILVER' || isGold;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('2026-09-24');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:30');
  const [location, setLocation] = useState(currentUser.hub_name || 'Convendum Stockholm City');
  const [category, setCategory] = useState<CalendarEventCategory>('HUB_MEETING');
  const [isDigital, setIsDigital] = useState(false);
  const [spotsMax, setSpotsMax] = useState(20);
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [priceSek, setPriceSek] = useState(490);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Vänligen fyll i titel och beskrivning.');
      return;
    }

    const newEvent: Partial<MasterCalendarEvent> = {
      id: `evt_member_${Date.now()}`,
      title,
      description,
      date_str: dateStr,
      display_date: new Date(dateStr).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' }),
      start_time: startTime,
      end_time: endTime,
      location: isDigital ? 'Digital Livestream' : location,
      hub_id: currentUser.hub_id,
      hub_name: currentUser.hub_name,
      is_digital: isDigital,
      category,
      required_level: 'BRONZE',
      spots_max: spotsMax,
      attendees_count: 1,
      is_booked: true,
      speaker_or_host: `${currentUser.full_name} (${currentUser.company_name})`,
      price_sek: isGold && isPaidEvent ? priceSek : 0,
      attendees: [
        {
          id: currentUser.id,
          full_name: currentUser.full_name,
          role_title: currentUser.role_title,
          company_name: currentUser.company_name,
          avatar: currentUser.avatar,
          booster_score: currentUser.booster_score,
          membership_level: currentUser.membership_level,
          industry: currentUser.industry,
          competence_tag: 'Eventvärd / Skapare'
        }
      ]
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <AdminInspect
      component="CreateMemberEventModal.tsx"
      sourceTable="public.calendar_events"
      columns={['id', 'title', 'description', 'date_str', 'start_time', 'end_time', 'location', 'category', 'price_sek', 'speaker_or_host']}
      notes="Skapa eget medlemsevent eller nätverksträff i kalendern"
    >
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-[#800020]" />
              <span>Medlemsinitierat Event</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 font-display">
              Skapa eget Nätverksevent
            </h3>
            <p className="text-xs text-gray-500">
              Bjud in nätverket till frukost, padel, lunch eller en branschworkshop
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier permission note */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800">Dina arrangörsrättigheter:</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              isGold ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-800'
            }`}>
              {currentUser.membership_level} Medlem
            </span>
          </div>
          <p className="text-[11px] text-gray-600">
            {isGold 
              ? 'Som Guldmedlem kan du anordna både kostnadsfria träffar och betalda masterclasses med biljettförsäljning (5% plattformsavgift).' 
              : 'Som Silvermedlem kan du arrangera kostnadsfria nätverksträffar, AW, luncher och hubbmöten.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Eventtitel:</label>
            <input
              type="text"
              placeholder="T.ex: Tech-lunch om AI-automatisering & B2B tillväxt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Beskrivning & Upplägg:</label>
            <textarea
              rows={3}
              placeholder="Beskriv syftet med träffen, vem som bör komma och vad deltagarna kommer få ut av mötet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Datum:</label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Starttid:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Sluttid:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
                required
              />
            </div>
          </div>

          {/* Category & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarEventCategory)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#800020]"
              >
                <option value="HUB_MEETING">Hubbträff & Mingel</option>
                <option value="SPEED_DATING">B2B Speed Dating</option>
                <option value="COWORKING_THEME">Coworking & Temadag</option>
                <option value="WEBINAR">Digitalt Live Webinar</option>
                <option value="ACADEMY_WORKSHOP">Akademi Workshop</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Max antal deltagare:</label>
              <input
                type="number"
                min={2}
                max={100}
                value={spotsMax}
                onChange={(e) => setSpotsMax(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              />
            </div>
          </div>

          {/* Location or Digital */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">Plats / Lokal:</label>
              <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDigital}
                  onChange={(e) => setIsDigital(e.target.checked)}
                  className="rounded text-[#800020]"
                />
                <span>Digital träff via videolänk</span>
              </label>
            </div>
            {!isDigital && (
              <input
                type="text"
                placeholder="T.ex: Convendum Lounge, Stureplan 4 eller Padelsport Stockholm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#800020]"
              />
            )}
          </div>

          {/* Gold: Ticket price options */}
          {isGold && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Guldmedlemsfunktion: Biljettpris</span>
                </span>
                <label className="text-xs text-amber-900 font-bold flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaidEvent}
                    onChange={(e) => setIsPaidEvent(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Ta betalt för biljetter</span>
                </label>
              </div>

              {isPaidEvent && (
                <div className="pt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Biljettpris per deltagare (SEK):
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={priceSek}
                      onChange={(e) => setPriceSek(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold"
                    />
                  </div>
                  <div className="text-right text-[11px] text-amber-800 shrink-0">
                    <span className="block font-bold">5% plattformsavgift</span>
                    <span>Du erhåller {Math.round(priceSek * 0.95)} kr/biljett</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
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
              <Plus className="w-4 h-4" />
              <span>Publicera Evenemang i Kalendern</span>
            </button>
          </div>
        </form>

      </div>
    </div>
    </AdminInspect>
  );
};
