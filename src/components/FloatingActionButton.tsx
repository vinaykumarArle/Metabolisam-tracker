import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white rounded-full shadow-2xl shadow-violet-500/50 hover:shadow-2xl hover:shadow-violet-400/70 transition-all duration-300 flex items-center justify-center z-30 active:scale-95 hover:scale-125 border border-violet-400/60 hover:border-violet-300 group animate-bounce-soft"
      aria-label="Add new entry"
    >
      <Plus className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
};
