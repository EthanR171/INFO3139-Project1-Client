import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../App.css';

const InputEmail = ({ value, onChange }) => {
  return (
    <Box>
      <TextField
        id="outlined-helperText"
        label="User Email"
        className="card"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default InputEmail;
