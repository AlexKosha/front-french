import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
import Tts from 'react-native-tts';
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
  progress: any[];
  topicName: string;
  renderContent: (param: WordItem, playText: () => void) => JSX.Element;
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

  const navigation = useNavigation<NavigationProps<'Train'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultRate(0.6, true);
        Tts.setDefaultPitch(1.5);
        Tts.setDefaultLanguage('fr-FR').catch(err =>
          console.log('Language not supported', err),
        );
      })
      .catch(err => console.error('TTS Init Error:', err));
  }, []);

  // Функція для озвучки слова через TTS
  // const playText = useCallback(() => {
  //   if (currentItem?.world) {
  //     Tts.stop() // Зупиняємо будь-який попередній голос
  //       .then(() => {
  //         console.log(currentItem.world);
  //         Tts.speak(currentItem.world, {
  //           iosVoiceId: 'com.apple.ttsbundle.Thomas-compact', // Обираємо голос для iOS
  //           rate: 0.9,
  //           androidParams: {
  //             KEY_PARAM_PAN: 0,
  //             KEY_PARAM_VOLUME: 1,
  //             KEY_PARAM_STREAM: 'STREAM_ALARM',
  //           },
  //         });
  //       })
  //       .catch(error => console.error('TTS language error:', error));
  //   }
  // }, [currentItem]);
  const playText = useCallback(() => {
    if (currentItem?.world) {
      // Прямо викликаємо Tts.speak(), без попереднього виклику Tts.stop()
      Tts.speak(currentItem.world, {
        iosVoiceId: 'com.apple.ttsbundle.Thomas-compact', // Обираємо голос для iOS
        rate: 0.5,
        androidParams: {
          KEY_PARAM_PAN: 0,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_ALARM',
        },
      });
    }
  }, [currentItem]);

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

  // useEffect(() => {
  //   Tts.setDefaultLanguage('fr-FR');
  //   Tts.setDefaultRate(0.5);
  // }, []);

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

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      {renderProgress()}
      {currentItem ? renderContent(currentItem, playText) : null}
      {renderChoices(choices, handleChoice, isDarkTheme)}
    </SafeAreaView>
  );
};
