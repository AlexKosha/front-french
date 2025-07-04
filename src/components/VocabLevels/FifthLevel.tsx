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
import {initializeWordStats} from '../../helpers/wordHelpers';
import {markCurrentWordsAsCompleted} from '../../helpers/progressHelpers';
import {LevelProps, WordStat} from '../../types';

export const FifthLevel: React.FC<LevelProps> = ({
  progress,
  level,
  titleName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const isDarkTheme = useSelector(selectTheme);

  const [_word, setWord] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [wordWithBlanks, setWordWithBlanks] = useState<string[]>([]);
  const [wordStats, setWordStats] = useState<WordStat[]>([]);

  useEffect(() => {
    initializeWordStats(progress, level, setWordStats);
  }, [level, progress]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      setWord(currentWord.word.world);
      setImageUrl(currentWord.word.image);

      // Викликаємо функцію і отримуємо пропуски та правильні літери
      const {wordWithBlanks, correctLetters} = generateWordWithBlanks(
        currentWord.word.world,
      );

      // Оновлюємо стани
      setWordWithBlanks(wordWithBlanks);
      setCorrectLetters(correctLetters);

      // Ініціалізуємо userInput для введення користувачем
      setUserInput(
        wordWithBlanks.map((char: string) => (char === '_' ? '' : char)),
      );
    }
  }, [iteration, wordStats]);

  // Функція генерації пропусків
  const generateWordWithBlanks = (word: string) => {
    const wordArray = word.split('').map(char => char.toLowerCase());
    const wordLength = wordArray.filter(char => char !== ' ').length; // Ігноруємо пробіли

    let numBlanks = 0;
    if (wordLength <= 3) {
      numBlanks = 1;
    } else if (wordLength >= 4 && wordLength <= 6) {
      numBlanks = 2;
    } else if (wordLength >= 7) {
      numBlanks = 3;
    }

    // Explicitly type indices as number[] to fix the error
    const indices: number[] = []; // <-- Add type here
    while (indices.length < numBlanks) {
      const randomIndex = Math.floor(Math.random() * wordArray.length);
      if (!indices.includes(randomIndex) && wordArray[randomIndex] !== ' ') {
        indices.push(randomIndex);
      }
    }

    // Генеруємо слово з пропусками
    const wordWithBlanks = wordArray.map((char, index) =>
      indices.includes(index) ? '_' : char,
    );

    // Зберігаємо правильні літери в тому ж порядку, як вони з'являються
    const correctLetters = indices.map(index => wordArray[index]);

    // Повертаємо об'єкти для оновлення стану
    return {wordWithBlanks, correctLetters};
  };

  // Обробка введених букв
  const handleInputChange = (index: number, value: string) => {
    // Дозволяємо лише латинські літери, діакритичні символи та апостроф
    if (value && /^[a-zA-Z\u00C0-\u017F']$/.test(value)) {
      setUserInput(prevUserInput => {
        const newUserInput = [...prevUserInput];
        if (wordWithBlanks[index] !== ' ') {
          // Ігноруємо пробіли
          newUserInput[index] = value.toLowerCase();
        }
        return newUserInput;
      });
    } else if (value === '') {
      setUserInput(prevUserInput => {
        const newUserInput = [...prevUserInput];
        newUserInput[index] = '';
        return newUserInput;
      });
    }
  };

  const checkAnswer = async () => {
    const filteredUserInput = userInput
      .filter((_, index) => wordWithBlanks[index] === '_') // Беремо лише пропуски
      .filter(char => char !== ' '); // Ігноруємо пробіли

    // console.log('Filtered User Input:', filteredUserInput);
    // console.log('Correct Letters:', correctLetters);

    if (filteredUserInput.length !== correctLetters.length) {
      Alert.alert(
        'Кількість введених літер не співпадає з кількістю пропусків.',
      );
      return;
    }

    if (filteredUserInput.some(input => !input)) {
      Alert.alert('Всі поля повинні бути заповнені!');
      return;
    }

    const sortedUserInput = [...filteredUserInput].sort();
    const sortedCorrectLetters = [...correctLetters].sort();

    const isCorrect = sortedUserInput.every(
      (char, index) => char === sortedCorrectLetters[index],
    );

    if (isCorrect) {
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
        return;
      }
      handleNextIteration();
    } else {
      Alert.alert('Неправильно', 'Спробуйте ще раз.');
    }
  };

  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
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

      <View
        style={{
          flexDirection: 'row', // Розташування елементів у рядок
          justifyContent: 'center', // Центруємо по горизонталі
          alignItems: 'center', // Центруємо по вертикалі
          flexWrap: 'wrap', // Дозволяємо перенесення на новий рядок, якщо не вистачає місця
        }}>
        {wordWithBlanks.map((char, index) =>
          char === '_' ? (
            <TextInput
              key={`${index}-input`}
              style={{
                fontSize: 24,
                textAlign: 'center',
                marginHorizontal: 5,
                marginVertical: 10,
                padding: 5,
                backgroundColor: 'lightgray',
                width: 40,
                height: 40,
                borderRadius: 5,
              }}
              maxLength={1}
              value={userInput[index] || ''}
              onChangeText={value => handleInputChange(index, value)}
              keyboardType="default"
            />
          ) : (
            <Text
              key={`${index}-text`}
              style={{
                fontSize: 24,
                textAlign: 'center',
                marginHorizontal: char === ' ' ? 10 : 5, // Більший відступ для пробілів
                marginVertical: 10,
                padding: 5,
                width: char === ' ' ? 20 : 40, // Менша ширина для пробілів
                height: 40,
                lineHeight: 40,
                borderRadius: 5,
                backgroundColor: char === ' ' ? 'transparent' : 'lightgray',
              }}>
              {char}
            </Text>
          ),
        )}
      </View>

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
