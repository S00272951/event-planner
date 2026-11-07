import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateGuestInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: John Murphy
 *         email:
 *           type: string
 *           example: john@example.com
 *         rsvp:
 *           type: string
 *           enum: [yes, no, pending]
 *           example: pending
 */

export const createGuestZSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  rsvp: z.enum(['yes', 'no', 'pending']).optional(),
});

export const updateGuestZSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  rsvp: z.enum(['yes', 'no', 'pending']).optional(),
});

export interface IGuest {
  name: string;
  email: string;
  rsvp?: 'yes' | 'no' | 'pending';
  event: Types.ObjectId;
}

const guestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rsvp: { type: String, enum: ['yes', 'no', 'pending'], default: 'pending' },
    // the id of the event this guest belongs to
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  { timestamps: true }
);

export const GuestModel = model<IGuest>('Guest', guestSchema);
