import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'; // Для запису аудіо
import {useDispatch, useSelector} from 'react-redux';
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
import {RenderProgress} from '../RenderProgress';
import {sendAudio} from '../../services/authService';
import {defaultStyles} from '../defaultStyles';
import {LevelProps, WordStat} from '../../types';
import {initializeWordStats, markCurrentWordsAsCompleted} from '../../helpers';

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

  // Використовуємо useRef для збереження інстансу AudioRecorderPlayer
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());

  // useEffect(() => {
  //   if (wordStats.length > 0 && iteration < wordStats.length) {
  //     const currentWord = wordStats[iteration];

  //     if (currentWord.word.world !== word) {
  //       setWord(currentWord.word.world);
  //       setImageUrl(currentWord.word.image);
  //     }
  //   }
  // }, [iteration, wordStats]);

  // useEffect(() => {
  //   const initializeWordStats = () => {
  //     const unfinishedWords = progress.filter(
  //       word => !word.completed.includes(level),
  //     );
  //     if (unfinishedWords.length === 0) return;

  //     const selectedWords = unfinishedWords.slice(0, 5);
  //     const repeatedWords = [];
  //     for (let i = 0; i < 3; i++) {
  //       repeatedWords.push(...selectedWords);
  //     }
  //     setWordStats(repeatedWords.map(word => ({word, correctCount: 0})));
  //   };

  //   initializeWordStats();
  // }, [level, progress]);

  // Почати запис аудіо
  // useEffect(() => {
  //   audioRecorderPlayer.addRecordBackListener(() => {});

  //   // Запит дозволу на мікрофон
  //   requestMicrophonePermission();

  //   return () => {
  //     audioRecorderPlayer.removeRecordBackListener();
  //   };
  // }, []);

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
    try {
      // Перевіряємо, чи інстанс аудіо рекордера існує
      if (audioRecorderPlayer.current) {
        setIsRecording(true);
        await audioRecorderPlayer.current.startRecorder();

        // console.log('Запис почався:', result);
      } else {
        console.error('Аудіо рекордер не ініціалізовано');
      }
    } catch (error) {
      console.error('Помилка при запису аудіо:', error);
    }
  };

  // Завершити запис аудіо
  const stopRecording = async () => {
    try {
      if (audioRecorderPlayer) {
        // Перевірка, чи запис дійсно почався
        if (isRecording) {
          const result = await audioRecorderPlayer.current.stopRecorder();
          setIsRecording(false);
          // console.log('Запис завершено:', result); // Якщо все вірно, result повинен бути шляхом до файлу

          if (result && result !== 'Already stopped') {
            // Надсилаємо аудіофайл на сервер
            sendAudioForRecognition(result); // Надсилаємо шлях до файлу на сервер
          }
        }
      }
    } catch (error) {
      console.error('Помилка при завершенні запису:', error);
    }
  };

  // Надсилання аудіо на сервер
  const sendFormData = (audioUri: string): FormData => {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'video/mp4', // Перевірте, чи маєте правильний тип
      name: 'audio.mp4', // Назва файлу
    });
    return formData;
  };

  // Обробка введення користувача
  const handleUserInputChange = (value: string) => {
    setUserInput(value);
  };

  const handleServerResponse = (data: any) => {
    const {transcript} = data;

    handleUserInputChange(transcript); // Встановлюємо розпізнаний текст
  };

  const sendAudioForRecognition = async (audioUri: string) => {
    try {
      const formData = sendFormData(audioUri);
      const data = await sendAudio(formData);
      handleServerResponse(data);
    } catch (error) {
      console.error('Помилка при надсиланні аудіо:', error);
    }
  };

  // Виведення прогресу

  // Перехід до наступного слова
  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
    setUserInput(''); // Очистити введення
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
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.voiceButton}>
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
