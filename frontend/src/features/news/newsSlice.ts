import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NewsArticle} from '../../types/NewsArticle';
import {newsApi} from './newsApi';

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  accentColor: string;
  debouncedSearchQuery: string;
  filters: {
    categories: string[];
    sources: string[];
    keywords: string[]
    date_range: { start: Date | null; end: Date | null };
    page: number;
  };
  colorScheme: string;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
  searchQuery: "",
  accentColor: "blue",
  debouncedSearchQuery: "",
  filters: {
    categories: [],
    sources: [],
    keywords: [],
    date_range: { start: null, end: null },
    page: 1
  },
  colorScheme: ""
};

// Create an async thunk for fetching the filters
export const fetchFilters = createAsyncThunk(
    'news/fetchFilters',
    async () => {
      const response = await newsApi.getArticleFilterData(); // Your API call
      return response.data;
    }
);
const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";
// Async thunk to fetch articles
export const fetchArticles = createAsyncThunk(
    'news/fetchArticles',
    async ({
             filters,
             searchQuery,
             categories,
             sources,
             keywords,
             pageParam,
           }: {
      filters: any;
      searchQuery: string | null;
      categories: string[];
      sources: string[];
      keywords: string[];
      pageParam?: string;
    }, { dispatch }) => {
      const params = new URLSearchParams();

      if (searchQuery) params.set('q', searchQuery);

      const combinedCategories = Array.from(
          new Set([...filters.categories, ...categories])
      );
      if (combinedCategories.length) {
        params.set('categories', combinedCategories.join(','));
      }

      const combinedSources = Array.from(
          new Set([...filters.sources, ...sources])
      );
      if (combinedSources.length) {
        params.set('sources',combinedSources.join(','));
      }

      if (filters.date_range?.start && filters.date_range?.end) {
        params.set(
            'date_range',
            `${~~(filters.date_range.start.getTime() / 1000)},${~~(
                filters.date_range.end.getTime() / 1000
            )}`
        );
      }

      const response = await fetch(`${API_URL}api/news?${params.toString()}`);
        const articles = await response.json();

        // Update the state using the setNews reducer
        dispatch(setNews(articles));
        console.log("articles",articles)

        return articles; // Return the fetched articles
    }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<NewsArticle[]>) => {
      state.articles = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setAccentColor(state, action: PayloadAction<string>) {
      state.accentColor = action.payload;
    },
    setDebouncedSearchQuery(state, action: PayloadAction<string>) {
        state.debouncedSearchQuery = action.payload;
    },
    setFilters(state, action: PayloadAction<NewsState["filters"]>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchFilters.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchFilters.fulfilled, (state, action) => {
          state.loading = false;
          state.filters = action.payload;
        })
        .addCase(fetchFilters.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch filters';
        });
  },
});

export const { setNews, setLoading, setError,setSearchQuery, setAccentColor, setDebouncedSearchQuery, setFilters } = newsSlice.actions;
export default newsSlice.reducer;