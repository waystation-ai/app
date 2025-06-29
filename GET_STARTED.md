# Getting Started with WayStation

A step-by-step guide to get WayStation running locally.

## Prerequisites

- Node.js 18+ 
- npm

## Quick Setup

### 1. Clone and Install

```bash
git clone git@github.com:waystation-ai/app.git
cd app
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

OPTIONAL: Configure the essential variables in `.env.local`:

```env
# App Configuration
APP_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/waystation_dev

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/app
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/app

# OAuth Client (Required for MCP)
CLERK_OAUTH_CLIENT_ID=your_oauth_client_id
CLERK_OAUTH_CLIENT_SECRET=your_oauth_client_secret
```

### 3. Database Setup

***IMPORTANT: You only need to do that with the blank database***
Generate and run migrations:

```bash
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Verification

1. **App loads**: Visit `http://localhost:3000`
2. **Authentication works**: Click "Sign In" and create an account
3. **Dashboard accessible**: After signing in, you should reach `/app`
4. **Connect provider**: Go to Integrations and connect official Asana account
5. **Test in Playground**: Go to Playground and do something with Asana

## Optional: OAuth Provider Setup

To test integrations, add OAuth credentials for any provider:

```env
# Example: Slack Integration
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret

# Example: Monday.com Integration  
MONDAY_CLIENT_ID=your_monday_client_id
MONDAY_CLIENT_SECRET=your_monday_client_secret
```

## Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run lint         # Run ESLint
npm run db:generate  # Generate new migrations
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run migrations programmatically
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/                 # Utilities and database
├── marketplace/         # Provider integrations
└── types/              # TypeScript definitions
```

## Next Steps

- **Add integrations**: See `src/marketplace/README.md` for adding new tools
- **Database schema**: Check `src/lib/db/schema.ts` for data models
- **API routes**: Explore `src/app/api/` for backend endpoints
- **Components**: UI components are in `src/components/`

## Troubleshooting

**Database connection issues**: Ensure PostgreSQL is running and DATABASE_URL is correct

**Clerk authentication errors**: Verify Clerk keys are set and domain is configured in Clerk dashboard

**Build errors**: Run `npm run lint` to check for TypeScript/ESLint issues

**Port conflicts**: Change the port with `npm run dev -- -p 3001`
