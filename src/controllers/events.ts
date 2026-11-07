import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { EventService } from '../services/events';

const eventService = new EventService();

export class EventController {

  /**
   * @openapi
   * /events:
   *   get:
   *     summary: Get all events, sorted by date
   *     tags:
   *       - Events
   *     parameters:
   *       - in: query
   *         name: location
   *         required: false
   *         description: Only return events in this location
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully retrieved events
   *       500:
   *         description: Internal server error
   */
  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      // the location filter is optional, e.g. /events?location=Sligo
      const location = typeof req.query.location === 'string' ? req.query.location : undefined;
      const events = await eventService.getAllEvents(location);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  };

  /**
   * @openapi
   * /events/{id}:
   *   get:
   *     summary: Get an event by ID
   *     tags:
   *       - Events
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Event found
   *       400:
   *         description: Invalid event id
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  getEventById = async (req: Request, res: Response): Promise<void> => {
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
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event', error });
    }
  };

  /**
   * @openapi
   * /events:
   *   post:
   *     summary: Create a new event
   *     tags:
   *       - Events
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEventInput'
   *     responses:
   *       201:
   *         description: Successfully created event
   *       400:
   *         description: Validation failed
   *       500:
   *         description: Internal server error
   */
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error inserting into MongoDB', error });
    }
  };

  /**
   * @openapi
   * /events/{id}:
   *   put:
   *     summary: Update an event
   *     tags:
   *       - Events
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
   *             $ref: '#/components/schemas/CreateEventInput'
   *     responses:
   *       200:
   *         description: Event updated
   *       400:
   *         description: Invalid event id or validation failed
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid event id' });
        return;
      }

      const updatedEvent = await eventService.updateEvent(id, req.body);
      if (!updatedEvent) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  };

  /**
   * @openapi
   * /events/{id}:
   *   delete:
   *     summary: Delete an event and all of its guests
   *     tags:
   *       - Events
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Event deleted
   *       400:
   *         description: Invalid event id
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid event id' });
        return;
      }

      const deletedEvent = await eventService.deleteEvent(id);
      if (!deletedEvent) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      res.status(200).json({ message: 'Event deleted', event: deletedEvent });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting event', error });
    }
  };
}
