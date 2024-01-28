import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AddProgramButton } from './AddProgramButton';
import { AddWorkoutPage } from './AddWorkoutPage';
import { FeaturedProgramComponent } from './FeaturedProgramComponent';
import { WorkoutCategories } from './WorkoutCategories';
import { WorkoutProgramComponent } from './WorkoutProgramComponent';
import { getWorkouts } from '../../service/WorkoutAPI';
import { workoutData } from '../../typings/ExerciseData';
import { featuredWorkouts } from '../../typings/FeaturedWorkoutsData';
import { IUser } from '../../typings/types';
import { IWorkout, IFeaturedWorkout } from '../../typings/types';

export function HomePage() {
  const activeUser: IUser = useSelector((state: any) => state.user);

  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [chosenWorkoutIdx, setChosenWorkoutIdx] = useState(0);
  const [showAddPage, setShow] = useState(false);

  const workoutView: string[] = [
    'All Programs',
    'AI generated',
    'Created By Me',
  ];

  const handleChangeView = (index: number) => {
    setChosenWorkoutIdx(index);
  };

  const showWorkoutView = () => {
    return workoutView.map((program, index) => {
      return (
        <Pressable
          key={index}
          style={[
            styles.selectWorkout,
            {
              backgroundColor: chosenWorkoutIdx == index ? '#4ABAD2' : 'white',
              borderColor: '#4ABAD2',
              borderWidth: 1,
            },
          ]}
          onPress={() => handleChangeView(index)}
        >
          <Text
            style={{
              color: chosenWorkoutIdx == index ? 'white' : '#4ABAD2',
              fontWeight: '500',
            }}
          >
            {program}
          </Text>
        </Pressable>
      );
    });
  };

  const renderWorkoutCategories = () => {
    return workoutData.map((category, index) => {
      return (
        <WorkoutCategories
          image={category.image}
          categoryName={category.categoryName}
          numOfExercises={category.numOfExercises}
          imgHeight={category.imgHeight}
          imgWidth={category.imgWidth}
          key={index}
        />
      );
    });
  };

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await getWorkouts(activeUser.username);
        if (response.ok) {
          const data = await response.json();
          const mappedWorkouts: IWorkout[] = data.body.map(
            (workout: IWorkout) => {
              return {
                ...workout,
                date: new Date(workout.date),
              };
            },
          );
          setWorkouts(mappedWorkouts);
          console.log(mappedWorkouts);
        } else {
          const data = await response.json();
          console.log('RESPONSE NOT OK');
        }
      } catch (error) {
        //LOGIC
        console.error(error);
      }
    };

    loadWorkouts();
  }, [showAddPage]);

  const renderWorkoutPrograms = (item: IWorkout) => {
    return <WorkoutProgramComponent workout={item} />;
  };

  const renderFeaturedPrograms = (item: IFeaturedWorkout) => {
    return <FeaturedProgramComponent workout={item} />;
  };

  return (
    <SafeAreaView>
      <Modal
        visible={showAddPage}
        onRequestClose={() => setShow(false)}
        animationType='slide'
      >
        <AddWorkoutPage close={() => setShow(false)} />
      </Modal>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 20 }}>
          <Text
            style={{ fontSize: 30, fontWeight: '600', marginHorizontal: 15 }}
          >
            Hello, {activeUser.username}!
          </Text>
          <View id={'my-programs'} style={styles.section}>
            <View style={[styles.myProgramsHeader, { marginHorizontal: 15 }]}>
              <Text style={styles.title}>My Programs</Text>
              <AddProgramButton onPress={() => setShow(true)} />
            </View>
            <View style={[styles.selectionContainer, { marginHorizontal: 15 }]}>
              {showWorkoutView()}
            </View>
            <FlatList
              data={workouts}
              renderItem={({ item }) => renderWorkoutPrograms(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: Dimensions.get('window').width,
                    height: 100,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 20 }}>
                    No Programs
                  </Text>
                </View>
              )}
            />
          </View>
          <View id={'featured-programs'} style={styles.section}>
            <Text style={[styles.title, { marginHorizontal: 15 }]}>
              Featured Programs
            </Text>
            <FlatList
              data={featuredWorkouts}
              renderItem={({ item }) => renderFeaturedPrograms(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: Dimensions.get('window').width,
                    height: 100,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 20 }}>
                    No Programs
                  </Text>
                </View>
              )}
            />
          </View>
          <View
            id={'browse-exercises'}
            style={[
              styles.section,
              { paddingBottom: 10, marginHorizontal: 15 },
            ]}
          >
            <Text style={styles.title}>Browse Exercises</Text>
            <View style={styles.categoriesContainer}>
              {renderWorkoutCategories()}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectWorkout: {
    width: '31%',
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myProgramsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  section: {
    gap: 15,
  },

  categoriesContainer: {
    gap: 10,
  },
});
