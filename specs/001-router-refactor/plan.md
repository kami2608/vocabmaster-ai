# Implementation Plan: Router Refactor and Component Separation

**Branch**: `001-router-refactor` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-router-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the VocabMaster AI application to extract page components from App.tsx and implement TanStack Router with file-based routing. The application currently uses state-based view switching; this feature will migrate to URL-based routing while maintaining identical UI/UX. All four view modes (dashboard, study, manage, practice) will be extracted into separate page components, and the sidebar navigation will be extracted into a reusable component. TanStack Router will be configured with file-based routing to enable proper URL navigation, browser history support, and deep linking.

## Technical Context

**Language/Version**: TypeScript 5.8.2, React 19.2.3  
**Primary Dependencies**: React 19.2.3, React DOM 19.2.3, TanStack Router (to be installed the latest version), Vite 6.2.0, Tailwind CSS 4.1.18, lucide-react 0.562.0  
**Storage**: Browser localStorage (via existing storageService)  
**Testing**: Not applicable (testing excluded per constitution)  
**Target Platform**: Web browser (modern browsers supporting ES modules)  
**Project Type**: Single-page web application  
**Performance Goals**: Navigation updates URL within 100ms, no visual flicker during page transitions, bundle size increase <10KB gzipped  
**Constraints**: Must maintain existing UI/UX exactly, preserve all application state during navigation, support browser back/forward buttons  
**Scale/Scope**: 4 main pages, 1 shared sidebar component, existing component library (4 components), state management for flashcards and study sessions

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Modern UI/UX Design**: ✅ PASS - No UI changes required. All existing components and styling will be preserved. New page components will use identical styling from App.tsx.

**Lightweight Technology Stack**: ✅ PASS - TanStack Router is a modern, lightweight routing solution (~8KB gzipped). It's designed for React and provides file-based routing which aligns with modern React patterns. Bundle size impact is within the <10KB constraint.

**Code Quality & Formatting**: ✅ PASS - Prettier is already configured. All new code will follow TypeScript conventions, use proper type annotations, and maintain consistent naming. Code will be formatted before commit.

**Component Architecture**: ✅ PASS - Components will be divided into smallest logical units:

- Sidebar extracted as separate component
- Each view mode (dashboard, study, manage, practice) becomes its own page component
- Shared logic (state management) will be extracted into hooks or context
- Components will follow single responsibility principle

**Code Reusability**: ✅ PASS - Sidebar component will be reusable across all pages. State management logic will be extracted to avoid duplication. Shared UI patterns will be identified and extracted.

**Testing Policy**: ✅ PASS - No testing infrastructure will be added. Focus is on feature implementation and UI/UX preservation.

## Project Structure

### Documentation (this feature)

```text
specs/001-router-refactor/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - Not applicable for this frontend-only refactor
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root route with layout (sidebar + outlet)
│   ├── index.tsx        # Default route (redirects to /dashboard)
│   ├── dashboard.tsx    # Dashboard page component
│   ├── study.tsx        # Study page component
│   ├── manage.tsx       # Manage/Word List page component
│   ├── practice.tsx     # Practice/Quiz page component
│   └── $.tsx            # 404 catch-all route
├── components/         # Existing UI components (unchanged)
│   ├── AddCardModal.tsx
│   ├── FlashcardView.tsx
│   ├── QuizView.tsx
│   ├── StatsChart.tsx
│   └── Sidebar.tsx      # NEW: Extracted sidebar component
├── pages/              # NEW: Page components (alternative organization)
│   ├── DashboardPage.tsx
│   ├── StudyPage.tsx
│   ├── ManagePage.tsx
│   └── PracticePage.tsx
├── hooks/              # NEW: Custom hooks for state management
│   ├── useFlashcards.ts # Flashcard state management
│   └── useStudySession.ts # Study session state management
├── context/            # NEW: React context for shared state (if needed)
│   └── AppContext.tsx  # Application-wide state context
├── services/           # Existing services (unchanged)
│   ├── geminiService.ts
│   └── storageService.ts
├── types.ts            # Existing types (unchanged)
├── App.tsx             # MODIFIED: Simplified to router setup only
└── index.tsx           # MODIFIED: Router provider setup
```

**Structure Decision**: Using TanStack Router's file-based routing convention with `routes/` directory. Page components can be co-located with routes or in a separate `pages/` directory. State management will be extracted into custom hooks (`hooks/`) to maintain reusability. The sidebar component will be extracted to `components/Sidebar.tsx` for reuse across all routes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All architectural decisions align with constitution principles.
