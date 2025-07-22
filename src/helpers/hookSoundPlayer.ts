import {useEffect, useCallback} from 'react';
import Tts from 'react-native-tts';

export const useTTS = ({language = 'fr-FR', pitch = 1.5, rate = 0.5} = {}) => {
  const voices = [
    'com.apple.ttsbundle.Thomas-compact',
    'com.apple.voice.compact.fr-CA.Amelie',
  ];

  // com.apple.voice.compact.fr-FR.Thomas

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultPitch(pitch);
        Tts.setDefaultLanguage(language).catch(err =>
          console.log('Language not supported', err),
        );
      })
      .catch(err => console.error('TTS Init Error:', err));

    const handleStart = () => {};
    const handleFinish = () => {};
    const handleProgress = () => {};

    Tts.addEventListener('tts-start', handleStart);
    Tts.addEventListener('tts-finish', handleFinish);
    Tts.addEventListener('tts-progress', handleProgress);

    return () => {
      try {
        Tts.removeEventListener('tts-start', handleStart);
        Tts.removeEventListener('tts-finish', handleFinish);
        Tts.removeEventListener('tts-progress', handleProgress);
      } catch (e) {
        console.warn('TTS removeEventListener failed:', e);
      }
    };
  }, [language, pitch]);

  const speak = useCallback(
    (text: string) => {
      // Видаляємо пробіли після апострофа
      const fixedText = text.replace(/'\s+/g, "'");
      if (text) {
        const randomVoiceId = voices[Math.floor(Math.random() * voices.length)];

        Tts.speak(fixedText, {
          iosVoiceId: randomVoiceId,
          rate,
          androidParams: {
            KEY_PARAM_PAN: 0,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: 'STREAM_ALARM',
          },
        });
      }
    },
    [rate],
  );

  return {speak};
};
