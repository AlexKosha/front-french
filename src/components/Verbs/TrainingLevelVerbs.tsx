import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Text} from 'react-native';
import {RouteProps} from '../../types';
import {FirstLevel, FourthLevel, SecondLevel} from '../VerbsLevels';

export const TrainingLevelVerbs = () => {
  const route = useRoute<RouteProps<'TrainingLevelVerbs'>>();
  const {level, titleName, selectedVerbs} = route.params;

  const renderLevel = () => {
    switch (level) {
      case 1:
        return (
          <FirstLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      case 2:
        return (
          <SecondLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      //   case 3:
      //     return (
      //       <VerbLevel3
      //         level={level}
      //         titleName={titleName}
      //         selectedVerbs={selectedVerbs}
      //       />
      //     );
      case 4:
        return (
          <FourthLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      //   case 5:
      //     return (
      //       <VerbLevel5
      //         level={level}
      //         titleName={titleName}
      //         selectedVerbs={selectedVerbs}
      //       />
      //     );
      //   case 6:
      //     return (
      //       <VerbLevel6
      //         level={level}
      //         titleName={titleName}
      //         selectedVerbs={selectedVerbs}
      //       />
      //     );
      //   case 7:
      //     return (
      //       <VerbLevel7
      //         level={level}
      //         titleName={titleName}
      //         selectedVerbs={selectedVerbs}
      //       />
      //     );
      default:
        return <Text>Невідомий рівень</Text>;
    }
  };

  return <>{renderLevel()}</>;
};
