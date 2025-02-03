import {useDispatch, useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useEffect} from 'react';
import {getProfileThunk, logoutThunk} from '../store/auth/authThunks';
import * as Screens from '../screens';
import * as Components from '../components';
import {setTheme} from '../store/auth/authSlice';
import {AppDispatch, RootState} from '../store/store';
import {NavigationProps} from '../helpers/navigationTypes';

const MainStack = createNativeStackNavigator();

export const AppNavigator = (): JSX.Element => {
  const isDarkTheme = useSelector((state: RootState) => state.auth.theme);
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch<AppDispatch>(); // Типізуємо dispatch
  const navigation = useNavigation<NavigationProps<'AppNavigator'>>();

  const handleGetProfile = async (): Promise<void> => {
    try {
      const resultAction = await dispatch(getProfileThunk());
      if (getProfileThunk.fulfilled.match(resultAction)) {
        navigation.navigate('Home');
      }
      return;
    } catch (error: any) {
      console.log(error);
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

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGoHome = () => {
    Alert.alert(
      'Попередження',
      'Якщо ви вийдете, ваш прогрес буде втрачено. Ви впевнені, що хочете вийти?',
      [
        {
          text: 'Залишитись',
          onPress: () => console.log('Залишаємося на ст'),
          style: 'cancel',
        },
        {
          text: 'Вийти',
          onPress: () => navigation.navigate('Home'),
          style: 'destructive',
        },
      ],
    );
  };
  const toggleTheme = async () => {
    const newTheme = !isDarkTheme; // Інвертуємо булеве значення теми

    try {
      // Зберігаємо нову тему як рядок (булеве значення) в AsyncStorage
      await AsyncStorage.setItem('theme', JSON.stringify(newTheme)); // Replaced SecureStore with AsyncStorage
      // Оновлюємо тему в Redux-стані
      dispatch(setTheme(newTheme));
    } catch (error: any) {
      console.error('Failed to update theme:', error);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Registration"
        component={Components.Registration}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Login"
        component={Components.Login}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Home"
        component={Screens.Home}
        options={({navigation}) => ({
          headerTitle: () => null, // Приховуємо текст заголовка
          title: undefined,
          headerStyle: {
            backgroundColor: isDarkTheme ? '#67104c' : 'white',
          },
          headerShadowVisible: false,
          headerTintColor: isDarkTheme ? 'white' : '#67104c',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                changeLanguage(i18n.language === 'en' ? 'uk' : 'en')
              }>
              <MaterialIcons
                name="language"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <AntDesign
                name="setting"
                size={30}
                color={isDarkTheme ? 'white' : '#67104c'}
                style={{marginRight: 5}}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </MainStack.Navigator>
    //   <MainStack.Screen
    //     name="Profile"
    //     component={Screens.Profile}
    //     options={({ navigation }) => ({
    //       headerTitle: () => (
    //         <View style={[styles.headerContainer, { paddingRight: 20 }]}>
    //           <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    //             <Icon
    //               name="arrowleft"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //             />
    //           </TouchableOpacity>
    //           <TouchableOpacity
    //             onPress={() =>
    //               changeLanguage(i18n.language === "en" ? "uk" : "en")
    //             }
    //           >
    //             <MaterialIcons
    //               name="language"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //             />
    //           </TouchableOpacity>

    //           <TouchableOpacity onPress={toggleTheme}>
    //             <MaterialIcons
    //               name="light-mode"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //             />
    //           </TouchableOpacity>
    //           <TouchableOpacity onPress={handleLogout}>
    //             <Ionicons
    //               name="log-out"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //             />
    //           </TouchableOpacity>
    //         </View>
    //       ),
    //       headerStyle: {
    //         backgroundColor: isDarkTheme ? "#67104c" : "white",
    //       },
    //       headerShadowVisible: false,
    //       headerBackVisible: false,
    //       headerLeft: () => null,
    //     })}
    //   />
    //   <MainStack.Screen
    //     name="StudyAndTrain"
    //     component={Components.StudyAndTrain}
    //     options={({ navigation }) => ({
    //       title: ` ${t("LAT.lat")}`,
    //       headerTitleAlign: "center",
    //       headerStyle: {
    //         backgroundColor: isDarkTheme ? "#67104c" : "white",
    //       },
    //       headerShadowVisible: false,
    //       headerTintColor: isDarkTheme ? "white" : "#67104c",
    //       headerLeft: () => (
    //         <TouchableOpacity onPress={() => navigation.goBack()}>
    //           <Icon
    //             name="arrowleft"
    //             size={30}
    //             color={isDarkTheme ? "white" : "#67104c"}
    //             style={{ marginLeft: 5 }}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     })}
    //   />
    //   <MainStack.Screen
    //     name="LessonsBySubscription"
    //     component={Components.LessonsBySubscription}
    //     options={{ headerShown: false }}
    //   />
    //   <MainStack.Screen
    //     name="Vocab"
    //     component={Components.Vocab}
    //     options={({ navigation }) => ({
    //       title: ` ${t("LAT.vocab")}`,
    //       headerTitleAlign: "center",
    //       headerStyle: {
    //         backgroundColor: isDarkTheme ? "#67104c" : "white",
    //       },
    //       headerShadowVisible: false,
    //       headerTintColor: isDarkTheme ? "white" : "#67104c",
    //       headerLeft: () => (
    //         <TouchableOpacity onPress={() => navigation.goBack()}>
    //           <Icon
    //             name="arrowleft"
    //             size={30}
    //             color={isDarkTheme ? "white" : "#67104c"}
    //             style={{ marginLeft: 5 }}
    //           />
    //         </TouchableOpacity>
    //       ),
    //       headerRight: () => (
    //         <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    //           <Icon
    //             name="home"
    //             size={30}
    //             color={isDarkTheme ? "white" : "#67104c"}
    //             style={{ marginLeft: 5 }}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     })}
    //   />
    //   <MainStack.Screen
    //     name="ForgotPassword"
    //     component={Components.ForgotPassword}
    //     options={{ headerShown: false }}
    //   />
    //   <MainStack.Screen
    //     name="Support"
    //     component={Components.Support}
    //     options={{ headerShown: false }}
    //   />
    //   <MainStack.Screen
    //     name="Phonetic"
    //     component={Components.Phonetic}
    //     options={({ navigation }) => ({
    //       title: ` ${t("LAT.phonetic")}`,
    //       headerTitleAlign: "center",
    //       headerStyle: {
    //         backgroundColor: isDarkTheme ? "#67104c" : "white",
    //       },
    //       headerShadowVisible: false,
    //       headerTintColor: isDarkTheme ? "white" : "#67104c",
    //       headerLeft: () => (
    //         <TouchableOpacity onPress={() => navigation.goBack()}>
    //           <Icon
    //             name="arrowleft"
    //             size={30}
    //             color={isDarkTheme ? "white" : "#67104c"}
    //             style={{ marginLeft: 5 }}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     })}
    //   />
    //   <MainStack.Screen
    //     name="Verbs"
    //     component={Components.Verbs}
    //     options={({ navigation }) => ({
    //       title: ` ${t("LAT.verbs")}`,
    //       headerTitleAlign: "center",
    //       headerStyle: {
    //         backgroundColor: isDarkTheme ? "#67104c" : "white",
    //       },
    //       headerShadowVisible: false,
    //       headerTintColor: isDarkTheme ? "white" : "#67104c",
    //       headerLeft: () => (
    //         <TouchableOpacity onPress={() => navigation.goBack()}>
    //           <Icon
    //             name="arrowleft"
    //             size={30}
    //             color={isDarkTheme ? "white" : "#67104c"}
    //             style={{ marginLeft: 5 }}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     })}
    //   />
    //   <MainStack.Screen
    //     name="LearnOrTrainTopic"
    //     component={Components.LearnOrTrainTopic}
    //     options={({ navigation, route }) => {
    //       const topicName = route.params?.topicName ?? "";
    //       return {
    //         title: topicName,
    //         headerTitleAlign: "center",
    //         headerStyle: {
    //           backgroundColor: isDarkTheme ? "#67104c" : "white",
    //         },
    //         headerShadowVisible: false,
    //         headerTintColor: isDarkTheme ? "white" : "#67104c",
    //         headerLeft: () => (
    //           <TouchableOpacity onPress={() => navigation.goBack()}>
    //             <Icon
    //               name="arrowleft"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //         headerRight: () => (
    //           <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    //             <Icon
    //               name="home"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //       };
    //     }}
    //   />
    //   <MainStack.Screen
    //     name="Learn"
    //     component={Components.Learn}
    //     options={({ navigation, route }) => {
    //       const { topicName } = route.params;
    //       return {
    //         title: topicName,
    //         headerTitleAlign: "center",
    //         headerStyle: {
    //           backgroundColor: isDarkTheme ? "#67104c" : "white",
    //         },
    //         headerShadowVisible: false,
    //         headerTintColor: isDarkTheme ? "white" : "#67104c",
    //         headerLeft: () => (
    //           <TouchableOpacity
    //             onPress={() =>
    //               navigation.navigate("LearnOrTrainTopic", { topicName })
    //             }
    //           >
    //             <Icon
    //               name="arrowleft"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //         headerRight: () => (
    //           <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    //             <Icon
    //               name="home"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //       };
    //     }}
    //   />
    //   <MainStack.Screen
    //     name="Train"
    //     component={Components.Train}
    //     options={({ navigation, route }) => {
    //       const topicName = route.params?.topicName ?? "";
    //       return {
    //         title: topicName,
    //         headerTitleAlign: "center",
    //         headerStyle: {
    //           backgroundColor: isDarkTheme ? "#67104c" : "white",
    //         },
    //         headerShadowVisible: false,
    //         headerTintColor: isDarkTheme ? "white" : "#67104c",
    //         headerLeft: () => (
    //           <TouchableOpacity
    //             onPress={() =>
    //               navigation.navigate("LearnOrTrainTopic", { topicName })
    //             }
    //           >
    //             <Icon
    //               name="arrowleft"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //         headerRight: () => (
    //           <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    //             <Icon
    //               name="home"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //       };
    //     }}
    //   />
    //   <MainStack.Screen
    //     name="WordLearningScreen"
    //     component={Components.WordLearningScreen}
    //     options={{ headerShown: false }}
    //   />
    //   <MainStack.Screen
    //     name="TrainingLevel"
    //     component={Components.TrainingLevel}
    //     options={({ route }) => {
    //       const { topicName } = route.params;
    //       return {
    //         title: topicName,
    //         headerTitleAlign: "center",
    //         headerStyle: {
    //           backgroundColor: isDarkTheme ? "#67104c" : "white",
    //         },
    //         headerShadowVisible: false,
    //         headerTintColor: isDarkTheme ? "white" : "#67104c",
    //         headerBackVisible: false,
    //         headerLeft: () => null,
    //         headerRight: () => (
    //           <TouchableOpacity onPress={handleGoHome}>
    //             <Icon
    //               name="home"
    //               size={30}
    //               color={isDarkTheme ? "white" : "#67104c"}
    //               style={{ marginLeft: 5 }}
    //             />
    //           </TouchableOpacity>
    //         ),
    //       };
    //     }}
    //   />
    // </MainStack.Navigator>
  );
};

// Стилі для лоадера
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
});
