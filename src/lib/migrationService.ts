import { daysDataService } from './daysDataService';
import { journalEntriesService } from './journalEntriesService';

// Old localStorage structure
interface LegacyDayData {
  date: string;
  weight?: number;
  entries: LegacyJournalEntry[];
  isDayComplete: boolean;
  daySummary?: string;
}

interface LegacyJournalEntry {
  id: string;
  content: string;
  emoji?: string;
  date: string;
}

export const migrationService = {
  /**
   * Migrate data from localStorage to Supabase
   * Call this once after a user logs in to migrate their existing data
   */
  async migrateFromLocalStorage(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get all localStorage days data
      const allDaysDataJson = localStorage.getItem('metabolic-store');
      if (!allDaysDataJson) {
        return { success: true, message: 'No legacy data to migrate' };
      }

      const allDaysData: Record<string, LegacyDayData> = JSON.parse(allDaysDataJson);
      let migratedDays = 0;
      let migratedEntries = 0;

      // Migrate each day's data
      for (const [date, dayData] of Object.entries(allDaysData)) {
        // Create or update day record
        const dayResult = await daysDataService.upsertDayData(userId, {
          date,
          weight_kg: dayData.weight,
          notes: dayData.daySummary,
          completed: dayData.isDayComplete,
        });

        if (dayResult) {
          migratedDays++;

          // Migrate journal entries for this day
          if (dayData.entries && dayData.entries.length > 0) {
            for (const entry of dayData.entries) {
              try {
                await journalEntriesService.createEntry(userId, {
                  day_id: dayResult.id,
                  entry_type: 'note', // Legacy entries were generic, default to 'note'
                  content: entry.content,
                  emoji: entry.emoji,
                });
                migratedEntries++;
              } catch (error) {
                console.error('Error migrating entry:', error);
              }
            }
          }
        }
      }

      // Mark migration as done
      localStorage.setItem('data-migration-done', 'true');

      return {
        success: true,
        message: `Migration completed: ${migratedDays} days and ${migratedEntries} entries migrated`,
      };
    } catch (error: any) {
      console.error('Migration error:', error);
      return { success: false, message: `Migration failed: ${error.message}` };
    }
  },

  /**
   * Check if migration has already been done
   */
  isMigrationDone(): boolean {
    return localStorage.getItem('data-migration-done') === 'true';
  },

  /**
   * Clear migration flag (for testing)
   */
  clearMigrationFlag(): void {
    localStorage.removeItem('data-migration-done');
  },

  /**
   * Get legacy data structure (for testing)
   */
  getLegacyData(): Record<string, LegacyDayData> | null {
    const data = localStorage.getItem('metabolic-store');
    return data ? JSON.parse(data) : null;
  },
};
