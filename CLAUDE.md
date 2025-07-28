# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## WayStation App Reference

## Build Commands

- `pnpm dev` - Development with Turbopack
- `pnpm build` - Build Next.js app
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Jest test suite
- `pnpm test:watch` - Run Jest in watch mode
- `pnpm test:coverage` - Run Jest with coverage reporting
- `pnpm db:generate` - Generate Drizzle ORM files
- `pnpm db:push` - Push Drizzle schema to database
- `pnpm db:migrate` - Run database migrations

## Tech Stack
**Frontend:**
- React 19.0.0, Next.js 15.2.1 (App Router)
- TypeScript 5.x with strict type checking
- TailwindCSS 3.4.17 with tailwind-merge, tailwindcss-animate
- Radix UI components (navigation, tooltips)
- Embla Carousel, Lucide React, Tabler Icons

**Backend & Database:**
- PostgreSQL (Neon serverless)
- Drizzle ORM 0.44.2 with drizzle-kit 0.31.0
- Node.js with TypeScript

**Authentication & Security:**
- Clerk (@clerk/nextjs 6.11.2) for user authentication
- OAuth 2.0 with PKCE support

**AI & Integrations:**
- AI SDK (@ai-sdk/react, @ai-sdk/openai, @ai-sdk/azure)
- Assistant UI (@assistant-ui/react ecosystem)
- Model Context Protocol SDK (@modelcontextprotocol/sdk 1.5.0)
- 25+ marketplace integrations

**Analytics & Monitoring:**
- Vercel Analytics, Vercel Speed Insights
- PostHog (posthog-js, posthog-node)

**Content Management:**
- Payload CMS 3.48.0 with PostgreSQL adapter
- Lexical rich text editor with custom blocks
- SEO plugin integration
- Live preview and draft scheduling

**Testing:**
- Jest 30.0.5 with @testing-library/react and @testing-library/jest-dom
- Babel presets for TypeScript and React
- Test coverage reporting

**Utilities:**
- Zod 3.24.2 for schema validation
- Nanoid 5.1.5 for ID generation
- PDF Parse, Platform Detect

## Code Style
- **TypeScript**: Use strict types, avoid `any`
- **Imports**: Group imports (React, external libraries, internal modules)
- **Components**: Functional React components with explicit return types
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Use try/catch with specific error types
- **API Routes**: Consistent Next.js Route Handlers pattern
- **State Management**: React Context where appropriate

## Project Structure
```
/src
├── app/                    # Next.js App Router structure
│   ├── (frontend)/        # Frontend route group
│   │   ├── connect/       # OAuth connection UI flows
│   │   ├── marketplace/   # Tool marketplace UI
│   │   ├── posts/         # Blog posts pages
│   │   └── use-cases/     # Use case pages
│   ├── (payload)/         # Payload CMS admin route group
│   │   └── admin/         # CMS admin interface
│   ├── api/               # Backend API routes
│   │   ├── auth/          # OAuth authentication flows
│   │   ├── chat/          # AI chat functionality
│   │   ├── connections/   # Manage user connections
│   │   ├── marketplace/   # Tool marketplace endpoints
│   │   ├── oauth/         # OAuth server implementation
│   │   └── tools/         # Tool execution endpoints
│   └── app/               # App-specific pages (dashboard, integrations)
├── collections/           # Payload CMS collections
│   ├── Posts/             # Blog posts with rich content blocks
│   ├── Users/             # User management
│   ├── Media/             # File uploads and media
│   └── Categories/        # Content categorization
├── components/            # React components
│   ├── app/              # Application-specific components
│   ├── assistant-ui/     # AI assistant UI components
│   ├── payload/          # Payload CMS components and blocks
│   └── ui/               # Reusable UI components
├── lib/                  # Shared utilities
│   ├── db/               # Database schema and utilities
│   ├── services/         # Service integrations (OAuth, MCP)
│   └── utils/            # Helper functions
├── marketplace/          # Tool provider integrations
│   ├── core/             # Core marketplace types and registry
│   ├── remote-mcps/      # Remote MCP server integrations
│   └── [providers]/      # 25+ individual provider integrations
├── middleware.ts         # Next.js middleware
├── pages/                # Pages API routes (MCP endpoints)
├── payload.config.ts     # Payload CMS configuration
└── types/                # TypeScript type definitions
```

