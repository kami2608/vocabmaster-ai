# Feature Specification: CSV Vocabulary Upload

**Feature Branch**: `002-csv-vocab-upload`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Với ứng dụng VocabMaster hiện tại, tôi muốn xây dựng tính năng thêm từ vựng bằng file danh sách csv. Cụ thể, tôi cần có thêm 1 page khác để upload file csv là danh sách bao gồm các flashcard có kiểu dữ liệu của từng flashcard là word, phonetic, definition, example, translation. Sau khi người dùng upload file danh sách lên thì sẽ tiến hành loading và kiểm tra xem file hợp lệ không, sau đó hiển thị preview file csv, sau đó người dùng sẽ chọn upload Vocabs để tiến hành thêm từ vựng vào database. Về phần upload file, người dùng có thể click vào button để hiển thị ra phần chọn file, hoặc drag & drop file vào khu vực upload, sau khi upload xong thì hiển thị tên file đã upload và đợi nếu validate file hợp lệ thì sẽ hiển thị phần preview file csv kèm với nút save để lưu lại vào database. Phần validate cần validate kích thước file (lớn hơn 0 và bé hơn 10mb), đúng định dạng file csv. Có thể thêm mục hướng dẫn yêu cầu về file sẽ upload phải như thế nào trong page để người dùng biết được cần upload file thế nào."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Upload CSV File and Preview Vocabulary List (Priority: P1)

A user wants to bulk import vocabulary flashcards from a CSV file. They navigate to the upload page, select or drag-and-drop a CSV file containing vocabulary data. The system validates the file, displays a preview of the parsed vocabulary entries, and allows them to save all entries to their vocabulary collection.

**Why this priority**: This is the core functionality that enables users to efficiently add multiple vocabulary words at once, significantly reducing manual entry time. Without this, users would need to add each word individually, which is time-consuming and error-prone.

**Independent Test**: Can be fully tested by uploading a valid CSV file with vocabulary data, verifying the preview displays correctly, and confirming all entries are saved to the database. This delivers immediate value by enabling bulk vocabulary import.

**Acceptance Scenarios**:

1. **Given** a user is on the CSV upload page, **When** they click the upload button and select a valid CSV file (size > 0 and < 10MB, .csv extension), **Then** the system displays a loading indicator, validates the file, shows the uploaded file name, and displays a preview table of parsed vocabulary entries with columns: word, phonetic, definition, example, translation.

2. **Given** a user is on the CSV upload page, **When** they drag and drop a valid CSV file onto the upload area, **Then** the system displays a loading indicator, validates the file, shows the uploaded file name, and displays a preview table of parsed vocabulary entries.

3. **Given** a user has uploaded a valid CSV file and sees the preview, **When** they click the "Save Vocabs" or "Upload Vocabs" button, **Then** all vocabulary entries from the CSV are saved to the database with status "NEW", and the user receives confirmation that the import was successful.

4. **Given** a user uploads a CSV file, **When** the file validation fails (invalid format, size too large, or empty file), **Then** the system displays a clear error message explaining what went wrong and what the user needs to fix, without showing a preview.

---

### User Story 2 - View File Format Instructions (Priority: P2)

A user wants to understand the required CSV file format before uploading. They view the instructions section on the upload page that explains the expected column structure, file size limits, and format requirements.

**Why this priority**: Clear instructions reduce user errors and support requests. Users need to know the exact format before attempting to upload, preventing frustration from failed uploads.

**Independent Test**: Can be fully tested by navigating to the upload page and verifying that clear, comprehensive instructions are visible explaining the CSV format requirements, column names, and file constraints. This delivers value by setting proper expectations and reducing upload failures.

**Acceptance Scenarios**:

1. **Given** a user is on the CSV upload page, **When** they view the page, **Then** they see a clearly labeled instructions section that explains: the required CSV columns (word, phonetic, definition, example, translation), file size limits (0 < size < 10MB), file format requirements (.csv extension), and optionally an example CSV structure or sample file.

---

### Edge Cases

- What happens when a user uploads a CSV file with missing required columns (word, definition, translation)?
- What happens when a CSV file contains empty rows or rows with missing required fields?
- What happens when a CSV file has more than 10MB in size?
- What happens when a user uploads a file with .csv extension but invalid CSV format (malformed data)?
- What happens when a user tries to upload a file that is 0 bytes (empty file)?
- What happens when a CSV file contains duplicate words (same word appears multiple times)?
- What happens when a user clicks "Save Vocabs" but the database operation fails (network error, authentication issue)?
- What happens when a user uploads a valid CSV file but closes the page before clicking save?
- How does the system handle CSV files with special characters, Unicode, or different encodings?
- What happens when a user drags and drops a non-CSV file (e.g., .txt, .xlsx) onto the upload area?
- What happens when a CSV row’s `word` already exists in the user’s vocabulary (should be skipped as duplicate)?
- What happens when some rows are invalid but others are valid (partial import should still save the valid rows and report skipped rows)?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a dedicated page/route for CSV vocabulary upload functionality.

- **FR-002**: System MUST support file upload via button click that opens a file selection dialog, accepting only .csv files.

- **FR-003**: System MUST support file upload via drag-and-drop interaction, where users can drag a CSV file onto a designated upload area.

