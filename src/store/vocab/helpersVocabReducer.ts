import {PayloadAction} from '@reduxjs/toolkit';
import {VocabState} from './vocabSlice';
import {Vocab} from '../../services/vocabService';

export const handlePending = (state: VocabState) => {
  state.isLoading = true;
};

export const handleFulfilledGetVocab = (
  state: VocabState,
  {payload}: PayloadAction<Vocab[]>,
) => {
  state.isLoading = false;
  state.error = null;
  state.vocab = payload;
};

export const handleRejected = (
  state: VocabState,
  {payload}: PayloadAction<string>,
) => {
  state.isLoading = false;
  state.error = payload;
};
