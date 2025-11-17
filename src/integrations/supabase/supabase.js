import { createClient } from '@supabase/supabase-js';

/**
 * @file This file initializes the Supabase client.
 *
 * It retrieves the Supabase project URL and API key from environment variables
 * and uses them to create a Supabase client. The client is then exported for
 * use in other parts of the application.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

/**
 * The Supabase client.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

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