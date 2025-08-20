import { Hono } from "hono";
import { latest, search, trending } from "../services/search.js";
import type { ApiResponse, SearchResponse } from "../types/index.js";
import { ApiError } from "../utils/errors.js";

const searchRoutes = new Hono();

searchRoutes.get("/", async (c) => {
  const query = c.req.query("q") ?? c.req.query("query");
  const searchTerm = query?.trim();
  if (!searchTerm) {
    throw new ApiError("Query parameter 'q' or 'query' is required", 400);
  }

  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await search(searchTerm, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

searchRoutes.get("/trending", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await trending(page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

searchRoutes.get("/latest", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await latest(page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

export default searchRoutes;
