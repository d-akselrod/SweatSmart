import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View, Text } from 'react-native';
import { IUser } from '../../typings/types';

interface ISettingsHeaderProps {
  activeUser?: IUser;
}

export const SettingsHeader = (props: ISettingsHeaderProps) => {
  const { activeUser } = props;

  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);

  const fetchProfilePhotoUri = async () => {
    try {
      const uri = await AsyncStorage.getItem(`profilePhoto`);
      return uri;
    } catch (e) {
      console.error('Error fetching profile photo URI:', e);
      return null;
    }
  };

  useEffect(() => {
    const loadProfilePhoto = async () => {
      const uri = await fetchProfilePhotoUri();
      if (uri) {
        setProfilePhotoUri(uri);
      }
    };
    loadProfilePhoto();
  }, []);

  // Use the profilePhotoUri as a key for the Image component
  const imageKey = profilePhotoUri ? 'userPhoto' : 'placeholder';

  return (
    <View style={styles.profileHeader}>
      {profilePhotoUri ? (
        <Image
          key={imageKey}
          source={{ uri: profilePhotoUri }}
          style={styles.profilePhoto}
        />
      ) : (
        <Image
          key={imageKey}
          source={require('../../assets/images/UserAvatar.png')}
          style={styles.profilePhoto}
        />
      )}

      <View style={styles.displayInfo}>
        {activeUser?.name && (
          <Text style={styles.textName}>{activeUser?.name}</Text>
        )}
        <Text style={styles.accountInfo}>{activeUser?.username}</Text>
        <Text style={styles.accountInfo}>{activeUser?.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: 'white',
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
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  accountInfo: {
    fontSize: 14,
    color: 'grey',
  },
});
