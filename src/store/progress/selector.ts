import {RootState} from '../store'; // Імпортуємо RootState з вашого store

export const selectProgressData = (state: RootState) => state.progress.data;
