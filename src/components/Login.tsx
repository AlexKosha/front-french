import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import {loginThunk} from '../store/auth/authThunks';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {AppDispatch} from '../store/store';
import {useLocalization} from '../locale/LocalizationContext';
import {translations} from '../locale/translations';
import {useTranslationHelper} from '../locale/useTranslation';

export const Login = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Login'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {locale, setLocale} = useLocalization();

  const {
    emailText,
    passwordText,
    login,
    welcomeBack,
    dontHaveAcc,
    haveAccButForgotPass,
    registerText,
    resetPassHere,
  } = useTranslationHelper();

  // const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    console.log('231');
    // setIsFormValid(email.trim().length > 0 && password.trim().length > 0);
  };

  const handleLogin = async () => {
    try {
      const resultAction = await dispatch(loginThunk({email, password}));
      // Якщо реєстрація була успішною, `resultAction` не буде помилкою
      if (loginThunk.fulfilled.match(resultAction)) {
        setEmail('');
        setPassword('');
        navigation.navigate('Home');
      } else {
        // Тут можна обробити помилку, якщо потрібно
        // Alert.alert('', t('alert.loginError'), [{text: t('alert.close')}]);
      }
    } catch (error: any) {
      console.log('Login failed:', error);
      Alert.alert('Error', error.message);
    }
    return;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text.trim());
    if (text.trim().length === 0) {
      // setIsFormValid(false);
    } else {
      validateForm();
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text.trim());
    if (text.trim().length === 0) {
      // setIsFormValid(false);
    } else {
      validateForm();
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkTheme ? '#67104c' : 'white'}}>
      <View style={defaultStyles.container}>
        <View style={{marginVertical: 22}}>
          <Text
            style={[
              defaultStyles.headerText,
              {
                color: isDarkTheme ? 'white' : 'black',
              },
            ]}>
            {welcomeBack}
          </Text>
        </View>

        <View style={{marginBottom: 12}}>
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
              placeholder={translations.rg.placeEmail[locale as 'en' | 'uk']}
              value={email}
              placeholderTextColor={isDarkTheme ? 'lightgray' : undefined}
              keyboardType="email-address"
              style={{width: '100%', color: isDarkTheme ? 'white' : 'black'}}
              onChangeText={handleEmailChange}
            />
          </View>
        </View>

        <View style={{marginBottom: 12}}>
          <Text
            style={[
              defaultStyles.labelText,
              {
                color: isDarkTheme ? 'white' : 'black',
              },
            ]}>
            {passwordText}
          </Text>
          <View
            style={[
              defaultStyles.boxInput,
              {
                borderColor: isDarkTheme ? 'white' : '#67104c',
              },
            ]}>
            <TextInput
              placeholder={translations.rg.placePass[locale as 'en' | 'uk']}
              value={password}
              placeholderTextColor={isDarkTheme ? 'lightgray' : undefined}
              secureTextEntry={!isPasswordVisible}
              style={{width: '100%', color: isDarkTheme ? 'white' : 'black'}}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{position: 'absolute', right: 12}}>
              {isPasswordVisible === true ? (
                <Feather
                  name="eye"
                  size={24}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              ) : (
                <Feather
                  name="eye-off"
                  size={24}
                  color={isDarkTheme ? 'white' : '#67104c'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          style={[
            defaultStyles.button,
            {
              backgroundColor: isDarkTheme ? 'white' : '#67104c',
            },
          ]}
          onPress={handleLogin}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {login}
          </Text>
        </Pressable>

        <View
          style={[
            defaultStyles.linkBox,
            {
              marginVertical: 22,
            },
          ]}>
          <Text style={{fontSize: 16, color: isDarkTheme ? 'white' : 'black'}}>
            {dontHaveAcc}
          </Text>
          <Pressable onPress={() => navigation.navigate('Registration')}>
            <Text
              style={[
                defaultStyles.linkText,
                {
                  color: isDarkTheme ? 'white' : '#67104c',
                },
              ]}>
              {registerText}
            </Text>
          </Pressable>
        </View>
        <View style={defaultStyles.linkBox}>
          <Text
            style={{
              fontSize: 16,
              color: isDarkTheme ? 'white' : 'black',
            }}>
            {haveAccButForgotPass}
          </Text>
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={[
                defaultStyles.linkText,
                {
                  color: isDarkTheme ? 'white' : '#67104c',
                },
              ]}>
              {resetPassHere}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
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
      </View>
    </SafeAreaView>
  );
};
