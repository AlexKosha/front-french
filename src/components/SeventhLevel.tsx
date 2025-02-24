import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import Voice from '@react-native-voice/voice';
import {LevelProps} from './FirstLevel';
import {WordStat} from './LevelComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const SeventhLevel: React.FC<LevelProps> = ({
  progress,
  level,
  topicName,
}) => {
  const [isRecording, setIsRecording] = useState(false); // Чи активний запис
  const [recognizedText, setRecognizedText] = useState(''); // Текст після розпізнавання
  const [currentWordIndex, _setCurrentWordIndex] = useState(0); // Індекс поточного слова
  const [wordStats, setWordStats] = useState<WordStat[]>([]);

  useEffect(() => {
    const initVoice = async () => {
      try {
        // Перевіряємо, чи доступний модуль Voice
        if (Voice && Voice.isAvailable) {
          await Voice.isAvailable(); // Переконайтеся, що Voice доступний
          Voice.onSpeechStart = onSpeechStart;
          Voice.onSpeechEnd = stopRecording;
          Voice.onSpeechResults = onSpeechResults;
          Voice.onSpeechError = error => console.log('onSpeechError', error);
        } else {
          console.error('Voice module is not available');
        }
      } catch (e) {
        console.error('Voice module not available:', e);
      }
    };

    initVoice();

    return () => {
      Voice.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const initializeWordStats = () => {
      const unfinishedWords = progress.filter(
        word => !word.completed.includes(level),
      );

      console.log('Voice:', Voice);
      console.log('Voice.start:', Voice?.start);
      console.log('Voice.isRecognizing:', Voice?.isRecognizing);

      if (unfinishedWords.length === 0) {
        Alert.alert(
          'Усі слова пройдені!',
          'Можете переходити до наступного рівня.',
        );
        return;
      }

      // Беремо перші 5 слів і повторюємо їх 3 рази
      const selectedWords = unfinishedWords.slice(0, 5);
      const repeatedWords = [];
      for (let i = 0; i < 3; i++) {
        repeatedWords.push(...selectedWords);
      }

      // Ініціалізуємо статистику
      setWordStats(repeatedWords.map(word => ({word, correctCount: 0})));
    };

    initializeWordStats();
  }, [level, progress]);

  // Поточне слово
  // const currentWord = wordStats[currentWordIndex]?.word.world || '';

  const onSpeechStart = (event: any) => {
    console.log('Recording Started...', event);
  };

  // Обробка результату
  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const text = event.value[0];
      console.log(text);
      setRecognizedText(text); // Беремо перший результат
    }
  };

  // Почати запис
  const startRecording = async () => {
    setIsRecording(true);
    // const hasPermission = await requestMicrophonePermission();
    // if (!hasPermission) return;

    try {
      await Voice.start('en-US');
      // const isAvailable = await Voice.isRecognizing();
      // if (!isAvailable) {
      //   throw new Error('Voice recognition is not available on this device.');
      // }

      setRecognizedText('');
    } catch (e) {
      console.error('Error starting recording:', e);
    }
  };

  // useEffect(() => {
  //   const initVoice = async () => {
  //     try {
  //       if (!Voice._loaded) {
  //         await Voice.isAvailable();
  //       }
  //     } catch (e) {
  //       console.error('Voice module not available:', e);
  //     }
  //   };
  //   initVoice();
  // }, []);

  // Зупинити запис
  const stopRecording = async () => {
    try {
      Voice.removeAllListeners();
      setIsRecording(false);
      // await Voice.stop();
    } catch (e) {
      console.error('Error stopping recording:', e);
    }
  };

  // Перевірка відповіді
  // const checkAnswer = () => {
  //   if (recognizedText.trim().toLowerCase() === currentWord.toLowerCase()) {
  //     Alert.alert('Правильно!', 'Ваше слово збігається!');

  //     // Оновлення статистики
  //     const updatedStats = [...wordStats];
  //     updatedStats[currentWordIndex].correctCount += 1;

  //     // Перевіряємо, чи можна перейти до наступного слова
  //     // if (updatedStats[currentWordIndex].correctCount >= 3) {
  //     //   // Якщо слово завершено, позначаємо його як пройдене
  //     //   updatedStats[currentWordIndex].completed.push(level);
  //     //   setCurrentWordIndex(prevIndex => prevIndex + 1);
  //     // }

  //     setWordStats(updatedStats);
  //     setRecognizedText('');
  //   } else {
  //     Alert.alert('Неправильно', 'Спробуйте ще раз.');
  //   }
  // };

  // Слухачі для Voice
  // useEffect(() => {
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.removeAllListeners();
  //   };
  // }, []);

  // Якщо всі слова завершені
  // if (currentWordIndex >= wordStats.length) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.completedText}>
  //         Вітаємо! Ви завершили рівень "{topicName}"!
  //       </Text>
  //     </View>
  //   );
  // }

  // const requestMicrophonePermission = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     );
  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       Alert.alert('Дозвіл на мікрофон відхилено');
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={recognizedText}
          onChangeText={(text: string) => setRecognizedText(text)}
        />
        <TouchableOpacity
          onPress={() => (!isRecording ? stopRecording() : startRecording())}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E0',
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
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
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6969',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
