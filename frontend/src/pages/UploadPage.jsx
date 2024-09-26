import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useForm } from 'react-hook-form';  // Use react-hook-form
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from '../apis/axios';

const uploadAudio = async (file, token) => {
  const formData = new FormData();
  formData.append('audio', file); // Append the file to FormData

  const res = await axios.post('https://localhost:3000/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, // Add Authorization header
    },
  });

  return res.data;
};

const UploadPage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { token } = useContext(AuthContext);

  const { handleSubmit } = useForm();

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const onSubmit = async () => {
    if (!audioFile) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await uploadAudio(audioFile, token);  // Pass the file and token
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h4" gutterBottom>
            Upload Audio File
          </Typography>
        </Grid>
        <Grid size={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
          </form>
        </Grid>
        <Grid size={12}>
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
          {isSuccess && <Typography color="success">File uploaded successfully!</Typography>}
          {isError && <Typography color="error">Failed to upload file. Please try again.</Typography>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage;

