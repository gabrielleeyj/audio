import React from 'react';
import { useForm } from 'react-hook-form'; // Switch to react-hook-form
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate(); // Use navigate from react-router-dom
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await auth.signin(data.username, data.password);
    } catch (error) {
      console.log("Login failed:", error);
    }
    navigate('/');  // Navigate to home on successful login
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Username"
          {...register('username', { required: 'Username is required', maxLength: 10 })}
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 5, message: 'Password must be at least 5 characters' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: 2 }}
        onClick={() => navigate('/register')}  // Navigate to register
      >
        Register
      </Button>
    </Box>
  );
};

export default LoginPage;

