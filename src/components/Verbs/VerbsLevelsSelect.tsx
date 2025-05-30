import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity, Text, View, Alert} from 'react-native';
import {Logo} from '../User/Logo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {NavigationProps, RouteProps} from '../../types';
import {defaultStyles} from '../defaultStyles';

export const VerbsLevelsSelect = () => {
  const navigation = useNavigation<NavigationProps<'VerbsLevelsSelect'>>();
  const route = useRoute<RouteProps<'VerbsLevelsSelect'>>();
  const {titleName, selectedVerbs} = route.params;
  const [completedLevels] = useState<number[]>([]);
  const isDarkTheme = useSelector(selectTheme);

  // Обробка переходу до рівнів
  const handlePress = (level: number) => {
    if (!titleName) {
      console.error('titleName is undefined');
      return;
    }

    if (!selectedVerbs || selectedVerbs.length === 0) {
      Alert.alert('Помилка', 'Слова не передані');
      return;
    }

    navigation.navigate('TrainingLevelVerbs', {
      level,
      titleName,
      selectedVerbs,
    });
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View style={defaultStyles.btnContainer}>
        {[1, 2, 3, 4, 5, 6, 7].map(level => (
          <TouchableOpacity
            key={level}
            style={[
              defaultStyles.button,
              {
                backgroundColor: isDarkTheme ? 'white' : '#67104c',
                opacity: completedLevels.includes(level) ? 0.5 : 1,
              },
            ]}
            onPress={() => handlePress(level)}
            disabled={completedLevels.includes(level)}>
            <Text
              style={[
                defaultStyles.btnText,
                {color: isDarkTheme ? '#67104c' : 'white'},
              ]}>
              Level {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Logo />
    </SafeAreaView>
  );
};
