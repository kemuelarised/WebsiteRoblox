require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { healthRouter } = require("./routes/health");
const { gigsRouter } = require("./routes/gigs");
const { inquiriesRouter } = require("./routes/inquiries");
const { authRouter } = require("./routes/auth");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Roblox gigs API running");
});

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", gigsRouter);
app.use("/api", inquiriesRouter);

module.exports = app;
