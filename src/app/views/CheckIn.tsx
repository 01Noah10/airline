import React, { useState } from 'react';
import { Plane, Search, Download, Info } from 'lucide-react';
import { useBooking } from './Root';
import { toast } from 'sonner';

export function CheckIn() {
  const { state } = useBooking();
  const [bookingRef, setBookingRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingRef && lastName) {
      setShowBoardingPass(true);
    }
  };

  const handleDownload = () => {
    toast.success('Boarding pass downloaded!');
  };

  const bookingData = state.selectedFlight
    ? {
        passenger: lastName || 'JOHN DOE',
        from: state.origin.split(',')[0].substring(0, 3).toUpperCase(),
        to: state.destination.split(',')[0].substring(0, 3).toUpperCase(),
        date: state.date,
        time: state.selectedFlight.departureTime,
        seat: state.addons.seats && state.addons.seats.length > 0 ? state.addons.seats[0] : '12A',
        reference: bookingRef || 'ABC123',
        gate: 'B22',
      }
    : {
        passenger: 'JOHN DOE',
        from: 'SFO',
        to: 'LHR',
        date: '2026-04-15',
        time: '08:00 AM',
        seat: '12A',
        reference: bookingRef || 'ABC123',
        gate: 'B22',
      };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Online Check-In</h1>
        <p className="text-neutral-500">Get your boarding pass instantly</p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 mb-6">
        <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-700">
          <div className="font-bold mb-1">Important Information</div>
          Check-in opens <span className="font-bold">48 hours before departure</span> and closes{' '}
          <span className="font-bold">1 hour before takeoff</span>.
        </div>
      </div>

      {!showBoardingPass ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                Booking Reference
              </label>
              <input
                type="text"
                placeholder="Enter 6-character reference (e.g., ABC123)"
                className="w-full h-14 px-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-neutral-900 font-semibold"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter passenger last name"
                className="w-full h-14 px-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-neutral-900 font-semibold"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 font-bold"
            >
              <Search size={20} />
              Start Check-In
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden">
            {/* Boarding Pass Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Plane size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-90">SwiftAir</div>
                    <div className="text-lg font-bold">Boarding Pass</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-90">Booking Ref</div>
                  <div className="text-lg font-bold">{bookingData.reference}</div>
                </div>
              </div>
            </div>

            {/* Boarding Pass Body */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <div className="text-5xl font-black text-neutral-900">{bookingData.from}</div>
                  <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Departure</div>
                </div>

                <div className="flex-1 px-8 relative flex flex-col items-center">
                  <div className="w-full h-px border-t border-neutral-200 border-dashed relative">
                    <Plane size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <div className="text-5xl font-black text-neutral-900">{bookingData.to}</div>
                  <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Arrival</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Passenger
                  </div>
                  <div className="font-bold text-neutral-900">{bookingData.passenger.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Date
                  </div>
                  <div className="font-bold text-neutral-900">{bookingData.date}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Departure
                  </div>
                  <div className="font-bold text-neutral-900">{bookingData.time}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Seat
                  </div>
                  <div className="font-bold text-blue-600">{bookingData.seat}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Gate
                  </div>
                  <div className="text-3xl font-black text-neutral-900">{bookingData.gate}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                    Boarding Time
                  </div>
                  <div className="text-xl font-bold text-neutral-900">07:30 AM</div>
                </div>
              </div>

              {/* Barcode */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <div className="flex gap-1 items-center justify-center h-24">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-neutral-900"
                      style={{
                        width: '2px',
                        height: `${Math.random() * 60 + 40}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full h-14 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 font-bold"
          >
            <Download size={20} />
            Download Boarding Pass
          </button>
        </div>
      )}
    </div>
  );
}
