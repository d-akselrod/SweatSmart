import { useNavigation } from '@react-navigation/native';
import { View, Text, SafeAreaView, Button, FlatList, StyleSheet} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import {IExercise} from '../../typings/types'

interface IExerciseProps {
    exercise: IExercise;
    index: number;
}
export function ExercisePage(){
    const route = useRoute();
    const navigation = useNavigation();
    // @ts-ignore
    const muscleGroup = route.params?.name;
    // @ts-ignore
    const exerciseList = route.params?.exerciseList;
    const ExerciseList = (props : IExerciseProps) => (
        <View style = {[styles.exerciseContainer, {marginTop: props.index === 0 ? 15 : 0}]}>
        </View>
    )

    useEffect(() => {
        navigation.setOptions({
            title: muscleGroup,
            headerBackTitle: 'Back'
        });
    }, []);
    
    return(
        <FlatList
            data = {exerciseList}
            renderItem = {({item, index}) => <ExerciseList exercise={item} index = {index}/>}
            style = {styles.container}
            showsVerticalScrollIndicator = {false}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15
    },
    
    exerciseContainer: {
        width: '100%',
        backgroundColor: 'white',
        height: 90,
        marginBottom: 15,
        borderRadius: 20
    }
})