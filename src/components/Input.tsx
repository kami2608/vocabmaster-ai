import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC, ReactNode } from 'react';

type InputProps = TextFieldProps & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
};

const Input: FC<InputProps> = ({ startIcon, endIcon, onEndIconClick, ...props }) => {
  return (
    <TextField
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          width: '100%',
          borderRadius: 3,
          '& fieldset': {
            borderColor: '#e2e8f0',
          },
          '&:hover fieldset': {
            borderColor: '#e2e8f0',
          },
          '& .Mui-focused': {
            boxShadow: '0 0 0 2px rgb(99 102 241)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgb(99 102 241)',
          },
          '& .MuiInputBase-input': {
            paddingY: '12px',
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" disablePointerEvents>
              <IconButton>{startIcon}</IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onEndIconClick}>{endIcon}</IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default Input;
