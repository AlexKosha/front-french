import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../../store/auth/selector';
import {NavigationProps, RouteProps} from '../../types/navigationTypes';
import {Logo} from '../User/Logo';
import {defaultStyles} from '../defaultStyles';

export const TrainVocabulary = () => {
  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const isDarkTheme = useSelector(selectTheme);
  const route = useRoute<RouteProps<'TrainVocabulary'>>();
  const {titleName} = route.params;
  const [progress, setProgress] = useState([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Оновлення прогресу
  // Викликаємо `updateProgress` при фокусуванні на екрані TrainVocabulary
  useFocusEffect(
    useCallback(() => {
      const updateProgress = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('progress_all');
          const allProgress = jsonValue != null ? JSON.parse(jsonValue) : {};
          const topicData = allProgress?.progress?.[`progress_${titleName}`];

          const storedWords = Array.isArray(topicData?.words)
            ? topicData.words
            : [];

          setProgress(storedWords);

          // Визначаємо завершені рівні
          const levels = [];
          for (let level = 1; level <= 7; level++) {
            const isLevelCompleted = storedWords.every((word: any) =>
              word.completed?.includes(level),
            );
            if (isLevelCompleted) levels.push(level);
          }
          setCompletedLevels(levels);
        } catch (error) {
          console.error('Error fetching progress from storage:', error);
        }
      };

      updateProgress();
    }, [titleName]),
  );

  // Оновлення прогресу в AsyncStorage після змін
  useEffect(() => {
    const saveProgressToStorage = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('progress_all');
        const allProgress = jsonValue != null ? JSON.parse(jsonValue) : {};

        // Ініціалізуємо прогрес-об'єкт, якщо потрібно
        allProgress.progress = allProgress.progress || {};

        allProgress.progress[`progress_${titleName}`] = {
          updatedAt: Date.now(),
          words: progress,
        };

        await AsyncStorage.setItem('progress_all', JSON.stringify(allProgress));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    if (progress.length > 0) {
      saveProgressToStorage();
    }
  }, [progress, titleName]);

  // Обробка переходу до рівнів
  const handlePress = (level: number) => {
    if (!titleName) {
      console.error('titleName is undefined');
      return;
    }

    if (progress.length > 0 && !completedLevels.includes(level)) {
      navigation.navigate('TrainingLevel', {
        level,
        titleName,
        progress: progress as any[],
      });
    }
  };

  // Обробка переходу до вивчення слів
  const goToLearn = () => {
    if (!titleName) {
      console.error('titleName is undefined');
      return;
    }

    navigation.navigate('LearnVocabTheme', {titleName});
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View style={defaultStyles.btnContainer}>
        {progress.length === 0 && (
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Text
              style={{
                fontSize: 18,
                color: isDarkTheme ? 'white' : '#67104c',
                textAlign: 'center',
              }}>
              Щоб відкрилось тренування, вам потрібно вивчити хоча б декілька
              слів.
            </Text>
            <TouchableOpacity
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  marginTop: 20,
                },
              ]}
              onPress={goToLearn}>
              <Text
                style={[
                  defaultStyles.btnText,
                  {color: isDarkTheme ? '#67104c' : 'white'},
                ]}>
                Вивчити слова
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {[1, 2, 3, 4, 5, 6, 7].map(level => (
          <TouchableOpacity
            key={level}
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? 'white' : '#67104c',
                opacity: completedLevels.includes(level) ? 0.5 : 1, // Зміна прозорості
              },
            ]}
            onPress={() => handlePress(level)}
            disabled={completedLevels.includes(level)} // Заблокуємо, якщо рівень завершено
          >
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              Level {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Logo />
    </SafeAreaView>
  );
};
