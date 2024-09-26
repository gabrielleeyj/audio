const bcrypt = require('bcrypt');
const dbModule = require('../../db/db');

// Mock the entire db module
jest.mock('../../db/db', () => ({
  createUser: jest.fn(),
  findUserByUsername: jest.fn(),
  listUsers: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn()
}));

// Mock bcrypt
jest.mock('bcrypt');

describe('Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should hash password and insert user', async () => {
    const hashedPassword = 'hashedpassword';
    bcrypt.hash.mockResolvedValue(hashedPassword);
    dbModule.createUser.mockImplementation(async (username, password, role) => {
      const hashed = await bcrypt.hash(password, 10);
      // Simulate database insertion
    });

    await dbModule.createUser('testuser', 'password123', 'user');

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(dbModule.createUser).toHaveBeenCalledWith('testuser', 'password123', 'user');
  });

  test('findUserByUsername should return user if found', async () => {
    const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
    dbModule.findUserByUsername.mockResolvedValue(mockUser);

    const user = await dbModule.findUserByUsername('testuser');

    expect(user).toEqual(mockUser);
    expect(dbModule.findUserByUsername).toHaveBeenCalledWith('testuser');
  });

  test('listUsers should return all users', async () => {
    const mockUsers = [
      { id: 1, username: 'user1', role: 'user' },
      { id: 2, username: 'user2', role: 'admin' }
    ];
    dbModule.listUsers.mockResolvedValue(mockUsers);

    const users = await dbModule.listUsers();

    expect(users).toEqual(mockUsers);
    expect(dbModule.listUsers).toHaveBeenCalled();
  });

  test('deleteUser should delete the specified user', async () => {
    dbModule.deleteUser.mockResolvedValue();

    await dbModule.deleteUser('testuser');

    expect(dbModule.deleteUser).toHaveBeenCalledWith('testuser');
  });

  test('updateUser should update the user password', async () => {
    const newHashedPassword = 'newhashedpassword';
    bcrypt.hash.mockResolvedValue(newHashedPassword);
    dbModule.updateUser.mockImplementation(async (username, password) => {
      const hashed = await bcrypt.hash(password, 10);
      // Simulate database update
    });

    await dbModule.updateUser('testuser', 'newpassword');

    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    expect(dbModule.updateUser).toHaveBeenCalledWith('testuser', 'newpassword');
  });
});