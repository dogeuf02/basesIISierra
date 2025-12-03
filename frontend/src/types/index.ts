export interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
  language?: string;
  license_id?: number;
  created_at: string;
}

export interface Author {
  author_id: number;
  name: string;
  affiliation?: string;
}

export interface Category {
  category_id: number;
  name: string;
}

export interface Keyword {
  keyword_id: number;
  keyword: string;
}

export interface Review {
  review_id: number;
  resource_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ReviewInput {
  user_id: number;
  rating: number;
  comment?: string;
}

export interface Program {
  program_id: number;
  name: string;
  faculty?: string;
}

export interface SearchResult {
  resource_id: number;
  title: string;
  authors: string[];
  categories: string[];
  keywords: string[];
  year: number;
}

export interface DailyStats {
  date: string;
  total_events: number;
  top_search_terms: Array<{ term: string; count: number }>;
  top_downloads: Array<{ resource_id: number; title: string; count: number }>;
}

export interface LogEvent {
  id: string;
  type: string;
  user_id: number;
  resource_id?: number;
  query?: string;
  timestamp: string;
  metadata: {
    ip: string;
    device: string;
  };
}
