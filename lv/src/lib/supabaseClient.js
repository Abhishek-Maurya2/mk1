import { createClient } from '@supabase/supabase-js'

// Read Supabase URL and anon key from environment variables
const supabaseUrl = "https://tfggxiwozuucrcqhpxpb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2d4aXdvenV1Y3JjcWhweHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODczNTMsImV4cCI6MjA2MDY2MzM1M30.TtGtjbWWOvfviio_ne_MmiqmwzKYrpeOA1Rsq0gjrhU"

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in environment variables.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
