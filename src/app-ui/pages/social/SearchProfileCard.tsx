import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { IProfile } from '../../typings/types';

interface ISearchUserCardProps {
  profile: IProfile;
}

export const SearchProfileCard = (props: ISearchUserCardProps) => {
  const { profile } = props;

  const handlePress = async () => {
    try {
      const recentSearchesJson = await AsyncStorage.getItem(
        'recent-profile-searches',
      );
      const recentSearches = recentSearchesJson
        ? JSON.parse(recentSearchesJson)
        : [];
      const updatedSearches = recentSearches.some(
        (item: IProfile) => item.username === profile.username,
      )
        ? [...recentSearches]
        : [profile, ...recentSearches];
      await AsyncStorage.setItem(
        'recent-profile-searches',
        JSON.stringify(updatedSearches),
      );
    } catch (error) {
      console.error('Failed to update recent profile searches:', error);
    }
  };

  const handleClear = async () => {
    try {
      const recentSearchesJson = await AsyncStorage.getItem(
        'recent-profile-searches',
      );
      let recentSearches = recentSearchesJson
        ? JSON.parse(recentSearchesJson)
        : [];
      recentSearches = recentSearches.filter(
        (item: IProfile) => item.username !== profile.username,
      );
      await AsyncStorage.setItem(
        'recent-profile-searches',
        JSON.stringify(recentSearches),
      );
    } catch (error) {
      console.error('Failed to clear profile from recent searches:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.profilePhoto} />
      <View style={styles.accountInfo}>
        <Text style={styles.username}>{profile.username}</Text>
        <Text
          style={styles.name}
        >{`${profile.firstName} ${profile.lastName}`}</Text>
      </View>
      <TouchableOpacity onPress={handleClear}>
        <Ionicons name='md-close' size={24} color='grey' />
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
});
