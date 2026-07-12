import { Router } from 'express';
import { getAuditCycles, createAuditCycle, submitAuditResult, closeAuditCycle } from '../controllers/auditController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getAuditCycles);
router.post('/', authorizeRole(['ADMIN', 'ASSET_MANAGER']), createAuditCycle);
router.post('/result', authorizeRole(['ADMIN', 'ASSET_MANAGER']), submitAuditResult);
router.post('/:id/close', authorizeRole(['ADMIN', 'ASSET_MANAGER']), closeAuditCycle);

export default router;
