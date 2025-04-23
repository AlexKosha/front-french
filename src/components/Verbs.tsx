import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../types/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';
import {defaultStyles} from './defaultStyles';
import {selectVerbs} from '../store/verb/selectors';

export const Verbs = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'Verbs'>>();

  // const route = useRoute<RouteProps<'LearnVerbs'>>();
  // const {verbName} = route.params;

  const {verbs} = useTranslationHelper();

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View style={defaultStyles.btnContainer}>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('ChooseTense')}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            Вчити дієслова
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('TrainVerbs', {verbName: ''})}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            Тренувати дієслова
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
