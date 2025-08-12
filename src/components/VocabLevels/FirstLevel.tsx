import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {LevelComponent} from '../Vocabulary/LevelComponent';
import {useSelector} from 'react-redux';
import {selectTheme} from '../../store/auth/selector';
import {LevelProps, WordItem} from '../../types';

const FirstLevel: React.FC<LevelProps> = ({level, progress, titleName}) => {
  const isDarkTheme = useSelector(selectTheme);
  const renderContent = (currentItem: WordItem, playText: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <Text
          style={{
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            color: isDarkTheme ? 'white' : '#67104c',
          }}>
          {currentItem?.world}
        </Text>
        <TouchableOpacity onPress={playText}>
          <Icon
            name="sound"
            size={30}
            color={isDarkTheme ? 'white' : '#67104c'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderChoices = (
    choices: WordItem[],
    handleChoice: any,
    selectedId: string | null,
    isCorrect: boolean | null,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      {choices.map((choice: WordItem) => {
        let borderColor = isDarkTheme ? 'white' : '#67104c';
        if (selectedId === choice._id) {
          borderColor = isCorrect ? '#4CAF50' : '#f44336';
        }

        return (
          <TouchableOpacity
            key={choice._id}
            onPress={() => handleChoice(choice)}
            style={{
              width: 140,
              height: 140,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
            }}>
            <Image
              source={{uri: choice.image}}
              style={{
                width: 140,
                height: 140,
                borderRadius: 10,
                borderWidth: 5,
                borderColor,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // const renderChoices = (choices: WordItem[], handleChoice: any) => (
  //   <View
  //     style={{
  //       flexDirection: 'row',
  //       flexWrap: 'wrap',
  //       justifyContent: 'space-around',
  //       alignItems: 'center',
  //     }}>
  //     {choices.map((choice: WordItem) => (
  //       <TouchableOpacity
  //         key={choice._id}
  //         onPress={() => handleChoice(choice)}
  //         style={{
  //           width: 140,
  //           height: 140,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           margin: 10,
  //         }}>
  //         <Image
  //           source={{uri: choice.image}}
  //           style={{
  //             width: 140,
  //             height: 140,
  //             borderRadius: 10,
  //             borderWidth: 2,
  //             borderColor: isDarkTheme ? 'white' : '#67104c',
  //           }}
  //         />
  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // );

  return (
    <LevelComponent
      level={level}
      progress={progress}
      titleName={titleName}
      renderContent={renderContent}
      renderChoices={renderChoices}
    />
  );
};

export default FirstLevel;
