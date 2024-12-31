import { configureStore } from '@reduxjs/toolkit';
import newsReducer from '../features/news/newsSlice';
import sourcesReducer from '../features/sources/sourcesSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import authReducer from '../features/auth/authSlice';
import { newsApi } from '../features/news/newsApi';
import { sourcesApi } from '../features/sources/sourcesApi';
import { categoriesApi } from '../features/categories/categoriesApi';
import { authApi } from '../features/auth/authApi';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    sources: sourcesReducer,
    categories: categoriesReducer,
    auth: authReducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [sourcesApi.reducerPath]: sourcesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(newsApi.middleware, sourcesApi.middleware, categoriesApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;