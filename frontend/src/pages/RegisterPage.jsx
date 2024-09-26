import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';  // Use react-hook-form instead
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

import axios from "../apis/axios";
const registerUser = async ({ username, password }) => {
  const response = await axios.post('http://localhost:3000/user', {
    username: username,
    password: password,
  });

  if (response.status !== 201) {
    console.log(response.data);
  }
  return response.data;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();  // Correct usage of useForm from react-hook-form

  const onSubmit = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(values);
      setIsSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    navigate('/login');  // Redirect to login after success
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error.message}
        </Typography>
      )}

      {isSuccess && (
        <Typography color="success" sx={{ marginBottom: 2 }}>
          Registration successful! Redirecting to login...
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Username"
          {...register('username', { required: 'Username is required', minLength: 8 })}
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required', minLength: 6 })}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: 2 }}
        onClick={() => navigate('/login')}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default RegisterPage;

