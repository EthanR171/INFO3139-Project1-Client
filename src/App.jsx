import { useState } from 'react';
import { Snackbar } from '@mui/material';
import Home from './components/Home.jsx';
import './App.css';

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const showSnackbar = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Home showSnackbar={showSnackbar} />
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} message={snackbarText} />
    </>
  );
}

export default App;
