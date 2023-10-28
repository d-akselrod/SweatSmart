import React, { useRef, useEffect } from 'react';
import { ChatBubble } from '../ChatBubble/ChatBubble';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { IChatMessage } from '../types';

interface IChatConversationProps {
  messages: IChatMessage[];
}

export const ChatConversation = (props: IChatConversationProps) => {
  const { messages } = props;
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleLastMessageLayout = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardShouldPersistTaps='handled'
      keyboardDismissMode='on-drag'
    >
      <View style={styles.chatContainer}>
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            role={message.role}
            content={message.content}
            onLayout={
              index === messages.length - 1
                ? handleLastMessageLayout
                : undefined
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});
