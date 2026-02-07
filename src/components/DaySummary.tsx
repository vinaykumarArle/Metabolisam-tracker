import React, { useState } from 'react';
import { analyzeDay, generateInsights } from '../utils/aiAnalysis';
import type { JournalEntry } from '../store/metabolicStore';
import { useMetabolicStore } from '../store/metabolicStore';

interface DaySummaryProps {
  isDayComplete: boolean;
  daySummary?: string;
  onCompletDay: (summary: string) => void;
  entries?: JournalEntry[];
  weight?: number;
}

export const DaySummary: React.FC<DaySummaryProps> = ({
  isDayComplete,
  daySummary,
  onCompletDay,
  entries = [],
  weight,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentStreak, longestStreak } = useMetabolicStore();

  const handleCompleteDay = () => {
    setIsProcessing(true);
    // Simulate processing for UX - analysis is instant
    setTimeout(() => {
      // Run local AI analysis (no data leaves device)
      const analysis = analyzeDay(entries, weight);
      const insights = generateInsights(analysis);
      
      onCompletDay(insights);
      setIsProcessing(false);
    }, 1200);
  };

  if (isDayComplete) {
    return (
      <div className="mx-4 sm:mx-6 mb-6 group relative animate-slide-in-bottom">
        {/* Animated gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/70 via-emerald-500/70 to-green-500/70 rounded-xl opacity-60 group-hover:opacity-90 transition-all duration-300 blur-lg animate-pulse-subtle" />
        
        {/* Summary card - no icon, just content */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-950/90 border border-green-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-green-500/20 group-hover:border-green-400/70 group-hover:shadow-green-500/40 transition-all duration-300">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 animate-gradient-shift">
              🎉 Day Complete!
            </h3>
            <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-medium opacity-90 hover:opacity-100 transition-opacity">
              {daySummary}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t border-green-500/20">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-2.5 sm:p-3">
                <p className="text-xs text-green-400/70 font-bold uppercase tracking-wider">🔥 Current Streak</p>
                <p className="text-2xl font-black text-green-300 mt-1">{currentStreak}</p>
                <p className="text-xs text-green-400/60 mt-1">days in a row</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg p-2.5 sm:p-3">
                <p className="text-xs text-amber-400/70 font-bold uppercase tracking-wider">👑 Best Streak</p>
                <p className="text-2xl font-black text-amber-300 mt-1">{longestStreak}</p>
                <p className="text-xs text-amber-400/60 mt-1">personal record</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 mb-6">
      <button
        onClick={handleCompleteDay}
        disabled={isProcessing || entries.length === 0}
        className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-400/50 disabled:shadow-none hover:scale-105 active:scale-95 group border border-violet-400/50 hover:border-violet-300"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse-subtle">Analyzing your day...</span>
          </>
        ) : entries.length === 0 ? (
          <>
            <span className="text-2xl">📝</span>
            <span>Add notes to complete day</span>
          </>
        ) : (
          <>
            <span className="text-2xl">✨</span>
            <span>Complete Day</span>
          </>
        )}
      </button>
    </div>
  );
};
