import { createClient } from '@supabase/supabase-js'

const supabaseUr1 = 'https://razluzabxexcajfclfxl.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)