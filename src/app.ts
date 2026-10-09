import express from "express";
import eventRoutes from "./routes/events";
import guestRoutes from "./routes/guests";

const app = express();

app.use(express.json());

app.use("/events", eventRoutes);
app.use(guestRoutes);

app.get("/", (req, res) => {
  res.send("Event Planner API is running");
});

export default app;