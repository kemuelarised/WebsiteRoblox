exports.up = async function up(knex) {
  await knex.schema.createTable("gigs", (t) => {
    t.increments("id").primary();
    t.string("title", 120).notNullable();
    t.string("slug", 160).notNullable().unique();
    t.string("short_description", 220).notNullable();

    // ✅ Postgres: use text (no longtext)
    t.text("description").notNullable();

    t.decimal("price_from", 10, 2).nullable();
    t.integer("delivery_days").notNullable().defaultTo(7);
    t.string("thumbnail_url", 500).nullable();

    // ✅ Postgres: prefer jsonb
    t.jsonb("gallery_urls").nullable();
    t.jsonb("tags").nullable();

    t.boolean("is_active").notNullable().defaultTo(true);

    // ✅ Postgres-friendly timestamps
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index(["is_active", "created_at"]);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("gigs");
};
