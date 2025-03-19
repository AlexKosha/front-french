import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'; // Для запису аудіо
import {sendAudio} from '../services/authService';

export const SeventhLevel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  // Використовуємо useRef для збереження інстансу AudioRecorderPlayer
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

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

  // Почати запис аудіо
  const startRecording = async () => {
    try {
      // Перевіряємо, чи інстанс аудіо рекордера існує
      if (audioRecorderPlayer) {
        setIsRecording(true);
        const result: any = await audioRecorderPlayer.startRecorder();

        console.log('Запис почався:', result);
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
          const result = await audioRecorderPlayer.stopRecorder();
          setIsRecording(false);
          console.log('Запис завершено:', result); // Якщо все вірно, result повинен бути шляхом до файлу

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

  const handleServerResponse = (data: any) => {
    const {transcript} = data;
    setRecognizedText(transcript); // Встановлюємо розпізнаний текст
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
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={recognizedText}
          onChangeText={setRecognizedText}
        />
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
