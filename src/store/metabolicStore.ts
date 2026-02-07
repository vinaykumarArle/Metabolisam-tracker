import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mealType?: string;
}

export interface DayData {
  date: string;
  weight?: number;
  entries: JournalEntry[];
  isDayComplete: boolean;
  daySummary?: string;
}

interface MetabolicStore {
  selectedDate: string;
  daysData: Record<string, DayData>;
  currentStreak: number;
  longestStreak: number;
  lastWeekStartDate: string | null;
  setSelectedDate: (date: string) => void;
  addJournalEntry: (date: string, entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  deleteJournalEntry: (date: string, entryId: string) => void;
  updateJournalEntry: (date: string, entryId: string, content: string) => void;
  setWeight: (date: string, weight: number) => void;
  completeDay: (date: string, summary: string) => void;
  getDayData: (date: string) => DayData;
  getWeight: (date: string) => number | undefined;
  getDefaultWeight: (date: string) => number;
  resetToToday: () => void;
  calculateStreaks: () => void;
  calculateWeeklyWeightReset: (date: string) => void;
}

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
const getTodayDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const useMetabolicStore = create<MetabolicStore>()(
  persist(
    (set, get) => ({
      selectedDate: getTodayDate(),
      daysData: {},
      currentStreak: 0,
      longestStreak: 0,
      lastWeekStartDate: null,

      setSelectedDate: (date: string) => set({ selectedDate: date }),

      addJournalEntry: (date: string, entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
        set((state) => {
          const dayData = state.daysData[date] || {
            date,
            entries: [],
            isDayComplete: false,
          };
          const newEntry: JournalEntry = {
            ...entry,
            id: `${date}-${Date.now()}`,
            timestamp: Date.now(),
          };
          return {
            daysData: {
              ...state.daysData,
              [date]: {
                ...dayData,
                entries: [...dayData.entries, newEntry],
                // Reset day completion if new entry is added after day was marked complete
                isDayComplete: false,
                daySummary: undefined,
              },
            },
          };
        });
      },

      deleteJournalEntry: (date: string, entryId: string) => {
        set((state) => {
          const dayData = state.daysData[date];
          if (!dayData) return state;
          return {
            daysData: {
              ...state.daysData,
              [date]: {
                ...dayData,
                entries: dayData.entries.filter((e) => e.id !== entryId),
              },
            },
          };
        });
      },

      updateJournalEntry: (date: string, entryId: string, content: string) => {
        set((state) => {
          const dayData = state.daysData[date];
          if (!dayData) return state;
          return {
            daysData: {
              ...state.daysData,
              [date]: {
                ...dayData,
                entries: dayData.entries.map((e) =>
                  e.id === entryId ? { ...e, content } : e
                ),
              },
            },
          };
        });
      },

      setWeight: (date: string, weight: number) => {
        set((state) => {
          const dayData = state.daysData[date] || {
            date,
            entries: [],
            isDayComplete: false,
          };
          return {
            daysData: {
              ...state.daysData,
              [date]: {
                ...dayData,
                weight,
              },
            },
          };
        });
      },

      completeDay: (date: string, summary: string) => {
        set((state) => {
          const dayData = state.daysData[date];
          if (!dayData) return state;

          // Calculate streaks after completing day
          const newState = {
            daysData: {
              ...state.daysData,
              [date]: {
                ...dayData,
                isDayComplete: true,
                daySummary: summary,
              },
            },
          };

          // Recalculate streaks after update
          setTimeout(() => get().calculateStreaks(), 0);

          return newState;
        });
      },

      getDayData: (date: string) => {
        const state = get();
        return (
          state.daysData[date] || {
            date,
            entries: [],
            isDayComplete: false,
          }
        );
      },

      getWeight: (date: string) => {
        const state = get();
        return state.daysData[date]?.weight;
      },

      getDefaultWeight: (date: string) => {
        const state = get();
        const dateObj = parseISO(date);
        
        // Get the start of the current week (Monday)
        const weekStart = new Date(dateObj);
        weekStart.setDate(dateObj.getDate() - dateObj.getDay() + (dateObj.getDay() === 0 ? -6 : 1));
        
        // Get all weights from the current week
        const weekWeights: number[] = [];
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(weekStart);
          checkDate.setDate(weekStart.getDate() + i);
          const checkDateStr = dateToString(checkDate);
          const weight = state.daysData[checkDateStr]?.weight;
          if (weight) {
            weekWeights.push(weight);
          }
        }
        
        // Return the minimum weight of the week, or 103 as default
        if (weekWeights.length > 0) {
          return Math.min(...weekWeights);
        }
        return 103;
      },

      calculateWeeklyWeightReset: (date: string) => {
        const state = get();
        const dateObj = parseISO(date);
        
        // Get the start of the week (Monday)
        const weekStart = new Date(dateObj);
        weekStart.setDate(dateObj.getDate() - dateObj.getDay() + (dateObj.getDay() === 0 ? -6 : 1));
        const weekStartStr = dateToString(weekStart);
        
        // Update the week start date to track week changes
        if (state.lastWeekStartDate !== weekStartStr) {
          set({ lastWeekStartDate: weekStartStr });
        }
      },

      resetToToday: () => {
        set({ selectedDate: getTodayDate() });
      },

      /**
       * Calculate current and longest streaks based on completed days
       * Streak breaks if a day is missed
       */
      calculateStreaks: () => {
        const state = get();
        const sortedDates = Object.keys(state.daysData).sort();
        
        if (sortedDates.length === 0) {
          set({ currentStreak: 0, longestStreak: 0 });
          return;
        }

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastCompletedDate: Date | null = null;

        for (const dateStr of sortedDates) {
          const dayData = state.daysData[dateStr];
          const currentDate = parseISO(dateStr);

          if (dayData.isDayComplete) {
            // Check if this is a consecutive day
            if (!lastCompletedDate) {
              tempStreak = 1;
            } else {
              const dayDiff = Math.floor(
                (currentDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              if (dayDiff === 1) {
                tempStreak += 1;
              } else {
                // Streak broken
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
              }
            }
            lastCompletedDate = currentDate;
          } else if (lastCompletedDate) {
            // Day is not completed but we had streaks before
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
            lastCompletedDate = null;
          }
        }

        // Handle last streak
        const today = new Date(getTodayDate());
        if (lastCompletedDate) {
          const dayDiff = Math.floor(
            (today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // If last completed day is today or yesterday, continue the streak
          if (dayDiff <= 1) {
            currentStreak = tempStreak;
          } else {
            // Streak is broken
            currentStreak = 0;
          }
        }

        longestStreak = Math.max(longestStreak, tempStreak);

        set({ currentStreak, longestStreak });
      },
    }),
    {
      name: 'rebase-store',
    }
  )
);

// Helper function to parse ISO date string
function parseISO(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Helper function to convert Date to YYYY-MM-DD format (local timezone)
function dateToString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

