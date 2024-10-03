import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add a simple test function to verify the connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('cumulative_scores').select('*');
    if (error) throw error;
    console.log('Supabase connection successful. Row count:', data.length);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error.message);
    return false;
  }
};

// Test the connection immediately
testSupabaseConnection();