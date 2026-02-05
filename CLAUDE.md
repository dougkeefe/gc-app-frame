# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GC App Frame is a "Golden Path" Next.js framework for Government of Canada applications with built-in compliance for Security, Privacy, Information Management, Accessibility, and Internationalization.

**Tech Stack:** Next.js 16 + React 19 + TypeScript (strict) + Tailwind v4 + Prisma + Auth.js v5

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000

# Testing
npm run test             # Run vitest in watch mode
npm run test:run         # Run tests once
npm run test:a11y        # Run accessibility tests only
npm run test:coverage    # Run with coverage report

# Code Quality
npm run lint             # ESLint with jsx-a11y rules
npm run lint:fix         # Auto-fix linting issues
npm run typecheck        # TypeScript type checking

# Database (requires DATABASE_URL in .env)
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio

# Production
npm run build            # Build for production
npm run start            # Start production server
```

## Architecture

### Routing Structure

All routes use locale-based sub-path routing (`/en/*`, `/fr/*`):

- `/app/page.tsx` - Splash page (language selection, uses WET SplashTemplate)
- `/app/[locale]/` - Locale-wrapped routes with `NextIntlClientProvider`
- `/app/[locale]/(auth)/` - Public auth routes (login)
- `/app/[locale]/(protected)/` - Routes requiring authentication
- `/app/api/auth/[...nextauth]/` - Auth.js API routes

### Middleware Chain (`middleware.ts`)

The middleware executes in this order:
1. **i18n routing** - `next-intl` handles locale detection and redirects
2. **Security headers** - CSP, X-Frame-Options, etc.
3. **Auth checks** - Redirects unauthenticated users from protected routes
4. **RBAC** - Admin routes require `admin` role

### Authentication (`lib/auth/`)

- `auth.ts` - Root NextAuth export (`{ handlers, signIn, signOut, auth }`)
- `lib/auth/config.ts` - Auth.js configuration with JWT strategy
- `lib/auth/providers/` - Azure AD (active), GCKey (stub for future)
- `lib/auth/rbac.ts` - Role/permission utilities (`hasRole`, `hasPermission`, `isAdmin`)

Roles: `admin`, `manager`, `user`, `citizen`, `guest`

### Database & Compliance (`lib/db/`, `prisma/`)

Every Prisma model includes mandatory compliance fields:
- `createdAt`, `updatedAt` - Temporal tracking
- `createdBy`, `updatedBy` - User attribution
- `securityClassification` - UNCLASSIFIED, PROTECTED_A, PROTECTED_B
- `retentionSchedule`, `dispositionDate` - LAC retention codes
- `deletedAt` - Soft delete (records are never physically deleted)
- `isPii` - Privacy flag

**Prisma Extensions** (auto-applied via `lib/db/client.ts`):
- `softDelete` - Converts delete to `deletedAt` update, filters deleted records
- `compliance` - Auto-populates `createdBy`/`updatedBy` from context

### Audit Logging (`lib/audit/`)

`AuditLogger` class provides compliance logging with PII anonymization:
```typescript
const logger = createAuditLogger(session.user.id, request);
await logger.logCreate('User', user.id, userData);
await logger.logAccessDenied('Document', docId, 'Insufficient permissions');
```

### i18n (`i18n/`)

- `config.ts` - Locale config (en, fr)
- `request.ts` - Server-side locale resolution
- `messages/{en,fr}.json` - Translation files

Use `useTranslations` hook in components, `setRequestLocale(locale)` in server components.

### GC Design System (`components/gcds/`)

Components wrap `@cdssnc/gcds-components-react-ssr`:
- `GcdsWrapper` - Client component that imports GCDS CSS
- `Header` - GcdsHeader with language toggle
- `Footer` - GcdsFooter with GC branding

Layout templates in `components/layouts/`:
- `DefaultTemplate` - Standard Canada.ca layout
- `AppTemplate` - Dashboard layout with sidebar

### Validation (`lib/validation/`)

Zod schemas for Canadian formats:
- `emailSchema`, `phoneSchema`, `postalCodeSchema`, `sinSchema`
- `securityClassificationSchema`, `userRoleSchema`
- Form schemas: `loginSchema`, `profileSchema`, `contactSchema`

## Key Patterns

### Server Components with i18n
```typescript
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientContent />;
}
```

### Protected Server Components
```typescript
const session = await auth();
if (!session) {
  redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
}
```

### Path Alias
Use `@/` for imports from project root (configured in `tsconfig.json`).
