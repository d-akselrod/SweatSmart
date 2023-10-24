import { View, Text, StyleSheet } from 'react-native';
import { IChatMessage as IChatBotBubbleProps, ChatAuthor } from '../ChatBot';

export const ChatBotBubble = (props: IChatBotBubbleProps) => {
  const { role, content } = props;

  const styles = StyleSheet.create({
    container: {
      backgroundColor:
        role == ChatAuthor.Assistant
          ? 'rgba(229, 229, 229, 1)'
          : 'rgba(216, 241, 255, 1)',
      padding: 7,
      borderRadius: 10,
      alignSelf: role == ChatAuthor.Assistant ? 'flex-start' : 'flex-end',
      maxWidth: '70%',
    },
  });

  return (
    <View style={styles.container}>
      <Text>{content}</Text>
    </View>
  );
};
