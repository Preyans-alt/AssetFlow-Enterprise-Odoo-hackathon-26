import { Router } from 'express';
import { getDashboardKPIs } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/kpis', getDashboardKPIs);

export default router;
