import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;
try {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Supabase URL or Anon Key is missing. Check your environment variables.');
	}
	supabase = createClient(supabaseUrl, supabaseAnonKey);
	console.log('[Supabase] Client initialized:', supabaseUrl);
} catch (err) {
	console.error('[Supabase] Initialization error:', err);
}

export { supabase };
