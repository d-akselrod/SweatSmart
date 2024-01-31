import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { clear } from '../../redux/slices/recentProfileSearchesSlice';
import { logout } from '../../redux/slices/userSlice';

export const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clear());
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('recent-profile-searches');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container} onPress={handleLogout}>
        <View style={styles.label}>
          <MaterialIcons name='logout' size={30} color='black' />
          <Text style={styles.text}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '97%',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 20,
  },
});
