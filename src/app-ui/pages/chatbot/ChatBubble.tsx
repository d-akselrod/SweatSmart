import { View, Text, StyleSheet } from 'react-native';
import { ChatAuthor, IChatMessage } from './types';

interface IChatBotBubbleProps extends IChatMessage {
  onLayout: any;
}

export const ChatBubble = (props: IChatBotBubbleProps) => {
  const { role, content, onLayout } = props;

  const styles = StyleSheet.create({
    container: {
      backgroundColor:
        role == ChatAuthor.Assistant
          ? 'rgba(230, 230, 230, 1)'
          : 'rgba(0, 122, 255, 1)',
      padding: 7,
      borderRadius: 10,
      alignSelf: role == ChatAuthor.Assistant ? 'flex-start' : 'flex-end',
      maxWidth: '70%',
      marginTop: 8,
    },
    text: {
      color: role == ChatAuthor.Assistant ? 'black' : 'white',
    },
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};
