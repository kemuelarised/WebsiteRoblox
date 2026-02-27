/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable("inquiries", (t) => {
    t.increments("id").primary();
    t
      .integer("gig_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("gigs")
      .onDelete("CASCADE");
    t.string("name", 80).notNullable();
    t.string("email", 120).nullable();
    t.string("discord", 80).nullable();
    t.text("message").notNullable();
    t.string("status", 20).notNullable().defaultTo("new");
    t.dateTime("created_at").notNullable();

    t.index(["gig_id", "created_at"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("inquiries");
};

