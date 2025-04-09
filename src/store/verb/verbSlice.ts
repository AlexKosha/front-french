import {createSlice} from '@reduxjs/toolkit';
import * as verbThunk from './verbThunk';
import * as HelpresReducer from './helpersVerbReducer';
import {VerbState} from '../../types';

const initialState: VerbState = {
  verb: [],
  isLoading: false,
  error: null,
};

const verbSlice = createSlice({
  name: 'verb',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        verbThunk.getVerbs.fulfilled,
        HelpresReducer.handleFulfilledGetVerb,
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

export const verbReducer = verbSlice.reducer;
