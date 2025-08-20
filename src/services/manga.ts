import axios from "axios";
import * as cheerio from "cheerio";
import { randomHeader } from "../utils/headers.js";
import { ApiError } from "../utils/errors.js";
import type { MangaDetails, Chapter, SearchResponse } from "../types/index.js";

export async function fetchDetails(slug: string): Promise<MangaDetails> {
  const url = `https://manhwaclan.com/manga/${slug}/`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const title = $(".post-title h1").text().trim();
  if (!title) throw new ApiError("Manga not found", 404);

  // Debug: Let's see what we can find
  const summaryElement = $(".description-summary .summary_content");
  const summaryText = summaryElement.text().trim();
  
  // If that doesn't work, try alternative selectors
  const alternativeSummary = $(".summary_content").text().trim();
  const descriptionSummary = $(".description-summary").text().trim();
  
  // Try more specific selectors based on the HTML structure
  const pElements = $(".description-summary .summary_content p");
  const secondParagraph = pElements.eq(1).text().trim();
  const allParagraphs = pElements.map((_, el) => $(el).text().trim()).get().join(" ");
  
  // Debug logging
  console.log("Summary selectors found:", {
    summaryText: summaryText || "NOT FOUND",
    alternativeSummary: alternativeSummary || "NOT FOUND", 
    descriptionSummary: descriptionSummary || "NOT FOUND",
    secondParagraph: secondParagraph || "NOT FOUND",
    allParagraphs: allParagraphs || "NOT FOUND"
  });

  return {
    // Basic info
    title,
    summary: summaryText || alternativeSummary || descriptionSummary || "No summary available",
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
  };
}

export async function fetchChapters(slug: string): Promise<Chapter[]> {
  const url = `https://manhwaclan.com/manga/${slug}/`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const chapters = $(".wp-manga-chapter")
    .map((_, el) => {
      const link = $(el).find("a").attr("href");
      const numberMatch = link?.match(/chapter-(\d+)/);
      const number = numberMatch ? parseInt(numberMatch[1], 10) : null;
      return number && link ? { number, url: link } : null;
    })
    .get()
    .filter(Boolean);

  return chapters.sort((a, b) => a.number - b.number); // ascending
}

export async function fetchImages(slug: string, chapter: string): Promise<string[]> {
  const url = `https://manhwaclan.com/manga/${slug}/chapter-${chapter}/`;
  const { data } = await axios.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const images = $(".page-break img")
    .map((_, el) => $(el).attr("src")?.trim())
    .get();
  if (!images.length) throw new ApiError("No images found", 404);

  return images;
}

export async function search(query: string, page = 1): Promise<SearchResponse> {
  const url = `https://manhwaclan.com/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${page}`;
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
