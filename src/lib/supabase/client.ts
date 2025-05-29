
// IMPORTANT: If you see a "Module not found: Can't resolve '@supabase/supabase-js'" error,
// this means the package is NOT INSTALLED in your project.
//
// Please STOP your Next.js development server and run ONE of the following commands
// in your project's terminal:
//
// npm install @supabase/supabase-js
// -- OR --
// yarn add @supabase/supabase-js
// -- OR --
// pnpm add @supabase/supabase-js
//
// After the installation completes successfully, RESTART your Next.js development server.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
