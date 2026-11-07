import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { updateGuestZSchema } from '../models/guests';
import { GuestController } from '../controllers/guests';

const router = Router();
const guestController = new GuestController();

router.get('/:id', guestController.getGuestById);
router.put('/:id', validate(updateGuestZSchema), guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

export default router;
