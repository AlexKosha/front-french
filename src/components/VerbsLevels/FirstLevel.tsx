import React from 'react';
import {Text, View} from 'react-native';

type Props = {
  level: number;
  titleName: string;
  selectedVerbs: any;
};

export const FirstLevel = ({level, titleName, selectedVerbs}: Props) => {
  return (
    <View>
      <Text>Hello first level</Text>;
    </View>
  );
};
