import React from 'react';
import {useSelector} from 'react-redux';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {LevelComponent} from './LevelComponent';
import {selectTheme} from '../store/auth/selector';
import {LevelProps, WordItem} from '../types';

export const ThirdLevel: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
}) => {
  const isDarkTheme = useSelector(selectTheme);
  const renderContent = (world: WordItem, playText: any, isPlaying?: any) => {
    // console.log(playText);
    return (
      <View style={{marginTop: 50, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => playText()} disabled={isPlaying}>
          <Icon
            name="sound"
            size={40}
            color={isPlaying ? 'gray' : isDarkTheme ? 'white' : '#67104c'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderChoices = (choices: any, handleChoice: any) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexWrap: 'wrap',
      }}>
      {choices.map((choice: any) => (
        <TouchableOpacity
          key={choice._id}
          onPress={() => handleChoice(choice)}
          style={{
            backgroundColor: isDarkTheme ? 'white' : '#67104c',
            padding: 15,
            borderRadius: 10,
            margin: 10,
            width: '40%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: isDarkTheme ? '#67104c' : 'white',
              textAlign: 'center',
            }}>
            {choice.world}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LevelComponent
      level={level}
      progress={progress}
      topicName={topicName}
      renderChoices={renderChoices}
      renderContent={renderContent}
    />
  );
};
