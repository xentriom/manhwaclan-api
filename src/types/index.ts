export interface MangaDetails {
  title: string;
  summary: string;
  imageUrl?: string;
  rating: string;
  rank: string;
  alternative: string;
  genres: string[];
  type: string;
  status: string;
}

export interface Chapter {
  number: number;
  url: string;
}

export interface SearchResult {
  title: string;
  url: string;
  slug: string;
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
