import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend Express Request to include user context
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: { message: 'Access denied. No token provided.' } });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach the decoded payload (e.g., { userId: '123' }) to the request
    next();
  } catch (error) {
    return res.status(403).json({ error: { message: 'Invalid or expired token.' } });
  }
};
