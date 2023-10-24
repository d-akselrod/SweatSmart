import { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { ChatBotConversation } from './ChatBotConversation/ChatBotConversation';
import { ChatBotInput } from './ChatBotInput/ChatBotInput';
import { sendPrompt } from '../../service/ChatBot';

export enum ChatAuthor {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
}
export interface IChatMessage {
  role: ChatAuthor;
  content: string;
}

const initialMessage: IChatMessage = {
  role: ChatAuthor.Assistant,
  content: 'Hello. I am FitBot',
};

export const ChatBot = () => {
  const [messages, setMessages] = useState([initialMessage]);

  const handleSendMessage = async (prompt: string) => {
    const newPrompt: IChatMessage = {
      role: ChatAuthor.User,
      content: prompt,
    };

    setMessages(messages.concat(newPrompt));

    const response = await sendPrompt(messages);
    if (response.ok) {
      const data = await response.json();

      const promptReply: IChatMessage = {
        role: ChatAuthor.Assistant,
        content: data.choices[0].message.content,
      };

      setMessages(messages.concat([newPrompt, promptReply]));
    } else {
      const data = await response.json();
      console.log('unsuccessful');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>FitBot</Text>
      <ChatBotConversation messages={messages} />
      <ChatBotInput
        onPressSend={(prompt: string) => handleSendMessage(prompt)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    alignContent: 'center',
  },
});
