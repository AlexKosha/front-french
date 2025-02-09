import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import {useTranslation} from 'react-i18next';
// import '../../i18n';
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

const PasswordForm = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector(selectTheme);

  const [userPass, setUserPass] = useState({
    password: '',
    newPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const {t} = useTranslation();

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
          {/* {t('rg.password')} */}
        </Text>
        <View
          style={[
            defaultStyles.boxInput,
            {
              borderColor: theme ? 'white' : '#67104c',
            },
          ]}>
          <TextInput
            // placeholder={t('rg.placePass')}
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
          {/* {t('rg.newPassword')} */}
        </Text>
        <View
          style={[
            defaultStyles.boxInput,
            {
              borderColor: theme ? 'white' : '#67104c',
            },
          ]}>
          <TextInput
            // placeholder={t('rg.placeNewPassword')}
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
          {/* {t('rg.saveChanges')} */}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PasswordForm;
