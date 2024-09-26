import React, { useState } from 'react';
import { useForm } from 'react-hook-form';  // Use react-hook-form
import { Box, Button, Typography, CircularProgress, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import useAxiosAuth from '../apis/useAxiosAuth';

const uploadAudio = async (file) => {
  const axiosAuth = useAxiosAuth();
  const formData = new FormData();
  formData.append('audio', file); // Append the file to FormData

  const res = await axiosAuth.post('/audio/upload', formData);

  return res.data;
};

const UploadPage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { handleSubmit } = useForm();

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);  // Set the selected audio file
  };

  const onSubmit = async () => {
    if (!audioFile) {
      setIsError(true);  // Set error if no file is selected
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await uploadAudio(audioFile);  // Upload the file with the token
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Upload Audio File
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputLabel htmlFor="audio-upload">Choose an audio file</InputLabel>
            <input
              id="audio-upload" // Ensure the input has an id
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </form>
          {isSuccess && <Typography color="success">File uploaded successfully!</Typography>}
          {isError && <Typography color="error">Failed to upload file. Please try again.</Typography>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage;

