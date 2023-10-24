import {
  View,
  StyleSheet,
  TextInputProps,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

interface IChatInputProps extends TextInputProps {
  onPressSend: (prompt: string) => void;
}

export const ChatBotInput = (props: IChatInputProps) => {
  const { onPressSend } = props;

  const [prompt, setPrompt] = useState('');
  const placeholder = 'Ask FitBot';

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        autoCorrect={true}
        onChangeText={input => setPrompt(input)}
      />
      <TouchableOpacity onPress={() => onPressSend(prompt)}>
        <Feather name='send' color='#6C96E8' size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '95%',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    flexGrow: 1,
  },
});
