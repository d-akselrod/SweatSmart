import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Pressable, FlatList, ScrollView
} from 'react-native';
import { useSelector } from 'react-redux';
import { IUser } from '../../typings/types';
import { AddProgramButton } from "./AddProgramButton";
import { WorkoutCategories } from './WorkoutCategories';
import { workoutData } from "../../typings/ExerciseData";

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

    const renderWorkoutCategories = () => {
        return workoutData.map((category, index) => {
            return (
                <WorkoutCategories
                    image={category.image}
                    categoryName={category.categoryName}
                    numOfExercises={category.numOfExercises}
                    imgHeight={category.imgHeight}
                    imgWidth={category.imgWidth}
                    key = {index}/>
            )
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{gap: 20}}>
                    <Text style={{ fontSize: 30, fontWeight: '600' }}>
                        Hello, {activeUser.username.slice(1, 4)}!
                    </Text>
                    <View id={'my-programs'} style = {styles.section}>
                        <View style={styles.myProgramsHeader}>
                            <Text style={styles.title}>My Programs</Text>
                            <AddProgramButton onPress = {() => {}}/>
                        </View>
                        <View style={styles.selectionContainer}>
                            {showWorkoutView()}
                        </View>
                    </View>
                    <View id={'featured-programs'} style = {styles.section}>
                        <Text style={styles.title}>Featured Programs</Text>
                        <View style = {{backgroundColor: 'white', width: 375, height: 145}}/>
                    </View>
                    <View id={'browse-exercises'} style = {[styles.section, {paddingBottom: 10}]}>
                        <Text style={styles.title}>Browse Exercises</Text>
                        <View style = {styles.categoriesContainer}>
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
        marginHorizontal: 15,
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
    },

    section:{
        gap: 15
    },

    categoriesContainer: {
        gap: 10
    },
});
