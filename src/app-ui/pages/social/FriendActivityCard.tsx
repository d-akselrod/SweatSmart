interface FriendActivityProps {
  activity: {
    friendUsername: string;
    workoutDate: Date;
    workoutName: string;
    workoutDuration: number;
  };
}

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const FriendActivityCard: React.FC<FriendActivityProps> = ({
  activity,
}) => {
  useEffect(() => {
    console.log(activity);
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconPlaceholder} />
      <View style={styles.details}>
        <Text style={styles.username}>{activity.friendUsername}</Text>
        <Text style={styles.date}>
          {new Date(activity.workoutDate).toLocaleDateString()}
        </Text>
        <Text style={styles.workoutName}>{activity.workoutName}</Text>
        <Text style={styles.duration}>{activity.workoutDuration} min</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 10,
    width: '95%',
    left: '2.5%',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  workoutName: {
    fontSize: 15,
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
