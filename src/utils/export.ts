import { DayData } from '../store/metabolicStore';
import { format, startOfWeek, addDays } from 'date-fns';

export interface WeeklyExportData {
  weekStart: string;
  weekEnd: string;
  exportDate: string;
  days: DayData[];
  statistics: {
    totalDays: number;
    completedDays: number;
    averageWeight?: number;
    totalEntries: number;
  };
}

/**
 * Generate weekly export data for a given date
 */
export const generateWeeklyExport = (
  date: string,
  daysData: Record<string, DayData>
): WeeklyExportData => {
  const selectedDate = new Date(date);
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const days: DayData[] = [];
  let totalWeight = 0;
  let weightCount = 0;
  let completedCount = 0;
  let totalEntries = 0;

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(weekStart, i).toISOString().split('T')[0];
    const dayData = daysData[dayDate];

    if (dayData) {
      days.push(dayData);
      if (dayData.weight) {
        totalWeight += dayData.weight;
        weightCount += 1;
      }
      if (dayData.isDayComplete) {
        completedCount += 1;
      }
      totalEntries += dayData.entries.length;
    } else {
      // Add empty day entry for completeness
      days.push({
        date: dayDate,
        entries: [],
        isDayComplete: false,
      });
    }
  }

  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
    exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    days,
    statistics: {
      totalDays: 7,
      completedDays: completedCount,
      averageWeight: weightCount > 0 ? totalWeight / weightCount : undefined,
      totalEntries,
    },
  };
};

/**
 * Download weekly export as JSON file
 */
export const downloadWeeklyExport = (exportData: WeeklyExportData) => {
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `rebase-weekly-export-${exportData.weekStart}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
