import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../types';
import {Alert} from 'react-native';

type Question = {
  pronoun: string;
  form: string;
  infinitive: string;
  tense: string;
};

export const hookVerbQuiz = (
  selectedVerbs: any[],
  titleName: string,
  level: number,
) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();

  useEffect(() => {
    const all = selectedVerbs.flatMap(verb =>
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

  const next = useCallback(() => {
    setSelected(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Alert.alert('Супер!', 'Ви виконали рівень 🎉');
      navigation.navigate('VerbsLevelsSelect', {
        titleName,
        selectedVerbs,
      });
    }
  }, [currentIndex, questions.length, navigation, titleName, selectedVerbs]);

  return {
    questions,
    current: questions[currentIndex],
    currentIndex,
    selected,
    setSelected,
    next,
  };
};
