import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
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
  ScrollView,
  Image,
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
  const {locale} = useLocalization();
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
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Title --- */}
        <Text
          style={[styles.title, {color: isDarkTheme ? 'white' : '#67104c'}]}>
          МОЯ СТОРІНКА
        </Text>

        {/* --- Top Info Section --- */}
        <View style={styles.profileRow}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyeH_myfw70ic6LUaL-PZeFL83c_UGi3Q0Q&s',
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text
              style={[styles.name, {color: isDarkTheme ? 'white' : 'black'}]}>
              {userInfo.name}
            </Text>
            <Text
              style={[styles.email, {color: isDarkTheme ? 'white' : 'black'}]}>
              {userInfo.email}
            </Text>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* --- My Progress --- */}
        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkTheme ? 'white' : '#67104c'},
          ]}>
          МІЙ ПРОГРЕС
        </Text>

        <View style={styles.progressSection}>
          <Text style={{color: isDarkTheme ? 'white' : 'black'}}>
            {userData.croissants || 0}
          </Text>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyeH_myfw70ic6LUaL-PZeFL83c_UGi3Q0Q&s',
            }}
            style={styles.croissant}
          />
        </View>

        {/* --- My Subscription --- */}
        <Text
          style={[
            styles.sectionTitle,
            {color: isDarkTheme ? 'white' : '#67104c'},
          ]}>
          МОЯ ПІДПИСКА
        </Text>

        <View style={styles.subscriptionSection}>
          <View style={styles.barContainer}>
            <View style={styles.barItem}>
              <View
                style={[
                  styles.bar,
                  {
                    height: 30,
                    backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}
              />
              <Text
                style={[
                  styles.barLabel,
                  {color: isDarkTheme ? 'white' : '#67104c'},
                ]}>
                1 МІС
              </Text>
            </View>

            <View style={styles.barItem}>
              <View
                style={[
                  styles.bar,
                  {
                    height: 100,
                    backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}
              />
              <Text
                style={[
                  styles.barLabel,
                  {color: isDarkTheme ? 'white' : '#67104c'},
                ]}>
                6 МІС
              </Text>
            </View>

            <View style={styles.barItem}>
              <View
                style={[
                  styles.bar,
                  {
                    height: 150,
                    backgroundColor: isDarkTheme ? 'white' : '#67104c',
                  },
                ]}
              />
              <Text
                style={[
                  styles.barLabel,
                  {color: isDarkTheme ? 'white' : '#67104c'},
                ]}>
                1 РІК
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}>
          <Text
            style={[
              defaultStyles.btnText,
              {color: isDarkTheme ? '#67104c' : 'white'},
            ]}>
            Підписатися
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    gap: 20,
  },
  croissant: {
    width: 40,
    height: 40,
  },
  subscriptionSection: {
    // Горизонтальне центрування
    paddingHorizontal: 30,
    marginVertical: 30,
    flex: 1, // Це допомагає "виставити" цей блок на весь екран, якщо потрібно
  },

  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Тепер рівномірно розподіляються між собою
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },

  barItem: {
    alignItems: 'center',
  },

  bar: {
    width: 20,
    borderRadius: 10,
  },

  barLabel: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#67104c',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  subscribeText: {
    color: 'white',
    fontSize: 16,
  },
});

//   return (
//     <TouchableOpacity
//       style={{flex: 1}}
//       onPress={Keyboard.dismiss}
//       activeOpacity={1}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={
//           Platform.OS === 'android' ? 35 : Platform.OS === 'ios' ? 95 : 0
//         }
//         style={{flex: 1}}>
//         <SafeAreaView
//           style={{
//             flex: 1,
//             backgroundColor: isDarkTheme ? '#67104c' : 'white',
//           }}>
//           <View style={defaultStyles.container}>
//             <Text
//               style={[
//                 styles.textName,
//                 {
//                   color: isDarkTheme ? 'white' : 'black',
//                 },
//               ]}>
//               {hello}, {userInfo.name ? userInfo.name : 'Guest'} !
//             </Text>
//             <ProgressBar
//               croissants={userData.croissants}
//               maxCroissants={100}
//               theme={isDarkTheme}
//             />

//             <View style={defaultStyles.boxForm}>
//               <Text
//                 style={[
//                   defaultStyles.labelText,
//                   {
//                     color: isDarkTheme ? 'white' : 'black',
//                   },
//                 ]}>
//                 {nameText}
//               </Text>
//               <View
//                 style={[
//                   defaultStyles.boxInput,
//                   {
//                     borderColor: isDarkTheme ? 'white' : '#67104c',
//                   },
//                 ]}>
//                 <TextInput
//                   placeholder={translations.rg.placeName[locale as 'en' | 'uk']}
//                   placeholderTextColor={isDarkTheme ? 'white' : 'black'}
//                   keyboardType="default"
//                   value={userInfo.name}
//                   style={{
//                     width: '100%',
//                     color: isDarkTheme ? 'white' : 'black',
//                   }}
//                   onChangeText={text =>
//                     setUserInfo(prevInfo => ({...prevInfo, name: text}))
//                   }
//                 />
//               </View>
//             </View>

//             <View style={defaultStyles.boxForm}>
//               <Text
//                 style={[
//                   defaultStyles.labelText,
//                   {
//                     color: isDarkTheme ? 'white' : 'black',
//                   },
//                 ]}>
//                 {emailText}
//               </Text>
//               <View
//                 style={[
//                   defaultStyles.boxInput,
//                   {
//                     borderColor: isDarkTheme ? 'white' : '#67104c',
//                   },
//                 ]}>
//                 <TextInput
//                   placeholder={
//                     translations.rg.placeEmail[locale as 'en' | 'uk']
//                   }
//                   placeholderTextColor={isDarkTheme ? 'white' : 'black'}
//                   value={userInfo.email}
//                   keyboardType="email-address"
//                   style={{
//                     width: '100%',
//                     color: isDarkTheme ? 'white' : 'black',
//                   }}
//                   onChangeText={text =>
//                     setUserInfo(prevInfo => ({...prevInfo, email: text}))
//                   }
//                 />
//               </View>
//             </View>

//             <Pressable
//               onPress={handleSave}
//               style={[
//                 defaultStyles.button,
//                 {
//                   backgroundColor: isDarkTheme ? 'white' : '#67104c',
//                   marginBottom: 30,
//                 },
//               ]}>
//               <Text
//                 style={[
//                   defaultStyles.btnText,
//                   {
//                     color: isDarkTheme ? '#67104c' : 'white',
//                   },
//                 ]}>
//                 {saveChanges}
//               </Text>
//             </Pressable>
//             <PasswordForm />
//           </View>
//         </SafeAreaView>
//       </KeyboardAvoidingView>
//     </TouchableOpacity>
//   );
// };

// export const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   textName: {
//     fontSize: 24,
//     marginBottom: 20,
//     padding: 10,
//   },
// });
