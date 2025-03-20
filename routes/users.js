<<<<<<< HEAD
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getUserByEmail, getUserTasks } from '../models/users.js';

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'משתמש לא נמצא'
      });
    }
    
    res.json({
      status: 'success',
      user: {
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        phoneNumber: user.PhoneNumber,
        yearOfBirth: user.YearOfBirth,
        englishLevel: user.EnglishLevel,
        profilePicture: user.ProfilePicture,
        score: user.Score
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה בקבלת פרופיל המשתמש',
      error: error.message
    });
  }
});

// Get user tasks
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await getUserTasks(req.user.email);
    
    res.json({
      status: 'success',
      tasks
    });
  } catch (error) {
    console.error('Error getting user tasks:', error);
    res.status(500).json({
      status: 'error',
      message: 'שגיאה בקבלת המשימות של המשתמש',
      error: error.message
    });
  }
});


export default router;