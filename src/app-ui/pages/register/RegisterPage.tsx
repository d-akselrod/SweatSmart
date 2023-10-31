import { useState } from 'react';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { styles } from './styles';
import { FormInput } from '../../components/FormInput';
import { registerAccount } from '../../service/AccountAPI';

export function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState({
    email: false,
    username: false,
    password: false,
  });
  const [errorMsg, setErrorMsg] = useState('');

  const resetErrors = () => {
    setErrors({
      username: false,
      email: false,
      password: false,
    });
  };
  const validRegistrationData = (
    username: string,
    email: string,
    password: string,
  ): boolean => {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setErrors({ ...errors, email: true });
      setErrorMsg('Please enter a valid email');
      return false;
    } else if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setErrors({ ...errors, username: true });
      setErrorMsg('Please enter a valid username');
      return false;
    } else if (
      !password.match(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};:<>|./?,-]{8,}$/,
      )
    ) {
      setErrors({ ...errors, password: true });
      setErrorMsg('Password must satisfy the following requirements:');
      return false;
    } else {
      return true;
    }
  };
  const handleRegister = async () => {
    Keyboard.dismiss();
    if (validRegistrationData(username, email, password)) {
      try {
        const response = await registerAccount(username, email, password);
        if (response.ok) {
          const data = await response.json();
          setErrorMsg('');
          console.log(data);
        } else {
          const data = await response.json();
          setErrorMsg(data.message);
          console.log('unsuccessful');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={Dimensions.get('window').width} height={328} fill='none'>
        <Path
          fill='#D8F1FF'
          d='M0 0h393v250s-60.911-10.272-108 0c-50.557 11.029-137.47 60.85-188 72-55.442 12.234-97 0-97 0V0Z'
        />
        <G>
          <View style={styles.fulltitle}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.title}>SweatSmart</Text>
              <SimpleLineIcons name='drop' size={24} color='#1CA0EB' />
            </View>
          </View>
        </G>
      </Svg>
      <View style={styles.form}>
        <Text style={styles.registerTitle}>Sign Up</Text>
        <FormInput
          onChangeText={text => setEmail(text)}
          placeholder='Enter your email'
          iconName='mail-outline'
          validInput={errors.email}
          resetError={resetErrors}
        />
        <FormInput
          onChangeText={text => setUsername(text)}
          placeholder='Enter a username'
          iconName='person-outline'
          validInput={errors.username}
          resetError={resetErrors}
        />
        <FormInput
          onChangeText={text => setPassword(text)}
          placeholder='Enter a password'
          iconName='lock-closed-outline'
          secureTextEntry={true}
          validInput={errors.password}
          resetError={resetErrors}
        />
        {errorMsg && (
          <View style={styles.error}>
            <MaterialIcons name='error-outline' size={20} color='#e74341' />
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRegister()}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Create Account
          </Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: '#6C96E8', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
