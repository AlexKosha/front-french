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
import {RenderProgress} from '../Vocabulary/RenderProgress';
import {defaultStyles} from '../defaultStyles';

import {LevelProps, WordStat} from '../../types';
import {initializeWordStats, markCurrentWordsAsCompleted} from '../../helpers';

const SixthLevel: React.FC<LevelProps> = ({progress, level, titleName}) => {
  const [word, setWord] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [userInput, setUserInput] = useState(''); // Змінено для цілих слів

  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

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
    // Дозволяємо: латинські літери (включно з діакритиками), пробіли, апострофи ’'` (різні види)
    const filteredValue = value.replace(/[^a-zA-Z\u00C0-\u017F\s'’`]/g, '');
    setUserInput(filteredValue);
  };

  const normalizeApostrophes = (text: string) => {
    return text.replace(/[’‘`´‛]/g, "'"); // замінюємо різні апострофи на звичайний '
  };

  // Перевірка введеного слова
  const checkAnswer = async () => {
    if (!userInput) {
      Alert.alert('Помилка', 'Поле не може бути порожнім!');
      return;
    }
    const normalizedUserInput = normalizeApostrophes(
      userInput.trim().toLowerCase(),
    );
    const normalizedCorrectWord = normalizeApostrophes(
      word.trim().toLowerCase(),
    );

    if (normalizedUserInput === normalizedCorrectWord) {
      setIsCorrectAnswer(true); // підсвітка зеленим
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      setTimeout(async () => {
        setIsCorrectAnswer(false);
        if (updatedTotalCorrectAnswers === 15) {
          await markCurrentWordsAsCompleted(
            progress,
            wordStats,
            level,
            titleName,
            dispatch,
          );
          await dispatch(updaterProgressUserThunk());
          Alert.alert('Вітаю! Ви виконали всі завдання.');
          navigation.navigate('TrainVocabulary', {titleName});
          return;
        }
        handleNextIteration();
      }, 2000);
    } else {
      setIsWrongAnswer(true);
      setIsCorrectAnswer(false);

      setTimeout(() => {
        setIsWrongAnswer(false);
      }, 2000);
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
          borderWidth: 5,
          borderColor: isCorrectAnswer
            ? '#4CAF50'
            : isWrongAnswer
            ? '#f44336'
            : isDarkTheme
            ? 'white'
            : '#67104c',
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

export default SixthLevel;
