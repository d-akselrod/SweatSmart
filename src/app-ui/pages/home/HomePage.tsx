import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable
} from 'react-native';
import { useSelector } from 'react-redux';
import { IUser } from '../../typings/types';
import { AddProgramButton } from "./AddProgramButton";

export function HomePage() {
  const activeUser: IUser = useSelector((state: any) => state.user);
  const [chosenWorkout, setChosenWorkout] = useState(0)
  const workoutView : string[] = ["All Programs", "AI generated", "Created By Me"];
  const showWorkoutView = () => {
    return workoutView.map((program, index) => {
      return(
        <Pressable
          key = {index}
          style = {[styles.selectWorkout, {backgroundColor: chosenWorkout == index ? "#4ABAD2" : 'white', borderColor: '#4ABAD2', borderWidth: 1}]}
          onPress={() => changeView(index)}>
          <Text style = {{color: chosenWorkout == index ? 'white' : "#4ABAD2", fontWeight: '500'}}>{program}</Text>
        </Pressable>
      )
    })
  }

  const changeView = (index : number) => {
    setChosenWorkout(index)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: '600' }}>
        Hello, {activeUser.username.slice(1, 4)}!
      </Text>
      <View id={'my-programs'}>
        <View style={styles.myProgramsHeader}>
          <Text style={styles.title}>My Programs</Text>
          <AddProgramButton onPress = {() => {}}/>
        </View>
        <View style={styles.selectionContainer}>
          {showWorkoutView()}
        </View>
      </View>
      <View id={'featured-programs'}>
        <Text style={styles.title}>Featured Programs</Text>
      </View>
      <View id={'browse-exercises'}>
        <Text style={styles.title}>Browse Exercises</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: "space-between",
    marginVertical: 10
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold'
  },

  selectionContainer:{
    flexDirection: "row",
    justifyContent: "space-between"
},
  selectWorkout:{
    width: 110,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  myProgramsHeader:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
