import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          navigation.replace('UserList');
        }
      } catch (err) {
        console.log('Error checking logged in user:', err);
      }
    };
    checkLoggedInUser();
  }, [navigation]);

  const loginUser = async () => {
    console.log(email,password)
    try {
      const userCred = await auth.signInWithEmailAndPassword(email, password);
      console.log('Login success');
    
      try {
        await db.collection('users').doc(userCred.user.uid).set({
          uid: userCred.user.uid,
          email: userCred.user.email,
        });

        await AsyncStorage.setItem('user', JSON.stringify({
          uid: userCred.user.uid,
          email: userCred.user.email,
        }));

        console.log('Firestore write success');
        navigation.replace('UserList');
      } catch (firestoreErr) {
        console.log('Firestore error:', firestoreErr);
        Alert.alert('Firestore Write Failed', firestoreErr.message);
      }
    
    } catch (authErr) {
      console.log('Auth error:', authErr);
      Alert.alert('Login Failed', authErr.message);
    }
  };

  const registerUser = async () => {
    navigation.replace('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Login" onPress={loginUser}/>
      <View style={styles.registerContainer}>
        <Button title="Register" onPress={registerUser} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 10,
  },
  registerContainer: {
    marginTop: 12,
  },
});

export default LoginScreen;
