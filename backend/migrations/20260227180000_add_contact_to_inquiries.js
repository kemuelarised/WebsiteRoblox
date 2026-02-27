/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  const hasTable = await knex.schema.hasTable("inquiries");
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn("inquiries", "contact");
  if (!hasColumn) {
    await knex.schema.alterTable("inquiries", (t) => {
      t.string("contact", 160).nullable().after("name");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  const hasTable = await knex.schema.hasTable("inquiries");
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn("inquiries", "contact");
  if (hasColumn) {
    await knex.schema.alterTable("inquiries", (t) => {
      t.dropColumn("contact");
    });
  }
};

