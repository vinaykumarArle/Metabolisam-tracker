import { supabase, DayData } from './supabase';

export const daysDataService = {
  async getDayData(userId: string, date: string): Promise<DayData | null> {
    try {
      const { data, error } = await supabase
        .from('days_data')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error: any) {
      console.error('Error fetching day data:', error);
      return null;
    }
  },

  async getAllDaysData(userId: string): Promise<DayData[]> {
    try {
      const { data, error } = await supabase
        .from('days_data')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching all days data:', error);
      return [];
    }
  },

  async upsertDayData(userId: string, dayData: Partial<DayData>): Promise<DayData | null> {
    try {
      const { data, error } = await supabase
        .from('days_data')
        .upsert(
          {
            ...dayData,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single();

      if (error) throw error;
      return data || null;
    } catch (error: any) {
      console.error('Error upserting day data:', error);
      return null;
    }
  },

  async setWeight(userId: string, date: string, weight: number): Promise<DayData | null> {
    return this.upsertDayData(userId, { date, weight_kg: weight });
  },

  async setNotes(userId: string, date: string, notes: string): Promise<DayData | null> {
    return this.upsertDayData(userId, { date, notes });
  },

  async completeDay(userId: string, date: string): Promise<DayData | null> {
    return this.upsertDayData(userId, { date, completed: true });
  },

  async deleteDayData(userId: string, date: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('days_data')
        .delete()
        .eq('user_id', userId)
        .eq('date', date);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting day data:', error);
      return false;
    }
  },
};
