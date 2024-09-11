import React from 'react';
import { useForm } from '@tanstack/react-form';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

const registerUser = async ({ username, password }) => {
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
};

const RegisterPage = () => {
  const router = useRouter();
  const { mutate: register, isLoading, error, isSuccess } = useMutation(registerUser);

  const form = useForm({
    onSubmit: (values) => {
      register(values, {
        onSuccess: () => {
          router.navigate({ to: '/login' });
        },
      });
    },
    defaultValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value ? '' : 'Username is required'),
      password: (value) => (value.length >= 6 ? '' : 'Password must be at least 6 characters'),
    },
  });

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

      <form onSubmit={form.handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          {...form.register('username')}
          error={!!form.errors.username}
          helperText={form.errors.username}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...form.register('password')}
          error={!!form.errors.password}
          helperText={form.errors.password}
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
        onClick={() => router.navigate({ to: '/login' })}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default RegisterPage;
