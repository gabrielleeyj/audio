import React, { useContext } from 'react';
import { useUser } from '../hooks/useUser';
import { useAudioFiles } from '../hooks/useAudioFiles';
import AuthContext from '../context/AuthContext';
import { Button, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ProfilePage = () => {
  const { token } = useContext(AuthContext);
  const { getUser } = useUser();
  const { data: userData, isLoading: userLoading } = getUser(token);
  const { data: audioFiles, isLoading: filesLoading } = useAudioFiles(token);

  if (userLoading || filesLoading) return <Typography>Loading...</Typography>;
  if (!userData) return <Typography>Error loading user data</Typography>;

  const columnDefs = [
    { headerName: 'File Name', field: 'name' },
    { headerName: 'File Size (bytes)', field: 'size' },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h4" gutterBottom>
            Welcome, {userData.username}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Box sx={{ height: 400, marginTop: 2 }} className="ag-theme-alpine">
            <AgGridReact
              rowData={audioFiles}
              columnDefs={columnDefs}
              rowSelection="single"
            />
          </Box>
        </Grid>
        <Grid size={12}>
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Upload New Audio File
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
