import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GuestService } from '../services/guests';
import { EventService } from '../services/events';

const guestService = new GuestService();
const eventService = new EventService();

export class GuestController {

  /**
   * @openapi
   * /events/{id}/guests:
   *   get:
   *     summary: Get the guests for an event
   *     tags:
   *       - Guests
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The event id
   *         schema:
   *           type: string
   *       - in: query
   *         name: rsvp
   *         required: false
   *         description: Only return guests with this rsvp
   *         schema:
   *           type: string
   *           enum: [yes, no, pending]
   *     responses:
   *       200:
   *         description: Successfully retrieved guests
   *       400:
   *         description: Invalid event id or rsvp
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  getGuestsForEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid event id' });
        return;
      }

      // the rsvp filter is optional, e.g. /events/123/guests?rsvp=yes
      const rsvp = req.query.rsvp;
      if (rsvp !== undefined && rsvp !== 'yes' && rsvp !== 'no' && rsvp !== 'pending') {
        res.status(400).json({ message: 'rsvp must be yes, no or pending' });
        return;
      }

      const event = await eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      const guests = await guestService.getGuestsForEvent(id, rsvp);
      res.status(200).json(guests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching guests', error });
    }
  };

  /**
   * @openapi
   * /events/{id}/guests:
   *   post:
   *     summary: Add a guest to an event
   *     tags:
   *       - Guests
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The event id
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateGuestInput'
   *     responses:
   *       201:
   *         description: Successfully added guest
   *       400:
   *         description: Invalid event id or validation failed
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  createGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid event id' });
        return;
      }

      const event = await eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      // the event id comes from the url, not from the body
      const newGuest = await guestService.createGuest({ ...req.body, event: id });
      res.status(201).json(newGuest);
    } catch (error) {
      res.status(500).json({ message: 'Error inserting into MongoDB', error });
    }
  };

  /**
   * @openapi
   * /guests/{id}:
   *   get:
   *     summary: Get a guest by ID
   *     tags:
   *       - Guests
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Guest found
   *       400:
   *         description: Invalid guest id
   *       404:
   *         description: Guest not found
   *       500:
   *         description: Internal server error
   */
  getGuestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid guest id' });
        return;
      }

      const guest = await guestService.getGuestById(id);
      if (!guest) {
        res.status(404).json({ message: 'Guest not found' });
        return;
      }
      res.status(200).json(guest);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching guest', error });
    }
  };

  /**
   * @openapi
   * /guests/{id}:
   *   put:
   *     summary: Update a guest
   *     tags:
   *       - Guests
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateGuestInput'
   *     responses:
   *       200:
   *         description: Guest updated
   *       400:
   *         description: Invalid guest id or validation failed
   *       404:
   *         description: Guest not found
   *       500:
   *         description: Internal server error
   */
  updateGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid guest id' });
        return;
      }

      const updatedGuest = await guestService.updateGuest(id, req.body);
      if (!updatedGuest) {
        res.status(404).json({ message: 'Guest not found' });
        return;
      }
      res.status(200).json(updatedGuest);
    } catch (error) {
      res.status(500).json({ message: 'Error updating guest', error });
    }
  };

  /**
   * @openapi
   * /guests/{id}:
   *   delete:
   *     summary: Delete a guest
   *     tags:
   *       - Guests
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Guest deleted
   *       400:
   *         description: Invalid guest id
   *       404:
   *         description: Guest not found
   *       500:
   *         description: Internal server error
   */
  deleteGuest = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid guest id' });
        return;
      }

      const deletedGuest = await guestService.deleteGuest(id);
      if (!deletedGuest) {
        res.status(404).json({ message: 'Guest not found' });
        return;
      }

      res.status(200).json({ message: 'Guest deleted', guest: deletedGuest });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting guest', error });
    }
  };
}
