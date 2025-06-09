import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {selectTheme} from '../../store/auth/selector';
import {NavigationProps, RouteProps} from '../../types/navigationTypes';
import {AppDispatch} from '../../store/store';
import {useLocalization} from '../../locale/LocalizationContext';
import {defaultStyles} from '../defaultStyles';
import {selectVerbs} from '../../store/verb/selectors';
import {useTranslationHelper} from '../../locale/useTranslation';

export const VerbsList = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const route = useRoute<RouteProps<'VerbsList'>>();
  const navigation = useNavigation<NavigationProps<'VerbsList'>>();
  const dispatch = useDispatch<AppDispatch>();
  const {locale} = useLocalization();
  const verbsData = useSelector(selectVerbs);

  const {titleName} = route.params;
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedVerbs, setSelectedVerbs] = useState<any[]>([]);

  const {wantTrainVerbs, cancel, train} = useTranslationHelper();

  const getConjugationsByTense = (choosedVerb: string) => {
    // Знаходимо дієслово за ім'ям
    const verb = verbsData.find((v: any) => v.infinitive === choosedVerb);

    if (!verb) {
      return [];
    }

    // Знаходимо потрібний час у цьому дієслові
    const matchedTense = verb.tenses.find(
      (tense: any) => tense.name === titleName,
    );

    if (!matchedTense) {
      return [];
    }

    return {
      infinitive: verb.infinitive,
      translationUA: verb.translationUA,
      translationEN: verb.translationEN,
      conjugations: matchedTense.conjugations,
    };
  };

  const handleGetVerbsInfinitive = (choosedVerb: string) => {
    const filteredVerbs = getConjugationsByTense(choosedVerb);
    navigation.navigate('VerbLearningScreen', {
      titleName,
      verbs: filteredVerbs,
    });
  };

  const renderVerbsInfinitive = ({item}: any) => {
    return (
      <Pressable
        style={[
          defaultStyles.button,
          {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
        ]}
        onPress={() => handleGetVerbsInfinitive(item.infinitive)}>
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: isDarkTheme ? '#67104c' : 'white',
            },
          ]}>
          {item.infinitive} /{' '}
          {locale === 'uk' ? item.translationUA : item.translationEN}
        </Text>
      </Pressable>
    );
  };

  const toggleSelect = (verb: any) => {
    const isSelected = selectedVerbs.find(
      (v: any) => v.infinitive === verb.infinitive,
    );
    if (isSelected) {
      setSelectedVerbs(
        selectedVerbs.filter((v: any) => v.infinitive !== verb.infinitive),
      );
    } else {
      if (selectedVerbs.length >= 5) {
        Alert.alert('Максимум 5 слів');
        return;
      }
      setSelectedVerbs([...selectedVerbs, verb]);
    }
  };

  const startTraining = () => {
    // if (selectedVerbs.length < 3) {
    //   Alert.alert('Вибери щонайменше 3 слова');
    //   return;
    // }
    // if (!selectedVerbs || selectedVerbs.length <= 2) {
    //   Alert.alert('Вибери щонайменше 3 слова');
    //   return;
    // }

    navigation.navigate('VerbsLevelsSelect', {titleName, selectedVerbs});
  };

  const goToVerbLearning = (verb: any, choosedVerb: string) => {
    if (selectionMode) {
      toggleSelect(verb);
    } else {
      handleGetVerbsInfinitive(choosedVerb);
    }
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View>
        <TouchableOpacity
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => {
            setSelectionMode(!selectionMode);
            setSelectedVerbs([]);
          }}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: 'red',
                // color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {selectionMode ? cancel : wantTrainVerbs}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={verbsData}
        keyExtractor={item => item.infinitive}
        renderItem={({item}) => {
          const isSelected = selectedVerbs.find(
            (v: any) => v.infinitive === item.infinitive,
          );
          return (
            <TouchableOpacity
              onPress={() => goToVerbLearning(item, item.infinitive)}
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isSelected
                    ? '#ffa'
                    : isDarkTheme
                    ? 'white'
                    : '#67104c',
                },
              ]}>
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? '#67104c' : 'white',
                  },
                ]}>
                {item.infinitive} /{' '}
                {locale === 'uk' ? item.translationUA : item.translationEN}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {selectionMode && selectedVerbs.length >= 2 && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            zIndex: 99,
            elevation: 10, // для Android тінь/поверх
          }}>
          <TouchableOpacity
            onPress={startTraining}
            style={{
              // backgroundColor: isDarkTheme ? 'white' : '#67104c',
              backgroundColor: '#ffa',
              padding: 16,
              alignItems: 'center',
              borderRadius: 100,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
            <Text
              style={{
                color: isDarkTheme ? '#67104c' : 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {train} ({selectedVerbs.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
