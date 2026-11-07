import { EventModel, IEvent } from '../models/events';
import { GuestModel } from '../models/guests';
import { HydratedDocument } from 'mongoose';

export class EventService {

  // if a location is given only return events in that location
  // events are always sorted by date, earliest first
  async getAllEvents(location?: string): Promise<IEvent[]> {
    if (location) {
      return await EventModel.find({ location: location }).sort({ date: 1 }).lean();
    }
    return await EventModel.find().sort({ date: 1 }).lean();
  }

  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).lean();
  }

  async createEvent(eventData: IEvent): Promise<HydratedDocument<IEvent>> {
    const event = new EventModel(eventData);
    return await event.save();
  }

  async updateEvent(id: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    return await EventModel.findByIdAndUpdate(id, eventData, { returnDocument: 'after' }).lean();
  }

  // when an event is deleted its guests are deleted too
  async deleteEvent(id: string): Promise<IEvent | null> {
    const deletedEvent = await EventModel.findByIdAndDelete(id).lean();
    if (deletedEvent) {
      await GuestModel.deleteMany({ event: id });
    }
    return deletedEvent;
  }
}
