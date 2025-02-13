import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values if environment variables are not set
const url = supabaseUrl || 'https://dtutlqpfrhromezjfwyc.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dXRscXBmcmhyb21lempmd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTU3NTIsImV4cCI6MjA1Mzk5MTc1Mn0.GQu8vVTmhFf5QAPDM4XzZkiYQTnOH7HLEnv-EXJTE1I';

export const supabase = createClient<Database>(url, key);