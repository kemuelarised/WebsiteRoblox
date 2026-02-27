const knex = require("knex");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

const db = knex({
  client: "mysql2",
  connection: {
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    database: requireEnv("DB_NAME"),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
  },
  pool: { min: 0, max: 10 },
});

module.exports = { db };

