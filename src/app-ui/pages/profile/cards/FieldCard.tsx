import { StyleSheet, Text, Switch, View, TextInput } from 'react-native';

interface IFieldCardProps {
  label: string;
  description?: string;
  onChangeText?: () => void;
  placeholder?: string;
  textValue?: string;
}

export const FieldCard = (props: IFieldCardProps) => {
  const { label, description, onChangeText, placeholder, textValue } = props;

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
        value={textValue}
        clearButtonMode='while-editing'
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
    width: 90,
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
  textInput: {
    color: 'black',
    fontSize: 18,
    width: '65%',
    borderBottomWidth: 0.3,
    borderColor: 'grey',
    paddingBottom: 5,
  },
});
