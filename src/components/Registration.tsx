import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CheckBox} from 'react-native-btr';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import * as Validate from '../helpers/validationInput';
import {handleChange} from '../helpers/handleChangeInput';
import {getProfileThunk, registerThunk} from '../store/auth/authThunks';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/uk';
import 'dayjs/locale/en';
import {defaultStyles} from './defaultStyles';
import {AppDispatch} from '../store/store';
import {NavigationProps} from '../helpers/navigationTypes';
import {useLocalization} from '../locale/LocalizationContext';
import {translations} from '../locale/translations';
import {useTranslationHelper} from '../locale/useTranslation';
// import {SafeAreaView} from 'react-native-safe-area-context';

export const Registration = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Registration'>>();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    nameError: '',
    birthDateError: '',
    emailError: '',
    passwordError: '',
  });
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPiker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const {locale, setLocale} = useLocalization();

  const {
    registerText,
    nameText,
    dateOfBirth,
    emailText,
    passwordText,
    createAccText,
    agreeTermsText,
    letsAcq,
    alreadyAccount,
    login,
  } = useTranslationHelper();

  const changeLanguageHandler = () => {
    const newLang = locale === 'en' ? 'uk' : 'en';
    setLocale(newLang);
  };

  const handleRegister = async () => {
    try {
      const resultAction = await dispatch(registerThunk(formData));
      if (registerThunk.fulfilled.match(resultAction)) {
        // setFormData({ name: "", birthDate: "", email: "", password: "" });
        navigation.navigate('Home');
        // Alert.alert('', t('alert.welcome'), [{text: t('alert.close')}]);
      } else {
        // Alert.alert("Error", resultAction.error.message);
        // Alert.alert('', t('alert.registerError'), [{text: t('alert.close')}]);
      }
    } catch (error: any) {
      console.log('Registration failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleNameChange = handleChange(
    setFormData,
    'name',
    Validate.validateName,
    setFormErrors,
    'nameError',
    'LOCALIZE',
  );

  const handleBirthDateChange = handleChange(
    setFormData,
    'birthDate',
    Validate.validateBirthDate,
    setFormErrors,
    'birthDateError',
    'LOCALIZE',
  );

  const handleEmailChange = handleChange(
    setFormData,
    'email',
    Validate.validateEmail,
    setFormErrors,
    'emailError',
    'LOCALIZE',
  );

  const handlePasswordChange = handleChange(
    setFormData,
    'password',
    Validate.validatePassword,
    setFormErrors,
    'passwordError',
    'LOCALIZE',
  );

  useEffect(() => {
    const validateForm = () => {
      const isNameValid: boolean = !!formData.name && !formErrors.nameError;
      const isDateOfBirthValid: boolean =
        !!formData.birthDate && !formErrors.birthDateError;
      const isEmailValid: boolean = !!formData.email && !formErrors.emailError;
      const isPasswordValid: boolean =
        !!formData.password && !formErrors.passwordError;

      setIsFormValid(
        isNameValid && isDateOfBirthValid && isEmailValid && isPasswordValid,
      );
    };

    validateForm();
  }, [formData, formErrors]);

  const renderError = (error: any, errorMessage: any) => {
    return error ? <Text style={errorMessage}>{error}</Text> : null;
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const toggleDatePicker = () => {
    setShowPiker(!showPicker);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const {type} = event;
    if (type === 'set' && selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
        setFormData(prevState => ({
          ...prevState,
          birthDate: formatDate(selectedDate),
        }));
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setFormData(prevState => ({
      ...prevState,
      birthDate: formatDate(date),
    }));
    toggleDatePicker();
  };

  const formatDate = (rawDate: Date): string => {
    let newDate = new Date(rawDate);

    let year = newDate.getFullYear();
    let month: number = newDate.getMonth() + 1;
    let day: number = newDate.getDate();

    // Перетворюємо числа в рядки для формату, але залишаємо їх як числа для операцій
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  return (
    <TouchableOpacity
      style={{flex: 1}}
      onPress={Keyboard.dismiss}
      activeOpacity={1}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, justifyContent: 'flex-end'}}
        // keyboardVerticalOffset={
        //   Platform.OS === "android" ? 35 : Platform.OS === "ios" ? 50 : 0
        // }
      >
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{flex: 1, marginHorizontal: 22}}>
            <View style={{marginVertical: 22}}>
              <View>
                <Pressable onPress={changeLanguageHandler}>
                  <MaterialIcons name="language" size={26} color="#67104c" />
                </Pressable>
              </View>
              <Text style={[defaultStyles.headerText, {color: 'black'}]}></Text>
              <Text style={{fontSize: 16, color: 'black'}}>{letsAcq}</Text>
            </View>
            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{nameText}</Text>
              <View style={defaultStyles.boxInput}>
                <TextInput
                  placeholder={translations.rg.placeName[locale as 'en' | 'uk']}
                  // placeholderTextColor="#f89fa1"
                  keyboardType="default"
                  value={formData.name}
                  style={{width: '100%'}}
                  onChangeText={handleNameChange}
                />
                {renderError(formErrors.nameError, [styles.errorMessage])}
              </View>
            </View>

            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{dateOfBirth}</Text>

              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  // locale={i18n.language}
                  style={styles.datePicker}
                  maximumDate={new Date()}
                  minimumDate={new Date('1950-1-1')}
                />
              )}
              {showPicker && Platform.OS === 'ios' && (
                <View style={styles.pickerButtonContainer}>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.cancelButton]}
                    onPress={toggleDatePicker}>
                    <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                      {/* {t('btn.cancel')} */}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmIOSDate}>
                    <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                      {/* {t('btn.confirm')} */}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    placeholder={
                      translations.rg.placeDoB[locale as 'en' | 'uk']
                    }
                    // keyboardType="numeric"
                    value={formData.birthDate}
                    style={styles.textInut}
                    onChangeText={handleBirthDateChange}
                    editable={false}
                    onPressIn={toggleDatePicker}
                  />
                </Pressable>
              )}
              {renderError(formErrors.birthDateError, [styles.errorMessage])}
            </View>

            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{emailText}</Text>
              <View style={defaultStyles.boxInput}>
                <TextInput
                  placeholder={
                    translations.rg.placeEmail[locale as 'en' | 'uk']
                  }
                  keyboardType="email-address"
                  value={formData.email}
                  style={{width: '100%'}}
                  onChangeText={handleEmailChange}
                />
                {renderError(formErrors.emailError, [styles.errorMessage])}
              </View>
            </View>

            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{passwordText}</Text>
              <View style={defaultStyles.boxInput}>
                <TextInput
                  placeholder={translations.rg.placePass[locale as 'en' | 'uk']}
                  secureTextEntry={!isPasswordVisible}
                  value={formData.password}
                  style={{width: '100%'}}
                  onChangeText={handlePasswordChange}
                />
                {renderError(formErrors.passwordError, [styles.errorMessage])}
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

            {/* <View style={{flexDirection: 'row', marginVertical: 6}}>
              <CheckBox
                style={{marginRight: 8}}
                checked={isChecked}
                onPress={toggleCheckBox}
                color={isChecked ? '#67104c' : '#67104c'}
              />
              <Text style={{marginLeft: 5}}>{agreeTerms}</Text>
            </View> */}
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View style={{marginRight: 8}}>
                <CheckBox
                  checked={isChecked}
                  onPress={toggleCheckBox}
                  color="#67104c"
                />
              </View>
              <Text style={{marginLeft: 5}}>{agreeTermsText}</Text>
            </View>
            <Pressable
              style={[
                defaultStyles.button,
                {backgroundColor: '#67104c'},
                (!isFormValid || !isChecked) && styles.buttonDisabled,
              ]}
              // title="Register"
              onPress={handleRegister}
              disabled={!isFormValid}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {createAccText}
              </Text>
            </Pressable>

            <View style={[defaultStyles.linkBox, {marginVertical: 22}]}>
              <Text style={{fontSize: 16, color: 'black'}}>
                {alreadyAccount}
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={[defaultStyles.linkText, {color: '#67104c'}]}>
                  {login}
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: [{translateX: -70}],
              alignItems: 'center',
            }}>
            <Image
              source={require('../images/logo.jpg')}
              style={{
                width: 140,
                height: 60,
                resizeMode: 'contain',
              }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  textInut: {
    textAlign: 'left',
    width: '100 %',
    height: 48,
    borderColor: '#67104c',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 22,
  },
  errorMessage: {
    fontFamily: 'Montserrat-Regular',
    position: 'absolute',
    fontSize: 10,
    color: 'red',
    left: 0,
    top: -13,
  },
  buttonDisabled: {backgroundColor: '#CCCCCC', pointerEvents: 'none'},
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  pickerButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 51,
    width: 150,
    backgroundColor: 'gray',
  },
  pickerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10, // Відступ між кнопками і вибором дати
    marginBottom: 10, // Відступ знизу
  },
  // pickerButton: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 5,
  //   elevation: 2, // Тінь для Android
  //   shadowColor: '#000', // Тінь для iOS
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   alignItems: 'center',
  // },
  cancelButton: {
    backgroundColor: '#555555', // Червоний колір для кнопки скасування
  },
  confirmButton: {
    backgroundColor: '#67104c', // Зелений колір для кнопки підтвердження
  },
});
