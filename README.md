# GC App Frame

**The "Golden Path" framework for building Government of Canada web applications.**

Build compliant GC applications from day one — with security, accessibility, bilingualism, and information management built into the foundation, not bolted on later.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Why GC App Frame?

Building applications for the Government of Canada means meeting a complex web of requirements:

| Requirement | Without GC App Frame | With GC App Frame |
|-------------|---------------------|-------------------|
| **Bilingualism** | Manual setup, easy to miss pages | Built-in EN/FR routing, enforced translations |
| **Accessibility** | Afterthought, fails audits | WCAG 2.1 AA baked in, automated testing |
| **Security** | Varies by developer | Standardized headers, RBAC, audit logging |
| **Information Management** | Often forgotten | Soft delete, retention schedules, compliance fields |
| **GC Branding** | Hours configuring CSS | Ready-to-use GCDS components |
| **Authentication** | Build from scratch | Azure AD/GCKey ready, role-based access |

**Stop reinventing compliance. Start building features.**

---

## Features

### Compliance Built-In

- **Soft Delete** — Records are never physically deleted; `deletedAt` timestamps preserve data for retention requirements
- **Audit Logging** — Every create, update, and delete is automatically logged with user attribution
- **Security Classification** — All data models support UNCLASSIFIED, PROTECTED A, and PROTECTED B levels
- **Retention Schedules** — LAC-compliant disposition tracking on every record
- **PII Flagging** — Mark sensitive fields for special handling and anonymization

### Bilingual by Default

- **Locale-Based Routing** — `/en/*` and `/fr/*` paths with automatic language detection
- **Enforced Translations** — TypeScript ensures all text comes from translation files
- **Language Toggle** — Built into the header, preserves current page context

### Accessibility First

- **WCAG 2.1 AA** — GC Design System components meet accessibility standards
- **Automated Testing** — Vitest + axe-core catches violations before deployment
- **Semantic HTML** — Proper heading hierarchy, landmarks, and ARIA attributes

### GC Design System Ready

- **Official Components** — Pre-configured `@cdssnc/gcds-components-react-ssr`
- **Canada.ca Branding** — Government of Canada header and footer out of the box
- **FIP Compliant** — Federal Identity Program colors, typography, and logos

### Modern Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **React 19** — Latest features and performance improvements
- **TypeScript Strict** — Type safety catches errors at compile time
- **Prisma ORM** — Type-safe database access with compliance extensions
- **Auth.js v5** — Secure authentication with Azure AD and GCKey support
- **Tailwind v4** — Utility-first CSS alongside GCDS components

---

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database (or any Prisma-supported database)
- Azure AD tenant (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/gc-app-frame.git
cd gc-app-frame

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Configure Environment

Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gcapp"

# Azure AD Authentication
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
```

### Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll see the bilingual splash page.

---

## Project Structure

```
gc-app-frame/
├── app/
│   ├── [locale]/              # Locale-wrapped routes (EN/FR)
│   │   ├── (auth)/            # Public auth pages (login)
│   │   ├── (protected)/       # Authenticated routes
│   │   └── layout.tsx         # Locale layout with providers
│   ├── api/auth/              # Auth.js API routes
│   ├── page.tsx               # Splash page (language selection)
│   └── globals.css            # Global styles + GCDS imports
├── components/
│   ├── gcds/                  # GC Design System wrappers
│   ├── layouts/               # Page templates
│   └── providers/             # React context providers
├── lib/
│   ├── auth/                  # Authentication & RBAC
│   ├── db/                    # Prisma client & extensions
│   ├── audit/                 # Compliance audit logging
│   └── validation/            # Zod schemas
├── i18n/
│   ├── messages/              # EN/FR translation files
│   └── config.ts              # Locale configuration
├── prisma/
│   └── schema.prisma          # Database schema
└── tests/
    └── a11y/                  # Accessibility tests
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with accessibility rules |
| `npm run test` | Run tests in watch mode |
| `npm run test:a11y` | Run accessibility tests only |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run typecheck` | TypeScript type checking |

---

## Adding a New Feature

### 1. Create the Route

```tsx
// app/[locale]/(protected)/my-feature/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function MyFeaturePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <main>
      <h1>My Feature</h1>
      {/* Your content here */}
    </main>
  );
}
```

### 2. Add Translations

```json
// i18n/messages/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my new feature."
  }
}

