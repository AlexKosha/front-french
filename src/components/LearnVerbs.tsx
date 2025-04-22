import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {NavigationProps, RouteProps} from '../types';
import {useSelector} from 'react-redux';
import {selectTheme} from '../store/auth/selector';
import {defaultStyles} from './defaultStyles';

export const LearnVerbs = (): JSX.Element => {
  const route = useRoute<RouteProps<'LearnVerbs'>>();
  const navigation = useNavigation<NavigationProps<'LearnVerbs'>>();
  const {verbName} = route.params;
  const isDarkTheme = useSelector(selectTheme);
  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <Text>LEARN VERBS</Text>
    </SafeAreaView>
  );
};
