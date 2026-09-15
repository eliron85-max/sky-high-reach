// src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "./previewAuthStorage";

// ===============================
// HARD FALLBACK CONFIG (Lovable safe)
// ===============================

// Supabase Project URL
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://dkoczwvuibfqikbjxkla.supabase.co";

// Supabase ANON PUBLIC KEY
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_5OyWeVis3ZQvS2N_F7EShA_6WcFBeCf";

// ===============================

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
