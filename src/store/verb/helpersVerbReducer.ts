import {PayloadAction} from '@reduxjs/toolkit';
import {Verb, VerbState} from '../../types';

export const handlePending = (state: VerbState) => {
  state.isLoading = true;
};

export const handleFulfilledGetVerb = (
  state: VerbState,
  {payload}: PayloadAction<Verb[]>,
) => {
  state.isLoading = false;
  state.error = null;
  state.verb = payload;
};

export const handleRejected = (
  state: VerbState,
  {payload}: PayloadAction<string>,
) => {
  state.isLoading = false;
  state.error = payload;
};
