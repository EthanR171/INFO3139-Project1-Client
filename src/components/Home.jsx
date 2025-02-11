import { AppBar, Toolbar, Typography, Alert, Paper } from '@mui/material';

import { useState } from 'react';
import InputEmail from './InputEmail.jsx';
import FindButton from './FindButton.jsx';

const Home = () => {
  const [emailInput, setEmailInput] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
    if (e.target.value.trim()) {
      setShowWarning(false);
    }
  };

  const handleFindClick = () => {
    if (!emailInput.trim()) {
      setShowWarning(true);
      return;
    }
    alert(`This will be a call to /api/users/:${emailInput}`);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={4}
        sx={{
          margin: '1em',
          padding: '1em',
          gap: '1em',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">Find Name By Email</Typography>

        {showWarning && (
          <Alert severity="warning">Please Enter an Email.</Alert>
        )}

        <InputEmail value={emailInput} onChange={handleEmailChange} />
        <FindButton onClick={handleFindClick} />
      </Paper>
    </>
  );
};

export default Home;
