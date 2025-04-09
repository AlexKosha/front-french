import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../types/navigationTypes';
import {Logo} from './Logo';
import {defaultStyles} from './defaultStyles';

export const Train = () => {
  const navigation = useNavigation<NavigationProps<'Learn'>>();
  const isDarkTheme = useSelector(selectTheme);
  const route = useRoute<RouteProps<'Train'>>();
  const {topicName} = route.params;
  const [progress, setProgress] = useState([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Оновлення прогресу
  // Викликаємо `updateProgress` при фокусуванні на екрані Train
  useFocusEffect(
    useCallback(() => {
      const updateProgress = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(`progress_${topicName}`);
          const storageProgress =
            jsonValue != null ? JSON.parse(jsonValue) : [];
          setProgress(storageProgress);

          // Перевірка завершення кожного рівня
          const levels = [];
          for (let level = 1; level <= 7; level++) {
            const isLevelCompleted = storageProgress.every(
              (word: any) => word.completed && word.completed.includes(level),
            );
            if (isLevelCompleted) levels.push(level); // Додаємо завершений рівень
          }
          setCompletedLevels(levels);
        } catch (error) {
          console.error('Error fetching progress from storage:', error);
        }
      };

      updateProgress();
    }, [topicName]),
  );

  // Оновлення прогресу в AsyncStorage після змін
  useEffect(() => {
    const saveProgressToStorage = async () => {
      try {
        await AsyncStorage.setItem(
          `progress_${topicName}`,
          JSON.stringify(progress),
        );
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    if (progress.length > 0) {
      saveProgressToStorage();
    }
  }, [progress, topicName]);

  // Обробка переходу до рівнів
  const handlePress = (level: number) => {
    if (!topicName) {
      console.error('topicName is undefined');
      return;
    }

    if (progress.length > 0 && !completedLevels.includes(level)) {
      navigation.navigate('TrainingLevel', {
        level,
        topicName,
        progress: progress as any[],
      });
    }
  };

  // Обробка переходу до вивчення слів
  const goToLearn = () => {
    if (!topicName) {
      console.error('topicName is undefined');
      return;
    }

    navigation.navigate('Learn', {topicName});
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
