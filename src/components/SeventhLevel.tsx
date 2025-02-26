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
import Voice from '@react-native-voice/voice';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LevelProps} from './FirstLevel';

export const SeventhLevel: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
}) => {
  const [isRecording, setIsRecording] = useState(false); // Чи активний запис
  const [recognizedText, setRecognizedText] = useState(''); // Текст після розпізнавання

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

  useEffect(() => {
    // Додаємо слухачів для подій Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = stopRecording;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Перевірка дозволів
    requestMicrophonePermission();

    return () => {
      Voice.removeAllListeners(); // Видалення слухачів при демонтажі компонента
    };
  }, []);

  const onSpeechStart = (event: any) => {
    console.log('Запис почався', event);
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const text = event.value[0];
      setRecognizedText(text); // Встановлюємо перший результат
    }
  };

  const onSpeechError = (event: any) => {
    console.error('Помилка розпізнавання мови', event);
  };

  const startRecording = async () => {
    setIsRecording(true);

    try {
      await Voice.start('en-US'); // Стартуємо розпізнавання
    } catch (error) {
      console.error('Помилка під час запуску запису:', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await Voice.stop();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Помилка при зупинці запису', error);
    }
  };

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
          onPress={() => (isRecording ? stopRecording() : startRecording())}
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
