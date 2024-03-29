import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function StatisticsHeader({
  workouts,
  exercises,
}: {
  workouts: any;
  exercises: any;
}) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{workouts}</Text>
        <Text style={styles.statLabel}>Workouts</Text>
      </View>
      {/* <View style={[styles.statItem, styles.statDivider]}>
        <Text style={styles.statNumber}>{goal}</Text>
        <Text style={styles.statLabel}>Weekly Goal</Text>
      </View> */}
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{exercises}</Text>
        <Text style={styles.statLabel}>Exercises</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'grey',
  },
});
