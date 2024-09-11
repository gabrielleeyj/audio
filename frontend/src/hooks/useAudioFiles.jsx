import { useQuery } from '@tanstack/react-query';

const fetchAudioFiles = async (token) => {
  const response = await fetch('http://localhost:3000/audio', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch audio files');
  }
  return data.files;
};

export const useAudioFiles = (token) => {
  return useQuery(['audioFiles'], () => fetchAudioFiles(token), {
    enabled: !!token, // Only run if the token is available
  });
};

