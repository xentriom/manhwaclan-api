import * as cheerio from "cheerio";
import { randomHeader } from "../utils/headers.js";
import { ApiError } from "../utils/errors.js";
import type { MangaDetails, Chapter, ChapterImages } from "../types/index.js";
import { BASE_URL, httpClient } from "../utils/constants.js";

export async function fetchDetails(slug: string): Promise<MangaDetails> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const title = $(".post-title h1").text().trim();
  if (!title) throw new ApiError("Manga not found", 404);

  const postContentItems = $(".post-content_item");
  const authorContent = $(".author-content a[rel='tag']");
  const genresContent = $(".genres-content a[rel='tag']");
  const wpMangaChapters = $(".wp-manga-chapter");

  return {
    title,
    summary: $(".description-summary")
      .text()
      .trim()
      .replace(/^Read [^/]+\/.*?\n/, "")
      .replace(/\s*Show more\s*$/, "")
      .replace(/\n\s*\n/g, "\n")
      .trim(),
    coverImage: $(".summary_image img").attr("src") || "",
    type: postContentItems.filter(':contains("Type")').find(".summary-content").text().trim(),
    status: postContentItems.filter(':contains("Status")').find(".summary-content").text().trim(),
    releaseYear: postContentItems
      .filter(':contains("Release")')
      .find(".summary-content")
      .text()
      .trim(),
    rating: $(".post-total-rating .score").text().trim(),
    rank: postContentItems.filter(':contains("Rank")').find(".summary-content").text().trim(),
    alternativeTitles: postContentItems
      .filter(':contains("Alternative")')
      .find(".summary-content")
      .text()
      .trim(),
    authors: authorContent
      .map((_, el) => ({
        name: $(el).text().trim(),
        url: $(el).attr("href") || "",
      }))
      .get(),
    genres: genresContent.map((_, el) => $(el).text().trim()).get(),
    chapterCount: wpMangaChapters.length,
  };
}

export async function fetchChapters(slug: string): Promise<Chapter[]> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const chapters = $(".wp-manga-chapter")
    .map((_, el) => {
      const $el = $(el);
      const link = $el.find("a");
      const href = link.attr("href");

      const numberMatch = href?.match(/chapter-(\d+(?:\.\d+)?)/);
      const chpNumber = numberMatch ? numberMatch[1] : null;

      return href && chpNumber
        ? {
            name: link.text().trim(),
            number: chpNumber,
            url: href,
            releaseDate: $el.find(".chapter-release-date i").text().trim() || "",
          }
        : null;
    })
    .get()
    .filter(Boolean);

  return chapters.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
}

export async function fetchImages(slug: string, chapter: string): Promise<ChapterImages> {
  const url = `${BASE_URL}/manga/${encodeURIComponent(slug)}/chapter-${chapter}/`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const imageUrls = $(".page-break img")
    .map((i, element) => $(element).attr("src")?.trim())
    .get()
    .filter(Boolean);

  const prevChapter = $(".wp-manga-nav .nav-links .nav-previous a").attr("href")?.trim();
  const nextChapter = $(".wp-manga-nav .nav-links .nav-next a").attr("href")?.trim();

  return {
    images: imageUrls,
    pages: {
      previous: prevChapter?.match(/chapter-(\d+(?:\.\d+)?)/)?.[1] ?? null,
      next: nextChapter?.match(/chapter-(\d+(?:\.\d+)?)/)?.[1] ?? null,
    },
  };
}
