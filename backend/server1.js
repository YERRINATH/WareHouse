// Backend: server.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'warehouse'
});

const JWT_SECRET = 'your_jwt_secret_key'; 


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');
});



// Registration endpoint
app.post('/api/users/register', async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    
    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if username or email already exists
    const checkQuery = 'SELECT * FROM Users WHERE UserName = ? OR Email = ?';
    db.query(checkQuery, [userName, email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Insert user into database
      const insertQuery = 'INSERT INTO Users (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [userName, email, passwordHash, role], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to register user' });
        }
        
        return res.status(201).json({ 
          message: 'User registered successfully', 
          userId: result.insertId 
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const query = 'SELECT * FROM Users WHERE Email = ? AND Role = "User"';

    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = results[0];
      
      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.UserID,
          userName: user.UserName,
          role: user.Role 
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Return user info and token
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.UserID,
          userName: user.UserName,
          email: user.Email,
          role: user.Role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/manager/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const query = 'SELECT * FROM Users WHERE Email = ? AND Role = "Warehouse Manager"';

    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = results[0];
      
      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.UserID,
          userName: user.UserName,
          role: user.Role 
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Return user info and token
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.UserID,
          userName: user.UserName,
          email: user.Email,
          role: user.Role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const query = 'SELECT * FROM Users WHERE Email = ? AND Role = "Admin"';

    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = results[0];
      
      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.UserID,
          userName: user.UserName,
          role: user.Role 
        }, 
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Return user info and token
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.UserID,
          userName: user.UserName,
          email: user.Email,
          role: user.Role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Example of a protected route
app.get('/api/users/profile', authenticateToken, (req, res) => {
  // Get user profile based on the authenticated user
  const query = 'SELECT UserID, UserName, Email, Role, CreatedAt FROM Users WHERE UserID = ?';
  db.query(query, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ user: results[0] });
  });
});


// getting all tables
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM Products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.get('/api/Categories', (req, res) => {
  db.query('SELECT * FROM Categories', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});



app.get('/api/Stock-Movements', (req, res) => {
  db.query('SELECT * FROM StockMovements', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.get('/api/Replenishments', (req, res) => {
  db.query('SELECT * FROM Replenishments', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});





// Example of a protected route

app.get("/users", (req, res) => {
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



app.put("/users/:id", async (req, res) => {
  const { UserName, Email, PasswordHash, Role } = req.body;

  try {
    let hashedPassword = PasswordHash;
    
    if (PasswordHash) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);
    }

    const sql = "UPDATE Users SET UserName=?, Email=?, PasswordHash=?, Role=? WHERE UserID=?";
    db.query(sql, [UserName, Email, hashedPassword, Role, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  const { UserName, Email, PasswordHash, Role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);

    const sql = "INSERT INTO Users (UserName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)";
    db.query(sql, [UserName, Email, hashedPassword, Role], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User added successfully", userId: result.insertId });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM Users WHERE UserID=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});


app.post('/api/requests', (req, res) => {
  const { UserID, ProductID, QuantityRequested } = req.body;

  if (!UserID || !ProductID || QuantityRequested <= 0) {
      return res.status(400).json({ error: 'Invalid input data' });
  }

  const query = 'INSERT INTO Requests (UserID, ProductID, QuantityRequested) VALUES (?, ?, ?)';
  db.query(query, [UserID, ProductID, QuantityRequested], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database insert error' });
      res.json({ message: 'Request added successfully', requestID: result.insertId });
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});