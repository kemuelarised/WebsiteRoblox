const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid body", issues: [{ path: ["username"], message: "Required" }] });
  }

  const envUser = requireEnv("ADMIN_USERNAME");
  const hash = requireEnv("ADMIN_PASSWORD_HASH");
  const secret = requireEnv("ADMIN_JWT_SECRET");

  if (username !== envUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      sub: "admin",
      role: "admin",
    },
    secret,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = { authRouter: router };

