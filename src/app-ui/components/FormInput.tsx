import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface IFormInputProps extends TextInputProps {
  validInput?: boolean;
  iconName?: any;
  resetError?: () => void;
}
export function FormInput(props: IFormInputProps) {
  const [hiddenField, setHiddenField] = useState(props.secureTextEntry);
  const [focus, setFocus] = useState(false);
  const input = useRef<TextInput | null>(null);

  const handleFocus = () => {
    props.resetError?.();
    setFocus(true);
  };

  const setColor = () => {
    if (props.validInput) {
      return 'red';
    } else if (focus) {
      return 'lightblue';
    } else {
      return '#C3C3C3';
    }
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: setColor(),
          },
        ]}
      >
        <Ionicons name={props.iconName} size={20} color={'#6C96E8'} />
        <TextInput
          ref={input}
          onChangeText={props.onChangeText}
          autoCorrect={false}
          secureTextEntry={hiddenField}
          placeholderTextColor='#A4A4A4'
          style={styles.input}
          placeholder={props.placeholder}
          onFocus={handleFocus}
          onBlur={() => setFocus(false)}
          keyboardType = {props.keyboardType}
        />
        {props.secureTextEntry && (
          <TouchableOpacity onPress={() => setHiddenField(!hiddenField)}>
            <Ionicons
              name={hiddenField ? 'eye' : 'eye-off'}
              color='#6C96E8'
              size={20}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
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
