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
  wordRefs: React.MutableRefObject<Map<string, number>>;
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
}) => {
  // Позиції по осях для анімації
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Функція визначення drop-зони після кінця перетягування
  const handleDropDetection = () => {
    const nodeHandle = wordRefs.current.get(word.id);
    if (!nodeHandle) return;

    UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
      const centerX = pageX + width / 2;
      const centerY = pageY + height / 2;

      const droppedId = detectDropArea(centerX, centerY);
      if (droppedId && droppedId !== word.id) {
        swapWords(word.id, droppedId);
      }

      // Повернути слово в початкову позицію анімацією
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });
  };

  // Скидання позиції при тригері resetPosition
  React.useEffect(() => {
    if (resetPosition) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  }, [resetPosition]);

  // Обробник жесту drag
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      runOnJS(setDraggingWordId)(word.id); // Встановити ID слова при початку драггінгу
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      runOnJS(setDraggingWordId)(null);
      runOnJS(handleDropDetection)();
    },
  });

  // Стиль з анімацією позиції і zIndex для видимості активного слова
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
    zIndex: draggingWordId === word.id ? 100 : 1,
  }));

  // Передача ref та збереження nodeHandle в словник
  const setRef = (ref: any) => {
    if (ref) {
      const nodeHandle = findNodeHandle(ref);
      if (nodeHandle) {
        wordRefs.current.set(word.id, nodeHandle);
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
