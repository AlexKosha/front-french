import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Text} from 'react-native';
import {RouteProps} from '../types/navigationTypes';
import {FirstLevel} from './FirstLevel';
import {SecondLevel} from './SecondLevel';
import {ThirdLevel} from './ThirdLevel';
import {FourthLevel} from './FourtLevel';
import {FifthLevel} from './FifthLevel';
import {SixthLevel} from './SixthLevel';
import {SeventhLevel} from './SeventhLevel';

export const TrainingLevel = () => {
  const route = useRoute<RouteProps<'TrainingLevel'>>();
  const {level, topicName, progress} = route.params;

  const renderLevelComponent = () => {
    switch (level) {
      case 1:
        return (
          <FirstLevel level={level} progress={progress} topicName={topicName} />
        );
      case 2:
        return (
          <SecondLevel
            level={level}
            progress={progress}
            topicName={topicName}
          />
        );
      case 3:
        return (
          <ThirdLevel level={level} progress={progress} topicName={topicName} />
        );
      case 4:
        return (
          <FourthLevel
            level={level}
            progress={progress}
            topicName={topicName}
          />
        );
      case 5:
        return (
          <FifthLevel level={level} progress={progress} topicName={topicName} />
        );
      case 6:
        return (
          <SixthLevel level={level} progress={progress} topicName={topicName} />
        );
      case 7:
        return (
          <SeventhLevel
            level={level}
            progress={progress}
            topicName={topicName}
          />
        );
      default:
        return <Text>Невідомий рівень</Text>;
    }
  };

  return <>{renderLevelComponent()}</>;
};
