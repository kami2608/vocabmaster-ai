# Research: Router Refactor and Component Separation

**Date**: 2025-01-27  
**Feature**: Router Refactor and Component Separation

## Research Tasks

### 1. TanStack Router File-Based Routing

**Decision**: Use TanStack Router v1.x with file-based routing convention

**Rationale**:

- TanStack Router is a modern, type-safe routing solution for React
- File-based routing provides automatic route generation from file structure
- Bundle size is ~8KB gzipped, well within the <10KB constraint
- Excellent TypeScript support with full type safety
- Built-in support for route loaders, search params, and nested layouts
- Active development and strong community support
- Works seamlessly with Vite (already in use)

**Alternatives Considered**:

- **React Router v6**: More established but larger bundle size (~12KB), requires manual route configuration
- **Wouter**: Very lightweight (~1KB) but lacks file-based routing and advanced features
- **Reach Router**: Deprecated, merged into React Router

**Implementation Notes**:

- Install: `@tanstack/react-router` and `@tanstack/router-devtools` (dev)
- File-based routes convention: `routes/` directory with route files
- Root route: `routes/__root.tsx` for layout wrapper
- Index route: `routes/index.tsx` for default route (redirects to /dashboard)
- Catch-all: `routes/$.tsx` for 404 handling
- Route files export a component and optional route configuration

### 2. Component Extraction Strategy

**Decision**: Extract pages and sidebar into separate components, extract state management into custom hooks

**Rationale**:

- Follows single responsibility principle
- Enables code reuse and easier maintenance
- Aligns with React best practices
- Makes components testable (if needed in future)
- Reduces App.tsx from 322 lines to minimal router setup

**Extraction Plan**:

1. **Sidebar Component** (`components/Sidebar.tsx`):
   - Extract sidebar JSX (lines 99-141 from App.tsx)
   - Accept navigation handler as prop or use router's `useNavigate`
   - Extract logo/brand section
   - Extract navigation buttons
   - Extract "Add New Word" button

2. **Page Components**:
   - **DashboardPage** (`pages/DashboardPage.tsx` or `routes/dashboard.tsx`):
     - Extract dashboard view JSX (lines 148-204)
     - Accept cards and handlers as props
     - Extract stats calculation logic
   - **StudyPage** (`pages/StudyPage.tsx` or `routes/study.tsx`):
     - Extract study view JSX (lines 275-297)
     - Handle study session state
     - Extract study queue logic
   - **ManagePage** (`pages/ManagePage.tsx` or `routes/manage.tsx`):
     - Extract manage view JSX (lines 208-271)
     - Extract search functionality
     - Extract card list rendering
   - **PracticePage** (`pages/PracticePage.tsx` or `routes/practice.tsx`):
     - Extract practice view JSX (lines 301-307)
     - Minimal extraction (already uses QuizView component)

3. **State Management Hooks**:
   - **useFlashcards** (`hooks/useFlashcards.ts`):
     - Extract flashcard state management
     - Handle localStorage persistence
     - Provide add/delete/update operations
   - **useStudySession** (`hooks/useStudySession.ts`):
     - Extract study session state
     - Handle study queue generation
     - Manage current card index
     - Preserve state across navigation

**Alternatives Considered**:

- **Context API**: Considered for global state, but hooks provide better encapsulation
- **State management library (Zustand/Redux)**: Overkill for this application size
- **Props drilling**: Would work but hooks provide cleaner API

### 3. State Preservation During Navigation

**Decision**: Use React state with localStorage persistence, preserve study session in component state

**Rationale**:

- Existing storageService already handles localStorage
- Study session state can be preserved in a context or hook
- Browser back/forward naturally preserves React state within session
- No need for complex state management library

**Implementation Approach**:

- Flashcard data: Already persisted via `useEffect` in App.tsx, will move to `useFlashcards` hook
- Study session: Store in React state, optionally persist to sessionStorage for page refresh recovery
- Search term: Local to ManagePage component (doesn't need persistence)
- Modal state: Local to component using it

### 4. Route Structure and Navigation

**Decision**: Use TanStack Router file-based routes with following structure:

- `/` → redirects to `/dashboard`
- `/dashboard` → Dashboard page
- `/study` → Study page (requires active session or redirects)
- `/manage` → Manage/Word List page
- `/practice` → Practice/Quiz page
- `/*` → 404 page

**Rationale**:

- Matches existing ViewMode types
- Clear, semantic URLs
- Supports deep linking
- Browser history works automatically

**Navigation Implementation**:

- Sidebar uses `Link` components from TanStack Router
- Programmatic navigation via `useNavigate()` hook
- Route guards for /study and /practice (check for active session/data)

### 5. 404 Page Implementation

**Decision**: Create a dedicated 404 page component with navigation options

**Rationale**:

- Clarified in spec: Show 404 page with navigation options
- Provides better UX than redirect
- Allows users to navigate back to valid pages

**Implementation**:

- Create `routes/$.tsx` as catch-all route
- Display friendly 404 message
- Include links to main pages (dashboard, manage)
- Maintain existing design system (indigo/slate colors)

### 6. Deep Linking and Route Guards

**Decision**: Implement route loaders/guards to check for required data before rendering

**Rationale**:

- Spec requires redirecting /study and /practice if no active session
- TanStack Router provides `beforeLoad` and `loader` options
- Can check state and redirect before component renders

**Implementation**:

- Use route `beforeLoad` function to check study session state
- Redirect to /dashboard with message if session not available
- Use router's `redirect` utility for clean redirects
- Pass redirect reason via search params or state

## Key Findings

1. **TanStack Router Setup**:
   - Requires router instance creation in `index.tsx`
   - File-based routes automatically discovered from `routes/` directory
   - Route files export default component and optional route config
   - Root route (`__root.tsx`) wraps all routes with layout

2. **Component Organization**:
   - Can co-locate page components with routes or separate into `pages/` directory
   - Sidebar should be in `components/` for reuse
   - Hooks in `hooks/` directory for state management

3. **State Management**:
   - Custom hooks provide clean API for state management
   - localStorage persistence via existing storageService
   - Study session state can be in React state (preserved during navigation)

4. **Migration Strategy**:
   - Extract components incrementally
   - Test each extraction to ensure no UI changes
   - Update App.tsx last to use router
   - Maintain all existing functionality

## Dependencies to Install

```json
{
  "@tanstack/react-router": "^1.x.x",
  "@tanstack/router-devtools": "^1.x.x" // dev dependency
}
```

## References

- TanStack Router Documentation: https://tanstack.com/router
- File-based Routing Guide: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing
- React Router Migration Guide (for concepts): https://reactrouter.com/en/main
