const express = require("express");
const router = express.Router();

const { pool } = require("../db");
const { adminAuth } = require("../middleware/adminAuth");

// =======================
// PUBLIC: create inquiry
// =======================
router.post("/inquiries", async (req, res, next) => {
  try {
    const { gigId, gigSlug, name, contact, message } = req.body || {};

    if (!contact || !message) {
      return res.status(400).json({ error: "Contact and message are required." });
    }

    const result = await pool.query(
      `INSERT INTO inquiries (gig_id, gig_slug, name, contact, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [gigId || null, gigSlug || null, name || null, String(contact), String(message)]
    );

    return res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    return next(err);
  }
});

// =======================
// ADMIN: list inquiries
// =======================
router.get("/admin/inquiries", adminAuth, async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, gig_id, gig_slug, name, contact, message, status, created_at, updated_at
       FROM inquiries
       ORDER BY created_at DESC
       LIMIT 200`
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

// =======================
// ADMIN: get one inquiry
// =======================
router.get("/admin/inquiries/:id", adminAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id." });
    }

    const result = await pool.query(
      `SELECT id, gig_id, gig_slug, name, contact, message, status, created_at, updated_at
       FROM inquiries
       WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

// =======================
// ADMIN: update status
// =======================
router.patch("/admin/inquiries/:id", adminAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    const allowed = new Set(["new", "read", "archived"]);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id." });
    }
    if (!allowed.has(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const result = await pool.query(
      `UPDATE inquiries SET status = $1 WHERE id = $2`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = { inquiriesRouter: router };