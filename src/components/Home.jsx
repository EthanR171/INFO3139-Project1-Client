import { AppBar, Toolbar, Typography, Alert, Paper, Snackbar, CardHeader, CardContent, TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useState } from 'react';

const Home = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [state, setState] = useState({
    inputText: '',
    snackbar: {
      open: false,
      message: '',
    },
  });

  const refreshDatabase = async () => {
    try {
      let response = await fetch('http://localhost:9000/api/refresh', { method: 'POST' });
      let result = await response.json();
      let copiedState = Object.assign({ ...state }, { snackbar: { open: true, message: result.message } });
      setState(copiedState);
    } catch (e) {
      console.warn(`${e}`);
      setState({
        ...state,
        ...{
          snackbar: {
            open: true,
            message: e.error,
          },
        },
      });
    }
  };

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

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky">
        {/* Justify is in the same direction as flex-direction */}
        {/* By default, it's row, so it's left-right */}
        {/* The display: flex is required to control the children elements */}
        {/* And space-between spaces them out */}
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* First element, to the left */}
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
          {/* Last element, to the left */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={menuAnchorEl} open={menuAnchorEl} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                handleMenuClose(); // manually just close the menu so user doesn't have to click away (not needed but better flow)
                refreshDatabase();
              }}
            >
              Refresh Database
            </MenuItem>
          </Menu>
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
