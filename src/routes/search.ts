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

searchRoutes.get("/trending/:page?", async (c) => {
  const { page } = c.req.param();
  const pageNumber = parseInt(page ?? "1", 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new ApiError("Page is invalid", 400);
  }

  const results = await trending(pageNumber);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

searchRoutes.get("/latest/:page?", async (c) => {
  const { page } = c.req.param();
  const pageNumber = parseInt(page ?? "1", 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new ApiError("Page is invalid", 400);
  }

  const results = await latest(pageNumber);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

export default searchRoutes;
