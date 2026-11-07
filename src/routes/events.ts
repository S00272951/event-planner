import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createEventZSchema, updateEventZSchema } from '../models/events';
import { createGuestZSchema } from '../models/guests';
import { EventController } from '../controllers/events';
import { GuestController } from '../controllers/guests';

const router = Router();
const eventController = new EventController();
const guestController = new GuestController();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', validate(createEventZSchema), eventController.createEvent);
router.put('/:id', validate(updateEventZSchema), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// the guests that belong to one event
router.get('/:id/guests', guestController.getGuestsForEvent);
router.post('/:id/guests', validate(createGuestZSchema), guestController.createGuest);

export default router;
