# Quickstart: CSV Vocabulary Upload

**Date**: 2026-02-03  
**Feature**: CSV Vocabulary Upload (`002-csv-vocab-upload`)

## What this adds

A new authenticated page that lets users import vocabulary flashcards from a CSV file:

- Upload via click-to-select or drag & drop
- Validates file constraints (0 < size < 10MB, `.csv`)
- Parses **comma-delimited** CSV with **required header**
- Shows a preview (including invalid/duplicate row indicators)
- Saves valid, non-duplicate rows to the user’s vocabulary (partial import)

## Route / Navigation

- The import page is implemented as a TanStack Router file-based route under `src/routes/_app/`.
- It should be accessible from the main navigation (Sidebar) as an “Import CSV” / “Upload CSV” entry.

## CSV Format Requirements

### Required header

Header must contain these columns (case-insensitive, trimmed):

`word, phonetic, definition, example, translation`

### Delimiter

Comma-delimited: `,`

### Required fields

- `word`, `definition`, `translation` must be non-empty for a row to be importable.
- `phonetic` and `example` can be empty.

### Duplicate policy

If `word` already exists in the user’s vocabulary, the row is **skipped** (not imported).

### Partial import policy

If some rows are invalid:

- Valid rows are still imported
- Invalid rows are skipped
- The UI shows counts and row-level reasons

## Example CSV

```csv
word,phonetic,definition,example,translation
hello,həˈləʊ,A greeting,"Hello, how are you?",xin chào
commit,ˈkɒmɪt,To record changes in version control,"Please commit your changes.",commit (ghi nhận thay đổi)
```

