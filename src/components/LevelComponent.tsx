import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
// import {Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updaterProgressUserThunk} from '../store/auth/authThunks';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {AppDispatch} from '../store/store';
import {WordItem} from './WordLearningScreen';

interface LevelProps {
  level: number;
  progress: any[]; // Або конкретний тип даних, якщо знаєте його структуру
  topicName: string;
  renderContent: (param: WordItem) => JSX.Element; // Функція, що приймає параметр та повертає JSX
  renderChoices: (
    choices: any,
    handleChoice: any,
    isDarkTheme: boolean,
  ) => JSX.Element;
}

export interface WordStat {
  word: WordItem;
  correctCount: number;
}

export const LevelComponent: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
  renderContent,
  renderChoices,
}) => {
  const [choices, setChoices] = useState<WordItem[]>([]);
  const [currentItem, setCurrentItem] = useState<WordItem | null>(null);
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [sound, setSound] = useState(null);

  const navigation = useNavigation<NavigationProps<'Train'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);

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
    // Перевіряємо, чи не є currentItem null або undefined
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
        await markCurrentWordsAsCompleted();
        await dispatch(updaterProgressUserThunk());
        Alert.alert('Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан');
        navigation.navigate('Train', {topicName});
      } else {
        setRandomItem(updatedStats);
      }
    } else {
      Alert.alert('Спробуйте ще раз!');
    }
  };

  const markCurrentWordsAsCompleted = async () => {
    try {
      const updatedProgress = progress.map(word => {
        if (wordStats.some((stat: any) => stat.word._id === word._id)) {
          return {
            ...word,
            completed: word.completed.includes(level)
              ? word.completed
              : [...word.completed, level],
          };
        }
        return word;
      });

      await AsyncStorage.setItem(
        `progress_${topicName}`,
        JSON.stringify(updatedProgress),
      );
    } catch (error) {
      console.error('Помилка оновлення прогресу:', error);
    }
  };

  // const playSound = async () => {
  //   if (!currentItem?.audio || isPlaying) return;

  //   try {
  //     const {sound} = await Audio.Sound.createAsync(
  //       {uri: currentItem.audio},
  //       {},
  //       status => {
  //         if (status.didJustFinish) {
  //           sound.unloadAsync();
  //           setIsPlaying(false);
  //         }
  //       },
  //     );
  //     setSound(sound);
  //     setIsPlaying(true);
  //     await sound.playAsync();
  //   } catch (error) {
  //     console.error('Error playing sound:', error);
  //   }
  // };

  const setRandomItem = useCallback(
    (stats: any) => {
      const remainingItems = stats.filter((stat: any) => stat.correctCount < 3);
      if (remainingItems.length === 0) {
        Alert.alert('Вітаю! Ви виконали всі завдання.');
        navigation.navigate('Train', {topicName});
        return;
      }
      const randomItem =
        remainingItems[Math.floor(Math.random() * remainingItems.length)];
      setCurrentItem(randomItem.word);
      generateChoices(randomItem.word);
    },
    [generateChoices, navigation, topicName],
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

  const renderProgress = () => (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      {[...Array(15)].map((_, i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor:
              i < totalCorrectAnswers
                ? isDarkTheme
                  ? 'white'
                  : '#67104c'
                : '#A9A9A9',
            margin: 3,
          }}
        />
      ))}
    </View>
  );

  if (level === 2) {
    return (
      <SafeAreaView
        style={[
          defaultStyles.container,
          {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
        ]}>
        {renderProgress()}
        {/* {renderContent(currentItem, playSound, isDarkTheme, isPlaying)} */}
        {currentItem ? renderContent(currentItem) : null}
        {renderChoices(choices, handleChoice, isDarkTheme)}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={[
          defaultStyles.container,
          {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
        ]}>
        {renderProgress()}
        {renderChoices(choices, handleChoice, isDarkTheme)}
        {currentItem ? renderContent(currentItem) : null}
        {/* {renderContent(currentItem, playSound, isDarkTheme, isPlaying)} */}
      </SafeAreaView>
    );
  }
};
