import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Text} from 'react-native';
import {RouteProps} from '../../types/navigationTypes';
import {
  FifthLevel,
  FirstLevel,
  FourthLevel,
  SecondLevel,
  SeventhLevel,
  SixthLevel,
  ThirdLevel,
} from '../VocabLevels';

export const TrainingLevel = () => {
  const route = useRoute<RouteProps<'TrainingLevel'>>();
  const {level, titleName, progress} = route.params;

  const renderLevelComponent = () => {
    switch (level) {
      case 1:
        return (
          <FirstLevel level={level} progress={progress} titleName={titleName} />
        );
      case 2:
        return (
          <SecondLevel
            level={level}
            progress={progress}
            titleName={titleName}
          />
        );
      case 3:
        return (
          <ThirdLevel level={level} progress={progress} titleName={titleName} />
        );
      case 4:
        return (
          <FourthLevel
            level={level}
            progress={progress}
            titleName={titleName}
          />
        );
      case 5:
        return (
          <FifthLevel level={level} progress={progress} titleName={titleName} />
        );
      case 6:
        return (
          <SixthLevel level={level} progress={progress} titleName={titleName} />
        );
      case 7:
        return (
          <SeventhLevel
            level={level}
            progress={progress}
            titleName={titleName}
          />
        );
      default:
        return <Text>Невідомий рівень</Text>;
    }
  };

  return <>{renderLevelComponent()}</>;
};
