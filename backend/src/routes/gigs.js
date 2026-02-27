const express = require("express");
const slugify = require("slugify");
const { z } = require("zod");
const { db } = require("../db/knex");
const { adminAuth } = require("../middleware/adminAuth");

const router = express.Router();

function safeParseJson(v, fallback) {
  if (v == null) return fallback;
  if (Array.isArray(v) || typeof v === "object") return v;
  if (typeof v === "string" && v.trim() === "") return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

function normalizeGig(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    priceFrom: row.price_from != null ? Number(row.price_from) : null,
    deliveryDays: row.delivery_days,
    thumbnailUrl: row.thumbnail_url,
    galleryUrls: safeParseJson(row.gallery_urls, []),
    tags: safeParseJson(row.tags, []),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function generateUniqueSlug(title) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  let slug = base || `gig-${Date.now()}`;
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db("gigs").select("id").where({ slug }).first();
    if (!existing) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

const gigCreateSchema = z.object({
  title: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(220),
  description: z.string().min(30).max(10000),
  priceFrom: z.number().nonnegative().optional().nullable(),
  deliveryDays: z.number().int().positive().max(365).optional().default(7),
  thumbnailUrl: z.string().url().optional().nullable(),
  galleryUrls: z.array(z.string().url()).optional().default([]),
  tags: z.array(z.string().min(1).max(30)).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

const gigUpdateSchema = gigCreateSchema.partial().extend({
  slug: z.string().min(3).max(160).optional(),
});

router.get("/gigs", async (_req, res) => {
  const rows = await db("gigs")
    .select("*")
    .where({ is_active: 1 })
    .orderBy("created_at", "desc");
  res.json(rows.map(normalizeGig));
});

router.get("/gigs/:slugOrId", async (req, res) => {
  const { slugOrId } = req.params;
  const isNumericId = /^[0-9]+$/.test(slugOrId);

  const row = await db("gigs")
    .select("*")
    .where(isNumericId ? { id: Number(slugOrId) } : { slug: slugOrId })
    .andWhere({ is_active: 1 })
    .first();

  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(normalizeGig(row));
});

router.post("/gigs", adminAuth, async (req, res) => {
  const parsed = gigCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });

  const data = parsed.data;
  const slug = await generateUniqueSlug(data.title);
  const now = new Date();

  const [id] = await db("gigs").insert({
    title: data.title,
    slug,
    short_description: data.shortDescription,
    description: data.description,
    price_from: data.priceFrom ?? null,
    delivery_days: data.deliveryDays ?? 7,
    thumbnail_url: data.thumbnailUrl ?? null,
    gallery_urls: JSON.stringify(data.galleryUrls ?? []),
    tags: JSON.stringify(data.tags ?? []),
    is_active: data.isActive ? 1 : 0,
    created_at: now,
    updated_at: now,
  });

  const created = await db("gigs").select("*").where({ id }).first();
  res.status(201).json(normalizeGig(created));
});

router.put("/gigs/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = gigUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });

  const patch = parsed.data;
  const update = { updated_at: new Date() };

  if (patch.title != null) update.title = patch.title;
  if (patch.slug != null) update.slug = patch.slug;
  if (patch.shortDescription != null) update.short_description = patch.shortDescription;
  if (patch.description != null) update.description = patch.description;
  if (patch.priceFrom !== undefined) update.price_from = patch.priceFrom ?? null;
  if (patch.deliveryDays != null) update.delivery_days = patch.deliveryDays;
  if (patch.thumbnailUrl !== undefined) update.thumbnail_url = patch.thumbnailUrl ?? null;
  if (patch.galleryUrls != null) update.gallery_urls = JSON.stringify(patch.galleryUrls);
  if (patch.tags != null) update.tags = JSON.stringify(patch.tags);
  if (patch.isActive != null) update.is_active = patch.isActive ? 1 : 0;

  const updatedCount = await db("gigs").where({ id }).update(update);
  if (!updatedCount) return res.status(404).json({ error: "Not found" });

  const updated = await db("gigs").select("*").where({ id }).first();
  res.json(normalizeGig(updated));
});

router.delete("/gigs/:id", adminAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

  const updatedCount = await db("gigs").where({ id }).update({ is_active: 0, updated_at: new Date() });
  if (!updatedCount) return res.status(404).json({ error: "Not found" });

  res.status(204).send();
});

module.exports = { gigsRouter: router };

