import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';

export const HelpPage = () => {
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitle: 'Settings',
      title: 'Help',
    });
  });

  const handleFeedbackSubmit = () => {
    // Implement the logic to handle the feedback submission
    console.log(feedback); // For example, log it to the console or send it to a server
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerText}>Submit your feedback</Text>
        <TextInput
          style={styles.input}
          placeholder='Your feedback'
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
        <Button title='Submit Feedback' onPress={handleFeedbackSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    minHeight: 300,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // to start text from the top in multiline input
  },
});
