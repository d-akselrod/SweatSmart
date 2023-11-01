import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RegisterPage } from './pages/register/RegisterPage';
import Onboarding from './pages/onboarding/Onboarding'

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
