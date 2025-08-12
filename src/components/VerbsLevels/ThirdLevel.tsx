import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Props} from '../../types';
import {hookVerbQuiz} from '../../helpers/hookVerbQuiz';
import {defaultStyles} from '../defaultStyles';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';

const ThirdLevel: React.FC<Props> = ({selectedVerbs, level, titleName}) => {
  const {questions, current, currentIndex, selected, setSelected, next} =
    hookVerbQuiz(selectedVerbs, titleName, level);

  const [options, setOptions] = useState<string[]>([]);
  const [pronouns, setPronouns] = useState<string[]>([]);
  const isDarkTheme = useSelector(selectTheme);

  // Отримуємо унікальні займенники з selectedVerbs
  useEffect(() => {
    const all = selectedVerbs.flatMap(verb =>
      verb.tenses.flatMap(tense => tense.conjugations.map(c => c.pronoun)),
    );
    const unique = Array.from(new Set(all));
    setPronouns(unique);
  }, [selectedVerbs]);

  // Генеруємо варіанти відповіді для поточного питання
  useEffect(() => {
    if (!current || pronouns.length === 0) return;
    const unique = pronouns.filter(p => p !== current.pronoun);
    const shuffled = [
      ...unique.sort(() => 0.5 - Math.random()).slice(0, 3),
      current.pronoun,
    ].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  }, [current, pronouns]);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    const isCorrect = opt === current.pronoun;

    setTimeout(() => {
      if (isCorrect) next();
      else setSelected(null);
    }, 800);
  };

  if (!current) return <Text>Завантаження...</Text>;

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
        style={[
          styles.question,
          {color: isDarkTheme ? 'white' : '#67104c'},
        ]}>{`___  ${current.form}`}</Text>

      {options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            defaultStyles.button,
            {
              backgroundColor: (() => {
                if (selected === opt) {
                  return opt === current.pronoun ? '#4CAF50' : '#f44336';
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

export default ThirdLevel;

// import React from 'react';
// import {Text, View} from 'react-native';
// import {NavigationProps, Props} from '../../types';
// import {useNavigation} from '@react-navigation/native';

// export const ThirdLevel: React.FC<Props> = ({
//   level,
//   selectedVerbs,
//   titleName,
// }) => {
//   const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
//   return <Text>33333</Text>;
// };
