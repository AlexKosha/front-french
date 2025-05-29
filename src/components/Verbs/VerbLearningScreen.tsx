import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {defaultStyles} from '../defaultStyles';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {Conjugation, RouteProps} from '../../types';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTTS} from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VerbLearningScreen = () => {
  const route = useRoute<RouteProps<'VerbLearningScreen'>>();
  const {titleName, verbs} = route.params;
  const isDarkTheme = useSelector(selectTheme);
  const [isLearned, setIsLearned] = useState(false);

  const {speak} = useTTS();

  const playSound = (pronoun: string, form: string) => {
    if (pronoun && form) {
      const combinedText = `${pronoun} ${form}`;
      speak(combinedText);
    }
  };

  const markVerbAsLearned = async (infinitive: any, tense: any) => {
    const raw = await AsyncStorage.getItem('learnedVerbs');
    const parsed = raw ? JSON.parse(raw) : [];

    const verb = parsed.find((v: any) => v.infinitive === infinitive);

    if (verb) {
      const alreadyLearned = verb.tenses.find((t: any) => t.name === tense);
      if (!alreadyLearned) {
        verb.tenses.push({name: tense, learnedAt: new Date().toISOString()});
      }
    } else {
      parsed.push({
        infinitive,
        tenses: [{name: tense, learnedAt: new Date().toISOString()}],
      });
    }

    await AsyncStorage.setItem('learnedVerbs', JSON.stringify(parsed));
  };

  useEffect(() => {
    checkLearnedStatus();
  }, []);

  const checkLearnedStatus = async () => {
    const raw = await AsyncStorage.getItem('learnedVerbs');
    const parsed = raw ? JSON.parse(raw) : [];
    const verb = parsed.find((v: any) => v.infinitive === verbs.infinitive);
    const learned = verb?.tenses?.some((t: any) => t.name === titleName);
    setIsLearned(!!learned);
  };

  const handleLearnVerb = async () => {
    await markVerbAsLearned(verbs.infinitive, titleName);
    setIsLearned(true);
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
        {verbs.conjugations.map((count: Conjugation) => (
          <View
            key={count._id}
            style={[
              defaultStyles.button,

              {
                backgroundColor: isDarkTheme ? 'white' : '#67104c',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              },
            ]}>
            <Icon
              onPress={() => playSound(count.pronoun, count.form)}
              name="sound"
              size={20}
              color={isDarkTheme ? '#67104c' : 'white'}
            />

            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              {count.pronoun}
            </Text>
            <Text
              style={[
                defaultStyles.btnText,
                {
                  color: isDarkTheme ? '#67104c' : 'white',
                },
              ]}>
              {count.form}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};
