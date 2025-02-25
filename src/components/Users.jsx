import { useState, useEffect } from 'react';
import { CardHeader, CardContent, FormControl, TextField, Button, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import Stack from '@mui/material/Stack';

const Users = (props) => {
  // user data
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    let response = await fetch(`http://localhost:9000/api/users`);
    let result = await response.json();
    console.log(result);
    setUsers(result);
    return users;
  };

  // Select - Selected User
  const [selectedUser, setSelectedUser] = useState('');

  // Select - Dynamic Rendering
  // These are a traditional one-line functional component. Data goes in => component goes out.
  // They could each be their own Component files using props as arguments
  const userToMenuItem = (user, key) => (
    <MenuItem key={key} value={user}>
      {user.name}
    </MenuItem>
  ); // key required - remove and see warning
  const usersMenuItems = (usersIterable) => usersIterable.map((user, index) => userToMenuItem(user, index));

  // Select - "Event Emitter"
  // How do you even figure out that it's even.target.value?
  // Documentation, experience, or console.log and tears
  const onSelectChange = (event) => {
    let user = event.target.value;
    console.log(user);
    setSelectedUser(user);
    props.alert(`Selected ${user.name}`);
  };

  // User Details - State

  // For the CREATE and UPDATE, you'll want to duplicate the user state
  // When that happens, use userInDetail (being updated or created) as well as selectedUser
  // const [userInDetail, setUserInDetail] = useState('');

  // User Details - Rendering
  const renderUserInDetail = (user) => {
    if (!user) return <></>; // Early return for conditional rendering - returns "empty" element
    return (
      <Paper elevation={4} sx={{ marginTop: '1em' }}>
        <CardHeader title="Details"></CardHeader>
        <CardContent>
          <TextField fullWidth label="Name" value={user.name} sx={{ marginBottom: '1em' }} />
          <TextField fullWidth label="Email" value={user.email} />
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: '1em' }}>
            <Button variant="contained" color="error" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    );
  };

  // User Details - Delete Button Event
  const onDelete = async () => {
    try {
      let response = await fetch(`http://localhost:9000/api/users/${selectedUser.email}`, {
        method: 'DELETE',
        headers: {
          // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
          Accept: 'text;application/json',
          // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
          'Content-Type': 'application/json',
        },
      });
      let result = await response.json();
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

  const onCancel = () => setSelectedUser(null);

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
            <Select fullWidth label=".................." defaultValue="" value={selectedUser ?? ''} onChange={onSelectChange}>
              {/* Remove this and we don't have the user's names as options */}
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
    </>
  );
};
export default Users;
