import { Hono } from "hono";
import { latest, search, trending } from "../services/search.js";
import type { ApiResponse, SearchResponse } from "../types/index.js";
import { ApiError } from "../utils/errors.js";

const searchRoutes = new Hono();

searchRoutes.get("/", async (c) => {
  const { q: query, page } = c.req.query();

  if (!query) {
    throw new ApiError("Query parameter 'q' is required", 400);
  }

  const pageNumber = parseInt(page ?? "1", 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new ApiError("Page is invalid", 400);
  }

  const results = await search(query, pageNumber);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

searchRoutes.get("/trending", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page is invalid", 400);
  }

  const results = await trending(page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

searchRoutes.get("/latest", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page is invalid", 400);
  }

  const results = await latest(page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

export default searchRoutes;
