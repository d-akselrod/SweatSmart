import { AntDesign } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import {useEffect, useState } from 'react';
import {View, Text, SafeAreaView, StyleSheet, Pressable, TextInput, TouchableOpacity} from 'react-native';

export function ExerciseDetailsPage(){
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const exercise = route.params?.exerciseData
  const [completed, setCompleted] = useState<boolean[]>(new Array(exercise.sets).fill(false))
  const [focusedIdx, setFocusIdx] = useState<number>(1)

  const SetDetailsComponent = (props: {setNumber: number, rep: number, weight: number}) => {
    const {setNumber, rep, weight} = props;
    return(
      <Pressable style = {{flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 5}} onPress={() => setFocusIdx(setNumber)}>
        <View style = {{width: 30, height: 30, borderRadius: 15, backgroundColor: completed[setNumber-1] ? '#59e15b' : setNumber === focusedIdx ? '#e15959' : '#e1595960', justifyContent: 'center', alignItems: 'center'}}>
          <Text style = {{color: 'white', fontWeight: 'bold'}}>{setNumber}</Text>
        </View>
        <TextInput style = {{fontWeight: 'bold', fontSize: 18}} defaultValue = {rep.toString()}/>
        <Text>Reps</Text>
        <Text style = {{fontWeight: 'bold', fontSize: 18}}>{weight}</Text>
        <Text>lbs</Text>
      </Pressable>
    )
  }
  
  const renderSets = () => {
    return Array.from({length: exercise.sets}, (val, index) => 
      <SetDetailsComponent key = {index} setNumber={index+1} rep={exercise.reps} weight={100}/>
    )
  }

  useEffect(() => {
    setFocusIdx(prev => {
      while(completed[prev-1]){
        if(completed.every(val => val)) return prev
        else if(prev === exercise.sets) prev = 1
        else prev += 1;
      }
      return prev
    })
  }, [completed]);

  const updateValueAtIndex = (index: number) => {
    const newArray:boolean[] = [...completed];
    newArray[index] = true;
    setCompleted(newArray);
  };
  
  return(
    <SafeAreaView style = {{flex: 1}}>
      <View style = {{flex: 1, justifyContent: 'space-between', margin: 20}}>
        <Pressable onPress = {() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <View>
          <Text style = {styles.header}>{exercise.exerciseName}</Text>
          <Text>{exercise.muscleGroup}</Text>
        </View>
      </View>
      <View style = {{flex: 2, marginHorizontal: 20}}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View style = {{width: '40%', height: 0.5, backgroundColor: 'black'}}/>
          <Text>{exercise.sets} SETS</Text>
          <View style = {{width: '40%', height: 0.5, backgroundColor: 'black'}}/>
        </View>
        <View style = {{gap: 30, marginTop: 20}}>
          {renderSets()}
        </View>
      </View>
      <TouchableOpacity style = {styles.button} onPress = {() => updateValueAtIndex(focusedIdx-1)}>
        <Text style = {{color: 'white', fontWeight: "bold", fontSize: 18, padding: 10}}>Log Set</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  
  button: {
    backgroundColor: '#be4949',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
    width: "80%"
  }
})