import { useEffect, useState } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import {
  acceptFriendRequest,
  getFriendshipState,
  sendFriendRequest,
} from '../../service/SocialAPI';
import { FriendState } from '../../typings/SocialEnums';
import { IProfile, IUser } from '../../typings/types';

interface ISearchUserCardProps {
  profile: IProfile;
}

export const SearchProfileCard = (props: ISearchUserCardProps) => {
  const activeUser: IUser = useSelector((state: any) => state.user);

  const { profile } = props;

  const [friendshipState, setFriendshipState] = useState<
    FriendState | undefined
  >(undefined);

  useEffect(() => {
    const loadFriendshipState = async () => {
      try {
        const response = await getFriendshipState(
          activeUser.username,
          profile.username,
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFriendshipState(data.body);
        } else if (response.status == 404) {
          setFriendshipState(FriendState.NOT_FRIENDS);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadFriendshipState();
  }, []);

  const handlePress = async () => {};

  const handleClear = async () => {};

  const friendShipMapper = (state: FriendState | undefined) => {
    switch (state) {
      case FriendState.FRIENDS:
        return <Text>Friends</Text>;
      case FriendState.FRIEND1SENT:
        return <Text>Request Sent</Text>;
      case FriendState.FRIEND2SENT:
        return <Text>Accept Request</Text>;
      case FriendState.NOT_FRIENDS:
        return <Text>Add Friend</Text>;
      default:
        return <Text />;
    }
  };

  const handlePressBadge = async () => {
    switch (friendshipState) {
      case FriendState.FRIENDS:
        break;
      case FriendState.FRIEND1SENT:
        setFriendshipState(FriendState.NOT_FRIENDS);
        break;
      case FriendState.FRIEND2SENT:
        setFriendshipState(FriendState.FRIENDS);
        await acceptFriendRequest(profile.username, activeUser.username);
        break;
      case FriendState.NOT_FRIENDS:
        setFriendshipState(FriendState.FRIEND1SENT);
        await sendFriendRequest(activeUser.username, profile.username);
        break;
      default:
        () => {};
        break;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <View style={styles.profilePhoto} />
        <View style={styles.accountInfo}>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.stateBadge} onPress={handlePressBadge}>
        {friendShipMapper(friendshipState)}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
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
  stateBadge: {
    right: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'black',
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
