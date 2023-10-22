import {View, Pressable, Text, TextInput} from 'react-native';
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

    return (
        <View style = {styles.container}>
            <CustomizeInput onChangeText = {text => setEmail(text)} placeholder = 'Enter your email' iconName = 'mail-outline' validInput = {false}/>
            <CustomizeInput onChangeText = {text => setUsername(text)} placeholder = 'Enter a username' iconName = 'person-outline' validInput = {false}/>
            <CustomizeInput onChangeText = {text => setPassword(text)} placeholder = 'Enter a password' iconName = 'lock-closed-outline' secureTextEntry= {passwordShown} validInput = {!!errorMsg}/>
            <Pressable style = {styles.button} onPress = {() => console.log('clicked')}>
                <Text style = {{color: 'white', fontSize: 18, fontWeight : 'bold'}}>Create Account</Text>
            </Pressable>
        </View>
    );
}

export default RegisterPage;