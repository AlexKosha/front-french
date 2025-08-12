import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
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
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';

import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../types/navigationTypes';
import {sendAudio} from '../../services/authService';
import {defaultStyles} from '../defaultStyles';
import {Props} from '../../types';
import {useTTS} from '../../helpers';
import {useTranslationHelper} from '../../locale/useTranslation';
import {translations} from '../../locale/translations';
import {useLocalization} from '../../locale/LocalizationContext';

interface Question {
  pronoun: string;
  form: string;
  infinitive: string;
  tense: string;
}

const SeventhLevel: React.FC<Props> = ({selectedVerbs, titleName, level}) => {
  const [wordStats, setWordStats] = useState<any[]>([]);
  const [iteration, setIteration] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [manualCheck, setManualCheck] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);
  const {trainVerbCompleted, incorrect, tryAgain, emptyInput} =
    useTranslationHelper();
  const {locale} = useLocalization();
  const [questions, setQuestions] = useState<Question[]>([]);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
  const isDarkTheme = useSelector(selectTheme);

  const {speak} = useTTS();

  useEffect(() => {
    const allConjugations = selectedVerbs.flatMap(verb =>
      verb.tenses
        .filter((tense: any) => tense.name === titleName)
        .flatMap((tense: any) =>
          tense.conjugations.map((conj: any) => ({
            infinitive: verb.infinitive,
            tense: tense.name,
            pronoun: conj.pronoun,
            form: conj.form,
          })),
        ),
    );

    const shuffled = [...allConjugations].sort(() => 0.5 - Math.random());

    setWordStats(allConjugations); // оригінальний масив (неперемішаний)
    setQuestions(shuffled); // перемішаний масив для тесту
  }, [selectedVerbs, titleName]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const current = wordStats[iteration];
      setImageUrl(current.image);
    }
  }, [iteration, wordStats]);

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
    const recorder = audioRecorderPlayer.current;
    if (!recorder) return;
    requestMicrophonePermission();
    recorder.addRecordBackListener(() => {});

    return () => {
      recorder.removeRecordBackListener();
    };
  }, []);

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

  const stopRecording = async () => {
    if (!isRecording) return;
    const result = await audioRecorderPlayer.current.stopRecorder();
    setIsRecording(false);
    if (result && result !== 'Already stopped') {
      sendAudioForRecognition(result);
    }
  };

  const handleFailedAttempt = () => {
    const newAttempts = wrongAttempts + 1;
    setWrongAttempts(newAttempts);

    const pronoun = wordStats[iteration]?.pronoun.trim().toLowerCase();
    const form = wordStats[iteration]?.form.trim().toLowerCase();
    const correctFullForm = pronoun.endsWith("'")
      ? `${pronoun}${form}`
      : `${pronoun} ${form}`;

    setCorrectAnswer(correctFullForm);

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

  const handleCorrectAnswer = () => {
    setWrongAttempts(0);
    setManualCheck(false);
    setUserInput('');

    const isLast = iteration + 1 >= wordStats.length;
    if (isLast) {
      Alert.alert('', trainVerbCompleted);
      navigation.navigate('VerbsLevelsSelect', {titleName, selectedVerbs});
    } else {
      setIteration(prev => prev + 1);
    }
  };

  const checkAnswer = (inputOverride?: string) => {
    const input = inputOverride ?? userInput;

    if (!input) {
      if (manualCheck) Alert.alert('', emptyInput);
      return;
    }

    const pronoun = wordStats[iteration]?.pronoun.trim().toLowerCase();
    const form = wordStats[iteration]?.form.trim().toLowerCase();
    const correctFullForm = pronoun.endsWith("'")
      ? `${pronoun}${form}`
      : `${pronoun} ${form}`;

    setCorrectAnswer(correctFullForm);

    const user = input.trim().toLowerCase();

    if (user === correctFullForm) {
      handleCorrectAnswer();
    } else {
      handleFailedAttempt();
    }
  };

  const current = wordStats[iteration];

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text style={[styles.header, {color: isDarkTheme ? 'white' : '#67104c'}]}>
        Рівень {level}: {titleName}
      </Text>
      {/* <Text style={{color: isDarkTheme ? 'white' : '#67104c', fontSize: 20}}>
        Правильних відповідей: {totalCorrectAnswers}
      </Text> */}

      {imageUrl && (
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <Image
            source={{uri: imageUrl}}
            style={{width: 200, height: 200, borderRadius: 10}}
          />
        </View>
      )}
      {wrongAttempts >= 2 && (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => speak(correctAnswer)}>
            <Icon name="sound" size={40} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={{
          fontSize: 28,
          textAlign: 'center',
          color: isDarkTheme ? 'white' : '#67104c',
          marginBottom: 10,
        }}>
        {current?.pronoun?.endsWith("'")
          ? `${current.pronoun}${current.form}`
          : `${current?.pronoun} ${current?.form}`}
      </Text>

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
      <Text style={styles.footer}>
        {iteration + 1}/{questions.length}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  voiceButton: {
    marginLeft: 10,
    fontSize: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});

export default SeventhLevel;
