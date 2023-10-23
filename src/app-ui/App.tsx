import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import RegistrationPage from './pages/register/RegisterPage';

export default function App() {
  return (
    <View style={styles.container}>
      <RegistrationPage></RegistrationPage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'fff',
  },
});
