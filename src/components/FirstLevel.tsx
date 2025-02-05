import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
// import Icon from 'react-native-vector-icons/AntDesign';
import {LevelComponent} from './LevelComponent';

export interface LevelProps {
  level: number;
  progress: any[]; // Або конкретний тип даних, якщо знаєте його структуру
  topicName: string;
}

export const FirstLevel: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
}) => {
  const renderContent = (currentItem: any) => (
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
          color: '#000', // Тут можна додати підтримку теми через пропси, якщо потрібно
        }}>
        {currentItem?.world}
      </Text>
      {/* <TouchableOpacity onPress={playSound}>
        <Icon name="sound" size={30} color="#000" />
      </TouchableOpacity> */}
    </View>
  );

  const renderChoices = (
    choices: any,
    handleChoice: any,
    isDarkTheme: boolean,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      {choices.map((choice: any) => (
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
              borderWidth: 2,
              borderColor: isDarkTheme ? 'white' : '#67104c',
            }}
          />
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
