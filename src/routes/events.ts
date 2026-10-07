import { Router } from "express";
import mongoose from "mongoose";
import { Event } from "../models/event";
import { Guest } from "../models/guest";
import { eventSchema } from "../schemas/event.schema";

const router = Router();

// GET all events, with optional ?location=Sligo and ?sort=date
router.get("/", async (req, res) => {
  const filter: Record<string, string> = {};
  if (typeof req.query.location === "string") {
    filter.location = req.query.location;
  }

  let query = Event.find(filter);
  if (req.query.sort === "date") {
    query = query.sort({ date: 1 });
  }

  const events = await query;
  res.json(events);
});

// GET one event
router.get("/:id", async (req, res) => {
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
  res.json(event);
});

// POST a new event
router.post("/", async (req, res) => {
  const result = eventSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const event = await Event.create(result.data);
  res.status(201).json(event);
});

// PUT update an event
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid event id" });
    return;
  }

  const result = eventSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.issues });
    return;
  }

  const event = await Event.findByIdAndUpdate(id, result.data, { new: true });
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }
  res.json(event);
});

// DELETE an event (and its guests)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid event id" });
    return;
  }

  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  await Guest.deleteMany({ event: id });
  res.status(204).send();
});

export default router;