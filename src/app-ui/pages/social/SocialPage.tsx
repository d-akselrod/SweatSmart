import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SearchProfileCard } from './SearchProfileCard';
import { SearchBar } from '../../components/SearchBar';
import { getFilteredUsers } from '../../service/SocialAPI';
import { IProfile, IUser } from '../../typings/types';

export const SocialPage = () => {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleFocus = () => {
    setSearchFocused(true);
  };

  const handleBlur = () => {
    setSearchFocused(false);
  };

  const FriendsPage = () => {
    return (
      <View>
        <Text>Friends Page</Text>
      </View>
    );
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IProfile[]>([]);

  useEffect(() => {
    if (searchQuery !== '') {
      handleSearchFriends();
    } else {
      // handleSearchFriends();
    }
  }, [searchQuery]);

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

  const handleSearchFriends = () => {
    loadUsers();
  };

  const handleChangeQuery = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchQuery = () => {
    handleSearchFriends();
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
        onSearch={handleSearchQuery}
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
    marginRight: 10,
  },
  usersList: {
    flex: 1,
    height: '100%',
    width: '100%',
    gap: 10,
  },
});
