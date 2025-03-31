const express = require('express');
const bcrypt = require('bcrypt');



module.exports = (db) => {
  const router = express.Router();

  // Get all users
  router.get('/', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Update a user
  router.put('/:id', async (req, res) => {
    const { UserName, Email, PasswordHash, Role } = req.body;
    try {
      let hashedPassword = PasswordHash;
      if (PasswordHash) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);
      }
      const sql = 'UPDATE Users SET UserName=?, Email=?, PasswordHash=?, Role=? WHERE UserID=?';
      db.query(sql, [UserName, Email, hashedPassword, Role, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated successfully' });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a user
  router.post('/', async (req, res) => {
    const { UserName, Email, PasswordHash, Role } = req.body;
    
    console.log('Received Data:', UserName, Email, PasswordHash, Role);

    if (!UserName || !Email || !PasswordHash) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);
        
        const sql = 'INSERT INTO Users (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
        db.query(sql, [UserName, Email, hashedPassword, Role || 'User'], (err, result) => {
            if (err) {
                console.error('Database Insert Error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User added successfully', userId: result.insertId });
        });
    } catch (error) {
        console.error('Hashing Error:', error);
        res.status(500).json({ error: error.message });
    }
});


  // Delete a user
  router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Users WHERE UserID=?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User deleted successfully' });
    });
  });

  return router;
};