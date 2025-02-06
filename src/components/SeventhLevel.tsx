import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import Voice from '@react-native-voice/voice';
import {LevelProps} from './FirstLevel';
import {WordStat} from './LevelComponent';

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
    const initializeWordStats = () => {
      const unfinishedWords = progress.filter(
        word => !word.completed.includes(level),
      );

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
  const currentWord = wordStats[currentWordIndex]?.word.world || '';

  // Обробка результату
  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      setRecognizedText(event.value[0]); // Беремо перший результат
    }
  };

  // Почати запис
  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      setIsRecording(true);
      setRecognizedText('');
      await Voice.start('en-US');
    } catch (e) {
      console.error('Error starting recording:', e);
    }
  };

  // Зупинити запис
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
    } catch (e) {
      console.error('Error stopping recording:', e);
    }
  };

  // Перевірка відповіді
  const checkAnswer = () => {
    if (recognizedText.trim().toLowerCase() === currentWord.toLowerCase()) {
      Alert.alert('Правильно!', 'Ваше слово збігається!');

      // Оновлення статистики
      const updatedStats = [...wordStats];
      updatedStats[currentWordIndex].correctCount += 1;

      // Перевіряємо, чи можна перейти до наступного слова
      // if (updatedStats[currentWordIndex].correctCount >= 3) {
      //   // Якщо слово завершено, позначаємо його як пройдене
      //   updatedStats[currentWordIndex].completed.push(level);
      //   setCurrentWordIndex(prevIndex => prevIndex + 1);
      // }

      setWordStats(updatedStats);
      setRecognizedText('');
    } else {
      Alert.alert('Неправильно', 'Спробуйте ще раз.');
    }
  };

  // Слухачі для Voice
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      if (Voice.destroy) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);
  // Якщо всі слова завершені
  if (currentWordIndex >= wordStats.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.completedText}>
          Вітаємо! Ви завершили рівень "{topicName}"!
        </Text>
      </View>
    );
  }

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Дозвіл на мікрофон відхилено');
        return false;
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.wordToSay}>Слово: {currentWord}</Text>
      <Button
        title={isRecording ? 'Запис йде...' : 'Натисніть, щоб говорити'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <Text style={styles.recognizedText}>
        Результат: {recognizedText || 'Ще нічого не розпізнано'}
      </Text>
      <Button title="Перевірити" onPress={checkAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  wordToSay: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recognizedText: {
    fontSize: 18,
    marginVertical: 20,
  },
  completedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});
