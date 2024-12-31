import { RootState } from '../../app/store';

export const selectNews = (state: RootState) => state.news.articles;
export const selectNewsLoading = (state: RootState) => state.news.loading;
export const selectNewsError = (state: RootState) => state.news.error;
