import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import { getAllCoordinators, createCoordinator } from '../controllers/admin.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRole('admin'));
router.get('/coordinators', getAllCoordinators);
router.post('/coordinators', createCoordinator);
// Protect route and only allow admin users


export default router;
