import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {request, CRUD, API_URL, API_AUTH} from './service/config';

export default function App() {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch(`http://192.168.1.28:5042/${'User'}`, {
      'method': 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_AUTH
      },
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("URL:", `${API_URL}/${'User'}`);
        });
  }, []);
  
  // useEffect(() => {
  //   const responseAction = (data: any) => {
  //     setUserName(data[0].username);
  //   };
  //
  //   const errorAction = (error: any) => {
  //       console.error("Error fetching username:", error);
  //   }
  //
  //   request('User', CRUD.read, undefined, responseAction, errorAction)
  // }, []);

  return (
      <View style={styles.container}>
        <Text>{userName}</Text>
        <StatusBar style='auto' />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
