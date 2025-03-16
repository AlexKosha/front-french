import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LevelProps} from './FirstLevel';

import AudioRecorderPlayer from 'react-native-audio-recorder-player'; // Для запису аудіо
import axios from 'axios'; // Для HTTP-запитів

export const SeventhLevel: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
}) => {
  const [isRecording, setIsRecording] = useState(false); // Чи активний запис
  const [recognizedText, setRecognizedText] = useState(''); // Текст після розпізнавання
  const [audioUri, setAudioUri] = useState(''); // URI для аудіофайлу

  const audioRecorderPlayer = new AudioRecorderPlayer(); // Ініціалізація рекордера

  // Запит на доступ до мікрофона
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

  // Початок запису аудіо
  const startRecording = async () => {
    try {
      if (audioRecorderPlayer) {
        console.log('====================================');
        console.log(audioRecorderPlayer);
        console.log('====================================');
        setIsRecording(true);
        const result: any = await audioRecorderPlayer.startRecorder();
        console.log('Запис розпочато: ', result);
        setAudioUri(result); // Зберігаємо URI файлу аудіо
      } else {
        console.error('audioRecorderPlayer не ініціалізовано');
      }
    } catch (error) {
      console.error('Помилка при початку запису: ', error);
    }
  };

  // Завершення запису аудіо
  const stopRecording = async () => {
    try {
      if (audioRecorderPlayer) {
        setIsRecording(false);
        const result = await audioRecorderPlayer.startRecorder(undefined, {
          format: 'wav', // Примусове збереження у форматі WAV
          sampleRate: 16000,
          encoder: 'pcm_s16le',
        });

        console.log('Запис завершено: ', result);
        sendAudioForRecognition(result); // Зберігаємо URI файлу аудіо
      } else {
        console.error('audioRecorderPlayer не ініціалізовано');
      }
    } catch (error) {
      console.error('Помилка при зупинці запису: ', error);
    }
  };

  // Надсилання аудіо на сервер для розпізнавання
  const sendAudioForRecognition = async (audioUri: string) => {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/', // Переконайтесь, що формат відповідає вимогам
        name: 'audio.wav',
      });

      const response = await axios.post(
        'http://<ваш-сервер>/speech-to-text',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const {transcript} = response.data;
      setRecognizedText(transcript); // Встановлюємо текст з розпізнавання
    } catch (error) {
      console.error('Помилка при надсиланні аудіо на сервер: ', error);
    }
  };

  useEffect(() => {
    requestMicrophonePermission(); // Запит на доступ до мікрофона
  }, []);

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
          onPress={() => {
            if (isRecording) {
              stopRecording(); // Зупиняємо запис
            } else {
              startRecording(); // Починаємо запис
            }
          }}
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
