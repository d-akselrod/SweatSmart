import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IProfile } from '../../typings/types';

interface IProfileCardProps {
  profile: IProfile;
}

export const ProfileCard = (props: IProfileCardProps) => {
  const { profile } = props;

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.profilePhoto} />
      <View style={styles.accountInfo}>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.name}>{profile.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 10,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  accountInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    fontWeight: 'normal',
  },
});
