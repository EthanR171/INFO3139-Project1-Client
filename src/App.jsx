import { useState } from 'react';
import { Snackbar } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { teal } from '@mui/material/colors';

import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import Users from './components/Users.jsx';

import './App.css';

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: teal[500] },
    },
  });

  // Global state for snackbar.
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  // To be propogated down to children components
  const alert = (message) => {
    setSnackbar({
      open: true,
      message,
    });
  };

  // To be propogated down to Header component
  const refreshDatabase = async () => {
    try {
      let response = await fetch('http://localhost:9000/api/refresh', { method: 'POST' });
      let result = await response.json();
      alert(result.message); // show the result in the snackbar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e) {
      console.warn(`${e}`);
      alert(e.error); // show the error in the snackbar
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Header alert={alert} refreshDatabase={refreshDatabase} />
          <Routes>
            <Route path="/" element={<Home alert={alert} />} />
            <Route path="/users" element={<Users alert={alert} />} />
          </Routes>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            // Clear the snackbar state on close
            onClose={() => setSnackbar({ open: false, message: '' })}
            message={snackbar.message}
          />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
