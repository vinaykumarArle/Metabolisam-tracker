import { useState, useEffect } from 'react';
import {
  Header,
  DayCalendarStrip,
  WeightInput,
  EntryModal,
  JournalCard,
  FloatingActionButton,
  DaySummary,
} from './components';
import { useMetabolicStore } from './store/metabolicStore';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    selectedDate,
    setSelectedDate,
    addJournalEntry,
    deleteJournalEntry,
    updateJournalEntry,
    setWeight,
    completeDay,
    getDayData,
    daysData,
  } = useMetabolicStore();

  // Helper function to get today's date in local timezone
  const getTodayDate = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Reset to today on page reload
  useEffect(() => {
    const todayDate = getTodayDate();
    if (selectedDate !== todayDate) {
      setSelectedDate(todayDate);
    }
  }, []);

  const dayData = getDayData(selectedDate);

  const handleAddEntry = (content: string) => {
    addJournalEntry(selectedDate, {
      date: selectedDate,
      content,
    });
  };

  const handleCompleteDay = (summary: string) => {
    completeDay(selectedDate, summary);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-fuchsia-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Container wrapper for desktop width constraint */}
      <div className="w-full max-w-2xl flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <Header />

        {/* Calendar Strip */}
        <DayCalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} daysData={daysData} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Weight Input */}
          <WeightInput
            value={dayData.weight}
            onChange={(weight) => setWeight(selectedDate, weight)}
            currentDate={selectedDate}
          />

          {/* Day Summary / Complete Button */}
          <DaySummary
            isDayComplete={dayData.isDayComplete}
            daySummary={dayData.daySummary}
            onCompletDay={handleCompleteDay}
            entries={dayData.entries}
            weight={dayData.weight}
          />

          {/* Journal Entries */}
          <div className="px-4 sm:px-6 space-y-3 sm:space-y-4">
            {dayData.entries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 text-sm sm:text-base font-medium">
                  ✨ No entries yet. Add your first meal or note!
                </p>
              </div>
            ) : (
              dayData.entries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onDelete={(id) => deleteJournalEntry(selectedDate, id)}
                  onEdit={(id, content) =>
                    updateJournalEntry(selectedDate, id, content)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={() => setModalOpen(true)} />
      </div>

      {/* Entry Modal */}
      <EntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddEntry}
      />
    </div>
  );
}

export default App;
