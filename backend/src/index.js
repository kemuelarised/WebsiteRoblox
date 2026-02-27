require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { healthRouter } = require("./routes/health");
const { gigsRouter } = require("./routes/gigs");
const { inquiriesRouter } = require("./routes/inquiries");
const { authRouter } = require("./routes/auth");

const app = express();

// CORS (slash-proof)
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "").replace(/\/$/, "");
console.log("CORS FRONTEND_ORIGIN =", FRONTEND_ORIGIN || "(any)");

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: FRONTEND_ORIGIN ? FRONTEND_ORIGIN : true,
    credentials: false,
  })
);
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.type("text/plain").send("Roblox gigs API running");
});

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", gigsRouter);
app.use("/api", inquiriesRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 5050);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
