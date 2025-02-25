# Technical Context

## Core Stack
- Next.js 15.1.6
- React 19.0.0
- TypeScript
- PostgreSQL (Neon)
- Drizzle ORM

## Security Infrastructure
- OAuth 2.0 implementation
- Enterprise SSO support
- Secure credential management
- Comprehensive audit logging

## Development Environment
- Node.js
- Local PostgreSQL
- Development server (next dev --turbopack)
- Database migrations (drizzle-kit)

## Key Dependencies
### Production
- @clerk/nextjs: Authentication
- @neondatabase/serverless: Database
- drizzle-orm: Data management
- jose: JWT handling
- zod: Schema validation

### Development
- TypeScript
- ESLint
- Tailwind CSS
- Development utilities

## Deployment
- Vercel platform
- Neon PostgreSQL
- Clerk authentication

## Coding style
- Do not break function definition headers (with params) and function calls into separate line for every param
- Only break function definition or call if the line exceeds roughly 80 characters
