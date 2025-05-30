import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
  HeaderHomeToProfile,
  HeaderNavToHome,
  createHeaderTrainingLevelComponent,
  HeaderBackToLearnOrTrainComponent,
  HeaderBackToPreviousComponent,
} from './AppNavigatorComponents/HeadersNavigate';

const MainStack = createNativeStackNavigator();

export const AppNavigator = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigat = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);
  const {vocabOrVerbs, vocab} = useTranslationHelper();

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

          headerRight: HeaderHomeToProfile,
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
        name="VocabOrVerbs"
        component={Components.VocabOrVerbs}
        options={({navigation}) => ({
          title: vocabOrVerbs,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackToPreviousComponent(
            isDarkTheme,
            navigation,
            'Home',
          ),
        })}
      />
      <MainStack.Screen
        name="VocabThemeList"
        component={Components.VocabThemeList}
        options={({navigation}) => ({
          title: vocab,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackToPreviousComponent(
            isDarkTheme,
            navigation,
            'VocabOrVerbs',
          ),
          headerRight: HeaderNavToHome,
        })}
      />
      <MainStack.Screen
        name="LearnOrTrainTopic"
        component={Components.LearnOrTrainTopic}
        options={({route, navigation}) => {
          const params =
            route.params as RouteProps<'LearnOrTrainTopic'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToPreviousComponent(
              isDarkTheme,
              navigation,
              'VocabThemeList',
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />

      <MainStack.Screen
        name="LearnVocabTheme"
        component={Components.LearnVocabTheme}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'LearnVocabTheme'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToLearnOrTrainComponent(
              titleName,
              isDarkTheme,
              navigation,
              'LearnOrTrainTopic',
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />
      <MainStack.Screen
        name="WordLearningScreen"
        component={Components.WordLearningScreen}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'TrainVocabulary'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: createHeaderTrainingLevelComponent(
              titleName,
              isDarkTheme,
              navigation,
              'LearnVocabTheme',
            ),
          };
        }}
      />
      <MainStack.Screen
        name="TrainVocabulary"
        component={Components.TrainVocabulary}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'TrainVocabulary'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToLearnOrTrainComponent(
              titleName,
              isDarkTheme,
              navigation,
              'LearnOrTrainTopic',
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />

      <MainStack.Screen
        name="TrainingLevel"
        component={Components.TrainingLevel}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'TrainVocabulary'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerBackVisible: false,
            headerTitle: createHeaderTrainingLevelComponent(
              titleName,
              isDarkTheme,
              navigation,
              'TrainVocabulary',
            ),
          };
        }}
      />

      <MainStack.Screen
        name="VerbLearningScreen"
        component={Components.VerbLearningScreen}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'VerbLearningScreen'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToLearnOrTrainComponent(
              titleName,
              isDarkTheme,
              navigation,
              'VerbsList',
            ),
          };
        }}
      />

      <MainStack.Screen
        name="VerbsList"
        component={Components.VerbsList}
        options={({navigation, route}) => {
          const params = route.params as RouteProps<'VerbsList'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToPreviousComponent(
              isDarkTheme,
              navigation,
              'ChooseTense',
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />
      <MainStack.Screen
        name="ChooseTense"
        component={Components.ChooseTense}
        options={({navigation}) => ({
          title: '',
          // headerTitleAlign: 'center',
          // headerShown: true,
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: HeaderBackToPreviousComponent(
            isDarkTheme,
            navigation,
            'VocabOrVerbs',
          ),
          headerRight: HeaderNavToHome,
        })}
      />
      <MainStack.Screen
        name="VerbsLevelsSelect"
        component={Components.VerbsLevelsSelect}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'VerbsLevelsSelect'>['params'];
          const titleName = params?.titleName ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerLeft: HeaderBackToLearnOrTrainComponent(
              titleName,
              isDarkTheme,
              navigation,
              'VerbsList',
            ),
            headerRight: HeaderNavToHome,
          };
        }}
      />
      <MainStack.Screen
        name="TrainingLevelVerbs"
        component={Components.TrainingLevelVerbs}
        options={({navigation, route}) => {
          const params =
            route.params as RouteProps<'TrainingLevelVerbs'>['params'];
          const titleName = params?.titleName ?? '';
          const selectedVerbs = params?.selectedVerbs ?? '';
          return {
            title: titleName,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            },
            headerShadowVisible: false,
            headerTintColor: isDarkTheme ? 'white' : '#67104c',
            headerBackVisible: false,
            headerTitle: createHeaderTrainingLevelComponent(
              titleName,
              isDarkTheme,
              navigation,
              'VerbsLevelsSelect',
              selectedVerbs,
            ),
          };
        }}
      />
    </MainStack.Navigator>
  );
};
