import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationProps} from '../../types/navigationTypes';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';

export const HeaderHome = () => {
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <AntDesign
        name="user"
        size={30}
        color={isDarkTheme ? 'white' : '#67104c'}
        style={{marginRight: 5}}
      />
    </TouchableOpacity>
  );
};

export const HeaderToVocab = () => {
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Vocab')}>
      <AntDesign
        name="arrowleft"
        size={30}
        color={isDarkTheme ? 'white' : '#67104c'}
        style={{marginLeft: 5}}
      />
    </TouchableOpacity>
  );
};

export const HeaderNavToHome = () => {
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <AntDesign
        name="home"
        size={30}
        color={isDarkTheme ? 'white' : '#67104c'}
        style={{marginLeft: 5}}
      />
    </TouchableOpacity>
  );
};

export const HeaderBackArrow = () => {
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();
  const isDarkTheme = useSelector(selectTheme);

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <AntDesign
        name="arrowleft"
        size={30}
        color={isDarkTheme ? 'white' : '#67104c'}
        style={{marginLeft: 5}}
      />
    </TouchableOpacity>
  );
};

export const HeaderBackToLearnOrTrainComponent = (
  topicName: string,
  isDarkTheme: boolean,
  navigation: any,
): ((props: any) => React.ReactNode) => {
  return props => (
    <TouchableOpacity
      {...props}
      onPress={() => navigation.navigate('LearnOrTrainTopic', {topicName})}>
      <AntDesign
        name="arrowleft"
        size={30}
        color={isDarkTheme ? 'white' : '#67104c'}
        style={{marginLeft: 5}}
      />
    </TouchableOpacity>
  );
};

export const createHeaderTrainingLevelComponent = (
  topicName: string,
  isDarkTheme: boolean,
  navigation: any,
): ((props: any) => React.ReactNode) => {
  return props => (
    <View
      {...props}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Попередження',
            'Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?',
            [
              {text: 'Залишитись', style: 'cancel'},
              {
                text: 'Вийти',
                onPress: () => navigation.navigate('Train', {topicName}),
                style: 'destructive',
              },
            ],
          );
        }}>
        <AntDesign
          name="arrowleft"
          size={30}
          color={isDarkTheme ? 'white' : '#67104c'}
          style={{marginLeft: 5}}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Попередження',
            'Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?',
            [
              {text: 'Залишитись', style: 'cancel'},
              {
                text: 'Вийти',
                onPress: () => navigation.navigate('Home'),
                style: 'destructive',
              },
            ],
          );
        }}>
        <AntDesign
          name="home"
          size={30}
          color={isDarkTheme ? 'white' : '#67104c'}
          style={{marginRight: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};
