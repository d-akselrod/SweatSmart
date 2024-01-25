import {View, Text, StyleSheet, Button, SafeAreaView, TextInput} from 'react-native';

interface IAddWorkoutProps {
    close: Function;
}
export function AddWorkoutPage(props : IAddWorkoutProps){
    const {close} = props;
    return (
        <SafeAreaView style = {styles.container}>
            <View style = {styles.header}>
                <Button title = {"Cancel"} onPress = {() => close()}/>
                <Text style = {{fontSize: 20, fontWeight: 'bold'}}>Add Workout</Text>
                <Button title = {"Save"} onPress = {() => close()}/>
            </View>
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style = {{fontSize: 30, fontWeight: 'bold'}}>Workout Name</Text>
                <TextInput style = {styles.textInput}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    textInput: {
        borderColor: '#deebff',
        borderWidth: 2,
        width: '80%',
        fontSize: 20
    }
})
        