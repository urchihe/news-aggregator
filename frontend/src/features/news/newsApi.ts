import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsArticle } from '../../types/NewsArticle';
import { FetchNewsFilters } from '../../types/FetchNewsFilters';

const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";
export const newsApi = createApi({
  reducerPath: 'newsApi',
      baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
          headers.set("Content-Type", "application/json");
          headers.set("Accept", "application/json");
          return headers;
        },
      }),
  endpoints: (builder) => ({
    fetchNews: builder.query<NewsArticle[], FetchNewsFilters>({
      query: (filters) => {
        let url = 'api/news';

        // Build query parameters dynamically
        const params = new URLSearchParams();

        if (filters.sources) {
          params.append('sources', filters.sources.join(','));
        }
        if (filters.categories) {
          params.append('categories', filters.categories.join(','));
        }
        if (filters.keywords) {
          params.append('q', filters.keywords);
        }
          if (filters.date_range?.start && filters.date_range?.end) {
            params.set(
                'date_range',
                `${~~(filters.date_range.start.getTime() / 1000)},${~~(
                    filters.date_range.end.getTime() / 1000
                )}`
            );
          }

        params.append('page', filters.page.toString());

        // Append query parameters if any exist
        if (Array.from(params).length > 0) {
          url += `?${params.toString()}`;
        }

        return url;
      },
    }),
    getArticleFilterData: builder.query<any, void>({
      query: () => '/filters', // Adjust this path according to your API's endpoint
    }),
  }),
});

export const { useFetchNewsQuery, useGetArticleFilterDataQuery } = newsApi;