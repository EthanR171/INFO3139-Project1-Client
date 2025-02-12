import { AppBar, Toolbar, Typography, Alert, Paper } from '@mui/material';

import { useState } from 'react';
import InputEmail from './InputEmail.jsx';
import FindButton from './FindButton.jsx';

const Home = (props) => {
  const [emailInput, setEmailInput] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
    if (e.target.value.trim()) {
      setShowWarning(false);
    }
  };

  const findName = async (email) => {
    try {
      const response = await fetch(`http://localhost:9000/api/users?email=${email}`);
      let result = await response.json();
      console.log(result);
    } catch (error) {
      console.warn(`Failed to establish connection with the server. ${error}`);
      props.showSnackbar('Failed to establish connection with the server.');
    }
  };

  const handleFindClick = () => {
    if (!emailInput.trim()) {
      setShowWarning(true);
      return;
    }
    findName(emailInput);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={4} sx={{ margin: '1em', padding: '1em', gap: '1em', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5">Find Name By Email</Typography>
        {showWarning && <Alert severity="warning">Please Enter an Email.</Alert>}
        <InputEmail value={emailInput} onChange={handleEmailChange} />
        <FindButton onClick={handleFindClick} />
      </Paper>
    </>
  );
};

export default Home;
