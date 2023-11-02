import React from 'react';
import { StyleSheet, View } from 'react-native';
import Onboarding from './pages/onboarding/Onboarding';
import { RegisterPage } from './pages/register/RegisterPage';

export default function App() {
  return (
    <View style={styles.container}>
      <Onboarding />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'fff',
  },
});
