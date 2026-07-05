import { Router, Response  } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Public authentication endpoints
router.post('/register', register);
router.post('/login', login);

// Protected endpoint to fetch current user data
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  // Returns the current user from req.user
  res.status(200).json({
    user: req.user
  });
});

export default router;