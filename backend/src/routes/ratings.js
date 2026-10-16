import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import * as ratingController from '../controllers/ratingController.js';

const router = Router();

router.use(authenticate, authorize('user'));

const valueValidator = body('value')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating value must be an integer between 1 and 5');

const storeIdValidator = body('store_id')
  .isInt({ min: 1 })
  .withMessage('A valid store_id is required');

router.post('/', [storeIdValidator, valueValidator], ratingController.createRating);
router.put('/:id', [valueValidator], ratingController.updateRating);

export default router;
