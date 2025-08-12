import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Props} from '../../types';
import {hookVerbQuiz} from '../../helpers/hookVerbQuiz';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {defaultStyles} from '../defaultStyles';

const getDisplaySentence = (pronoun: string, form: string): string => {
  const parts = form.trim().split(' ');

  if (parts.length === 2) {
    // passé composé
    return `${pronoun} ___ ${parts[1]}`;
  } else {
    // інші часи
    return `${pronoun} ___`;
  }
};

const getCorrectWord = (form: string): string => {
  return form.trim().split(' ')[0];
};

const SecondLevel: React.FC<Props> = ({selectedVerbs, level, titleName}) => {
  const {questions, current, currentIndex, selected, setSelected, next} =
    hookVerbQuiz(selectedVerbs, titleName, level);

  const [options, setOptions] = useState<string[]>([]);
  const isDarkTheme = useSelector(selectTheme);

  // Генеруємо варіанти відповідей
  useEffect(() => {
    if (!current) return;

    const correctWord = getCorrectWord(current.form);
    const wordsPool = questions.map(q => getCorrectWord(q.form));
    const uniqueWrong = [
      ...new Set(wordsPool.filter(w => w !== correctWord)),
    ].slice(0, 3);
    const shuffled = [...uniqueWrong, correctWord].sort(
      () => 0.5 - Math.random(),
    );

    setOptions(shuffled);
  }, [current, questions]);

  const handleSelect = (option: string) => {
    setSelected(option);

    const correctWord = getCorrectWord(current.form);
    const isCorrect = option === correctWord;

    setTimeout(() => {
      if (isCorrect) next();
      else setSelected(null);
    }, 800);
  };

  if (!current) return <Text>Завантаження...</Text>;

  const displaySentence = getDisplaySentence(current.pronoun, current.form);

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

      {options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            defaultStyles.button,
            {
              backgroundColor: (() => {
                if (selected === opt) {
                  return opt === getCorrectWord(current.form)
                    ? '#4CAF50'
                    : '#f44336';
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
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
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

export default SecondLevel;
