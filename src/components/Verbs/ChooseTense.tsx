import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text, View, TouchableOpacity} from 'react-native';
import {NavigationProps, RouteProps} from '../../types';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {defaultStyles} from '../defaultStyles';
import {selectVerbs} from '../../store/verb/selectors';
import {useTranslationHelper} from '../../locale/useTranslation';
import {useLocalization} from '../../locale/LocalizationContext';

export const ChooseTense = (): JSX.Element => {
  const route = useRoute<RouteProps<'ChooseTense'>>();
  const navigation = useNavigation<NavigationProps<'ChooseTense'>>();
  const isDarkTheme = useSelector(selectTheme);
  const verbsData = useSelector(selectVerbs);
  const {chooseTense} = useTranslationHelper();
  const {locale} = useLocalization();

  const tenses = verbsData[0].tenses;

  const handlePress = (titleName: string) => {
    navigation.navigate('VerbsList', {titleName});
  };

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
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
          {chooseTense}
        </Text>

        {tenses.map(count => (
          <TouchableOpacity
            key={count._id}
            style={[
              defaultStyles.button,
              {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
            ]}
            onPress={() => handlePress(count.name)}>
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              {count.name} /{' '}
              {locale === 'uk' ? count.translationUA : count.translationEN}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};
