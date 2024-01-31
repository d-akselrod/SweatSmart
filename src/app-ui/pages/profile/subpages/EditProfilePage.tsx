import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Button,
  View,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { IUser } from '../../../typings/types';
import { FieldCard } from '../cards/FieldCard';

const storeProfilePhotoUri = async (uri: string) => {
  try {
    await AsyncStorage.setItem(`profilePhoto`, uri);
  } catch (e) {
    console.error('Error saving profile photo URI:', e);
  }
};

const fetchProfilePhotoUri = async () => {
  try {
    const uri = await AsyncStorage.getItem(`profilePhoto`);
    return uri;
  } catch (e) {
    console.error('Error fetching profile photo URI:', e);
    return null;
  }
};

export const EditProfilePage = () => {
  const navigation = useNavigation();
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const userId = 'yourUserId'; // Replace with actual user ID

  const activeUser: IUser = useSelector((state: any) => state.user);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Edit Profile',
    });

    const loadProfilePhoto = async () => {
      const uri = await fetchProfilePhotoUri();
      if (uri) {
        setProfilePhotoUri(uri);
      }
    };

    loadProfilePhoto();
  }, []);

  const handleSelectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets[0].uri) {
      const photoUri = result.assets[0].uri;
      try {
        const response = await fetch(photoUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, 'profile-photo.jpg');

        const uploadResponse = await fetch(
          `http://yourapi.com/users/${userId}/upload-photo`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (uploadResponse.ok) {
          await storeProfilePhotoUri(photoUri);
          setProfilePhotoUri(photoUri);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {profilePhotoUri ? (
          <Image
            source={{ uri: profilePhotoUri }}
            style={styles.profilePhoto}
          />
        ) : (
          <View style={styles.profilePhoto} />
        )}
        <Button title={'Change Photo'} onPress={handleSelectPhoto} />
        <Text style={styles.groupHeader}>{'Your Details'}</Text>
        <FieldCard
          label='Name'
          placeholder='Your Name'
          textValue={activeUser.name}
        />
        <FieldCard
          label='Username'
          placeholder='Your Username'
          textValue={activeUser.username}
        />
        <FieldCard
          label='Email'
          placeholder='Your Email'
          textValue={activeUser.email}
        />
        <View style={styles.saveChanges}>
          <Button title='Save Changes' onPress={() => {}} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  groupHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: '100%',
    marginLeft: 20,
    marginTop: 15,
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'grey',
  },
  saveChanges: {
    marginTop: 20,
  },
});
