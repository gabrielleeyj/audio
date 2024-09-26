import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProfilePage from './ProfilePage';
import useAxiosAuth from '../apis/useAxiosAuth';

jest.mock('../apis/useAxiosAuth');
jest.mock('../utils/jwt', () => ({
  parseClaims: jest.fn().mockReturnValue({
    id: 1,
    username: 'testuser',
    role: 'user',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    useAxiosAuth.mockReturnValue({
      get: jest.fn().mockResolvedValue({ status: 200, data: { files: [] } }),
    });
  });

  it('renders user information', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Loading user list...'))
    });
  });

  it('displays audio files grid', async () => {
    useAxiosAuth.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        status: 200,
        data: { files: [{ name: 'test.mp3', size: 1024, location: 'http://test.com/test.mp3' }] },
      }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
  // Wait for the loading state to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading audio list...')).not.toBeInTheDocument();
  });
}); 

  it('displays users grid for admin', async () => {
    jest.spyOn(require('../utils/jwt'), 'parseClaims').mockReturnValue({
      id: 1,
      username: 'admin',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    });

    useAxiosAuth.mockReturnValue({
      get: jest.fn()
        .mockResolvedValueOnce({ status: 200, data: { users: [{ id: 2, username: 'user', role: 'user' }] } })
        .mockResolvedValueOnce({ status: 200, data: { files: [] } }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const grid = screen.getByTestId('users-grid');
      expect(grid).toBeInTheDocument();
    });
  });
});