import React, {lazy, Suspense} from 'react';
import {useRoute} from '@react-navigation/native';
import {Text, View, ActivityIndicator} from 'react-native';
import {RouteProps} from '../../types/navigationTypes';

// Lazy imports
const FirstLevel = lazy(() => import('../VocabLevels/FirstLevel'));
const SecondLevel = lazy(() => import('../VocabLevels/SecondLevel'));
const ThirdLevel = lazy(() => import('../VocabLevels/ThirdLevel'));
const FourthLevel = lazy(() => import('../VocabLevels/FourtLevel'));
const FifthLevel = lazy(() => import('../VocabLevels/FifthLevel'));
const SixthLevel = lazy(() => import('../VocabLevels/SixthLevel'));
const SeventhLevel = lazy(() => import('../VocabLevels/SeventhLevel'));

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

  return (
    <Suspense
      fallback={
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
          <Text>Завантаження рівня...</Text>
        </View>
      }>
      {renderLevelComponent()}
    </Suspense>
  );
};
