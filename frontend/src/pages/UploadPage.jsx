import React, { useState, useContext } from 'react';
import { useUploadAudio } from '../hooks/useUploadAudio';
import AuthContext from '../context/AuthContext';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

const UploadPage = () => {
  const [audioFile, setAudioFile] = useState(null);
  const { token } = useContext(AuthContext);
  const { mutate: uploadAudio, isLoading, isError, isSuccess } = useUploadAudio();

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!audioFile) return;

    uploadAudio({ file: audioFile, token });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload Audio File
      </Typography>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </form>

      {isSuccess && <Typography color="success">File uploaded successfully!</Typography>}
      {isError && <Typography color="error">Failed to upload file.</Typography>}
    </Box>
  );
};

export default UploadPage;

