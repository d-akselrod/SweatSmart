import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { styles } from './styles';
import { FormInput } from '../../components/FormInput';
import { loginAccount } from '../../service/AccountAPI';
import { setActiveUser } from "../../redux/slices/userSlice";
import { useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleRegisterInstead = () => {
    // @ts-ignore
    navigation.navigate('Registration')
  }

  const handleLogin = async () => {
    Keyboard.dismiss();
    try {
      const response = await loginAccount(usernameOrEmail, password);
      if (response.ok) {
        const data = await response.json();

        if(data.code === 200){
          const activeUser = data.body
          dispatch(setActiveUser(activeUser));

          await AsyncStorage.setItem('user', `"${activeUser}"`);
        }
        else if(data.code === 401){
          setError(data.message);
          setPassword('');
        }
        else if(data.code === 404){
          setError(data.message);
          setUsernameOrEmail('');
          setPassword('');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred during login');
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SweatSmart</Text>
        </View>

        <KeyboardAvoidingView style={styles.form} behavior={'padding'}>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <FormInput
              onChangeText={text => setUsernameOrEmail(text)}
              placeholder='Enter your email'
              iconName='mail-outline'
              keyboardType={'email-address'}
          />
          <FormInput
              onChangeText={text => setPassword(text)}
              placeholder='Enter your password'
              iconName='lock-closed-outline'
              secureTextEntry={true}
          />
          {error && (
              <View style={styles.error}>
                <MaterialIcons name='error-outline' size={20} color='#e74341' />
                <Text style={styles.errorMsg}>{error}</Text>
              </View>
          )}
          <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Login
            </Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegisterInstead}>
              <Text style={{ color: '#6C96E8', fontWeight: 'bold' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
  );
}