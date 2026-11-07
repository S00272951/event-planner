import request from 'supertest';
import { app } from '../../src/app';

const newGuest = {
    name: 'John Murphy',
    email: 'john@example.com',
    rsvp: 'yes'
};

let eventId = '';
let guestId = '';

// every guest needs an event, so make one first
beforeAll(async () => {
    const response = await request(app)
        .post('/api/v1/events')
        .send({ title: 'Guest Test Party', date: '2026-12-20', location: 'Guestville' });
    eventId = response.body._id;
});

// deleting the event also deletes any guests left over
afterAll(async () => {
    await request(app).delete(`/api/v1/events/${eventId}`);
});

describe('Guest create, read, update, delete', () => {
    it('adds a guest to the event', async () => {
        const response = await request(app)
            .post(`/api/v1/events/${eventId}/guests`)
            .send(newGuest);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John Murphy');
        guestId = response.body._id;
    });

    it('does not add a guest with bad data', async () => {
        const response = await request(app)
            .post(`/api/v1/events/${eventId}/guests`)
            .send({ name: '', email: 'not-an-email' });

        expect(response.status).toBe(400);
    });

    it('gets the guests for the event', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}/guests`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('filters the guests by rsvp', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}/guests?rsvp=no`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });

    it('returns 400 for a bad rsvp filter', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}/guests?rsvp=maybe`);

        expect(response.status).toBe(400);
    });

    it('updates the guest', async () => {
        const response = await request(app)
            .put(`/api/v1/guests/${guestId}`)
            .send({ ...newGuest, rsvp: 'no' });

        expect(response.status).toBe(200);
        expect(response.body.rsvp).toBe('no');
    });

    it('deletes the guest', async () => {
        const response = await request(app)
            .delete(`/api/v1/guests/${guestId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Guest deleted');
    });

    it('cannot find the deleted guest', async () => {
        const response = await request(app)
            .get(`/api/v1/guests/${guestId}`);

        expect(response.status).toBe(404);
    });
});
