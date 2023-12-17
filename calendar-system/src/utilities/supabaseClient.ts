import { createClient } from "@supabase/supabase-js";

const SUPABASE_CLIENT_URL: string = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_URL!;
const SUPABASE_API_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;
const realtime_opt = {};

export const supabase = createClient(SUPABASE_CLIENT_URL, SUPABASE_API_KEY, realtime_opt);