## Database Schema
**OAuth & Authentication:**
- **oauth_connections**: User OAuth tokens for various providers
- **oauth_states**: OAuth flow state management
- **oauth_clients**: OAuth clients for dynamic registration
- **oauth_redirect_mappings**: Client redirect URI mappings
- **connections**: General connection metadata (including database connections)

**Provider Management:**
- **remote_providers**: Unified remote provider metadata and client registrations
- **waitlist_entries**: User waitlist for new integrations

**User Management:**
- **nano_ids**: User ID to nanoid mappings for MCP communication

**Content Management (Payload CMS):**
- **posts**: Blog posts with rich content and SEO metadata
- **users**: CMS user accounts with role-based access
- **media**: File uploads and media assets
- **categories**: Content categorization system

## Architecture

**Dual Route Architecture:**
- Frontend routes: `(frontend)` - Public marketing, auth flows, marketplace
- Admin routes: `(payload)` - CMS admin interface at `/admin`
- App routes: `app/` - User dashboard and integrations

**Marketplace System:**
- Provider registry (`marketplace/core/registry.ts`) managing 25+ integrations
- Native providers: Direct OAuth integration with tools array
- Remote providers: MCP server integration with dynamic discovery
- Dynamic tool registration and OpenAPI generation
- Type-safe with Zod schemas and TypeScript
- Unified search and fetch tools across providers

**MCP (Model Context Protocol) Implementation:**
- Native MCP server at `/api/mcp` with SSE transport
- Remote MCP client support for external servers
- Provider-specific routing (`/api/[provider]/mcp/[nanoid]`)
- SSE (Server-Sent Events) for real-time communication with pub/sub messaging
- Tool calling, resource fetching, and search capabilities

**OAuth Flow:**
- Dual OAuth implementation: client (for providers) and server (for MCP apps)
- Multiple OAuth provider support with PKCE implementation
- Dynamic client registration for remote MCP servers
- Automatic token refresh handling
- Clerk integration for user authentication

**Content Management (Payload CMS):**
- Collections: Posts, Users, Media, Categories, UseCases
- Lexical editor with custom blocks (Banner, Code, MediaBlock, CallToAction, Content)
- Live preview functionality and draft scheduling
- SEO optimization with metadata fields
- Role-based access control

**AI Integration:**
- Chat interface with streaming responses via AI SDK
- Tool calling support across all marketplace providers
- Multiple AI provider support (OpenAI, Azure)
- Assistant UI components for rich interactions

## Key Integrations
**Project Management**: Asana, Linear, Monday, Jira, ClickUp, Wrike
**Communication**: Slack, Microsoft Teams
**Documentation**: Notion, Google Drive, Office 365
**Spreadsheets**: Google Sheets, Airtable
**Design**: Miro
**CRM/Sales**: HubSpot, Salesforce
**Email**: Gmail, Outlook, MailChimp, MailerLite
**Meeting**: Zoom, Google Meet
**Development**: Trello, Smartsheet
**Remote MCP**: Asana, Atlassian, Linear, Intercom, PayPal, Wrike, Notion

## Testing

**Framework:**

- Jest 30.0.5 with Node.js environment
- @testing-library/react and @testing-library/jest-dom for component testing
- Babel configuration for TypeScript and React

**Test Structure:**

- Unit tests for marketplace providers (`marketplace/[provider]/__tests__/`)
- Service layer tests (`lib/services/__tests__/`)
- Component tests for React components
- Integration tests for API endpoints

**Commands:**

- `pnpm test` - Run full test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage reports

**Coverage:**

- Collects from `src/**/*.{ts,tsx}`
- Excludes config files and type definitions
- Outputs to `/coverage` directory with HTML reports

## Development Patterns

**Provider Integration:**

- Native providers: Implement tools array with OAuth configuration
- Remote providers: Define serverUrl for MCP server discovery
- All providers register via `marketplace/core/registry.ts`
- Use `defineTool()` helper for type-safe tool definitions

**Database Operations:**

- Use Drizzle ORM with PostgreSQL (Neon serverless)
- Connection management via `lib/db/index.ts`
- Schema definitions in `lib/db/schema.ts`
- Run migrations with `pnpm db:migrate`

**Content Management:**

- Access Payload admin at `/admin`
- Collections defined in `src/collections/`
- Custom blocks in `components/payload/blocks/`
- Use live preview for content editing

**MCP Development:**

- Server configuration in `lib/services/mcp-server.ts`
- SSE transport for real-time communication
- Tool execution via provider registry
- Resource fetching with unified search
