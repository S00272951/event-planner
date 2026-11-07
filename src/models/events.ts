import { Schema, model } from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - location
 *       properties:
 *         title:
 *           type: string
 *           example: Sarah's Wedding
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-12-20"
 *         location:
 *           type: string
 *           example: Sligo
 *         description:
 *           type: string
 *           example: Ceremony and reception
 */

export const createEventZSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.coerce.date(),
  location: z.string().min(1),
  description: z.string().max(500).optional(),
});

export const updateEventZSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.coerce.date(),
  location: z.string().min(1),
  description: z.string().max(500).optional(),
});

export interface IEvent {
  title: string;
  date: Date;
  location: string;
  description?: string;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const EventModel = model<IEvent>('Event', eventSchema);
