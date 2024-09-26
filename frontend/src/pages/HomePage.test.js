import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './HomePage';

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: jest.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  it('renders welcome message', () => {
    // Mock the useAuth to return null token
    require('../context/AuthContext').useAuth.mockReturnValue({ token: null });

    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Welcome to Audio Host')).toBeInTheDocument();
  });

  it('displays register button when not logged in', () => {
    // Mock the useAuth to return null token
    require('../context/AuthContext').useAuth.mockReturnValue({ token: null });

    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('displays upload button when logged in', () => {
    // Mock the useAuth to return a non-null token
    require('../context/AuthContext').useAuth.mockReturnValue({ token: 'mock-token' });

    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Upload your audio files now!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });
});