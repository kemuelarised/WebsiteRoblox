const express = require("express");
const { db } = require("../db/knex");

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    await db.raw("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || "db_error" });
  }
});

module.exports = { healthRouter: router };

