# Quickstart: Router Refactor and Component Separation

**Date**: 2025-01-27  
**Feature**: Router Refactor and Component Separation

## Overview

This feature refactors the VocabMaster AI application to use TanStack Router with file-based routing and extracts page components from the monolithic App.tsx file. The application maintains identical UI/UX while gaining proper URL-based navigation, browser history support, and improved code organization.

## Architecture

### Route Structure

```
/                    → Redirects to /dashboard
/dashboard          → Dashboard page (stats, charts, quick actions)
/study              → Study session page (requires active session)
/manage             → Word list management page
/practice           → Quiz practice page (requires 4+ cards)
/*                  → 404 Not Found page
```

### Component Organization

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout (sidebar + outlet)
│   ├── index.tsx        # Default route (redirect)
│   ├── dashboard.tsx    # Dashboard page
│   ├── study.tsx        # Study page
│   ├── manage.tsx       # Manage page
│   ├── practice.tsx     # Practice page
│   └── $.tsx            # 404 catch-all
├── components/          # UI components
│   ├── Sidebar.tsx      # Navigation sidebar (NEW)
│   └── [existing components]
├── hooks/              # Custom hooks (NEW)
│   ├── useFlashcards.ts # Flashcard state management
│   └── useStudySession.ts # Study session state
└── App.tsx             # Router setup (simplified)
```

## Key Concepts

### File-Based Routing

TanStack Router automatically discovers routes from the `routes/` directory:

- `__root.tsx`: Root route that wraps all pages with layout
- `index.tsx`: Default route (handles `/`)
- `dashboard.tsx`: Dashboard page route
- `study.tsx`: Study page route
- `$.tsx`: Catch-all route for 404

### State Management

**Flashcards**: Managed via `useFlashcards` hook

- Automatically persists to localStorage
- Provides add/delete/update operations
- Accessible from any component

**Study Session**: Managed via `useStudySession` hook

- Preserved during navigation
- Resumable when returning to /study
- Cleared when session completes

### Navigation

**Programmatic Navigation**:

```typescript
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/dashboard' });
```

**Link Components**:

```typescript
import { Link } from '@tanstack/react-router'

<Link to="/dashboard">Dashboard</Link>
```

**Route Guards**:

- `/study` and `/practice` routes check for required data
- Redirect to `/dashboard` with message if requirements not met

## Development Workflow

### Adding a New Route

1. Create route file in `routes/` directory:

   ```typescript
   // routes/new-page.tsx
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/new-page')({
     component: NewPage,
   })

   function NewPage() {
     return <div>New Page</div>
   }
   ```

2. Add navigation link to Sidebar component if needed

3. Router automatically discovers and registers the route

### Extracting a Component

1. Identify reusable UI/logic in a page component
2. Extract to `components/` directory
3. Update imports in page component
4. Ensure no UI changes (visual regression check)

### Modifying State Management

1. Update hook in `hooks/` directory
2. Ensure persistence logic remains intact
3. Update components using the hook if API changes

## Common Tasks

### Accessing Current Route

```typescript
import { useRouterState } from '@tanstack/react-router';

const router = useRouterState();
const currentPath = router.location.pathname;
```

### Checking Route Parameters

```typescript
import { useParams } from '@tanstack/react-router';

const params = useParams({ from: '/study' });
```

### Redirecting Programmatically

```typescript
import { redirect } from '@tanstack/react-router';

// In route guard
if (!hasSession) {
  throw redirect({ to: '/dashboard', search: { message: 'Start session first' } });
}
```

### Preserving State During Navigation

State is automatically preserved in React state. For study sessions:

- State lives in `useStudySession` hook
- Persists during navigation
- Clears only when session ends or component unmounts

## Testing Navigation

1. **URL Navigation**: Direct URL access should work for all routes
2. **Browser History**: Back/forward buttons should navigate correctly
3. **Deep Linking**: Sharing URLs should work
4. **Route Guards**: Invalid access should redirect appropriately
5. **State Preservation**: Navigation should not lose application state

## Troubleshooting

### Route Not Found

- Check file name matches route path
- Ensure route is exported correctly
- Verify router is configured in `index.tsx`

### State Not Preserving

- Check if state is in React state (preserved) vs component state (may reset)
- Verify hooks are used correctly
- Check localStorage persistence for flashcards

### Navigation Not Working

- Verify Link components use `to` prop correctly
- Check programmatic navigation uses `navigate()` correctly
- Ensure router is properly initialized in `index.tsx`

## Migration Notes

- All existing functionality preserved
- UI/UX identical to previous implementation
- State management moved to hooks for better organization
- Sidebar extracted for reuse
- Routes match previous ViewMode types
