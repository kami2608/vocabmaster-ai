# Data Model: CSV Vocabulary Upload

**Date**: 2026-02-03  
**Feature**: CSV Vocabulary Upload (`002-csv-vocab-upload`)

## Entities

### CSV Upload Session

**Description**: Represents a single user attempt to upload and import a CSV file, from file selection through validation, preview, and save.

**Attributes**:

- `fileName`: string
- `fileSizeBytes`: number
- `fileType`: string (as provided by the browser)
- `status`: `idle | validating | ready | saving | completed | failed`
- `headerValid`: boolean
- `rows`: `CsvRow[]`
- `rowResults`: `RowResult[]` (derived after validation/dedupe)
- `summary`: `ImportSummary` (derived after validation or save)
- `errors`: string[] (session-level errors, e.g., file invalid)

**Validation Rules**:

- File size: `0 < size < 10MB`
- File extension: `.csv`
- Delimiter: comma `,`
- Header row required; header must include columns (case-insensitive, trimmed): `word`, `phonetic`, `definition`, `example`, `translation`

### CsvRow

**Description**: A single row of data parsed from the CSV file (excluding header).

**Attributes**:

- `rowNumber`: number (1-based data row number, not counting header)
- `word`: string
- `phonetic`: string | "" (optional)
- `definition`: string
- `example`: string | "" (optional)
- `translation`: string

**Validation Rules**:

- `word`, `definition`, `translation` must be non-empty (after trimming)

### RowResult

**Description**: Per-row classification used for preview, save eligibility, and reporting.

**Attributes**:

- `rowNumber`: number
- `status`: `valid | invalid | duplicate`
- `errors`: string[] (empty when `valid` or `duplicate`)

**Rules**:

- `duplicate` means `word` already exists in the user’s current vocabulary.
- `invalid` means missing required fields, parse errors, or structural issues.

### ImportSummary

**Description**: Aggregated counts shown in UI and used for success feedback.

**Attributes**:

- `totalRowsParsed`: number
- `rowsValidToImport`: number
- `rowsSkippedDuplicates`: number
- `rowsSkippedInvalid`: number
- `rowsImported`: number (only after save)

## Relationships

- One **CSV Upload Session** contains many **CsvRow**.
- One **CsvRow** has exactly one **RowResult**.
- One **CSV Upload Session** produces one **ImportSummary**.
- **CsvRow** maps to the existing **Flashcard** entity on save (with `status = NEW`), for the current authenticated user.

## State Transitions

- `idle` → `validating`: user selects/drops a file
- `validating` → `ready`: file validated, parsed, preview available
- `ready` → `saving`: user clicks “Save/Upload Vocabs”
- `saving` → `completed`: save succeeded (partial import supported)
- Any → `failed`: session-level error (e.g., file invalid, parse failure, save error)

