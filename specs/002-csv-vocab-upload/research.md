# Research: CSV Vocabulary Upload

**Date**: 2026-02-03  
**Feature**: CSV Vocabulary Upload (`002-csv-vocab-upload`)

## Research Tasks

### 1. UI library choice (MUI) and design consistency

**Decision**: Use **MUI Material** components for the CSV import page UI, while keeping the overall indigo/slate visual language consistent with the existing app.

**Rationale**:

- MUI is already present in `package.json` (`@mui/material`, `@emotion/*`), so this does not add new heavy dependencies.
- MUI provides high-quality components for file upload affordances, tables, alerts, progress indicators, and buttons, which fits the feature’s UX needs (upload → validate → preview → save).
- The current app uses Tailwind for layout + theming; MUI components can be applied selectively for the import page, with consistent spacing/typography and app-level colors.

**Alternatives Considered**:

- Tailwind-only custom components: feasible but slower to build and easier to regress UX quality for complex interactions (table + status + errors).
- Adding a CSV import component library: rejected to keep bundle size low and avoid unnecessary deps.

### 2. CSV parsing approach (no new dependency)

**Decision**: Implement a **small, focused CSV parser utility** for **comma-delimited** CSVs that supports common quoting rules.

**Rationale**:

- Spec requires delimiter `,`, header required, and max file size 10MB → scope allows a lightweight, purpose-built parser.
- Avoids adding a new parsing dependency (aligns with “Lightweight Technology Stack”).
- We still need correctness for typical CSV edge cases:
  - Quoted fields containing commas
  - Escaped quotes (`""`)
  - Newlines inside quoted fields (best-effort support)

**Alternatives Considered**:

- PapaParse: robust, but introduces a new dependency and increases bundle size.
- Naive `split(',')`: rejected because it breaks quoted values (definitions/examples commonly contain commas).

### 3. Duplicate and validation behavior (clarified in spec)

**Decision**:

- **Skip duplicates**: rows whose `word` already exists for the current user are not imported.
- **Partial import**: import valid, non-duplicate rows; skip invalid rows; display row-level errors and import summary counts.

**Rationale**:

- Prevents database clutter from repeated imports.
- Produces the most user-friendly outcome: users can still save good data even if a few rows are malformed.

### 4. Router and page placement

**Decision**: Add a new TanStack Router file-based route under `src/routes/_app/` and link it from navigation (Sidebar).

**Rationale**:

- Matches existing route organization (`_app` for authenticated layout).
- Keeps route definitions discoverable by the router plugin.

**Alternatives Considered**:

- Putting route under `_auth`: rejected (feature should be available only to authenticated users).

## Key Findings

- MUI is already available, so we can follow user request without violating constitution.
- A small CSV parser is preferable to adding new dependencies given constraints.
- Import workflow requires a clean separation between:
  - **UI** (dropzone/preview/summary)
  - **Validation/parsing** (utilities/services)
  - **Persistence** (bulk insert + prefetch existing words for dedupe)

