import { Router } from 'express';
import { getMaintenanceRequests, createMaintenanceRequest, updateMaintenanceStatus } from '../controllers/maintenanceController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getMaintenanceRequests);
router.post('/', createMaintenanceRequest);
router.put('/:id/status', authorizeRole(['ADMIN', 'ASSET_MANAGER']), updateMaintenanceStatus);

export default router;
