export interface MangaDetails {
  title: string;
  summary: string;
  coverImage: string;
  type: string;
  status: string;
  releaseYear: string;
  rating: string;
  rank: string;
  alternativeTitles: string;
  authors: { name: string; url: string }[];
  genres: string[];
  chapterCount: number;
}

export interface Chapter {
  name: string;
  number: number;
  url: string;
  releaseDate: string;
}

export interface SearchResult {
  title: string;
  url: string;
  slug: string;
  imageUrl: string;
  rating: string | null;
  lastUpdated: {
    chapter: string;
    time: string;
  };
}

export interface Pagination {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}
