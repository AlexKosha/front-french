import React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {selectTheme} from '../../store/auth/selector';
import {NavigationProps} from '../../helpers/navigationTypes';
import {useLocalization} from '../../locale/LocalizationContext';
import {AppDispatch} from '../../store/store';
import {setTheme} from '../../store/auth/authSlice';
import {logoutThunk} from '../../store/auth/authThunks';

export const HeaderTitleProfile = () => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();
  const {locale, setLocale} = useLocalization();
  const dispatch = useDispatch<AppDispatch>();

  const changeLanguageHandler = () => {
    const newLang = locale === 'en' ? 'uk' : 'en';
    setLocale(newLang);
  };

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
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', resultAction.error.message);
      }
    } catch (error: any) {
      console.log('Registration failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.headerContainer]}>
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
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5, // відстань до країв
  },
});
