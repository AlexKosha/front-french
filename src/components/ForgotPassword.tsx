import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {handleChange} from '../helpers/handleChangeInput';
import {forgotPass, restorePassword} from '../services/authService';
import * as Validate from '../helpers/validationInput';
import {defaultStyles} from './defaultStyles';
import {NavigationProps} from '../helpers/navigationTypes';
import {useLocalization} from '../locale/LocalizationContext';
import {useTranslationHelper} from '../locale/useTranslation';
import {translations} from '../locale/translations';
import {Logo} from './Logo';

export const ForgotPassword = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'ForgotPassword'>>();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    otpError: '',
    emailError: '',
    passwordError: '',
  });
  const [isOtpCode, setIsOtpCode] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [_, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const {locale} = useLocalization();

  const {
    emailText,
    clickHere,
    techSupport,
    sendCode,
    saveChanges,
    back,
    newPassword,
    send,
    code,
    close,
    codeOnMail,
    passwordChanged,
    email,
    password,
  } = useTranslationHelper();

  const handleSendOtpCode = async () => {
    try {
      await forgotPass({email: formData.email});

      setFormData({
        ...formData,
        otp: '',
        password: '',
      });
      setIsOtpCode(true);
      Alert.alert('', codeOnMail, [{text: close}]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword = async () => {
    const newPassword = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await restorePassword(formData.otp, newPassword);
      Alert.alert('', passwordChanged, [{text: close}]);
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToEmail = () => {
    setFormData({
      ...formData,
      otp: '',
      password: '',
      email: formData.email,
    });
    setIsOtpCode(false);
  };

  const handleOtpChange = handleChange(
    setFormData,
    'otp',
    Validate.validateOtp,
    setFormErrors,
    'otpError',
    code,
  );

  const handleEmailChange = handleChange(
    setFormData,
    'email',
    Validate.validateEmail,
    setFormErrors,
    'emailError',
    email,
  );

  const handlePasswordChange = handleChange(
    setFormData,
    'password',
    Validate.validatePassword,
    setFormErrors,
    'passwordError',
    password,
  );

  const renderError = (error: any, errorMessage: any) => {
    return error ? <Text style={errorMessage}>{error}</Text> : null;
  };

  useEffect(() => {
    const validateForm = () => {
      const isEmailValid: boolean = !!formData.email && !formErrors.emailError;
      const isPasswordValid: boolean =
        !!formData.password && !formErrors.passwordError;
      const isOtpValid: boolean = !!formData.otp && !formErrors.otpError;

      setEmailValid(isEmailValid);
      setPasswordValid(isOtpValid && isPasswordValid);
    };

    validateForm();
  }, [formData, formErrors]);

  return (
    <TouchableOpacity
      style={{flex: 1}}
      onPress={Keyboard.dismiss}
      activeOpacity={1}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={defaultStyles.container}>
            {/* Icons */}
            <View style={defaultStyles.headerBox}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <AntDesign name="arrowleft" size={24} color="#67104c" />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={changeLanguageHandler}>
                <MaterialIcons name="language" size={26} color="#67104c" />
              </TouchableOpacity> */}
            </View>

            {isOtpCode ? (
              <>
                {/* Enter code */}
                <View style={defaultStyles.boxForm}>
                  <Text style={defaultStyles.labelText}>{code}</Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: '#67104c',
                      },
                    ]}>
                    <TextInput
                      placeholder={
                        translations.rg.placeCode[locale as 'en' | 'uk']
                      }
                      keyboardType="default"
                      style={styles.inputText}
                      onChangeText={handleOtpChange}
                    />
                  </View>
                </View>

                {/* New Password */}
                <View style={defaultStyles.boxForm}>
                  <Text style={defaultStyles.labelText}>{newPassword}</Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: '#67104c',
                      },
                    ]}>
                    <TextInput
                      placeholder={
                        translations.rg.placeNewPassword[locale as 'en' | 'uk']
                      }
                      secureTextEntry={!isPasswordVisible}
                      keyboardType="default"
                      value={formData.password}
                      style={styles.inputText}
                      onChangeText={handlePasswordChange}
                    />
                    {renderError(formErrors.passwordError, [
                      styles.errorMessage,
                      {top: -13},
                    ])}
                    <TouchableOpacity
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={{position: 'absolute', right: 12}}>
                      {isPasswordVisible === true ? (
                        <Feather name="eye" size={24} color="#67104c" />
                      ) : (
                        <Feather name="eye-off" size={24} color="#67104c" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Buttons Back and Save Changes */}
                <Pressable
                  style={[defaultStyles.button, {backgroundColor: '#67104c'}]}
                  onPress={handleBackToEmail}>
                  <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                    {back}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    defaultStyles.button,
                    {backgroundColor: '#67104c'},
                    !passwordValid && styles.buttonDisabled,
                  ]}
                  onPress={handleChangePassword}
                  disabled={!passwordValid}>
                  <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                    {saveChanges}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={[defaultStyles.boxForm, {padding: 0}]}>
                  <Text
                    style={[
                      defaultStyles.headerText,
                      {
                        color: 'black',
                      },
                    ]}>
                    {sendCode}
                  </Text>
                </View>

                {/* Email */}
                <View style={[defaultStyles.boxForm, {padding: 0}]}>
                  <Text style={defaultStyles.labelText}>{emailText}</Text>
                  <View
                    style={[
                      defaultStyles.boxInput,
                      {
                        borderColor: '#67104c',
                      },
                    ]}>
                    <TextInput
                      placeholder={
                        translations.rg.placeEmail[locale as 'en' | 'uk']
                      }
                      keyboardType="email-address"
                      style={styles.inputText}
                      onChangeText={handleEmailChange}
                    />
                  </View>
                </View>

                {/* Send button */}
                <Pressable
                  style={[defaultStyles.button, {backgroundColor: '#67104c'}]}
                  onPress={handleSendOtpCode}>
                  <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                    {send}
                  </Text>
                </Pressable>

                {/* Links */}
                <View style={[defaultStyles.linkBox, {marginTop: 22}]}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#67104c',
                    }}>
                    {techSupport}
                  </Text>
                  <Pressable onPress={() => navigation.navigate('Support')}>
                    <Text style={[defaultStyles.linkText, {color: '#67104c'}]}>
                      {clickHere}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {/* Logo */}
          <Logo isThemePage={true} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontFamily: 'Montserrat-Regular',
    position: 'absolute',
    fontSize: 10,
    color: 'red',
    left: 0,
    top: -30,
  },
  inputText: {
    width: '100%',
    color: 'black',
  },
  buttonDisabled: {backgroundColor: '#CCCCCC', pointerEvents: 'none'},
});
