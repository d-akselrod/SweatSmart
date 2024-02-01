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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUser } from '../../../redux/slices/userSlice';
import {updateEmail, updateName, updateUsername } from '../../../service/AccountAPI';
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

  const [nameField, setNameField] = useState<string>(
    activeUser.name ? activeUser.name : '',
  );
  const [usernameField, setUsernameField] = useState<string>(
    activeUser.username,
  );
  const [emailField, setEmailField] = useState<string>(activeUser.email);

  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<string>('');

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const dispatch = useDispatch();

  const handleSave = async () => {
    setStatusMessage('');
    setErrorMessages([]);

    if (nameField !== activeUser.name) {
      try {
        const response = await updateName(activeUser.username, nameField);
        if (response.ok) {
          const data = await response.json();
          dispatch(setActiveUser(data.body as IUser));
          console.log(data.body);
        } else {
          const data = await response.json();
          setErrorMessages([...errorMessages, data.message]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (usernameField !== activeUser.username) {
      try {
        const response = await updateUsername(
          activeUser.username,
          usernameField,
        );
        if (response.ok) {
          const data = await response.json();
          dispatch(setActiveUser(data.body as IUser));
          console.log(data.body);
        } else {
          const data = await response.json();
          setErrorMessages([...errorMessages, data.message]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (emailField !== activeUser.email) {
      try {
        const response = await updateEmail(activeUser.username, emailField);
        if (response.ok) {
          const data = await response.json();
          dispatch(setActiveUser(data.body as IUser));
          console.log("CHANGE EMAIL")
          console.log(data.body);
        } else {
          const data = await response.json();
          setErrorMessages([...errorMessages, data.message]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (errorMessages.length > 0) {
      setStatusMessage('Error saving 1 or more profile changes');
    } else {
      setStatusMessage('Profile changes saved');
    }

    setSaveEnabled(false);
  };

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

  useEffect(() => {
    setStatusMessage('');
    setErrorMessages([]);
  }, [nameField, usernameField, emailField]);

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
          value={nameField}
          onChangeText={(text: string) => setNameField(text)}
        />
        <FieldCard
          label='Username'
          placeholder='Your Username'
          value={usernameField}
          onChangeText={(text: string) => setUsernameField(text)}
        />
        <FieldCard
          label='Email'
          placeholder='Your Email'
          value={emailField}
          onChangeText={(text: string) => setEmailField(text)}
        />
        {(activeUser.email !== emailField ||
          activeUser.name !== nameField ||
          activeUser.username !== usernameField) && (
          <View style={styles.saveChanges}>
            <Button title='Save Changes' onPress={handleSave} />
          </View>
        )}
        <Text style={styles.statusMessage}>{statusMessage}</Text>
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
  statusMessage: {
    marginTop: 25,
    color: 'green',
  },
});
