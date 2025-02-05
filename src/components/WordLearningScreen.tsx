import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
// import {Audio} from 'expo-av';
// import Icon from 'react-native-vector-icons/AntDesign';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {selectThemeWordId, selectVocab} from '../store/vocab/selectors';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../helpers/navigationTypes';

export interface WordItem {
  world: string;
  _id: string;
  translationEN: string;
  translationUK: string;
  image: string;
  audio: string;
}

export const WordLearningScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWordsCompleted, setAllWordsCompleted] = useState(false);
  const [totalShown, setTotalShown] = useState(0);
  // const [sound, setSound] = useState();
  const [sessionComplete, setSessionComplete] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const isDarkTheme = useSelector(selectTheme);
  const id = useSelector(selectThemeWordId);
  const navigation = useNavigation<NavigationProps<'WordLearningScreen'>>();

  const {t, i18n} = useTranslation();
  const vocabData = useSelector(selectVocab);
  const route = useRoute<RouteProps<'WordLearningScreen'>>();
  const {count, topicName, wordItem} = route.params;
  const [savedProgress, setSavedProgress] = useState<
    {
      word: WordItem;
      completed: any[];
    }[]
  >([]);

  const isSingleWordMode = Boolean(wordItem);

  const [selectedWords, setSelectedWords] = useState(
    isSingleWordMode ? [wordItem] : [],
  );

  const currentLanguage = i18n.language;

  const filteredWords = vocabData.filter(word => word.themeId === id);

  // Функція для завантаження прогресу

  // Функція для збереження прогресу
  const saveProgress = async (word: any) => {
    const updatedProgress = word.map((w: any) => ({
      ...w,
      completed: w.completed || [],
    }));
    const mergedProgress = [...savedProgress, ...updatedProgress];
    const progressForStorege = JSON.stringify(mergedProgress);
    await AsyncStorage.setItem(`progress_${topicName}`, progressForStorege);
  };

  const checkCompletion = (totalShown: number) => {
    if (totalShown >= filteredWords.length) {
      setAllWordsCompleted(true);
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(`progress_${topicName}`);
        const progress = jsonValue != null ? JSON.parse(jsonValue) : [];
        if (Array.isArray(progress)) {
          const updatedProgress = progress.map(word => ({
            ...word,
            completed: word.completed || [],
          }));
          setSavedProgress(updatedProgress);
          setTotalShown(updatedProgress.length);
        }
        setSelectedWords(
          filteredWords.slice(progress.length, progress.length + count),
        );
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    if (!isSingleWordMode) {
      loadProgress();
    }
    // return () => {
    //   if (sound) {
    //     sound.unloadAsync();
    //   }
    // };
  }, [
    totalShown,
    filteredWords.length,
    isSingleWordMode,
    topicName,
    filteredWords,
    count,
  ]);

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

  // const playSound = async () => {
  //   try {
  //     const audioUri = selectedWords[currentIndex]?.audio;
  //     if (!audioUri) {
  //       console.log('No audio available for this word.');
  //       return;
  //     }
  //     const {sound} = await Audio.Sound.createAsync(
  //       {uri: audioUri},
  //       {},
  //       onPlaybackStatusUpdate,
  //     );
  //     console.log(sound);
  //     setSound(sound);
  //     await sound.playAsync();
  //     setIsPlaying(true);
  //   } catch (error) {
  //     console.error('Error playing sound:', error);
  //     setIsPlaying(false);
  //   }
  // };

  // const onPlaybackStatusUpdate = status => {
  //   if (status.didJustFinish) {
  //     setIsPlaying(false);
  //   }
  // };

  const handleTrainWords = () => {
    navigation.navigate('Train', {topicName});
  };

  const handleChooseDifferentCount = () => {
    setTotalShown(0);
    navigation.navigate('Learn', {topicName});
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
              {t('LAT.word')}: {currentIndex + 1}
            </Text>
          )}

          <Image
            source={{uri: selectedWords[currentIndex]?.image}}
            style={defaultStyles.image}
          />
          {/* <TouchableOpacity onPress={playSound} disabled={isPlaying}>
            <Icon name="sound" size={30} color={isPlaying ? 'gray' : 'black'} />
          </TouchableOpacity> */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {selectedWords[currentIndex]?.world}
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginTop: 20,
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {currentLanguage === 'uk'
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
                  {t('rg.back')}
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
                  {t('btn.next')}
                </Text>
              </Pressable>
            )}
          </View>
        </>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {t('LAT.sessionCompleted')}
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
                {t('btn.repeat')}
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
              {t('btn.train')}
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
              {allWordsCompleted ? t('btn.goBack') : t('btn.chooseCount')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
