// src/hooks/useUser.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
};

// Get user details by username (for regular users and admins)
const fetchCurrentUser = async (username, token) => {
  const response = await fetch(`http://localhost:3000/user/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user information');
  }
  return data;
};

// List all users (admin-only)
const fetchUsers = async (token) => {
  const response = await fetch('http://localhost:3000/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch users');
  }
  return data.users;
};

// Create a new user (admin can create users)
const createUser = async ({ username, password, role }, token) => {
  const response = await fetch('http://localhost:3000/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create user');
  }
  return data;
};

// Update user password (for admins or the current user)
const updateUser = async ({ id, password }, token) => {
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user');
  }
  return data;
};

// Delete a user (for admins or the current user)
const deleteUser = async (id, token) => {
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return id;
};

export const useUser = () => {
  const queryClient = useQueryClient();

  const login = useMutation(loginUser);

  const getUser = (username, token) => {
    return useQuery(['currentUser', username], () => fetchCurrentUser(username, token), {
      enabled: !!token && !!username,
    });
  };

  const getUsers = (token) => {
    return useQuery(['users'], () => fetchUsers(token), {
      enabled: !!token, // Admin-only functionality
    });
  };

  const create = useMutation((data) => createUser(data, data.token), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const update = useMutation((data) => updateUser(data, data.token), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const remove = useMutation((id) => deleteUser(id, id.token), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  return { login, getUser, getUsers, create, update, remove };
};

