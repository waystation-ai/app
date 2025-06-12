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
│   ├── api/               # Backend API routes
│   │   ├── auth/          # OAuth authentication flows
│   │   ├── chat/          # AI chat functionality
│   │   ├── connections/   # Manage user connections
│   │   ├── marketplace/   # Tool marketplace endpoints
│   │   ├── oauth/         # OAuth server implementation
│   │   └── tools/         # Tool execution endpoints
│   ├── connect/           # OAuth connection UI flows
│   ├── dashboard/         # User dashboard views
│   ├── integrations/      # Integration pages
│   ├── marketplace/       # Tool marketplace UI
│   └── use-cases/         # Use case pages (formerly /ai)
├── components/            # React components
│   ├── app/              # Application-specific components
│   ├── assistant-ui/     # AI assistant UI components
│   └── ui/               # Reusable UI components
├── lib/                  # Shared utilities
│   ├── db/               # Database schema and utilities
│   ├── services/         # Service integrations
│   └── utils/            # Helper functions
├── marketplace/          # Tool provider integrations
│   ├── core/             # Core marketplace types and registry
│   ├── remote-mcps/      # Remote MCP server integrations
│   └── [providers]/      # 25+ individual provider integrations
├── middleware.ts         # Next.js middleware
├── pages/                # Pages API routes (MCP endpoints)
└── types/                # TypeScript type definitions
```

## Database Schema
- **oauth_connections**: User OAuth tokens for various providers
- **oauth_states**: OAuth flow state management
- **oauth_clients**: OAuth clients for dynamic registration
- **oauth_redirect_mappings**: Client redirect URI mappings
- **remote_providers**: Unified remote provider metadata
- **waitlist_entries**: User waitlist for new integrations
- **nano_ids**: User ID to nanoid mappings

## Architecture

**Marketplace System:**
- Provider-based architecture with 25+ integrations
- Dynamic tool registration and OpenAPI generation
- Type-safe with Zod schemas and TypeScript
- Unified search and fetch tools across providers

**MCP (Model Context Protocol) Implementation:**
- Native provider support (OAuth-based)
- Remote MCP server support
- SSE (Server-Sent Events) for real-time communication
- Provider-specific routing (/[provider]/mcp/*)

**OAuth Flow:**
- Multiple OAuth provider support
- PKCE implementation for security
- Dynamic client registration
- Automatic token refresh handling

**AI Integration:**
- Chat interface with streaming responses
- Tool calling support
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
**Remote MCP**: Asana, Atlassian, Linear, Intercom, PayPal