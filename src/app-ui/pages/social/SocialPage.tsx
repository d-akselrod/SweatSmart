import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { FriendActivityCard } from './FriendActivityCard';
import { ProfileCard } from './ProfileCard';
import { SearchProfileCard } from './SearchProfileCard';
import { SearchBar } from '../../components/SearchBar';
import {
  getFilteredUsers,
  getFriends,
  getRecentActivity,
} from '../../service/SocialAPI';
import { IProfile, IUser } from '../../typings/types';

interface IFriendActivityWorkout {
  friendUsername: string;
  workoutName: string;
  workoutDate: Date;
  workoutDuration: number;
}

export const SocialPage = () => {
  const activeUser: IUser = useSelector((state: any) => state.user);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredUsers, setFilteredUsers] = useState<IProfile[]>([]);

  const [friendActivity, setFriendActivity] = useState<
    IFriendActivityWorkout[]
  >([]);

  const handleFocus = () => {
    setSearchFocused(true);
  };

  const handleBlur = () => {
    setSearchFocused(false);
  };

  const handleChangeQuery = (query: string) => {
    setSearchQuery(query);
  };

  const loadUsers = async () => {
    try {
      const response = await getFilteredUsers(activeUser.username, searchQuery);
      if (response.ok) {
        const data = await response.json();
        const filteredUsers: IProfile[] = JSON.parse(JSON.stringify(data.body));
        setFilteredUsers(filteredUsers);
      } else {
        //const data = await response.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadFriends = async () => {
    try {
      const response = await getFriends(activeUser.username);
      if (response.ok) {
        const data = await response.json();
        const friends: IProfile[] = JSON.parse(JSON.stringify(data.body));
        setFilteredUsers(friends);
      } else {
        console.log('Error loading friends');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadFriendActivity = async () => {
    try {
      const response = await getRecentActivity(activeUser.username);
      if (response.ok) {
        const data = await response.json();
        const friendActivity: IFriendActivityWorkout[] = JSON.parse(
          JSON.stringify(data.body),
        );
        setFriendActivity(friendActivity);
        console.log(friendActivity);
      } else {
        console.log('Error loading friend activity');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      loadUsers();
    } else {
      loadFriends();
    }
  }, [searchQuery]);

  useEffect(() => {
    loadFriendActivity();
  }, []);

  const FriendsPage = () => {
    const renderItem = ({ item }: { item: IProfile }) => (
      <ProfileCard profile={item} />
    );
    return (
      <View style={styles.subContainer}>
        <View style={styles.friendsList} id='friends-list'>
          <View style={styles.friendsHeader}>
            <Text style={styles.myFriendsHeader}>My Friends</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            style={styles.usersList}
            horizontal={true}
          />
        </View>
        <View style={styles.friendActivity}>
          <Text style={styles.myFriendsHeader}>Friend Activity</Text>
          <ScrollView>
            {friendActivity.map((activity, index) => (
              <FriendActivityCard key={index} activity={activity} />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  interface IProfilesListProps {
    profiles: IProfile[];
  }

  const ProfilesList = (props: IProfilesListProps) => {
    const { profiles } = props;

    const renderItem = ({ item }: { item: IProfile }) => (
      <SearchProfileCard profile={item} />
    );

    return (
      <FlatList
        data={profiles}
        renderItem={renderItem}
        style={styles.usersList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder={'Search Friends'}
        onChangeText={handleChangeQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {searchFocused ? (
        <ProfilesList profiles={filteredUsers} />
      ) : (
        <FriendsPage />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  subContainer: {
    height: '100%',
    width: '100%',
  },
  usersList: {
    width: '100%',
    left: 10,
  },
  friendActivity: {
    marginTop: 20,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    left: '2.5%',
    bottom: 5,
    height: '100%',
  },
  friendsList: {
    width: '95%',
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10,
    left: '2.5%',
  },
  myFriendsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewAllButton: {
    marginRight: 10,
    marginTop: 10,
  },
  profilesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  friendsPageContent: {
    flexGrow: 1,
  },
});
