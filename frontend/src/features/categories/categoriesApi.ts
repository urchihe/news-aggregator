import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsCategory } from '../../types/NewsCategory';

const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";
export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
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
        getCategories: builder.query<NewsCategory[], void>({
            query: () => 'api/categories',
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;