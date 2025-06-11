import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
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

export const SeventhLevel: React.FC<Props> = ({selectedVerbs, titleName}) => {
  const [wordStats, setWordStats] = useState<any[]>([]);
  const [iteration, setIteration] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [manualCheck, setManualCheck] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);
  const {trainVerbCompleted, incorrect, tryAgain, emptyInput, microphoneOff} =
    useTranslationHelper();
  const {locale} = useLocalization();

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

    setWordStats(allConjugations);
  }, [selectedVerbs, titleName]);

  useEffect(() => {
    if (wordStats.length > 0 && iteration < wordStats.length) {
      const current = wordStats[iteration];
      setImageUrl(current.image);
    }
  }, [iteration, wordStats]);

  const requestMicrophonePermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(microphoneOff);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, [microphoneOff]);

  useEffect(() => {
    requestMicrophonePermission();
    console.log(1);

    const recorder = audioRecorderPlayer.current;
    recorder.addRecordBackListener(() => {});

    return () => {
      recorder.removeRecordBackListener();
    };
  }, [requestMicrophonePermission]);

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

  const sendAudioForRecognition = async (audioUri: string) => {
    setIsAwaitingResponse(true); // 👉 Блокуємо кнопку

    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'video/mp4',
      name: 'audio.mp4',
    } as any);

    try {
      const data = await sendAudio(formData);
      const {transcript} = data;
      setUserInput(transcript);

      if (!transcript) {
        const newAttempts = wrongAttempts + 1;
        setWrongAttempts(newAttempts);

        if (newAttempts >= 3) {
          setManualCheck(true); // ⬅️ Тепер юзер має сам ввести
        }

        setUserInput('');
        Alert.alert(incorrect, tryAgain);

        return;
      }

      if (wrongAttempts < 2) {
        checkAnswer(transcript);
      }
    } catch (err) {
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);

      if (newAttempts >= 3) {
        setManualCheck(true); // ⬅️ Тепер юзер має сам ввести
      }

      setUserInput('');
      Alert.alert(incorrect, tryAgain);
      console.error('Помилка при надсиланні аудіо:', err);
    } finally {
      setIsAwaitingResponse(false); // 👉 Розблокуємо кнопку
    }
  };

  const checkAnswer = (inputOverride?: string) => {
    const input = inputOverride !== undefined ? inputOverride : userInput;

    if (!input) {
      if (manualCheck) Alert.alert('', emptyInput);
      return;
    }

    const pronoun = wordStats[iteration]?.pronoun.trim().toLowerCase();
    const form = wordStats[iteration]?.form.trim().toLowerCase();

    const correctFullForm = pronoun.endsWith("'")
      ? `${pronoun}${form}`
      : `${pronoun} ${form}`;

    const user = input.trim().toLowerCase();
    setCorrectAnswer(correctFullForm);

    if (user === correctFullForm) {
      setTotalCorrectAnswers(prev => prev + 1);
      setWrongAttempts(0);
      setManualCheck(false);
      setUserInput('');

      if (iteration + 1 >= wordStats.length) {
        Alert.alert('', trainVerbCompleted);
        navigation.navigate('VerbsLevelsSelect', {titleName, selectedVerbs});
        return;
      }

      setIteration(prev => prev + 1);
    } else {
      console.log(wrongAttempts);
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);

      if (newAttempts >= 3) {
        setManualCheck(true); // ⬅️ Тепер юзер має сам ввести
      }

      setUserInput('');
      Alert.alert(incorrect, tryAgain);
    }
  };

  const current = wordStats[iteration];

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text style={{color: isDarkTheme ? 'white' : '#67104c', fontSize: 20}}>
        Правильних відповідей: {totalCorrectAnswers}
      </Text>

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
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
});
