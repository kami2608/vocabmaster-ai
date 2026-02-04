import React, { useState } from 'react';
import { Paper, Box, Typography, Divider, List, ListItem, ListItemText, Collapse, IconButton } from '@mui/material';
import { FileText, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const CsvImportInstructions: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper sx={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <Box
        onClick={toggleExpanded}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          transition: 'background-color 0.2s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FileText size={24} className="text-indigo-600" />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            CSV Format Requirements
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
            },
          }}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ px: 4, pb: 4 }}>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Required Header Columns
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Your CSV file must include a header row with the following columns (case-insensitive):
        </Typography>
        <Box
          component="code"
          sx={{
            display: 'block',
            p: 2,
            backgroundColor: '#ffffff',
            borderRadius: 1,
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#1e293b',
            mb: 2,
          }}
        >
          word, phonetic, definition, example, translation
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Required Fields
        </Typography>
        <List dense>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <CheckCircle2 size={16} className="text-green-600" />
              <ListItemText
                primary="word"
                secondary="The vocabulary word (required)"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </Box>
          </ListItem>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <CheckCircle2 size={16} className="text-green-600" />
              <ListItemText
                primary="definition"
                secondary="The definition of the word (required)"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </Box>
          </ListItem>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <CheckCircle2 size={16} className="text-green-600" />
              <ListItemText
                primary="translation"
                secondary="Vietnamese translation (required)"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </Box>
          </ListItem>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <AlertCircle size={16} className="text-slate-400" />
              <ListItemText
                primary="phonetic"
                secondary="Phonetic pronunciation (optional)"
                primaryTypographyProps={{ fontWeight: 400, color: 'text.secondary' }}
              />
            </Box>
          </ListItem>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <AlertCircle size={16} className="text-slate-400" />
              <ListItemText
                primary="example"
                secondary="Example sentence (optional)"
                primaryTypographyProps={{ fontWeight: 400, color: 'text.secondary' }}
              />
            </Box>
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          File Constraints
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="File Size"
              secondary="Maximum 10MB"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="File Format"
              secondary="Comma-delimited CSV (.csv extension)"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Encoding"
              secondary="UTF-8 (supports special characters and Vietnamese text)"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Example CSV Structure
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            backgroundColor: '#ffffff',
            borderRadius: 1,
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#1e293b',
            overflow: 'auto',
            mb: 2,
          }}
        >
          {`word,phonetic,definition,example,translation
hello,həˈləʊ,A greeting,"Hello, how are you?",xin chào
commit,ˈkɒmɪt,To record changes,"Please commit your changes.",commit (ghi nhận thay đổi)`}
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          Note: Fields containing commas should be enclosed in double quotes.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Import Behavior
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Duplicate Detection"
              secondary="Rows with words that already exist in your vocabulary will be skipped"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Partial Import"
              secondary="Valid rows will be imported even if some rows are invalid or duplicates"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Error Reporting"
              secondary="You'll see a detailed preview with row-level errors before importing"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        </List>
      </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CsvImportInstructions;
