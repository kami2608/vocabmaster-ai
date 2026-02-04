# Implementation Plan: CSV Vocabulary Upload

**Branch**: `002-csv-vocab-upload` | **Date**: 2026-02-03 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-csv-vocab-upload/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a new page in VocabMaster AI to bulk-import vocabulary flashcards from a CSV file. The page supports click-to-upload and drag & drop, validates file constraints (0 < size < 10MB, `.csv`), parses a **comma-delimited** CSV with a **required header** (`word, phonetic, definition, example, translation`), previews parsed rows, and saves to the existing `flashcards` storage with the following clarified behaviors:

- Skip rows whose `word` already exists for the current user (duplicate policy)
- Partial import: import valid, non-duplicate rows; skip invalid rows; show an import summary and row-level error report

## Technical Context

**Language/Version**: TypeScript 5.8.2, React 19.2.3  
**Primary Dependencies**: Vite 6.2.0, TanStack Router 1.143.x (file-based routing), TanStack React Query 5.90.x, Tailwind CSS 4.1.18, MUI Material 7.3.6 (+ Emotion), lucide-react 0.562.0, react-hook-form 7.71.x  
**Storage**: Supabase (existing `flashcards` table via `@supabase/supabase-js`)  
**Testing**: Not applicable (testing excluded per constitution)  
**Target Platform**: Web browser (modern browsers supporting ES modules)  
**Project Type**: Single-page web application  
**Performance Goals**: Validate + parse files up to 10MB within ~2s typical; preview remains responsive for up to ~1000 rows; save action provides feedback within a few seconds for typical imports  
**Constraints**: Must maintain existing indigo/slate look & feel, follow file-based route conventions, keep components small/reusable, avoid introducing large new dependencies for CSV parsing  
**Scale/Scope**: 1 new route + page, a small set of reusable upload/preview components, one bulk-import service layer, and integration with existing flashcard creation/storage patterns

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Modern UI/UX Design**: ✅ PASS - UI will match existing indigo/slate palette and layout patterns. Use MUI components in a way that blends with current styling (spacing, typography) and avoids introducing a mismatched look.

**Lightweight Technology Stack**: ✅ PASS - MUI is already present in dependencies. CSV parsing will be implemented without adding a heavy parsing dependency; drag & drop will use native browser APIs.

**Code Quality & Formatting**: ✅ PASS - TypeScript + Prettier already configured. New modules will follow existing naming and path alias conventions.

**Component Architecture**: ✅ PASS - Upload UI, instructions, preview table, and import summary will be separated into small components. Parsing/validation will live in isolated utilities/services.

**Code Reusability**: ✅ PASS - Extract reusable file-dropzone and CSV preview components; share validation/parsing utilities.

**Testing Policy**: No testing infrastructure, test files, or testing frameworks should be included.

✅ PASS - No tests will be introduced.

## Project Structure

### Documentation (this feature)

```text
specs/002-csv-vocab-upload/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── routes/
│   └── _app/
│       ├── dashboard.tsx
│       ├── manage.tsx
│       ├── practice.tsx
│       ├── study.tsx
│       ├── route.tsx
│       └── import.tsx              # NEW: CSV import page route (name TBD, see research)
├── components/
│   └── csv-import/                 # NEW: Small, focused UI components for CSV import feature
│       ├── CsvImportDropzone.tsx
│       ├── CsvImportInstructions.tsx
│       ├── CsvImportPreviewTable.tsx
│       ├── CsvImportSummary.tsx
│       └── types.ts
├── services/
│   └── csvImportService.ts         # NEW: validate + parse + import orchestration (no UI)
└── utils/
    └── csv.ts                      # NEW: lightweight CSV parsing helpers (comma-delimited)
```

**Structure Decision**: Use TanStack Router file-based routing under `src/routes/_app/` for the new page, and add a feature-scoped folder `src/components/csv-import/` for reusable UI building blocks. Keep parsing/validation in `src/services/` and `src/utils/` to enforce separation of concerns and reuse.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All decisions align with constitution principles.
