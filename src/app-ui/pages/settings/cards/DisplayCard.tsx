import { StyleSheet, Text, View } from 'react-native';

interface IDisplayCardProps {
  label: string;
  description?: string;
  displayMessage?: string;
}

export const DisplayCard = (props: IDisplayCardProps) => {
  const { label, description, displayMessage } = props;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Text style={styles.displayMessage}>{displayMessage}</Text>
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
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
  displayMessage: {
    color: 'black',
    fontSize: 18,
  },
});
