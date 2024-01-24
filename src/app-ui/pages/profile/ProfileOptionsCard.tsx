import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
interface IProfileOptionsCardProps {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}

export const ProfileOptionsCard = (props: IProfileOptionsCardProps) => {
  const { label, icon, onPress } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.label}>
          {icon}
          <Text style={styles.text}>{label}</Text>
        </View>
        <AntDesign name='right' size={24} color='black' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '97%',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 20,
  },
});
