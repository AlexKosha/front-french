import {RootState} from '../store';

export const selectTopic = (state: RootState) => state.topic.topic;
export const selectIsLoading = (state: RootState) => state.topic.isLoading;
export const selectError = (state: RootState) => state.topic.error;
