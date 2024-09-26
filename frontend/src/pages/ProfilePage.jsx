import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import { parseClaims } from '../utils/jwt';
import useAxiosAuth from '../apis/useAxiosAuth';
import dayjs from 'dayjs';

const ProfilePage = () => {
  const axiosAuth = useAxiosAuth();
  const isAuth = sessionStorage.getItem("jwt");
  const user = parseClaims(isAuth);
  const isAdmin = user.role === "admin";
  const [users, setUsers] = useState([]); // State for users
  const [audios, setAudios] = useState([]); // State for audio files
  const [userLoading, setUserLoading] = useState(true); // Loading state for users
  const [audioLoading, setAudioLoading] = useState(true); // Loading state for audio
  const expiry = dayjs.unix(user.exp).format('MMMM D, YYYY h:mm A');
  const iat = dayjs.unix(user.iat).format('MMMM D, YYYY h:mm A');

  useEffect(() => {
    const getUser = async () => {
      if (isAdmin) {
        try {
          const res = await axiosAuth.get('/user');
          if (res.status === 200) {
            setUsers(res.data.users);  // Set the users state with data
          }
        } catch (error) {
          console.error("Error fetching users", error);
        } finally {
          setUserLoading(false);
        }
      }
    };

    const getAudio = async () => {
      try {
        const res = await axiosAuth.get('/audio');
        if (res.status === 200) {
          setAudios(res.data.files);  // Assuming the API returns files in res.data.files
        }
      } catch (error) {
        console.error("Error fetching audio", error);
      } finally {
        setAudioLoading(false);
      }
    };

    getUser();
    getAudio();
  }, [axiosAuth, isAdmin]);

  // Handle audio deletion
  const handleAudioDelete = async (name) => {
    try {
      const res = await axiosAuth.delete(`/audio/${name}`);
      if (res.status === 200) {
        setAudios((prevAudios) => prevAudios.filter((audio) => audio.name !== name));
      }
    } catch (error) {
      console.error("Error deleting audio", error);
    }
  };

  // Handle audio download
  const handleAudioDownload = (location) => {
    window.open(location, '_blank'); // Download the file by opening the URL in a new tab
  };

  // Handle audio play
  const handleAudioPlay = (location) => {
    const audio = new Audio(location);
    audio.play();
  };

  // Columns for users DataGrid (if admin)
  const userColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'updated_at', headerName: 'Updated At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.id)} // Call delete function
        >
          Delete
        </Button>
      ),
    },
  ];

  // Columns for audio DataGrid
  const audioColumns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'size', headerName: 'Size (bytes)', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAudioPlay(params.row.location)} // Play the audio
            sx={{ marginRight: 1 }}
          >
            Play
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleAudioDownload(params.row.location)} // Download the audio
            sx={{ marginRight: 1 }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleAudioDelete(params.row.name)} // Delete the audio
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (userLoading) {
    return <Typography>Loading user list...</Typography>;
  }

  if (audioLoading) {
    return <Typography>Loading audio list...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.username}
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" component="div">
                ID: {user.id}
              </Typography>
              <Typography variant="body1" component="div">
                Role: {user.role}
              </Typography>
              <Typography variant="body2" component="div">
                Login at: {iat}
              </Typography>
              <Typography variant="body2" component="div">
                Token Expiry: {expiry}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Users DataGrid (Only visible if admin) */}
        {isAdmin && (
          <Grid item xs={12}>
            <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
              <DataGrid
                rows={users} // Pass user data to rows
                columns={userColumns} // Pass columns definition
                pageSize={5} // Set page size
                rowsPerPageOptions={[5, 10, 20]} // Rows per page options
                checkboxSelection={false} // Optionally enable checkboxes
                disableSelectionOnClick
              />
            </Box>
          </Grid>
        )}

        {/* Audio Files DataGrid */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Audio Files
          </Typography>
          <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
            <DataGrid
              rows={audios} // Pass audio data to rows
              columns={audioColumns} // Pass columns definition
              pageSize={5} // Set page size
              rowsPerPageOptions={[5, 10, 20]} // Rows per page options
              checkboxSelection={false} // Optionally enable checkboxes
              disableSelectionOnClick
              getRowId={(row) => row.name} // Use 'name' as row identifier
            />
          </Box>
        </Grid>

        {/* Upload New Audio Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Upload New Audio File
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;

