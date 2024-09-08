// db.js (Database Connection and User Queries)
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./users.db', (err) => {
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
  role TEXT CHECK( role IN ('user', 'admin') ) DEFAULT 'user'
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
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  createUser,
  findUserByUsername,
  deleteUser,
  updateUser,
};

