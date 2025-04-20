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

All database operations are handled through Supabase. The application uses the Supabase REST API for database operations, and the Supabase client for authentication.

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
