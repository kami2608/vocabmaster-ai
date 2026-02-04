import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { CheckCircle2, AlertCircle, XCircle, FileText } from 'lucide-react';
import { ImportSummary } from '@type-schema/CSVFile';

interface CsvImportSummaryProps {
  summary: ImportSummary;
}

const CsvImportSummary: React.FC<CsvImportSummaryProps> = ({ summary }) => {
  return (
    <Paper sx={{ p: 3, backgroundColor: '#f8fafc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FileText size={20} className="text-indigo-600" />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Import Summary
        </Typography>
      </Box>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Total Rows Parsed
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {summary.totalRowsParsed}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: '#f0fdf4',
            borderRadius: 2,
            border: '1px solid #bbf7d0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CheckCircle2 size={16} className="text-green-600" />
            <Typography variant="body2" sx={{ color: '#166534' }}>
              Valid to Import
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#166534' }}>
            {summary.rowsValidToImport}
          </Typography>
        </Box>

        {summary.rowsSkippedDuplicates > 0 && (
          <Box
            sx={{
              p: 2,
              backgroundColor: '#fffbeb',
              borderRadius: 2,
              border: '1px solid #fde68a',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AlertCircle size={16} className="text-yellow-600" />
              <Typography variant="body2" sx={{ color: '#92400e' }}>
                Skipped (Duplicates)
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#92400e' }}>
              {summary.rowsSkippedDuplicates}
            </Typography>
          </Box>
        )}

        {summary.rowsSkippedInvalid > 0 && (
          <Box
            sx={{
              p: 2,
              backgroundColor: '#fef2f2',
              borderRadius: 2,
              border: '1px solid #fecaca',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <XCircle size={16} className="text-red-600" />
              <Typography variant="body2" sx={{ color: '#991b1b' }}>
                Skipped (Invalid)
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#991b1b' }}>
              {summary.rowsSkippedInvalid}
            </Typography>
          </Box>
        )}

        {summary.rowsImported > 0 && (
          <>
            <Divider sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, my: 1 }} />
            <Box
              sx={{
                p: 2,
                backgroundColor: '#dbeafe',
                borderRadius: 2,
                border: '1px solid #93c5fd',
                gridColumn: { xs: '1', sm: '1 / -1' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <CheckCircle2 size={16} className="text-blue-600" />
                <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 600 }}>
                  Successfully Imported
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e40af' }}>
                {summary.rowsImported}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default CsvImportSummary;
