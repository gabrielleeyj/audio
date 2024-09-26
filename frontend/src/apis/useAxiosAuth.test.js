import { renderHook } from '@testing-library/react';
import useAxiosAuth from './useAxiosAuth';
import axios from './axios';

jest.mock('./axios', () => ({
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
}));

describe('useAxiosAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('adds authorization header to requests', () => {
    sessionStorage.setItem('jwt', 'test-token');

    const mockInterceptor = jest.fn((config) => config);
    axios.interceptors.request.use.mockImplementation((interceptor) => {
      mockInterceptor(interceptor);
      return 1; // Return a mock interceptor ID
    });

    renderHook(() => useAxiosAuth());

    expect(axios.interceptors.request.use).toHaveBeenCalled();

    const interceptor = mockInterceptor.mock.calls[0][0];
    const config = { headers: {} };
    const result = interceptor(config);

    expect(result.headers['Authorization']).toBe('Bearer test-token');
  });

  it('does not override existing authorization header', () => {
    const mockInterceptor = jest.fn((config) => config);
    axios.interceptors.request.use.mockImplementation((interceptor) => {
      mockInterceptor(interceptor);
      return 1; // Return a mock interceptor ID
    });

    renderHook(() => useAxiosAuth());

    const interceptor = mockInterceptor.mock.calls[0][0];
    const config = { headers: { Authorization: 'Bearer existing-token' } };
    const result = interceptor(config);

    expect(result.headers['Authorization']).toBe('Bearer existing-token');
  });

  it('ejects the interceptor on cleanup', () => {
    const { unmount } = renderHook(() => useAxiosAuth());

    unmount();

    expect(axios.interceptors.request.eject).toHaveBeenCalled();
  });
});