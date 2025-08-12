import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import {defaultStyles} from '../defaultStyles';
import {useTTS} from '../../helpers';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps, Props} from '../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslationHelper} from '../../locale/useTranslation';

interface Question {
  pronoun: string;
  form: string;
  infinitive: string;
  tense: string;
}

export const FifthLevel: React.FC<Props> = ({
  selectedVerbs,
  titleName,
  level,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const {trainVerbCompleted} = useTranslationHelper();
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
  const isFirstRender = useRef(true);

  const {speak} = useTTS();

  useEffect(() => {
    const all: Question[] = selectedVerbs.flatMap(verb =>
      verb.tenses
        .filter((tense: any) => tense.name === titleName)
        .flatMap((tense: any) =>
          tense.conjugations.map((conj: any) => ({
            ...conj,
            infinitive: verb.infinitive,
            tense: tense.name,
          })),
        ),
    );

    const shuffled = all.sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  }, [selectedVerbs, titleName]);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentIndex];
      const correct = `${current.pronoun} ${current.form}`;

      const combinedForms = questions.map(q => `${q.pronoun} ${q.form}`);
      const uniqueWrong = [
        ...new Set(combinedForms.filter(f => f !== correct)),
      ].slice(0, 3);

      const options = [...uniqueWrong, correct].sort(() => 0.5 - Math.random());
      setShuffledOptions(options);

      if (isFirstRender.current) {
        isFirstRender.current = false; // наступні рендери вже не перші
      } else {
        speak(correct);
      }
    }
  }, [questions, currentIndex, speak]);

  const handleSelect = useCallback(
    (option: string) => {
      const correct = `${questions[currentIndex].pronoun} ${questions[currentIndex].form}`;
      const isCorrect = option === correct;
      setSelected(option);

      setTimeout(() => {
        setSelected(null);

        if (isCorrect && currentIndex < questions.length - 1) {
          setCurrentIndex(i => i + 1);
        } else if (isCorrect) {
          Alert.alert('', trainVerbCompleted, [
            {
              text: 'ОК',
              onPress: () =>
                navigation.navigate('VerbsLevelsSelect', {
                  titleName,
                  selectedVerbs,
                }),
            },
          ]);
        }
      }, 1000);
    },
    [
      questions,
      currentIndex,
      trainVerbCompleted,
      navigation,
      titleName,
      selectedVerbs,
    ],
  );

  if (!questions.length) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Завантаження...
        </Text>
      </SafeAreaView>
    );
  }

  const current = questions[currentIndex];
  const correctAnswer = `${current.pronoun} ${current.form}`;

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text style={[styles.header, {color: isDarkTheme ? 'white' : '#67104c'}]}>
        Рівень {level}: {titleName}
      </Text>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={() => speak(correctAnswer)}>
          <Icon name="sound" size={40} color="red" />
        </TouchableOpacity>
      </View>

      {shuffledOptions.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            defaultStyles.button,
            {
              backgroundColor:
                selected === opt
                  ? opt === correctAnswer
                    ? '#4CAF50'
                    : '#f44336'
                  : isDarkTheme
                  ? 'white'
                  : '#67104c',
            },
          ]}
          onPress={() => handleSelect(opt)}
          disabled={selected !== null}>
          <Text
            style={[
              defaultStyles.btnText,
              {color: isDarkTheme ? '#67104c' : 'white'},
            ]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.footer}>
        {currentIndex + 1}/{questions.length}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});

export default FifthLevel;
