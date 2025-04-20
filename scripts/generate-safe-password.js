// Simple script to generate a safe database password
// Run with: node scripts/generate-safe-password.js

import crypto from 'crypto';

// Generate a random password with only alphanumeric characters
function generateSafePassword(length = 16) {
  // Use only letters and numbers to avoid URL encoding issues
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  // Generate random bytes and map them to our character set
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    password += chars.charAt(randomIndex);
  }
  
  return password;
}

// Generate and display a safe password
const password = generateSafePassword();
console.log('Generated safe database password (no special characters):');
console.log(password);
console.log('\nUse this password to update your Supabase database password.');
console.log('Then update your DATABASE_URL in .env with this new password.');
console.log('\nExample DATABASE_URL format:');
console.log(`DATABASE_URL="postgresql://postgres:${password}@db.your-project-ref.supabase.co:5432/postgres"`);
