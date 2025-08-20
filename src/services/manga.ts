import axios from "axios";
import * as cheerio from "cheerio";
import { randomHeader } from "../utils/headers.js";
import { ApiError } from "../utils/errors.js";
import type { MangaDetails, Chapter, SearchResponse } from "../types/index.js";

const BASE_URL = "https://manhwaclan.com";

export async function fetchDetails(slug: string): Promise<MangaDetails> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const title = $(".post-title h1").text().trim();
  if (!title) throw new ApiError("Manga not found", 404);

  return {
    // Basic info
    title,
    summary: $(".description-summary")
      .text()
      .trim()
      .replace(/^Read [^/]+\/.*?\n/, "")
      .replace(/\s*Show more\s*$/, "")
      .replace(/\n\s*\n/g, "\n")
      .trim(),
    coverImage: $(".summary_image img").attr("src") || "",

    // Metadata
    type: $('.post-content_item:contains("Type") .summary-content').text().trim(),
    status: $('.post-content_item:contains("Status") .summary-content').text().trim(),
    releaseYear: $('.post-content_item:contains("Release") .summary-content').text().trim(),

    // Statistics
    rating: $(".post-total-rating .score").text().trim(),
    rank: $('.post-content_item:contains("Rank") .summary-content').text().trim(),

    // Related Content
    alternativeTitles: $('.post-content_item:contains("Alternative") .summary-content')
      .text()
      .trim(),
    authors: $(".author-content a[rel='tag']")
      .map((_, el) => ({
        name: $(el).text().trim(),
        url: $(el).attr("href") || "",
      }))
      .get(),
    genres: $(".genres-content a[rel='tag']")
      .map((_, el) => $(el).text().trim())
      .get(),
    chapterCount: $(".wp-manga-chapter").length,
  };
}

export async function fetchChapters(slug: string): Promise<Chapter[]> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const chapters = $(".wp-manga-chapter")
    .map((_, el) => {
      const link = $(el).find("a");
      const href = link.attr("href");

      const numberMatch = href?.match(/chapter-(\d+)/);
      const number = numberMatch ? parseInt(numberMatch[1], 10) : null;

      return number && href
        ? {
            name: link.text().trim(),
            number,
            url: href,
            releaseDate: $(el).find(".chapter-release-date i").text().trim() || "",
          }
        : null;
    })
    .get()
    .filter(Boolean);

  return chapters.sort((a, b) => a.number - b.number);
}

export async function fetchImages(slug: string, chapter: string): Promise<string[]> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/chapter-${chapter}/`;

  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const imageUrls = $(".page-break img")
    .map((i, element) => $(element).attr("src")?.trim())
    .get()
    .filter(Boolean);

  if (imageUrls.length === 0) {
    throw new ApiError("No images found for the chapter.", 404);
  }

  return imageUrls;
}

export async function search(query: string, page: number): Promise<SearchResponse> {
  const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${page}`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const results = $(".c-tabs-item__content")
    .map((_, el) => {
      const title = $(el).find(".post-title").text().trim();
      const href = $(el).find("a").attr("href");
      if (!title || !href) return null;
      return {
        title,
        url: href,
        slug: href.split("/manga/")[1]?.replace(/\/$/, ""),
      };
    })
    .get()
    .filter(Boolean);

  if (!results.length) throw new ApiError("No results found", 404);

  const totalPages = parseInt(
    $(".wp-pagenavi .pages")
      .text()
      .match(/of (\d+)/)?.[1] ?? "1",
    10,
  );

  return {
    results,
    pagination: {
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
