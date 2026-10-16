import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as ownerController from '../controllers/ownerController.js';

const router = Router();

router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', ownerController.getDashboard);

export default router;
