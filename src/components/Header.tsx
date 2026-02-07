import React from 'react';
import { TrendingDown, Download } from 'lucide-react';
import { useMetabolicStore } from '../store/metabolicStore';
import { generateWeeklyExport, downloadWeeklyExport } from '../utils/export';

export const Header: React.FC = () => {
  const { daysData, selectedDate } = useMetabolicStore();

  const handleExport = () => {
    const exportData = generateWeeklyExport(selectedDate, daysData);
    downloadWeeklyExport(exportData);
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-violet-500/30 px-3 sm:px-6 py-4 sm:py-6 backdrop-blur-xl shadow-lg shadow-violet-500/10 overflow-hidden">
      {/* Content */}
      <div className="relative flex items-center justify-between gap-3 z-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/40 flex-shrink-0">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 tracking-tight truncate">
              REBASE
            </h1>
            <p className="text-xs text-violet-300/60 font-bold uppercase tracking-wider truncate">✨ Reset</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/40 hover:to-fuchsia-500/40 rounded-lg sm:rounded-xl transition-all duration-300 text-violet-300 hover:text-violet-200 border border-violet-500/30 hover:border-violet-400/50 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/30 group flex-shrink-0"
          title="Export week as JSON"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </header>
  );
};
