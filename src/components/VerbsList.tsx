import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../types/navigationTypes';
import {AppDispatch} from '../store/store';
import {useLocalization} from '../locale/LocalizationContext';
import {defaultStyles} from './defaultStyles';
import {selectVerbs} from '../store/verb/selectors';

export const VerbsList = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const route = useRoute<RouteProps<'VerbsList'>>();
  const navigation = useNavigation<NavigationProps<'VerbsList'>>();
  const dispatch = useDispatch<AppDispatch>();
  const {locale} = useLocalization();
  const verbsData = useSelector(selectVerbs);

  const {titleName} = route.params;

  const getConjugationsByTense = () => {
    return verbsData
      .map((verb: any) => {
        const matchedTense = verb.tenses.find(
          (tense: any) => tense.name === titleName,
        );
        return {
          infinitive: verb.infinitive,
          translationUA: verb.translationUA,
          translationEN: verb.translationEN,
          conjugations: matchedTense?.conjugations || [],
        };
      })
      .filter(verb => verb.conjugations.length > 0);
  };

  const handleGetVerbsInfinitive = () => {
    const filteredVerbs = getConjugationsByTense();
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
        onPress={handleGetVerbsInfinitive}>
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

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View>
        <FlatList
          style={{width: '100%'}}
          data={verbsData}
          keyExtractor={(item: any) => item._id}
          renderItem={renderVerbsInfinitive}
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
    </SafeAreaView>
  );
};
