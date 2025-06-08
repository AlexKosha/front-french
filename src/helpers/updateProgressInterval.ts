import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateThunkProgress} from '../store/progress/progressThunk';
import {AppDispatch} from '../store/store';
import {selectUpdatedProgressData} from '../store/progress/selector';
import {selectUserId} from '../store/auth/selector';

export const AutoProgressUpdater = () => {
  const dispatch = useDispatch<AppDispatch>();
  const updatedProgress = useSelector(selectUpdatedProgressData);
  const userId = useSelector(selectUserId);

  // Рефи для збереження актуальних значень
  const updatedProgressRef = useRef(updatedProgress);
  const userIdRef = useRef(userId);

  // Обновляємо рефи при зміні стейту, але без перезапуску інтервалу
  useEffect(() => {
    updatedProgressRef.current = updatedProgress;
  }, [updatedProgress]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentProgress = updatedProgressRef.current;
      const currentUserId = userIdRef.current;
      if (!currentUserId || !currentProgress) return;

      if (Object.keys(currentProgress.progress || {}).length > 0) {
        const updatedProgressWithId = {
          ...currentProgress,
          userId: currentUserId,
        };

        console.log('відправило');
        dispatch(updateThunkProgress(updatedProgressWithId));
      }
    }, 15000); // кожні 15 хв

    return () => clearInterval(interval);
  }, [dispatch]); // інтервал створюється один раз

  return null;
};
