import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/User';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials extends User {
    password_confirmation: string;
}

interface LoginResponse {
    user: User;
    access_token: string;
}

interface RegisterResponse {
    user: User;
}

const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";

export const authApi = createApi({
    reducerPath: 'authApi',
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
        // Login mutation with CSRF token handling
        login: builder.mutation<LoginResponse, LoginCredentials>({
            queryFn: async (credentials, queryApi, extraOptions, baseQuery) => {
                // Fetch CSRF cookie before making the login request
                const csrfResponse = await baseQuery({ url: "sanctum/csrf-cookie", method: "GET" });

                if (csrfResponse.error) {
                    return { error: csrfResponse.error };
                }

                const loginResponse = await baseQuery({
                    url: "api/sanctum/token",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(credentials),
                });
                return loginResponse;
            },
        }),

        // Registration mutation
        register: builder.mutation<RegisterResponse, RegisterCredentials>({
            query: (userData) => ({
                url: "register",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(userData),
            })
        }),

        // Get authenticated user data
        getUser: builder.query({
            query: () => ({
                url: "api/user",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: "include",
            })
        }),

        // Set user preferences
        setPreference: builder.mutation({
            query: ({ key, value }) => ({
                url: `user/preferences`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: { key, value },
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery, useSetPreferenceMutation  } = authApi;