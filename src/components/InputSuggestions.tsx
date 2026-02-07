import React, { useMemo } from 'react';

interface Suggestion {
  text: string;
  category: 'meal' | 'exercise' | 'drink';
  emoji: string;
}

interface InputSuggestionsProps {
  inputValue: string;
  isOpen: boolean;
  onSelect: (suggestion: string) => void;
}

// Food items from database
const FOOD_SUGGESTIONS: Suggestion[] = [
  // Proteins
  { text: 'chicken', category: 'meal', emoji: '🍗' },
  { text: 'fish', category: 'meal', emoji: '🐟' },
  { text: 'beef', category: 'meal', emoji: '🥩' },
  { text: 'eggs', category: 'meal', emoji: '🥚' },
  { text: 'tofu', category: 'meal', emoji: '🟤' },
  
  // Grains
  { text: 'rice', category: 'meal', emoji: '🍚' },
  { text: 'bread', category: 'meal', emoji: '🍞' },
  { text: 'pasta', category: 'meal', emoji: '🍝' },
  { text: 'oats', category: 'meal', emoji: '🌾' },
  { text: 'cereal', category: 'meal', emoji: '🥣' },
  
  // Vegetables
  { text: 'broccoli', category: 'meal', emoji: '🥦' },
  { text: 'salad', category: 'meal', emoji: '🥗' },
  { text: 'spinach', category: 'meal', emoji: '🥬' },
  { text: 'carrot', category: 'meal', emoji: '🥕' },
  { text: 'potato', category: 'meal', emoji: '🥔' },
  
  // Fruits
  { text: 'banana', category: 'meal', emoji: '🍌' },
  { text: 'apple', category: 'meal', emoji: '🍎' },
  { text: 'orange', category: 'meal', emoji: '🍊' },
  { text: 'berry', category: 'meal', emoji: '🫐' },
  
  // Dairy
  { text: 'milk', category: 'drink', emoji: '🥛' },
  { text: 'yogurt', category: 'meal', emoji: '🥛' },
  { text: 'cheese', category: 'meal', emoji: '🧀' },
  
  // South Indian Foods
  { text: 'dosa', category: 'meal', emoji: '🍛' },
  { text: 'idli', category: 'meal', emoji: '🍛' },
  { text: 'poori', category: 'meal', emoji: '🍛' },
  { text: 'sambar', category: 'meal', emoji: '🍛' },
  { text: 'rasam', category: 'meal', emoji: '🍛' },
  { text: 'upma', category: 'meal', emoji: '🍛' },
  { text: 'uttapam', category: 'meal', emoji: '🍛' },
  { text: 'vada', category: 'meal', emoji: '🍛' },
  { text: 'appam', category: 'meal', emoji: '🍛' },
  { text: 'paneer', category: 'meal', emoji: '🍛' },
  { text: 'dal', category: 'meal', emoji: '🍛' },
  
  // Snacks
  { text: 'nuts', category: 'meal', emoji: '🥜' },
  { text: 'chocolate', category: 'meal', emoji: '🍫' },
  { text: 'ice cream', category: 'meal', emoji: '🍦' },
];

const DRINK_SUGGESTIONS: Suggestion[] = [
  { text: 'water', category: 'drink', emoji: '💧' },
  { text: 'coffee', category: 'drink', emoji: '☕' },
  { text: 'tea', category: 'drink', emoji: '🍵' },
  { text: 'juice', category: 'drink', emoji: '🧃' },
  { text: 'smoothie', category: 'drink', emoji: '🧋' },
  { text: 'protein shake', category: 'drink', emoji: '🥤' },
  { text: 'beer', category: 'drink', emoji: '🍺' },
  { text: 'wine', category: 'drink', emoji: '🍷' },
];

const EXERCISE_SUGGESTIONS: Suggestion[] = [
  { text: 'walking', category: 'exercise', emoji: '🚶' },
  { text: 'running', category: 'exercise', emoji: '🏃' },
  { text: 'gym', category: 'exercise', emoji: '💪' },
  { text: 'yoga', category: 'exercise', emoji: '🧘' },
  { text: 'swimming', category: 'exercise', emoji: '🏊' },
  { text: 'cycling', category: 'exercise', emoji: '🚴' },
  { text: 'stretching', category: 'exercise', emoji: '🤸' },
  { text: 'cardio', category: 'exercise', emoji: '🏃‍♀️' },
  { text: 'strength training', category: 'exercise', emoji: '💪' },
  { text: 'pilates', category: 'exercise', emoji: '🧘‍♀️' },
  { text: 'tennis', category: 'exercise', emoji: '🎾' },
  { text: 'basketball', category: 'exercise', emoji: '🏀' },
  { text: 'soccer', category: 'exercise', emoji: '⚽' },
  { text: 'cricket', category: 'exercise', emoji: '🏏' },
];

const ALL_SUGGESTIONS = [...FOOD_SUGGESTIONS, ...DRINK_SUGGESTIONS, ...EXERCISE_SUGGESTIONS];

export const InputSuggestions: React.FC<InputSuggestionsProps> = ({
  inputValue,
  isOpen,
  onSelect,
}) => {
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    
    const query = inputValue.toLowerCase();
    
    // Filter suggestions based on input
    const filtered = ALL_SUGGESTIONS.filter(
      (suggestion) =>
        suggestion.text.toLowerCase().includes(query) ||
        query.includes(suggestion.text.toLowerCase())
    );
    
    // Sort by relevance (exact word match first, then partial)
    return filtered.sort((a, b) => {
      const aStartsWith = a.text.toLowerCase().startsWith(query);
      const bStartsWith = b.text.toLowerCase().startsWith(query);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return a.text.length - b.text.length;
    }).slice(0, 8); // Limit to 8 suggestions
  }, [inputValue]);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={`${suggestion.text}-${index}`}
          onClick={() => onSelect(suggestion.text)}
          className="px-3 py-2 bg-gradient-to-r from-violet-600/50 to-fuchsia-600/50 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 border border-violet-500/40 hover:border-violet-400 group text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span className="text-sm">{suggestion.emoji}</span>
          <span className="hidden sm:inline truncate">{suggestion.text}</span>
          <span className="sm:hidden truncate">{suggestion.text.substring(0, 8)}</span>
        </button>
      ))}
    </div>
  );
};
