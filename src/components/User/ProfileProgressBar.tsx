import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ProfileProgressBarProps {
  croissants: number;
  maxCroissants: number;
  theme: boolean;
}

const ProfileProgressBar: React.FC<ProfileProgressBarProps> = ({
  croissants,
  maxCroissants,
  theme,
}) => {
  const progress = Math.min(croissants / maxCroissants, 1); // Від 0 до 1

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: theme ? 'white' : 'black'}]}>
        Круасани: {croissants}/{maxCroissants}
      </Text>
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: theme ? '#444' : '#ddd',
          },
        ]}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
              backgroundColor: theme ? 'white' : '#67104c',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProfileProgressBar;
