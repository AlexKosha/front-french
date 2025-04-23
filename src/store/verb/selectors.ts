import {RootState} from '../store';

export const selectVerbs = (state: RootState) => state.verb.verb;
export const selectIsLoading = (state: RootState) => state.verb.isLoading;
export const selectError = (state: RootState) => state.verb.error;
