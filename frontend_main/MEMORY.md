# Narrative Main Application - Progress & Memory

This document tracks the ongoing development, architectural decisions, and integration status of the Narrative platform's frontend main application.

## 🚀 Progress Made

### 1. Project Scaffolding
- **Stack**: Vite, React, TypeScript, TailwindCSS v4.
- **Design System**: Synced with the landing page (`frontend_app`). Copied `index.css`, utility classes, fonts (Manrope, Space Grotesk, IBM Plex Mono), and animations (GSAP, Lenis).
- **Core Dependencies**: Installed `react-router-dom`, `@tanstack/react-query`, `firebase`, `axios`, `lucide-react`, `react-hot-toast`.

### 2. Foundational Architecture
- **Routing**: Set up `AppLayout.tsx` providing a persistent sidebar navigation and a top bar. Configured base routes (`/`, `/compiler`, `/portfolio`, `/logs`, `/settings`, `/onboarding`, `/auth`).
- **Auth Layer**: Configured `firebase.ts` and `AuthProvider.tsx`. Created an Axios interceptor (`api.ts`) to attach the Firebase Bearer token dynamically on every `/api/*` request. Also built the Firebase Login/Signup UI in `Auth.tsx`.
- **Global State / Data Fetching**: Initialized TanStack Query client with 5-minute stale times.

### 3. API Integrations (Hooks Created)
Based directly on `backend_api.md`, the following API layers are fully mapped and typed:
- **Compiler (`useCompiler.ts`)**: 
  - `useCreateCompilerThread`, `useCompilerThread`, `useSendMessage`, `useApproveThread`.
  - Maps to `/api/compiler/threads/*`. 
  - Completed Compiler UI: Built the Chat interface handling `AWAITING_APPROVAL` and `COMPILED` states.
- **Workspace (`useWorkspace.ts`)**: 
  - `useWorkspace`, `useWorkspaceFile`, `useBootstrapWorkspace`.
  - Maps to `/api/workspaces/*` and `/api/narratives/*/workspace`.
- **Orchestrator (`useOrchestrator.ts`)**: 
  - `useOrchestratorStatus` (with dynamic 15s/60s polling), `useRunOrchestrator`, `usePauseOrchestrator`, `useResumeOrchestrator`.
  - Implements Optimistic UI for Pause/Resume.

---

## ⏳ To Do: UI & Remaining Integrations

### 1. Dashboard UI (`/`)
- Display high-level stats extracted from the workspace (Total Value, Active Positions).
- Integrate **Orchestrator Controls**: Connect `useOrchestratorStatus` to a Play/Pause button and an indicator showing `Live` or `Paper` mode.
- Render the current execution plan preview.

### 2. Portfolio UI (`/portfolio`)
- Utilize `useWorkspaceFile('portfolio')` to fetch `portfolio.json`.
- Render a data-dense, visually premium table of positions, allocations, and current balances.
- Handle the NGN 100x currency multiplier if `base_currency === 'NGN'`.

### 3. Logs UI (`/logs`)
- Poll `useWorkspaceFile('logs')`.
- Parse the JSON log stream.
- Render an architectural, color-coded terminal timeline grouped by actor (`researcher`, `pm`, `executor`).

### 4. Bayse Onboarding & Settings UI
- **Integrations to build**:
  - `POST /api/bayse/accounts/connect`
  - `GET /api/bayse/accounts/me`
  - `POST /api/bayse/accounts/me/api-keys`
- Build the `Onboarding.tsx` wizard to capture email/password for Bayse.
- Build the `Settings.tsx` to list, create, and rotate API keys (rendering `public_key_preview`).

---
*End of current memory checkpoint.*
