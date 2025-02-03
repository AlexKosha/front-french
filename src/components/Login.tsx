import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import '../i18n';
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

export const Login = () => {
  const navigation = useNavigation<NavigationProps<'Login'>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(selectTheme);

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const {t, i18n} = useTranslation();

  const validateForm = () => {
    setIsFormValid(email.trim().length > 0 && password.trim().length > 0);
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
        Alert.alert('', t('alert.loginError'), [{text: t('alert.close')}]);
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
      setIsFormValid(false);
    } else {
      validateForm();
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text.trim());
    if (text.trim().length === 0) {
      setIsFormValid(false);
    } else {
      validateForm();
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkTheme ? '#67104c' : 'white'}}>
      <View style={defaultStyles.container}>
        <View style={defaultStyles.headerBox}>
          <Pressable
            onPress={() =>
              changeLanguage(i18n.language === 'en' ? 'uk' : 'en')
            }>
            <MaterialIcons
              name="language"
              size={26}
              color={isDarkTheme ? 'white' : '#67104c'}
            />
          </Pressable>
        </View>
        <View style={{marginVertical: 22}}>
          <Text
            style={[
              defaultStyles.headerText,
              {
                color: isDarkTheme ? 'white' : 'black',
              },
            ]}>
            {t('rg.welcomeBack')}
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
            {t('rg.email')}
          </Text>
          <View
            style={[
              defaultStyles.boxInput,
              {
                borderColor: isDarkTheme ? 'white' : '#67104c',
              },
            ]}>
            <TextInput
              placeholder={t('rg.placeEmail')}
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
            {t('rg.password')}
          </Text>
          <View
            style={[
              defaultStyles.boxInput,
              {
                borderColor: isDarkTheme ? 'white' : '#67104c',
              },
            ]}>
            <TextInput
              placeholder={t('rg.placePass')}
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
            {t('rg.login')}
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
            {t('rg.dontHaveAcc')}
          </Text>
          <Pressable onPress={() => navigation.navigate('Registration')}>
            <Text
              style={[
                defaultStyles.linkText,
                {
                  color: isDarkTheme ? 'white' : '#67104c',
                },
              ]}>
              {t('rg.register')}
            </Text>
          </Pressable>
        </View>
        <View style={defaultStyles.linkBox}>
          <Text
            style={{
              fontSize: 16,
              color: isDarkTheme ? 'white' : 'black',
            }}>
            {t('rg.haveAccButForgotPass')}
          </Text>
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={[
                defaultStyles.linkText,
                {
                  color: isDarkTheme ? 'white' : '#67104c',
                },
              ]}>
              {t('rg.resetPassHere')}
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
