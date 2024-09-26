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
  const [userLoading, setUserLoading] = useState(true); // Loading state
  const [audioLoading, setAudioLoading] = useState(true); // Loading state
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
          console.log('audio', res);
        }
      } catch (error) {
        console.error("Error fetching audio", error);
      } finally {
        setAudioLoading(false);
      }
    };

    getUser();
    getAudio();
  }, [axiosAuth, user.role]);

  const handleDelete = async (id) => {
    try {
      const res = await axiosAuth.delete(`/user/${id}`);
      if (res.status === 200) {
        // Use the functional form to ensure you work with the latest state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Define the columns for the DataGrid
  const columns = [
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
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
            {isAdmin ? <DataGrid
              rows={users} // Pass user data to rows
              columns={columns} // Pass columns definition
              pageSize={5} // Set page size
              rowsPerPageOptions={[5, 10, 20]} // Rows per page options
              checkboxSelection={false} // Optionally enable checkboxes
              disableSelectionOnClick
            /> : null}
          </Box>
        </Grid>
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

