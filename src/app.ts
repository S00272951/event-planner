import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Event Planner API is running");
});

export default app;