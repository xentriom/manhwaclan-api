import { Hono } from "hono";
import { search } from "../services/manga.js";
import type { SearchResponse } from "../types/index.js";

const searchRoutes = new Hono();

searchRoutes.get("/:query", async (c) => {
  const { query } = c.req.param();
  const page = c.req.query("page") || "1";
  const results = await search(query, parseInt(page, 10));
  return c.json(results as SearchResponse);
});

export default searchRoutes;
