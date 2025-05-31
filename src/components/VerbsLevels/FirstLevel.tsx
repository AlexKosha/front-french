import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationProps, Props} from '../../types';
import {useNavigation} from '@react-navigation/native';
import {defaultStyles} from '../defaultStyles';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';

const getDisplaySentence = (pronoun: string, form: string, ending: string) => {
  const parts = form.trim().split(' ');

  if (parts.length === 2) {
    return `${pronoun} ___ ${parts[1]}`;
  }

  // Теперішній час — одне слово
  const word = parts[0];
  const base = word.slice(0, word.length - ending.length);
  return `${pronoun} ${base}___`;
};

export const FirstLevel: React.FC<Props> = ({
  selectedVerbs,
  level,
  titleName,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
  const isDarkTheme = useSelector(selectTheme);

  const generateOptions = useCallback(() => {
    const correct = questions[currentIndex].ending;
    const endingsPool = questions.map(q => q.ending);
    const uniqueWrong = [
      ...new Set(endingsPool.filter(e => e !== correct)),
    ].slice(0, 3);
    const options = [...uniqueWrong, correct].sort(() => 0.5 - Math.random());
    setShuffledOptions(options);
  }, [questions, currentIndex]);

  useEffect(() => {
    const all = selectedVerbs.flatMap((verb: any) =>
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
      generateOptions();
    }
  }, [questions, currentIndex, generateOptions]);

  const handleSelect = (option: string) => {
    setSelected(option);

    const correct = questions[currentIndex].ending;
    const isCorrect = option === correct;

    if (isCorrect) {
      setTimeout(() => {
        setSelected(null);
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev: number) => prev + 1);
        } else {
          navigation.navigate('VerbsLevelsSelect', {
            titleName,
            selectedVerbs,
          });
        }
      }, 800);
    } else {
      setTimeout(() => {
        setSelected(null);
        // Не змінюємо currentIndex — залишаємо це саме слово
      }, 800);
    }
  };

  if (!questions.length) return <Text>Завантаження...</Text>;

  const current = questions[currentIndex];
  const displaySentence = getDisplaySentence(
    current.pronoun,
    current.form,
    current.ending,
  );
  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text style={[styles.header, {color: isDarkTheme ? 'white' : '#67104c'}]}>
        Рівень {level}: {titleName}
      </Text>

      <Text
        style={[styles.question, {color: isDarkTheme ? 'white' : '#67104c'}]}>
        {displaySentence}
      </Text>

      {shuffledOptions.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            defaultStyles.button,
            {
              backgroundColor: (() => {
                if (selected === opt) {
                  return opt === current.ending ? '#4CAF50' : '#f44336';
                } else {
                  return isDarkTheme ? 'white' : '#67104c';
                }
              })(),
            },
          ]}
          onPress={() => handleSelect(opt)}
          disabled={selected !== null}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
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
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {fontSize: 24, marginBottom: 20, textAlign: 'center'},
  option: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  optionText: {fontSize: 18},
  footer: {textAlign: 'center', marginTop: 30, fontSize: 16, color: '#666'},
});
