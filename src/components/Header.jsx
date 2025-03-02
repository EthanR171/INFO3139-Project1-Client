import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// This component is responsible for AppBar, Menu, and Database Refresh fucnction

const Header = (props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // react-router-dom hook to navigate to different pages
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNavigate = (page) => {
    navigate(page);
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="sticky">
        {/* Justify is in the same direction as flex-direction */}
        {/* By default, it's row, so it's left-right */}
        {/* The display: flex is required to control the children elements */}
        {/* And space-between spaces them out */}
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* First element, to the left */}
          <Typography variant="h6">INFO-3139 - Ethan Rivers</Typography>
          {/* Last element, to the left */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu is hidden similar to the snackbar and could be placed anywhere */}
      <Menu anchorEl={menuAnchorEl} open={menuAnchorEl} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleNavigate('/');
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNavigate('/users');
          }}
        >
          Users
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNavigate('/bookmarks');
          }}
        >
          Bookmarks
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose(); // manually just close the menu so user doesn't have to click away (not needed but better flow)
            props.refreshDatabase(); // use the propogated function to refresh the database
          }}
        >
          Refresh Database
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
