import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {combineReducers} from 'redux';
import {authSlice} from './auth/authSlice';
import {topicReducer} from './topic/topicSlice';
import {vocabReducer} from './vocab/vocabSlice';

// Налаштування persist для авторизації (збереження токена)
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['token'], // тільки токен буде збережено
};

// Комбінуємо редюсери
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authSlice.reducer),
  vocab: vocabReducer,
  topic: topicReducer,
});

// Створення store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor для збереження стану
export const persistor = persistStore(store);

// Типізація для використання у всьому додатку
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
