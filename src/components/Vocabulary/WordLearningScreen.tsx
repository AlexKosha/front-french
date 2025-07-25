import {useRoute, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

import {selectThemeWordId, selectVocab} from '../../store/vocab/selectors';
import {selectTheme, selectUserId} from '../../store/auth/selector';
import {NavigationProps, RouteProps} from '../../types/navigationTypes';
import {useTranslationHelper} from '../../locale/useTranslation';
import {useLocalization} from '../../locale/LocalizationContext';
import {defaultStyles} from '../defaultStyles';
import {WordItemProgress, WordProgress} from '../../types';
import {useTTS} from '../../helpers';
import {updateLocallyProgress} from '../../store/progress/progressThunk';
import {AppDispatch} from '../../store/store';

export const WordLearningScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [totalShown, setTotalShown] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const isDarkTheme = useSelector(selectTheme);
  const id = useSelector(selectThemeWordId);
  const navigation = useNavigation<NavigationProps<'WordLearningScreen'>>();
  const {locale} = useLocalization();
  const {
    word,
    back,
    next,
    sessionCompleted,
    train,
    repeat,
    goBack,
    chooseCount,
  } = useTranslationHelper();

  const vocabData = useSelector(selectVocab);
  const userId = useSelector(selectUserId);
  const route = useRoute<RouteProps<'WordLearningScreen'>>();
  const dispatch = useDispatch<AppDispatch>();
  const {count, titleName, wordItem} = route.params;
  const [savedProgress, setSavedProgress] = useState<WordProgress[]>([]);

  const isSingleWordMode = Boolean(wordItem);

  const [selectedWords, setSelectedWords] = useState(
    isSingleWordMode ? [wordItem] : [],
  );

  const {speak} = useTTS();

  const playSound = () => {
    if (selectedWords[currentIndex]?.world)
      speak(selectedWords[currentIndex].world);
  };

  const saveProgress = async (words: WordProgress[]) => {
    try {
      const updatedProgress: WordProgress[] = words.map(w => ({
        _id: w._id,
        world: w.world,
        translationEN: w.translationEN,
        translationUK: w.translationUK,
        image: w.image,
        themeId: w.themeId,
        completed: w.completed || [],
      }));

      const jsonValue = await AsyncStorage.getItem('progress_all');
      const allProgress = jsonValue ? JSON.parse(jsonValue) : {};

      const themeKey = `progress_${titleName}`;

      allProgress.progress = allProgress.progress || {};

      const merged = [...savedProgress, ...updatedProgress];

      const updatedTheme = {
        updatedAt: Date.now(),
        words: merged,
      };

      allProgress.progress[themeKey] = updatedTheme;

      if (!allProgress.userId) {
        allProgress.userId = userId;
      }

      await AsyncStorage.setItem('progress_all', JSON.stringify(allProgress));

      dispatch(updateLocallyProgress({[themeKey]: updatedTheme}));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const checkCompletion = (totalShown: number) => {
    if (totalShown >= filteredWords.length) {
      setAllWordsCompleted(true);
    }
  };

  const filteredWords = useMemo(
    () => vocabData.filter(word => word.themeId === id),
    [vocabData, id],
  );

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('progress_all');
        const allProgress = jsonValue ? JSON.parse(jsonValue) : {};

        const themeKey = `progress_${titleName}`;
        const progressData = allProgress?.progress?.[themeKey];

        const progress = Array.isArray(progressData?.words)
          ? progressData.words
          : [];

        const updatedProgress = progress.map((word: WordItemProgress) => ({
          ...word,
          completed: word.completed || [],
        }));

        setSavedProgress(updatedProgress);
        setTotalShown(updatedProgress.length);
        setSelectedWords(
          filteredWords.slice(
            updatedProgress.length,
            updatedProgress.length + count,
          ),
        );
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    if (!isSingleWordMode) loadProgress();
  }, [isSingleWordMode, titleName, count, filteredWords]);

  const handleNextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      const newTotalShown = totalShown + selectedWords.length;
      setSessionComplete(true);
      setTotalShown(newTotalShown);
      saveProgress(selectedWords);
      checkCompletion(newTotalShown);
    }
  };

  const handleBackWord = () => {
    if (isSingleWordMode) {
      navigation.goBack();
    }
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  const handleRepeatSameCount = () => {
    const nextStartIndex = totalShown;
    const nextEndIndex = Math.min(totalShown + count, filteredWords.length);
    if (nextEndIndex > nextStartIndex) {
      setSelectedWords(filteredWords.slice(nextStartIndex, nextEndIndex));
      setCurrentIndex(0);
      setSessionComplete(false);
    } else {
      Alert.alert('No more new words to show!');
    }
  };

  const handleTrainWords = () => {
    navigation.navigate('TrainVocabulary', {titleName});
  };

  const handleChooseDifferentCount = () => {
    setTotalShown(0);
    navigation.navigate('LearnVocabTheme', {titleName});
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDarkTheme ? '#67104c' : 'white',
        },
      ]}>
      {!sessionComplete ? (
        <>
          {!isSingleWordMode && (
            <Text
              style={{
                color: isDarkTheme ? 'white' : '#67104c',
                fontSize: 16,
              }}>
              {word}: {currentIndex + 1}
            </Text>
          )}

          <Image
            source={{uri: selectedWords[currentIndex]?.image}}
            style={defaultStyles.image}
          />
          <TouchableOpacity onPress={playSound}>
            <Icon
              name="sound"
              size={40}
              color={isDarkTheme ? 'white' : '#67104c'}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: isDarkTheme ? 'white' : 'black',
            }}>
            {selectedWords[currentIndex]?.world}
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginTop: 5,
              color: isDarkTheme ? 'white' : 'black',
            }}>
            {locale === 'uk'
              ? selectedWords[currentIndex]?.translationUK
              : selectedWords[currentIndex]?.translationEN}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {(isSingleWordMode || currentIndex > 0) && (
              <Pressable
                style={[
                  defaultStyles.button,
                  {
                    width: 150,
                    backgroundColor: isDarkTheme ? 'white' : '#67104c',
                    marginRight: 10,
                  },
                ]}
                onPress={handleBackWord}>
                <Text
                  style={[
                    defaultStyles.btnText,
                    {
                      color: isDarkTheme ? '#67104c' : 'white',
                    },
                  ]}>
                  {back}
                </Text>
              </Pressable>
            )}

            {!isSingleWordMode && (
              <Pressable
                style={[
                  defaultStyles.button,
                  {
                    width: 150,
                    backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}
                onPress={handleNextWord}>
                <Text
                  style={[
                    defaultStyles.btnText,
                    {
                      color: isDarkTheme ? '#67104c' : 'white',
                    },
                  ]}>
                  {next}
                </Text>
              </Pressable>
            )}
          </View>
        </>
      ) : (
        // Session Completed
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {sessionCompleted}
          </Text>
          {!allWordsCompleted && (
            <TouchableOpacity
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isDarkTheme ? 'white' : '#67104c',
                },
              ]}
              onPress={handleRepeatSameCount}>
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? '#67104c' : 'white',
                  },
                ]}>
                {repeat}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? 'white' : '#67104c',
              },
            ]}
            onPress={handleTrainWords}>
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              {train}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? 'white' : '#67104c',
              },
            ]}
            onPress={handleChooseDifferentCount}>
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              {allWordsCompleted ? goBack : chooseCount}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
