import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View, SafeAreaView, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {NavigationProps} from '../types/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';
import {Logo} from './Logo';
import {defaultStyles} from './defaultStyles';

export const Support = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'Support'>>();

  const {support} = useTranslationHelper();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={defaultStyles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <AntDesign name="arrowleft" size={24} color="#67104c" />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: 22}}>
          <Text
            style={{
              fontSize: 16,
              marginVertical: 12,
              color: 'black',
            }}>
            {support}
          </Text>
        </View>
      </View>
      <Logo isThemePage={true} />
    </SafeAreaView>
  );
};
