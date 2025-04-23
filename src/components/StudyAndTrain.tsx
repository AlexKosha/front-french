import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {getTopic} from '../store/topic/topicThunk';
import {selectTopic} from '../store/topic/selectors';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../types/navigationTypes';
import {AppDispatch} from '../store/store';
import {useTranslationHelper} from '../locale/useTranslation';
import {Logo} from './Logo';
import {defaultStyles} from './defaultStyles';
import {selectVerbs} from '../store/verb/selectors';
import {getVerbs} from '../store/verb/verbThunk';

export const StudyAndTrain = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const topicsData = useSelector(selectTopic);
  const verbsData = useSelector(selectVerbs);
  const navigation = useNavigation<NavigationProps<'StudyAndTrain'>>();
  const dispatch = useDispatch<AppDispatch>();

  const {vocab, verbs} = useTranslationHelper();

  const handleGetTheme = async () => {
    try {
      if (topicsData && topicsData.length > 0) {
        navigation.navigate('Vocab');
        return;
      }

      const resultAction = await dispatch(getTopic());
      if (getTopic.fulfilled.match(resultAction)) {
        navigation.navigate('Vocab');
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetVerbs = async () => {
    try {
      if (verbsData && verbsData.length > 0) {
        navigation.navigate('Verbs');
        return;
      }

      const resultAction = await dispatch(getVerbs());
      if (getVerbs.fulfilled.match(resultAction)) {
        navigation.navigate('Verbs');
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View
        style={[
          defaultStyles.btnContainer,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => handleGetTheme()}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {vocab}
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => handleGetVerbs()}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {verbs}
          </Text>
        </Pressable>
      </View>
      <Logo />
    </SafeAreaView>
  );
};
