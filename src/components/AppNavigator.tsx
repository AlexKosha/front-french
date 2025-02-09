/* eslint-disable react/no-unstable-nested-components */
import {useDispatch, useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
// import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {getProfileThunk, logoutThunk} from '../store/auth/authThunks';
import * as Screens from '../screens';
// import * as Components from '../components';
// import {setTheme} from '../store/auth/authSlice';
import {AppDispatch} from '../store/store';
import {NavigationProps, RouteProps} from '../helpers/navigationTypes';
import {selectTheme} from '../store/auth/selector';
import {setTheme} from '../store/auth/authSlice';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Registration} from './Registration';
// import {Registration} from '.';

const MainStack = createNativeStackNavigator();

export const AppNavigator = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  // const {t, i18n} = useTranslation();
  const dispatch = useDispatch<AppDispatch>(); // Типізуємо dispatch
  const navigat = useNavigation<NavigationProps<'AppNavigator'>>();

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
    // <SafeAreaView style={{flex: 1}}>
    <MainStack.Navigator>
      <MainStack.Screen
        name="Registration"
        component={Registration}
        options={{headerShown: false}}
      />

      {/* <MainStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      /> */}
    </MainStack.Navigator>
    // </SafeAreaView>
  );
  {
    /* 
      <MainStack.Screen
        name="Home"
        component={Screens.Home}
        options={({navigation}) => ({
          headerTitle: () => null, // Приховуємо текст заголовка
          title: undefined,
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity>
              <MaterialIcons
                name="language"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
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
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={Screens.Profile}
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
              <TouchableOpacity>
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
        component={Components.StudyAndTrain}
        options={({navigation}) => ({
          // title: ` ${t('LAT.lat')}`,
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
        component={Components.Vocab}
        options={({navigation}) => ({
          // title: ` ${t('LAT.vocab')}`,
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
        component={Components.Verbs}
        options={({navigation}) => ({
          // title: ` ${t('LAT.verbs')}`,
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
        component={Components.LearnOrTrainTopic}
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
        component={Components.Learn}
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
        name="Train"
        component={Components.Train}
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
        name="LessonsBySubscription"
        component={Components.LessonsBySubscription}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="ForgotPassword"
        component={Components.ForgotPassword}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Support"
        component={Components.Support}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Phonetic"
        component={Components.Phonetic}
        options={({navigation}) => ({
          // title: ` ${t('LAT.phonetic')}`,
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
        name="WordLearningScreen"
        component={Components.WordLearningScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="TrainingLevel"
        component={Components.TrainingLevel}
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
      /> */
  }
  // </MainStack.Navigator>
  // );
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
