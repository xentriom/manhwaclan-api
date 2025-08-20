import { Hono } from "hono";
import { fetchDetails, fetchChapters, fetchImages } from "@/services/manga.js";
import type { ApiResponse } from "@/types/index.js";

const manga = new Hono();

// Get manga details
manga.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const details = await fetchDetails(slug);
  return c.json({ success: true, data: details } as ApiResponse<
    typeof details
  >);
});

// List all manga chapters
manga.get("/:slug/chapters", async (c) => {
  const { slug } = c.req.param();
  const chapters = await fetchChapters(slug);
  return c.json({ success: true, data: chapters } as ApiResponse<
    typeof chapters
  >);
});

// Get images for a specific chapter
manga.get("/:slug/chapter/:chapter", async (c) => {
  const { slug, chapter } = c.req.param();
  const images = await fetchImages(slug, chapter);
  return c.json({ success: true, data: { images } } as ApiResponse<{
    images: string[];
  }>);
});

export default manga;
