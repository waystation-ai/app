# CLAUDE.md - WayStation App Reference

## Build Commands
- `npm run dev` - Development with Turbopack
- `npm run build` - Build Next.js app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle ORM files
- `npm run db:push` - Push Drizzle schema to database
- `npm run db:migrate` - Run database migrations

## Tech Stack
- **Frontend**: React 19, Next.js 15 (App Router)
- **Styling**: TailwindCSS, tailwind-merge, tailwindcss-animate
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Authentication**: Clerk
- **AI Integration**: AI SDK, Assistant UI
- **Analytics**: Vercel Analytics, PostHog
- **Type Safety**: TypeScript, Zod validation

## Code Style
- **TypeScript**: Use strict types, avoid `any`
- **Imports**: Group imports (React, external libraries, internal modules)
- **Components**: Functional React components with explicit return types
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Use try/catch with specific error types
- **API Routes**: Consistent Next.js Route Handlers pattern
- **State Management**: React Context where appropriate

## Project Structure
- `/src/app` - Next.js app router structure
  - `/src/app/api` - Backend API routes
  - `/src/app/connect` - OAuth connection flows
  - `/src/app/dashboard` - User dashboard views
  - `/src/app/marketplace` - Tool marketplace
  - `/src/app/mcp` - Model Context Protocol implementation
  - `/src/app/tools` - Tool integration endpoints
- `/src/components` - UI components and design system
  - `/src/components/ui` - Reusable UI components
  - `/src/components/app` - Application-specific components
  - `/src/components/assistant-ui` - AI assistant components
- `/src/lib` - Shared utilities and services
  - `/src/lib/db` - Database schema and utilities
  - `/src/lib/services` - Service integrations
  - `/src/lib/utils` - Helper functions
- `/src/marketplace` - Tool integrations for various services
  - 25+ integrations including Google Workspace, Slack, Linear, Notion, etc.
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Database Schema
- **OAuth Connections**: Stores user OAuth tokens for various providers
- **OAuth States**: Manages OAuth flow state
- **Remote Provider Tools**: Tracks available tools for each provider
- **Waitlist Entries**: Manages user waitlist for new integrations
- **Nano IDs**: Maps user IDs to nanoid identifiers

## Marketplace Architecture
- **Provider-based**: Each service (Monday, Slack, etc.) is a provider
- **Tool Definition**: Each operation is defined as a tool with metadata
- **Registry**: Central registry for all providers and tools
- **Dynamic Routes**: Routes that handle requests to tool endpoints
- **Type Safety**: Zod schemas for validation and TypeScript types
- **OpenAPI Generation**: Auto-generated OpenAPI specs for tools