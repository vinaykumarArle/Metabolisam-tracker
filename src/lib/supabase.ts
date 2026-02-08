import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  age?: number;
  height_cm?: number;
  current_weight_kg?: number;
}

export interface DayData {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  day_id: string;
  entry_type: 'meal' | 'exercise' | 'note';
  content: string;
  emoji?: string;
  created_at: string;
}
