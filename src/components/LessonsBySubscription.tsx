import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../types/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';
import {defaultStyles} from './defaultStyles';

export const LessonsBySubscription = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Phonetic'>>();
  const isDarkTheme = useSelector(selectTheme);

  const {lessonsBySubscr} = useTranslationHelper();

  return (
    <SafeAreaView
      style={[
        defaultStyles.container,
        {backgroundColor: isDarkTheme ? '#67104c' : 'white'},
      ]}>
      <View style={defaultStyles.btnContainer}>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('StudyAndTrain')}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {lessonsBySubscr}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
