<<<<<<< HEAD
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'אין הרשאת גישה, לא נמצא טוקן אימות' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user email from payload to request object
    req.user = {
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      status: 'error', 
      message: 'טוקן לא תקין או פג תוקף' 
    });
  }
};

