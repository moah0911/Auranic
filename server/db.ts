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
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set. Supabase is required for database and authentication."
  );
}

// For backward compatibility, check if direct database URL is also set
if (!DATABASE_CONFIG.url) {
  console.warn(
    "DATABASE_URL not set. Using Supabase for all database operations."
  );
}

// Set up database connection for Drizzle ORM
// We need a valid PostgreSQL connection string for Drizzle ORM
// If DATABASE_URL is not set, we'll use a dummy connection string for development
// In production, you MUST set a proper DATABASE_URL
let connectionString = DATABASE_CONFIG.url;

// If no DATABASE_URL is provided, create a dummy connection for development only
if (!connectionString) {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: DATABASE_URL is required in production!');
    console.error('Please set a valid PostgreSQL connection string from Supabase.');
    // We'll continue with a dummy URL, but it will likely fail for actual DB operations
  }

  // Use a dummy connection string that won't actually connect but prevents startup errors
  connectionString = 'postgresql://postgres:password@localhost:5432/postgres';
  console.warn('Using dummy database connection. Most database operations will fail.');
} else {
  // Log connection info (without password) for debugging
  try {
    const connUrl = new URL(connectionString);
    console.log(`Connecting to database at ${connUrl.host} with user ${connUrl.username}`);
  } catch (e) {
    console.warn('Invalid database connection string format:', e);
  }
}
export const pool = new Pool({ connectionString });
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

    // Skip database sync if we're using a dummy connection
    if (!DATABASE_CONFIG.url && process.env.NODE_ENV === 'production') {
      console.warn("Skipping database schema sync because DATABASE_URL is not set in production.");
      console.warn("Please set a valid PostgreSQL connection string from Supabase.");
      return;
    }

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

    // In production, log a more helpful error message
    if (process.env.NODE_ENV === 'production') {
      console.error("\nDatabase connection failed. Please check your DATABASE_URL environment variable.");
      console.error("You need to set up a PostgreSQL database in Supabase and use the connection string.");
      console.error("\nRecommended format (connection pooling):");
      console.error("postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres\n");

      // Check for common errors
      const errorStr = String(error);
      if (errorStr.includes('ENETUNREACH')) {
        console.error("NETWORK ERROR: Cannot reach the database server. This could be due to:");
        console.error("1. IPv6 connectivity issues - try using the connection pooling URL instead");
        console.error("2. Firewall blocking outbound connections to Supabase");
        console.error("3. DNS resolution problems");
      } else if (errorStr.includes('password authentication failed')) {
        console.error("AUTHENTICATION ERROR: The password in your connection string is incorrect.");
      } else if (errorStr.includes('no pg_hba.conf entry')) {
        console.error("ACCESS ERROR: Your IP address is not allowed to access the database.");
        console.error("Make sure to allow access from your hosting provider's IP range in Supabase.");
      }
    }
  }
}
