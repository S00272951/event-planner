import "dotenv/config";
import { beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { Event } from "../src/models/event";
import { Guest } from "../src/models/guest";

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST;
  if (!uri) {
    throw new Error("MONGO_URI_TEST is missing from .env");
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Event.deleteMany({});
  await Guest.deleteMany({});
});