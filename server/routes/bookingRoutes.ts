import { Router } from 'express';
import { getBookings, createBooking, cancelBooking } from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBookings);
router.post('/', createBooking);
router.post('/:id/cancel', cancelBooking);

export default router;
