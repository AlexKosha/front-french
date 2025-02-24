import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {
  Pressable,
  SafeAreaView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {updaterPasswordThunk} from '../store/auth/authThunks';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {AppDispatch} from '../store/store';
import {translations} from '../locale/translations';
import {useLocalization} from '../locale/LocalizationContext';
import {useTranslationHelper} from '../locale/useTranslation';

const PasswordForm = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector(selectTheme);

  const [userPass, setUserPass] = useState({
    password: '',
    newPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {locale} = useLocalization();

  const {passwordText, saveChanges, newPassword} = useTranslationHelper();

  const updateUserPass = async () => {
    try {
      const resultAction = await dispatch(updaterPasswordThunk(userPass));
      if (updaterPasswordThunk.fulfilled.match(resultAction)) {
        setUserPass({password: '', newPassword: ''});
        // Alert.alert('', t('alert.passwordChanged'), [{text: t('alert.close')}]);
        console.log('Пароль успішно змінено');
      } else {
        Alert.alert('Error', resultAction.error.message);
      }
    } catch (error: any) {
      console.log('Changes password failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView>
      <View style={defaultStyles.boxForm}>
        <Text
          style={[
            defaultStyles.labelText,
            {
              color: theme ? 'white' : 'black',
            },
          ]}>
          {passwordText}
        </Text>
        <View
          style={[
            defaultStyles.boxInput,
            {
              borderColor: theme ? 'white' : '#67104c',
            },
          ]}>
          <TextInput
            placeholder={translations.rg.placePass[locale as 'en' | 'uk']}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor={theme ? 'white' : undefined}
            keyboardType="default"
            value={userPass.password}
            style={{width: '100%'}}
            onChangeText={text =>
              setUserPass(prevNote => ({...prevNote, password: text}))
            }
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{position: 'absolute', right: 12}}>
            {isPasswordVisible === true ? (
              <Feather
                name="eye"
                size={24}
                color={theme ? 'white' : '#67104c'}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                color={theme ? 'white' : '#67104c'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={defaultStyles.boxForm}>
        <Text
          style={[
            defaultStyles.labelText,
            {
              color: theme ? 'white' : 'black',
            },
          ]}>
          {newPassword}
        </Text>
        <View
          style={[
            defaultStyles.boxInput,
            {
              borderColor: theme ? 'white' : '#67104c',
            },
          ]}>
          <TextInput
            placeholder={
              translations.rg.placeNewPassword[locale as 'en' | 'uk']
            }
            placeholderTextColor={theme ? 'white' : undefined}
            keyboardType="default"
            value={userPass.newPassword}
            secureTextEntry={!isPasswordVisible}
            style={{width: '100%'}}
            onChangeText={text =>
              setUserPass(prevNote => ({...prevNote, newPassword: text}))
            }
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{position: 'absolute', right: 12}}>
            {isPasswordVisible === true ? (
              <Feather
                name="eye"
                size={24}
                color={theme ? 'white' : '#67104c'}
              />
            ) : (
              <Feather
                name="eye-off"
                size={24}
                color={theme ? 'white' : '#67104c'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
        // color={theme ? "black" : "white"}
        onPress={updateUserPass}
        style={[
          defaultStyles.button,
          {
            backgroundColor: theme ? 'white' : '#67104c',
          },
        ]}>
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: theme ? '#67104c' : 'white',
            },
          ]}>
          {saveChanges}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PasswordForm;
