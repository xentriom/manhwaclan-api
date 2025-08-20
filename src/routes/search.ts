import { Hono } from "hono";
import { fetchMangaList, search } from "../services/search.js";
import type { ApiResponse, SearchResponse } from "../types/index.js";
import { ApiError } from "../utils/errors.js";
import { Filters } from "../utils/constants.js";

const searchRoutes = new Hono();

// Search by title
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

// Trending Manga
searchRoutes.get("/trending", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await fetchMangaList(Filters.Trending, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

// Latest Manga
searchRoutes.get("/latest", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await fetchMangaList(Filters.Latest, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

// New Manga
searchRoutes.get("/new", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await fetchMangaList(Filters.New, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

// Popular Manga
searchRoutes.get("/popular", async (c) => {
  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await fetchMangaList(Filters.Popular, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

export default searchRoutes;
