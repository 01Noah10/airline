import React, { useState } from 'react';
import { Search, Calendar, Briefcase, User, X, AlertTriangle, Check } from 'lucide-react';
import { useBooking } from './Root';

export function Manage() {
  const { state } = useBooking();
  const [bookingRef, setBookingRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingRef && lastName) {
      setShowResult(true);
    }
  };

  const bookingData = state.selectedFlight
    ? {
        route: `${state.origin} → ${state.destination}`,
        date: state.date,
        passenger: lastName || 'John Doe',
        cabin: 'Economy',
      }
    : {
        route: 'San Francisco, USA → London, UK',
        date: '2026-04-15',
        passenger: 'John Doe',
        cabin: 'Economy',
      };

  const closeOverlay = () => setActiveOverlay(null);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Manage Your Booking</h1>
        <p className="text-neutral-500">View and modify your flight reservations</p>
      </div>

      {!showResult ? (
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
              Find Booking
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Booking Details</h2>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                Confirmed
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Route
                </div>
                <div className="font-bold text-neutral-900">{bookingData.route}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Travel Date
                </div>
                <div className="font-bold text-neutral-900">{bookingData.date}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Passenger
                </div>
                <div className="font-bold text-neutral-900">{bookingData.passenger}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Cabin Class
                </div>
                <div className="font-bold text-neutral-900">{bookingData.cabin}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveOverlay('changeDate')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
            >
              <Calendar size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-wide">Change Date</span>
            </button>

            <button
              onClick={() => setActiveOverlay('addBaggage')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
            >
              <Briefcase size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-wide">Add Baggage</span>
            </button>

            <button
              onClick={() => setActiveOverlay('updateInfo')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
            >
              <User size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-wide">Update Passenger Info</span>
            </button>

            <button
              onClick={() => setActiveOverlay('cancel')}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-red-200 bg-white hover:border-red-500 hover:text-red-600 transition-all gap-3 group shadow-sm"
            >
              <AlertTriangle size={24} className="text-neutral-400 group-hover:text-red-600 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-wide">Cancel Booking</span>
            </button>
          </div>
        </div>
      )}

      {/* Change Date Overlay */}
      {activeOverlay === 'changeDate' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeOverlay} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
              <button onClick={closeOverlay} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X size={20} className="text-neutral-500" />
              </button>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Change Travel Date</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase">New Departure Date</label>
                  <input
                    type="date"
                    className="w-full h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Baggage Overlay */}
      {activeOverlay === 'addBaggage' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeOverlay} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
              <button onClick={closeOverlay} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X size={20} className="text-neutral-500" />
              </button>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Add Extra Baggage</h2>
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-neutral-900">Check-in Luggage</div>
                      <div className="text-xs text-neutral-500">Up to 23kg / 50lbs</div>
                    </div>
                    <div className="font-bold text-neutral-900">$45</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Update Info Overlay */}
      {activeOverlay === 'updateInfo' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeOverlay} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
              <button onClick={closeOverlay} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X size={20} className="text-neutral-500" />
              </button>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Update Passenger Info</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="passenger@email.com"
                    className="w-full h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closeOverlay}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cancel Booking Overlay */}
      {activeOverlay === 'cancel' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeOverlay} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative mx-4">
              <button onClick={closeOverlay} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                <X size={20} className="text-neutral-500" />
              </button>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Cancel Booking</h2>
                <p className="text-sm text-neutral-500">Are you sure you want to cancel this booking?</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Cancellation fees may apply based on fare rules and timing. Please review your booking terms.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeOverlay}
                  className="flex-1 h-12 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-all font-bold"
                >
                  Keep Booking
                </button>
                <button
                  onClick={closeOverlay}
                  className="flex-1 h-12 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
