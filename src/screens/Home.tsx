import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {defaultStyles} from '../components/defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {useLocalization} from '../locale/LocalizationContext';
import {translations} from '../locale/translations';
import {useTranslationHelper} from '../locale/useTranslation';

export const Home = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Home'>>();
  const isDarkTheme = useSelector(selectTheme);

  const {locale, setLocale} = useLocalization();

  const {welcome, studyAndTrain, lessonsBySubscr} = useTranslationHelper();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View style={defaultStyles.container}>
        <Text
          style={[
            styles.welcomeText,
            {color: isDarkTheme ? 'white' : 'black'},
          ]}>
          {welcome}
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={() => navigation.navigate('StudyAndTrain')}>
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              {studyAndTrain}
            </Text>
          </Pressable>

          <Pressable
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
          </Pressable>
        </View>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={
            isDarkTheme
              ? require('../images/whiteLogo.jpg')
              : require('../images/logo.jpg')
          }
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // Центруємо по вертикалі
    alignItems: 'center', // Центруємо по горизонталі
    marginTop: 20,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -70}],
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 60,
    resizeMode: 'contain',
  },
});
