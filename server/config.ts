/**
 * Central configuration file for all environment variables and API keys
 * This helps manage all external connections and secrets in one place
 */

// Database configuration
export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || '',
  user: process.env.PGUSER || '',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || '',
  host: process.env.PGHOST || '',
  port: process.env.PGPORT || '5432',
};

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
};

// AI service keys
export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    defaultModel: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    defaultModel: 'gemini-1.5-pro-latest',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    defaultModel: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
  },
};

// Session configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'auranic-session-secret',
  cookieName: 'auranic_session',
  cookieMaxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Server configuration
export const SERVER_CONFIG = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
};

// Helper function to validate required configuration
export function validateConfig() {
  const missingVars = [];

  if (!DATABASE_CONFIG.url) missingVars.push('DATABASE_URL');
  
  if (!SUPABASE_CONFIG.url) missingVars.push('SUPABASE_URL');
  if (!SUPABASE_CONFIG.anonKey) missingVars.push('SUPABASE_ANON_KEY');
  
  if (!AI_CONFIG.openai.apiKey) missingVars.push('OPENAI_API_KEY');
  if (!AI_CONFIG.gemini.apiKey) missingVars.push('GEMINI_API_KEY');
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some functionality may be limited or unavailable.');
  }
}