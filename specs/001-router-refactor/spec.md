# Feature Specification: Router Refactor and Component Separation

**Feature Branch**: `001-router-refactor`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "dự án hiện tại chưa có phần navigate giữa các page khác nhau, giao diện chung đang viết vào hết trong 1 file App.tsx, tôi cần tách nó ra thành các component nhỏ, các page khác nhau trong ứng dụng với từng viewmode khác nhau: dashboard, study, manage, practice. Đồng thời cài đặt router cho ứng dụng để có thể navigate rõ ràng hơn"

## Clarifications

### Session 2025-01-27

- Q: How should the application handle invalid/unknown routes? → A: Show a 404 "Page Not Found" page with navigation options
- Q: How does the application handle navigation during an active study session? → A: Allow navigation away, preserving study session state for later resumption
- Q: What happens when a user uses browser back button during a study session? → A: Exit study mode and navigate to the previous page (standard browser behavior)
- Q: How does the application handle deep linking to study or practice views that require specific data? → A: Redirect to dashboard with a message indicating they need to start a session first

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Component Refactoring (Priority: P1)

Users need the application codebase to be organized into smaller, reusable components and separate page components. Currently, all UI logic is contained in a single App.tsx file, making the code difficult to maintain, understand, and extend. Users (developers) need to be able to work with well-organized, modular components that follow single responsibility principles.

**Why this priority**: This is foundational - without proper component structure, adding new features becomes increasingly difficult. It enables better code reuse, easier maintenance, and aligns with modern React best practices. This must be completed before router implementation to ensure clean separation of concerns.

**Independent Test**: Can be fully tested by verifying that all existing functionality (dashboard view, study view, manage view, practice view) continues to work identically after refactoring. The application should render and behave exactly as before, with no visible changes to end users.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** a user views the dashboard, **Then** all dashboard functionality (stats, charts, action buttons) works identically to the current implementation
2. **Given** the application is running, **When** a user navigates to the study view, **Then** flashcard study functionality works identically to the current implementation
3. **Given** the application is running, **When** a user navigates to the manage view, **Then** word list and search functionality works identically to the current implementation
4. **Given** the application is running, **When** a user navigates to the practice view, **Then** quiz functionality works identically to the current implementation
5. **Given** the application codebase, **When** examining the component structure, **Then** each view mode (dashboard, study, manage, practice) is in its own page component file
6. **Given** the application codebase, **When** examining shared UI elements, **Then** the sidebar navigation is extracted into a reusable component
7. **Given** the application codebase, **When** examining component organization, **Then** components follow single responsibility principle and are placed in appropriate directories

---

### User Story 2 - Router Setup and Navigation (Priority: P2)

Users need to navigate between different pages in the application using URL-based routing. Currently, navigation is handled through state management, which doesn't provide clear URLs, browser history support, or the ability to bookmark or share specific pages. Users need to be able to navigate using URLs that reflect the current page, use browser back/forward buttons, and share links to specific views.

**Why this priority**: Router implementation depends on having separate page components (from User Story 1). Once components are separated, adding routing provides better user experience through URL-based navigation, browser history support, and shareable links.

**Independent Test**: Can be fully tested by navigating between pages and verifying that URLs change appropriately, browser back/forward buttons work, and direct URL access to each page renders the correct view. All navigation should work seamlessly without losing application state.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** a user clicks on the Dashboard navigation item, **Then** the URL updates to reflect the dashboard route and the dashboard page is displayed
2. **Given** the application is running, **When** a user clicks on the Practice navigation item, **Then** the URL updates to reflect the practice route and the practice page is displayed
3. **Given** the application is running, **When** a user clicks on the Word List navigation item, **Then** the URL updates to reflect the manage route and the manage page is displayed
4. **Given** the application is running, **When** a user starts a study session, **Then** the URL updates to reflect the study route and the study page is displayed
5. **Given** a user is on a specific page, **When** they click the browser back button, **Then** they navigate to the previous page they visited
6. **Given** a user has a direct URL to a page that requires data (e.g., /study or /practice without an active session), **When** they access that URL directly, **Then** they are redirected to the dashboard with a message indicating they need to start a session first
7. **Given** the application is running, **When** a user shares a URL to a specific page, **Then** another user accessing that URL sees the same page view
8. **Given** a user navigates to an invalid/unknown route (e.g., /invalid-page), **When** the route is accessed, **Then** a 404 "Page Not Found" page is displayed with navigation options to return to valid pages
9. **Given** a user is in an active study session, **When** they navigate away to another page (e.g., via sidebar), **Then** the study session state is preserved and they can resume from the same card position when returning to /study
10. **Given** a user is in an active study session, **When** they click the browser back button, **Then** they exit study mode and navigate to the previous page they visited (standard browser behavior)
11. **Given** a user directly accesses /study or /practice via URL without an active session, **When** the page loads, **Then** they are redirected to /dashboard with a message indicating they need to start a session first

