const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeAdmin } = require('../../middleware/auth');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  test('authenticateToken should call next for valid token', () => {
    req.headers['authorization'] = 'Bearer validtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: '123', username: 'testuser' });
    });

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  test('authenticateToken should return 403 for invalid token', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('authorizeAdmin should call next for admin user', () => {
    req.user = { role: 'admin' };

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('authorizeAdmin should return 403 for non-admin user', () => {
    req.user = { role: 'user' };
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();

    authorizeAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Admin access required' });
  });
});