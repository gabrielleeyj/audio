const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create user table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT CHECK( role IN ('user', 'admin') ) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Helper function to create user
const createUser = async (username, password, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashedPassword, role],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

// Helper function to find user by username
const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Helper function to list all users
const listUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, username, role, created_at, updated_at FROM users`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Helper function to delete user
const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Helper function to update user
const updateUser = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [hashedPassword, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

// Function to check if the users table exists
const checkTableExists = () => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='users';`, (err, row) => {
      if (err) return reject(err);
      resolve(!!row); // Return true if the table exists
    });
  });
};

// Function to check if the seed users exist
const checkUserExists = (username) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) return reject(err);
      resolve(!!row); // Return true if the user exists
    });
  });
};

// Seed users into the database if they don't exist
const seedUsers = async () => {
  try {
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.log('The users table does not exist.');
      return;
    }

    const adminExists = await checkUserExists('admin');
    const userExists = await checkUserExists('user');

    if (!adminExists) {
      await createUser('admin', 'adminPass', 'admin');
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    if (!userExists) {
      await createUser('user', 'userPass', 'user');
      console.log('Regular user created.');
    } else {
      console.log('Regular user already exists.');
    }
  } catch (err) {
    console.error('Error checking or seeding users:', err);
  }
};

// Call the seed function
seedUsers();

module.exports = {
  createUser,
  findUserByUsername,
  listUsers,  // Export listUsers
  deleteUser,
  updateUser,
};

