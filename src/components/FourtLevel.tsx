import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Alert,
  UIManager,
  findNodeHandle,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';

import {LevelProps} from './FirstLevel';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {RenderProgress} from './RenderProgress';
import {defaultStyles} from './defaultStyles';

export const FourthLevel: React.FC<LevelProps> = ({
  progress,
  level,
  topicName,
}) => {
  const navigation = useNavigation<NavigationProps<'Home'>>();
  const isDarkTheme = useSelector(selectTheme);

  const [images, setImages] = useState<{id: string; uri: string}[]>([]);
  const [words, setWords] = useState<{id: string; text: string}[]>([]);
  const [matches, setMatches] = useState<any>({});
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [lastWords, setLastWords] = useState<string[]>([]); // Для збереження використаних слів
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій

  const panRefs = useRef<{[key: string]: Animated.ValueXY}>({});
  const wordRefs = useRef<
    Record<string, React.RefObject<typeof Animated.View | any>>
  >({});
  const wordPositions = useRef<{
    [key: string]: {left: number; top: number; right: number; bottom: number};
  }>({});
  const imageRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!progress || progress.length === 0) return;

    // Вибір слів, уникаючи повторення з попередньої ітерації
    const availableWords = progress.filter(
      item => !lastWords.includes(item.world),
    );

    // Якщо доступних слів менше 4, дозволяємо повернутись до використаних
    const selectedWords =
      availableWords.length >= 4 ? availableWords : progress;

    const shuffledSelection = selectedWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // setLastWords(shuffledSelection.map(item => item.world)); // Оновлюємо останні слова

    // Підготовка картинок та слів
    const shuffledImages = shuffledSelection
      .map(item => ({id: item.world, uri: item.image}))
      .sort(() => Math.random() - 0.5);

    const shuffledWords = shuffledSelection
      .map(item => ({id: item.world, text: item.world}))
      .sort(() => Math.random() - 0.5);

    setImages(shuffledImages);
    setWords(shuffledWords);

    // Ініціалізація стану відповідностей
    const initialMatches: Record<string, string | null> = {};
    shuffledWords.forEach(word => {
      initialMatches[word.id] = null;
    });
    setMatches({...initialMatches});

    // Ініціалізація координат
    shuffledWords.forEach(word => {
      panRefs.current[word.id] = new Animated.ValueXY();
      wordPositions.current[word.id] = {left: 0, top: 0, right: 0, bottom: 0};
    });

    shuffledImages.forEach(image => {
      imageRefs.current[image.id] = null;
    });
  }, [iteration, lastWords, progress]);

  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
  };

  const createPanResponder = (wordId: any, pan: any) => {
    if (!pan) {
      pan = new Animated.ValueXY(); // Якщо `pan` ще не ініціалізований
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        const droppedWordId = detectDropArea(
          gestureState.moveX,
          gestureState.moveY,
        );

        if (droppedWordId && droppedWordId !== wordId) {
          swapWords(wordId, droppedWordId); // Змінюємо місцями слова
        }

        // Повертає слово у вихідну позицію
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    });
  };

  const detectDropArea = (x: number, y: number) => {
    for (const word of words) {
      // console.log(x, '- x', y, '- y');
      const bounds = wordPositions.current[word.id]; // Отримуємо координати з wordPositions
      if (!bounds) continue; // Пропускаємо, якщо координати ще не встановлені
      if (
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        return word.id; // Повертає ID слова, на яке скинули
      }
    }
    return null; // Якщо слово не знайдено
  };

  const swapWords = (wordId1: string, wordId2: string) => {
    setWords(prevWords => {
      const newWords = [...prevWords];
      const index1 = newWords.findIndex(word => word.id === wordId1);
      const index2 = newWords.findIndex(word => word.id === wordId2);

      if (index1 !== -1 && index2 !== -1) {
        // Зміна місцями
        const temp = newWords[index1];
        newWords[index1] = newWords[index2];
        newWords[index2] = temp;
      }

      return newWords; // Повертаємо оновлений масив
    });

    const isCorrect = words.every(
      (word, index) => word.id === images[index].id,
    );
    if (isCorrect) {
      checkMatches();
    }
  };

  useEffect(() => {
    words.forEach(word => {
      const ref = wordRefs.current[word.id]?.current;

      if (ref) {
        const handle = findNodeHandle(ref);
        if (handle) {
          setTimeout(() => {
            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
              if (!wordPositions.current) {
                wordPositions.current = {}; // Ініціалізуємо об'єкт, якщо його немає
              }
              wordPositions.current[word.id] = {
                left: pageX,
                top: pageY,
                right: pageX + width,
                bottom: pageY + height,
              };
            });
          }, 100);
        }
      }
    });
  }, [words]);

  const checkMatches = async () => {
    try {
      const isCorrect = words.every(
        (word, index) => word.id === images[index].id,
      );
      if (isCorrect) {
        const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
        setTotalCorrectAnswers(updatedTotalCorrectAnswers);
        if (updatedTotalCorrectAnswers === 15) {
          // await dispatch(updaterProgressUserThunk());
          Alert.alert(
            'Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан',
          );
          navigation.navigate('Train', {topicName});
        }

        handleNextIteration();
        return;
      }
      Alert.alert('Спробуйте ще раз.');
    } catch (error: any) {
      console.error('Помилка перевірки:', error.message);
    }
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <RenderProgress totalCorrectAnswers={totalCorrectAnswers} />
      <View style={styles.gameContainer}>
        <View style={styles.imagesContainer}>
          {images.map(image => (
            <View key={image.id} style={styles.imageBox}>
              <Image source={{uri: image.uri}} style={styles.image} />
              {matches[image.id] && (
                <Text style={styles.wordUnderImage}>{matches[image.id]}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Слова */}
        <View style={styles.wordsContainer}>
          {words.map(word => {
            const pan = panRefs.current[word.id];
            return (
              <Animated.View
                key={word.id}
                style={[
                  styles.wordBox,
                  {transform: pan.getTranslateTransform()},
                ]}
                {...createPanResponder(word.id, pan).panHandlers}
                ref={
                  wordRefs.current[word.id] ||
                  (wordRefs.current[word.id] = React.createRef())
                } // створює новий реф, якщо його ще немає
              >
                <Text style={styles.word}>{word.text}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
      <Pressable
        style={[
          defaultStyles.button,
          {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
        ]}
        onPress={checkMatches}>
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: isDarkTheme ? '#67104c' : 'white',
            },
          ]}>
          Перевірити
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  imagesContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  wordsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wordBox: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  wordUnderImage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  word: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
