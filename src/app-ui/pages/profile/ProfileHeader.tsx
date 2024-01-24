import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { IUser } from '../../typings/types';

interface IProfileHeaderProps {
  activeUser?: IUser;
}

export const ProfileHeader = (props: IProfileHeaderProps) => {
  const { activeUser } = props;
  return (
    <View style={styles.profileHeader}>
      <Image
        style={styles.image}
        source={require('../../assets/images/UserAvatar.png')}
      />
      <View id='display-info' style={styles.displayInfo}>
        {activeUser?.firstName && activeUser.lastName && (
          <Text
            style={styles.textName}
          >{`${activeUser?.firstName} ${activeUser?.lastName}`}</Text>
        )}
        <Text>{activeUser?.username}</Text>
        <Text>{activeUser?.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  displayInfo: {
    flexDirection: 'column',
    marginLeft: 10,
    gap: 2,
  },
  textName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
