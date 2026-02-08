import { daysDataService } from './daysDataService';
import { journalEntriesService } from './journalEntriesService';

export interface WeeklyStats {
  averageWeight: number;
  minWeight: number;
  maxWeight: number;
  weightChange: number;
  totalEntries: number;
  mealCount: number;
  exerciseCount: number;
  noteCount: number;
  completedDays: number;
  totalDays: number;
  completionRate: number;
  streak: number;
}

export interface DailyWeightData {
  date: string;
  weight: number;
}

export const statisticsService = {
  /**
   * Get weekly statistics for a user
   */
  async getWeeklyStats(userId: string, endDate: string): Promise<WeeklyStats> {
    // Calculate start date (7 days before end date)
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const startDateStr = start.toISOString().split('T')[0];

    // Fetch all days data for the week
    const allDaysData = await daysDataService.getAllDaysData(userId);
    const weekDaysData = allDaysData.filter((day) => day.date >= startDateStr && day.date <= endDate);

    // Fetch journal entries for the week
    const entries = await journalEntriesService.getEntriesForUser(
      userId,
      startDateStr,
      endDate
    );

    // Calculate weight stats
    const weightsInWeek = weekDaysData.filter((day) => day.weight_kg).map((day) => day.weight_kg!);
    const averageWeight =
      weightsInWeek.length > 0 ? weightsInWeek.reduce((a, b) => a + b, 0) / weightsInWeek.length : 0;
    const minWeight = weightsInWeek.length > 0 ? Math.min(...weightsInWeek) : 0;
    const maxWeight = weightsInWeek.length > 0 ? Math.max(...weightsInWeek) : 0;

    const firstWeight = weightsInWeek.length > 0 ? weightsInWeek[0] : 0;
    const lastWeight = weightsInWeek.length > 0 ? weightsInWeek[weightsInWeek.length - 1] : 0;
    const weightChange = firstWeight - lastWeight;

    // Count entry types
    const mealCount = entries.filter((e) => e.entry_type === 'meal').length;
    const exerciseCount = entries.filter((e) => e.entry_type === 'exercise').length;
    const noteCount = entries.filter((e) => e.entry_type === 'note').length;
    const totalEntries = entries.length;

    // Calculate completion rate
    const completedDays = weekDaysData.filter((day) => day.completed).length;
    const totalDays = weekDaysData.length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    // Calculate current streak
    const streak = this.calculateStreak(weekDaysData);

    return {
      averageWeight,
      minWeight,
      maxWeight,
      weightChange,
      totalEntries,
      mealCount,
      exerciseCount,
      noteCount,
      completedDays,
      totalDays,
      completionRate,
      streak,
    };
  },

  /**
   * Get daily weight data for a week (for chart)
   */
  async getWeeklyWeightData(userId: string, endDate: string): Promise<DailyWeightData[]> {
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const startDateStr = start.toISOString().split('T')[0];

    const allDaysData = await daysDataService.getAllDaysData(userId);
    const weekDaysData = allDaysData.filter((day) => day.date >= startDateStr && day.date <= endDate);

    return weekDaysData
      .filter((day) => day.weight_kg)
      .map((day) => ({
        date: day.date,
        weight: day.weight_kg!,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get monthly statistics
   */
  async getMonthlyStats(userId: string, year: number, month: number): Promise<WeeklyStats> {
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];

    const allDaysData = await daysDataService.getAllDaysData(userId);
    const monthDaysData = allDaysData.filter((day) => day.date >= startDate && day.date <= endDate);

    const entries = await journalEntriesService.getEntriesForUser(userId, startDate, endDate);

    const weightsInMonth = monthDaysData.filter((day) => day.weight_kg).map((day) => day.weight_kg!);
    const averageWeight =
      weightsInMonth.length > 0
        ? weightsInMonth.reduce((a, b) => a + b, 0) / weightsInMonth.length
        : 0;
    const minWeight = weightsInMonth.length > 0 ? Math.min(...weightsInMonth) : 0;
    const maxWeight = weightsInMonth.length > 0 ? Math.max(...weightsInMonth) : 0;

    const firstWeight = weightsInMonth.length > 0 ? weightsInMonth[0] : 0;
    const lastWeight = weightsInMonth.length > 0 ? weightsInMonth[weightsInMonth.length - 1] : 0;
    const weightChange = firstWeight - lastWeight;

    const mealCount = entries.filter((e) => e.entry_type === 'meal').length;
    const exerciseCount = entries.filter((e) => e.entry_type === 'exercise').length;
    const noteCount = entries.filter((e) => e.entry_type === 'note').length;
    const totalEntries = entries.length;

    const completedDays = monthDaysData.filter((day) => day.completed).length;
    const totalDays = monthDaysData.length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    const streak = this.calculateStreak(monthDaysData);

    return {
      averageWeight,
      minWeight,
      maxWeight,
      weightChange,
      totalEntries,
      mealCount,
      exerciseCount,
      noteCount,
      completedDays,
      totalDays,
      completionRate,
      streak,
    };
  },

  /**
   * Calculate current streak (consecutive completed days)
   */
  calculateStreak(sortedDaysData: any[]): number {
    if (sortedDaysData.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (let i = 0; i < sortedDaysData.length; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = sortedDaysData.find((d) => d.date === dateStr);

      if (dayData && dayData.completed) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },
};
