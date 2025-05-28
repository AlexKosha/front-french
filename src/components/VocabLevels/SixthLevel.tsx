import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {updaterProgressUserThunk} from '../../store/auth/authThunks';
import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../types/navigationTypes';
import {AppDispatch} from '../../store/store';
import {RenderProgress} from '../RenderProgress';
import {defaultStyles} from '../defaultStyles';

import {LevelProps, WordStat} from '../../types';
import {initializeWordStats, markCurrentWordsAsCompleted} from '../../helpers';

export const SixthLevel: React.FC<LevelProps> = ({
  progress,
  level,
  titleName,
}) => {
  const [word, setWord] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [userInput, setUserInput] = useState(''); // Змінено для цілих слів

  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);

  // Ініціалізація слів з прогресу
  useEffect(() => {
    initializeWordStats(progress, level, setWordStats);
  }, [level, progress]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      // console.log('Правильне слово:', currentWord.word.world);
      setWord(currentWord.word.world);
      setImageUrl(currentWord.word.image);
    }
  }, [iteration, wordStats]);

  // Обробка введення користувача
  const handleUserInputChange = (value: string) => {
    setUserInput(value);
  };

  // Перевірка введеного слова
  const checkAnswer = async () => {
    // console.log("Перевірка відповіді почалась");
    if (!userInput) {
      Alert.alert('Помилка', 'Поле не може бути порожнім!');
      return;
    }

    const normalizedUserInput = userInput.trim().toLowerCase();
    const normalizedCorrectWord = word.trim().toLowerCase();

    if (normalizedUserInput === normalizedCorrectWord) {
      // console.log('Вірно! Слово співпало.');
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      if (updatedTotalCorrectAnswers === 15) {
        await markCurrentWordsAsCompleted(
          progress,
          wordStats,
          level,
          titleName,
        );
        await dispatch(updaterProgressUserThunk());
        Alert.alert('Вітаю! Ви виконали всі завдання.');
        navigation.navigate('Train', {titleName});
        return;
      }

      handleNextIteration();
    } else {
      Alert.alert('Неправильно', 'Спробуйте ще раз.');
    }
  };

  // Перехід до наступного слова
  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
    setUserInput('');
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <RenderProgress totalCorrectAnswers={totalCorrectAnswers} />

      <View style={{alignItems: 'center', marginVertical: 20}}>
        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={{width: 200, height: 200, borderRadius: 10}}
          />
        )}
      </View>

      <TextInput
        style={{
          fontSize: 24,
          textAlign: 'center',
          borderWidth: 1,
          borderColor: isDarkTheme ? 'white' : '#67104c',
          borderRadius: 10,
          padding: 10,
          marginHorizontal: 20,
          marginVertical: 20,
          color: isDarkTheme ? 'white' : '#67104c',
        }}
        placeholder="Введіть слово"
        placeholderTextColor={isDarkTheme ? 'white' : '#67104c'}
        value={userInput}
        onChangeText={handleUserInputChange}
        autoCapitalize="none"
        keyboardType="default"
      />

      <Pressable
        style={[
          defaultStyles.button,
          {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
        ]}
        onPress={checkAnswer}>
        <Text
          style={[
            defaultStyles.btnText,
            {color: isDarkTheme ? '#67104c' : 'white'},
          ]}>
          Перевірити
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};
