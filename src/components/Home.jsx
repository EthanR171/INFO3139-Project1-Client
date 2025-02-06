import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';

import '../App.css';
import { useState } from 'react';
import InputEmail from './InputEmail.jsx';
import FindButton from './FindButton.jsx';

const Home = () => {
  const [emailInput, setEmailInput] = useState('');

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleFindClick = () => {
    alert(`This will be a call to /api/users/:${emailInput}`);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <CardHeader title="Find Name By Email" />
        <CardContent className="card-content">
          <InputEmail value={emailInput} onChange={handleEmailChange} />
          <FindButton onClick={handleFindClick} />
        </CardContent>
      </Card>
    </>
  );
};

export default Home;
