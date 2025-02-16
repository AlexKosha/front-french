import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';

export const Verbs = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'Verbs'>>();

  const {verbs} = useTranslationHelper();

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
            {verbs}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
