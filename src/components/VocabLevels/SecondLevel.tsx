import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import {LevelComponent} from '../Vocabulary/LevelComponent';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {LevelProps, WordItem} from '../../types';

export const SecondLevel: React.FC<LevelProps> = ({
  level,
  progress,
  titleName,
}) => {
  const isDarkTheme = useSelector(selectTheme);
  const renderContent = (currentImage: WordItem) => (
    <View style={{alignItems: 'center', marginVertical: 20}}>
      {currentImage && (
        <Image
          source={{uri: currentImage.image}}
          style={{width: 200, height: 200, borderRadius: 10}}
        />
      )}
    </View>
  );

  const renderChoices = (choices: WordItem[], handleChoice: any) => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
      }}>
      {choices.map((choice: WordItem) => (
        <TouchableOpacity
          key={choice._id}
          onPress={() => handleChoice(choice)}
          style={{
            backgroundColor: isDarkTheme ? 'white' : '#67104c',
            padding: 15,
            margin: 10,
            borderRadius: 10,
            width: '40%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isDarkTheme ? '#67104c' : 'white',
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
      titleName={titleName}
      renderChoices={renderChoices}
      renderContent={renderContent}
    />
  );
};
