import { Router } from 'express';
import { signup, login, me, getAllUsers, updateUserRole } from '../controllers/authController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, me);

// User directory & management (Admin only)
router.get('/users', authenticate, getAllUsers);
router.put('/users/role', authenticate, authorizeRole(['ADMIN']), updateUserRole);

export default router;
