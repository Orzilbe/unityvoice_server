import 'dotenv/config';  // טען קובץ סביבה
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());  // לפירוש application/json
app.use(express.urlencoded({ extended: true }));  // לפירוש application/x-www-form-urlencoded

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('שרת ה-Backend פועל! מחובר למסד הנתונים "unityvoice"');
});

// Database connection test
app.get('/db-test', async (req, res) => {
  try {
    // בדוק את החיבור
    const connectionResult = await pool.query('SELECT NOW()');
    
    // קבל רשימת טבלאות לאימות המבנה
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    res.json({
      status: 'success',
      message: 'התחברות למסד הנתונים בוצעה בהצלחה',
      serverTime: connectionResult.rows[0].now,
      tables
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה בהתחברות למסד הנתונים',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to check the server`);
});