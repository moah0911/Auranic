# Auranic

A mystical application for analyzing auras and rizz from images and songs.

## Environment Setup

The application uses Supabase for database and authentication. You need to set up the following environment variables in a `.env` file at the root of the project:

### Required Environment Variables

```
# Supabase configuration (used for both database and authentication)
SUPABASE_URL="your-supabase-project-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# API Keys for AI models
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### Optional Environment Variables

```
# Session configuration (will be auto-generated if not provided)
# SESSION_SECRET="your-custom-session-secret"
```

## Session Secret

The application will automatically generate a secure session secret if one is not provided in the environment variables. This ensures that each deployment has a unique session secret for enhanced security.

## Database Configuration

All database operations are handled through Supabase. The application uses the Supabase client for authentication and database operations.

### Important: PostgreSQL Connection String Required

For the application to work properly in production, you **must** set up a PostgreSQL connection string from your Supabase project:

```
# Get this from Supabase: Project Settings > Database > Connection string
# Option 1: Direct connection (recommended for production)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Option 2: URI format (alternative)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Steps to Get Your PostgreSQL Connection String:

1. Log in to your Supabase dashboard
2. Select your project
3. Go to Project Settings > Database
4. Find the "Connection string" section
5. Choose one of these options:
   - **Direct Connection (Recommended)**: Select "URI + Connection Pooling" format
   - **Alternative**: Select "URI" format
6. Copy the connection string and replace the password placeholder with your database password

### Troubleshooting Connection Issues

#### Network Errors (ENETUNREACH)

If you encounter network connectivity errors:

1. Try the standard connection format instead of connection pooling
2. Make sure your hosting provider allows outbound connections to Supabase
3. Check if there are any firewall rules blocking the connection

#### Authentication Errors (SASL, SCRAM)

If you encounter SASL authentication errors:

1. Make sure your password is correctly URL encoded:
   - Replace `@` with `%40`
   - Replace `#` with `%23`
   - Replace `$` with `%24`
   - Replace spaces with `%20`

2. Try the standard connection format:
   ```
   DATABASE_URL="postgresql://postgres:YourPassword@db.your-project-ref.supabase.co:5432/postgres"
   ```

3. Remove any square brackets or other special formatting from your password

#### Password Issues

If your password contains special characters:

1. Generate a new safe password with our helper script:
   ```bash
   npm run generate:password
   ```

2. Update your Supabase database password with this new password

3. Update your DATABASE_URL in .env with the new password

4. If you must use special characters, make sure to properly URL encode them:
   - Replace `@` with `%40`
   - Replace `#` with `%23`
   - Replace `$` with `%24`
   - Replace spaces with `%20`

If `DATABASE_URL` is not provided, the application will run in a limited mode where database operations will fail. This is fine for development and testing the UI, but not suitable for production use.

## Getting Started

1. Clone the repository
2. Create a `.env` file with the required environment variables
3. Install dependencies: `npm install`
4. Test your database connection: `npm run test:db`
5. Start the development server: `npm run dev`

### Testing Database Connection

Before starting the application, you can test your database connection with:

```bash
npm run test:db
```

This will attempt to connect to your database and provide detailed error messages if the connection fails. Use this to troubleshoot connection issues before deploying the application.

## Features

- Image analysis for aura and rizz scores
- Song analysis for mystical interpretations
- User authentication and profile management
- History of analyses for registered users
