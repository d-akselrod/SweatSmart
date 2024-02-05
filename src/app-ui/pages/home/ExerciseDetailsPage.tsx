import { useEffect, useState } from 'react';
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

export function ExerciseDetailsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const exercise = route.params?.exerciseData;
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(exercise.sets).fill(false),
  );
  const [focusedIdx, setFocusIdx] = useState<number>(1);

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
          borderColor: setNumber === focusedIdx ? '#c4c4c4' : 'transparent',
          opacity: setNumber === focusedIdx ? 1 : 0.5,
        }}
        onPress={() => setFocusIdx(setNumber)}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: completed[setNumber - 1] ? '#46e747' : '#e15959',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {completed[setNumber - 1] ? (
            <AntDesign name='check' size={20} color='white' />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
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
      </Pressable>
    );
  };

  const renderSets = () => {
    return Array.from({ length: exercise.sets }, (val, index) => (
      <SetDetailsComponent
        key={index}
        setNumber={index + 1}
        reps={exercise.reps}
        weight={100}
      />
    ));
  };

  useEffect(() => {
    setFocusIdx(prev => {
      while (completed[prev - 1]) {
        if (completed.every(val => val)) return -1;
        else if (prev === exercise.sets) prev = 1;
        else prev += 1;
      }
      return prev;
    });
  }, [completed]);

  const updateValueAtIndex = (index: number) => {
    if (completed.every(val => val)) navigation.goBack();
    const newArray: boolean[] = [...completed];
    newArray[index] = true;
    setCompleted(newArray);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between', margin: 20 }}>
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
      <View style={{ flex: 2, marginHorizontal: 20 }}>
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
          <Text>{exercise.sets} SETS</Text>
          <View
            style={{ width: '40%', height: 0.5, backgroundColor: 'black' }}
          />
        </View>
        <View style={{ gap: 30, marginTop: 20 }}>{renderSets()}</View>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: completed.every(val => val) ? 'white' : '#be4949',
          },
        ]}
        onPress={() => updateValueAtIndex(focusedIdx - 1)}
      >
        <Text
          style={{
            color: completed.every(val => val) ? 'black' : 'white',
            fontWeight: 'bold',
            fontSize: 18,
            padding: 10,
          }}
        >
          {completed.every(val => val) ? 'Done' : 'Log Set'}
        </Text>
      </TouchableOpacity>
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
    bottom: '10%',
    alignSelf: 'center',
    width: '80%',
  },
});
