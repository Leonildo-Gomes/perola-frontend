# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pérola: the frontend for a beauty and wellness platform in Cabo Verde. It has two halves: a public marketplace with customer booking, and a multi-tenant SaaS admin panel for salons, barbershops and spas. The backend is a separate Spring Boot API (`/api/v1/...`).

The project is early (v0.1.0). Only scaffolding, design tokens and shadcn/ui primitives exist so far. Most of the architecture below is **specified but not yet implemented**. Build new code to match the spec.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build (production build + type check), used to validate a task
npm run lint     # next lint (no ESLint config committed yet, so the first run may prompt to create one)
npx tsc --noEmit # type check only
```

No test framework is set up yet. E2E/a11y testing is planned for task FE-016.

Add shadcn components with `npx shadcn@latest add <component>` (config: `components.json`, style `default`, base color `slate`, RSC enabled). A shadcn MCP server is configured in `.mcp.json`.

## Source of truth and task tracking

- `docs/` holds the specs. It is **gitignored and local only**: `PRD.md`, `ARCHITECTURE.md`, `API.md`, `DOMAIN.md`, `DATABASE.md`, `DESIGN.md`, `FRONTEND_SPEC.md`, `FRONTEND_TASKS.md`. Read `docs/FRONTEND_SPEC.md` (routes, component contracts, the "5 UI states" for each screen) and `docs/FRONTEND_TASKS.md` before implementing a task.
- `MEMORY.md` (committed) is the project state tracker: ADRs, the FE-001…FE-016 task board with status, and the Google Stitch screen IDs mapped to each task. When you start a task, set its status to 🔵 *Em Desenvolvimento*. When it is done and validated, set it to 🟢 *Concluído & Validado*. Record new technical decisions as ADRs in Section 3. Never remove the Stitch/docs traceability.
- UI designs live in Google Stitch project `9636073377251149308`, which is reachable through the Stitch MCP. Screen IDs for each flow (mobile + desktop) are listed in `MEMORY.md` §5.

## Conventions

- **Language split:** all code identifiers, file and folder names, routes, props, stores and query keys are in **English**. All user-facing text (labels, errors, placeholders) is in **Portuguese (Cabo Verde)**, and the root layout uses `lang="pt"`.
- **Localization:** currency is CVE only, shown as `1.500 CVE` or `1.500$00`. The timezone is always `Atlantic/Cape_Verde` (UTC-1, no DST), and all slot/appointment times are shown in it. Phone numbers use the `+238` prefix with 7 digits. Location filters chain Island → Concelho/City.
- **Mobile-first:** base viewports are 360–420px, and touch targets are at least 44×44px. Optimize for 3G/4G: light payloads, skeletons.
- Use the `@/*` import alias (maps to `src/*`) and `cn()` from `@/lib/utils`.

## Architecture (planned, per FRONTEND_SPEC)

**Routes:** App Router route groups under `src/app/`:
- `(public)`: home, `explore`, `businesses/[id]`, `book/[serviceId]` (3-step booking wizard)
- `(auth)`: `login`, `register`, `forgot-password`
- `(customer)`: `my-bookings`, `profile`
- `(admin)`: `dashboard`, `schedule`, `services`, `team`, `availability` (tabs: monthly opening / weekly hours / time-off), `settings`, `onboarding`

Domain components go in feature folders such as `src/components/marketplace/`, `src/components/booking/` and so on. `src/components/ui/` holds only shadcn primitives.

**State:**
- Local UI state uses `useState`.
- Shared client state uses Zustand. `useAuthStore` holds the JWT, user and `memberships: {businessId, role: 'OWNER'|'EMPLOYEE'}[]`. `useTenantStore` holds `activeBusinessId`, persisted to localStorage and synced across tabs.
- Server state uses TanStack Query v5 with keys like `['marketplace','services',filters]`, `['slots',serviceId,employeeId,date]`, `['appointments',{...}]` and `['my-bookings',{page,size}]`. Set `staleTime` to 60s for lists and 10s for slots (anti-overbooking freshness).

**HTTP client (`src/lib/api/client.ts`, task FE-002):** a single typed client with interceptors that:
1. Add `Authorization: Bearer <jwt>`. On 401, call `POST /api/v1/auth/refresh` and retry. If the refresh fails, clear the auth store and redirect to `/login`.
2. Add `X-Business-Id: <activeBusinessId>` to requests from `(admin)` routes. This is how multi-tenant isolation works, so components must never set it manually.
3. Parse RFC 7807 `application/problem+json` errors. A `409` with `type: slot-already-booked` becomes a `SlotConflictError`.

**Booking conflict UX (non-negotiable):** on a `SlotConflictError`, never reset the wizard or clear the form. Keep the selections, show a contextual banner, refetch available slots and suggest alternatives.

**Forms:** React Hook Form + Zod, with schemas aligned to the backend DTOs in `docs/API.md`. Toasts use Sonner (the `<Toaster>` is already in the root layout). Icons use lucide-react.

## Design system

The "Ocean Breeze" theme is defined in `tailwind.config.ts` and `src/app/globals.css`:
- Primary teal `#0D9488`, secondary amber `#D97706`, coral/destructive `#E11D48`, neutral slate. Radius is 12px (`--radius: 0.75rem`).
- Brand tokens live under `perola.*` (e.g. `bg-perola-teal`). Appointment status colors live under `status.{pending,confirmed,completed,cancelled}.{text,bg,border}`.
- Typography utilities are in `globals.css` (`text-display`, `text-h3`, `text-body-lg`, …). Fonts are Plus Jakarta Sans (`font-sans`/`font-display`) and Inter (`font-accent`), loaded with `next/font` in `src/app/layout.tsx`.
- Use these tokens instead of ad-hoc hex values. The full spec is in `docs/DESIGN.md`.