- **FR-004**: System MUST validate uploaded file size to ensure it is greater than 0 bytes and less than 10 megabytes (10MB).

- **FR-005**: System MUST validate that uploaded file has a .csv extension or valid CSV MIME type.

- **FR-006**: System MUST display a loading indicator during file validation and parsing operations.

- **FR-007**: System MUST display the name of the uploaded file after successful file selection/drop.

- **FR-008**: System MUST require a comma-delimited CSV (delimiter `,`) with a header row and MUST validate that the CSV header contains these columns (case-insensitive, trimmed): `word`, `phonetic`, `definition`, `example`, `translation`.

- **FR-009**: System MUST display a preview table showing all parsed vocabulary entries from the CSV file, including columns: word, phonetic, definition, example, translation.

- **FR-010**: System MUST display a "Save Vocabs" or "Upload Vocabs" button that is only visible after successful file validation and preview generation.

- **FR-011**: System MUST save all vocabulary entries from the CSV preview to the database when user clicks the save button, with each entry having status "NEW".

- **FR-012**: System MUST display clear error messages when file validation fails, explaining the specific validation error (file size, format, or structure issue).

- **FR-013**: System MUST display file format instructions on the upload page, including: a required comma-delimited CSV with a header row `word, phonetic, definition, example, translation`, file size limits (0 < size < 10MB), and file format requirements (.csv extension).

- **FR-014**: System MUST handle CSV files with optional fields (phonetic, example) by accepting empty values for these columns.

- **FR-015**: System MUST require word, definition, and translation columns to have non-empty values for each vocabulary entry.

- **FR-016**: System MUST validate each row and mark rows invalid when required fields (`word`, `definition`, `translation`) are missing or empty.

- **FR-017**: System MUST provide user feedback (success message or confirmation) after successfully saving vocabulary entries to the database.

- **FR-018**: System MUST detect rows whose `word` already exists in the user’s current vocabulary and MUST skip importing those rows.

- **FR-019**: System MUST present an import summary indicating counts for: total rows parsed, rows to be imported, rows skipped as duplicates, and rows skipped due to validation errors.

- **FR-020**: System MUST support partial import: when the user clicks save, the system MUST import all valid, non-duplicate rows and MUST skip invalid rows.

- **FR-021**: System MUST display a row-level error report (at least in the preview UI and/or post-save summary) that identifies which rows were skipped due to validation errors and why.

## Clarifications

### Session 2026-02-03

- Q: How should the system handle duplicate words (same `word` already exists in the user’s vocabulary)? → A: Skip duplicates (do not import rows whose `word` already exists in the database for the current user).
- Q: Does the CSV file require a header row with exact column names? → A: Yes — header is required with columns `word, phonetic, definition, example, translation` (case-insensitive, trimmed).
- Q: What delimiter should be supported for CSV parsing? → A: Comma (`,`) only (comma-delimited CSV).
- Q: If some rows are invalid, should the import be blocked or partial? → A: Partial import — import valid rows, skip invalid rows, and show a clear error report and counts.

### Key Entities _(include if feature involves data)_

- **CSV Upload Session**: Represents a single file upload attempt, including the uploaded file, validation status, parsed vocabulary entries, and preview state. Key attributes: file name, file size, validation status, parsed entries array, preview visibility.

- **Vocabulary Entry (from CSV)**: Represents a single vocabulary flashcard parsed from CSV data. Key attributes: word (required), phonetic (optional), definition (required), example (optional), translation (required). This entity maps to the existing Flashcard entity when saved to database.

- **File Validation Result**: Represents the outcome of file validation. Key attributes: is valid (boolean), error message (string if invalid), file size (bytes), file type (string).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can successfully upload and import a CSV file containing 50 vocabulary entries in under 30 seconds from file selection to database save completion.

- **SC-002**: 95% of users who follow the file format instructions can successfully upload a valid CSV file on their first attempt without encountering validation errors.

- **SC-003**: System validates CSV file format and size within 2 seconds of file selection or drop for files up to 10MB.

- **SC-004**: System successfully parses and displays preview of CSV files containing up to 1000 vocabulary entries without performance degradation (preview renders within 3 seconds).

- **SC-005**: Users receive clear, actionable error messages for 100% of validation failures, with specific guidance on what needs to be fixed.

- **SC-006**: All vocabulary entries from a valid CSV file are successfully saved to the database with 100% accuracy (no data loss or corruption during import).

## Assumptions

- CSV files use standard comma-delimited format (delimiter `,`) with a required header row. The system validates and maps columns using the header names `word, phonetic, definition, example, translation` (case-insensitive, trimmed).

- CSV files may use UTF-8 encoding to support international characters and Vietnamese text in translation fields.

- Users are authenticated before accessing the upload page, and vocabulary entries are associated with the current authenticated user.

- The upload page is accessible via a new route (e.g., `/upload` or `/import`) that integrates with existing application navigation.

- File validation and parsing occur client-side before database operations to provide immediate feedback.

- If a vocabulary entry with the same `word` already exists in the user's collection, the system will skip importing that row and surface this outcome in the preview and/or import result summary.

- The preview table displays a reasonable number of entries (e.g., first 50-100 rows) with pagination or scrolling for larger files, or displays all entries if file size permits.

- After successful save, users are redirected to the vocabulary management page or remain on upload page with option to upload another file, based on standard application navigation patterns.
