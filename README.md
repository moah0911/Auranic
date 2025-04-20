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
# Get this from Supabase: Project Settings > Database > Connection string > URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Steps to Get Your PostgreSQL Connection String:

1. Log in to your Supabase dashboard
2. Select your project
3. Go to Project Settings > Database
4. Find the "Connection string" section
5. Select "URI" format
6. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

If `DATABASE_URL` is not provided, the application will run in a limited mode where database operations will fail. This is fine for development and testing the UI, but not suitable for production use.

## Getting Started

1. Clone the repository
2. Create a `.env` file with the required environment variables
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Features

- Image analysis for aura and rizz scores
- Song analysis for mystical interpretations
- User authentication and profile management
- History of analyses for registered users
