import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {selectTheme} from '../store/auth/selector';
import React from 'react';

type RenderProgressProps = {
  totalCorrectAnswers: number;
};

export const RenderProgress: React.FC<RenderProgressProps> = ({
  totalCorrectAnswers,
}) => {
  const isDarkTheme = useSelector(selectTheme);
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      {[...Array(15)].map((_, i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor:
              i < totalCorrectAnswers
                ? isDarkTheme
                  ? 'white'
                  : '#67104c'
                : '#A9A9A9',
            margin: 3,
          }}
        />
      ))}
    </View>
  );
};
