import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rsvp: { type: String, enum: ["yes", "no", "pending"], default: "pending" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

export const Guest = mongoose.model("Guest", guestSchema);