import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../types/navigationTypes';
import {RenderProgress} from '../Vocabulary/RenderProgress';
import {defaultStyles} from '../defaultStyles';
import {LevelProps} from '../../types';

import {UIManager} from 'react-native';
import {DraggableWord} from './DraggableWord';

const FourthLevel: React.FC<LevelProps> = ({progress, titleName}) => {
  const navigation = useNavigation<NavigationProps<'Home'>>();
  const isDarkTheme = useSelector(selectTheme);

  const [images, setImages] = useState<{id: string; uri: string}[]>([]);
  const [words, setWords] = useState<{id: string; text: string}[]>([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0);

  // Збереження посилань на слова для замірів (React refs)
  const wordRefs = React.useRef<Map<string, number>>(new Map());

  // Позиції слів (left, top, right, bottom)
  const wordPositions = useRef<
    Record<string, {left: number; top: number; right: number; bottom: number}>
  >({});

  // Текущий ID слова, що перетягується
  const [draggingWordId, setDraggingWordId] = useState<string | null>(null);

  const [resetPositionTrigger, setResetPositionTrigger] = useState(false);

  const swapWords = (id1: string, id2: string) => {
    setWords(prevWords => {
      const newWords = [...prevWords];
      const index1 = newWords.findIndex(w => w.id === id1);
      const index2 = newWords.findIndex(w => w.id === id2);
      if (index1 === -1 || index2 === -1) return newWords;

      [newWords[index1], newWords[index2]] = [
        newWords[index2],
        newWords[index1],
      ];

      // Логіка перевірки правильності
      const isCorrect = newWords.every(
        (word, idx) => word.id === images[idx].id,
      );
      if (isCorrect) {
        const updatedCorrect = totalCorrectAnswers + 1;
        setTotalCorrectAnswers(updatedCorrect);

        if (updatedCorrect === 15) {
          Alert.alert(
            'Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан',
          );
          navigation.navigate('TrainVocabulary', {titleName});
        }
        //  else {
        //   setIteration(prev => prev + 1);
        // }
        else {
          setTimeout(() => {
            setIteration(prev => prev + 1);
          }, 2000); // затримка 2 секунди
        }
      }
      // Тригеримо скидання позиції
      setResetPositionTrigger(prev => !prev);
      return newWords;
    });
  };

  // Вибір і перемішування слів та картинок
  useEffect(() => {
    // console.log('useEffect running...', {progress, iteration});
    // console.log('progress.length:', progress?.length);

    if (!progress || progress.length === 0) {
      // console.log('Progress is empty, skipping effect');
      return;
    }

    // console.log('Passed the progress check ✅');

    // Вибираємо 4 слова без повторів
    // Відфільтрувати унікальні за ключем 'world'
    const uniqueProgressMap = new Map(progress.map(item => [item.world, item]));
    const uniqueProgress = Array.from(uniqueProgressMap.values());

    // Далі перемішати унікальні і вибрати 4
    const shuffledSelection = uniqueProgress
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // Формуємо слова та картинки
    const shuffledWords = shuffledSelection
      .map(item => ({id: item.world, text: item.world}))
      .sort(() => Math.random() - 0.5);

    const shuffledImages = shuffledSelection
      .map(item => ({id: item.world, uri: item.image}))
      .sort(() => Math.random() - 0.5);

    // Якщо слова і картинки співпадають позиціями, міняємо місцями
    let isSameOrder = shuffledWords.every(
      (word, index) => word.id === shuffledImages[index]?.id,
    );
    if (isSameOrder && shuffledWords.length >= 2) {
      [shuffledImages[0], shuffledImages[1]] = [
        shuffledImages[1],
        shuffledImages[0],
      ];
    }

    setWords(shuffledWords);
    setImages(shuffledImages);

    setDraggingWordId(null);
  }, [iteration, progress]);

  const checkCollision = (x: number, y: number) => {
    if (!draggingWordId) return;

    const otherWordIds = Array.from(wordRefs.current.keys()).filter(
      id => id !== draggingWordId,
    );

    otherWordIds.forEach(wordId => {
      const nodeHandle = wordRefs.current.get(wordId);
      if (!nodeHandle) return;

      UIManager.measure(nodeHandle, (fx, fy, width, height, px, py) => {
        // px, py - позиція в абсолютних координатах (екран)
        if (x >= px && x <= px + width && y >= py && y <= py + height) {
          // Тобто палец знаходиться всередині слова wordId — міняємо місцями
          swapWords(draggingWordId, wordId);
          setDraggingWordId(null);
        }
      });
    });
  };

  // Визначення слова, на яке скинули
  const detectDropArea = (x: number, y: number): string | null => {
    for (const wordId in wordPositions.current) {
      const pos = wordPositions.current[wordId];
      if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
        return wordId;
      }
    }
    return null;
  };

  // Замір позицій слів після оновлення списку слів
  useEffect(() => {
    words.forEach(word => {
      const nodeHandle = wordRefs.current.get(word.id);
      if (!nodeHandle) return;

      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        wordPositions.current[word.id] = {
          left: pageX,
          top: pageY,
          right: pageX + width,
          bottom: pageY + height,
        };
      });
    });
  }, [words]);

  const checkMatches = () => {
    const isCorrect = words.every((word, idx) => word.id === images[idx].id);
    if (isCorrect) {
      const updatedCorrect = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedCorrect);

      if (updatedCorrect === 15) {
        Alert.alert('Вітаю! Ви виконали всі завдання. Ви отримуєте 1 круасан');
        navigation.navigate('TrainVocabulary', {titleName});
      } else {
        setIteration(prev => prev + 1);
      }
    } else {
      Alert.alert('Спробуйте ще раз.');
    }
  };
  console.log('WORDS to render:', words, images);

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
              <Image
                source={{
                  uri: image.uri,
                }}
                style={styles.image}
              />
            </View>
          ))}
        </View>

        <View style={styles.wordsContainer}>
          {words.map(word => (
            <DraggableWord
              key={word.id}
              word={word}
              draggingWordId={draggingWordId}
              setDraggingWordId={setDraggingWordId}
              wordRefs={wordRefs}
              swapWords={swapWords}
              detectDropArea={detectDropArea}
              resetPosition={resetPositionTrigger}
              checkCollision={checkCollision}
            />
          ))}
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
            {color: isDarkTheme ? '#67104c' : 'white'},
          ]}>
          Перевірити
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  wordsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default FourthLevel;
