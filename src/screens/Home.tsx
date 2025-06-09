import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, Text, View, StyleSheet, Pressable} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../types/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';
import {Logo} from '../components/User/Logo';
import {defaultStyles} from '../components/defaultStyles';
import {useSyncProgress} from '../helpers/hookSyncProgress';

export const Home = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Home'>>();
  const isDarkTheme = useSelector(selectTheme);
  const {welcome, vocabOrVerbs} = useTranslationHelper();

  useSyncProgress();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkTheme ? '#67104c' : 'white'}}>
      <View style={defaultStyles.container}>
        <Text
          style={[
            styles.welcomeText,
            {color: isDarkTheme ? 'white' : 'black'},
          ]}>
          {welcome}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={() => navigation.navigate('VocabOrVerbs')}>
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              {vocabOrVerbs}
            </Text>
          </Pressable>

          {/* <Pressable
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={() => navigation.navigate('LessonsBySubscription')}>
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              {lessonsBySubscr}
            </Text>
          </Pressable> */}
        </View>
      </View>

      {/* Logo */}
      <Logo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 34, // Робимо текст більш просторовим
  },
  buttonContainer: {
    flex: 1,
    marginTop: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
