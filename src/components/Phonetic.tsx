import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {Pressable, SafeAreaView, Text, View} from 'react-native';

import {useSelector} from 'react-redux';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';

export const Phonetic = (): JSX.Element => {
  const {t} = useTranslation();
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'Phonetic'>>();

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
          onPress={() => navigation.navigate('StudyAndTrain')}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {t('LAT.phonetic')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
