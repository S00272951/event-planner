import { Router } from "express";
import mongoose from "mongoose";
import { Event } from "../models/event";
import { Guest } from "../models/guest";
import { guestSchema } from "../schemas/guest.schema";

const router = Router();

// GET all guests for an event, with optional ?rsvp=yes
router.get("/events/:id/guests", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid event id" });
    return;
  }

  const event = await Event.findById(id);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  const filter: Record<string, string> = { event: id };
  if (typeof req.query.rsvp === "string") {
    filter.rsvp = req.query.rsvp;
  }

  const guests = await Guest.find(filter);
  res.json(guests);
});

// POST a guest to an event
router.post("/events/:id/guests", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid event id" });
    return;
  }

  const event = await Event.findById(id);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  const result = guestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const guest = await Guest.create({ ...result.data, event: id });
  res.status(201).json(guest);
});

// GET one guest
router.get("/guests/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid guest id" });
    return;
  }

  const guest = await Guest.findById(id);
  if (!guest) {
    res.status(404).json({ message: "Guest not found" });
    return;
  }
  res.json(guest);
});

// PUT update a guest
router.put("/guests/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid guest id" });
    return;
  }

  const result = guestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const guest = await Guest.findByIdAndUpdate(id, result.data, { new: true });
  if (!guest) {
    res.status(404).json({ message: "Guest not found" });
    return;
  }
  res.json(guest);
});

// DELETE a guest
router.delete("/guests/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid guest id" });
    return;
  }

  const guest = await Guest.findByIdAndDelete(id);
  if (!guest) {
    res.status(404).json({ message: "Guest not found" });
    return;
  }
  res.status(204).send();
});

export default router;