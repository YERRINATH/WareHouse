const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Added missing import

module.exports = (db, JWT_SECRET, authenticateToken) => {
  const router = express.Router();

  // Registration endpoint
  router.post('/users/register', async (req, res) => {
    try {
      const { userName, email, password, role } = req.body;
      if (!userName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const checkQuery = 'SELECT * FROM Users WHERE UserName = ? OR Email = ?';
      db.query(checkQuery, [userName, email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const insertQuery = 'INSERT INTO Users (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [userName, email, passwordHash, role], (err, result) => {
          if (err) return res.status(500).json({ error: 'Failed to register user' });
          res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // User login endpoint
  router.post('/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const query = 'SELECT * FROM Users WHERE Email = ? AND Role = "User"';
      db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.UserID, userName: user.UserName, role: user.Role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: user.UserID, userName: user.UserName, email: user.Email, role: user.Role }
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Manager login endpoint
  router.post('/manager/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const query = 'SELECT * FROM Users WHERE Email = ? AND Role = "Warehouse Manager"';
      db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.UserID, userName: user.UserName, role: user.Role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: user.UserID, userName: user.UserName, email: user.Email, role: user.Role }
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Admin login endpoint
  
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM Users WHERE Role = "Admin"';
    
    db.query(query, async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      // If there are admin users in the database, proceed with normal login
      if (results.length > 0) {
        const adminUser = results.find(user => user.Email === email);
        if (!adminUser) return res.status(401).json({ error: 'Invalid credentials' });

        const passwordMatch = await bcrypt.compare(password, adminUser.PasswordHash);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: adminUser.UserID, userName: adminUser.UserName, role: adminUser.Role }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: adminUser.UserID, userName: adminUser.UserName, email: adminUser.Email, role: adminUser.Role }
        });
      }

      // If no admin user exists, allow offline default admin login
      if (email === 'admin@gmail.com' && password === 'pass') {
        const token = jwt.sign({ userId: 0, userName: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: 0, userName: 'admin', email: 'admin', role: 'Admin' }
        });
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

  // Profile endpoint (protected)
  router.get('/users/profile', authenticateToken, (req, res) => {
    const query = 'SELECT UserID, UserName, Email, Role, CreatedAt FROM Users WHERE UserID = ?';
    db.query(query, [req.user.userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      res.status(200).json({ user: results[0] });
    });
  });

  return router;
};