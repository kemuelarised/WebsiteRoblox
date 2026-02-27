const knex = require("knex");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

const connectionString = requireEnv("DATABASE_URL");

const db = knex({
  client: "pg",
  connection: {
    connectionString,
    ssl: { rejectUnauthorized: false },
  },
  pool: { min: 0, max: 10 },
});

module.exports = { db };
