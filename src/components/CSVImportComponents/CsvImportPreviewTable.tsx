import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { CsvRow, RowResult } from '@type-schema/CSVFile';

interface CsvImportPreviewTableProps {
  rows: CsvRow[];
  rowResults: RowResult[];
}

const CsvImportPreviewTable: React.FC<CsvImportPreviewTableProps> = ({ rows, rowResults }) => {
  const getRowStatus = (rowNumber: number): RowResult | undefined => {
    return rowResults.find((r) => r.rowNumber === rowNumber);
  };

  const getStatusChip = (result: RowResult | undefined) => {
    if (!result) {
      return (
        <Chip label="Unknown" size="small" sx={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
      );
    }

    switch (result.status) {
      case 'valid':
        return (
          <Chip
            icon={<CheckCircle2 size={14} />}
            label="Valid"
            size="small"
            sx={{ backgroundColor: '#dcfce7', color: '#166534' }}
          />
        );
      case 'duplicate':
        return (
          <Chip
            icon={<AlertCircle size={14} />}
            label="Duplicate"
            size="small"
            sx={{ backgroundColor: '#fef3c7', color: '#92400e' }}
          />
        );
      case 'invalid':
        return (
          <Chip
            icon={<XCircle size={14} />}
            label="Invalid"
            size="small"
            sx={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          />
        );
      default:
        return null;
    }
  };

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No rows to display
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Row</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Word</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Phonetic</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Definition</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Example</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Translation</TableCell>
            <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Errors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const result = getRowStatus(row.rowNumber);
            return (
              <TableRow
                key={row.rowNumber}
                sx={{
                  backgroundColor:
                    result?.status === 'invalid'
                      ? '#fef2f2'
                      : result?.status === 'duplicate'
                        ? '#fffbeb'
                        : result?.status === 'valid'
                          ? '#f0fdf4'
                          : 'inherit',
                  '&:hover': { backgroundColor: '#f8fafc' },
                }}
              >
                <TableCell>{row.rowNumber}</TableCell>
                <TableCell>{getStatusChip(result)}</TableCell>
                <TableCell>{row.word || <em className="text-slate-400">(empty)</em>}</TableCell>
                <TableCell>{row.phonetic || <em className="text-slate-400">-</em>}</TableCell>
                <TableCell>
                  {row.definition || <em className="text-slate-400">(empty)</em>}
                </TableCell>
                <TableCell>{row.example || <em className="text-slate-400">-</em>}</TableCell>
                <TableCell>
                  {row.translation || <em className="text-slate-400">(empty)</em>}
                </TableCell>
                <TableCell>
                  {result && result.errors.length > 0 ? (
                    <Box>
                      {result.errors.map((error, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{ color: '#dc2626', display: 'block' }}
                        >
                          {error}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CsvImportPreviewTable;
