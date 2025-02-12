import { AppBar, Toolbar, Typography, Alert, Paper, Snackbar, CardHeader, CardContent, TextField, Button } from '@mui/material';

import { useState } from 'react';
import InputEmail from './InputEmail.jsx';
import FindButton from './FindButton.jsx';

const Home = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [state, setState] = useState({
    inputText: '',
    snackbar: {
      open: false,
      message: '',
    },
  });

  const findName = async (email) => {
    try {
      let response = await fetch(`http://localhost:9000/api/users?email=${email}`);
      let result = await response.json();
      let text = 'No results';
      if (result.length > 1) {
        text = `${result.length} users found`;
      } else if (result.length > 0) {
        text = `User ${result[0].name} found`;
      }
      // SECOND WAY TO COPY STATE USING SPREAD SYNTAX AND OBJECT.ASSIGN
      let updatedCopiedState = Object.assign(
        { ...state },
        {
          inputText: '',
          snackbar: {
            open: true,
            message: text,
          },
        }
      );
      console.log(updatedCopiedState);
      // Re-setting state for an update
      setState(updatedCopiedState);
    } catch (e) {
      console.warn(`${e}`);
      // Using the spread syntax to spread and merge both objects into a new one
      setState({
        ...state,
        ...{
          inputText: '',
          snackbar: {
            open: true,
            message: 'Search failed',
          },
        },
      });
    }
  };

  const handleFindClick = () => {
    if (!state.inputText.trim()) {
      setShowWarning(true);
      return;
    }
    findName(state.inputText);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={4} sx={{ margin: '1em' }}>
        <CardHeader title="Find Name By Email" />
        <CardContent>
          {showWarning && <Alert severity="warning">Please Enter an Email.</Alert>}
          <TextField
            fullWidth
            label="User Email"
            value={state.inputText}
            onChange={(e) => {
              setShowWarning(false);
              // FIRST WAY TO COPY STATE USING OBJECT.ASSIGN
              let stateCopy = Object.assign({}, state); // shallow copy
              Object.assign(stateCopy, { inputText: e.target.value }); // merges the new value into the copy
              setState(stateCopy);
            }}
            sx={{ marginBottom: '1em' }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              // Reading inputText from state
              handleFindClick(state.inputText);
            }}
          >
            FIND
          </Button>
        </CardContent>
      </Paper>
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={5000}
        // update the state to close the snackbar (just copy the state and update the open property)
        onClose={() => setState((prev) => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
        message={state.snackbar.message}
      />
    </>
  );
};

export default Home;
