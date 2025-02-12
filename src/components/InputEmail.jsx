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
        onChange={(e) => {
          let stateCopy = Object.assign({}, state);
          Object.assign(stateCopy, { inputText: e.target.value });
          setState(stateCopy);
        }}
        sx={{ marginBottom: '1em' }}
      />
    </Box>
  );
};

export default InputEmail;
