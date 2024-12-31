import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsCategory } from '../../types/NewsCategory';

interface CategoriesState {
    categories: NewsCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<NewsCategory[]>) => {
            state.categories = action.payload;
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

export const { setCategories, setLoading, setError } = categoriesSlice.actions;
export default categoriesSlice.reducer;