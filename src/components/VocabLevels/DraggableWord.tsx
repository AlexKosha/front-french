import React from 'react';
import {Text, StyleSheet, UIManager} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import {findNodeHandle} from 'react-native';

type ContextType = {
  startX: number;
  startY: number;
};

type DraggableWordProps = {
  word: {id: string; text: string};
  draggingWordId: string | null;
  setDraggingWordId: (id: string | null) => void;
  // Тут типізуємо з Map, а не Record
  wordRefs: React.MutableRefObject<Map<string, any>>;
  swapWords: (id1: string, id2: string) => void;
  detectDropArea: (x: number, y: number) => string | null;
  resetPosition: boolean;
  checkCollision: (x: number, y: number) => void;
};

export const DraggableWord: React.FC<DraggableWordProps> = ({
  word,
  draggingWordId,
  setDraggingWordId,
  wordRefs,
  swapWords,
  detectDropArea,
  resetPosition,
  checkCollision,
}) => {
  console.log('DraggableWord render:', word.id);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleDropDetection = () => {
    const handle = wordRefs.current.get(word.id);
    if (!handle) return;

    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      const centerX = pageX + width / 2;
      const centerY = pageY + height / 2;

      const droppedId = detectDropArea(centerX, centerY);
      if (droppedId && droppedId !== word.id) {
        swapWords(word.id, droppedId);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });
  };

  React.useEffect(() => {
    if (resetPosition) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  }, [resetPosition]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;

      runOnJS(checkCollision)(event.absoluteX, event.absoluteY);
    },

    onEnd: () => {
      if (typeof handleDropDetection === 'function') {
        runOnJS(setDraggingWordId)(null);
        runOnJS(handleDropDetection)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
    zIndex: draggingWordId === word.id ? 100 : 1,
  }));

  const setRef = (ref: any) => {
    console.log('setRef called with ref:', ref);
    if (ref) {
      const nodeHandle = findNodeHandle(ref);
      console.log('nodeHandle:', nodeHandle);
      if (nodeHandle) {
        wordRefs.current.set(word.id, nodeHandle);
        console.log('wordRefs.current:', wordRefs.current);
        console.log('Is Map?', wordRefs.current instanceof Map);
      }
    } else {
      wordRefs.current.delete(word.id);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View ref={setRef} style={[styles.wordBox, animatedStyle]}>
        <Text style={styles.word}>{word.text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  wordBox: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  word: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
