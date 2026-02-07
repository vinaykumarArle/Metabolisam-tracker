import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, parseISO } from 'date-fns';
import type { DayData } from '../store/metabolicStore';

interface DayCalendarStripProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  daysData: Record<string, DayData>;
}

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

/**
 * Convert a Date object to YYYY-MM-DD format (local timezone)
 */
const dateToString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const DayCalendarStrip: React.FC<DayCalendarStripProps> = ({
  selectedDate,
  onDateSelect,
  daysData,
}) => {
  const selected = parseISO(selectedDate);
  const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
  const today = getTodayDate();

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    const newDate = subDays(selected, 7);
    const newDateStr = dateToString(newDate);
    // Auto-select the same day of week in the previous week
    onDateSelect(newDateStr);
  };

  const handleNextWeek = () => {
    const newDate = addDays(selected, 7);
    const newDateStr = dateToString(newDate);
    // Auto-select the same day of week in the next week
    onDateSelect(newDateStr);
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border-b border-violet-500/20 backdrop-blur-lg shadow-md shadow-violet-500/5 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center px-3 py-3 sm:py-4">
        {/* Header - smaller on mobile */}
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
            {format(selected, 'MMM')}
          </h2>
          <p className="text-xs text-violet-400/60 font-medium">
            {format(selected, 'yyyy')}
          </p>
        </div>
      </div>

      {/* 7-Day Strip */}
      <div className="relative z-10 flex items-center justify-between px-1 sm:px-4 pb-3 sm:pb-4 gap-1 sm:gap-2">
        <button
          onClick={handlePrevWeek}
          className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-violet-500/20 rounded-md transition-all duration-200 text-slate-400 hover:text-violet-300"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex gap-0.5 sm:gap-1.5 justify-center flex-1">
          {days.map((day, index) => {
            const dateStr = dateToString(day);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const dayData = daysData[dateStr];
            const isCompleted = dayData?.isDayComplete || false;
            const dayName = format(day, 'eee').charAt(0);
            const dayNum = format(day, 'd');

            // Determine styling based on state
            let buttonClass = 'flex flex-col items-center justify-center rounded-lg w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 font-bold text-xs sm:text-sm relative';

            if (isCompleted) {
              // Completed day - green gradient
              buttonClass += ' bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-lg hover:shadow-green-400/50 scale-100 hover:scale-110';
            } else if (isSelected) {
              // Currently selected day - violet border
              buttonClass += ' bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-white border-2 border-violet-400 shadow-md shadow-violet-500/20';
            } else if (isToday) {
              // Today's date - blue border
              buttonClass += ' bg-slate-800/50 text-violet-300 border-2 border-violet-400 hover:bg-slate-700/70';
            } else {
              // Other days
              buttonClass += ' bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/30 hover:border-violet-500/30';
            }

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={buttonClass}
                style={{ animationDelay: `${index * 0.05}s` }}
                title={isToday ? 'Today' : isCompleted ? 'Completed' : ''}
              >
                <span>{dayName}</span>
                <span className="font-black">{dayNum}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextWeek}
          className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-violet-500/20 rounded-md transition-all duration-200 text-slate-400 hover:text-violet-300"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
