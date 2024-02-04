import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function PastWorkoutsHeader({
  username,
  onAddWorkout,
}: {
  username: string;
  onAddWorkout: () => void;
}) {
  // add function onAddWorkout to take us to log workout page
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Past Workouts</Text>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onAddWorkout} style={styles.addButton}>
          <Ionicons name='ios-add' size={24} color='red' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'grey',
    marginRight: 16, // Add some space between the username and the plus icon
  },
  addButton: {
    padding: 10, // Add padding to make it easier to tap the icon
  },
});
