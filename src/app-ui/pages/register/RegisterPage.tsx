import {View, Pressable, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles'
import CustomizeInput from '../../components/CustomizeInput'
import {IUser} from '../../typings/types'
import { useState } from 'react';

interface IRegField {
    username? : string,
    email? : string,
    password? : string,
}
function RegisterPage(props: any) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState();
    const [passwordShown, setPasswordShown] = useState(true);
    
    const register = () => {
        //Implement fetch
        console.log('ok')
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.registerTitle}>Sign Up</Text>
            <CustomizeInput onChangeText = {text => setEmail(text)} placeholder = 'Enter your email' iconName = 'mail-outline' validInput = {false}/>
            <CustomizeInput onChangeText = {text => setUsername(text)} placeholder = 'Enter a username' iconName = 'person-outline' validInput = {false}/>
            <CustomizeInput onChangeText = {text => setPassword(text)} placeholder = 'Enter a password' iconName = 'lock-closed-outline' secureTextEntry= {passwordShown} validInput = {!!errorMsg}/>
            <Pressable style = {styles.button} onPress = {() => register()}>
                <Text style = {{color: 'white', fontSize: 18, fontWeight : 'bold'}}>Create Account</Text>
            </Pressable>
            <View style = {styles.loginContainer}>
                <Text>Already have an account? </Text>
                <Pressable onPress = {() => {}}>
                    <Text style = {{color: '#6C96E8', fontWeight: 'bold'}}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default RegisterPage;