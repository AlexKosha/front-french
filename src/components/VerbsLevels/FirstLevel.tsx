import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Props} from '../../types';

const getDisplaySentence = (pronoun: string, form: string, ending: string) => {
  const parts = form.trim().split(' ');

  // Минулий час (Passé composé та подібні) — два слова
  if (parts.length === 2) {
    return `${pronoun} ___ ${parts[1]}`; // приклад: "tu ___ mangé"
  }

  // Теперішній час — одне слово
  const word = parts[0];
  const base = word.slice(0, word.length - ending.length);
  return `${pronoun} ${base}___`; // приклад: "tu mang___"
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
  }, [selectedVerbs]);

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
          Alert.alert('Успіх!', 'Ви завершили рівень 🎉');
        }
      }, 800);
    } else {
      setTimeout(() => {
        Alert.alert('Помилка', 'Неправильна відповідь. Спробуйте ще раз.');
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
              backgroundColor: opt === current.ending ? '#4CAF50' : '#f44336',
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
