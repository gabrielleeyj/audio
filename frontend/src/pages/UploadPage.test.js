import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import UploadPage from './UploadPage';
import useAxiosAuth from '../apis/useAxiosAuth';

jest.mock('../apis/useAxiosAuth');

describe('UploadPage', () => {
  beforeEach(() => {
    useAxiosAuth.mockReturnValue({
      post: jest.fn().mockResolvedValue({ status: 201, data: { message: 'File uploaded successfully' } }),
    });
  });

  it('renders upload form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UploadPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Upload Audio File')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });

  it('handles file upload successfully', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UploadPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByLabelText(/choose an audio file/i); // This should now work
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });
  });

  it('handles upload error', async () => {
    useAxiosAuth.mockReturnValue({
      post: jest.fn().mockRejectedValue(new Error('Upload failed')),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <UploadPage />
        </AuthProvider>
      </BrowserRouter>
    );
    
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByLabelText(/choose an audio file/i); // This should now work
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to upload file. Please try again.')).toBeInTheDocument();
    });
  });
});