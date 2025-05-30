import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
  Alert,
  UIManager,
  findNodeHandle,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {selectTheme} from '../../store/auth/selector';
import {defaultStyles} from '../defaultStyles';
import {RenderProgress} from '../Vocabulary/RenderProgress';
import {NavigationProps} from '../../types/navigationTypes';

interface Props {
  selectedVerbs: any[];
  titleName: string;
  level: number;
}

export const FourthLevel: React.FC<Props> = ({
  level,
  selectedVerbs,
  titleName,
}) => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'TrainVocabulary'>>();

  const [pronouns, setPronouns] = useState<{id: string; text: string}[]>([]);
  const [forms, setForms] = useState<{id: string; text: string}[]>([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [iteration, setIteration] = useState(0);

  const panRefs = useRef<{[key: string]: Animated.ValueXY}>({});
  const wordRefs = useRef<Record<string, React.RefObject<any>>>({});
  const wordPositions = useRef<{[key: string]: any}>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Отримуємо всі conjugations по часу
  const allConjugations = useMemo(() => {
    return selectedVerbs.flatMap((verb: any) =>
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
  }, [selectedVerbs, titleName]);

  useEffect(() => {
    const shuffled = [...allConjugations].sort(() => Math.random() - 0.5);
    const selection = shuffled.slice(0, 4);

    const newPronouns = selection.map((item, i) => ({
      id: `p-${i}`,
      text: item.pronoun,
    }));

    const newForms = selection
      .map((item, i) => ({
        id: `f-${i}`,
        text: item.form,
        correctPronoun: item.pronoun,
      }))
      .sort(() => Math.random() - 0.5); // Перемішані для драгг

    setPronouns(newPronouns);
    setForms(newForms);

    newForms.forEach(f => {
      panRefs.current[f.id] = new Animated.ValueXY();
      wordRefs.current[f.id] = React.createRef();
    });
  }, [iteration]);

  useEffect(() => {
    forms.forEach(form => {
      const ref = wordRefs.current[form.id]?.current;
      if (ref) {
        const handle = findNodeHandle(ref);
        if (handle) {
          setTimeout(() => {
            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
              wordPositions.current[form.id] = {
                left: pageX,
                top: pageY,
                right: pageX + width,
                bottom: pageY + height,
              };
            });
          }, 100);
        }
      }
    });
  }, [forms]);

  const detectDropArea = (x: number, y: number) => {
    for (const f of forms) {
      const bounds = wordPositions.current[f.id];
      if (
        bounds &&
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom
      ) {
        return f.id;
      }
    }
    return null;
  };

  const swapForms = (id1: string, id2: string) => {
    const pos1 = wordPositions.current[id1];
    const pos2 = wordPositions.current[id2];

    if (!pos1 || !pos2) return;

    Animated.parallel([
      Animated.timing(panRefs.current[id1], {
        toValue: {
          x: pos2.left - pos1.left,
          y: pos2.top - pos1.top,
        },
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(panRefs.current[id2], {
        toValue: {
          x: pos1.left - pos2.left,
          y: pos1.top - pos2.top,
        },
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      panRefs.current[id1].setValue({x: 0, y: 0});
      panRefs.current[id2].setValue({x: 0, y: 0});

      setForms(prev => {
        const newForms = [...prev];
        const i1 = newForms.findIndex(f => f.id === id1);
        const i2 = newForms.findIndex(f => f.id === id2);
        [newForms[i1], newForms[i2]] = [newForms[i2], newForms[i1]];
        return newForms;
      });
    });
  };

  const createPanResponder = (id: string, pan: Animated.ValueXY) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDraggingId(id),
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        const droppedOnId = detectDropArea(gesture.moveX, gesture.moveY);
        if (droppedOnId && droppedOnId !== id) {
          swapForms(id, droppedOnId);
        }
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start(() => setDraggingId(null));
      },
    });
  };

  const checkAnswer = () => {
    const correct = forms.every(
      (form, index) => form.correctPronoun === pronouns[index].text,
    );

    if (correct) {
      const updated = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updated);

      if (updated >= 15) {
        Alert.alert('Супер!', 'Ви виконали рівень 🎉');
        navigation.navigate('TrainVocabulary', {titleName});
      } else {
        Alert.alert('Правильно!', 'Наступне завдання');
        setIteration(prev => prev + 1);
      }
    } else {
      Alert.alert('Помилка', 'Спробуйте ще раз!');
    }
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <RenderProgress totalCorrectAnswers={totalCorrectAnswers} />
      <Text style={styles.header}>
        Рівень {level}: {titleName}
      </Text>
      <View style={styles.columns}>
        {/* Ліва колонка: Pronouns */}
        <View style={styles.column}>
          {pronouns.map(p => (
            <View key={p.id} style={styles.pronounBox}>
              <Text style={styles.text}>{p.text}</Text>
            </View>
          ))}
        </View>

        {/* Права колонка: draggable Forms */}
        <View style={styles.column}>
          {forms.map(form => {
            const pan = panRefs.current[form.id];
            return (
              <Animated.View
                key={form.id}
                ref={wordRefs.current[form.id]}
                style={[
                  styles.formBox,
                  {transform: pan.getTranslateTransform()},
                  {zIndex: draggingId === form.id ? 10 : 1},
                ]}
                {...createPanResponder(form.id, pan).panHandlers}>
                <Text style={styles.text}>{form.text}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[
          defaultStyles.button,
          {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
        ]}
        onPress={checkAnswer}>
        <Text
          style={[
            defaultStyles.btnText,
            {color: isDarkTheme ? '#67104c' : 'white'},
          ]}>
          Перевірити
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  columns: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pronounBox: {
    backgroundColor: '#d0e8ff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});
