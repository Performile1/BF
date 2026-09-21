import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, MapPin, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { WidgetComponentProps } from '../../../types/widgets';
import { bookFlexDeskToday } from '../../../lib/widgetServices';
import { AdminInspect } from '../../dev/AdminInspect';

export const FlexBookingWidget: React.FC<WidgetComponentProps> = ({
  currentUser,
  selectedHub,
  onNavigateTab,
  onAwardPoints
}) => {
  const [slot, setSlot] = useState<'FULL_DAY' | 'AM' | 'PM'>('FULL_DAY');
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'LOADING' | 'CONFIRMED'>('IDLE');
  const [availableSpots, setAvailableSpots] = useState<number>(6);

  const hubName = selectedHub?.name || 'Central Hubb Göteborg';

  const handleBookNow = async () => {
    setBookingStatus('LOADING');
    try {
      const res = await bookFlexDeskToday(currentUser.id, selectedHub?.id || 'hub-gbg-1', slot);
      if (res.success) {
        setBookingStatus('CONFIRMED');
        setAvailableSpots(prev => Math.max(0, prev - 1));
        if (onAwardPoints) {
          onAwardPoints(10, 'Incheckning flexplats idag', 'HUB_CHECKIN');
        }
      }
    } catch (err) {
      console.error(err);
      setBookingStatus('IDLE');
    }
  };

  return (
    <AdminInspect
      component="FlexBookingWidget.tsx"
      sourceTable="public.hub_bookings"
      columns={['user_id', 'hub_id', 'booking_date', 'slot_type', 'status']}
      notes="Flexplatsbokning och realtidsincheckning"
      className="h-full"
    >
      <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between h-full hover:border-gray-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 tracking-tight">Flexplats Idag</h3>
              <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#800020]" />
                {hubName}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            {availableSpots} lediga
          </span>
        </div>

        {/* Status card */}
        {bookingStatus === 'CONFIRMED' ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 my-2 text-center animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-black">Bokad & Incheckad!</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              Välkommen till {hubName}. Kaffe finns redo i loungen.
            </p>
          </div>
        ) : (
          <div className="space-y-3 my-2">
            <p className="text-[11px] text-gray-600 leading-snug">
              Boka en flexplats och checka in direkt för spontana möten och coworking.
            </p>

            {/* Tidsslot */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
              {[
                { id: 'FULL_DAY', label: 'Heldag' },
                { id: 'AM', label: 'Fm (08-12)' },
                { id: 'PM', label: 'Em (12-17)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSlot(item.id as any)}
                  className={`py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                    slot === item.id
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between gap-2">
        {bookingStatus === 'CONFIRMED' ? (
          <button
            onClick={() => onNavigateTab && onNavigateTab('coworking')}
            className="w-full py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer text-center"
          >
            Se Hubbkarta & Bordsöversikt →
          </button>
        ) : (
          <>
            <button
              onClick={() => onNavigateTab && onNavigateTab('coworking')}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition"
            >
              Bordskarta
            </button>
            <button
              onClick={handleBookNow}
              disabled={bookingStatus === 'LOADING' || availableSpots === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#800020] hover:bg-[#6b001b] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {bookingStatus === 'LOADING' ? 'Bokar...' : 'Boka & Checka in'}
            </button>
          </>
        )}
      </div>
    </div>
    </AdminInspect>
  );
};
