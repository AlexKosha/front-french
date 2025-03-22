import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
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
} from 'react-native';
import * as Validate from '../helpers/validationInput';
import {handleChange} from '../helpers/handleChangeInput';
import {registerThunk} from '../store/auth/authThunks';
import {defaultStyles} from './defaultStyles';
import {AppDispatch} from '../store/store';
import {NavigationProps} from '../helpers/navigationTypes';
import {useLocalization} from '../locale/LocalizationContext';
import {translations} from '../locale/translations';
import {useTranslationHelper} from '../locale/useTranslation';
import {Logo} from './Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTheme} from '../store/auth/authSlice';

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
    nameText,
    dateOfBirth,
    emailText,
    passwordText,
    createAccText,
    agreeTermsText,
    letsAcq,
    alreadyAccount,
    login,
    confirm,
    cancel,
    close,
    welcomeAlert,
    registerError,
    name,
    birthDate,
    email,
    password,
  } = useTranslationHelper();

  const changeLanguageHandler = () => {
    const newLang = locale === 'en' ? 'uk' : 'en';
    setLocale(newLang);
  };

  const handleRegister = async () => {
    try {
      const resultAction = await dispatch(registerThunk(formData));
      if (registerThunk.fulfilled.match(resultAction)) {
        setFormData({name: '', birthDate: '', email: '', password: ''});
        navigation.navigate('Home');
        Alert.alert('', welcomeAlert, [{text: close}]);
      } else {
        Alert.alert('Error', resultAction.error.message);
        Alert.alert('', registerError, [{text: close}]);
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
    name,
  );

  const handleBirthDateChange = handleChange(
    setFormData,
    'birthDate',
    Validate.validateBirthDate,
    setFormErrors,
    'birthDateError',
    birthDate,
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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== null) {
          const parsedTheme = JSON.parse(storedTheme); // Конвертуємо з рядка в булеве значення
          dispatch(setTheme(parsedTheme)); // Оновлюємо тему у Redux-стані
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  });

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
          <View style={defaultStyles.container}>
            {/* Language and Header */}
            <Pressable
              onPress={changeLanguageHandler}
              style={{marginBottom: 50}}>
              <MaterialIcons name="language" size={26} color="#67104c" />
            </Pressable>

            <Text style={[defaultStyles.headerText, {color: 'black'}]}>
              {letsAcq}
            </Text>

            {/* Name */}
            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{nameText}</Text>
              <View style={defaultStyles.boxInput}>
                <TextInput
                  placeholder={translations.rg.placeName[locale as 'en' | 'uk']}
                  keyboardType="default"
                  value={formData.name}
                  style={{width: '100%'}}
                  onChangeText={handleNameChange}
                />
                {renderError(formErrors.nameError, [styles.errorMessage])}
              </View>
            </View>

            {/* Date of Birth */}
            <View style={{marginBottom: 12}}>
              <Text style={defaultStyles.labelText}>{dateOfBirth}</Text>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  locale={locale}
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
                      {cancel}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmIOSDate}>
                    <Text style={[defaultStyles.btnText, {color: 'white'}]}>
                      {confirm}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Checkbox */}
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View style={{marginRight: 8}}>
                <CheckBox
                  checked={isChecked}
                  onPress={toggleCheckBox}
                  color="#67104c"
                />
              </View>
              <Text style={{marginLeft: 5, fontSize: 16}}>
                {agreeTermsText}
              </Text>
            </View>

            {/* Register button */}
            <Pressable
              style={[
                defaultStyles.button,
                {backgroundColor: '#67104c'},
                (!isFormValid || !isChecked) && styles.buttonDisabled,
              ]}
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

            {/* Login link */}
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

          {/* Logo */}
          <Logo isThemePage={true} />
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
    // height: 120, не працює
    marginTop: -15,
  },
  pickerButton: {
    // paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 135,
    backgroundColor: 'gray',
    borderRadius: 100,
  },
  pickerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10, // Відступ між кнопками і вибором дати
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#555555',
  },
  confirmButton: {
    backgroundColor: '#67104c',
  },
});
