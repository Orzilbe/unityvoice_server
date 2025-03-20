<<<<<<< HEAD
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, registerUser, getLevels } from '../models/users.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      yearOfBirth, 
      englishLevel, 
      profilePicture, 
      levelId 
    } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'נא למלא את כל השדות החובה' 
      });
    }
    
    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'כתובת האימייל כבר קיימת במערכת'
      });
    }
    
    // Register user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phoneNumber || '',
      yearOfBirth: yearOfBirth || null,
      englishLevel: englishLevel || 'beginner',
      profilePicture: profilePicture || null,
      levelId: levelId || 1 // Default level
    };
    
    const newUser = await registerUser(userData);
    
    // Create JWT token
    const token = jwt.sign(
      { email: newUser.Email, name: `${newUser.FirstName} ${newUser.LastName}` },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'משתמש נרשם בהצלחה',
      user: {
        email: newUser.Email,
        firstName: newUser.FirstName,
        lastName: newUser.LastName,
        englishLevel: newUser.EnglishLevel,
        score: newUser.Score
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה ברישום המשתמש',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'נא למלא את כל השדות הנדרשים' 
      });
    }
    
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'אימייל או סיסמה שגויים'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'אימייל או סיסמה שגויים'
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { email: user.Email, name: `${user.FirstName} ${user.LastName}` },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      status: 'success',
      message: 'התחברות בוצעה בהצלחה',
      user: {
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        englishLevel: user.EnglishLevel,
        score: user.Score
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה בהתחברות',
      error: error.message
    });
  }
});

// Get all levels (for registration form)
router.get('/levels', async (req, res) => {
  try {
    const levels = await getLevels();
    res.json({
      status: 'success',
      levels
    });
  } catch (error) {
    console.error('Error getting levels:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה בקבלת רמות',
      error: error.message
    });
  }
});
