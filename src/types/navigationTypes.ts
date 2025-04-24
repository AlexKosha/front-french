import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Verb, VerbsInChoosenTense} from '.';

// Визначення всіх маршрутів додатку та їх параметрів
export type RootStackParamList = {
  AppNavigator: undefined;
  Registration: undefined;
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  StudyAndTrain: undefined;
  LessonsBySubscription: undefined;
  Vocab: undefined;
  ForgotPassword: undefined;
  Support: undefined;
  Phonetic: undefined;
  Verbs: undefined;
  LearnOrTrainTopic: {titleName: string};
  Learn: {titleName: string | undefined};
  Train: {titleName: string | undefined};
  WordLearningScreen: {
    count: number;
    titleName: string;
    wordItem: any;
  };
  TrainingLevel: {titleName: string; level: number; progress: any};
  LearnVerbs: {verbName: string | undefined};
  TrainVerbs: {verbName: string | undefined};
  VerbLearningScreen: {
    titleName: string | undefined;
    verbs: any | undefined;
  };
  VerbsList: {titleName: string | undefined};
  ChooseTense: undefined;
};

// Тип для навігації
export type NavigationProps<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

// Тип для отримання параметрів у route
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
