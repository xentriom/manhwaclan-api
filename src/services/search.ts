import * as cheerio from "cheerio";
import {
  BASE_URL,
  httpClient,
  genreMap,
  GenreOptions,
  sortMap,
  SortOptions,
} from "../utils/constants.js";
import { randomHeader } from "../utils/headers.js";
import type { SearchResponse } from "../types/index.js";

function parsePagination($: cheerio.CheerioAPI, page: number) {
  const totalPagesText = $(".wp-pagenavi .pages").text();
  const totalPages = Number(totalPagesText.match(/of\s+(\d+)/)?.[1] ?? 1);
  return {
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

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
        slug: href.match(/\/manga\/([^/]+)/)?.[1] ?? "",
        imageUrl: $el.find(".tab-thumb img").attr("src") ?? "",
        rating: $el.find(".meta-item.rating .score").text().trim() || null,
      };
    })
    .get()
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (results.length === 0) {
    return {
      results: [],
      pagination: { page, totalPages: 1, hasNext: false, hasPrev: false },
    };
  }

  return {
    results,
    pagination: parsePagination($, page),
  };
}

async function fetchMangaList(url: string, page: number): Promise<SearchResponse> {
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

  if (results.length === 0) {
    return {
      results: [],
      pagination: { page, totalPages: 1, hasNext: false, hasPrev: false },
    };
  }

  return {
    results,
    pagination: parsePagination($, page),
  };
}

export const fetchGenreList = async (
  genre: GenreOptions,
  page: number,
): Promise<SearchResponse> => {
  const url = `${BASE_URL}/manga-genre/${genreMap[genre]}/page/${page}`;
  return fetchMangaList(url, page);
};

export async function fetchSortedList(sortBy: SortOptions, page: number): Promise<SearchResponse> {
  const url = `${BASE_URL}/manga/page/${page}/?m_orderby=${sortMap[sortBy]}`;
  return fetchMangaList(url, page);
}
