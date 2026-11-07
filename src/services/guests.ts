import { GuestModel, IGuest } from '../models/guests';
import { HydratedDocument } from 'mongoose';

export class GuestService {

  // if an rsvp is given only return guests with that rsvp
  async getGuestsForEvent(eventId: string, rsvp?: IGuest['rsvp']): Promise<IGuest[]> {
    if (rsvp) {
      return await GuestModel.find({ event: eventId, rsvp: rsvp }).lean();
    }
    return await GuestModel.find({ event: eventId }).lean();
  }

  async getGuestById(id: string): Promise<IGuest | null> {
    return await GuestModel.findById(id).lean();
  }

  async createGuest(guestData: IGuest): Promise<HydratedDocument<IGuest>> {
    const guest = new GuestModel(guestData);
    return await guest.save();
  }

  async updateGuest(id: string, guestData: Partial<IGuest>): Promise<IGuest | null> {
    return await GuestModel.findByIdAndUpdate(id, guestData, { returnDocument: 'after' }).lean();
  }

  async deleteGuest(id: string): Promise<IGuest | null> {
    return await GuestModel.findByIdAndDelete(id).lean();
  }
}
