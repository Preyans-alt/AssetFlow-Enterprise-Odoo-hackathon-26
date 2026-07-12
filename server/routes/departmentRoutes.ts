import { Router } from 'express';
import { getDepartments, createDepartment, updateDepartment } from '../controllers/departmentController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getDepartments);
router.post('/', authorizeRole(['ADMIN']), createDepartment);
router.put('/:id', authorizeRole(['ADMIN']), updateDepartment);

export default router;
