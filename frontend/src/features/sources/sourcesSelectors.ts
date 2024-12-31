import { RootState } from '../../app/store';

export const selectSources = (state: RootState) => state.sources.sources;
export const selectSourcesLoading = (state: RootState) => state.sources.loading;
export const selectSourcesError = (state: RootState) => state.sources.error;