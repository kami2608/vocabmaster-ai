import React, { useState } from 'react';
import { validateAndParse, saveValidRows } from '@services/csvImportService';
import CsvImportDropzone from '@components/CSVImportComponents/CsvImportDropzone';
import CsvImportPreviewTable from '@components/CSVImportComponents/CsvImportPreviewTable';
import CsvImportSummary from '@components/CSVImportComponents/CsvImportSummary';
import CsvImportInstructions from '@components/CSVImportComponents/CsvImportInstructions';
import { Button, Box, Typography, Alert, CircularProgress, Paper } from '@mui/material';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { CsvUploadSession } from '@type-schema/CSVFile';

const ImportPage: React.FC = () => {
  const [session, setSession] = useState<CsvUploadSession | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (file: File) => {
    setIsValidating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { session: newSession, errors } = await validateAndParse(file);

      if (errors.length > 0 || newSession.status === 'failed') {
        setError(errors.join(', ') || 'Failed to validate CSV file');
        setSession(null);
      } else {
        setSession(newSession);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSession(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!session || session.status !== 'ready') return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const {
        success,
        rowsImported,
        errors: saveErrors,
      } = await saveValidRows(session.rows, session.rowResults);

      if (!success || saveErrors.length > 0) {
        setError(saveErrors.join(', ') || 'Failed to save flashcards');
      } else {
        // Update session with imported count
        const updatedSession: CsvUploadSession = {
          ...session,
          status: 'completed',
          summary: {
            ...session.summary,
            rowsImported,
          },
        };
        setSession(updatedSession);
        setSuccessMessage(`Successfully imported ${rowsImported} vocabulary entries!`);
      }
    } catch (err) {
      // Handle specific error types
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();

        // Check for network errors
        if (
          errorMessage.includes('network') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('connection')
        ) {
          setError('Network error: Please check your internet connection and try again.');
        }
        // Check for authentication errors
        else if (
          errorMessage.includes('not authenticated') ||
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('auth')
        ) {
          setError('Authentication error: Please log in again and try again.');
          // Optionally redirect to login after a delay
          setTimeout(() => {
            navigate({ to: '/login' });
          }, 2000);
        }
        // Generic error
        else {
          setError(`Failed to save flashcards: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred during save. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = session?.status === 'ready' && session.summary.rowsValidToImport > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Import Vocabulary from CSV
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Upload a CSV file to bulk import vocabulary flashcards into your collection.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" icon={<AlertCircle size={20} />} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          severity="success"
          icon={<CheckCircle2 size={20} />}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      <CsvImportInstructions />

      <CsvImportDropzone onFileSelect={handleFileSelect} disabled={isValidating || isSaving} />

      {isValidating && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Validating and parsing CSV file...
          </Typography>
        </Box>
      )}

      {session && session.status !== 'failed' && (
        <>
          {session.fileName && (
            <Paper sx={{ p: 2, backgroundColor: '#f8fafc' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>File:</strong> {session.fileName} (
                {Math.round(session.fileSizeBytes / 1024)} KB)
              </Typography>
            </Paper>
          )}

          <CsvImportSummary summary={session.summary} />

          {session.rows.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Preview
              </Typography>
              <CsvImportPreviewTable rows={session.rows} rowResults={session.rowResults} />
            </Box>
          )}

          {canSave && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSession(null);
                  setError(null);
                  setSuccessMessage(null);
                }}
                disabled={isSaving}
              >
                Upload Another File
              </Button>
              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={16} /> : <Upload size={20} />}
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                  backgroundColor: '#4f46e5',
                  '&:hover': { backgroundColor: '#4338ca' },
                }}
              >
                {isSaving ? 'Saving...' : 'Save Vocabs'}
              </Button>
            </Box>
          )}

          {session.status === 'completed' && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSession(null);
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                Upload Another File
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate({ to: '/manage' })}
                sx={{
                  backgroundColor: '#4f46e5',
                  '&:hover': { backgroundColor: '#4338ca' },
                }}
              >
                View Word List
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default ImportPage;
