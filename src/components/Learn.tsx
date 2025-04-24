import {useNavigation, useRoute} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {selectVocab} from '../store/vocab/selectors';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../types/navigationTypes';
import {useLocalization} from '../locale/LocalizationContext';
import {useTranslationHelper} from '../locale/useTranslation';
import {translations} from '../locale/translations';
import {Logo} from './Logo';
import {defaultStyles} from './defaultStyles';

export const Learn = () => {
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const route = useRoute<RouteProps<'Learn'>>();
  const navigation = useNavigation<NavigationProps<'Learn'>>();
  const {titleName} = route.params;

  const isDarkTheme = useSelector(selectTheme);
  const vocabData = useSelector(selectVocab);

  const {locale} = useLocalization();
  const {completedWords, words} = useTranslationHelper();

  // Використовуємо useFocusEffect для оновлення при кожному поверненні на цей екран
  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(`progress_${titleName}`);
          const storegeProgress =
            jsonValue != null ? JSON.parse(jsonValue) : [];
          if (Array.isArray(storegeProgress)) {
            setProgress(storegeProgress.length); // Записуємо довжину масиву прогресу
          }
        } catch (error) {
          console.error('Error fetching progress from storage:', error);
        }
      };

      fetchProgress();
    }, [titleName]),
  );

  // Обробка вибору кількості слів
  const handlePress = (count: number, wordItem = null) => {
    navigation.navigate('WordLearningScreen', {
      count,
      titleName: titleName ?? '',
      wordItem,
    });
  };

  const deleteStore = async () => {
    try {
      await AsyncStorage.removeItem(`progress_${titleName}`);
      setProgress(0);
      console.log(`Progress for topic ${titleName} has been deleted.`);
    } catch (error) {
      console.error('Error removing progress from storage:', error);
    }
  };

  const filteredVocabData = vocabData.filter(item => {
    const searchText = searchQuery.trim().toLowerCase();
    const wordText = item.world.toLowerCase();
    const translationText =
      locale === 'uk'
        ? item.translationUK.toLowerCase()
        : item.translationEN.toLowerCase();

    return (
      wordText.includes(searchText) || translationText.includes(searchText)
    );
  });

  const renderTopicsItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={[
          defaultStyles.button,
          {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
        ]}
        onPress={() => handlePress(1, item)}>
        <Text
          style={[
            defaultStyles.btnText,
            {
              color: isDarkTheme ? '#67104c' : 'white',
            },
          ]}>
          {item.world} /{' '}
          {locale === 'uk' ? item.translationUK : item.translationEN}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      {progress >= vocabData.length ? (
        <View style={defaultStyles.btnContainer}>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 20,
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {progress}/{vocabData.length} {completedWords}
          </Text>
          <TouchableOpacity
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={deleteStore}>
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              StoreDelete
            </Text>
          </TouchableOpacity>
          <TextInput
            style={{
              marginTop: 20,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              width: '90%',
              marginBottom: 20,
              color: isDarkTheme ? 'white' : '#67104c',
              backgroundColor: isDarkTheme ? '#67104c' : 'white',
            }}
            placeholder={translations.LAT.search[locale as 'en' | 'uk']}
            placeholderTextColor={isDarkTheme ? 'white' : '#67104c'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            style={{width: '100%'}}
            data={filteredVocabData}
            keyExtractor={(item: any) => item._id}
            renderItem={renderTopicsItem}
            contentContainerStyle={{alignItems: 'center', paddingBottom: 80}} // Центрує вміст
          />
        </View>
      ) : (
        // Choose 5,10,15 or 20 words
        <View
          style={[
            defaultStyles.btnContainer,
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 20,
              color: isDarkTheme ? 'white' : '#67104c',
            }}>
            {progress}/{vocabData.length} {completedWords}
          </Text>

          {[5, 10, 15, 20].map(count => (
            <TouchableOpacity
              key={count}
              style={[
                defaultStyles.button,
                {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
              ]}
              onPress={() => handlePress(count)}>
              <Text
                style={[
                  defaultStyles.btnText,
                  {
                    color: isDarkTheme ? '#67104c' : 'white',
                  },
                ]}>
                {count} {words}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Logo */}
      <Logo />
    </SafeAreaView>
  );
};
