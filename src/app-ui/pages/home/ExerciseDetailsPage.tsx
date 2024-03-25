import { useEffect, useState } from 'react';
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import { useSelector } from 'react-redux';
import { addSetToExercise, deleteSetFromExercise, updateSetOfExercise } from '../../service/WorkoutPlanAPI';

export function ExerciseDetailsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const activeWorkout: any = useSelector((state: any) => state.workout);

  // @ts-ignore
  const exercise = route.params?.exerciseData;
  // @ts-ignore
  const wId = route.params?.wId;
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(exercise.sets.length).fill(false),
  );
  const [reps, setReps] = useState(
    exercise.sets.map((val: { reps: number; weight: number }) => val.reps),
  );
  const [weight, setWeight] = useState(
    exercise.sets.map((val: { reps: number; weight: number }) => val.weight),
  );
  
  const [showModal, setShowModal] = useState(false);
  const [focusedIdx, setFocusIdx] = useState<number>(1);
  const [numOfSets, setNumOfSets] = useState(exercise.sets.length);
  const height = Dimensions.get('window').height;
  const SetDetailsComponent = (props: {
    setNumber: number;
    reps: number;
    weight: number;
  }) => {
    const { setNumber, reps, weight } = props;
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          paddingHorizontal: 15,
          borderLeftWidth: 2,
          borderColor: setNumber === focusedIdx ? 'black' : 'transparent',
          opacity: setNumber === focusedIdx ? 1 : 0.5,
        }}
        onPress={() => setFocusIdx(setNumber)}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: completed[setNumber - 1] ? '#46e747' : '#be4949',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {completed[setNumber - 1] ? (
            <AntDesign name='check' size={20} color='white' />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              {setNumber}
            </Text>
          )}
        </View>
        <Text style={{ fontWeight: '400', fontSize: 30, fontStyle: 'italic' }}>
          {reps}
        </Text>
        <Text>Reps</Text>
        <Text style={{ fontWeight: '400', fontSize: 30, fontStyle: 'italic' }}>
          {weight}
        </Text>
        <Text>lbs</Text>
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={() => editSet(setNumber)}
        >
          <AntDesign name='ellipsis1' size={25} color='black' />
        </TouchableOpacity>
      </Pressable>
    );
  };

  const editSet = (setNumber: number) => {
    setFocusIdx(setNumber);
    setShowModal(true);
  };

  const renderSets = () => {
    return Array.from({ length: numOfSets }, (val, index) => (
      <SetDetailsComponent
        key={index}
        setNumber={index + 1}
        reps={reps[index]}
        weight={weight[index]}
      />
    ));
  };

  useEffect(() => {
    setFocusIdx(prev => {
      while (completed[prev - 1]) {
        if (completed.every(val => val)) return -1;
        else if (prev === numOfSets) prev = 1;
        else prev += 1;
      }
      return prev;
    });
  }, [completed]);

  const addSet = async (reps: number, weight: number) => {
    try{
      const response = await addSetToExercise(wId, exercise.eId, reps, weight)
      if(response.ok){
        console.log("blessed")
      }
      else{
        console.log(response.status)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  const updateSet = async (reps: number, weight: number, setNum: number) => {
    setShowModal(false)
    try{
      const response = await updateSetOfExercise(wId, exercise.eId, setNum, reps, weight)
      if(response.ok){
        console.log("blessed")
      }
      else{
        console.log(response.status)
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  
  const deleteSet = () => {
    setNumOfSets(numOfSets - 1);
    setReps((prev: number[]) => {
      const array = [...prev];
      return array.filter((val, index) => index != focusedIdx-1)
    })
    setWeight((prev: number[]) => {
      const array = [...prev];
      return array.filter((val, index) => index != focusedIdx-1)
    })
    setShowModal(false)
    deleteSetFromDB()
  }
  
  const deleteSetFromDB = async () => {
    try{
      const response = await deleteSetFromExercise(wId, exercise.eId, focusedIdx);
      if(response.ok){
        console.log("blessed")
      }
      else{
        console.log("could not delete set")
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal animationType='slide' transparent={true} visible={showModal}>
        <View style={styles.modalContent}>
          <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{ fontSize: 17, fontWeight: '600' }}>Reps: {reps[focusedIdx-1]}</Text>
            <TouchableOpacity onPress = {() => deleteSet()}>
              <MaterialIcons name="delete-outline" size={26} color="#be4949" />
            </TouchableOpacity>
          </View>
          <Slider
            step={1}
            lowerLimit={1}
            maximumValue={30}
            value={reps[focusedIdx-1]}
            minimumTrackTintColor={'#be4949'}
            onValueChange={val => setReps((prev: number[]) => {
              const newArray = [...prev];
              newArray[focusedIdx - 1] = val;
              return newArray;
            })}
          />
          <Text style={{ fontSize: 17, fontWeight: '600' }}>
            Weight: {weight[focusedIdx-1]}
          </Text>
          <Slider
            minimumTrackTintColor={'#be4949'}
            step={5}
            lowerLimit={5}
            maximumValue={200}
            value={weight[focusedIdx-1]}
            onValueChange={val => setWeight((prev: number[]) => {
              const newArray = [...prev];
              newArray[focusedIdx - 1] = val;
              return newArray;
            })}
          />
          <Button title='Save' onPress={() => updateSet(reps[focusedIdx-1], weight[focusedIdx-1], focusedIdx)} />
        </View>
      </Modal>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View
          style={{
            height: height / 4,
            justifyContent: 'space-between',
            margin: 20,
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <AntDesign name='arrowleft' size={24} color='black' />
          </Pressable>
          <View style={{ gap: 10 }}>
            <Text style={styles.header}>{exercise.exerciseName}</Text>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>
              {exercise.muscleGroup}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}
              >
                <MaterialCommunityIcons name='target' size={15} color='black' />
                <Text>{exercise.targetMuscle}</Text>
              </View>
              <View
                style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}
              >
                <MaterialIcons name='speed' size={15} color='black' />
                <Text>
                  {exercise.level === 'A'
                    ? 'Beginner'
                    : exercise.level === 'B'
                    ? 'Intermediate'
                    : 'Advanced'}
                </Text>
              </View>
              <View
                style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}
              >
                <FontAwesome5 name='dumbbell' size={15} color='black' />
                <Text>
                  {exercise.equipment === 'N'
                    ? 'None'
                    : exercise.level === 'D'
                    ? 'Dumbbells'
                    : 'Full Equip'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{ width: '40%', height: 0.5, backgroundColor: 'black' }}
            />
            <Text>{exercise.sets.length} SETS</Text>
            <View
              style={{ width: '40%', height: 0.5, backgroundColor: 'black' }}
            />
          </View>
          <View style={{ gap: 30, marginTop: 20 }}>
            {renderSets()}
            <Pressable
              onPress={() => {
                setNumOfSets(numOfSets + 1);
                setReps((prev: number[]) => [...prev, prev[numOfSets-1]])
                setWeight((prev: number[]) => [...prev, prev[numOfSets-1]])
                setFocusIdx(numOfSets + 1);
                setCompleted(prev => [...prev, false]);
                addSet(reps[numOfSets-1], weight[numOfSets-1])
              }}
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingHorizontal: 17,
                alignItems: 'center',
              }}
            >
              <View style={styles.addSet}>
                <Entypo name='plus' size={20} color='black' />
              </View>
              <Text
                style={{ fontSize: 15, fontWeight: 'bold', color: 'black' }}
              >
                Add Another Set
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },

  addSet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%', // Takes up full width
    backgroundColor: '#fff', // Adjust as needed
    borderTopLeftRadius: 40, // Optional: Rounded corners
    borderTopRightRadius: 40, // Optional: Rounded corners
    padding: 20, // Optional: Adjust padding as needed
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
