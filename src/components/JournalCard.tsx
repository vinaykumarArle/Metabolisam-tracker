import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { JournalEntry } from '../store/metabolicStore';
import { detectEntryEmoji } from '../utils/aiAnalysis';
import { InputSuggestions } from './InputSuggestions';

interface JournalCardProps {
  entry: JournalEntry;
  onDelete: (entryId: string) => void;
  onEdit: (entryId: string, content: string) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  entry,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const emoji = detectEntryEmoji(entry.content);

  const handleEditSave = () => {
    if (editContent.trim()) {
      onEdit(entry.id, editContent);
      setIsEditing(false);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    // Replace the last partial word with the suggestion
    const trimmed = editContent.trim();
    if (!trimmed) {
      setEditContent(suggestion);
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
        setEditContent(newContent);
      }
    }
    setShowSuggestions(false);
  };

  const handleEditChange = (value: string) => {
    setEditContent(value);
    setShowSuggestions(value.trim().length > 0);
  };

  return (
    <div className="relative group animate-slide-in-bottom">
      {/* Enhanced gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/60 via-fuchsia-500/60 to-pink-500/60 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md group-hover:blur-lg" />
      
      {/* Card content */}
      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 backdrop-blur-sm group-hover:border-slate-600/80 group-hover:from-slate-900 group-hover:to-slate-800/70 group-hover:-translate-y-1">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg sm:text-xl">{emoji}</span>
              <p className="text-xs text-violet-400/70 font-medium whitespace-nowrap">
                {format(new Date(entry.timestamp), 'HH:mm')}
              </p>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <InputSuggestions
                  inputValue={editContent}
                  isOpen={showSuggestions}
                  onSelect={handleSelectSuggestion}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => handleEditChange(e.target.value)}
                  onFocus={() => handleEditChange(editContent)}
                  className="w-full p-2 sm:p-3 bg-slate-800/70 text-slate-50 border border-violet-500/40 rounded-lg focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-300/30 text-sm resize-none transition-all backdrop-blur-sm font-medium"
                  rows={3}
                />
              </div>
            ) : (
              <p className="text-sm text-slate-100 break-words leading-relaxed font-medium hover:text-violet-200 transition-colors duration-200">{entry.content}</p>
            )}
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isEditing ? (
              <button
                onClick={handleEditSave}
                className="p-2 sm:p-2.5 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all duration-200 shadow-lg shadow-green-500/30 hover:scale-110 animate-pop-in"
                title="Save"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 sm:p-2.5 bg-slate-800/70 hover:bg-slate-700/90 text-slate-300 hover:text-violet-300 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-violet-500/40 hover:scale-110"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (!isEditing) {
                  onDelete(entry.id);
                }
              }}
              className="p-2.5 bg-slate-800/70 hover:bg-slate-700/90 text-slate-300 hover:text-red-400 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-red-500/40 hover:scale-110"
              title="Delete"
              disabled={isEditing}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
