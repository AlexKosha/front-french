import {PayloadAction} from '@reduxjs/toolkit';
import {TopicState} from './topicSlice';
import {Topic} from '../../types';
// import {Topic} from '../../services/themeService';

export const handlePending = (state: TopicState) => {
  state.isLoading = true;
};

export const handleFulfilledGetTopic = (
  state: TopicState,
  {payload}: PayloadAction<Topic[]>,
) => {
  state.isLoading = false;
  state.error = null;
  state.topic = payload;
};

export const handleRejected = (
  state: TopicState,
  {payload}: PayloadAction<string>,
) => {
  state.isLoading = false;
  state.error = payload;
};
