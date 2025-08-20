import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ApiError } from "./utils/errors.js";
import mangaRoutes from "./routes/manga.js";

const app = new Hono();

// Error handling middleware
app.onError((err, c) => {
  const status = err instanceof ApiError ? err.status : 500;
  return c.json(
    { success: false, error: err.message },
    status as ContentfulStatusCode,
  );
});

// Health check route
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/manga", mangaRoutes);

export default app;
