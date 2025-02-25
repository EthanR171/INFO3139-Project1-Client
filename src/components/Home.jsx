import { Alert, Paper, CardHeader, CardContent, TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useState } from 'react';

const Home = (props) => {
  const [showWarning, setShowWarning] = useState(false);
  const [inputText, setInputText] = useState('');

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
      props.alert(text); // show the result in the snackbar
      console.log(result);
    } catch (e) {
      console.warn(`${e}`);
      props.alert('Search failed'); // show the result in the snackbar
    }
  };

  const handleFindClick = () => {
    if (!inputText.trim()) {
      setShowWarning(true);
      return;
    }
    findName(inputText);
  };

  return (
    <>
      <Paper elevation={4} sx={{ margin: '1em' }}>
        <CardHeader title="Find Name By Email" />
        <CardContent>
          {showWarning && <Alert severity="warning">Please Enter an Email.</Alert>}
          <TextField
            fullWidth
            label="User Email"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setShowWarning(false);
            }}
            sx={{ marginBottom: '1em' }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              // Reading inputText from state
              handleFindClick(inputText);
            }}
          >
            FIND
          </Button>
        </CardContent>
      </Paper>
    </>
  );
};

export default Home;
