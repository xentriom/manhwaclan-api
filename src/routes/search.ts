import { Hono } from "hono";
import { fetchMangaList, search } from "../services/search.js";
import type { ApiResponse, SearchResponse } from "../types/index.js";
import { ApiError } from "../utils/errors.js";
import { SortOptions } from "../utils/constants.js";

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

// Search by genre
searchRoutes.get("/genre/:genre", async (c) => {
  const genre = c.req.param("genre");
  if (!genre) {
    throw new ApiError("Genre parameter is required", 400);
  }

  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const orderBy = c.req.query("order_by") ?? SortOptions.RecentlyUpdated;
  if (!Object.values(SortOptions).includes(orderBy as SortOptions)) {
    throw new ApiError("Invalid order_by parameter", 400);
  }

  return c.json({ success: true, data: [] });
});

// Search by sort
searchRoutes.get("/sort/:sort", async (c) => {
  const sort = c.req.param("sort");
  if (!Object.values(SortOptions).includes(sort as SortOptions)) {
    throw new ApiError("Invalid sort parameter", 400);
  }

  const page = parseInt(c.req.query("page") ?? "1", 10);
  if (isNaN(page) || page < 1) {
    throw new ApiError("Page parameter must be >= 1", 400);
  }

  const results = await fetchMangaList(sort as SortOptions, page);
  return c.json({ success: true, data: results } as ApiResponse<SearchResponse>);
});

export default searchRoutes;
