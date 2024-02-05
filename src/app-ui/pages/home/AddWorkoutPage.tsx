import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { postWorkout } from '../../service/WorkoutAPI';
import { IUser } from '../../typings/types';

interface IAddWorkoutProps {
  close: Function;
}
export function AddWorkoutPage(props: IAddWorkoutProps) {
  const activeUser: IUser = useSelector((state: any) => state.user);

  const { close } = props;
  const [text, setText] = useState('');
  const addWorkout = async () => {
    const workout = {
      name: text,
      date: new Date(),
      numOfExercises: 0,
      duration: 0,
    };
    try {
      const response = await postWorkout(activeUser.username, workout);
      if (response.ok) {
        const data = await response.json();
        close();
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      //LOGIC
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title={'Cancel'} onPress={() => close()} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Add Workout</Text>
        <Button title={'Save'} onPress={() => addWorkout()} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Workout Name</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setText(text)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textInput: {
    borderColor: '#deebff',
    borderWidth: 2,
    width: '80%',
    fontSize: 20,
  },
});
