import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsSource } from '../../types/NewsSource';

const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";
export const sourcesApi = createApi({
    reducerPath: 'sourcesApi',
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
        getSources: builder.query<NewsSource[], void>({ // No arguments needed for fetching all sources
            query: () => 'api/sources',
        }),
    }),
});

export const { useGetSourcesQuery } = sourcesApi;