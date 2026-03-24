import React, { useState } from 'react';
import { useBooking } from './Root';
import { useNavigate } from 'react-router';
import { Briefcase, Utensils, Armchair, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export function Addons() {
  const { state, updateState } = useBooking();
  const navigate = useNavigate();

  const handleSeatSelect = (seat: string) => {
    const currentSeats = state.addons.seats || [];
    if (currentSeats.includes(seat)) {
      updateState({ addons: { ...state.addons, seats: currentSeats.filter(s => s !== seat) } });
    } else {
      if (currentSeats.length < state.passengers) {
        updateState({ addons: { ...state.addons, seats: [...currentSeats, seat] } });
      } else {
        // If they try to select more than allowed, replace the oldest selection
        updateState({ addons: { ...state.addons, seats: [...currentSeats.slice(1), seat] } });
      }
    }
  };

  const handleBaggageChange = (count: number) => {
    updateState({ addons: { ...state.addons, baggage: Math.max(0, count) } });
  };

  const toggleMeal = () => {
    updateState({ addons: { ...state.addons, meal: !state.addons.meal } });
  };

  const seats = Array.from({ length: 6 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-10 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Personalize Your Journey</h2>
          <p className="text-neutral-500">Add options that fit your needs. All prices are updated in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seat Selection */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Armchair size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Seat Selection</h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Premium $25 per seat</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-bold text-neutral-700">
                {state.addons.seats.length} of {state.passengers} Seats Selected
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            {/* Seat Map Visualization */}
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {['A', 'B', 'C'].map(col => (
                <div key={col} className="text-center text-[10px] font-bold text-neutral-400 pb-2">{col}</div>
              ))}
            </div>
            <div className="col-span-1" />
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {['D', 'E', 'F'].map(col => (
                <div key={col} className="text-center text-[10px] font-bold text-neutral-400 pb-2">{col}</div>
              ))}
            </div>

            {rows.slice(0, 5).map(row => (
              <React.Fragment key={row}>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {['A', 'B', 'C'].map(col => {
                    const seatId = `${row}${col}`;
                    const isSelected = state.addons.seats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatSelect(seatId)}
                        className={clsx(
                          "aspect-square rounded-md border-2 transition-all flex items-center justify-center text-[10px] font-bold",
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" 
                            : "bg-white border-neutral-200 text-neutral-500 hover:border-blue-400 hover:text-blue-500"
                        )}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
                <div className="col-span-1 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                  {row}
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {['D', 'E', 'F'].map(col => {
                    const seatId = `${row}${col}`;
                    const isSelected = state.addons.seats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatSelect(seatId)}
                        className={clsx(
                          "aspect-square rounded-md border-2 transition-all flex items-center justify-center text-[10px] font-bold",
                          isSelected 
                            ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" 
                            : "bg-white border-neutral-200 text-neutral-500 hover:border-blue-400 hover:text-blue-500"
                        )}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-neutral-400 italic">
            Select up to {state.passengers} seat(s) for your party.
          </p>
        </div>

        <div className="space-y-6">
          {/* Baggage */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Extra Baggage</h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">$45 per bag</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="flex flex-col">
                <span className="font-bold text-neutral-900">Check-in Luggage</span>
                <span className="text-xs text-neutral-500 uppercase font-bold">Up to 23kg / 50lbs</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleBaggageChange(state.addons.baggage - 1)}
                  className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center font-bold text-neutral-500 hover:border-purple-400 hover:text-purple-600 transition-all"
                >
                  -
                </button>
                <span className="text-xl font-bold w-4 text-center">{state.addons.baggage}</span>
                <button 
                  onClick={() => handleBaggageChange(state.addons.baggage + 1)}
                  className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center font-bold text-neutral-500 hover:border-purple-400 hover:text-purple-600 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Utensils size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Meal Service</h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">$15 per person</p>
              </div>
            </div>
            
            <button
              onClick={toggleMeal}
              className={clsx(
                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                state.addons.meal 
                  ? "bg-orange-50 border-orange-200" 
                  : "bg-white border-neutral-100 hover:border-orange-100"
              )}
            >
              <div className="flex flex-col text-left">
                <span className="font-bold text-neutral-900">Hot Meal & Beverages</span>
                <span className="text-xs text-neutral-500 uppercase font-bold">Premium in-flight catering</span>
              </div>
              <div className={clsx(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                state.addons.meal ? "bg-orange-500 border-orange-500 text-white" : "border-neutral-200 bg-white"
              )}>
                {state.addons.meal && <CheckCircle2 size={16} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button
          onClick={() => navigate('/payment')}
          className="group px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-3"
        >
          Proceed to Payment
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
