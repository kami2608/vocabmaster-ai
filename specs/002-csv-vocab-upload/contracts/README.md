# Contracts: CSV Vocabulary Upload

This folder captures the “contracts” (data shapes and service behaviors) needed to implement CSV vocabulary import.

- It is **not** an external/public API spec.
- It defines the internal boundaries between:
  - CSV parsing/validation
  - Deduplication
  - Persistence (Supabase flashcards)
  - UI preview/reporting

## Files

- `csv-import-service.md`: Service contract for validating/parsing and importing rows.
- `flashcards-storage.md`: Persistence contract aligned to existing `flashcards` storage table and dedupe needs.

