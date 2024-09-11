import React, { useContext } from 'react';
import { useForm } from '@tanstack/react-form';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useUser } from '../hooks/useUser';
import AuthContext from '../context/AuthContext';
import { useRouter } from '@tanstack/react-router';

const LoginPage = () => {
  const router = useRouter();
  const { login: saveToken } = useContext(AuthContext);
  const { login } = useUser();

  const form = useForm({
    onSubmit: (values) => {
      login.mutate(values, {
        onSuccess: (data) => {
          saveToken(data.token);
          router.navigate({ to: '/' });
        },
        onError: (error) => {
          form.setError('global', { message: error.message });
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
        Login
      </Typography>

      {form.errors.global && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {form.errors.global.message}
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
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={login.isLoading}>
          {login.isLoading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: 2 }}
        onClick={() => router.navigate({ to: '/register' })}
      >
        Register
      </Button>
    </Box>
  );
};

export default LoginPage;
