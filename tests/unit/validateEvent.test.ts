import { createEventZSchema } from '../../src/models/events';
import { createGuestZSchema } from '../../src/models/guests';

const validEvent = {
    title: 'Sarah\'s Wedding',
    date: '2026-12-20',
    location: 'Sligo'
};

const validGuest = {
    name: 'John Murphy',
    email: 'john@example.com'
};

describe('Test Event Validation', () => {
    it('should pass for valid data', () => {
        expect(() => createEventZSchema.parse(validEvent)).not.toThrow();
    });

    it('should fail for a title that is too short', () => {
        expect(() => createEventZSchema.parse({ ...validEvent, title: 'A' })).toThrow();
    });

    it('should fail for a date that is not a date', () => {
        expect(() => createEventZSchema.parse({ ...validEvent, date: 'not a date' })).toThrow();
    });

    it('should fail for a missing location', () => {
        expect(() => createEventZSchema.parse({ ...validEvent, location: undefined })).toThrow();
    });
});

describe('Test Guest Validation', () => {
    it('should pass for valid data', () => {
        expect(() => createGuestZSchema.parse(validGuest)).not.toThrow();
    });

    it('should fail for a bad email', () => {
        expect(() => createGuestZSchema.parse({ ...validGuest, email: 'not-an-email' })).toThrow();
    });

    it('should fail for a bad rsvp', () => {
        expect(() => createGuestZSchema.parse({ ...validGuest, rsvp: 'maybe' })).toThrow();
    });
});
