import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-violet-500/30 px-3 sm:px-6 py-4 sm:py-6 backdrop-blur-xl shadow-lg shadow-violet-500/10 overflow-hidden">
      {/* Content */}
      <div className="relative flex items-center justify-start gap-3 z-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/40 flex-shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 tracking-tight truncate">
              REBASE
            </h1>
            <p className="text-xs text-violet-300/60 font-bold uppercase tracking-wider truncate">✨ Reset</p>
          </div>
        </div>
      </div>
    </header>
  );
};
