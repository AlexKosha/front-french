// import React from 'react';
// import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {useNavigation} from '@react-navigation/native';
// import {NavigationProps} from '../helpers/navigationTypes';

// export const LessonsBySubscription = (): JSX.Element => {
//   const navigation = useNavigation<NavigationProps<'LessonsBySubscription'>>();
//   return (
//     <SafeAreaView>
//       <View>
//         <TouchableOpacity onPress={() => navigation.navigate('Home')}>
//           <AntDesign name="arrowleft" size={24} color="black" />
//         </TouchableOpacity>
//         <Text>LessonsBySubscription</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {defaultStyles} from './defaultStyles';
import {selectTheme} from '../store/auth/selector';
import {NavigationProps} from '../helpers/navigationTypes';
import {useTranslationHelper} from '../locale/useTranslation';

export const LessonsBySubscription = (): JSX.Element => {
  const isDarkTheme = useSelector(selectTheme);
  const navigation = useNavigation<NavigationProps<'Phonetic'>>();

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
