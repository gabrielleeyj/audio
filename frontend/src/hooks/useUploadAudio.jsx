import { useMutation } from '@tanstack/react-query';

const uploadAudio = async ({ file, token }) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch('http://localhost:3000/audio/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload audio');
  }
  return data;
};

export const useUploadAudio = () => {
  return useMutation(uploadAudio);
};

