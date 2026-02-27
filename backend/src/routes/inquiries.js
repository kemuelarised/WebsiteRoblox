const express = require("express");
const { z } = require("zod");
const { db } = require("../db/knex");
const { adminAuth } = require("../middleware/adminAuth");

const router = express.Router();

const inquiryCreateSchema = z.object({
  gigId: z.number().int().positive(),
  name: z.string().min(2).max(80),
  contact: z.string().min(3).max(160),
  message: z.string().min(10).max(2000),
});

const inquiryStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"]).optional(),
});

router.post("/inquiries", async (req, res) => {
  const parsed = inquiryCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });

  const gig = await db("gigs").select("id").where({ id: parsed.data.gigId, is_active: 1 }).first();
  if (!gig) return res.status(404).json({ error: "Gig not found" });

  const now = new Date();
  const [id] = await db("inquiries").insert({
    gig_id: parsed.data.gigId,
    name: parsed.data.name,
    contact: parsed.data.contact,
    message: parsed.data.message,
    status: "new",
    created_at: now,
  });

  res.status(201).json({ id });
});

router.get("/admin/inquiries", adminAuth, async (_req, res) => {
  const rows = await db("inquiries")
    .select(
      "id",
      "gig_id as gigId",
      "name",
      "contact",
      "message",
      "status",
      "created_at as createdAt"
    )
    .orderBy("created_at", "desc");
  res.json(rows);
});

router.get("/admin/inquiries/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

  const row = await db("inquiries")
    .select(
      "id",
      "gig_id as gigId",
      "name",
      "contact",
      "message",
      "status",
      "created_at as createdAt"
    )
    .where({ id })
    .first();

  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

router.patch("/admin/inquiries/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = inquiryStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });

  const patch = {};
  if (parsed.data.status) patch.status = parsed.data.status;

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const updated = await db("inquiries").where({ id }).update(patch);
  if (!updated) return res.status(404).json({ error: "Not found" });

  const row = await db("inquiries")
    .select(
      "id",
      "gig_id as gigId",
      "name",
      "contact",
      "message",
      "status",
      "created_at as createdAt"
    )
    .where({ id })
    .first();

  res.json(row);
});

module.exports = { inquiriesRouter: router };

