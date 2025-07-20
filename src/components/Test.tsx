import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const BUTTON_HEIGHT = 60;
const BUTTON_MARGIN = 10;

type Item = {
  id: string;
  label: string;
};

export const Test = () => {
  const [items, setItems] = useState<Item[]>([
    {id: '1', label: 'Vocab'},
    {id: '2', label: 'Verbs'},
  ]);

  const positions = items.map((_, i) =>
    useSharedValue(i * (BUTTON_HEIGHT + BUTTON_MARGIN)),
  );
  const draggingIndex = useSharedValue<number | null>(null);

  const swapItems = (fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const movedItem = newItems.splice(fromIndex, 1)[0];
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  };

  const createGesture = (index: number) => {
    return Gesture.Pan()
      .onBegin(() => {
        draggingIndex.value = index;
      })
      .onUpdate(e => {
        positions[index].value =
          e.translationY + index * (BUTTON_HEIGHT + BUTTON_MARGIN);

        const newIndex = Math.floor(
          (positions[index].value + BUTTON_HEIGHT / 2) /
            (BUTTON_HEIGHT + BUTTON_MARGIN),
        );

        if (newIndex !== index && newIndex >= 0 && newIndex < items.length) {
          runOnJS(swapItems)(index, newIndex);
          draggingIndex.value = newIndex;
        }
      })
      .onEnd(() => {
        if (draggingIndex.value !== null) {
          positions[draggingIndex.value].value = withSpring(
            draggingIndex.value * (BUTTON_HEIGHT + BUTTON_MARGIN),
          );
          draggingIndex.value = null;
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {items.map((item, index) => {
        const gesture = createGesture(index);

        const animatedStyle = useAnimatedStyle(() => ({
          position: 'absolute',
          left: 20,
          right: 20,
          height: BUTTON_HEIGHT,
          transform: [{translateY: positions[index].value}],
          zIndex: draggingIndex.value === index ? 100 : 0,
          shadowOpacity: draggingIndex.value === index ? 0.25 : 0,
          shadowRadius: draggingIndex.value === index ? 10 : 0,
        }));

        return (
          <GestureDetector key={item.id} gesture={gesture}>
            <Animated.View style={[styles.button, animatedStyle]}>
              <Text style={styles.buttonText}>{item.label}</Text>
            </Animated.View>
          </GestureDetector>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 100},
  button: {
    backgroundColor: '#67104c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: BUTTON_MARGIN / 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
  },
  buttonText: {color: 'white', fontSize: 18},
});
