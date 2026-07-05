import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

// Define the shape of your decoded JWT payload
export interface UserPayload {
  id: string;
  email: string;
}

// Extend the Express Request type to include the user payload
export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // 1. Reads the token from the Authorization header — format is Bearer <token>
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 2. Returns 401 if no token is provided (or if format is incorrect)
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  // Extract the actual token string after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verifies the token using jwt.verify and your JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    // 5. Attaches the decoded user payload to req so controllers can access it
    req.user = decoded;

    // 6. Calls next() to pass control to the next handler
    next();
  } catch (error) {
    // 4. Returns 401 if the token is invalid or expired
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};