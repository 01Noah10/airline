import React, { createContext, useContext, useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Toaster } from 'sonner';

export interface Flight {
  id: string;
  airline: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
}

export interface BookingState {
  origin: string;
  destination: string;
  tripType: 'round' | 'oneway';
  date: string;
  returnDate: string;
  passengers: number;
  selectedFlight: Flight | null;
  addons: {
    seats: string[];
    baggage: number;
    meal: boolean;
  };
  budget: number | null;
}

interface BookingContextType {
  state: BookingState;
  updateState: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
}

const initialState: BookingState = {
  origin: '',
  destination: '',
  tripType: 'round',
  date: '',
  returnDate: '',
  passengers: 1,
  selectedFlight: null,
  addons: {
    seats: [],
    baggage: 0,
    meal: false,
  },
  budget: null,
};

export function Root() {
  const [state, setState] = useState<BookingState>(() => {
    // Load state from sessionStorage on mount
    const savedState = sessionStorage.getItem('bookingState');
    return savedState ? JSON.parse(savedState) : initialState;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const updateState = (updates: Partial<BookingState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      // Save to sessionStorage whenever state updates
      sessionStorage.setItem('bookingState', JSON.stringify(newState));
      return newState;
    });
  };

  const resetBooking = () => {
    setState(initialState);
    sessionStorage.removeItem('bookingState');
  };

  const isConfirmationPage = location.pathname === '/confirmation';
  const isHomePage = location.pathname === '/';
  const isUtilityPage = location.pathname === '/manage' || location.pathname === '/checkin';
  const showBookingUI = !isConfirmationPage && !isUtilityPage;

  const totalPrice = useMemo(() => {
    let total = (state.selectedFlight?.price || 0) * state.passengers;
    total += state.addons.baggage * 45;
    if (state.addons.meal) total += 15 * state.passengers;
    total += state.addons.seats.length * 25;
    return total;
  }, [state]);

  const steps = [
    { name: 'Search', path: '/' },
    { name: 'Results', path: '/flights' },
    { name: 'Seats', path: '/addons' },
    { name: 'Payment', path: '/payment' },
  ];

  const currentStepIndex = steps.findIndex(s => s.path === location.pathname);

  const getBackPath = () => {
    switch (location.pathname) {
      case '/flights':
        return '/';
      case '/addons':
        return '/flights';
      case '/payment':
        return '/addons';
      default:
        return '/';
    }
  };

  return (
    <BookingContext.Provider value={{ state, updateState, resetBooking }}>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-8 relative">
            {showBookingUI && (
              <div className="max-w-4xl mx-auto mb-12 flex flex-col gap-6">
                {!isHomePage && (location.pathname === '/flights' || location.pathname === '/addons' || location.pathname === '/payment') && (
                  <button
                    onClick={() => navigate(getBackPath())}
                    className="flex items-center gap-2 text-neutral-500 hover:text-blue-600 transition-colors self-start font-semibold bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md"
                  >
                    <ChevronLeft size={20} />
                    <span>Back</span>
                  </button>
                )}

                {/* Stepper */}
                <div className="w-full mt-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full z-0" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500"
                      style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((step, idx) => {
                      const isCompleted = currentStepIndex > idx;
                      const isCurrent = currentStepIndex === idx;
                      return (
                        <div key={step.name} className="relative z-10 flex flex-col items-center gap-2 bg-neutral-50 rounded-full px-2">
                          <div className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-[3px]",
                            isCompleted ? "bg-blue-600 border-blue-600 text-white" : isCurrent ? "bg-white border-blue-600 text-blue-600 shadow-md" : "bg-white border-neutral-200 text-neutral-400"
                          )}>
                            {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                          </div>
                          <span className={clsx(
                            "text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 w-max",
                            isCurrent ? "text-blue-600" : isCompleted ? "text-neutral-700" : "text-neutral-400"
                          )}>
                            {step.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="max-w-4xl mx-auto mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {showBookingUI && (
            <div className="w-80 border-l border-neutral-200 bg-white p-6 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto shadow-sm">
              <Sidebar totalPrice={totalPrice} />
            </div>
          )}
        </main>
      </div>
    </BookingContext.Provider>
  );
}