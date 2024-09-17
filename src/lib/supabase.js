import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);