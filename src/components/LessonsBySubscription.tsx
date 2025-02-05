import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../helpers/navigationTypes';

export const LessonsBySubscription = (): JSX.Element => {
  const navigation = useNavigation<NavigationProps<'LessonsBySubscription'>>();
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text>LessonsBySubscription</Text>
      </View>
    </SafeAreaView>
  );
};
