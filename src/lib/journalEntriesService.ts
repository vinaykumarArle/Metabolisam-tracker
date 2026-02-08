import { supabase, JournalEntry } from './supabase';

export interface CreateJournalEntryInput {
  day_id: string;
  entry_type: 'meal' | 'exercise' | 'note';
  content: string;
  emoji?: string;
}

export const journalEntriesService = {
  async getEntriesForDay(dayId: string): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('day_id', dayId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  },

  async createEntry(userId: string, entry: CreateJournalEntryInput): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: userId,
            ...entry,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data || null;
    } catch (error: any) {
      console.error('Error creating journal entry:', error);
      return null;
    }
  },

  async updateEntry(entryId: string, updates: Partial<CreateJournalEntryInput>): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data || null;
    } catch (error: any) {
      console.error('Error updating journal entry:', error);
      return null;
    }
  },

  async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      return false;
    }
  },

  async getEntriesForUser(userId: string, startDate?: string, endDate?: string): Promise<JournalEntry[]> {
    try {
      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00`);
      }
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching user journal entries:', error);
      return [];
    }
  },
};
