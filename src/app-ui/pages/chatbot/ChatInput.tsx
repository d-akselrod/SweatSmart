import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  StyleSheet,
  TextInputProps,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface IChatInputProps extends TextInputProps {
  onPressSend: (prompt: string) => void;
  onTextInputChange: (prompt: string) => void;
}

export const ChatInput = (props: IChatInputProps) => {
  const { onPressSend, onTextInputChange } = props;

  const [prompt, setPrompt] = useState('');

  const placeholder = 'Ask FitBot';

  const onSubmit = (prompt: string) => {
    onPressSend(prompt);
    setPrompt('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        autoCorrect={true}
        value={prompt}
        onChangeText={input => {
          setPrompt(input);
          onTextInputChange(input);
        }}
      />
      <View>
        <TouchableOpacity onPress={() => onSubmit(prompt)}>
          <Feather name='send' color='#6C96E8' size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    flexGrow: 1,
    flex: 1,
    marginRight: 10,
  },
});
