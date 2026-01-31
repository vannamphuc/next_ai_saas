# TailFlow - AI-Ready Team Communication Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma)

**Modern, type-safe SaaS platform for team communication with AI capabilities**

[Demo](#) | [Documentation](#documentation) | [Report Bug](https://github.com/your-repo/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TailFlow is a modern team communication platform built with Next.js 16, featuring workspace-based organization, real-time channels, and AI-ready infrastructure. The platform provides a Slack-like experience with enterprise-grade security and type-safe APIs.

---

## Features

### Core Features

- **Authentication & Authorization** - OAuth/OIDC via Kinde with organization support
- **Workspace Management** - Create and manage multiple workspaces
- **Channel System** - Organize conversations by channels within workspaces
- **Team Collaboration** - View and manage workspace members
- **Dark Mode** - Full dark/light theme support

### Security Features

- **Shield Protection** - Arcjet security middleware
- **Bot Detection** - Automatic bot blocking
- **Rate Limiting** - Sliding window rate limiting for write operations
- **User-based Access Control** - Workspace-level permissions

### UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Motion library animations
- **Toast Notifications** - Real-time feedback with Sonner
- **Accessible Components** - Built on Radix UI primitives

---

## Tech Stack

### Core Framework

| Technology | Version | Description |
|------------|---------|-------------|
| Next.js | 16.1.5 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type safety |

### Authentication

| Technology | Description |
|------------|-------------|
| Kinde Auth | OAuth 2.0 / OIDC authentication |
| Kinde Management API | Organization and user management |

### API & Data Fetching

| Technology | Description |
|------------|-------------|
| ORPC | Type-safe RPC framework |
| TanStack Query | Server state management |
| Zod | Schema validation |

### Database

| Technology | Description |
|------------|-------------|
| PostgreSQL | Primary database |
| Prisma | ORM with type generation |
| Neon | Serverless PostgreSQL adapter |

### Security

| Technology | Description |
|------------|-------------|
| Arcjet | Bot detection, shield, rate limiting |

### Styling & UI

| Technology | Description |
|------------|-------------|
| Tailwind CSS 4 | Utility-first CSS |
| shadcn/ui | Pre-built accessible components |
| Radix UI | Headless UI primitives |
| Motion | Animation library |
| Lucide React | Icon library |

### Form & Validation

| Technology | Description |
|------------|-------------|
| React Hook Form | Form state management |
| Zod | Schema validation |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)
- Kinde account
- Arcjet account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/next_ai_saas.git
cd next_ai_saas
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Fill in your environment variables (see [Environment Variables](#environment-variables))

4. **Set up the database**

```bash
pnpm run prisma:generate
pnpm run db push
```

5. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
next_ai_saas/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard routes group
│   │   └── workspace/            # Workspace pages
│   │       ├── page.tsx          # Workspace list
│   │       ├── layout.tsx        # Workspace layout
│   │       └── [workspaceId]/    # Dynamic workspace routes
│   │           ├── page.tsx
│   │           └── _components/  # Workspace-specific components
│   ├── (marketing)/              # Marketing pages
│   │   └── page.tsx              # Homepage
│   ├── api/                      # API routes
│   │   ├── auth/[kindeAuth]/     # Auth handler
│   │   └── rpc/[[...rest]]/      # ORPC endpoint
│   ├── middlewares/              # Custom middleware
│   │   ├── auth.ts               # Authentication
│   │   ├── workspace.ts          # Workspace context
│   │   └── arcject/              # Security middleware
│   ├── router/                   # ORPC routers
│   ├── schemas/                  # Zod schemas
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities
│   ├── orpc.ts                   # Client ORPC setup
│   ├── orpc.server.ts            # Server ORPC setup
│   ├── prisma.ts                 # Prisma client
│   ├── arcject.ts                # Arcjet config
│   └── providers.tsx             # React providers
├── prisma/                       # Database
│   ├── schema.prisma             # Schema definition
│   └── migrations/               # Database migrations
├── public/                       # Static assets
└── package.json                  # Dependencies
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# ===================
# Authentication (Kinde)
# ===================
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=/workspace
KINDE_POST_LOGOUT_REDIRECT_URL=/
KINDE_DOMAIN=your-domain.kinde.com
KINDE_MANAGEMENT_CLIENT_ID=your_management_client_id
KINDE_MANAGEMENT_CLIENT_SECRET=your_management_client_secret

# ===================
# Security (Arcjet)
# ===================
ARCJET_KEY=your_arcjet_api_key

# ===================
# Database (Neon PostgreSQL)
# ===================
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm check` | Run Prettier + ESLint fix |
| `pnpm db` | Run Prisma DB commands |
| `pnpm prisma:generate` | Generate Prisma client |

---

## API Reference

### Architecture

The API uses **ORPC** - a type-safe RPC framework that provides full type safety between client and server.

**Base Endpoint:** `/api/rpc/`

### Workspace Endpoints

#### List Workspaces

```typescript
// Client usage
const { data } = orpc.workspace.list.useQuery()
```

**Response:**
```json
{
  "workspaces": [
    {
      "id": "org_xxx",
      "name": "My Workspace",
      "code": "my-workspace"
    }
  ]
}
```

#### Create Workspace

```typescript
// Client usage
const mutation = orpc.workspace.create.useMutation()
mutation.mutate({ name: "New Workspace" })
```

### Channel Endpoints

#### List Channels

```typescript
// Client usage (requires workspace context)
const { data } = orpc.channels.list.useQuery()
```

#### Create Channel

```typescript
// Client usage
const mutation = orpc.channels.create.useMutation()
mutation.mutate({ name: "general" })
```

---

## Database Schema

### Channel Model

```prisma
model Channel {
  id          String   @id @default(uuid())
  name        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())
  workspaceId String   // Kinde organization ID
  createdById String   // Kinde user ID

  @@unique([workspaceId, name])
}
```

---

## Architecture

### Key Design Decisions

1. **Type-Safe RPC (ORPC)**
   - Full type safety between client and server
   - No GraphQL/REST complexity
   - Procedural API approach

2. **Serverless-Ready**
   - Neon adapter for serverless PostgreSQL
   - Edge-compatible setup

3. **Modular Middleware**
   - Composable middleware stack
   - Separation of concerns (auth, workspace, security)

4. **Server Components with Hydration**
   - Next.js Server Components for data fetching
   - React Query for client-side caching
   - Query hydration bridge pattern

5. **Organization-Centric**
   - Using Kinde organizations as workspaces
   - Federated authentication model

6. **Security-First**
   - Arcjet integration for attack prevention
   - Rate limiting on write operations
   - Bot detection enabled

### Data Flow

```
Client Request
     │
     ▼
┌─────────────┐
│   Arcjet    │  ← Bot Detection + Shield
│  Middleware │
└─────────────┘
     │
     ▼
┌─────────────┐
│    Auth     │  ← Kinde Authentication
│  Middleware │
└─────────────┘
     │
     ▼
┌─────────────┐
│  Workspace  │  ← Workspace Context
│  Middleware │
└─────────────┘
     │
     ▼
┌─────────────┐
│    ORPC     │  ← Type-Safe API Handler
│   Router    │
└─────────────┘
     │
     ▼
┌─────────────┐
│   Prisma    │  ← Database Operations
│    ORM      │
└─────────────┘
     │
     ▼
┌─────────────┐
│    Neon     │  ← PostgreSQL Database
│  Database   │
└─────────────┘
```

---

## Roadmap

### Phase 1 - Foundation (Completed)

- [x] Project setup with Next.js 16
- [x] Authentication with Kinde
- [x] Workspace management
- [x] Channel system
- [x] Member management
- [x] Security middleware (Arcjet)
- [x] Dark mode support
- [x] Responsive UI

### Phase 2 - Communication (In Progress)

- [ ] Real-time messaging
- [ ] WebSocket integration
- [ ] Message persistence
- [ ] File attachments
- [ ] Message threads
- [ ] Emoji reactions

### Phase 3 - AI Integration

- [ ] AI-powered message summaries
- [ ] Smart channel suggestions
- [ ] AI assistant bot
- [ ] Automated responses
- [ ] Content moderation
- [ ] Search with AI

### Phase 4 - Advanced Features

- [ ] Video/Voice calls
- [ ] Screen sharing
- [ ] Custom integrations
- [ ] Webhooks
- [ ] API for third-party apps
- [ ] Mobile applications

### Phase 5 - Enterprise

- [ ] SSO/SAML authentication
- [ ] Advanced analytics
- [ ] Compliance features
- [ ] Data export
- [ ] Custom branding
- [ ] SLA support

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Run `pnpm check` before committing
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with love using Next.js, TypeScript, and AI**

[Report Bug](https://github.com/your-repo/issues) | [Request Feature](https://github.com/your-repo/issues)

</div>
