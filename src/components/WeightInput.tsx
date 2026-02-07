import React, { useState, useEffect } from 'react';
import { useMetabolicStore } from '../store/metabolicStore';

interface WeightInputProps {
  value?: number;
  onChange: (weight: number) => void;
  currentDate: string;
}

/**
 * Get positive vibes emoji based on weight value
 * Lower weights get celebration emojis, higher weights get motivation emojis
 */
const getWeightEmoji = (weight: number | null): string => {
  if (!weight || weight <= 0) return '💪';
  if (weight < 50) return '✨'; // Very light - celebration
  if (weight < 60) return '🌟'; // Light - stars
  if (weight < 70) return '💫'; // Below 70 - sparkles
  if (weight < 80) return '🎯'; // Around 70-80 - focused
  if (weight < 90) return '🔥'; // Getting there - fire
  if (weight < 100) return '💪'; // Strong
  return '🏋️'; // Heavy lifting
};

export const WeightInput: React.FC<WeightInputProps> = ({ value = '', onChange, currentDate }) => {
  const { getDefaultWeight } = useMetabolicStore();
  const [input, setInput] = useState<string>(String(value || ''));

  // Set default weight on mount or when date changes and no weight is logged
  useEffect(() => {
    if (!value) {
      const defaultWeight = getDefaultWeight(currentDate);
      setInput(String(defaultWeight));
      onChange(defaultWeight);
    } else {
      setInput(String(value));
    }
  }, [currentDate, value]);

  const numValue = input ? parseFloat(input) : null;
  const emoji = getWeightEmoji(numValue);

  const handleChange = (val: string) => {
    // Only accept 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (val === '' || regex.test(val)) {
      setInput(val);
      if (val && !isNaN(Number(val))) {
        onChange(parseFloat(val));
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 py-5 sm:py-6 mb-8 border-b border-violet-500/20 bg-gradient-to-r from-slate-900/40 to-slate-950/40 backdrop-blur-lg relative overflow-hidden">
      <div className="relative z-10">
        <label className="block text-xs sm:text-sm font-bold text-violet-300 mb-3 uppercase tracking-wider">
          📊 Morning Weight
        </label>
        
        {/* Input with 50% width and emoji */}
        <div className="flex items-center gap-3 sm:gap-4 max-w-md">
          {/* Input field - 50% width */}
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="70"
              className="w-1/2 text-center text-3xl sm:text-4xl font-black bg-gradient-to-br from-slate-800/40 to-slate-700/40 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 placeholder-slate-600 border-2 border-slate-700/50 focus:border-violet-400 rounded-lg p-2 sm:p-3 transition-all duration-200 outline-none"
            />
            
            {/* Unit label */}
            <span className="text-lg sm:text-xl font-black text-violet-400">
              kg
            </span>
          </div>

          {/* Dynamic weight emoji - responsive */}
          <div className="text-4xl sm:text-5xl transition-all duration-300 transform hover:scale-125">
            {emoji}
          </div>
        </div>

        {/* Helpful text */}
        {numValue && (
          <p className="text-xs text-violet-400/60 mt-2 font-medium">
            ✨ Great job logging your weight today!
          </p>
        )}
      </div>
    </div>
  );
};
