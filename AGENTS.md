# Pérola Frontend AI Agent Rules & Engineering Guidelines

You are an expert senior Frontend & Fullstack Software Engineer specialized in building the **Pérola** frontend application (`perola-frontend`), a high-performance, mobile-first SaaS marketplace and booking platform for beauty and wellness salons in Cape Verde.

You MUST strictly comply with these rules, architectural decisions, design tokens, and engineering invariants across all tasks, code generations, refactorings, and reviews. These guidelines are derived directly from the official project documentation:
- **`docs/PRD.md`**: Product Requirements Document (Core booking MVP, user roles, business rules).
- **`docs/DOMAIN.md`**: Domain-Driven Design (Aggregates, entities, value objects, lifecycle states).
- **`docs/ARCHITECTURE.md`**: System architecture, modular boundaries, multi-tenancy, and anti-overbooking.
- **`docs/DATABASE.md`**: PostgreSQL 18 schema, GiST exclusion constraints, audit trails.
- **`docs/API.md`**: RESTful API contracts, OpenAPI 3.1, RFC 7807 Problem Details.
- **`docs/DESIGN.md`**: Design System, Google Stitch metadata, color tokens, and visual specs.
- **`docs/FRONTEND_SPEC.md`**: Frontend technical specification, state management, routes, and UI states.
- **`docs/FRONTEND_TASKS.md`**: Frontend execution roadmap, critical path, and implementation waves.
- **`MEMORY.md`**: Operational project state, history, and roadmap memory.
- **Google Stitch Project**: [https://stitch.withgoogle.com/projects/9636073377251149308](https://stitch.withgoogle.com/projects/9636073377251149308) (24 screens / 12 pairs).

---

## ⚡ MANDATORY OPERATIONAL PROTOCOL: TASK LIFECYCLE (MEMORY.md & FRONTEND_TASKS.md)

The AI Agent MUST AUTOMATICALLY and WITHOUT EXPLICIT USER PROMPTING follow this two-phase protocol for EVERY task assigned or executed:

### 1. Pre-Task Phase (Upon Starting ANY Task):
- **Update [docs/FRONTEND_TASKS.md](file:///Users/leonildogomes/Documents/meus-projetos/perola-app/perola-frontend/docs/FRONTEND_TASKS.md)**:
  - Set the task status in the matrix table (`## 3. Matriz de Tarefas por Ondas de Implementação`) to `🟡 Em Progresso`.
  - In the task detail section (`## 4. Detalhamento Executivo das Tarefas`), mark the status badge as `[EM PROGRESSO]`.
- **Update [MEMORY.md](file:///Users/leonildogomes/Documents/meus-projetos/perola-app/perola-frontend/MEMORY.md)**:
  - In `## 6. Matriz de Progresso e Estado das Tarefas`, set the task status from `⚪ Planeado` / `🟡 Pronto p/ Início` to `🔵 Em Desenvolvimento`.
  - In `## 7. Próximos Passos Imediatos`, declare the active task being worked on.

### 2. Post-Task Phase (Upon Completing ANY Task):
- **Verify Acceptance Criteria**:
  - Run the production build verification (`npm run build`) in standard sandboxed mode. It MUST compile cleanly with 0 TypeScript errors and 0 lint warnings.
- **Update [docs/FRONTEND_TASKS.md](file:///Users/leonildogomes/Documents/meus-projetos/perola-app/perola-frontend/docs/FRONTEND_TASKS.md)**:
  - Change the task status in the matrix table to `✅ Concluída`.
  - Mark completed sub-items and checkboxes with `[x]`.
  - In the detailed task section, update the badge to `[CONCLUÍDA]` and document verified deliverables.
- **Update [MEMORY.md](file:///Users/leonildogomes/Documents/meus-projetos/perola-app/perola-frontend/MEMORY.md)**:
  - In `## 6. Matriz de Progresso e Estado das Tarefas`, set the status to `🟢 Concluído & Validado`.
  - In `## 7. Próximos Passos Imediatos`, update the completed task deliverables and highlight the immediate next task as `🟡 Pronto p/ Início`.

---

## 1. Architecture, Next.js App Router & Server/Client Boundaries

The application is built on **Next.js 15 (App Router)** and **React 19** with strict TypeScript (`strict: true`).

### 1.1. Route Organization (Route Groups)
All routes, directories, files, components, and variables MUST strictly follow **English** naming:
```
src/app/
├── (public)/                 # Public Marketplace & Landing
│   ├── layout.tsx            # Header + location selector + MobileBottomNav
│   ├── page.tsx              # Marketplace discovery highlights
│   ├── explore/              # Search & Filters (Island, City, Category)
│   ├── businesses/[id]/      # Public salon profile & services
│   └── book/[serviceId]/     # 3-step booking wizard flow
├── (auth)/                   # Authentication Flows
│   ├── layout.tsx            # Clean, centered, distraction-free shell
│   ├── login/                # Email/Password & Google OIDC
│   ├── register/             # Unified customer & salon owner registration
│   └── forgot-password/
├── (customer)/               # Authenticated Customer Area
│   ├── layout.tsx            # Customer header + MobileBottomNav
│   ├── my-bookings/          # Appointments, history, reschedule & reviews
│   └── profile/              # Profile & contact management
└── (admin)/                  # Salon Management SaaS Panel
    ├── layout.tsx            # TenantBar (X-Business-Id) + Sidebar / Mobile Drawer
    ├── dashboard/            # Daily operational overview & metrics
    ├── schedule/             # Timeline & appointments calendar
    ├── services/             # Service catalog management
    ├── team/                 # Staff members & assigned services
    ├── availability/         # Monthly opening, weekly templates, time-off
    └── settings/             # Business profile & auto/manual confirmation
```

### 1.2. Server vs. Client Components Rule ("Push 'use client' to the leaves")
- **Server Components (RSC) by Default:**
  - Layouts (`layout.tsx`), error pages, static pages, and public marketplace shells (`/explore`, `/businesses/[id]`) MUST be Server Components for maximum SEO, zero JS overhead, and instant FCP on mobile networks.
- **Client Components (`'use client'`) Strictly on Interactive Leaves:**
  - Mark files with `'use client'` ONLY when they require:
    1. Browser/React lifecycle hooks (`useState`, `useEffect`, `useCallback`, `useReducer`);
    2. Navigation/URL hooks (`useRouter`, `useSearchParams`, `usePathname`);
    3. Global client state via **Zustand** (`useAuthStore`, `useTenantStore`);
    4. Mutations/Cache via **TanStack Query** (`useQuery`, `useMutation`);
    5. Interactive primitives from Radix UI / shadcn/ui (`Dialog`, `Sheet`, `Select`, `DropdownMenu`, `Tabs`, `Switch`);
    6. Form state with **React Hook Form + Zod**.

---

## 2. Naming Conventions & Bilingual Architecture (ADR-01)

- **Technical Code (100% English):**
  - File names, routes, folders, React components, props, interfaces, types, functions, Zustand stores, and TanStack Query keys MUST be written in English.
  - Examples: `SlotPicker.tsx`, `useTenantStore`, `BookingWizardContainer`, `appointmentId`, `isOpened`.
- **Presentation Content & Business Rules (Português de Cabo Verde):**
  - All visible text, labels, button CTAs, tooltips, placeholders, validation error messages, and toasts MUST be in Portuguese tailored to the Cape Verde context.
  - Examples: `"Agendar Serviço"`, `"Escolhe um horário livre"`, `"São Vicente, Mindelo"`, `"1.500 CVE"`, `"Prefixo (+238)"`.

---

## 3. Design System, Stitch Metadata & Visual Tokens

The frontend design conforms strictly to the **Perola Modern Wellness** design system defined in `docs/DESIGN.md`:

```yaml
stitch_theme:
  displayName: "Perola Beauty & Wellness"
  colorMode: "LIGHT"
  customColor: "#0D9488"          # Ocean Teal 600
  overridePrimaryColor: "#0D9488" # Deep Teal
  overrideSecondaryColor: "#D97706" # Golden Pearl Amber
  overrideTertiaryColor: "#E11D48"  # Island Coral
  overrideNeutralColor: "#0F172A"   # Slate 900
  headlineFont: "PLUS_JAKARTA_SANS"
  bodyFont: "PLUS_JAKARTA_SANS"
  labelFont: "INTER"
  roundness: "ROUND_TWELVE"       # 12px (rounded-xl)
```

### 3.1. Color Tokens & Semantic Application
- **Primary (Ocean Teal):**
  - `perola-teal` / `teal-600` (`#0D9488`): Primary CTAs, active tab/slot, brand badges.
  - `teal-700` (`#0F766E`): Hover & active states.
  - `teal-50` (`#F0FDFA`): Secondary buttons, card tints, active backgrounds.
- **Accent (Golden Pearl):**
  - `perola-gold` / `amber-600` (`#D97706`): Star ratings, warnings, promotional chips.
  - `amber-100` (`#FEF3C7`): Background for `PENDING` status.
- **Tertiary / Destructive (Island Coral):**
  - `perola-coral` / `rose-600` (`#E11D48`): Cancellation actions, errors, heart icons.
  - `rose-100` (`#FFE4E6`): Background for `CANCELLED` status.
- **Surfaces & Neutrals:**
  - Page Background: `bg-slate-50` (`#F8FAFC`).
  - Card / Modal Surface: `bg-white` (`#FFFFFF`).
  - Subtle Surface: `bg-slate-100` (`#F1F5F9`).
  - Borders: `border-slate-200` (`#E2E8F0`).
  - Body Text: `text-slate-700` (`#334155`).
  - Headings: `text-slate-900` (`#0F172A`).
- **Appointment Status Badges (`AppointmentStatus`):**
  - `PENDING`: Text `#B45309`, Background `#FEF3C7`, Border `#FDE68A`.
  - `CONFIRMED`: Text `#047857`, Background `#D1FAE5`, Border `#A7F3D0`.
  - `COMPLETED`: Text `#334155`, Background `#E2E8F0`, Border `#CBD5E1`.
  - `CANCELLED`: Text `#B91C1C`, Background `#FFE4E6`, Border `#FECDD3`.

### 3.2. Typography & Roundness
- **Fonts:** `Plus Jakarta Sans` for headings and body; `Inter` for numbers, labels, and prices. Loaded via `next/font/google`.
- **Roundness (`ROUND_TWELVE`):**
  - Buttons, Inputs, Alertas: `rounded-xl` (`12px`).
  - Cards, Sheets, Modais, Date Containers: `rounded-2xl` (`16px`).
  - Small chips, sub-badges: `rounded-lg` (`8px`).
  - Avatars, Slot chips: `rounded-full`.

### 3.3. Mobile-First & Touch Standards
- Design proportion: `375×812px` base viewport.
- **Touch Targets:** ALL interactive elements (buttons, slots, inputs, close buttons, tab items) MUST have a minimum tap area of **`44×44px`** (`min-h-[44px] min-w-[44px]` or `.touch-target`).
- Thumb Zone: Critical CTAs (e.g., "Confirmar Agendamento", "Avançar") must be sticky at the bottom or within the comfortable thumb reach area.

---

## 4. Network Layer, Multi-Tenancy & Error Handling (RFC 7807)

### 4.1. HTTP Client (`src/lib/api/client.ts`)
- Use a centralized HTTP client instance with `NEXT_PUBLIC_API_URL` (defaulting to `/api/v1`).
- **Authorization Interceptor:**
  - Automatically attach `Authorization: Bearer <token>` from `useAuthStore` when authenticated.
- **Transparent Multi-Tenant Interceptor (ADR-04):**
  - Whenever the request path matches administrative routes (`/(admin)/*` or `/businesses/{id}/*`), the interceptor MUST automatically inject:
    ```http
    X-Business-Id: <activeBusinessId>
    ```
  - Read `activeBusinessId` directly from `useTenantStore`.
- **Automatic Token Refresh (401 Unauthorized):**
  - Intercept `401 Unauthorized`. If a refresh token exists, call `POST /api/v1/auth/refresh`. If successful, retry the queued request; if refresh fails, wipe the auth store and redirect to `/login`.

### 4.2. RFC 7807 Problem Details & Anti-Overbooking (409 Conflict)
- All backend errors return `application/problem+json`:
  ```json
  {
    "type": "https://perola.cv/errors/slot-already-booked",
    "title": "Horário Indisponível",
    "status": 409,
    "detail": "Este horário acabou de ser ocupado por outro cliente. Por favor, selecione outro horário livre.",
    "instance": "/api/v1/appointments"
  }
  ```
- **The `SlotConflictError` Class:**
  - When `HTTP 409` occurs (`type: slot-already-booked`), map it to a custom typed exception `SlotConflictError`.
- **INVIOLABLE UX RULE FOR CONFLICTS (ADR-05):**
  - **NEVER** wipe form data, reset the wizard, or redirect to the home page upon a 409 error.
  - The UI MUST keep the user's selected details intact, display an informative warning banner, invalidate the slots query (`['slots', ...]`), and highlight the next available free slots for immediate selection.

---

## 5. State Management Invariants

### 5.1. Global Client State (Zustand)
- **`useAuthStore` (`src/stores/auth-store.ts`):**
  - State: `user: UserProfile | null`, `accessToken: string | null`, `refreshToken: string | null`, `isAuthenticated: boolean`.
  - Persisted in `localStorage` or secure cookie for session continuity.
- **`useTenantStore` (`src/stores/tenant-store.ts`):**
  - State: `activeBusinessId: string | null`, `businesses: BusinessMembership[]`.
  - Persisted in `localStorage` with cross-tab synchronization (`window.addEventListener('storage', ...)`).
  - Actions: `setActiveBusinessId(id: string)` with active query invalidation.

### 5.2. Server State (TanStack Query v5)
- Standard Query Keys:
  - `['marketplace', 'services', filters]`
  - `['marketplace', 'businesses', filters]`
  - `['slots', { serviceId, employeeId, date }]`
  - `['appointments', { businessId, date, status }]`
  - `['my-bookings', { page, size }]`
- **Cache Invalidation & Stale Times:**
  - General listings: `staleTime: 60_000` (1 minute).
  - Real-time Slots: `staleTime: 10_000` (10 seconds) for freshest anti-overbooking availability.
  - Mutations MUST surgically invalidate related queries on `onSuccess` (e.g., booking mutation invalidates `['slots']` and `['my-bookings']`).

### 5.3. Forms & Validation (React Hook Form + Zod)
- Every form MUST have an explicit Zod schema in `src/lib/validations/` mirroring the backend DTO requirements.
- Use `@hookform/resolvers/zod`.
- Error messages must be displayed inline beneath fields in Portuguese.

---

## 6. Cape Verde Regional Localization Standards (ADR-02)

1. **Currency:** Escudo Cabo-verdiano (`CVE`). Format visually using the helper `formatCurrency(val)` (e.g., `1.500 CVE` or `1.500$00`). No foreign currencies supported in the MVP.
2. **Timezone:** Immutable `Atlantic/Cape_Verde` (UTC-1 constant, no daylight saving time).
   - Absolute timestamps from API arrive in UTC ISO-8601; always render in local Cape Verde time using `date-fns` or native `Intl.DateTimeFormat`.
3. **Phone Numbers:** Strict validation for Cape Verde numbers:
   - Fixed national dial code `+238`.
   - 7-digit mobile pattern starting with valid prefixes (e.g., 9, 5, 3).
4. **Geography:** Hierarchical dropdowns:
   - **Islands (Ilhas):** Santiago, São Vicente, Sal, Boa Vista, Santo Antão, Fogo, São Nicolau, Maio, Brava.
   - **Municipalities (Concelhos):** Praia, Mindelo, Santa Maria, Espargos, etc.

---

## 7. Component Architecture & UI Primitives

```
src/
├── components/
│   ├── ui/                   # Primitive shadcn/ui components (button, card, dialog, sheet, etc.)
│   ├── common/               # Shared cross-domain widgets (TenantBar, MobileBottomNav, EmptyState)
│   ├── marketplace/          # ServiceCard, SearchFilters, CategoryPills
│   ├── booking/              # BookingWizard, SlotPicker, DateCarousel, ConflictAlert
│   ├── admin/                # DailyTimeline, StaffList, MonthlyScheduleModal, WorkingHoursForm
│   └── customer/             # AppointmentCard, RescheduleModal, ReviewDialog
├── lib/
│   ├── api/                  # client.ts, endpoints, error-handler
│   ├── validations/          # Zod schemas (auth, booking, business, schedule)
│   └── utils.ts              # cn helper, formatCurrency, formatDate
├── stores/                   # auth-store.ts, tenant-store.ts
└── types/                    # api.ts, domain.ts, booking.ts, auth.ts
```

### Component Guidelines
- **Strict Typing:** Never use `any`. Define strong TypeScript interfaces for all props and data payloads.
- **Accessibility (WCAG 2.1 AA):** All buttons and interactive triggers must have accessible labels (`aria-label` where text is not visible). Contrast ratio must exceed 4.5:1 for normal text.
- **The 5 UI States:** Every data-fetching screen must explicitly handle the 5 UI states:
  1. *Ideal State* (loaded data);
  2. *Loading State* (skeleton placeholders);
  3. *Empty State* (actionable feedback and CTA);
  4. *Error State* (retry button and friendly copy);
  5. *Partial State* (pagination/infinite scroll loading indicator).

---

## 8. Build, Verification & Environment Standards

- **Package Manager:** `npm`.
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: Root API URL (e.g., `http://localhost:8080/api/v1`).
  - `.env.example` must document all required variables.
- **Production Build:**
  - Always verify with `npm run build`.
  - Zero hydration errors, zero unresolved imports, zero unhandled invariant errors.

