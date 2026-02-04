# Contract: Flashcards Storage (for CSV Import)

**Feature**: CSV Vocabulary Upload (`002-csv-vocab-upload`)  
**Purpose**: Define required storage interactions to support dedupe + bulk insert.

## Existing storage

The application persists vocabulary flashcards in the existing `flashcards` storage/table, scoped to the current authenticated user.

Each stored flashcard includes (conceptually):

- `user_id`
- `word`
- `phonetic` (nullable)
- `definition`
- `example` (may be empty)
- `translation`
- `status` (new/learning/mastered)
- timestamps (created_at, last_reviewed_at)

## Required storage interactions

### 1. Fetch existing vocabulary identifiers (for dedupe)

**Goal**: Determine whether an incoming CSV row’s `word` already exists for the current user.

**Contract**:

- Input: current user identity (implicit via auth/session)
- Output: a set/list of existing `word` values for that user

**Notes**:

- Matching is done by exact string comparison after trimming (normalize in service layer).
- If the app already holds flashcards in memory (query cache/state), the UI/service can use that as the primary source to avoid extra queries, but must still remain correct if cache is stale (planning decision).

### 2. Bulk insert new flashcards

**Goal**: Insert many flashcards at once during “Save/Upload Vocabs”.

**Contract**:

- Input: list of rows classified as `valid` and `non-duplicate`
- Behavior: insert all rows for the current user, setting:
  - `status = NEW`
  - `phonetic = null` when empty
  - `example = ""` or stored empty string consistently with existing behavior
- Output: inserted records (optional for UI) and/or success confirmation + counts

### 3. Failure behavior

If a storage operation fails:

- The UI must show an actionable error message
- The preview should remain available (so the user can retry save)

