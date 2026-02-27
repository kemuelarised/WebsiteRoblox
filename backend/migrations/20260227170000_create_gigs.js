/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable("gigs", (t) => {
    t.increments("id").primary();
    t.string("title", 120).notNullable();
    t.string("slug", 160).notNullable().unique();
    t.string("short_description", 220).notNullable();
    t.specificType("description", "longtext").notNullable();
    t.decimal("price_from", 10, 2).nullable();
    t.integer("delivery_days").notNullable().defaultTo(7);
    t.string("thumbnail_url", 500).nullable();
    t.json("gallery_urls").nullable();
    t.json("tags").nullable();
    t.boolean("is_active").notNullable().defaultTo(true);
    t.dateTime("created_at").notNullable();
    t.dateTime("updated_at").notNullable();

    t.index(["is_active", "created_at"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("gigs");
};

