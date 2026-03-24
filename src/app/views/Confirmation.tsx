import React, { useEffect } from 'react';
import { useBooking } from './Root';
import { useNavigate } from 'react-router';
import { CheckCircle2, Ticket, Printer, Share2, ArrowRight, Download, Home, Plane } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function Confirmation() {
  const { state, resetBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start them a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleGoHome = () => {
    resetBooking();
    navigate('/');
  };

  const handleDownloadTicket = () => {
    toast.success('Ticket downloaded!');
  };

  const handlePrintPass = () => {
    toast.success('Sending to printer...');
  };

  const handleShareDetails = () => {
    toast.success('Link copied to clipboard!');
  };

  const handleAddToWallet = () => {
    toast.success('Added to wallet!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 border-4 border-white"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight">Booking Confirmed!</h1>
        <p className="text-xl text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Your journey to {state.destination} is set. A confirmation email has been sent to your inbox.
        </p>
      </div>

      {/* Ticket Details */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-neutral-100 divide-dashed">
          <div className="flex-[2] p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Plane size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Airlines</div>
                  <div className="text-lg font-bold text-neutral-900">{state.selectedFlight?.airline}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Flight No.</div>
                <div className="text-lg font-bold text-neutral-900">{state.selectedFlight?.number}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-4xl font-black text-neutral-900">{state.origin.split(',')[0].substring(0, 3).toUpperCase()}</div>
                <div className="text-sm font-medium text-neutral-500">{state.origin}</div>
              </div>
              
              <div className="flex-1 px-8 relative flex flex-col items-center">
                <div className="w-full h-px border-t border-neutral-200 border-dashed relative">
                  <Plane size={16} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                </div>
                <div className="mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Direct Flight</div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-4xl font-black text-neutral-900">{state.destination.split(',')[0].substring(0, 3).toUpperCase()}</div>
                <div className="text-sm font-medium text-neutral-500">{state.destination}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-neutral-100 border-dashed">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</div>
                <div className="font-bold text-neutral-900">{state.date}</div>
              </div>
              {state.tripType === 'round' && (
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Return</div>
                  <div className="font-bold text-neutral-900">{state.returnDate}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Boarding</div>
                <div className="font-bold text-neutral-900">{state.selectedFlight?.departureTime}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Seat</div>
                <div className="font-bold text-neutral-900">{state.addons.seats && state.addons.seats.length > 0 ? state.addons.seats.join(', ') : 'TBD'}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-neutral-50 p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-inner border border-neutral-100">
              {/* Mock QR Code */}
              <div className="w-full h-full bg-neutral-900 rounded-lg flex items-center justify-center p-2">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full h-full">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'} />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Booking Reference</div>
              <div className="text-2xl font-black text-blue-600 tracking-wider">{bookingRef}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={handleDownloadTicket}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
        >
          <Download size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wide">Download Ticket</span>
        </button>
        <button
          onClick={handlePrintPass}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
        >
          <Printer size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wide">Print Pass</span>
        </button>
        <button
          onClick={handleShareDetails}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
        >
          <Share2 size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wide">Share Details</span>
        </button>
        <button
          onClick={handleAddToWallet}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-all gap-3 group shadow-sm"
        >
          <Ticket size={24} className="text-neutral-400 group-hover:text-blue-600 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-wide">Add to Wallet</span>
        </button>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={handleGoHome}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-neutral-600 hover:bg-neutral-100 transition-all border border-neutral-200"
        >
          <Home size={20} />
          Return to Dashboard
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
