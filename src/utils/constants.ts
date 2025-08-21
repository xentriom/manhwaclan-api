import axios from "axios";

export const BASE_URL = "https://manhwaclan.com";

export const httpClient = axios.create({
  timeout: 8000,
  maxRedirects: 3,
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
  },
});

export enum SortOptions {
  Alphabetical = "alphabetical",
  Trending = "trending",
  RecentlyAdded = "new",
  RecentlyUpdated = "latest",
  Popular = "popular",
  Rating = "rating",
}

export const sortMap: Record<SortOptions, string> = {
  [SortOptions.Alphabetical]: "alphabet",
  [SortOptions.Trending]: "trending",
  [SortOptions.RecentlyAdded]: "new-manga",
  [SortOptions.RecentlyUpdated]: "latest",
  [SortOptions.Popular]: "views",
  [SortOptions.Rating]: "rating",
};

export type SortOptionsValues = `${SortOptions}`;
