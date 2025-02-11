import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const InputEmail = ({ value, onChange }) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="User Email"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default InputEmail;
