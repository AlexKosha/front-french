import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTopic} from '../store/topic/topicThunk';
import {selectTopic} from '../store/topic/selectors';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {AppDispatch} from '../store/store';
import {useTranslationHelper} from '../locale/useTranslation';

export const StudyAndTrain = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const topicsData = useSelector(selectTopic);
  const navigation = useNavigation<NavigationProps<'StudyAndTrain'>>();
  const dispatch = useDispatch<AppDispatch>();

  const {phonetic, vocab, verbs} = useTranslationHelper();

  const handleGetTheme = async () => {
    try {
      if (topicsData && topicsData.length > 0) {
        navigation.navigate('Vocab');
        return;
      }

      const resultAction = await dispatch(getTopic());
      if (getTopic.fulfilled.match(resultAction)) {
        navigation.navigate('Vocab');
      }
      return;
    } catch (error) {
      console.log(error);
    }
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
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => handleGetTheme()}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {vocab}
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('Phonetic')}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {phonetic}
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('Verbs')}>
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
