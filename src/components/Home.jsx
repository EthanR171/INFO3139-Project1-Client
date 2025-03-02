import { Alert, Paper, CardHeader, CardContent, TextField, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useState, useEffect } from 'react';
import * as api from '../util/api.js';

import logo from '../assets/Back2TheFuture.jpg';

const Home = (props) => {
  const loadAlerts = async () => {
    let result = await api.alerts.getSearchData();
    console.log(result); // just printing to the console for now
    props.alert(`${result.length} alerts loaded`); // feedback with the Snackbar
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: '0.5em' }}>
        <CardHeader title="Travel Alerts" />
        <CardContent>
          <img style={{ width: '30%', maxWidth: '200px' }} src={logo} />
        </CardContent>
      </Paper>
    </>
  );
};
export default Home;
