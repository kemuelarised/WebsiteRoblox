const jwt = require("jsonwebtoken");

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_JWT_SECRET");
  }
  return secret;
}

function adminAuth(req, res, next) {
  const header = req.header("authorization") || req.header("Authorization") || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, getSecret());
    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.admin = { sub: payload.sub, role: payload.role };
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = { adminAuth };

