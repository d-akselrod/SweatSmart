import {View, Pressable, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import {styles} from './styles'
import CustomizeInput from '../../components/CustomizeInput'
import { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import Svg, { Path, G } from "react-native-svg"
import { Dimensions } from 'react-native';


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
            <Svg width={Dimensions.get('window').width} height={328} fill="none">
                <Path fill="#D8F1FF" d="M0 0h393v250s-60.911-10.272-108 0c-50.557 11.029-137.47 60.85-188 72-55.442 12.234-97 0-97 0V0Z"/>
                <G>
                    <SafeAreaView style = {styles.fulltitle}>
                        <Text style = {styles.title}>SweatSmart</Text>
                        <Entypo name="drop" size={24} color="#1CA0EB"/>
                    </SafeAreaView>
                </G>
            </Svg>
            {/*<View style = {styles.titleContainer}>*/}
            {/*    */}
            {/*</View>*/}
            <View style = {styles.form}>
                <Text style = {styles.registerTitle}>Sign Up</Text>
                <CustomizeInput onChangeText = {text => setEmail(text)} placeholder = 'Enter your email' iconName = 'mail-outline' validInput = {false}/>
                <CustomizeInput onChangeText = {text => setUsername(text)} placeholder = 'Enter a username' iconName = 'person-outline' validInput = {false}/>
                <CustomizeInput onChangeText = {text => setPassword(text)} placeholder = 'Enter a password' iconName = 'lock-closed-outline' secureTextEntry= {passwordShown} validInput = {!!errorMsg}/>
                <Pressable style = {styles.button} onPress = {() => register()}>
                    <Text style = {{color: 'white', fontSize: 18, fontWeight : 'bold'}}>Create Account</Text>
                </Pressable>
                <View style = {styles.loginContainer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress = {() => {}}>
                        <Text style = {{color: '#6C96E8', fontWeight: 'bold'}}>Login</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        </View>
    );
}

export default RegisterPage;