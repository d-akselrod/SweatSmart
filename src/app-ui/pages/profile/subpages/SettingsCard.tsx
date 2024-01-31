import { useState } from 'react';
import { StyleSheet, Text, Switch, View } from 'react-native';

interface ISettingsCardProps {
  label: string;
  description?: string;
  type: 'text' | 'switch';
  onValueChange?: () => void;
}

export const SettingsCard = (props: ISettingsCardProps) => {
  const { label, description, onValueChange } = props;

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? 'white' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
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
});
