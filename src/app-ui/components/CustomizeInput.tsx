import {View, StyleSheet, TextInput, Text, TextInputProps, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface ICustomzeProps extends TextInputProps{
    validInput? : boolean,
    iconName? : any,
    inputPattern?: RegExp,
}
function CustomizeInput(props: ICustomzeProps) {
    const [hiddenField, setHiddenField] = useState(props.secureTextEntry)
    const [focus, setFocus] = useState(false)
    const matchRegEx = (value: string) => {
        props.inputPattern ? value.match(props.inputPattern) : true;
    }

    function changeBorderColor(): void {
        
    }

    return (
        <View>
            <View style = {[styles.inputContainer, {borderColor: focus ? 'lightblue' : '#C3C3C3'}]}>
                <Ionicons name = {props.iconName} size = {20} color = {'#6C96E8'}></Ionicons>
                <TextInput 
                    onChangeText = {props.onChangeText} 
                    maxLength = {24} autoCorrect = {false} 
                    secureTextEntry = {hiddenField}
                    placeholderTextColor="#A4A4A4"
                    style= {styles.input} 
                    placeholder ={props.placeholder}
                    onFocus = {() => setFocus(true)}
                    onBlur = {() => setFocus(false)}
                />
                {props.secureTextEntry &&
                    <TouchableOpacity onPress = {() => setHiddenField(!hiddenField)}>
                        <Ionicons name = {hiddenField ? 'eye' : 'eye-off'} color = '#6C96E8' size = {20} />
                    </TouchableOpacity>
                }
                {props.validInput && <Ionicons name = 'close' color = 'red' size = {32}></Ionicons>}
            </View>
        </View>
    );
}

export default CustomizeInput;

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
        borderWidth: 1,
        borderRadius: 30,
        padding: 12,
        alignItems: 'center'
    },
    
    input: {
        fontSize: 15,
        flexGrow: 1,
    }
})