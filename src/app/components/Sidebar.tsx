import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '../views/Root';
import { Check, Plane, Briefcase, Utensils, Armchair, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  totalPrice: number;
}

export function Sidebar({ totalPrice }: SidebarProps) {
  const { state, updateState } = useBooking();
  const { selectedFlight, addons, passengers } = state;
  const [prevPrice, setPrevPrice] = useState(totalPrice);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Track price changes
  useEffect(() => {
    if (totalPrice !== prevPrice && prevPrice !== 0) {
      const change = totalPrice - prevPrice;
      setPriceChange(change);
      
      // Clear the price change indicator after 1.5s
      setTimeout(() => {
        setPriceChange(null);
      }, 1500);
    }
    setPrevPrice(totalPrice);
  }, [totalPrice]);

  const handleSetBudget = () => {
    const budget = parseInt(budgetInput);
    if (budget && budget > 0) {
      updateState({ budget });
      setShowBudgetInput(false);
      setBudgetInput('');
    }
  };

  const handleClearBudget = () => {
    updateState({ budget: null });
    setBudgetInput('');
  };

  // Calculate budget progress
  const budgetPercentage = state.budget ? (totalPrice / state.budget) * 100 : 0;
  const budgetColor = 
    budgetPercentage < 60 ? 'bg-green-500' : 
    budgetPercentage < 85 ? 'bg-amber-500' : 
    'bg-red-500';

  const overBudget = state.budget && totalPrice > state.budget;
  const overBudgetAmount = overBudget ? totalPrice - state.budget : 0;

  // Calculate breakdown
  const baseFare = (selectedFlight?.price || 0) * passengers;
  const addonsTotal = (addons.baggage * 45) + (addons.meal ? 15 * passengers : 0) + (addons.seats.length * 25);
  const baseFarePercentage = totalPrice > 0 ? Math.round((baseFare / totalPrice) * 100) : 0;
  const addonsPercentage = totalPrice > 0 ? Math.round((addonsTotal / totalPrice) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Booking Summary</h2>

      {/* Budget Section */}
      <div className="mb-6 p-4 rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-neutral-700 uppercase tracking-wide">Budget Limit</span>
          {state.budget ? (
            <button
              onClick={handleClearBudget}
              className="text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              Clear
            </button>
          ) : (
            <button
              onClick={() => setShowBudgetInput(!showBudgetInput)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <DollarSign size={14} />
              Set Budget
            </button>
          )}
        </div>

        {showBudgetInput && !state.budget && (
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              placeholder="Enter budget..."
              className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetBudget()}
            />
            <button
              onClick={handleSetBudget}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set
            </button>
          </div>
        )}

        {state.budget && (
          <>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-600">Budget:</span>
              <span className="font-bold text-neutral-900">${state.budget.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-500 ${budgetColor}`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>{Math.round(budgetPercentage)}% used</span>
              <span>${(state.budget - totalPrice).toLocaleString()} remaining</span>
            </div>
            {overBudget && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700">
                  ⚠️ Over budget by ${overBudgetAmount.toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="space-y-6 flex-1">
        {/* Flight Selection */}
        {selectedFlight ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Plane size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">Flight</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-neutral-900">{selectedFlight.airline}</span>
              <span className="text-sm text-neutral-600">${selectedFlight.price} x {passengers}</span>
            </div>
            <div className="text-xs text-neutral-500">
              {state.origin} to {state.destination}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-neutral-300 text-neutral-400 text-sm italic">
            No flight selected yet
          </div>
        )}

        {/* Add-ons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-700 mb-2 border-b border-neutral-100 pb-2">
            <Briefcase size={16} />
            <span className="text-sm font-semibold uppercase tracking-wider">Add-ons</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Briefcase size={14} />
              <span>Baggage ({addons.baggage})</span>
            </div>
            <span className="text-neutral-900 font-medium">${addons.baggage * 45}</span>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Utensils size={14} />
              <span>Meal Service</span>
            </div>
            <span className="text-neutral-900 font-medium">${addons.meal ? 15 * passengers : 0}</span>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Armchair size={14} />
              <span>Seat Selection</span>
            </div>
            <span className="text-neutral-900 font-medium">{addons.seats && addons.seats.length > 0 ? `$${addons.seats.length * 25}` : '—'}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-200 mt-auto">
        {/* Cost Breakdown */}
        {selectedFlight && (
          <div className="mb-4">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between text-sm font-semibold text-neutral-700 hover:text-blue-600 transition-colors mb-2"
            >
              <span>Cost Breakdown</span>
              {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-600">Base flight:</span>
                      <span className="font-semibold text-neutral-900">
                        ${baseFare.toLocaleString()} ({baseFarePercentage}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-600">Add-ons:</span>
                      <span className="font-semibold text-neutral-900">
                        ${addonsTotal.toLocaleString()} ({addonsPercentage}%)
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-300">
                      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-blue-500"
                          style={{ width: `${baseFarePercentage}%` }}
                        />
                        <div 
                          className="bg-amber-500"
                          style={{ width: `${addonsPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Total Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-neutral-600">Total Budget</span>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {priceChange !== null && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-sm font-bold ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {priceChange > 0 ? '+' : ''}${Math.abs(priceChange)}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              key={totalPrice}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-neutral-900"
            >
              ${totalPrice.toLocaleString()}
            </motion.span>
          </div>
        </div>
        <p className="text-xs text-neutral-400 text-center">
          All taxes and fees included. No hidden charges.
        </p>
      </div>
    </div>
  );
}
