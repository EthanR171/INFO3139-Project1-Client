import { Button } from '@mui/material';
import '../App.css';

const FindButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      className="card"
      onClick={onClick}
    >
      Find
    </Button>
  );
};

export default FindButton;
