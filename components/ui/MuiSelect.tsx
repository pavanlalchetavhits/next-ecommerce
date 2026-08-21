'use client';

import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface MuiSelectProps {
  label?: string;
  value: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  options: Option[];
  disabled?: boolean;
  name?: string;
  fullWidth?: boolean;
}

export default function MuiSelect({
  value,
  onChange,
  options,
  disabled = false,
  name,
  fullWidth = true,
}: MuiSelectProps) {
  return (
    <FormControl fullWidth={fullWidth} size="small">
      <Select
        name={name}
        value={value}
        onChange={(e) => onChange(e as SelectChangeEvent<string | number>)}
        disabled={disabled}
        sx={{
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#0F172A',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E9EDF7',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366F1',
            borderWidth: '2px',
          },
          '& .MuiSelect-select': {
            padding: '10px 14px',
          },
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                borderRadius: '14px',
                marginTop: '6px',
                boxShadow:
                  '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                border: '1px solid #E9EDF7',
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  margin: '2px 6px',
                  '&:hover': {
                    backgroundColor: '#F8FAFC',
                    color: '#6366F1',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#EEF2FF',
                    color: '#6366F1',
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: '#E0E7FF',
                    },
                  },
                },
              },
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
