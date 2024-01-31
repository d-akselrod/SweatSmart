import React, { useEffect, useState } from 'react';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { LogoutButton } from './LogoutButton';
import { ProfileHeader } from './ProfileHeader';
import { ProfileOptionsCard } from './ProfileOptionsCard';
import { SlidingPage } from '../../components/SlideingPage';
import { IUser } from '../../typings/types';

interface IProfilePageCardData {
  label: string;
  icon: JSX.Element;
}

export function ProfilePage() {
  const activeUser: IUser = useSelector((state: any) => state.user);

  const navigation = useNavigation();

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOpenOptions = (label: string) => {
    // @ts-ignore
    navigation.navigate(label);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader activeUser={activeUser} />
      <ScrollView>
        <View style={styles.optionsCategory}>
          <Text style={styles.categoryHeader}>{'Your Profile'}</Text>
          <ProfileOptionsCard
            label={'Edit Profile'}
            icon={
              <MaterialCommunityIcons
                name='account-edit-outline'
                size={30}
                color='black'
              />
            }
            onPress={() => handleOpenOptions('Edit Profile')}
          />
        </View>
        <View style={styles.categoryGap} />
        <View style={styles.optionsCategory}>
          <Text style={styles.categoryHeader}>
            {'Your Personal Experience'}
          </Text>
          <ProfileOptionsCard
            label={'Notifications'}
            icon={<FontAwesome name='bell-o' size={30} color='black' />}
            onPress={() => handleOpenOptions('Notifications')}
          />
          <ProfileOptionsCard
            label={'App Usage'}
            icon={<Feather name='clock' size={30} color='black' />}
            onPress={() => handleOpenOptions('App Usage')}
          />
        </View>
        <View style={styles.categoryGap} />
        <View style={styles.optionsCategory}>
          <Text style={styles.categoryHeader}>{'More info and Support'}</Text>
          <ProfileOptionsCard
            label={'About'}
            icon={<AntDesign name='infocirlceo' size={30} color='black' />}
            onPress={() => handleOpenOptions('About')}
          />
          <ProfileOptionsCard
            label={'Help'}
            icon={<AntDesign name='questioncircleo' size={30} color='black' />}
            onPress={() => handleOpenOptions('Help')}
          />
          <ProfileOptionsCard
            label={'Terms of Service'}
            icon={<AntDesign name='filetext1' size={30} color='black' />}
            onPress={() => handleOpenOptions('Terms of Service')}
          />
        </View>
        <View style={styles.categoryGap} />
        <View style={styles.optionsCategory}>
          <Text style={styles.categoryHeader}>{'Login'}</Text>
          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  profileOptionsHeader: {
    width: '90%',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  categoryHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'grey',
    marginLeft: 20,
  },
  cards: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    gap: 15,
    marginTop: 20,
  },
  optionsCards: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  optionsCategory: {
    width: '100%',
    backgroundColor: 'white',
    marginTop: 10,
  },
  accountHeader: {
    backgroundColor: 'white',
  },
  categoryGap: {
    backgroundColor: '#f0f0f0',
    height: 6,
  },
});
