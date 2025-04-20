// Simple script to test database connection
// Run with: node scripts/test-db-connection.js

import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Get the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Log connection info (without password)
try {
  const connUrl = new URL(DATABASE_URL);
  console.log(`Attempting to connect to database at ${connUrl.host} with user ${connUrl.username}`);
  
  // Check for common issues in the connection string
  if (connUrl.password.includes('@')) {
    console.warn('Warning: Your database password contains @ character which may cause issues.');
    console.warn('Make sure it is properly URL encoded (@ should be %40).');
  }
  
  if (connUrl.password.includes('[') || connUrl.password.includes(']')) {
    console.warn('Warning: Your database password contains square brackets which should be removed.');
    console.warn('These are likely placeholder markers and not part of the actual password.');
  }
} catch (e) {
  console.warn('Invalid database connection string format:', e);
  process.exit(1);
}

// Create a connection pool
const pool = new Pool({ connectionString: DATABASE_URL });

// Test the connection
async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Try to connect and run a simple query
    const result = await pool.query('SELECT version()');
    console.log('Connection successful!');
    console.log('PostgreSQL version:', result.rows[0].version);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    
    // Provide more detailed error information
    const errorStr = String(error);
    if (errorStr.includes('ENETUNREACH')) {
      console.error("\nNETWORK ERROR: Cannot reach the database server. This could be due to:");
      console.error("1. IPv6 connectivity issues - try using a different connection format");
      console.error("2. Firewall blocking outbound connections to Supabase");
      console.error("3. DNS resolution problems");
    } else if (errorStr.includes('password authentication failed')) {
      console.error("\nAUTHENTICATION ERROR: The password in your connection string is incorrect.");
    } else if (errorStr.includes('no pg_hba.conf entry')) {
      console.error("\nACCESS ERROR: Your IP address is not allowed to access the database.");
      console.error("Make sure to allow access from your IP address in Supabase.");
    } else if (errorStr.includes('SASL') || errorStr.includes('SCRAM')) {
      console.error("\nSASL AUTHENTICATION ERROR: There's an issue with the authentication process.");
      console.error("This is often caused by:");
      console.error("1. Special characters in the password that need URL encoding");
      console.error("2. Using the wrong connection string format");
      console.error("3. Using the pooler URL with incorrect credentials");
      console.error("\nTry using the standard connection string format:");
      console.error('DATABASE_URL="postgresql://postgres:YourPassword@db.your-project-ref.supabase.co:5432/postgres"');
      console.error("\nMake sure to URL encode special characters in your password:");
      console.error("@ → %40, # → %23, $ → %24, etc.");
    }
    
    return false;
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
