import {createSlice} from '@reduxjs/toolkit';
import * as vocabThunk from './vocabThunks';
import * as HelpresReducer from './helpersVocabReducer';
import {VocabState} from '../../types';

const initialState: VocabState = {
  vocab: [],
  themeId: '',
  isLoading: false,
  error: null,
};

const vocabSlice = createSlice({
  name: 'vocab',
  initialState,
  reducers: {
    setThemeId: (state, action) => {
      state.themeId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        vocabThunk.getVocab.fulfilled,
        HelpresReducer.handleFulfilledGetVocab,
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

export const {setThemeId} = vocabSlice.actions;
export const vocabReducer = vocabSlice.reducer;
