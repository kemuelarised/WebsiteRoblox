const slugify = require("slugify");

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function seed(knex) {
  await knex("inquiries").del();
  await knex("gigs").del();

  const now = new Date();

  const gigs = [
    {
      title: "Modern City Map Build",
      short_description: "A clean, optimized modern city with roads, props, lighting, and detail.",
      description:
        "I will build a modern Roblox city map with optimized parts, realistic lighting, and clean layout. Includes roads, sidewalks, props, and optional interiors depending on scope.\n\nDeliverables: .rbxl file, organized hierarchy, performance-friendly design.",
      price_from: 50,
      delivery_days: 7,
      thumbnail_url:
        "https://images.unsplash.com/photo-1520975958225-6c2b1a8d7d4a?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([]),
      tags: JSON.stringify(["city", "map", "modern"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Fantasy Castle / Kingdom Build",
      short_description: "A fantasy castle with custom terrain, walls, towers, and atmospheric detail.",
      description:
        "I will create a fantasy castle / kingdom build including terrain, castle walls, towers, and set dressing to match your theme. I can match references and your game style.\n\nDeliverables: .rbxl file, clean grouping, color palette consistency.",
      price_from: 80,
      delivery_days: 10,
      thumbnail_url:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([]),
      tags: JSON.stringify(["fantasy", "castle", "terrain"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Small Shop / Interior Build",
      short_description: "A detailed interior (shop, cafe, house) with props and lighting.",
      description:
        "I will build a detailed small interior (shop/cafe/house). Includes custom props, lighting, and a coherent style. Great for roleplay and tycoon games.\n\nDeliverables: .rbxl file, optimized parts, tidy model naming.",
      price_from: 25,
      delivery_days: 4,
      thumbnail_url:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([]),
      tags: JSON.stringify(["interior", "shop", "props"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Low-Poly Simulator Map",
      short_description: "A bright, low‑poly simulator map optimized for mobile players.",
      description:
        "I will design a colorful low‑poly simulator style map with clear progression paths, zones, and AFK areas. Built with mobile performance in mind and clean collision so players do not get stuck.\n\nDeliverables: .rbxl file, organized folders for zones, and reusable props.",
      price_from: 40,
      delivery_days: 6,
      thumbnail_url:
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      ]),
      tags: JSON.stringify(["simulator", "low-poly", "mobile"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Realistic Racing Track Environment",
      short_description: "High‑detail racing track with pits, grandstands, and lighting.",
      description:
        "I will build a detailed racing track environment including track layout, pit lane, grandstands, and props such as barriers and flags. Great for racing and drift games.\n\nDeliverables: .rbxl file with modular track pieces and lighting tuned for speed.",
      price_from: 65,
      delivery_days: 9,
      thumbnail_url:
        "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([
        "https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80",
      ]),
      tags: JSON.stringify(["racing", "track", "realistic"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Lobby / Hangout Hub",
      short_description: "Stylish lobby hub with portals, UI stands, and chill areas.",
      description:
        "I will create a central lobby or hangout hub where players spawn, featuring portals, game info boards, and cozy seating areas. Perfect as the front door for any Roblox experience.\n\nDeliverables: .rbxl file with spawn area, portal frames, and optimized lighting.",
      price_from: 30,
      delivery_days: 5,
      thumbnail_url:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([]),
      tags: JSON.stringify(["lobby", "hub", "social"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
    {
      title: "Obby Course Pack",
      short_description: "Custom obby stages with increasing difficulty and clean style.",
      description:
        "I will design a pack of obby stages with a consistent visual style and gradually increasing difficulty. Includes checkpoints and optional kill parts or moving platforms.\n\nDeliverables: grouped obby stages ready to plug into your existing game.",
      price_from: 35,
      delivery_days: 4,
      thumbnail_url:
        "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
      gallery_urls: JSON.stringify([]),
      tags: JSON.stringify(["obby", "stages", "parkour"]),
      is_active: 1,
      created_at: now,
      updated_at: now,
    },
  ];

  const rows = gigs.map((g) => ({
    ...g,
    slug: slugify(g.title, { lower: true, strict: true, trim: true }),
  }));

  await knex("gigs").insert(rows);
};

