import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {updaterProgressUserThunk} from '../../store/auth/authThunks';
import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../types/navigationTypes';
import {AppDispatch} from '../../store/store';
import {RenderProgress} from './RenderProgress';
import {defaultStyles} from '../defaultStyles';
import {markCurrentWordsAsCompleted} from '../../helpers/progressHelpers';
import {LevelComponentsProps, WordItem, WordStat} from '../../types';
import {useTTS} from '../../helpers';

export const LevelComponent: React.FC<LevelComponentsProps> = ({
  level,
  progress,
  titleName,
  renderContent,
  renderChoices,
}) => {
  const [choices, setChoices] = useState<WordItem[]>([]);
  const [currentItem, setCurrentItem] = useState<WordItem | null>(null);
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasFirstSpoken, setHasFirstSpoken] = useState(false);
  const [wasManuallySpoken, setWasManuallySpoken] = useState(false);

  const navigation = useNavigation<NavigationProps<'TrainVocabulary'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);
  const {speak} = useTTS();

  const playText = () => {
    if (currentItem?.world) {
      speak(currentItem.world);
      setWasManuallySpoken(true);
    }
  };
  const generateChoices = useCallback(
    (correctItem: WordItem) => {
      const wrongChoices: WordItem[] = [];
      while (wrongChoices.length < 3) {
        const randomIndex = Math.floor(Math.random() * progress.length);
        const wrongChoice = progress[randomIndex];
        if (
          wrongChoice._id !== correctItem._id &&
          !wrongChoices.some(choice => choice._id === wrongChoice._id)
        ) {
          wrongChoices.push(wrongChoice);
        }
      }
      setChoices(
        [...wrongChoices, correctItem].sort(() => Math.random() - 0.5),
      );
    },
    [progress],
  );
  const handleChoice = async (chosenItem: WordItem) => {
    if (!currentItem) return;

    setSelectedId(chosenItem._id);
    const correct = chosenItem._id === currentItem._id;
    setIsCorrect(correct);

    if (correct) {
      if (!hasFirstSpoken) {
        setHasFirstSpoken(true); // Тепер можна озвучувати автоматично
      }
      const updatedStats = wordStats.map(stat =>
        stat.word._id === currentItem._id
          ? {...stat, correctCount: stat.correctCount + 1}
          : stat,
      );
      setWordStats(updatedStats);
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      setTimeout(async () => {
        if (updatedTotalCorrectAnswers === 15) {
          await markCurrentWordsAsCompleted(
            progress,
            wordStats,
            level,
            titleName,
            dispatch,
          );
          await dispatch(updaterProgressUserThunk());
          Alert.alert(
            'Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан',
          );
          navigation.navigate('TrainVocabulary', {titleName});
        } else {
          setSelectedId(null);
          setIsCorrect(null);
          setWasManuallySpoken(false);
          setCurrentItem(null);

          // ⏳ даємо React "забути" попереднє слово
          setTimeout(() => {
            setRandomItem(updatedStats);
          }, 100);
        }
      }, 1000); // затримка 1 секунда
    } else {
      // 🔴 Червона рамка на 2 секунди, потім скидується
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const setRandomItem = useCallback(
    (stats: any) => {
      const remainingItems = stats.filter((stat: any) => stat.correctCount < 3);
      if (remainingItems.length === 0) {
        return; // більше нічого не робимо
      }
      const randomItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)];
      setCurrentItem({...randomItem.word}); // Створюємо новий об'єкт з таким самим вмістом

      generateChoices(randomItem.word);
    },
    [generateChoices],
  );

  // Автоматичне програвання звуку тільки після першої правильної відповіді
  useEffect(() => {
    if (
      level === 3 &&
      hasFirstSpoken && // Тільки після першої правильної відповіді
      currentItem?.world &&
      !wasManuallySpoken // Якщо слово не було озвучене вручну
    ) {
      speak(currentItem.world);
    }
  }, [currentItem, level, speak, hasFirstSpoken, wasManuallySpoken]);

  useEffect(() => {
    const initializeWordStats = () => {
      const unfinishedWords = progress.filter(
        word => !word.completed.includes(level),
      );
      if (unfinishedWords.length === 0) return;
      setWordStats(
        unfinishedWords.slice(0, 5).map(word => ({word, correctCount: 0})),
      );
      setRandomItem(
        unfinishedWords.slice(0, 5).map(word => ({word, correctCount: 0})),
      );
    };

    initializeWordStats();
  }, [level, progress, setRandomItem]);

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <RenderProgress totalCorrectAnswers={totalCorrectAnswers} />

      {currentItem && (
        <>
          {renderContent(currentItem, playText)}
          {renderChoices(choices, handleChoice, selectedId, isCorrect)}
        </>
      )}
    </SafeAreaView>
  );
};
