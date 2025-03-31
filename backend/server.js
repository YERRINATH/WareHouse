const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

const multer = require('multer');
const path = require('path');


require('dotenv').config();



app.use(cors());
app.use(express.json());

// Database connection
  
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');
});



const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to handle image upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));



// JWT secret
const JWT_SECRET = 'your_jwt_secret_key';
app.use('/uploads', express.static('uploads'));
// Authentication middleware
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

// Mount routes
const authRoutes = require('./routes/authRoutes')(db, JWT_SECRET, authenticateToken);
const userRoutes = require('./routes/userRoutes')(db);
const dataRoutes = require('./routes/dataRoutes')(db);

app.use('/api', authRoutes);  // Authentication routes under /api (e.g., /api/users/register)
app.use('/users', userRoutes); // User CRUD routes under /users (e.g., /users)
app.use('/api', dataRoutes);   // Data and request routes under /api (e.g., /api/products)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});