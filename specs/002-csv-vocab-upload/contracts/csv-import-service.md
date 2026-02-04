# Contract: CSV Import Service

**Feature**: CSV Vocabulary Upload (`002-csv-vocab-upload`)  
**Purpose**: Define the internal service behavior used by the UI to validate, preview, and save a CSV import session.

## Inputs

### File input

- `file`: a user-selected file

## Validation rules

- File size: `0 < size < 10MB`
- File type: `.csv` (extension) and/or acceptable CSV mime type
- CSV delimiter: comma `,`
- Header required; header columns (case-insensitive, trimmed):
  - `word`, `phonetic`, `definition`, `example`, `translation`
- Row required fields:
  - `word`, `definition`, `translation` must be non-empty (trimmed)

## Output shapes

### ParsedRow

- `rowNumber`: number
- `word`: string
- `phonetic`: string
- `definition`: string
- `example`: string
- `translation`: string

### RowResult

- `rowNumber`: number
- `status`: `valid | invalid | duplicate`
- `errors`: string[]

### ImportSummary

- `totalRowsParsed`: number
- `rowsValidToImport`: number
- `rowsSkippedDuplicates`: number
- `rowsSkippedInvalid`: number
- `rowsImported`: number (only post-save)

## Behaviors

### Validate + preview

Given a file:

1. Validate file constraints (size/type)
2. Parse CSV content into `ParsedRow[]`
3. Validate header and required fields per row
4. Deduplicate against existing vocabulary:
   - If a row’s `word` already exists for the user, mark as `duplicate`
5. Return:
   - Rows
   - RowResults
   - ImportSummary (pre-save: `rowsImported = 0`)

### Save

Given the validated preview session:

- Perform **partial import**:
  - Import all `valid` rows that are not duplicates
  - Skip `invalid` and `duplicate` rows
- Return:
  - Updated ImportSummary including `rowsImported`
  - Row-level errors (at least those in preview)

