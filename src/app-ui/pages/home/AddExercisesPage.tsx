import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, TouchableHighlight, Pressable, SectionList, Dimensions} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {IExercise, IUser} from '../../typings/types'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import {getExerciseSortedList} from '../../service/ExerciseAPI';
import { postExercises, postWorkout } from '../../service/WorkoutAPI';
import { useSelector } from 'react-redux';

interface IExerciseProps {
    exercises: IExercise[];
    close: Function;
    wId?: string;
    workoutName?: string
}

export function AddExercisesPage(props: IExerciseProps){
    const activeUser: IUser = useSelector((state: any) => state.user);
    const {exercises, close, wId, workoutName} = props;
    const [searchFocused, setSearchFocused] = useState(false);
    const [text, setSearch] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<IExercise[]>([])
    
    
    const handleFocus = () => {
        setSearchFocused(true);
    };

    const handleBlur = () => {
        setSearchFocused(false);
    };

    function filterDataBySearch(data: any, query: string) {
        const lowerCaseQuery = query.toLowerCase();

        return data
            .map((section: any) => ({
                title: section.title,
                data: section.data.filter((exercise: any) =>
                    exercise.name.toLowerCase().includes(lowerCaseQuery)
                ),
            }))
            .filter((section: any) => section.data.length > 0);
    }
    
    const handleSelectedExercise = (exercise: IExercise) => {
        const isSelected = selectedExercises.some(val => val.eId === exercise.eId)
        
        if(!isSelected){
            setSelectedExercises((prev) => [...prev, exercise])
        }
        else{
            setSelectedExercises(selectedExercises.filter(val => val.eId !== exercise.eId))
        }
    }

    const addExercises = async () => {
        let workoutId: string | undefined = wId;

        try {
            if (!workoutId) {
                const workout = {
                    name: workoutName,
                    date: new Date(),
                    duration: 0,
                };

                const response = await postWorkout(activeUser.username, workout);
                if(response.ok){
                    const data = await response.json();
                    workoutId = data.body;
                }
                else{
                    console.log("ERROR")
                }
            }

            const response = await postExercises(selectedExercises.map(val => val.eId), workoutId!);

            if (response.ok) {
                const data = await response.json();
                close();
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const ExerciseList = (props : { exercise: IExercise, index: number }) => {
        const {exercise, index} = props;
        const isSelected = selectedExercises.includes(exercise)
        return(
            <View>
                <Pressable style={{borderBottomWidth: 0.4, borderColor: '#c2c2c2', backgroundColor: isSelected ? '#f6f6f6' : 'white', paddingBottom: 0}} onPress={() => handleSelectedExercise(exercise)}>
                    <View style={[styles.exerciseContainer]}>
                        <View style={{gap: 5}}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={{fontSize: 13}}>{exercise.targetMuscle}</Text>
                        </View>
                        <View style = {[styles.checkbox, {backgroundColor: isSelected ? '#6f7896' : 'white'}]}>
                            {isSelected && <AntDesign name="check" size={15} color="#f6f6f6"/>}
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    }

    return(
        <SafeAreaView style = {styles.container}>
            <Pressable onPress = {() => close()}><Text style = {{fontSize: 18, marginLeft: 10}}>Close</Text></Pressable>
            <View style = {styles.search}>
                <SearchBar
                    placeholder={'Search'}
                    onSearch={() => {}}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={text => setSearch(text)}
                />
            </View>
            <SectionList
                sections = {text.length > 0 ? filterDataBySearch(getExerciseSortedList(exercises), text) : getExerciseSortedList(exercises)}
                renderItem = {({item, index}) => <ExerciseList exercise={item} index = {index}/>}
                style = {[styles.container]}
                showsVerticalScrollIndicator = {false}
                renderSectionHeader={({section: {title}}) => (
                    <Text style = {{paddingHorizontal: 20, paddingTop: 20,fontWeight: 'bold', color: 'grey'}}>{title}</Text>
                )}
                stickySectionHeadersEnabled = {false}
            />
            <View style = {[styles.footer]}>
                <TouchableOpacity style = {{backgroundColor: selectedExercises.length === 0 ? '#494949' : '#B0B0B0', borderRadius: 10, width: '30%'}} disabled = {selectedExercises.length === 0} onPress = {() => setSelectedExercises([])}>
                    <Text style = {[styles.buttonTitle, {color: selectedExercises.length === 0 ? '#ffffff50' : '#ffffff'}]}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{backgroundColor: selectedExercises.length === 0 ? '#4e547e' : '#7F87CD', borderRadius: 10, width: '60%'}} disabled = {selectedExercises.length === 0} onPress = {() => addExercises()}>
                    <Text style = {[styles.buttonTitle, {color: selectedExercises.length === 0 ? '#ffffff50' : '#ffffff'}]}>{selectedExercises.length <= 1 ? 'Add Exercise' : `Add ${selectedExercises.length} Exercises`}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    exerciseContainer: {
        width: '100%',
        height: 75,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: "#efefef"
    },

    exerciseName: {
        fontWeight: '700',
        fontSize: 15,
        color: '#4d4d4d'
    },
    
    buttonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        padding: 15,
        color: '#ffffff50',
        textAlign: 'center',
    },

    search: {
        paddingVertical: 15
    },
    
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 40,
        width: '100%',
        justifyContent: 'center',
        gap: 5
    },
    
    checkbox: {
        height: 20,
        width: 20,
        borderWidth: 1.3,
        borderColor: '#6f7896',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }

})