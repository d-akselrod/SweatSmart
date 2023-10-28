import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { ChatConversation } from './ChatConversation/ChatConversation';
import { ChatInput } from './ChatInput/ChatInput';
import { sendPrompt } from '../../service/ChatBotAPI';
import { ChatAuthor, IChatMessage } from './types';
import { ChatTypingIndicator } from './ChatTypingIndicator/ChatTypingIndicator';
import { ChatHeader } from './ChatHeader/ChatHeader';

const initialMessages: IChatMessage[] = [
  {
    role: ChatAuthor.Assistant,
    content: 'Hello. I am FitBot.',
  },
  {
    role: ChatAuthor.Assistant,
    content:
      'I\'d be glad to assist you in answering all your fitness related questions!',
  },
];

export const ChatBotPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const handleSendMessage = async (prompt: string) => {
    if (prompt.length == 0) return;

    setIsUserTyping(false);

    const newPrompt: IChatMessage = {
      role: ChatAuthor.User,
      content: prompt,
    };

    const conversation = messages.concat(newPrompt);
    setMessages(conversation);
    try {
      const response = await sendPrompt(conversation.slice(2));
      if (response.ok) {
        const data = await response.json();

        const promptReply: IChatMessage = {
          role: ChatAuthor.Assistant,
          content: data.choices[0].message.content,
        };

        setMessages(conversation.concat(promptReply));
      } else {
        const data = await response.json();
        console.log('unsuccessful', data);
      }
    } catch (e) {
      const networkErrorReply: IChatMessage = {
        role: ChatAuthor.Assistant,
        content: 'I\'m experiencing network issues. Please try again later.',
      };

      await new Promise(f => setTimeout(f, 1000));
      setMessages(conversation.concat(networkErrorReply));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.messagesContainer}
        keyboardVerticalOffset={10}
      >
        <ChatConversation messages={messages} />
        <View style={styles.typingIndicatorContainer}>
          {messages[messages.length - 1].role == ChatAuthor.User && (
            <ChatTypingIndicator role={ChatAuthor.Assistant} />
          )}
          {isUserTyping &&
            messages[messages.length - 1].role == ChatAuthor.Assistant && (
            <ChatTypingIndicator role={ChatAuthor.User} />
          )}
        </View>
        <ChatInput
          onPressSend={(prompt: string) => handleSendMessage(prompt)}
          onTextInputChange={text => setIsUserTyping(!!text)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 15,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  typingIndicatorContainer: {
    height: 30,
  },
});
