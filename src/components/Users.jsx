import { useState, useEffect } from 'react';
import { CardHeader, CardContent, FormControl, TextField, Button, InputLabel, Select, MenuItem, Paper, Fab } from '@mui/material';
import Stack from '@mui/material/Stack';
import * as api from '../util/api.js';

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(''); // this will turn into an object
  const [originalUser, setOriginalUser] = useState(''); // this will be used to track any updates to the user
  const [userNameInput, setUserNameInput] = useState(''); // for tracking user input
  const [userEmailInput, setUserEmailInput] = useState(''); // for tracking user input
  const [fabClicked, setFabClicked] = useState(false); // will be used to conditionally render the create user form

  // Validation states
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [emailHelperText, setEmailHelperText] = useState('');

  const loadUsers = async () => {
    try {
      let result = await api.users.getAll(api.server('/api/users'));
      console.log(result);
      setUsers(result);
      props.alert(`${result.length} users loaded`);
      return users;
    } catch (e) {
      console.warn(`${e}`);
      props.alert('Failed to load users');
    }
  };

  // Select - Dynamic Rendering
  // These are a traditional one-line functional component. Data goes in => component goes out.
  // They could each be their own Component files using props as arguments
  // LAB 11 CHANGE, added json stringify so that it works with the Select value and avoids out of range warnings
  const userToMenuItem = (user, key) => (
    <MenuItem key={key} value={JSON.stringify(user)}>
      {user.name}
    </MenuItem>
  ); // key required - remove and see warning
  const usersMenuItems = (usersIterable) => usersIterable.map((user, index) => userToMenuItem(user, index));

  // Select - "Event Emitter"
  // How do you even figure out that it's even.target.value?
  // Documentation, experience, or console.log and tears
  const onSelectChange = (event) => {
    //let user = event.target.value; // would be an object
    //setSelectedUser(user);
    const userObject = JSON.parse(event.target.value); // convert to a JSON string because Select can't store objects without out of range warnigns
    setSelectedUser(userObject);
    setOriginalUser(userObject); // track the original user for updates
    setUserNameInput(userObject.name);
    setUserEmailInput(userObject.email);
    fabClicked && setFabClicked(false);

    setEmailError(false);
    setNameError(false);
    setEmailHelperText('');
    setNameHelperText('');

    props.alert(`Selected ${userObject.name}`);
  };

  const detailsChanged = () => {
    return originalUser && (userNameInput !== originalUser.name || userEmailInput !== originalUser.email);
  };

  const onUpdate = async () => {
    let hasError = false;

    if (!userNameInput.trim()) {
      setNameError(true);
      setNameHelperText('Name is required.');
      hasError = true;
    } else {
      setNameError(false);
      setNameHelperText('');
    }

    if (!userEmailInput.trim()) {
      setEmailError(true);
      setEmailHelperText('Email is required.');
      hasError = true;
    } else {
      setEmailError(false);
      setEmailHelperText('');
    }

    if (hasError) return;

    const updatedUser = { name: userNameInput, email: userEmailInput };
    const oldEmail = originalUser.email; // Store old email before update

    try {
      let result = await api.users.update(oldEmail, updatedUser); // Pass old email
      console.log(result);
      props.alert(`${result.message}`);

      // Update the local state
      setUsers(users.map((u) => (u.email === oldEmail ? updatedUser : u)));
      setSelectedUser(updatedUser);
      setOriginalUser(updatedUser);
    } catch (e) {
      console.warn(`${e}`);
      props.alert('Failed to update user');

      // Rollback to original user data
      setUserNameInput(originalUser.name);
      setUserEmailInput(originalUser.email);
    }
  };

  // User Details - Rendering
  const renderUserInDetail = () => {
    if (!selectedUser && !fabClicked) return <></>; // No selection and no add mode

    const isCreating = fabClicked; // Check if adding a new user

    return (
      <Paper elevation={4} sx={{ marginTop: '1em' }}>
        <CardHeader title={isCreating ? 'New User' : 'User Details'} />
        <CardContent>
          <TextField
            fullWidth
            label="Name"
            value={userNameInput}
            error={nameError}
            helperText={nameHelperText}
            onChange={(e) => {
              setUserNameInput(e.target.value);
              setNameError(false);
              setNameHelperText('');
            }}
            sx={{ marginBottom: '1em' }}
          />
          <TextField
            fullWidth
            label="Email"
            value={userEmailInput}
            error={emailError}
            helperText={emailHelperText}
            onChange={(e) => {
              setUserEmailInput(e.target.value);
              setEmailError(false);
              setEmailHelperText('');
            }}
          />

          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: '1em' }}>
            {isCreating ? (
              <>
                <Button variant="contained" color="success" onClick={onCreate}>
                  Create
                </Button>
                <Button variant="contained" color="primary" onClick={createOnCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" sx={{ bgcolor: 'primary.light' }} disabled={!detailsChanged()} onClick={onUpdate}>
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="contained" color="primary" onClick={detailsOnCancel}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Paper>
    );
  };

  // User Details - Create Button Event
  const onCreate = async () => {
    // reset error flags
    setNameError(false);
    setEmailError(false);
    setNameHelperText('');
    setEmailHelperText('');

    let hasError = false;

    // ensure userInDetail has name and email
    if (!userNameInput) {
      setNameError(true);
      setNameHelperText('Name is required.');
      hasError = true;
    }

    if (!userEmailInput) {
      setEmailError(true);
      setEmailHelperText('Email is required.');
      hasError = true;
    } else if (users.find((u) => u.email === userEmailInput)) {
      setEmailError(true);
      setEmailHelperText('A user with that email already exists.');
      hasError = true;
    }

    if (hasError) return; // Stop execution if validation fails

    // prepare data for POST (made a local object because setUserNameInput and setUserEmailInput are async so POST will fail)
    // we would need to rollback should this user fail to be created because we need the Select component
    // to have the datat immediatley so we will optimistically update the list before the POST is completed
    const newUser = { name: userNameInput, email: userEmailInput };

    setUsers((prevUsers) => [...prevUsers, newUser]); // Optimistically update the list (will rollback if POST fails)

    try {
      let result = await api.users.create(newUser);
      console.log(result);
      setSelectedUser(newUser);
      setOriginalUser(newUser);
      props.alert(`${newUser.name} created`);
    } catch (e) {
      // this section is untested and has bugs. come back later and fix it
      console.warn(`${e}`);
      props.alert('Failed to create user');
      setUsers(users.filter((u) => u.email != newUser.email)); // Rollback the optimistic update

      return;
    }
    setFabClicked(false);
    setUserEmailInput(newUser.email);
    setUserNameInput(newUser.name);
    //setSelectedUser(null);
  };

  // User Details - Delete Button Event
  const onDelete = async () => {
    // reset error flags
    setEmailError(false);
    setNameError(false);
    setEmailHelperText('');
    setNameHelperText('');

    try {
      let result = await api.users.delete(selectedUser);
      console.log(result);

      // How you verify if the delete happened depends on the API implementation
      if (result.deletedCount) {
        let usersWithoutDeleted = users.filter((u) => u.email != selectedUser.email);
        setUsers(usersWithoutDeleted);
      }
      props.alert(`${selectedUser.name} ${result.deletedCount == 0 ? 'not ' : ''}deleted`);
    } catch (e) {
      console.warn(`${e}`);
      props.alert('Failed to delete user');
    }
    setSelectedUser(null);
  };

  const detailsOnCancel = () => {
    setSelectedUser('');
  };

  const createOnCancel = () => {
    setFabClicked(false);

    if (selectedUser) {
      setUserNameInput(selectedUser.name);
      setUserEmailInput(selectedUser.email);
    } else {
      setUserNameInput('');
      setUserEmailInput('');
    }

    // Reset error messages
    setNameError(false);
    setEmailError(false);
    setNameHelperText('');
    setEmailHelperText('');
  };

  // Runs once per rendering
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: '1em' }}>
        <CardHeader title="Users" />
        <CardContent>
          {/* Just for the Select label to work. Remove it and you'll understand */}
          <FormControl fullWidth>
            {/* This will render */}
            <InputLabel>Select User</InputLabel>

            {/* This label doesn't render, but "sets up space" */}
            {/* Try "Select User", 11 spaces, and 11 dots */}
            <Select
              fullWidth
              label=".................."
              defaultValue=""
              value={selectedUser ? JSON.stringify(selectedUser) : ''} // stringify the object to avoid out of range warnings unuiqe to Select MUI
              onChange={onSelectChange}
              renderValue={(selected) => (selected ? JSON.parse(selected).name : 'Select User')} // once a user is selected, extract the name and display the string
            >
              {usersMenuItems(users)}
            </Select>
          </FormControl>
        </CardContent>
      </Paper>

      {/* Conditionally Rendering the user passed to the function*/}
      {/* Even the Paper doesn't render if selectedUser is null, because there's nothing inside */}
      {/* It "cascades" the non-rendering to optimize */}
      <Paper elevation={4} sx={{ marginTop: '1em' }}>
        {renderUserInDetail(selectedUser)}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          setFabClicked(true);
          setUserNameInput(''); // prepare fields for new user
          setUserEmailInput(''); // prepare fields for new user
          setNameError(false);
          setEmailError(false);
          setNameHelperText('');
          setEmailHelperText('');
        }}
        sx={{ position: 'fixed', bottom: 16, right: 16, fontSize: '1.5em' }}
      >
        +
      </Fab>
    </>
  );
};
export default Users;
