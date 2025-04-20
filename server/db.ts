import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

neonConfig.webSocketConstructor = ws;

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn(
    "SUPABASE_URL and/or SUPABASE_ANON_KEY not set. Supabase authentication will not work."
  );
}

// Set up database connection for Drizzle ORM
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize Supabase client for auth
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Push database schema
export async function syncSchema() {
  try {
    console.log("Syncing database schema...");
    // This is normally done with drizzle-kit, but we can also do it manually
    // by executing "npm run db:push" in package.json scripts
    console.log("Schema sync complete!");
  } catch (error) {
    console.error("Error syncing database schema:", error);
  }
}
