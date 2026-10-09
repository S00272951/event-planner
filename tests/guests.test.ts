import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import { Event } from "../src/models/event";
import { Guest } from "../src/models/guest";

const missingId = "000000000000000000000000";
const goodGuest = { name: "John Murphy", email: "john@example.com", rsvp: "yes" as const };

let eventId: string;

beforeEach(async () => {
  const event = await Event.create({
    title: "Test Wedding",
    date: "2026-12-20",
    location: "Sligo",
  });
  eventId = event._id.toString();
});

describe("POST /events/:id/guests", () => {
  it("adds a guest to an event", async () => {
    const res = await request(app).post(`/events/${eventId}/guests`).send(goodGuest);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("John Murphy");
  });

  it("fails with bad data", async () => {
    const res = await request(app)
      .post(`/events/${eventId}/guests`)
      .send({ name: "", email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("returns 404 if the event does not exist", async () => {
    const res = await request(app).post(`/events/${missingId}/guests`).send(goodGuest);
    expect(res.status).toBe(404);
  });
});

describe("GET /events/:id/guests", () => {
  it("returns guests for an event", async () => {
    await Guest.create({ ...goodGuest, event: eventId });
    await Guest.create({ ...goodGuest, name: "Mary Kelly", rsvp: "no", event: eventId });

    const res = await request(app).get(`/events/${eventId}/guests`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("filters by rsvp", async () => {
    await Guest.create({ ...goodGuest, event: eventId });
    await Guest.create({ ...goodGuest, name: "Mary Kelly", rsvp: "no", event: eventId });

    const res = await request(app).get(`/events/${eventId}/guests?rsvp=yes`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe("GET /guests/:id", () => {
  it("returns one guest", async () => {
    const guest = await Guest.create({ ...goodGuest, event: eventId });
    const res = await request(app).get(`/guests/${guest._id}`);
    expect(res.status).toBe(200);
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).get(`/guests/${missingId}`);
    expect(res.status).toBe(404);
  });
});

describe("PUT /guests/:id", () => {
  it("updates a guest", async () => {
    const guest = await Guest.create({ ...goodGuest, event: eventId });
    const res = await request(app)
      .put(`/guests/${guest._id}`)
      .send({ ...goodGuest, rsvp: "no" });
    expect(res.status).toBe(200);
    expect(res.body.rsvp).toBe("no");
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).put(`/guests/${missingId}`).send(goodGuest);
    expect(res.status).toBe(404);
  });

  it("returns 400 with bad data", async () => {
    const guest = await Guest.create({ ...goodGuest, event: eventId });
    const res = await request(app).put(`/guests/${guest._id}`).send({ email: "bad" });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /guests/:id", () => {
  it("deletes a guest", async () => {
    const guest = await Guest.create({ ...goodGuest, event: eventId });
    const res = await request(app).delete(`/guests/${guest._id}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).delete(`/guests/${missingId}`);
    expect(res.status).toBe(404);
  });
});