import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps, RouteProps} from '../helpers/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';

export const LearnOrTrainTopic = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'LearnOrTrainTopic'>>();
  const route = useRoute<RouteProps<'LearnOrTrainTopic'>>();
  const {topicName} = route.params;

  const {learn, train} = useTranslationHelper();

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
          },
        ]}>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('Learn', {topicName})}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {learn}
          </Text>
        </Pressable>
        <Pressable
          style={[
            defaultStyles.button,
            {backgroundColor: isDarkTheme ? 'white' : '#67104c'},
          ]}
          onPress={() => navigation.navigate('Train', {topicName})}>
          <Text
            style={[
              defaultStyles.btnText,
              {
                color: isDarkTheme ? '#67104c' : 'white',
              },
            ]}>
            {train}
          </Text>
        </Pressable>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={
            isDarkTheme
              ? require('../images/logo-dark.jpg')
              : require('../images/logo.jpg')
          }
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -70}],
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 60,
    resizeMode: 'contain',
  },
});
