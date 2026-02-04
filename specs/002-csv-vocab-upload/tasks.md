# Tasks: CSV Vocabulary Upload

**Input**: Design documents from `/specs/002-csv-vocab-upload/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testing infrastructure, test files, and testing frameworks are EXPLICITLY EXCLUDED per project constitution. Do not include test tasks unless explicitly overridden by feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure for CSV import feature: `src/components/csv-import/` folder
- [X] T002 [P] Create TypeScript types file for CSV import: `src/components/csv-import/types.ts`
- [X] T003 [P] Create CSV parsing utility module: `src/utils/csv.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement CSV parsing utility in `src/utils/csv.ts` with comma-delimited support, quoted fields, and header validation
- [X] T005 [P] Create CSV import service module: `src/services/csvImportService.ts`
- [X] T006 [P] Implement file validation logic in `src/services/csvImportService.ts` (size, extension, MIME type)
- [X] T007 Implement CSV row parsing and validation in `src/services/csvImportService.ts` (header check, required fields)
- [X] T008 Implement duplicate detection logic in `src/services/csvImportService.ts` (fetch existing words, compare)
- [X] T009 Implement bulk flashcard insert function in `src/services/flashcardServices.ts` (or create new bulk insert utility)
- [X] T010 Create TypeScript interfaces/types in `src/components/csv-import/types.ts` for `CsvRow`, `RowResult`, `ImportSummary`, `CsvUploadSession`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload CSV File and Preview Vocabulary List (Priority: P1) 🎯 MVP

**Goal**: Enable users to bulk import vocabulary flashcards from a CSV file via click-to-upload or drag & drop, with validation, preview, and save functionality.

**Independent Test**: Upload a valid CSV file with vocabulary data, verify the preview displays correctly, and confirm all entries are saved to the database. This delivers immediate value by enabling bulk vocabulary import.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create CSV import dropzone component: `src/components/csv-import/CsvImportDropzone.tsx` with click-to-upload and drag & drop support
- [X] T012 [P] [US1] Create CSV import preview table component: `src/components/csv-import/CsvImportPreviewTable.tsx` to display parsed rows with columns: word, phonetic, definition, example, translation
- [X] T013 [P] [US1] Create CSV import summary component: `src/components/csv-import/CsvImportSummary.tsx` to show import counts and row-level errors
- [X] T014 [US1] Create CSV import page route: `src/routes/_app/import.tsx` (or `upload.tsx` per route naming decision)
- [X] T015 [US1] Integrate dropzone component in import page route with file selection handler
- [X] T016 [US1] Integrate CSV import service validation in import page route (call `csvImportService.validateAndParse`)
- [X] T017 [US1] Display loading indicator during file validation and parsing in import page route
- [X] T018 [US1] Display uploaded file name after successful file selection/drop in import page route
- [X] T019 [US1] Integrate preview table component in import page route to show parsed vocabulary entries
- [X] T020 [US1] Add "Save Vocabs" or "Upload Vocabs" button in import page route (visible only after successful validation)
- [X] T021 [US1] Implement save handler in import page route that calls `csvImportService.save` for partial import
- [X] T022 [US1] Display error messages when file validation fails in import page route (file size, format, structure issues)
- [X] T023 [US1] Display success feedback after successfully saving vocabulary entries in import page route
- [X] T024 [US1] Integrate summary component in import page route to show import counts (total, valid, duplicates, invalid, imported)
- [X] T025 [US1] Mark invalid rows in preview table (rows with missing required fields: word, definition, translation)
- [X] T026 [US1] Mark duplicate rows in preview table (rows whose word already exists in user's vocabulary)
- [X] T027 [US1] Handle row-level error reporting in preview table and summary (show which rows were skipped and why)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can upload CSV files, see previews, and save valid entries to the database.

---

## Phase 4: User Story 2 - View File Format Instructions (Priority: P2)

**Goal**: Display clear, comprehensive instructions on the upload page explaining the CSV format requirements, column names, and file constraints.

**Independent Test**: Navigate to the upload page and verify that clear, comprehensive instructions are visible explaining the CSV format requirements, column names, and file constraints. This delivers value by setting proper expectations and reducing upload failures.

### Implementation for User Story 2

- [X] T028 [P] [US2] Create CSV import instructions component: `src/components/csv-import/CsvImportInstructions.tsx` with required columns, file size limits, and format requirements
- [X] T029 [US2] Integrate instructions component in import page route: `src/routes/_app/import.tsx`
- [X] T030 [US2] Add example CSV structure or sample file reference in instructions component (optional per spec)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can see format instructions before uploading and successfully import CSV files.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and integration with existing app

- [X] T031 [P] Add "Import CSV" navigation link to Sidebar component: `src/components/Sidebar.tsx` (link to `/import` or `/upload` route)
- [X] T032 [P] Add "Import CSV" navigation link to mobile hamburger menu: `src/components/HamburgerButton.tsx` (if applicable)
- [X] T033 Ensure CSV import page uses consistent indigo/slate design system colors and spacing
- [X] T034 Apply MUI components selectively in CSV import components while maintaining design consistency
- [X] T035 Handle UTF-8 encoding for CSV files with special characters and Vietnamese text
- [X] T036 Implement error handling for network failures during save operation in import page route
- [X] T037 Implement error handling for authentication failures during save operation in import page route
- [X] T038 Add navigation after successful save (redirect to manage page or stay on import page with option to upload another file)
- [X] T039 Optimize preview table rendering for large files (up to 1000 rows) with pagination or virtualization if needed
- [X] T040 Run quickstart.md validation to ensure CSV format requirements are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Can be implemented independently but integrates with US1 page

### Within Each User Story

- Components can be created in parallel (marked [P])
- Service layer must be ready before page route integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create CSV import dropzone component: src/components/csv-import/CsvImportDropzone.tsx"
Task: "Create CSV import preview table component: src/components/csv-import/CsvImportPreviewTable.tsx"
Task: "Create CSV import summary component: src/components/csv-import/CsvImportSummary.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (components + page route)
   - Developer B: User Story 2 (instructions component)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- CSV parsing must handle quoted fields containing commas
- Duplicate detection requires fetching existing user vocabulary before preview
- Partial import means valid rows are saved even if some rows are invalid/duplicate
