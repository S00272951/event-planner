import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { Event } from "../src/models/event";

const missingId = "000000000000000000000000";

const goodEvent = {
  title: "Test Wedding",
  date: "2026-12-20",
  location: "Sligo",
  description: "Test event",
};

describe("POST /events", () => {
  it("creates an event with good data", async () => {
    const res = await request(app).post("/events").send(goodEvent);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Wedding");
  });

  it("fails with bad data", async () => {
    const res = await request(app).post("/events").send({ title: "A", date: "bad" });
    expect(res.status).toBe(400);
  });
});

describe("GET /events", () => {
  it("returns all events", async () => {
    await Event.create(goodEvent);
    await Event.create({ ...goodEvent, title: "Birthday Party" });

    const res = await request(app).get("/events");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("filters by location", async () => {
    await Event.create(goodEvent);
    await Event.create({ ...goodEvent, location: "Galway" });

    const res = await request(app).get("/events?location=Sligo");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].location).toBe("Sligo");
  });
});

describe("GET /events/:id", () => {
  it("returns one event", async () => {
    const event = await Event.create(goodEvent);
    const res = await request(app).get(`/events/${event._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Test Wedding");
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).get(`/events/${missingId}`);
    expect(res.status).toBe(404);
  });

  it("returns 400 for an invalid id", async () => {
    const res = await request(app).get("/events/abc");
    expect(res.status).toBe(400);
  });
});

describe("PUT /events/:id", () => {
  it("updates an event", async () => {
    const event = await Event.create(goodEvent);
    const res = await request(app)
      .put(`/events/${event._id}`)
      .send({ ...goodEvent, title: "Updated Wedding" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Wedding");
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).put(`/events/${missingId}`).send(goodEvent);
    expect(res.status).toBe(404);
  });

  it("returns 400 with bad data", async () => {
    const event = await Event.create(goodEvent);
    const res = await request(app).put(`/events/${event._id}`).send({ title: "" });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /events/:id", () => {
  it("deletes an event", async () => {
    const event = await Event.create(goodEvent);
    const res = await request(app).delete(`/events/${event._id}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 if not found", async () => {
    const res = await request(app).delete(`/events/${missingId}`);
    expect(res.status).toBe(404);
  });
});