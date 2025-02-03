import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {defaultStyles} from '../components/defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';

export const Home = (): JSX.Element => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<NavigationProps<'Home'>>();
  const isDarkTheme = useSelector(selectTheme);
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkTheme ? '#67104c' : 'white',
      }}>
      <View style={defaultStyles.container}>
        <Text
          style={[
            styles.welcomeText,
            {color: isDarkTheme ? 'white' : 'black'},
          ]}>
          {t('hm.welcome')}
        </Text>

        <View
          style={{
            flex: 1,
            justifyContent: 'center', // Центруємо по вертикалі
            alignItems: 'center', // Центруємо по горизонталі
            marginTop: 20,
          }}>
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
              {t('rg.studyAndTrain')}
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
              {t('rg.lessonsBySubscr')}
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: [{translateX: -70}],
          alignItems: 'center',
        }}>
        <Image
          source={
            isDarkTheme
              ? require('../images/whiteLogo.jpg')
              : require('../images/logo.jpg')
          } //
          style={{
            width: 140,
            height: 60,
            resizeMode: 'contain',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 25,
    textAlign: 'center', // Центруємо текст
  },
});
