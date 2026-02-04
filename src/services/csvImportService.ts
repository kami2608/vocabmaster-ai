import { parseCsv, validateHeader, getColumnIndices } from '@utils/csv';
import { CardStatus } from '@type-schema/flashcard';
import { supabase } from './supabase';
import { bulkInsertFlashcards } from './flashcardServices';
import { CsvRow, CsvUploadSession, ImportSummary, RowResult } from '@type-schema/CSVFile';
import { MAX_FILE_SIZE_BYTES, VALID_EXTENSIONS, VALID_MIME_TYPES } from '@type-schema/common';

/**
 * Validate file constraints (size, extension, MIME type)
 */
export function validateFile(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file size
  if (file.size === 0) {
    errors.push('File is empty');
  } else if (file.size >= MAX_FILE_SIZE_BYTES) {
    errors.push(`File size exceeds maximum of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = VALID_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!hasValidExtension) {
    errors.push(`File must have a .csv extension`);
  }

  // Check MIME type (optional check, as browsers may not always provide accurate MIME types)
  if (file.type && !VALID_MIME_TYPES.includes(file.type)) {
    // Warning only, not blocking
    console.warn(`Unexpected MIME type: ${file.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parse CSV file and validate structure
 */
export async function parseCsvFile(file: File): Promise<{
  rows: CsvRow[];
  headerValid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    const text = await file.text();
    const { rows: rawRows, errors: parseErrors } = parseCsv(text);

    if (parseErrors.length > 0) {
      errors.push(...parseErrors);
    }

    if (rawRows.length === 0) {
      errors.push('CSV file is empty or contains no data rows');
      return { rows: [], headerValid: false, errors };
    }

    // First row is header
    const headerRow = rawRows[0];
    const dataRows = rawRows.slice(1);

    // Validate header
    const headerValidation = validateHeader(headerRow);
    if (!headerValidation.valid) {
      errors.push(...headerValidation.errors);
      return { rows: [], headerValid: false, errors };
    }

    // Get column indices
    const columnIndices = getColumnIndices(headerRow);
    if (!columnIndices) {
      errors.push('Failed to extract column indices from header');
      return { rows: [], headerValid: false, errors };
    }

    // Parse data rows
    const csvRows: CsvRow[] = [];
    for (let i = 0; i < dataRows.length; i++) {
      const dataRow = dataRows[i];
      const rowNumber = i + 1; // 1-based

      const word = columnIndices.word >= 0 ? (dataRow[columnIndices.word] || '').trim() : '';
      const phonetic =
        columnIndices.phonetic >= 0 ? (dataRow[columnIndices.phonetic] || '').trim() : '';
      const definition =
        columnIndices.definition >= 0 ? (dataRow[columnIndices.definition] || '').trim() : '';
      const example =
        columnIndices.example >= 0 ? (dataRow[columnIndices.example] || '').trim() : '';
      const translation =
        columnIndices.translation >= 0 ? (dataRow[columnIndices.translation] || '').trim() : '';

      csvRows.push({
        rowNumber,
        word,
        phonetic,
        definition,
        example,
        translation,
      });
    }

    return {
      rows: csvRows,
      headerValid: true,
      errors,
    };
  } catch (error) {
    errors.push(
      `Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return { rows: [], headerValid: false, errors };
  }
}

/**
 * Validate CSV rows and detect duplicates
 */
export async function validateAndClassifyRows(
  rows: CsvRow[]
): Promise<{ rowResults: RowResult[]; summary: ImportSummary }> {
  // Fetch existing words for current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: existingFlashcards, error } = await supabase
    .from('flashcards')
    .select('word')
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  const existingWords = new Set(
    (existingFlashcards || []).map((card) => card.word.toLowerCase().trim())
  );

  const rowResults: RowResult[] = [];
  let rowsValidToImport = 0;
  let rowsSkippedDuplicates = 0;
  let rowsSkippedInvalid = 0;

  for (const row of rows) {
    const errors: string[] = [];

    // Check required fields
    if (!row.word || row.word.trim().length === 0) {
      errors.push('Missing required field: word');
    }
    if (!row.definition || row.definition.trim().length === 0) {
      errors.push('Missing required field: definition');
    }
    if (!row.translation || row.translation.trim().length === 0) {
      errors.push('Missing required field: translation');
    }

    // Check for duplicates
    const normalizedWord = row.word.toLowerCase().trim();
    if (normalizedWord && existingWords.has(normalizedWord)) {
      rowResults.push({
        rowNumber: row.rowNumber,
        status: 'duplicate',
        errors: [],
      });
      rowsSkippedDuplicates++;
      continue;
    }

    // Classify as valid or invalid
    if (errors.length > 0) {
      rowResults.push({
        rowNumber: row.rowNumber,
        status: 'invalid',
        errors,
      });
      rowsSkippedInvalid++;
    } else {
      rowResults.push({
        rowNumber: row.rowNumber,
        status: 'valid',
        errors: [],
      });
      rowsValidToImport++;
    }
  }

  const summary: ImportSummary = {
    totalRowsParsed: rows.length,
    rowsValidToImport,
    rowsSkippedDuplicates,
    rowsSkippedInvalid,
    rowsImported: 0, // Will be updated after save
  };

  return { rowResults, summary };
}

/**
 * Validate, parse, and classify CSV file
 */
export async function validateAndParse(file: File): Promise<{
  session: CsvUploadSession;
  errors: string[];
}> {
  const errors: string[] = [];

  // Validate file
  const fileValidation = validateFile(file);
  if (!fileValidation.valid) {
    return {
      session: {
        fileName: file.name,
        fileSizeBytes: file.size,
        fileType: file.type,
        status: 'failed',
        headerValid: false,
        rows: [],
        rowResults: [],
        summary: {
          totalRowsParsed: 0,
          rowsValidToImport: 0,
          rowsSkippedDuplicates: 0,
          rowsSkippedInvalid: 0,
          rowsImported: 0,
        },
        errors: fileValidation.errors,
      },
      errors: fileValidation.errors,
    };
  }

  // Parse CSV
  const parseResult = await parseCsvFile(file);
  if (!parseResult.headerValid || parseResult.rows.length === 0) {
    return {
      session: {
        fileName: file.name,
        fileSizeBytes: file.size,
        fileType: file.type,
        status: 'failed',
        headerValid: parseResult.headerValid,
        rows: parseResult.rows,
        rowResults: [],
        summary: {
          totalRowsParsed: parseResult.rows.length,
          rowsValidToImport: 0,
          rowsSkippedDuplicates: 0,
          rowsSkippedInvalid: 0,
          rowsImported: 0,
        },
        errors: parseResult.errors,
      },
      errors: parseResult.errors,
    };
  }

  // Validate and classify rows
  const { rowResults, summary } = await validateAndClassifyRows(parseResult.rows);

  return {
    session: {
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type,
      status: 'ready',
      headerValid: true,
      rows: parseResult.rows,
      rowResults,
      summary,
      errors: [],
    },
    errors: [],
  };
}

/**
 * Save valid, non-duplicate rows to database
 */
export async function saveValidRows(
  rows: CsvRow[],
  rowResults: RowResult[]
): Promise<{ success: boolean; rowsImported: number; errors: string[] }> {
  const errors: string[] = [];

  // Filter valid rows
  const validRows = rows.filter((row) => {
    const result = rowResults.find((r) => r.rowNumber === row.rowNumber);
    return result?.status === 'valid';
  });

  if (validRows.length === 0) {
    return { success: true, rowsImported: 0, errors: [] };
  }

  try {
    const rowsImported = await bulkInsertFlashcards(
      validRows.map((row) => ({
        word: row.word.trim(),
        phonetic: row.phonetic || undefined,
        definition: row.definition.trim(),
        example: row.example || undefined,
        translation: row.translation.trim(),
        status: CardStatus.New,
      }))
    );

    return { success: true, rowsImported, errors: [] };
  } catch (error) {
    errors.push(
      `Failed to save flashcards: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return { success: false, rowsImported: 0, errors };
  }
}
