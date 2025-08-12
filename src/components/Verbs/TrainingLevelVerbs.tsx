import React, {lazy, Suspense} from 'react';
import {useRoute} from '@react-navigation/native';
import {ActivityIndicator, Text, View} from 'react-native';
import {RouteProps} from '../../types';

const FirstLevel = lazy(() => import('../VerbsLevels/FirstLevel'));
const SecondLevel = lazy(() => import('../VerbsLevels/SecondLevel'));
const ThirdLevel = lazy(() => import('../VerbsLevels/ThirdLevel'));
const FourthLevel = lazy(() => import('../VerbsLevels/FourthLevel'));
const FifthLevel = lazy(() => import('../VerbsLevels/FifthLevel'));
const SixthLevel = lazy(() => import('../VerbsLevels/SixthLevel'));
const SeventhLevel = lazy(() => import('../VerbsLevels/SeventhLevel'));

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
      case 3:
        return (
          <ThirdLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      case 4:
        return (
          <FourthLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      case 5:
        return (
          <FifthLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      case 6:
        return (
          <SixthLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      case 7:
        return (
          <SeventhLevel
            level={level}
            titleName={titleName}
            selectedVerbs={selectedVerbs}
          />
        );
      default:
        return <Text>Невідомий рівень</Text>;
    }
  };

  return (
    <Suspense
      fallback={
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
          <Text>Завантаження рівня...</Text>
        </View>
      }>
      {renderLevel()}
    </Suspense>
  );
};
