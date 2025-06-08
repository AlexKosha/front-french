import {useEffect} from 'react';
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

  useEffect(() => {
    const syncProgress = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('progress_all');
        const localData = jsonValue ? JSON.parse(jsonValue) : null;

        const localUserId = localData?.userId as string | undefined;
        const localProgress = localData?.progress;

        let backendProgress = null;

        // 🔹 Якщо в Redux вже є прогрес — використовуємо його
        if (progressData && Object.keys(progressData).length > 0) {
          backendProgress = progressData;
        } else {
          // 🔄 Інакше — отримуємо з бекенду
          const backendResponse = await dispatch(getProgress());
          if (getProgress.fulfilled.match(backendResponse)) {
            backendProgress = backendResponse.payload?.progress;
          }
        }

        if (!backendProgress) return;

        // ✅ Якщо нема локальних або userId не збігається — оновити локальні
        if (!localData || localUserId !== userId) {
          await AsyncStorage.setItem(
            'progress_all',
            JSON.stringify({
              userId,
              progress: backendProgress,
            }),
          );
        }

        // 🔁 Якщо локальні й бекендові не збігаються — надіслати локальні
        else if (
          backendProgress &&
          localProgress &&
          !isEqual(backendProgress, localProgress)
        ) {
          await dispatch(addThunkProgress({userId, progress: localProgress}));
        }
      } catch (error) {
        console.log('Error syncing progress:', error);
      }
    };

    if (userId) syncProgress();
  }, [userId, dispatch, progressData]);
};
