import { Alert, Paper, CardHeader, CardContent, TextField, Button, IconButton, Menu, MenuItem, Autocomplete, Box, Divider, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useState, useEffect } from 'react';
import * as api from '../util/api.js';

import logo from '../assets/Back2TheFuture.jpg';

const Home = (props) => {
  const [alerts, setAlerts] = useState([]); // State variable to hold Autocomplete options
  const [selectedAlert, setSelectedAlert] = useState();

  const loadAlerts = async () => {
    let result = await api.alerts.getSearchData();
    setAlerts(result);
    props.alert(`${result.length} alerts loaded`);
  };

  // Handling onChange event: 1. Web request for data > 2. Set state varaible > 3. Snackbar feedback
  const fetchAlert = async (alert) => {
    if (!alert) return; // User can delete the content in the field
    let alertData = await api.alerts.getDetails(alert.country_code);
    setSelectedAlert(alertData);
    props.alert(`Retrieved alert for ${alert.country_name}`);
  };

  // A simple transformation arrow function to "stringify" our alert
  const alertAsText = (alert) => `(${alert.country_code}) ${alert.country_name}`;

  // Function that will render each object as an text option in the Autocomplete
  const renderAutocompleteOption = (props, option) => {
    // Propagating props from the Autocomplete parent object
    // Using the rest operator to "pull out" a property (key, in this case)
    // key must be passed explicitly added and not within the ...props spread
    const { key, ...nonKeyProps } = props;

    return (
      <Box key={key} {...nonKeyProps}>
        <>{alertAsText(option)}</>
      </Box>
    );
  };

  // Conditionally rendering the full Alert data
  // Good candidate to become it's own component file in Lab 12
  const renderAlert = (alert) => {
    if (!alert) return <></>;

    return (
      <Paper elevation={4} sx={{ marginTop: '0.5em' }}>
        <CardContent sx={{ marginTop: '0.5em' }}>
          <Typography variant="h5">{alertAsText(alert)}</Typography>
          <Typography variant="h6" sx={{ mt: '0.5em' }}>
            {alert.sub_region}
          </Typography>
          <Divider sx={{ mt: '1em', mb: '1em' }} />
          {alert.advisory ? (
            <>
              <Typography variant="subtitle1">{alert.advisory}</Typography>
              <Divider sx={{ mt: '1em', mb: '1em' }} />
              <Typography variant="subtitle1">{alert.date}</Typography>
            </>
          ) : (
            <Typography variant="subtitle1">No Advisory Provided</Typography>
          )}
        </CardContent>
      </Paper>
    );
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: '0.5em' }}>
        <CardHeader title="Travel Alerts" />
        <CardContent>
          <img style={{ width: '40%', maxWidth: '200px' }} src={logo} />
          <Autocomplete
            options={alerts} // array of objects [ { country_code: "", country_name: "" }, ... ]
            autoHighlight
            getOptionKey={(option) => option.country_code} // Needed in addition to the <Box key={key}>
            getOptionLabel={(option) => alertAsText(option)} // Needs in addition to the renderAutocompleteOption
            renderOption={renderAutocompleteOption} // Instructing how the data should be displayed
            renderInput={(params) => <TextField {...params} label="Find Alert" />} // Controls the "search field" part
            sx={{ marginTop: '0.5em' }}
            onChange={(_event, selectedOption) => fetchAlert(selectedOption)} // Handle onChange event
          />
        </CardContent>
      </Paper>
      {/* Conditionally render a selected Alert */}
      {renderAlert(selectedAlert)}
    </>
  );
};
export default Home;
