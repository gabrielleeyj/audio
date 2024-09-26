const request = require('supertest');
const express = require('express');
const userRouter = require('../../routes/user');
const { createUser, findUserByUsername, listUsers, deleteUser, updateUser } = require('../../db/db');
const { authenticateToken, authorizeAdmin } = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../db/db');
jest.mock('../../middleware/auth');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { id: '123', username: 'testuser', role: 'user' };
      next();
    });
    authorizeAdmin.mockImplementation((req, res, next) => next());
  });

  describe('POST /user (Register)', () => {
    test('should create a new user', async () => {
      createUser.mockResolvedValue();

      const response = await request(app)
        .post('/user')
        .send({ username: 'newuser', password: 'password123' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User created');
    });

    test('should return 400 if username already exists', async () => {
      createUser.mockRejectedValue(new Error('Username already exists'));

      const response = await request(app)
        .post('/user')
        .send({ username: 'existinguser', password: 'password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Username already exists');
    });

    test('should return 400 if username or password is missing', async () => {
      const response = await request(app)
        .post('/user')
        .send({ username: 'newuser' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Username already exists');
    });
  });

  describe('POST /user/login', () => {
    test('should login user with correct credentials', async () => {
      findUserByUsername.mockResolvedValue({ id: '123', username: 'testuser', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('faketoken');

      const response = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBe('faketoken');
    });

    test('should return 401 for incorrect password', async () => {
      findUserByUsername.mockResolvedValue({ id: '123', username: 'testuser', password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/user/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    test('should return 400 for non-existent user', async () => {
      findUserByUsername.mockResolvedValue(null);

      const response = await request(app)
        .post('/user/login')
        .send({ username: 'nonexistentuser', password: 'password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /user', () => {
    test('should list all users for admin', async () => {
      listUsers.mockResolvedValue([
        { id: 1, username: 'user1', role: 'user' },
        { id: 2, username: 'user2', role: 'user' },
      ]);

      const response = await request(app).get('/user');

      expect(response.statusCode).toBe(200);
      expect(response.body.users).toHaveLength(2);
    });

    test('should return 404 if no users found', async () => {
      listUsers.mockResolvedValue(null);

      const response = await request(app).get('/user');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('No users found');
    });
  });

  describe('GET /user/:username', () => {
    test('should return user details for self', async () => {
      findUserByUsername.mockResolvedValue({ id: '123', username: 'testuser', role: 'user' });

      const response = await request(app).get('/user/testuser');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: '123', username: 'testuser', role: 'user' });
    });

    test('should return user details for admin', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: 'admin', username: 'admin', role: 'admin' };
        next();
      });
      findUserByUsername.mockResolvedValue({ id: '123', username: 'testuser', role: 'user' });

      const response = await request(app).get('/user/testuser');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: '123', username: 'testuser', role: 'user' });
    });

    test('should return 403 for non-admin accessing other user', async () => {
      const response = await request(app).get('/user/otheruser');

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: Access denied');
    });

    test('should return 403 for non-existent user', async () => {
      findUserByUsername.mockResolvedValue(null);

      const response = await request(app).get('/user/nonexistentuser');

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: Access denied');
    });
  });

  describe('PUT /user/:username', () => {
    test('should return 403 when updating user password', async () => {
      updateUser.mockResolvedValue();

      const response = await request(app)
        .put('/user/testuser')
        .send({ password: 'newpassword123' });

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: Access denied');
    });

    test('should return 403 for non-admin updating other user', async () => {
      const response = await request(app)
        .put('/user/otheruser')
        .send({ password: 'newpassword123' });

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: Access denied');
    });

    test('should return 403 if password is missing', async () => {
      const response = await request(app)
        .put('/user/testuser')
        .send({});

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: Access denied');
    });
  });

  describe('DELETE /user/:username', () => {
    test('should delete user for admin', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: 'admin', username: 'admin', role: 'admin' };
        next();
      });
      deleteUser.mockResolvedValue();

      const response = await request(app).delete('/user/testuser');

      expect(response.statusCode).toBe(204);
    });

    test('should return 403 for non-admin deleting user', async () => {
      const response = await request(app).delete('/user/testuser');

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe('Forbidden: You can only delete your own account');
    });

    test('should return 500 for non-existent user', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: 'admin', username: 'admin', role: 'admin' };
        next();
      });
      deleteUser.mockRejectedValue(new Error('User not found'));

      const response = await request(app).delete('/user/nonexistentuser');

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Failed to delete user');
    });
  });
});