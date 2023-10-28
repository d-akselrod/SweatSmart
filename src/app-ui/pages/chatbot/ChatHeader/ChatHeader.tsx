import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export const ChatHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={require('../../../assets/images/FitBotAvatar.png')}
      />
      <Text style={styles.text}>FitBot</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '120%',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'black',
    padding: 1,
    borderWidth: 1,
  },
  text: {
    marginTop: 8,
    color: 'rgba(0,0,0,0.6)',
  },
});
