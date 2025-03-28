import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  SafeAreaView,
  Text,
  TextInput,
  Alert,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  View,
  StyleSheet,
} from 'react-native';

import PasswordForm from '../components/PasswordForm';
import {updaterUserDataThunk} from '../store/auth/authThunks';
import {selectTheme, selectUser} from '../store/auth/selector';
import {defaultStyles} from '../components/defaultStyles';
import {AppDispatch} from '../store/store';
import ProgressBar from '../components/ProgressBar';
import {useTranslationHelper} from '../locale/useTranslation';
import {translations} from '../locale/translations';
import {useLocalization} from '../locale/LocalizationContext';

type User = {
  name: string;
  email: string;
};

export const Profile = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector(selectUser);
  const isDarkTheme = useSelector(selectTheme);

  const [user, setUser] = useState({name: '', email: ''});
  const [userInfo, setUserInfo] = useState({
    name: user.name || '',
    email: user.email || '',
  });
  const {locale, setLocale} = useLocalization();
  const {hello, nameText, emailText, saveChanges, dataChanged, close} =
    useTranslationHelper();

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      name: userInfo.name,
      email: userInfo.email,
    };
    setUser(updatedUser);
    setUserInfo(updatedUser);
    try {
      const resultAction = await dispatch(updaterUserDataThunk(updatedUser));
      if (updaterUserDataThunk.fulfilled.match(resultAction)) {
        Alert.alert('', dataChanged, [{text: close}]);
      } else {
        Alert.alert('Error', resultAction.error.message);
      }
    } catch (error: any) {
      console.log('Changes failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const getUserInfo = async (): Promise<void> => {
      if (!userData) {
        return;
      }

      setUser((prevUser: User) => ({
        ...prevUser,
        name: userData.name ?? prevUser.name,
        email: userData.email ?? prevUser.email,
      }));

      setUserInfo({
        name: userData.name ?? '',
        email: userData.email ?? '',
      });
    };

    getUserInfo();
  }, [dispatch, userData]);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      onPress={Keyboard.dismiss}
      activeOpacity={1}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'android' ? 35 : Platform.OS === 'ios' ? 95 : 0
        }
        style={{flex: 1}}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          }}>
          <View style={defaultStyles.container}>
            <Text
              style={[
                styles.textName,
                {
                  color: isDarkTheme ? 'white' : 'black',
                },
              ]}>
              {hello}, {userInfo.name ? userInfo.name : 'Guest'} !
            </Text>
            <ProgressBar
              croissants={userData.croissants}
              maxCroissants={100}
              theme={isDarkTheme}
            />

            <View style={defaultStyles.boxForm}>
              <Text
                style={[
                  defaultStyles.labelText,
                  {
                    color: isDarkTheme ? 'white' : 'black',
                  },
                ]}>
                {nameText}
              </Text>
              <View
                style={[
                  defaultStyles.boxInput,
                  {
                    borderColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}>
                <TextInput
                  placeholder={translations.rg.placeName[locale as 'en' | 'uk']}
                  placeholderTextColor={isDarkTheme ? 'white' : 'black'}
                  keyboardType="default"
                  value={userInfo.name}
                  style={{
                    width: '100%',
                    color: isDarkTheme ? 'white' : 'black',
                  }}
                  onChangeText={text =>
                    setUserInfo(prevInfo => ({...prevInfo, name: text}))
                  }
                />
              </View>
            </View>

            <View style={defaultStyles.boxForm}>
              <Text
                style={[
                  defaultStyles.labelText,
                  {
                    color: isDarkTheme ? 'white' : 'black',
                  },
                ]}>
                {emailText}
              </Text>
              <View
                style={[
                  defaultStyles.boxInput,
                  {
                    borderColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}>
                <TextInput
                  placeholder={
                    translations.rg.placeEmail[locale as 'en' | 'uk']
                  }
                  placeholderTextColor={isDarkTheme ? 'white' : 'black'}
                  value={userInfo.email}
                  keyboardType="email-address"
                  style={{
                    width: '100%',
                    color: isDarkTheme ? 'white' : 'black',
                  }}
                  onChangeText={text =>
                    setUserInfo(prevInfo => ({...prevInfo, email: text}))
                  }
                />
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              style={[
                defaultStyles.button,
                {
                  backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  marginBottom: 30,
                },
              ]}>
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? '#67104c' : 'white',
                  },
                ]}>
                {saveChanges}
              </Text>
            </Pressable>
            <PasswordForm />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textName: {
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
  },
});
