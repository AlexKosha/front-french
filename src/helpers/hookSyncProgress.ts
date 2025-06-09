import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isEqual from 'lodash.isequal';

import {getProgress, addThunkProgress} from '../store/progress/progressThunk';
import {selectUserId} from '../store/auth/selector';
import {AppDispatch} from '../store/store';
import {selectProgressData} from '../store/progress/selector';

export const useSyncProgress = () => {
  const userId = useSelector(selectUserId);
  const progressData = useSelector(selectProgressData);
  const dispatch = useDispatch<AppDispatch>();
  const hasSyncedRef = useRef(false); // ✳️ Хук запускається тільки один раз

  useEffect(() => {
    const syncProgress = async () => {
      if (hasSyncedRef.current || !userId) return;
      hasSyncedRef.current = true;

      try {
        const jsonValue = await AsyncStorage.getItem('progress_all');
        const localData = jsonValue ? JSON.parse(jsonValue) : null;

        const localUserId = localData?.userId;
        const localProgress = localData?.progress;

        let backendProgress =
          progressData && Object.keys(progressData).length > 0
            ? progressData
            : null;

        if (!backendProgress) {
          const backendResponse = await dispatch(getProgress());
          if (getProgress.fulfilled.match(backendResponse)) {
            backendProgress = backendResponse.payload?.progress || null;
          }
        }

        const isSameUser = localUserId === userId;

        // 🟢 Якщо є лише локальні, а бекенд порожній — оновлюємо бек
        if (localProgress && !backendProgress && isSameUser) {
          await dispatch(addThunkProgress({userId, progress: localProgress}));
          return;
        }

        // 🔴 Якщо бекенд все ще порожній — нічого робити
        if (!backendProgress) return;

        // 🔄 Якщо користувач змінився або немає локальних — оновити local
        if (!localData || !isSameUser) {
          await AsyncStorage.setItem(
            'progress_all',
            JSON.stringify({userId, progress: backendProgress}),
          );
        }

        // 🔁 Якщо обидва джерела є, але не збігаються — вибираємо краще
        else if (!isEqual(localProgress, backendProgress) && isSameUser) {
          const backendHasMore =
            Object.keys(backendProgress).length >
            Object.keys(localProgress).length;

          const completedCount = (progress: any) =>
            Object.values(progress || {}).filter((item: any) => item?.completed)
              .length;

          const backendCompleted = completedCount(backendProgress);
          const localCompleted = completedCount(localProgress);

          if (
            (backendHasMore || backendCompleted > localCompleted) &&
            isSameUser
          ) {
            // 🔼 Оновити локальне сховище з бекенду
            await AsyncStorage.setItem(
              'progress_all',
              JSON.stringify({userId, progress: backendProgress}),
            );
          } else if (isSameUser) {
            // 🔼 Оновити бекенд локальними

            await dispatch(addThunkProgress({userId, progress: localProgress}));
          }
        }
      } catch (error) {
        console.log('Error syncing progress:', error);
      }
    };

    syncProgress();
  }, [userId, dispatch, progressData]);
};
