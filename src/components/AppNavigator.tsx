import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {getProfileThunk} from '../store/auth/authThunks';
import {AppDispatch} from '../store/store';
import {NavigationProps, RouteProps} from '../types/navigationTypes';
import {selectTheme} from '../store/auth/selector';
import {useTranslationHelper} from '../locale/useTranslation';
import * as Components from './index';
import * as Screen from '../screens/index';
import {HeaderTitleProfile} from './AppNavigatorComponents/HeaderTitleProfile';
import {
  HeaderHome,
  HeaderBackArrow,
  HeaderNavToHome,
  HeaderToVocab,
  createHeaderTrainingLevelComponent,
  HeaderBackToLearnOrTrainComponent,
} from './AppNavigatorComponents/HeadersNavigate';

const MainStack = createNativeStackNavigator();

export const AppNavigator = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigat = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);
  const {studyAndTrain, vocab, phonetic, verbs, lessonsBySubscr} =
    useTranslationHelper();

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

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Registration"
        component={Components.Registration}
        options={{headerShown: false}}
      />

      <MainStack.Screen
        name="Login"
        component={Components.Login}
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
        name="Home"
        component={Screen.Home}
        options={() => ({
          title: '',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',

          headerRight: HeaderHome,
          headerBackVisible: false,
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={Screen.Profile}
        options={() => ({
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerBackVisible: false,

          headerTitle: HeaderTitleProfile,
        })}
      />
      <MainStack.Screen
        name="StudyAndTrain"
        component={Components.StudyAndTrain}
        options={() => ({
          title: studyAndTrain,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackArrow,
        })}
      />
      <MainStack.Screen
        name="Vocab"
        component={Components.Vocab}
        options={() => ({
          title: vocab,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackArrow,
          headerRight: HeaderNavToHome,
        })}
      />

      <MainStack.Screen
        name="Verbs"
        component={Components.Verbs}
        options={() => ({
          title: verbs,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackArrow,
        })}
      />
      <MainStack.Screen
        name="Phonetic"
        component={Components.Phonetic}
        options={() => ({
          title: phonetic,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackArrow,
        })}
      />
      <MainStack.Screen
        name="LearnOrTrainTopic"
        component={Components.LearnOrTrainTopic}
        options={({route}) => {
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
            headerLeft: HeaderToVocab,
            headerRight: HeaderNavToHome,
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
            headerLeft: HeaderBackToLearnOrTrainComponent(
              topicName,
              isDarkTheme,
              navigation,
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />
      <MainStack.Screen
        name="WordLearningScreen"
        component={Components.WordLearningScreen}
        options={{headerShown: false}}
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
            headerLeft: HeaderBackToLearnOrTrainComponent(
              topicName,
              isDarkTheme,
              navigation,
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />

      <MainStack.Screen
        name="TrainingLevel"
        component={Components.TrainingLevel}
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
            headerBackVisible: false,
            headerTitle: createHeaderTrainingLevelComponent(
              topicName,
              isDarkTheme,
              navigation,
            ),
          };
        }}
      />
      <MainStack.Screen
        name="LessonsBySubscription"
        component={Components.LessonsBySubscription}
        options={() => ({
          title: lessonsBySubscr,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackArrow,
        })}
      />
    </MainStack.Navigator>
  );
};
