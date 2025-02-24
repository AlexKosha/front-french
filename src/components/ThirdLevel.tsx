import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {LevelComponent} from './LevelComponent';
import {LevelProps} from './FirstLevel';
import {WordItem} from './WordLearningScreen';

export const ThirdLevel: React.FC<LevelProps> = ({
  level,
  progress,
  topicName,
}) => {
  const renderContent = (
    _: WordItem,
    playSound?: any,
    isDarkTheme?: boolean,
    isPlaying?: any,
  ) => (
    <View style={{marginTop: 50, alignItems: 'center'}}>
      <TouchableOpacity onPress={playSound} disabled={isPlaying}>
        <Icon
          name="sound"
          size={40}
          color={isPlaying ? 'gray' : isDarkTheme ? 'white' : '#67104c'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderChoices = (
    choices: any,
    handleChoice: any,
    isDarkTheme: boolean,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        flexWrap: 'wrap',
      }}>
      {choices.map((choice: any) => (
        <TouchableOpacity
          key={choice._id}
          onPress={() => handleChoice(choice)}
          style={{
            backgroundColor: isDarkTheme ? 'white' : '#67104c',
            padding: 15,
            borderRadius: 10,
            margin: 10,
            width: '40%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: isDarkTheme ? '#67104c' : 'white',
              textAlign: 'center',
            }}>
            {choice.world}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LevelComponent
      level={level}
      progress={progress}
      topicName={topicName}
      renderChoices={renderChoices}
      renderContent={renderContent}
    />
  );
};
//   const [choices, setChoices] = useState([]);
//   const [currentWord, setCurrentWord] = useState(null);
//   const [wordStats, setWordStats] = useState([]);
//   const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [sound, setSound] = useState(null);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const isDarkTheme = useSelector((state) => state.auth.theme);

//   const setRandomWord = (stats) => {
//     const remainingWords = stats.filter((stat) => stat.correctCount < 3);
//     if (remainingWords.length === 0) {
//       alert("Congratulations! You completed all tasks.");
//       navigation.navigate("Train", { topicName });
//       return;
//     }
//     const randomWord =
//       remainingWords[Math.floor(Math.random() * remainingWords.length)];
//     setCurrentWord(randomWord.word);
//     generateChoices(randomWord.word);
//   };

//   const markCurrentWordsAsCompleted = async () => {
//     try {
//       const updatedProgress = progress.map((word) => {
//         if (wordStats.some((stat) => stat.word._id === word._id)) {
//           return {
//             ...word,
//             completed: word.completed.includes(level)
//               ? word.completed
//               : [...word.completed, level],
//           };
//         }
//         return word;
//       });

//       await AsyncStorage.setItem(
//         `progress_${topicName}`,
//         JSON.stringify(updatedProgress)
//       );
//     } catch (error) {
//       console.error("Помилка оновлення прогресу:", error);
//     }
//   };

//   const generateChoices = (correctWord) => {
//     const wrongChoices = [];
//     while (wrongChoices.length < 3) {
//       const randomIndex = Math.floor(Math.random() * progress.length);
//       const wrongChoice = progress[randomIndex];
//       if (
//         wrongChoice._id !== correctWord._id &&
//         !wrongChoices.includes(wrongChoice)
//       ) {
//         wrongChoices.push(wrongChoice);
//       }
//     }

//     const allChoices = [...wrongChoices, correctWord];
//     setChoices(allChoices.sort(() => Math.random() - 0.5));
//   };

//   const handleChoice = async (chosenWord) => {
//     if (chosenWord._id === currentWord._id) {
//       const updatedStats = wordStats.map((stat) =>
//         stat.word._id === currentWord._id
//           ? { ...stat, correctCount: stat.correctCount + 1 }
//           : stat
//       );
//       setWordStats(updatedStats);
//       const updatedTotalCorrectAnswers = totalCorrectAnswers + 1;
//       setTotalCorrectAnswers(updatedTotalCorrectAnswers);

//       if (updatedTotalCorrectAnswers === 15) {
//         await markCurrentWordsAsCompleted();
//         await dispatch(updaterProgressUserThunk());
//         alert("Congratulations! You earned 1 croissant!");
//         navigation.navigate("Train", { topicName });
//       } else {
//         setRandomWord(updatedStats);
//       }
//     } else {
//       alert("Try again!");
//     }
//   };

//   const playSound = async () => {
//     try {
//       if (isPlaying) return;
//       const audioUri = currentWord?.audio;
//       if (!audioUri) {
//         console.log("No audio available for this word.");
//         return;
//       }

//       const { sound } = await Audio.Sound.createAsync(
//         { uri: audioUri },
//         {},
//         onPlaybackStatusUpdate
//       );
//       setSound(sound);
//       await sound.playAsync();
//       setIsPlaying(true);
//     } catch (error) {
//       console.error("Error playing sound:", error);
//       setIsPlaying(false);
//     }
//   };

//   const onPlaybackStatusUpdate = (status) => {
//     if (status.didJustFinish) {
//       sound.unloadAsync();
//       setIsPlaying(false);
//     }
//   };

//   const initializeWordStats = () => {
//     const unfinishedWords = progress.filter(
//       (word) => !word.completed.includes(level)
//     );
//     if (unfinishedWords.length === 0) return;
//     const initialStats = unfinishedWords.slice(0, 5).map((word) => ({
//       word,
//       correctCount: 0,
//     }));
//     setWordStats(initialStats);
//     setRandomWord(initialStats);
//   };

//   useEffect(() => {
//     initializeWordStats();
//   }, [progress]);

//   const renderProgress = () => {
//     const totalExercises = 15; // Загальна кількість завдань
//     return (
//       <View style={{ flexDirection: "row", justifyContent: "center" }}>
//         {[...Array(totalExercises)].map((_, i) => (
//           <View
//             key={i}
//             style={{
//               width: 20,
//               height: 20,
//               borderRadius: 10,
//               backgroundColor:
//                 i < totalCorrectAnswers
//                   ? isDarkTheme
//                     ? "white"
//                     : "#67104c" // Для темної теми: білий, для світлої: червоний
//                   : "#A9A9A9", // Для неправильних: сірий в обох темах
//               margin: 3,
//             }}
//           />
//         ))}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView
//       style={[
//         defaultStyles.container,
//         { backgroundColor: isDarkTheme ? "#67104c" : "white" },
//       ]}
//     >
//       {renderProgress()}
//       <View>
//         <Text
//           style={{
//             fontSize: 30,
//             marginVertical: 20,
//             textAlign: "center",
//             fontWeight: "bold",
//             color: isDarkTheme ? "white" : "black",
//           }}
//         >
//           {currentWord?.word}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "center",
//           alignItems: "center",
//           marginTop: 40,
//           flexWrap: "wrap",
//         }}
//       >
//         {choices.map((choice) => (
//           <TouchableOpacity
//             key={choice._id}
//             onPress={() => handleChoice(choice)}
//             style={{
//               backgroundColor: isDarkTheme ? "#67104c" : "#f2f2f2",
//               padding: 15,
//               borderRadius: 10,
//               margin: 10,
//               width: "40%",
//               alignItems: "center",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 20,
//                 color: isDarkTheme ? "white" : "#67104c",
//                 textAlign: "center",
//               }}
//             >
//               {choice.world}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={{ marginTop: 50, alignItems: "center" }}>
//         <TouchableOpacity onPress={playSound} disabled={isPlaying}>
//           <Icon
//             name="sound"
//             size={40}
//             color={isPlaying ? "gray" : isDarkTheme ? "white" : "#67104c"}
//           />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };
