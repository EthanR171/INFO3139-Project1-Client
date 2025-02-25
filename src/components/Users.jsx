import { useState, useEffect } from 'react';
import { Paper, CardHeader, CardContent } from '@mui/material';

const Users = (props) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    let response = await fetch(`http://localhost:9000/api/users`);
    let result = await response.json();
    console.log(result);
    setUsers(result);
    return users;
  };

  // Runs once per rendering
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: '1em' }}>
        <CardHeader title="Users" />
        <CardContent></CardContent>
      </Paper>
    </>
  );
};
export default Users;
