import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';

interface ICustomzeProps extends TextInputProps {
  validInput?: boolean;
  iconName?: any;
  inputPattern?: RegExp;
  resetError?: Function;
}
function CustomizeInput(props: ICustomzeProps) {
  const [hiddenField, setHiddenField] = useState(props.secureTextEntry);
  const [focus, setFocus] = useState(false);
  const input = useRef<TextInput | null>(null);
  const matchRegEx = (value: string) => {
    props.inputPattern ? value.match(props.inputPattern) : true;
  };

  const handleFocus = () => {
    props.resetError?.();
    setFocus(true);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: props.validInput
              ? 'red'
              : focus
                ? 'lightblue'
                : '#C3C3C3',
          },
        ]}
      >
        <Ionicons name={props.iconName} size={20} color={'#6C96E8'}></Ionicons>
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

export default CustomizeInput;

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
