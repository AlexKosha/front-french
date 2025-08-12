import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationProps, Props} from '../../types';
import {defaultStyles} from '../defaultStyles';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTTS} from '../../helpers';
import {useNavigation} from '@react-navigation/native';
import {useTranslationHelper} from '../../locale/useTranslation';
import {useLocalization} from '../../locale/LocalizationContext';
import {translations} from '../../locale/translations';

interface Question {
  pronoun: string;
  form: string;
  infinitive: string;
  tense: string;
}

const SixthLevel: React.FC<Props> = ({selectedVerbs, titleName, level}) => {
  const isDarkTheme = useSelector(selectTheme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userInput, setUserInput] = useState('');
  const {speak} = useTTS();
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
  const [iteration, setIteration] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const {locale} = useLocalization();
  const {emptyInput, trainVerbCompleted, incorrect, tryAgain, verify} =
    useTranslationHelper();

  const currentQuestion = questions[iteration];

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

    const shuffled = allConjugations.sort(() => 0.5 - Math.random());

    setQuestions(shuffled);
    setIteration(0);
    setTotalCorrectAnswers(0);
  }, [selectedVerbs, titleName]);

  const handleUserInputChange = (value: string) => {
    setUserInput(value);
  };

  //   const normalizeApostrophes = (str: string): string => {
  //     return str.replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  //   };
  function normalizeAnswer(str: string): string {
    return (
      str
        .toLowerCase()
        // замінюємо усі апострофи на стандартний '
        .replace(/[’‘`]/g, "'")
        // видаляємо пробіл після апострофа (j' ai -> j'ai)
        .replace(/'\s+/g, "'")
        // замінюємо множинні пробіли на один
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  const checkAnswer = () => {
    // console.log('Перевірка відповіді почалась');
    if (!userInput) {
      Alert.alert('', emptyInput);
      return;
    }

    const normalizedUserInput = normalizeAnswer(userInput);
    const correctRaw = currentQuestion.pronoun.endsWith("'")
      ? `${currentQuestion.pronoun}${currentQuestion.form}`
      : `${currentQuestion.pronoun} ${currentQuestion.form}`;
    const normalizedCorrectWord = normalizeAnswer(correctRaw);

    // console.log('Правильне слово:', normalizedCorrectWord);
    // console.log('Введене слово користувачем:', normalizedUserInput);

    if (normalizedUserInput === normalizedCorrectWord) {
      const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
      setTotalCorrectAnswers(updatedTotalCorrectAnswers);
      setCurrentIndex(i => i + 1);

      if (updatedTotalCorrectAnswers === 15) {
        Alert.alert('', trainVerbCompleted);
        navigation.navigate('VerbsLevelsSelect', {titleName, selectedVerbs});
        return;
      }

      handleNextIteration();
    } else {
      Alert.alert(incorrect, tryAgain);
    }
  };

  const handleNextIteration = () => {
    setIteration(prev => prev + 1);
    setUserInput('');
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text style={[styles.header, {color: isDarkTheme ? 'white' : '#67104c'}]}>
        Рівень {level}: {titleName}
      </Text>

      {currentQuestion && (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              speak(`${currentQuestion.pronoun} ${currentQuestion.form}`)
            }>
            <Icon name="sound" size={40} color="red" />
          </TouchableOpacity>
        </View>
      )}

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
        onChangeText={handleUserInputChange}
        autoCapitalize="none"
        keyboardType="default"
      />

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
          {verify}
        </Text>
      </Pressable>
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

export default SixthLevel;
