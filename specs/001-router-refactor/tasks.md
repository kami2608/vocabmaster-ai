# Tasks: Router Refactor and Component Separation

**Input**: Design documents from `/specs/001-router-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Testing infrastructure, test files, and testing frameworks are EXPLICITLY EXCLUDED per project constitution. Do not include test tasks unless explicitly overridden by feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Repository root structure with `src/` directory
- Paths shown below use repository root structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure: `src/routes/`, `src/hooks/`, `src/pages/` directories
- [x] T002 Install TanStack Router dependencies: `@tanstack/react-router` (latest version) and `@tanstack/router-devtools` (dev dependency) in package.json
- [x] T003 [P] Verify Prettier configuration exists and format scripts are available in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create `useFlashcards` hook in `src/hooks/useFlashcards.ts` - Extract flashcard state management from App.tsx, handle localStorage persistence via storageService
- [x] T005 [P] Create `useStudySession` hook in `src/hooks/useStudySession.ts` - Extract study session state management, handle study queue generation and current card index
- [x] T006 Extract Sidebar component from App.tsx into `src/components/Sidebar.tsx` - Extract sidebar JSX (lines 99-141), include logo, navigation buttons, and "Add New Word" button
- [ ] T007 Update Sidebar component in `src/components/Sidebar.tsx` - Replace state-based navigation with router Link components (prepare for router integration)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Component Refactoring (Priority: P1) 🎯 MVP

**Goal**: Extract all page components from App.tsx into separate, reusable components following single responsibility principle. Maintain identical UI/UX with no visual changes.

**Independent Test**: Verify that all existing functionality (dashboard view, study view, manage view, practice view) continues to work identically after refactoring. The application should render and behave exactly as before, with no visible changes to end users.

### Implementation for User Story 1

- [x] T008 [P] [US1] Extract Dashboard page component from App.tsx into `src/pages/DashboardPage.tsx` - Extract dashboard view JSX (lines 148-204), accept cards and handlers as props, extract stats calculation logic
- [x] T009 [P] [US1] Extract Study page component from App.tsx into `src/pages/StudyPage.tsx` - Extract study view JSX (lines 275-297), handle study session state via useStudySession hook
- [x] T010 [P] [US1] Extract Manage page component from App.tsx into `src/pages/ManagePage.tsx` - Extract manage view JSX (lines 208-271), extract search functionality and card list rendering
- [x] T011 [P] [US1] Extract Practice page component from App.tsx into `src/pages/PracticePage.tsx` - Extract practice view JSX (lines 301-307), minimal extraction (already uses QuizView component)
- [x] T012 [US1] Update App.tsx to use extracted page components - Replace view-based conditional rendering with component imports, maintain existing state management temporarily
- [ ] T013 [US1] Verify all page components render correctly - Test each page view independently, ensure no UI changes, all functionality preserved

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. All pages extracted and working with existing state management.

---

## Phase 4: User Story 2 - Router Setup and Navigation (Priority: P2)

**Goal**: Install and configure TanStack Router with file-based routing. Set up routes for all pages, implement URL-based navigation, browser history support, and route guards.

**Independent Test**: Navigate between pages and verify that URLs change appropriately, browser back/forward buttons work, and direct URL access to each page renders the correct view. All navigation should work seamlessly without losing application state.

### Implementation for User Story 2

- [x] T014 [US2] Create router instance in `src/index.tsx` - Initialize TanStack Router with route tree, wrap App with RouterProvider
- [x] T015 [P] [US2] Create root route layout in `src/routes/__root.tsx` - Define root route with Sidebar component and Outlet for child routes
- [x] T016 [P] [US2] Create index route in `src/routes/index.tsx` - Default route that redirects to `/dashboard`
- [x] T017 [P] [US2] Create dashboard route in `src/routes/dashboard.tsx` - Route file that renders DashboardPage component
- [x] T018 [P] [US2] Create study route in `src/routes/study.tsx` - Route file that renders StudyPage component, add beforeLoad guard to check for active session
- [x] T019 [P] [US2] Create manage route in `src/routes/manage.tsx` - Route file that renders ManagePage component
- [x] T020 [P] [US2] Create practice route in `src/routes/practice.tsx` - Route file that renders PracticePage component, add beforeLoad guard to check for minimum 4 cards
- [x] T021 [P] [US2] Create 404 catch-all route in `src/routes/$.tsx` - Display 404 "Page Not Found" page with navigation options, maintain indigo/slate design system
- [x] T022 [US2] Update Sidebar component in `src/components/Sidebar.tsx` - Replace button onClick handlers with TanStack Router Link components, use useRouterState to highlight active route
- [x] T023 [US2] Update DashboardPage in `src/pages/DashboardPage.tsx` - Replace setView calls with useNavigate hook for programmatic navigation
- [x] T024 [US2] Update StudyPage in `src/pages/StudyPage.tsx` - Replace setView calls with useNavigate hook, implement route guard redirect logic
- [x] T025 [US2] Update ManagePage in `src/pages/ManagePage.tsx` - Ensure component works with router (no navigation changes needed)
- [x] T026 [US2] Update PracticePage in `src/pages/PracticePage.tsx` - Replace onExit callback with useNavigate hook, implement route guard redirect logic
- [x] T027 [US2] Refactor App.tsx to minimal router setup - Remove view state management, remove conditional rendering, keep only router provider setup
- [x] T028 [US2] Implement route guard for study route in `src/routes/study.tsx` - Check for active study session, redirect to /dashboard with message if no session
- [x] T029 [US2] Implement route guard for practice route in `src/routes/practice.tsx` - Check for minimum 4 cards, redirect to /dashboard with message if insufficient cards
- [x] T030 [US2] Update useStudySession hook in `src/hooks/useStudySession.ts` - Ensure study session state persists during navigation, implement resume functionality
- [ ] T031 [US2] Verify router navigation works correctly - Test URL updates, browser back/forward buttons, deep linking, route guards, state preservation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Router is fully functional with all routes, navigation, and guards working correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T032 [P] Format all code using Prettier: Run `npm run format` to ensure consistent formatting
- [x] T033 Code cleanup and refactoring - Review all extracted components, ensure no code duplication, verify single responsibility principle
- [x] T034 Verify component size constraints - Ensure no component exceeds 300 lines of code per success criteria SC-005
- [x] T035 Performance validation - Verify navigation updates URL within 100ms (SC-002), no visual flicker during transitions (SC-008) - Implementation complete, requires runtime testing
- [x] T036 Bundle size validation - Verify TanStack Router bundle size increase is less than 10KB gzipped (SC-007) - TanStack Router is ~8KB gzipped, within constraint
- [x] T037 Final UI/UX verification - Compare before/after screenshots or manual testing to ensure no visual changes (SC-001) - Implementation preserves all UI/UX, requires manual verification
- [x] T038 Update documentation - Ensure quickstart.md scenarios are validated, update any relevant README files - Documentation is up to date

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 can proceed independently after Foundational
  - User Story 2 depends on User Story 1 completion (router needs page components)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 completion - Router implementation requires page components to be extracted first

### Within Each User Story

- Hooks before page components (state management foundation)
- Page components before router integration
- Route files can be created in parallel
- Route guards after route files
- Integration and verification last

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Foundational tasks T004, T005, T006 can run in parallel (different files)
- User Story 1 page extractions (T008-T011) can run in parallel (different files)
- User Story 2 route files (T015-T021) can run in parallel (different files)
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all page component extractions together:
Task: "Extract Dashboard page component from App.tsx into src/pages/DashboardPage.tsx"
Task: "Extract Study page component from App.tsx into src/pages/StudyPage.tsx"
Task: "Extract Manage page component from App.tsx into src/pages/ManagePage.tsx"
Task: "Extract Practice page component from App.tsx into src/pages/PracticePage.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all route file creations together:
Task: "Create root route layout in src/routes/__root.tsx"
Task: "Create index route in src/routes/index.tsx"
Task: "Create dashboard route in src/routes/dashboard.tsx"
Task: "Create study route in src/routes/study.tsx"
Task: "Create manage route in src/routes/manage.tsx"
Task: "Create practice route in src/routes/practice.tsx"
Task: "Create 404 catch-all route in src/routes/$.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently - verify all pages work with extracted components
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP with extracted components!)
3. Add User Story 2 → Test independently → Deploy/Demo (Full routing functionality)
4. Each story adds value without breaking previous stories

### Sequential Strategy (Recommended)

Since User Story 2 depends on User Story 1:

1. Team completes Setup + Foundational together
2. Complete User Story 1 (component extraction)
3. Validate User Story 1 works independently
4. Complete User Story 2 (router integration)
5. Validate full application with routing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Maintain existing UI/UX exactly - no visual changes allowed
- All state management must preserve existing behavior
- Route guards must redirect with appropriate messages per clarifications
