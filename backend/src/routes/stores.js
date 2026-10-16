import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as storeController from '../controllers/storeController.js';

const router = Router();

router.use(authenticate, authorize('user'));

router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);

export default router;
