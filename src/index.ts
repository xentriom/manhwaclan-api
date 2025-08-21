import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ApiError } from "./utils/errors.js";
import mangaRoutes from "./routes/manga.js";
import searchRoutes from "./routes/search.js";

const app = new Hono();

// Enable CORS
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET"],
  }),
);

// Global error
app.onError((err, c) => {
  const status = err instanceof ApiError ? err.status : 500;
  return c.json({ success: false, error: err.message }, status as ContentfulStatusCode);
});

// Base
app.get("/", (c) => {
  return c.text("Welcome to Toonga API");
});

// Routes
app.route("/manga", mangaRoutes);
app.route("/search", searchRoutes);

export default app;
