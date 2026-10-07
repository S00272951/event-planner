import eventRoutes from "./routes/events";
import express from "express";

const app = express();

app.use(express.json());
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Event Planner API is running");
});

export default app;