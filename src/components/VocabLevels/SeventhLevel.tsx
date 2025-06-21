import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'; // Для запису аудіо
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  Pressable,
  Alert,
  SafeAreaView,
} from 'react-native';

import {selectTheme} from '../../store/auth/selector';
import {AppDispatch} from '../../store/store';
import {NavigationProps} from '../../types/navigationTypes';
import {updaterProgressUserThunk} from '../../store/auth/authThunks';
import {RenderProgress} from '../Vocabulary/RenderProgress';
import {sendAudio} from '../../services/authService';
import {defaultStyles} from '../defaultStyles';
import {LevelProps, WordStat} from '../../types';
import {
  initializeWordStats,
  markCurrentWordsAsCompleted,
  useTTS,
} from '../../helpers';
import {useTranslationHelper} from '../../locale/useTranslation';
import {translations} from '../../locale/translations';
import {useLocalization} from '../../locale/LocalizationContext';

export const SeventhLevel: React.FC<LevelProps> = ({
  progress,
  level,
  titleName,
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const navigation = useNavigation<NavigationProps<'LearnVocabTheme'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [userInput, setUserInput] = useState(''); // Змінено для цілих слів
  const [word, setWord] = useState('');
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [iteration, setIteration] = useState(0); // Лічильник ітерацій
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [manualCheck, setManualCheck] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const {trainVerbCompleted, incorrect, tryAgain, emptyInput} =
    useTranslationHelper();
  const {speak} = useTTS();
  const {locale} = useLocalization();

  // Використовуємо useRef для збереження інстансу AudioRecorderPlayer
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());

  useEffect(() => {
    initializeWordStats(progress, level, setWordStats);
  }, [level, progress]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const currentWord = wordStats[iteration];
      if (currentWord.word.world !== word) {
        setWord(currentWord.word.world);
        setImageUrl(currentWord.word.image);
      }
    }
  }, [iteration, word, wordStats]);

  useEffect(() => {
    const recorder = audioRecorderPlayer.current;
    if (!recorder) return;
    requestMicrophonePermission();
    recorder.addRecordBackListener(() => {});

    return () => {
      recorder.removeRecordBackListener();
    };
  }, []);

  // Запит дозволу на мікрофон
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'This app needs access to your microphone to recognize speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Дозвіл отримано');
        } else {
          console.log('Дозвіл відхилено');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    await audioRecorderPlayer.current.startRecorder();

    // ⏱ Автоматично зупинити запис через 5 секунд
    recordingTimeout.current = setTimeout(async () => {
      await autoStopRecording(); // викликає stop і надсилає аудіо
    }, 4000);
  };

  const autoStopRecording = async () => {
    recordingTimeout.current = null;

    try {
      const result = await audioRecorderPlayer.current.stopRecorder();
      setIsRecording(false);
      if (result && result !== 'Already stopped') {
        sendAudioForRecognition(result);
      }
    } catch (error) {
      console.error('Автоматична зупинка не вдалася:', error);
    }
  };

  // Завершити запис аудіо
  const stopRecording = async () => {
    if (!isRecording) return;
    const result = await audioRecorderPlayer.current.stopRecorder();
    setIsRecording(false);
    if (result && result !== 'Already stopped') {
      sendAudioForRecognition(result);
    }
  };

  // Надсилання аудіо на сервер
  // const sendFormData = (audioUri: string): FormData => {
  //   const formData = new FormData();
  //   formData.append('audio', {
  //     uri: audioUri,
  //     type: 'video/mp4', // Перевірте, чи маєте правильний тип
  //     name: 'audio.mp4', // Назва файлу
  //   });
  //   return formData;
  // };

  // // Обробка введення користувача

  // const handleServerResponse = (data: any) => {
  //   const {transcript} = data;

  //   setUserInput(transcript); // Встановлюємо розпізнаний текст
  // };

  // const sendAudioForRecognition = async (audioUri: string) => {
  //   try {
  //     const formData = sendFormData(audioUri);
  //     const data = await sendAudio(formData);
  //     handleServerResponse(data);
  //   } catch (error) {
  //     console.error('Помилка при надсиланні аудіо:', error);
  //   }
  // };

  const handleFailedAttempt = () => {
    const newAttempts = wrongAttempts + 1;
    setWrongAttempts(newAttempts);

    if (newAttempts >= 3) {
      setManualCheck(true);
    }

    setUserInput('');
    Alert.alert(incorrect, tryAgain);
  };

  const sendAudioForRecognition = async (audioUri: string) => {
    setIsAwaitingResponse(true);

    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'video/mp4',
      name: 'audio.mp4',
    } as any);

    try {
      const {transcript} = await sendAudio(formData);
      setUserInput(transcript);

      if (!transcript) {
        handleFailedAttempt();
        return;
      }

      if (wrongAttempts < 2) {
        checkAnswer(transcript);
      }
    } catch (err) {
      console.error('Помилка при надсиланні аудіо:', err);
      handleFailedAttempt();
    } finally {
      setIsAwaitingResponse(false);
    }
  };

  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
    setUserInput(''); // Очистити введення
  };
  // Перехід до наступного слова
  const handleCorrectAnswer = async () => {
    const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
    setTotalCorrectAnswers(updatedTotalCorrectAnswers);
    setWrongAttempts(0);
    setManualCheck(false);
    setUserInput('');

    if (updatedTotalCorrectAnswers === 15) {
      await markCurrentWordsAsCompleted(
        progress,
        wordStats,
        level,
        titleName,
        dispatch,
      );
      await dispatch(updaterProgressUserThunk());
      Alert.alert('', trainVerbCompleted);
      navigation.navigate('TrainVocabulary', {titleName});
    } else {
      handleNextIteration();
    }
  };

  // Перевірка введеного слова
  const checkAnswer = (inputOverride?: string) => {
    const input = inputOverride ?? userInput;

    if (!input) {
      if (manualCheck) Alert.alert('', emptyInput);
      return;
    }

    const normalizedCorrectWord = word.trim().toLowerCase();

    const user = input.trim().toLowerCase();

    if (user === normalizedCorrectWord) {
      handleCorrectAnswer();
    } else {
      handleFailedAttempt();
    }
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

      <TouchableOpacity
        onPress={
          isRecording
            ? stopRecording
            : isAwaitingResponse
            ? undefined // 👉 Заборонити запис, якщо чекаємо
            : startRecording
        }
        disabled={isAwaitingResponse} // 👉 Блокує на рівні TouchableOpacity
        style={[styles.voiceButton, isAwaitingResponse && {opacity: 0.5}]}>
        {isRecording ? (
          <Text style={styles.voiceButtonText}>•••</Text>
        ) : (
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/4980/4980251.png',
            }}
            style={{width: 45, height: 45}}
          />
        )}
      </TouchableOpacity>

      {wrongAttempts >= 2 && (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => speak(word)}>
            <Icon name="sound" size={40} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {manualCheck && (
        <>
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
            placeholder={translations.inputs.typeHeard[locale as 'en' | 'uk']}
            placeholderTextColor={isDarkTheme ? 'white' : '#67104c'}
            value={userInput}
            onChangeText={setUserInput}
            autoCapitalize="none"
            keyboardType="default"
            editable
          />

          <Pressable
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={() => checkAnswer()}>
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              Перевірити
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
  },
  voiceButton: {
    marginLeft: 10,
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
});
