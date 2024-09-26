import React from 'react';
import { Link } from "react-router-dom";
import { Button, Typography, Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { token } = useAuth();

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Container fixed>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }} gutterBottom>
              Welcome to Audio Host
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
              {token ? "Upload your audio files now!" : "Register to upload all your audio files"}
            </Typography>
          </Grid>
          <Grid size={6} sx={{ textAlign: 'center' }}>
            {token ?
              <Link to="/upload" style={{ color: 'inherit', textDecoration: 'none', margin: '0 10px' }}>
                <Button variant="contained" sx={{ mb: 2, alignItems: 'center', textAlign: 'center' }}>
                  Upload
                </Button>
              </Link>
              :
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'none', margin: '0 10px' }}>
                <Button variant="contained" sx={{ mb: 2, alignItems: 'center', textAlign: 'center' }}>
                  Register
                </Button>
              </Link>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;

