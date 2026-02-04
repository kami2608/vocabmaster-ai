export interface CsvRow {
  rowNumber: number; // 1-based data row number (not counting header)
  word: string;
  phonetic: string | '';
  definition: string;
  example: string | '';
  translation: string;
}

export interface RowResult {
  rowNumber: number;
  status: 'valid' | 'invalid' | 'duplicate';
  errors: string[]; // Empty when status is 'valid' or 'duplicate'
}

export interface ImportSummary {
  totalRowsParsed: number;
  rowsValidToImport: number;
  rowsSkippedDuplicates: number;
  rowsSkippedInvalid: number;
  rowsImported: number; // Only after save
}

export interface CsvUploadSession {
  fileName: string;
  fileSizeBytes: number;
  fileType: string; // As provided by the browser
  status: 'idle' | 'validating' | 'ready' | 'saving' | 'completed' | 'failed';
  headerValid: boolean;
  rows: CsvRow[];
  rowResults: RowResult[]; // Derived after validation/dedupe
  summary: ImportSummary; // Derived after validation or save
  errors: string[]; // Session-level errors (e.g., file invalid)
}
