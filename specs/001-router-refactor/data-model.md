# Data Model: Router Refactor and Component Separation

**Date**: 2025-01-27  
**Feature**: Router Refactor and Component Separation

## Entities

### Page Component

**Description**: Represents a complete view/screen in the application. Each page component encapsulates the UI and logic for a specific view mode.

**Attributes**:

- `component`: React component function
- `route`: URL path (string)
- `layout`: Optional layout wrapper (for shared UI like sidebar)

**Relationships**:

- Each page component is associated with one route
- Pages can share layout components (Sidebar)
- Pages can access shared application state

**State Transitions**:

- Mounted when route is accessed
- Unmounted when navigating away (state preserved via hooks/context)
- Re-mounted when returning to route

**Validation Rules**:

- Route must be unique
- Component must be a valid React component
- Route paths must match ViewMode types: `/dashboard`, `/study`, `/manage`, `/practice`

### Navigation State

**Description**: Represents the current route/URL location in the application. This state determines which page component should be rendered.

**Attributes**:

- `currentPath`: Current URL path (string)
- `searchParams`: URL search parameters (object)
- `history`: Browser history stack (managed by router)

**Relationships**:

- One-to-one with currently rendered Page Component
- Managed by TanStack Router

**State Transitions**:

- Updated when user navigates (via Link or programmatic navigation)
- Updated when browser back/forward buttons are used
- Preserved across page refreshes (via URL)

**Validation Rules**:

- Path must be a valid route or redirect to valid route
- Invalid paths trigger 404 page

### Application State

**Description**: Represents the shared application data that persists across page navigation.

**Attributes**:

- `flashcards`: Array of Flashcard objects
- `studySession`: Study session state (optional)
  - `queue`: Array of Flashcard IDs in study queue
  - `currentIndex`: Current card index in queue (number)
  - `startedAt`: Timestamp when session started (number)

**Relationships**:

- Accessed by all page components via hooks/context
- Persisted to localStorage (flashcards)
- Preserved in React state during navigation (study session)

**State Transitions**:

- Flashcards: Updated when cards are added/deleted/modified
- Study Session: Created when study starts, preserved during navigation, cleared when session completes

**Validation Rules**:

- Flashcards array must be valid Flashcard[] type
- Study session queue must contain valid Flashcard IDs
- Current index must be within queue bounds

### Sidebar Component

**Description**: Reusable navigation component displayed on all pages.

**Attributes**:

- `currentRoute`: Currently active route (for highlighting)
- `navigationItems`: Array of navigation items with icons and labels

**Relationships**:

- Used by Root Layout component
- Provides navigation to all page routes

**State Transitions**:

- Active route highlight updates when route changes
- Navigation items remain constant

**Validation Rules**:

- Must render on all routes (via root layout)
- Active route must match current URL path

## State Management Architecture

### useFlashcards Hook

**Purpose**: Manage flashcard data and persistence

**State**:

- `cards`: Flashcard[] - Array of all flashcards
- `loading`: boolean - Loading state (if needed)

**Operations**:

- `addCard(card: Flashcard)`: Add new flashcard
- `deleteCard(id: string)`: Delete flashcard by ID
- `updateCard(id: string, updates: Partial<Flashcard>)`: Update flashcard
- `getCard(id: string)`: Get flashcard by ID

**Persistence**:

- Automatically saves to localStorage on changes
- Loads from localStorage on initialization

### useStudySession Hook

**Purpose**: Manage study session state

**State**:

- `queue`: Flashcard[] - Current study queue
- `currentIndex`: number - Current card index
- `isActive`: boolean - Whether session is active

**Operations**:

- `startSession(cards: Flashcard[])`: Start new study session
- `nextCard()`: Move to next card
- `updateCardStatus(id: string, success: boolean)`: Update card status after review
- `endSession()`: End current session
- `resumeSession()`: Resume existing session (if available)

**Persistence**:

- Stored in React state (preserved during navigation)
- Optionally persisted to sessionStorage for page refresh recovery

## Route Configuration

### Route Definitions

| Route     | Path         | Component     | Requires Session | Redirects To                 |
| --------- | ------------ | ------------- | ---------------- | ---------------------------- |
| Index     | `/`          | IndexRoute    | No               | `/dashboard`                 |
| Dashboard | `/dashboard` | DashboardPage | No               | -                            |
| Study     | `/study`     | StudyPage     | Yes              | `/dashboard` (if no session) |
| Manage    | `/manage`    | ManagePage    | No               | -                            |
| Practice  | `/practice`  | PracticePage  | Yes              | `/dashboard` (if no session) |
| 404       | `/*`         | NotFoundPage  | No               | -                            |

### Route Guards

**Study Route Guard**:

- Check if study session exists and is active
- If not, redirect to `/dashboard` with message
- Message: "Please start a study session first"

**Practice Route Guard**:

- Check if minimum 4 cards exist
- If not, redirect to `/dashboard` with message
- Message: "You need at least 4 cards to practice"

## Data Flow

1. **Application Initialization**:
   - Load flashcards from localStorage
   - Initialize router
   - Render root layout with sidebar

2. **Navigation Flow**:
   - User clicks navigation link or programmatic navigation
   - Router updates URL
   - Route guard checks (if applicable)
   - Page component mounts with current state
   - Sidebar updates active route highlight

3. **State Updates**:
   - User actions update state via hooks
   - State changes trigger re-renders
   - Persistence happens automatically (localStorage for flashcards)

4. **Study Session Flow**:
   - User starts study from dashboard
   - Study session created and stored in state
   - Navigate to /study route
   - Study page uses session state
   - Navigation away preserves session
   - Return to /study resumes session
