import {NewsSource} from "./NewsSource";
import {NewsCategory} from "./NewsCategory";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: NewsSource;
  publishedAt: string;
  category: NewsCategory;
  nextPage: string;
}