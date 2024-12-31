import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsSource } from '../../types/NewsSource';

interface SourcesState {
    sources: NewsSource[];
    loading: boolean;
    error: string | null;
}

const initialState: SourcesState = {
    sources: [],
    loading: false,
    error: null,
};
const API_URL = process.env.REACT_APP_API_URL || "http://api.newsaggregator.localhost/";

const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        setSources: (state, action: PayloadAction<NewsSource[]>) => {
            state.sources = action.payload;
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
    },
});

export const { setSources, setLoading, setError } = sourcesSlice.actions;
export default sourcesSlice.reducer;