// i18n/messages/fr.json
{
  "myFeature": {
    "title": "Ma fonctionnalité",
    "description": "Ceci est ma nouvelle fonctionnalité."
  }
}
```

### 3. Use Translations

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("myFeature");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

### 4. Add Accessibility Test

```tsx
// tests/a11y/my-feature.test.tsx
import { render } from "@testing-library/react";
import { testA11y } from "./helpers";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<MyComponent />);
    await testA11y(container);
  });
});
```

---

## Authentication & Authorization

### Protecting Routes

Routes under `app/[locale]/(protected)/` automatically require authentication via middleware.

For role-based access:

```tsx
import { auth } from "@/auth";
import { hasRole } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!hasRole(session, "admin")) {
    redirect("/unauthorized");
  }

  return <AdminDashboard />;
}
```

### Available Roles

| Role | Description |
|------|-------------|
| `admin` | Full system access |
| `manager` | Team/department management |
| `user` | Standard authenticated user |
| `citizen` | Public-facing citizen user |
| `guest` | Limited read-only access |

---

## Database & Compliance

### Compliance Fields

Every model automatically includes:

```prisma
model MyModel {
  id                     String                @id @default(cuid())

  // Your fields here
  name                   String

  // Compliance fields (required)
  createdAt              DateTime              @default(now())
  updatedAt              DateTime              @updatedAt
  createdBy              String?
  updatedBy              String?
  deletedAt              DateTime?             // Soft delete
  securityClassification SecurityClassification @default(PROTECTED_A)
  retentionSchedule      String?
  dispositionDate        DateTime?
  isPii                  Boolean               @default(false)
}
```

### Soft Delete

Records are never physically deleted:

```typescript
// This actually sets deletedAt, doesn't delete
await prisma.user.delete({ where: { id: userId } });

// Queries automatically filter out deleted records
const users = await prisma.user.findMany(); // Only non-deleted

// To include deleted records
import { includeDeleted } from "@/lib/db/extensions/softDelete";
const allUsers = await prisma.user.findMany({ ...includeDeleted() });
```

### Audit Logging

All mutations are automatically logged. For manual audit entries:

```typescript
import { createAuditLogger } from "@/lib/audit/logger";

const logger = createAuditLogger(session.user.id, request);
await logger.logAccessDenied("Document", docId, "Classification too high");
```

---

## Contributing

We welcome contributions! Here's how to get involved:

### Reporting Issues

- Check existing issues before creating a new one
- Include reproduction steps and environment details
- Label accessibility issues with `a11y`

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Ensure tests pass: `npm run test:run`
5. Ensure accessibility tests pass: `npm run test:a11y`
6. Ensure linting passes: `npm run lint`
7. Commit with a descriptive message
8. Push and create a Pull Request

### Code Standards

- All UI components must pass accessibility tests
- All user-facing text must use i18n (no hardcoded strings)
- TypeScript strict mode — no `any` types without justification
- Follow existing patterns in `lib/` for new utilities

### Development Guidelines

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation and patterns.

See [.candid/Technical.md](.candid/Technical.md) for comprehensive code standards.

---

## Roadmap

- [ ] GCKey OIDC integration
- [ ] Multi-tenant support
- [ ] Document classification workflows
- [ ] Form builder with validation
- [ ] Notification service
- [ ] Enhanced audit dashboard

---

## Resources

- [GC Design System](https://design-system.alpha.canada.ca/)
- [Web Experience Toolkit](https://wet-boew.github.io/wet-boew/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Canadian Digital Service](https://digital.canada.ca/) for the GC Design System
- [WET-BOEW](https://wet-boew.github.io/) for the Web Experience Toolkit
- The open source community for the amazing tools that make this possible

---

<p align="center">
  <strong>Built for Canada. Built for Compliance. Built for You.</strong>
</p>
