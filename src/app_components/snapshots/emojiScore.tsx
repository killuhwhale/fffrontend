import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TSSnippetText} from '../Text/Text';

type EmojiScoreProps = {
  score: number;
};

const emojis = [
  '👽',
  '🍑',
  '🔥',
  '☕',
  '💎',
  '🥇',
  '🥈',
  '🥉',
  '🏅',
  '🔨',
  '🎖️',
  '⚡',
  '🏆',
  '💧',
  '🥩',
  '❄️',
];

const gradientColors = [
  '#047857',
  '#012f00',
  '#023509',
  '#043913',
  '#063d1d',
  '#094127',
  '#0c4531',
  '#164c3b',
  '#205345',
  '#2a5a4f',
  '#346159',
  '#3e6863',
  '#486f6d',
  '#527677',
  '#5b6d81',
  '#cbd5e1',
];

const EmojiScore: React.FC<EmojiScoreProps> = ({score}) => {
  //   const emojis = ['🥳', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '😍', '😘', '😋', '😜', '🥰'];

  const calculateEmojiIndex = (score: number) => {
    // Assuming 0 <= score <= 1000
    const ratio = score / 1000;
    return Math.floor((1 - ratio) * (emojis.length - 1));
  };

  const [currentEmojiIndex, setCurrentEmojiIndex] = useState<number>(0);

  useEffect(() => {
    let emojiDisplayIndex = 0;

    // Start cycling through all emojis
    const cycleInterval = setInterval(() => {
      setCurrentEmojiIndex(emojiDisplayIndex % emojis.length);
      emojiDisplayIndex++;
    }, 200); // Change emoji every 200ms

    // After 3 seconds, determine the correct emoji based on score
    const timeout = setTimeout(() => {
      clearInterval(cycleInterval); // Stop the cycling
      const correctEmojiIndex = calculateEmojiIndex(score);
      setCurrentEmojiIndex(correctEmojiIndex);
    }, 3000); // Wait 3 seconds

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(timeout);
    };
  }, [score]);

  return (
    <View style={styles.container}>
      <TSSnippetText
        textStyles={{fontSize: 30, color: gradientColors[currentEmojiIndex]}}>
        {score} {emojis[currentEmojiIndex]}
      </TSSnippetText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 50,
  },
});

export default EmojiScore;
