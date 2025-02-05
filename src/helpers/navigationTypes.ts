import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

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
  LearnOrTrainTopic: {topicName: string};
  Learn: {topicName: string | undefined};
  Train: {topicName: string | undefined};
  WordLearningScreen: {
    count: number;
    topicName: string;
    wordItem: any;
  };
  TrainingLevel: {topicName: string; level: number; progress: any};
};

// Тип для навігації
export type NavigationProps<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

// Тип для отримання параметрів у route
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
