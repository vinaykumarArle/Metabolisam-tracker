import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { InputSuggestions } from './InputSuggestions';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset content when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setShowSuggestions(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
      onClose();
    }
  };

  const handleClose = () => {
    setContent('');
    setShowSuggestions(false);
    onClose();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    // Replace the last partial word with the suggestion
    const trimmed = content.trim();
    if (!trimmed) {
      setContent(suggestion);
    } else {
      // Find the last word being typed
      const lastCommaIndex = trimmed.lastIndexOf(',');
      const lastWord = lastCommaIndex === -1 
        ? trimmed 
        : trimmed.substring(lastCommaIndex + 1).trim();
      
      // Only replace if the suggestion matches the last word (case-insensitive)
      if (suggestion.toLowerCase().includes(lastWord.toLowerCase()) || lastWord.length > 0) {
        const beforeLastWord = lastCommaIndex === -1 
          ? '' 
          : trimmed.substring(0, lastCommaIndex + 1).trim() + ', ';
        const newContent = (beforeLastWord + suggestion).trim();
        setContent(newContent);
      }
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (value: string) => {
    setContent(value);
    // Show suggestions if typing
    setShowSuggestions(value.trim().length > 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Enhanced glassmorphism */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-lg transition-opacity duration-300 animate-fade-in" 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        {/* Modal Card */}
        <div className="w-full max-w-md bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-950/98 rounded-2xl border border-violet-400/40 shadow-2xl shadow-violet-500/30 animate-zoom-in relative overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-5 sm:p-7 border-b border-violet-500/30">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
                ✨ Log Entry
              </h2>
              <p className="text-xs text-violet-400/70 mt-1 font-bold uppercase tracking-wider">Meal • Note • Exercise</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200 text-slate-400 hover:text-violet-300 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 group-hover:scale-125 transition-all duration-300" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 p-5 sm:p-7">
            <label className="block text-sm font-black text-violet-300 mb-3 uppercase tracking-wider">
              📝 What did you eat or do?
            </label>
            <div className="space-y-3">
              {/* Suggestions grid above textarea */}
              <InputSuggestions
                inputValue={content}
                isOpen={showSuggestions}
                onSelect={handleSelectSuggestion}
              />
              
              {/* Textarea */}
              <textarea
                value={content}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => handleInputChange(content)}
                placeholder="e.g., 3 Eggs, Coffee, Chicken Salad, 10 min walk 🚶"
                className="w-full h-36 p-4 bg-slate-800/60 text-slate-50 placeholder-slate-500 border border-violet-500/40 rounded-xl focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-300/30 resize-none transition-all duration-200 backdrop-blur-sm font-medium text-sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex gap-3 p-5 sm:p-7 border-t border-violet-500/30 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 rounded-xl transition-all duration-200 font-bold border border-slate-700/50 hover:border-slate-600 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white rounded-xl transition-all duration-300 font-bold shadow-lg shadow-violet-500/40 hover:shadow-xl hover:shadow-violet-400/50 hover:scale-105 active:scale-95 border border-violet-400/50"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
