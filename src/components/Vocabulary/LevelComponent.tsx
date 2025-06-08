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

  const navigation = useNavigation<NavigationProps<'TrainVocabulary'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);
  const {speak} = useTTS();

  const playText = () => {
    if (currentItem?.world) speak(currentItem.world);
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

  const handleChoice = async (chosenItem: any) => {
    if (currentItem && chosenItem._id === currentItem._id) {
      const updatedStats = wordStats.map((stat: any) =>
        stat.word._id === currentItem._id
          ? {...stat, correctCount: stat.correctCount + 1}
          : stat,
      );
      setWordStats(updatedStats);
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      if (updatedTotalCorrectAnswers === 15) {
        await markCurrentWordsAsCompleted(
          progress,
          wordStats,
          level,
          titleName,
          dispatch,
        );
        await dispatch(updaterProgressUserThunk());
        Alert.alert('Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан');
        navigation.navigate('TrainVocabulary', {titleName});
      } else {
        setRandomItem(updatedStats);
      }
    } else {
      Alert.alert('Спробуйте ще раз!');
    }
  };

  const setRandomItem = useCallback(
    (stats: any) => {
      const remainingItems = stats.filter((stat: any) => stat.correctCount < 3);
      if (remainingItems.length === 0) {
        Alert.alert('Вітаю! Ви виконали всі завдання.');
        navigation.navigate('TrainVocabulary', {titleName});
        return;
      }
      const randomItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)];
      setCurrentItem(randomItem.word);
      generateChoices(randomItem.word);
    },
    [generateChoices, navigation, titleName],
  );

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
      {currentItem ? renderContent(currentItem, playText) : null}
      {renderChoices(choices, handleChoice)}
    </SafeAreaView>
  );
};
