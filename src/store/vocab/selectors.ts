import {RootState} from '../store';

export const selectVocab = (state: RootState) => state.vocab.vocab;
export const selectIsLoading = (state: RootState) => state.vocab.isLoading;
export const selectError = (state: RootState) => state.vocab.error;
export const selectThemeWordId = (state: RootState) => state.vocab.themeId;
