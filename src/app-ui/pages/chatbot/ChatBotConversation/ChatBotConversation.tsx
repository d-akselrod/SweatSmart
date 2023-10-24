import React from 'react';
import { IChatMessage } from '../ChatBot';
import { ChatBotBubble } from '../ChatBotBubble/ChatBotBubble';
import { View, StyleSheet } from 'react-native';

interface IChatBotConversationProps {
  messages: IChatMessage[];
}
export const ChatBotConversation = (props: IChatBotConversationProps) => {
  const { messages } = props;

  return (
    <View style={styles.chatContainer}>
      {messages.map((message, index) => (
        <ChatBotBubble
          key={index}
          role={message.role}
          content={message.content}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    gap: 8,
    marginLeft: 15,
    marginRight: 15,
  },
});
