import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

interface ISearchBarProps extends TextInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

const cancelButton = () => (
  <TouchableOpacity onPress={Keyboard.dismiss}>
    <View style={styles.cancelButton}>
      <Text>Cancel</Text>
    </View>
  </TouchableOpacity>
);

export function SearchBar(props: ISearchBarProps) {
  const { placeholder, onChangeText, onFocus, onBlur } = props; // Destructuring the new props

  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(); // Call the onFocus prop function
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setValue('');
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name='ios-search' size={20} color='gray' />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={text => {
            setValue(text);
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearButtonMode='always'
          autoCapitalize='none'
        />
      </View>

      {isFocused && cancelButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
    borderRadius: 15,
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 10,
    marginRight: 10,
  },
});
