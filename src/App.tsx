import { useState, useEffect } from 'react';
import {
  Header,
  DayCalendarStrip,
  WeightInput,
  EntryModal,
  JournalCard,
  FloatingActionButton,
  DaySummary,
  LoginScreen,
  SignupScreen,
  ProfileScreen,
  StatisticsScreen,
} from './components';
import { useMetabolicStore } from './store/metabolicStore';
import { useAuthStore } from './store/authStore';

type AppScreen = 'app' | 'login' | 'signup' | 'profile' | 'stats';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');

  const { user, isInitialized, checkAuth } = useAuthStore();
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

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Update current screen based on auth state
  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      setCurrentScreen('app');
    } else {
      setCurrentScreen('login');
    }
  }, [user, isInitialized]);

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

  const handleLoginSuccess = () => {
    setCurrentScreen('app');
  };

  const handleSignupSuccess = () => {
    setCurrentScreen('login');
  };

  // Loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Render based on current screen
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setCurrentScreen('signup')}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupScreen
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        onBack={() => setCurrentScreen('app')}
      />
    );
  }

  if (currentScreen === 'stats') {
    return (
      <StatisticsScreen
        onBack={() => setCurrentScreen('app')}
      />
    );
  }

  // Main app screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-fuchsia-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Container wrapper for desktop width constraint */}
      <div className="w-full max-w-2xl flex flex-col min-h-screen relative z-10">
        {/* Header with Profile Button */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-violet-500/30 px-3 sm:px-6 py-4 sm:py-6 backdrop-blur-xl shadow-lg shadow-violet-500/10">
          <div className="flex items-center justify-between">
            <Header />
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setCurrentScreen('stats')}
                className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-300 rounded-full hover:from-violet-500/30 hover:to-pink-500/30 transition-colors text-sm font-medium"
              >
                Stats
              </button>
              <button
                onClick={() => setCurrentScreen('profile')}
                className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-full hover:bg-violet-500/30 transition-colors text-sm font-medium"
              >
                {user?.username}
              </button>
            </div>
          </div>
        </div>

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
