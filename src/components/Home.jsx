import { Alert, Paper, CardHeader, CardContent, TextField, Button, IconButton, Menu, MenuItem, Autocomplete, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useState, useEffect } from 'react';
import * as api from '../util/api.js';

import logo from '../assets/Back2TheFuture.jpg';

const Home = (props) => {
  const [alerts, setAlerts] = useState([]); // State variable to hold Autocomplete options

  const loadAlerts = async () => {
    let result = await api.alerts.getSearchData();
    setAlerts(result);
    props.alert(`${result.length} alerts loaded`);
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
            onChange={(_event, selectedOption) => console.log(selectedOption)} // It's the 2nd argument that gives what's selected
          />
        </CardContent>
      </Paper>
    </>
  );
};
export default Home;
