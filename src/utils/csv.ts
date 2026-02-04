/**
 * Lightweight CSV parsing utility for comma-delimited CSVs
 * Supports quoted fields containing commas and escaped quotes
 */

export interface ParseResult {
  rows: string[][];
  errors: string[];
}

/**
 * Parse a CSV string into rows and columns
 * Handles:
 * - Comma-delimited fields
 * - Quoted fields containing commas
 * - Escaped quotes ("")
 * - Newlines inside quoted fields (best-effort)
 */
export function parseCsv(csvText: string): ParseResult {
  const rows: string[][] = [];
  const errors: string[] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let rowNumber = 0;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote: ""
        currentField += '"';
        i++; // Skip next quote
      } else if (insideQuotes && (nextChar === ',' || nextChar === '\n' || nextChar === '\r' || i === csvText.length - 1)) {
        // End of quoted field
        insideQuotes = false;
      } else if (!insideQuotes) {
        // Start of quoted field
        insideQuotes = true;
      } else {
        // Quote inside quoted field (part of content)
        currentField += char;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      // Row separator
      if (char === '\r') i++; // Skip \n after \r
      currentRow.push(currentField.trim());
      if (currentRow.length > 0 && currentRow.some((field) => field.length > 0)) {
        rows.push(currentRow);
        rowNumber++;
      }
      currentRow = [];
      currentField = '';
    } else {
      // Regular character
      currentField += char;
    }
  }

  // Handle last field/row
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 0 && currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  // Check for unclosed quotes
  if (insideQuotes) {
    errors.push('Unclosed quote detected in CSV');
  }

  return { rows, errors };
}

/**
 * Validate CSV header row
 * Checks if header contains required columns (case-insensitive, trimmed)
 */
export function validateHeader(headerRow: string[]): { valid: boolean; errors: string[] } {
  const requiredColumns = ['word', 'phonetic', 'definition', 'example', 'translation'];
  const errors: string[] = [];
  const normalizedHeader = headerRow.map((col) => col.trim().toLowerCase());

  for (const required of requiredColumns) {
    if (!normalizedHeader.includes(required)) {
      errors.push(`Missing required column: ${required}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extract column indices from header row
 */
export function getColumnIndices(headerRow: string[]): {
  word: number;
  phonetic: number;
  definition: number;
  example: number;
  translation: number;
} | null {
  const normalizedHeader = headerRow.map((col) => col.trim().toLowerCase());
  const wordIdx = normalizedHeader.indexOf('word');
  const phoneticIdx = normalizedHeader.indexOf('phonetic');
  const definitionIdx = normalizedHeader.indexOf('definition');
  const exampleIdx = normalizedHeader.indexOf('example');
  const translationIdx = normalizedHeader.indexOf('translation');

  if (wordIdx === -1 || definitionIdx === -1 || translationIdx === -1) {
    return null;
  }

  return {
    word: wordIdx,
    phonetic: phoneticIdx >= 0 ? phoneticIdx : -1,
    definition: definitionIdx,
    example: exampleIdx >= 0 ? exampleIdx : -1,
    translation: translationIdx,
  };
}
