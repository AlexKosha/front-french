import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
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
import {InteractionManager} from 'react-native';

import {updaterProgressUserThunk} from '../../store/auth/authThunks';
import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../types/navigationTypes';
import {AppDispatch} from '../../store/store';
import {RenderProgress} from '../Vocabulary/RenderProgress';
import {defaultStyles} from '../defaultStyles';
import {initializeWordStats} from '../../helpers/wordHelpers';
import {markCurrentWordsAsCompleted} from '../../helpers/progressHelpers';
import {LevelProps, WordStat} from '../../types';

const FifthLevel: React.FC<LevelProps> = ({progress, level, titleName}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const isDarkTheme = useSelector(selectTheme);

  const [_word, setWord] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const [correctLetters, setCorrectLetters] = useState<
    {index: number; char: string}[]
  >([]);

  const [userInput, setUserInput] = useState<string[]>([]);
  const [wordWithBlanks, setWordWithBlanks] = useState<string[]>([]);
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  useEffect(() => {
    initializeWordStats(progress, level, setWordStats);
  }, [level, progress]);

  useEffect(() => {
    // Очистимо refs перед новим рендером
    inputRefs.current = [];

    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      setWord(currentWord.word.world);
      setImageUrl(currentWord.word.image);

      const {wordWithBlanks, correctLetters, blankIndices} =
        generateWordWithBlanks(currentWord.word.world);

      setWordWithBlanks(wordWithBlanks);
      setCorrectLetters(correctLetters);
      setBlankIndices(blankIndices);

      setUserInput(wordWithBlanks.map(char => (char === '_' ? '' : char)));

      // Через маленьку затримку перевіряємо refs і фокус
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          console.log('Blank indices:', blankIndices);
          console.log('Input refs keys:', Object.keys(inputRefs.current));
          console.log('Trying to focus input at index:', blankIndices[0]);

          if (inputRefs.current[blankIndices[0]]) {
            inputRefs.current[blankIndices[0]]?.focus();
          } else {
            console.log('No input ref found at index:', blankIndices[0]);
          }
        }, 50);
      });
    }
  }, [iteration, wordStats]);

  const focusNextInput = (currentIndex: number) => {
    const currentBlankIndex = blankIndices.indexOf(currentIndex);
    const nextBlankIndex = blankIndices[currentBlankIndex + 1];

    if (nextBlankIndex !== undefined) {
      InteractionManager.runAfterInteractions(() => {
        const nextRef = inputRefs.current[nextBlankIndex];
        if (nextRef) {
          nextRef.focus();
        }
      });
    }
  };

  const generateWordWithBlanks = (word: string) => {
    const wordArray = word.split('').map(char => char.toLowerCase());
    // рахуємо довжину слова без пробілів і апострофів
    const wordLength = wordArray.filter(
      char => char !== ' ' && char !== "'",
    ).length;

    let numBlanks = 0;
    if (wordLength <= 3) {
      numBlanks = 1;
    } else if (wordLength >= 4 && wordLength <= 6) {
      numBlanks = 2;
    } else if (wordLength >= 7) {
      numBlanks = 3;
    }

    const indices: number[] = [];
    while (indices.length < numBlanks) {
      const randomIndex = Math.floor(Math.random() * wordArray.length);
      // пропуски не ставимо на пробіли і апострофи
      if (
        !indices.includes(randomIndex) &&
        wordArray[randomIndex] !== ' ' &&
        wordArray[randomIndex] !== "'"
      ) {
        indices.push(randomIndex);
      }
    }

    indices.sort((a, b) => a - b);

    const wordWithBlanks = wordArray.map((char, index) =>
      indices.includes(index) ? '_' : char,
    );

    const correctLetters = indices.map(index => ({
      index,
      char: wordArray[index],
    }));

    return {wordWithBlanks, correctLetters, blankIndices: indices};
  };

  // Обробка введених букв
  const handleInputChange = (index: number, value: string) => {
    // Дозволяємо лише латинські літери,
    if (value && /^[a-zA-Z\u00C0-\u017F]$/.test(value)) {
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
      .filter((_, index) => wordWithBlanks[index] === '_') // беремо лише пропуски
      .filter(char => char !== ' '); // ігноруємо пробіли

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

    // Порівняння по позиціях
    const isCorrect = correctLetters.every(
      ({index, char}) => userInput[index] === char,
    );

    if (isCorrect) {
      setIsCorrectAnswer(true); // Включаємо підсвітку зеленим

      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);

      // Затримка 2 секунди, щоб користувач побачив підсвітку
      setTimeout(async () => {
        setIsCorrectAnswer(false); // Вимикаємо підсвітку

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
          return;
        }

        handleNextIteration();
      }, 2000);
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
          flexWrap: 'wrap',
          backgroundColor: isCorrectAnswer ? '#4CAF50' : 'transparent',
          borderRadius: 5,
          padding: 5, // Дозволяємо перенесення на новий рядок, якщо не вистачає місця
        }}>
        {wordWithBlanks.map((char, index) =>
          char === '_' ? (
            <TextInput
              key={`${index}-input`}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
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
              onChangeText={value => {
                handleInputChange(index, value);

                if (value && /^[a-zA-Z\u00C0-\u017F']$/.test(value)) {
                  focusNextInput(index);
                }
              }}
              keyboardType="default"
            />
          ) : (
            <Text
              key={`${index}-text`}
              style={{
                fontSize: 24,
                textAlign: 'center',
                marginHorizontal: char === ' ' ? 10 : 5,
                marginVertical: 10,
                padding: 5,
                width: char === ' ' ? 20 : 40,
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

export default FifthLevel;
