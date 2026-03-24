import React, { useState, useMemo } from 'react';
import { useBooking, Flight } from './Root';
import { useNavigate } from 'react-router';
import { Plane, Clock, ShieldCheck, ChevronRight, TrendingDown, Info } from 'lucide-react';
import { clsx } from 'clsx';

const mockFlights: Flight[] = [
  { id: '1', airline: 'SwiftAir Global', number: 'SA101', departureTime: '08:00 AM', arrivalTime: '02:30 PM', duration: '6h 30m', price: 420, stops: 0 },
  { id: '2', airline: 'JetConnect', number: 'JC55', departureTime: '10:15 AM', arrivalTime: '05:00 PM', duration: '6h 45m', price: 385, stops: 1 },
  { id: '3', airline: 'Pacific Blue', number: 'PB882', departureTime: '01:45 PM', arrivalTime: '08:15 PM', duration: '6h 30m', price: 510, stops: 0 },
  { id: '4', airline: 'SwiftAir Global', number: 'SA205', departureTime: '06:30 PM', arrivalTime: '01:00 AM', duration: '6h 30m', price: 395, stops: 0 },
];

export function FlightSelection() {
  const { state, updateState } = useBooking();
  const navigate = useNavigate();
  const [hoveredFlight, setHoveredFlight] = useState<string | null>(null);

  const sortedFlights = useMemo(() => {
    return [...mockFlights].sort((a, b) => a.price - b.price);
  }, []);

  const handleSelectFlight = (flight: Flight) => {
    updateState({ selectedFlight: flight });
    navigate('/addons');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Select Outbound Flight</h2>
          <p className="text-neutral-500">
            {state.origin} to {state.destination} • {state.date} {state.tripType === 'round' ? `- ${state.returnDate}` : ''} • {state.passengers} {state.passengers > 1 ? 'Passengers' : 'Passenger'}
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
          <TrendingDown className="text-green-600" size={20} />
          <div className="text-sm">
            <span className="font-bold text-green-700">Great Price!</span>
            <div className="text-green-600/80 text-[10px] uppercase font-bold tracking-wider">Prices are lower than average</div>
          </div>
        </div>
      </div>

      {/* Pricing Transparency Info */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 mb-6">
        <div className="p-2 bg-blue-600 text-white rounded-full">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-blue-900 font-bold mb-1 leading-tight">Price Protection Guaranteed</h4>
          <p className="text-blue-700/80 text-sm">
            The prices shown include all mandatory taxes and fees. No hidden surcharges will be added at checkout. 
            We value your budget transparency.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <div
            key={flight.id}
            className={clsx(
              "group relative bg-white border rounded-2xl transition-all duration-300 overflow-hidden",
              state.selectedFlight?.id === flight.id 
                ? "border-blue-500 ring-2 ring-blue-500/20" 
                : "border-neutral-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 shadow-sm"
            )}
            onMouseEnter={() => setHoveredFlight(flight.id)}
            onMouseLeave={() => setHoveredFlight(null)}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-100">
                  <Plane size={32} className="text-blue-600 -rotate-45" />
                </div>
                
                <div className="flex-1 grid grid-cols-3 gap-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-neutral-900">{flight.departureTime}</span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{state.origin.split(',')[0]}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xs text-neutral-400 font-medium mb-1 uppercase tracking-tighter">{flight.duration}</div>
                    <div className="relative w-full flex items-center justify-center">
                      <div className="absolute w-full h-px bg-neutral-200 border-dashed border-t" />
                      <div className="relative bg-white px-2">
                        <Plane size={14} className="text-neutral-300" />
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-neutral-500 mt-1 uppercase">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                    </div>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-2xl font-bold text-neutral-900">{flight.arrivalTime}</span>
                    <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{state.destination.split(',')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="w-px h-16 bg-neutral-100 mx-8" />

              <div className="flex flex-col items-end min-w-[120px]">
                <div className="text-3xl font-bold text-neutral-900">${flight.price}</div>
                <div className="text-xs text-neutral-500 mb-4 font-medium uppercase">Per person</div>
                <button
                  onClick={() => handleSelectFlight(flight)}
                  className={clsx(
                    "w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    state.selectedFlight?.id === flight.id
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {state.selectedFlight?.id === flight.id ? 'Selected' : 'Select Flight'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Price Detail Bar */}
            <div className="bg-neutral-50/50 px-6 py-2.5 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Clock size={12} />
                  <span>On-time: 98%</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Info size={12} />
                  <span>Boeing 787 Dreamliner</span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} />
                SwiftAir Verified Flight
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
