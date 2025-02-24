import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, View, SafeAreaView, Text} from 'react-native';
import {NavigationProps} from '../helpers/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';
import {defaultStyles} from './defaultStyles';
import {Logo} from './Logo';

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
          {/* <TouchableOpacity onPress={changeLanguageHandler}>
            <MaterialIcons name="language" size={26} color="#67104c" />
          </TouchableOpacity> */}
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
