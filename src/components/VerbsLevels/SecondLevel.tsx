import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProps, Props} from '../../types';
import {useNavigation} from '@react-navigation/native';

// Показати речення з пропущеним дієсловом
const getDisplaySentence = (pronoun: string, form: string) => {
  // const parts = form.trim().split(' ');

  console.log(form);

  // Минулий час — два слова: "tu as mangé" → "tu as ___"
  // if (parts.length === 2) {
  //   return `${pronoun} ${parts[0]} ___`;
  // }

  // Теперішній час — одне слово: "tu manges" → "tu ___"
  return `${pronoun} ___`;
};

// Отримати правильну відповідь (саме дієслово, не допоміжне!)
const getCorrectWord = (form: string): string => {
  const parts = form.trim().split(' ');
  return parts.length === 2 ? parts[1] : parts[0]; // минулий: "mangé", теперішній: "manges"
};

export const SecondLevel: React.FC<Props> = ({
  selectedVerbs,
  level,
  titleName,
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();

  const generateOptions = useCallback(() => {
    const correctWord = getCorrectWord(questions[currentIndex].form);
    const wordsPool = questions.map(q => getCorrectWord(q.form));
    const uniqueWrong = [
      ...new Set(wordsPool.filter(w => w !== correctWord)),
    ].slice(0, 3);
    const options = [...uniqueWrong, correctWord].sort(
      () => 0.5 - Math.random(),
    );
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

    const correctWord = getCorrectWord(questions[currentIndex].form);
    const isCorrect = option === correctWord;

    if (isCorrect) {
      setTimeout(() => {
        setSelected(null);
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
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
        // Залишаємо те саме питання
      }, 800);
    }
  };

  if (!questions.length) return <Text>Завантаження...</Text>;

  const current = questions[currentIndex];
  const displaySentence = getDisplaySentence(current.pronoun, current.form);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Рівень {level}: {titleName}
      </Text>

      <Text style={styles.question}>{displaySentence}</Text>

      {shuffledOptions.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.option,
            selected === opt && {
              backgroundColor:
                opt === getCorrectWord(current.form) ? '#4CAF50' : '#f44336',
            },
          ]}
          onPress={() => handleSelect(opt)}
          disabled={selected !== null}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.footer}>
        {currentIndex + 1}/{questions.length}
      </Text>
    </View>
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
  question: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});
