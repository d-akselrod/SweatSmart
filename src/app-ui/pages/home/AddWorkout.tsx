import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    SafeAreaView,
    TextInput,
    Pressable,
    Image
} from 'react-native';
interface IAddWorkoutProps {
    close: Function;
}
export function AddWorkout(props: IAddWorkoutProps) {
    const [name, setName] = useState('')
    const [option, setOption] = useState(0)
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6F6'}}>
            <Pressable style = {{marginLeft: 10}} onPress = {() => props.close()}>
                <Text style = {{fontSize: 18}}>Close</Text>
            </Pressable>
            <View style = {styles.container}>
                <Text style = {styles.title}>Start a new workout</Text>
                <TextInput placeholder = {"Name of workout"} style = {styles.input} onChangeText = {text => setName(text)}/>
                <View style = {{width: '100%', height: '45%',flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Pressable style = {[styles.button, {borderColor: option === 0 ? "#A9ABF1" : "white"}]} onPress = {() => setOption(0)}>
                        <Image style = {{height: '45%', width: '70%'}} source = {require('../../assets/images/workout.png')}/>
                        <View style = {{alignItems: 'center', gap: 10}}>
                            <Text style = {styles.text}>Add individual exercises</Text>
                            <View style = {styles.radioButton}>
                                {option === 0 && <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: "#A9ABF1"}}/>}
                            </View>
                        </View>
                        
                    </Pressable>
                    <Pressable style = {[styles.button, {borderColor: option === 1 ? "#A9ABF1" : "white"}]} onPress = {() => setOption(1)}>
                        <Image style = {{height: '45%', width: '70%'}} source = {require('../../assets/images/generator.png')}/>
                        <View style = {{alignItems: 'center', gap: 10}}>
                            <Text style = {styles.text}>Generate Workout</Text>
                            <View style = {styles.radioButton}>
                                {option === 1 && <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: "#A9ABF1"}}/>}
                            </View>
                        </View>
                    </Pressable>                
                </View>
                <Pressable style = {{width: '100%', padding: 15, backgroundColor: '#7F87CD', borderRadius: 10}}>
                    <Text style = {{textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold'}}>Apply</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginHorizontal: 30,
        height: '80%'
        // borderWidth: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textInput: {
        borderColor: '#4b6691',
        borderWidth: 2,
        width: '100%',
        fontSize: 20,
    },
    
    title: {
        fontSize: 25,
        fontStyle: 'italic'
    },
    
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ababab'
    },
    
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    button: {
        width: '47%', 
        backgroundColor: 'white', 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'space-around',
        borderWidth: 2
    },
    
    text: {
        fontSize: 12, 
        fontStyle: 'italic', 
        fontWeight: '200'
    }
});
