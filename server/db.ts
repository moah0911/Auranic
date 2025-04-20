import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import ws from "ws";
import * as schema from "@shared/schema";
import { createClient } from '@supabase/supabase-js';
import { DATABASE_CONFIG, SUPABASE_CONFIG, validateConfig } from './config';

// Validate required configuration
validateConfig();

neonConfig.webSocketConstructor = ws;

// Check for required environment variables
if (!DATABASE_CONFIG.url) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.warn(
    "SUPABASE_URL and/or SUPABASE_ANON_KEY not set. Supabase authentication will not work."
  );
}

// Set up database connection for Drizzle ORM
export const pool = new Pool({ connectionString: DATABASE_CONFIG.url });
export const db = drizzle({ client: pool, schema });

// Initialize Supabase client for auth
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Push database schema
export async function syncSchema() {
  try {
    console.log("Syncing database schema...");
    
    // Create tables directly with SQL since we don't have drizzle migrations set up
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS image_analyses (
        id SERIAL PRIMARY KEY,
        image_id TEXT NOT NULL UNIQUE,
        user_id INTEGER REFERENCES users(id),
        aura_score INTEGER NOT NULL,
        rizz_score INTEGER NOT NULL,
        mystic_title TEXT NOT NULL,
        analysis_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_public BOOLEAN DEFAULT FALSE NOT NULL,
        content_type TEXT DEFAULT 'image' NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS song_analyses (
        id SERIAL PRIMARY KEY,
        song_id TEXT NOT NULL UNIQUE,
        song_name TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        aura_score INTEGER NOT NULL,
        rizz_score INTEGER NOT NULL,
        mystic_title TEXT NOT NULL,
        analysis_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        is_public BOOLEAN DEFAULT FALSE NOT NULL,
        content_type TEXT DEFAULT 'song' NOT NULL
      );
    `);
    
    console.log("Schema sync complete!");
  } catch (error) {
    console.error("Error syncing database schema:", error);
  }
}
