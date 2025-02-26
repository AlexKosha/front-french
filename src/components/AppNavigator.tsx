// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import * as Components from '../components';
import {useNavigation} from '@react-navigation/native';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {getProfileThunk, logoutThunk} from '../store/auth/authThunks';
import {AppDispatch} from '../store/store';
import {NavigationProps, RouteProps} from '../helpers/navigationTypes';
import {selectTheme} from '../store/auth/selector';
import {setTheme} from '../store/auth/authSlice';
import {Registration} from './Registration';
import {Verbs} from './Verbs';
import {Vocab} from './Vocab';
import {StudyAndTrain} from './StudyAndTrain';
import {Home, Profile} from '../screens';
import {ForgotPassword} from './ForgotPassword';
import {Support} from './Support';
import {Phonetic} from './Phonetic';
import {LearnOrTrainTopic} from './LearnOrTrainTopic';
import {Learn} from './Learn';
import {WordLearningScreen} from './WordLearningScreen';
import {Train} from './Train';
import {LessonsBySubscription} from './LessonsBySubscription';
import {TrainingLevel} from './TrainingLevel';
import {useLocalization} from '../locale/LocalizationContext';
import {useTranslationHelper} from '../locale/useTranslation';
import {Login} from '.';

const MainStack = createNativeStackNavigator();

export const AppNavigator = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const dispatch = useDispatch<AppDispatch>(); // Типізуємо dispatch
  const navigat = useNavigation<NavigationProps<'AppNavigator'>>();

  const {locale, setLocale} = useLocalization();

  const {studyAndTrain, vocab, phonetic, verbs, lessonsBySubscr} =
    useTranslationHelper();

  const changeLanguageHandler = () => {
    const newLang = locale === 'en' ? 'uk' : 'en';
    setLocale(newLang);
  };

  // const handleLogout = async () => {
  //   try {
  //     const resultAction = await dispatch(logoutThunk());
  //     if (logoutThunk.fulfilled.match(resultAction)) {
  //       navigat.navigate('Login');
  //     } else {
  //       Alert.alert('Error', resultAction.error.message);
  //     }
  //   } catch (error: any) {
  //     console.log('Registration failed:', error);
  //     Alert.alert('Error', error.message);
  //   }
  // };

  useEffect(() => {
    // toggleTheme();
    const handleGetProfile = async (): Promise<void> => {
      try {
        const resultAction = await dispatch(getProfileThunk());
        if (getProfileThunk.fulfilled.match(resultAction)) {
          navigat.navigate('Home');
        }
        return;
      } catch (error: any) {
        console.log(error);
      }
    };

    handleGetProfile();
  }, [dispatch, navigat]);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme; // Інвертуємо булеве значення теми

    try {
      // Зберігаємо нову тему як рядок (булеве значення) в AsyncStorage
      await AsyncStorage.setItem('theme', JSON.stringify(newTheme)); // Replaced SecureStore with AsyncStorage
      // Оновлюємо тему в Redux-стані
      dispatch(setTheme(newTheme));
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutThunk());
      if (logoutThunk.fulfilled.match(resultAction)) {
        navigat.navigate('Login');
      } else {
        Alert.alert('Error', resultAction.error.message);
      }
    } catch (error: any) {
      console.log('Registration failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  // const changeLanguage = (lang: string) => {
  //   i18n.changeLanguage(lang);
  // };

  const handleGoHome = () => {
    Alert.alert(
      'Попередження',
      'Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?',
      [
        {
          text: 'Залишитись',
          onPress: () => console.log('Залишаємося на ст'),
          style: 'cancel',
        },
        {
          text: 'Вийти',
          onPress: () => navigat.navigate('Home'),
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Registration"
        component={Registration}
        options={{headerShown: false}}
      />

      <MainStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <MainStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Support"
        component={Support}
        options={{headerShown: false}}
      />

      <MainStack.Screen
        name="Home"
        component={Home}
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <AntDesign
                name="setting"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginRight: 5}}
              />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={Profile}
        options={({navigation}) => ({
          headerTitle: () => (
            <View style={[styles.headerContainer, {paddingRight: 20}]}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={changeLanguageHandler}>
                <MaterialIcons
                  name="language"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleTheme}>
                <MaterialIcons
                  name="light-mode"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons
                  name="log-out-outline"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
        })}
      />
      <MainStack.Screen
        name="StudyAndTrain"
        component={StudyAndTrain}
        options={({navigation}) => ({
          title: studyAndTrain,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="Vocab"
        component={Vocab}
        options={({navigation}) => ({
          title: vocab,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <AntDesign
                name="home"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <MainStack.Screen
        name="Verbs"
        component={Verbs}
        options={({navigation}) => ({
          title: verbs,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="Phonetic"
        component={Phonetic}
        options={({navigation}) => ({
          title: phonetic,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainStack.Screen
        name="LearnOrTrainTopic"
        component={LearnOrTrainTopic}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'LearnOrTrainTopic'>['params'];
          const topicName = params?.topicName ?? '';
          return {
            title: topicName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <AntDesign
                  name="home"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />

      <MainStack.Screen
        name="Learn"
        component={Learn}
        options={({navigation, route}) => {
          const params = route.params as RouteProps<'Learn'>['params'];
          const topicName = params?.topicName ?? '';
          return {
            title: topicName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LearnOrTrainTopic', {topicName})
                }>
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <AntDesign
                  name="home"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <MainStack.Screen
        name="WordLearningScreen"
        component={WordLearningScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Train"
        component={Train}
        options={({navigation, route}) => {
          const params = route.params as RouteProps<'Train'>['params'];
          const topicName = params?.topicName ?? '';
          return {
            title: topicName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LearnOrTrainTopic', {topicName})
                }>
                <AntDesign
                  name="arrowleft"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <AntDesign
                  name="home"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />

      <MainStack.Screen
        name="TrainingLevel"
        component={TrainingLevel}
        options={({route}) => {
          const params = route.params as RouteProps<'Train'>['params'];
          const topicName = params?.topicName ?? '';
          return {
            title: topicName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerBackVisible: false,
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity onPress={handleGoHome}>
                <AntDesign
                  name="home"
                  size={30}
                  color={isDarkTheme ? 'white' : '#67104c'}
                  style={{marginLeft: 5}}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <MainStack.Screen
        name="LessonsBySubscription"
        component={LessonsBySubscription}
        // options={{headerShown: false}}
        options={({navigation}) => ({
          title: lessonsBySubscr,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </MainStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
});
