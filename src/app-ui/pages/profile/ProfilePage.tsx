import React, { useState } from 'react';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
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

  const optionsCards: IProfilePageCardData[] = [
    {
      label: 'Account Settings',
      icon: <Ionicons name='settings-outline' size={24} color='black' />,
    },
    {
      label: 'Privacy Settings',
      icon: (
        <MaterialCommunityIcons
          name='shield-account-outline'
          size={24}
          color='black'
        />
      ),
    },
    {
      label: 'Notifications',
      icon: <FontAwesome name='bell-o' size={24} color='black' />,
    },
    {
      label: 'About',
      icon: (
        <Ionicons name='information-circle-outline' size={24} color='black' />
      ),
    },
    {
      label: 'Help',
      icon: <Ionicons name='help-circle-outline' size={24} color='black' />,
    },
    {
      label: 'Terms of Service',
      icon: <AntDesign name='filetext1' size={24} color='black' />,
    },
  ];

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOpenOptions = (label: string) => {
    setOptionsVisible(true);
    setSelectedOption(label);
  };

  const handleCloseOptions = () => {
    setOptionsVisible(false);
  };

  const MainPage = (
    <SafeAreaView style={styles.container}>
      <ProfileHeader activeUser={activeUser} />
      <View id='cards' style={styles.cards}>
        <View id='settings-cards' style={styles.optionsCards}>
          {optionsCards.map((settingCard, key) => (
            <ProfileOptionsCard
              key={key}
              label={settingCard.label}
              icon={settingCard.icon}
              onPress={() => handleOpenOptions(settingCard.label)}
            />
          ))}
        </View>
        <LogoutButton />
      </View>
    </SafeAreaView>
  );

  interface ISubPages {
    [key: string]: JSX.Element;
  }

  const subPages: ISubPages = {};

  const SubPage = (
    <SlidingPage
      isVisible={optionsVisible}
      onClose={handleCloseOptions}
      pageHeader={selectedOption}
    >
      <SafeAreaView>{subPages[selectedOption]}</SafeAreaView>
    </SlidingPage>
  );

  return (
    <>
      {MainPage}
      {SubPage}
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
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
});
