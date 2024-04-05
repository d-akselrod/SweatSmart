import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
} from 'react-native';

interface IFieldCardProps extends TextInputProps {
  label: string;
  description?: string;
  placeholder?: string;
}

export const FieldCard = (props: IFieldCardProps) => {
  const { label, description, onChangeText, placeholder, value, keyboardType } =
    props;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        clearButtonMode='while-editing'
        autoCapitalize='none'
        autoCorrect={false}
        spellCheck={false}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 30,
    marginTop: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    width: 150,
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
  textInput: {
    color: 'black',
    fontSize: 18,
    width: '40%',
    borderBottomWidth: 0.3,
    borderColor: 'grey',
    paddingBottom: 5,
  },
});
