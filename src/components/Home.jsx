import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';

import '../App.css';

const Home = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">INFO-3139 - Project 1</Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <CardHeader title="Find Name By Email" />
        <CardContent>Content will go here</CardContent>
      </Card>
    </>
  );
};
export default Home;
