import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PriceCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  minDate?: string;
}

export function PriceCalendar({ selectedDate, onSelectDate, onClose, minDate }: PriceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });

  // Generate consistent random prices for dates (seeded by date string)
  const getPriceForDate = (dateStr: string): number => {
    // Simple hash function for consistent "random" prices
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash = hash & hash;
    }
    // Generate price between $350 and $700
    const price = 350 + Math.abs(hash % 351);
    return Math.round(price / 10) * 10; // Round to nearest $10
  };

  const getPriceColor = (price: number): string => {
    if (price < 400) return 'bg-green-100 text-green-900 border-green-300';
    if (price <= 550) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    const days: Array<{ date: number | null; dateStr: string; price: number; isPast: boolean; isSelected: boolean }> = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, dateStr: '', price: 0, isPast: false, isSelected: false });
    }
    
    // Days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDateObj = minDate ? new Date(minDate) : null;
    if (minDateObj) minDateObj.setHours(0, 0, 0, 0);
    
    for (let date = 1; date <= lastDate; date++) {
      const dateObj = new Date(year, month, date);
      const dateStr = dateObj.toISOString().split('T')[0];
      const price = getPriceForDate(dateStr);
      const isPast = dateObj < today || (minDateObj && dateObj < minDateObj);
      const isSelected = selectedDate === dateStr;
      
      days.push({ date, dateStr, price, isPast, isSelected });
    }
    
    return days;
  }, [currentMonth, selectedDate, minDate]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (dateStr: string) => {
    onSelectDate(dateStr);
    onClose();
  };

  return (
    <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-30 p-6 w-[480px]">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-neutral-600" />
        </button>
        <h3 className="text-lg font-bold text-neutral-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-neutral-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-bold text-neutral-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {calendarDays.map((day, index) => {
          if (day.date === null) {
            return <div key={index} className="aspect-square" />;
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => !day.isPast && handleDateClick(day.dateStr)}
              disabled={day.isPast}
              className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                day.isPast
                  ? 'bg-neutral-50 border-neutral-100 opacity-50 cursor-not-allowed'
                  : day.isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                  : `${getPriceColor(day.price)} border hover:scale-105 hover:shadow-md cursor-pointer`
              }`}
            >
              <span className={`text-sm font-bold ${day.isSelected ? 'text-white' : ''}`}>
                {day.date}
              </span>
              <span className={`text-xs font-semibold ${day.isSelected ? 'text-white' : ''}`}>
                ${day.price}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-neutral-200 pt-4">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Price Legend</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            <span className="text-xs text-neutral-600">Under $400 (Cheap)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
            <span className="text-xs text-neutral-600">$400-$550 (Average)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
            <span className="text-xs text-neutral-600">Above $550 (Expensive)</span>
          </div>
        </div>
      </div>
    </div>
  );
}