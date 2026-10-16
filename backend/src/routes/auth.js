import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

const nameValidator = body('name')
  .trim()
  .isLength({ min: 2, max: 60 })
  .withMessage('Name must be 2–60 characters');

const emailValidator = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('A valid email is required');

export const passwordValidator = body('password')
  .isLength({ min: 8, max: 72 })
  .withMessage('Password must be 8–72 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('Password must contain at least one special character (!@#$%^&*)');

const newPasswordValidator = body('newPassword')
  .isLength({ min: 8, max: 72 })
  .withMessage('New password must be 8–72 characters')
  .matches(/[A-Z]/)
  .withMessage('New password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('New password must contain at least one special character (!@#$%^&*)');

const addressValidator = body('address')
  .optional()
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

router.post('/register', [nameValidator, emailValidator, passwordValidator, addressValidator], authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.patch('/change-password', [authenticate, newPasswordValidator], authController.changePassword);

export default router;
