import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, TouchableHighlight} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {IExercise} from '../../typings/types'
import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';

interface IExerciseProps {
    exercise: IExercise;
    index: number;
}
export function ExercisePage(){
    const route = useRoute();
    const navigation = useNavigation();
    const [searchFocused, setSearchFocused] = useState(false);
    const [text, setSearch] = useState('')
    const letterCategory = useRef('')
    // @ts-ignore
    const muscleGroup = route.params?.name;
    // @ts-ignore
    const exerciseList = route.params?.exerciseList;

    const sortedList = exerciseList.sort((a: IExercise, b: IExercise) => {
        const nameA = a.name; // Convert names to uppercase for case-insensitive comparison
        const nameB = b.name;

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // Names are equal
    });

    const handleFocus = () => {
        setSearchFocused(true);
    };

    const handleBlur = () => {
        setSearchFocused(false);
    };

    const searchObjectsByName = (array: IExercise[], query: string) => {
        if (!array || !query) {
            return []; 
        }
        
        const lowerCaseQuery = query.toLowerCase();

        return array.filter(obj => obj.name.toLowerCase().includes(lowerCaseQuery));
    };

    
    const renderLetter = (exerciseName : string) => {
        if(exerciseName.charAt(0) !== letterCategory.current){
            letterCategory.current = exerciseName.charAt(0);
            return(
                <View >
                    <Text style = {{paddingHorizontal: 20, paddingTop: 20, fontWeight: 'bold', color: 'grey'}}>{exerciseName.charAt(0).toUpperCase()}</Text>
                </View>
            )
        }
    }
    const ExerciseList = (props : IExerciseProps) => (
        <View>
            {renderLetter(props.exercise.name)}
            <TouchableHighlight style={{borderBottomWidth: 0.4, borderColor: '#c2c2c2'}} activeOpacity={0.8} underlayColor="#efefef" onPress={() => console.log('hi')}>
                <View style={[styles.exerciseContainer]}>
                    <View style={{gap: 5}}>
                        <Text style={styles.exerciseName}>{props.exercise.name}</Text>
                        <Text style={{fontSize: 13}}>{props.exercise.targetMuscle}</Text>
                    </View>
                    <AntDesign name="right" size={20} color="black"/>
                </View>
            </TouchableHighlight>
        </View>
    )

    useEffect(() => {
        navigation.setOptions({
            title: muscleGroup,
            headerBackTitle: 'Home',
        });
    }, []);
    
    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.search}>
                <SearchBar
                    placeholder={'Search'}
                    onSearch={() => {}}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={text => setSearch(text)}
                />
            </View>
            <FlatList
                data = {text.length > 0 ? searchObjectsByName(sortedList, text) : sortedList}
                renderItem = {({item, index}) => <ExerciseList exercise={item} index = {index}/>}
                style = {styles.container}
                showsVerticalScrollIndicator = {false}
            />
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
    
    search: {
        paddingVertical: 15
    }
    
})