import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';

import {LevelComponent} from '../Vocabulary/LevelComponent';
import {selectTheme} from '../../store/auth/selector';
import {LevelProps, WordItem} from '../../types';

const SecondLevel: React.FC<LevelProps> = ({level, progress, titleName}) => {
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

  const renderChoices = (
    choices: WordItem[],
    handleChoice: (item: WordItem) => void,
    selectedId: string | null,
    isCorrect: boolean | null,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
      }}>
      {choices.map((choice: WordItem) => {
        const isSelected = choice._id === selectedId;
        let borderColor = isDarkTheme ? '#67104c' : 'white';

        if (isSelected && isCorrect === true) borderColor = '#4CAF50'; // ✅ зелений
        if (isSelected && isCorrect === false) borderColor = '#f44336'; // ❌ червоний

        return (
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
              borderWidth: 5,
              borderColor,
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

export default SecondLevel;
