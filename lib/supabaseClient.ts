import { createClient } from '@supabase/supabase-js'

// These lines get the secret keys from your Netlify settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates one, single, sharable client for your whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)