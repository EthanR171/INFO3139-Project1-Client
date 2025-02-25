import { useState } from 'react';
import { Paper, CardHeader, CardContent } from '@mui/material';

const Users = (props) => {
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