### Edge Cases

- Invalid/unknown routes display a 404 "Page Not Found" page with navigation options (clarified)
- Navigation during active study session preserves session state for resumption (clarified)
- Browser back button during study session exits study mode and navigates to previous page (clarified)
- Deep linking to study/practice views without active session redirects to dashboard with message (clarified)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST extract the dashboard view logic from App.tsx into a separate Dashboard page component
- **FR-002**: System MUST extract the study view logic from App.tsx into a separate Study page component
- **FR-003**: System MUST extract the manage view logic from App.tsx into a separate Manage page component
- **FR-004**: System MUST extract the practice view logic from App.tsx into a separate Practice page component
- **FR-005**: System MUST extract the sidebar navigation UI from App.tsx into a reusable Sidebar component
- **FR-006**: System MUST maintain all existing functionality after component extraction (no feature regression)
- **FR-007**: System MUST install and configure a lightweight routing library suitable for React applications
- **FR-008**: System MUST set up route definitions for all four view modes: /dashboard, /study, /manage, /practice
- **FR-009**: System MUST update the URL when users navigate between pages
- **FR-010**: System MUST support browser back and forward button navigation
- **FR-011**: System MUST allow direct URL access to any page (deep linking)
- **FR-012**: System MUST preserve application state (flashcard data, study session state) during navigation
- **FR-013**: System MUST maintain the existing visual design and user experience (no UI changes)
- **FR-014**: System MUST organize components following the project's component architecture principles (smallest logical units, single responsibility)
- **FR-015**: System MUST place page components in an appropriate directory structure (e.g., pages/ or views/)
- **FR-016**: System MUST display a 404 "Page Not Found" page with navigation options when users access invalid/unknown routes
- **FR-017**: System MUST preserve study session state (current card index, study queue) when users navigate away from the study page, allowing resumption upon return
- **FR-018**: System MUST redirect users to /dashboard with a message when they directly access /study or /practice URLs without an active session or required data

### Key Entities _(include if feature involves data)_

- **Page Component**: Represents a complete view/screen in the application (Dashboard, Study, Manage, Practice). Each page component encapsulates the UI and logic for a specific view mode.
- **Navigation State**: Represents the current route/URL location in the application. This state determines which page component should be rendered.
- **Application State**: Represents the shared application data (flashcards, study queue, search terms) that persists across page navigation.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All four view modes (dashboard, study, manage, practice) function identically to the current implementation with no visible changes to end users
- **SC-002**: Navigation between pages updates the URL immediately (within 100ms of user interaction)
- **SC-003**: Browser back and forward buttons work correctly for all navigation paths (100% of navigation actions are reversible)
- **SC-004**: Direct URL access to any page (/dashboard, /study, /manage, /practice) successfully renders the correct page
- **SC-005**: Component structure follows single responsibility principle with no component exceeding 300 lines of code
- **SC-006**: All shared UI elements (sidebar, modals) are extracted into reusable components with zero code duplication
- **SC-007**: Application bundle size increase from router library is less than 10KB (gzipped)
- **SC-008**: Page navigation completes without any visual flicker or loading delays (maintains current performance)
