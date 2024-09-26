import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { useTheme } from '../styles/themeContext.jsx';
import { Link } from '@tanstack/react-router';

const NavigationBar = () => {
  const { toggleTheme } = useTheme();

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Audio
        </Typography>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', margin: '0 10px' }}>Home</Link>
        <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none', margin: '0 10px' }}>Profile</Link>
        <Switch onChange={toggleTheme} />
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;


