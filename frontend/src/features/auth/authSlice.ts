import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    prefs: {
        categories: string[],
        sources: string[],
        keywords: string[],
    };
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    prefs: {
        categories: [],
        sources: [],
        keywords: [],
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        setPrefs: (state, action: PayloadAction<{ colorScheme: "light" | "dark" }>) => {
            state.prefs = { ...state.prefs, ...action.payload };
        },
        setUser: (state, action: PayloadAction<AuthState["user"]>) => {
            state.user = action.payload;
        },

    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setPrefs, setUser } = authSlice.actions;
export default authSlice.reducer;