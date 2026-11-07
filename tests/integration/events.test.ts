import request from 'supertest';
import { app } from '../../src/app';

const newEvent = {
    title: 'Test Wedding',
    date: '2026-12-20',
    location: 'Testville',
    description: 'Made by the tests'
};

let eventId = '';

describe('GET /events', () => {
    it('returns all events', async () => {
        const response = await request(app)
            .get('/api/v1/events');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Event create, read, update, delete', () => {
    it('creates an event', async () => {
        const response = await request(app)
            .post('/api/v1/events')
            .send(newEvent);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Test Wedding');
        eventId = response.body._id;
    });

    it('does not create an event with bad data', async () => {
        const response = await request(app)
            .post('/api/v1/events')
            .send({ title: 'A', date: 'not a date' });

        expect(response.status).toBe(400);
    });

    it('gets the event by id', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(eventId);
    });

    it('finds the event with the location filter', async () => {
        const response = await request(app)
            .get('/api/v1/events?location=Testville');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].location).toBe('Testville');
    });

    it('updates the event', async () => {
        const response = await request(app)
            .put(`/api/v1/events/${eventId}`)
            .send({ ...newEvent, title: 'Updated Wedding' });

        expect(response.status).toBe(200);
    });

    it('shows the updated event', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Wedding');
    });

    it('deletes the event', async () => {
        const response = await request(app)
            .delete(`/api/v1/events/${eventId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Event deleted');
    });

    it('cannot find the deleted event', async () => {
        const response = await request(app)
            .get(`/api/v1/events/${eventId}`);

        expect(response.status).toBe(404);
    });

    it('cannot delete it again', async () => {
        const response = await request(app)
            .delete(`/api/v1/events/${eventId}`);

        expect(response.status).toBe(404);
    });

    it('returns 400 for a bad id', async () => {
        const response = await request(app)
            .get('/api/v1/events/123');

        expect(response.status).toBe(400);
    });
});
