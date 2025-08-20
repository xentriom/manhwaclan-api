import * as cheerio from "cheerio";
import { BASE_URL, httpClient, type MangaFilterValue } from "../utils/constants.js";
import { randomHeader } from "../utils/headers.js";
import { ApiError } from "../utils/errors.js";
import type { SearchResponse } from "../types/index.js";

export async function search(query: string, page: number): Promise<SearchResponse> {
  const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=wp-manga&page=${page}`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const results = $(".c-tabs-item__content")
    .map((_, el) => {
      const $el = $(el);
      const title = $el.find(".post-title").text().trim();
      const href = $el.find("a").attr("href");
      if (!title || !href) return null;

      return {
        title,
        url: href,
        slug: href?.split("/manga/")[1]?.replace(/\/$/, "") ?? "",
        imageUrl: $el.find(".tab-thumb img").attr("src") ?? "",
        rating: $el.find(".meta-item.rating .score").text().trim() || null,
      };
    })
    .get()
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!results.length) throw new ApiError("No results found", 404);

  const totalPagesText = $(".wp-pagenavi .pages").text();
  const totalPages = Number(totalPagesText.match(/of\s+(\d+)/)?.[1] ?? 1);

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

export async function fetchMangaList(
  filter: MangaFilterValue,
  page: number,
): Promise<SearchResponse> {
  const url = `${BASE_URL}/manga/page/${page}/?m_orderby=${filter}`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const results = $(".page-listing-item .col-6.col-md-3")
    .map((_, el) => {
      const $el = $(el);
      const link = $el.find(".item-thumb a");
      const title = link.attr("title");
      const href = link.attr("href");
      if (!title || !href) return null;

      return {
        title,
        url: href,
        slug: href.match(/\/manga\/([^/]+)/)?.[1] ?? "",
        imageUrl: $el.find(".item-thumb img").attr("src") ?? "",
        rating: $el.find(".meta-item.rating .score").text().trim() || null,
      };
    })
    .get()
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!results.length) throw new ApiError("No results found", 404);

  const totalPagesText = $(".wp-pagenavi .pages").text();
  const totalPages = Number(totalPagesText.match(/of\s+(\d+)/)?.[1] ?? 1);

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
