import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, authorize('admin'));

const nameValidator = body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters');
const emailValidator = body('email').isEmail().normalizeEmail().withMessage('A valid email is required');
const passwordValidator = body('password')
  .isLength({ min: 8, max: 72 }).withMessage('Password must be 8–72 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)');
const roleValidator = body('role')
  .isIn(['admin', 'user', 'store_owner'])
  .withMessage('Role must be admin, user, or store_owner');
const addressValidator = body('address').optional().trim().isLength({ max: 400 }).withMessage('Address max 400 chars');

const storeNameValidator = body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Store name is required (max 120 chars)');
const storeEmailValidator = body('email').isEmail().normalizeEmail().withMessage('A valid store email is required');
const ownerIdValidator = body('owner_id').isInt({ min: 1 }).withMessage('A valid owner_id is required');

router.get('/dashboard', adminController.getDashboard);

router.get('/users', adminController.getUsers);
router.post('/users', [nameValidator, emailValidator, passwordValidator, roleValidator, addressValidator], adminController.createUser);
router.get('/users/:id', adminController.getUserById);

router.get('/stores', adminController.getStores);
router.post('/stores', [storeNameValidator, storeEmailValidator, addressValidator, ownerIdValidator], adminController.createStore);
router.get('/stores/:id', adminController.getStoreById);

export default router;
