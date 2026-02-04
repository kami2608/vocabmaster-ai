import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Box, Paper, Typography } from '@mui/material';

interface CsvImportDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const CsvImportDropzone: React.FC<CsvImportDropzoneProps> = ({ onFileSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((file) => file.name.toLowerCase().endsWith('.csv'));

      if (csvFile) {
        onFileSelect(csvFile);
      }
    },
    [onFileSelect, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
      // Reset input to allow selecting the same file again
      e.target.value = '';
    },
    [onFileSelect]
  );

  return (
    <Paper
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      elevation={isDragging ? 8 : 2}
      sx={{
        p: 4,
        border: `2px dashed ${isDragging ? '#4f46e5' : '#cbd5e1'}`,
        backgroundColor: isDragging ? '#eef2ff' : '#ffffff',
        transition: 'all 0.2s ease-in-out',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        '&:hover': disabled ? {} : { borderColor: '#4f46e5', backgroundColor: '#f8fafc' },
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        disabled={disabled}
        style={{ display: 'none' }}
        id="csv-file-input"
      />
      <label htmlFor="csv-file-input" style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
        >
          {isDragging ? (
            <Upload size={48} className="text-indigo-600" />
          ) : (
            <FileText size={48} className="text-slate-400" />
          )}
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {isDragging ? 'Drop CSV file here' : 'Upload CSV File'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Click to browse or drag and drop your CSV file here
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
            Maximum file size: 10MB
          </Typography>
        </Box>
      </label>
    </Paper>
  );
};

export default CsvImportDropzone;
