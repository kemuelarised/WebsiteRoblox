const origin = (process.env.FRONTEND_ORIGIN || "").replace(/\/$/, "");

app.use(
  cors({
    origin: origin || true,
    credentials: false,
  })
);
