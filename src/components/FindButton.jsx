import { Button } from '@mui/material';

const FindButton = ({ onClick }) => {
  return (
    <Button fullWidth variant="contained" color="primary" onClick={onClick}>
      Find
    </Button>
  );
};

export default FindButton;
