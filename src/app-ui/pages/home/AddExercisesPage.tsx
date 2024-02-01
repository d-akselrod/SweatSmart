import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, TouchableHighlight, Pressable, SectionList} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {IExercise} from '../../typings/types'
import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import {getExerciseSortedList} from '../../service/ExerciseAPI'

interface IExerciseProps {
    exercises: IExercise[];
    close: Function;
}

export function AddExercisesPage(props: IExerciseProps){
    const {exercises, close} = props;
    const [searchFocused, setSearchFocused] = useState(false);
    const [text, setSearch] = useState('')
    
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
    const ExerciseList = (props : { exercise: IExercise }) => {
        const {exercise} = props;
        return(
            <View>
                <TouchableHighlight style={{borderBottomWidth: 0.4, borderColor: '#c2c2c2'}} activeOpacity={0.8} underlayColor="#efefef" onPress={() => console.log('hi')}>
                    <View style={[styles.exerciseContainer]}>
                        <View style={{gap: 5}}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={{fontSize: 13}}>{exercise.targetMuscle}</Text>
                        </View>
                        <AntDesign name="right" size={20} color="black"/>
                    </View>
                </TouchableHighlight>
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
                renderItem = {({item, index}) => <ExerciseList exercise={item}/>}
                style = {styles.container}
                showsVerticalScrollIndicator = {false}
                renderSectionHeader={({section: {title}}) => (
                    <Text style = {{paddingHorizontal: 20, paddingTop: 20,fontWeight: 'bold', color: 'grey'}}>{title}</Text>
                )}
                stickySectionHeadersEnabled = {false}
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