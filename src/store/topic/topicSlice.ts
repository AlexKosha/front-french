import {createSlice} from '@reduxjs/toolkit';
// import {Topic} from '../../services/themeService';
import * as topicThunk from './topicThunk';
import * as HelpresReducer from './helpersTopicReducer';
import {TopicState} from '../../types';

const initialState: TopicState = {
  topic: [],
  isLoading: false,
  error: null,
};

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        topicThunk.getTopic.fulfilled,
        HelpresReducer.handleFulfilledGetTopic,
      )
      .addMatcher(
        action => action.type.endsWith('pending'),
        HelpresReducer.handlePending,
      )
      .addMatcher(
        action => action.type.endsWith('rejected'),
        HelpresReducer.handleRejected,
      );
  },
});

export const topicReducer = topicSlice.reducer;
