import React from 'react';
import {useSelector} from 'react-redux';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {LevelComponent} from '../Vocabulary/LevelComponent';
import {selectTheme} from '../../store/auth/selector';
import {LevelProps, WordItem} from '../../types';

// треба забрати озвучку після самого першого натискання на слово.

const ThirdLevel: React.FC<LevelProps> = ({level, progress, titleName}) => {
  const isDarkTheme = useSelector(selectTheme);

  const renderContent = (
    world: WordItem,
    playText: () => void,
    isPlaying?: boolean,
  ) => (
    <View style={{marginTop: 50, alignItems: 'center'}}>
      <TouchableOpacity onPress={playText} disabled={isPlaying}>
        <Icon
          name="sound"
          size={40}
          color={isPlaying ? 'gray' : isDarkTheme ? 'white' : '#67104c'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderChoices = (
    choices: WordItem[],
    handleChoice: (item: WordItem) => void,
    selectedId: string | null,
    isCorrect: boolean | null,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexWrap: 'wrap',
      }}>
      {choices.map((choice: WordItem) => {
        const isSelected = choice._id === selectedId;
        let borderColor = isDarkTheme ? '#67104c' : 'white';

        if (isSelected && isCorrect === true) borderColor = '#4CAF50'; // зелений
        if (isSelected && isCorrect === false) borderColor = '#f44336'; // червоний

        return (
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
              borderWidth: 5,
              borderColor,
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
        );
      })}
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

export default ThirdLevel;
