import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
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
    <TouchableOpacity style={styles.container} onPress={handleLogout}>
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
