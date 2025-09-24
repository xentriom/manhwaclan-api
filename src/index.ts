import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ApiError } from "./utils/errors.js";
import mangaRoutes from "./routes/manga.js";
import searchRoutes from "./routes/search.js";
import imageRoutes from "./routes/image.js";

const app = new Hono();

app.use(
  "*",
  // Enable CORS
  cors({
    origin: "*",
    allowMethods: ["GET"],
  }),
  // Pretty JSON /?pretty
  prettyJSON({ space: 4 }),
  // Log request method, url, and duration
  async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    function formatDuration(duration: number) {
      if (duration < 100) return `\x1b[32m${duration}ms\x1b[0m`;
      if (duration < 500) return `\x1b[33m${duration}ms\x1b[0m`;
      return `\x1b[31m${duration}ms\x1b[0m`;
    }

    console.log(`${c.req.method} ${c.req.path} in ${formatDuration(duration)}`);
  },
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
app.route("/image", imageRoutes);

export default app;

if (process.env.VERCEL_ENV !== "production") {
  const { serve } = await import("@hono/node-server");
  const os = await import("os");
  const { default: packageJson } = await import("../package.json");

  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (i) => {
      console.log(`\n> ${packageJson.name}@${packageJson.version} ${process.cwd()}\n`);
      console.log(`🔥 Hono${packageJson.dependencies.hono}`);
      console.log(`   - Local:\thttp://localhost:${i.port}`);
      console.log(`   - Network:\thttp://${os.hostname()}:${i.port}\n`);
    },
  );
}
