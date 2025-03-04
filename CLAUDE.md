# CLAUDE.md - WayStation App Reference

## Build Commands
- `npm run dev` - Development with Turbopack
- `npm run build` - Build Next.js app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle ORM files
- `npm run db:push` - Push Drizzle schema to database
- `npm run db:migrate` - Run database migrations

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
- `/src/app/lib` - Shared utilities and services
- `/src/app/ui` - UI components and design system