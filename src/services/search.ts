import * as cheerio from "cheerio";
import { BASE_URL, httpClient } from "../utils/constants.js";
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

export async function trending(page: number): Promise<SearchResponse> {
  const url = `${BASE_URL}/manga/page/${page}/?m_orderby=trending`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  const results = $(".page-listing-item .col-6.col-md-3")
    .map((_, el) => {
      const $el = $(el);

      const mangaItem = $el.find(".item-thumb");
      const link = mangaItem.find("a");
      const title = link.attr("title");
      const href = link.attr("href");
      const imageUrl = mangaItem.find("img").attr("src");
      const rating = $el.find(".meta-item.rating .score").text().trim();

      if (!title || !href) return null;

      return {
        title,
        url: href,
        slug: href.split("/manga/")[1]?.replace(/\/$/, ""),
        imageUrl: imageUrl || "",
        rating: rating || "",
      };
    })
    .get()
    .filter(Boolean);

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

export async function latest(page: number): Promise<SearchResponse> {
  const url = `${BASE_URL}/manga/page/${page}/?m_orderby=latest`;
  const { data } = await httpClient.get(url, { headers: randomHeader() });
  const $ = cheerio.load(data);

  // TODO: Implement latest manga

  const totalPages = parseInt(
    $(".wp-pagenavi .pages")
      .text()
      .match(/of (\d+)/)?.[1] ?? "1",
    10,
  );

  return {
    results: [],
    pagination: {
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
