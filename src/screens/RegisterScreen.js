import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    console.log('Registering user with:', email, password);
    try {
      const userCred = await auth.createUserWithEmailAndPassword(email, password);
      console.log('Registration success:', userCred.user);

      try {
        await db.collection('users').doc(userCred.user.uid).set({
          uid: userCred.user.uid,
          email: userCred.user.email,
        });
        console.log('Firestore write success');
      } catch (firestoreErr) {
        console.error('Firestore write error:', firestoreErr);
        Alert.alert('Firestore Write Failed', firestoreErr.message);
        return; 
      }

      try {
        const loginCred = await auth.signInWithEmailAndPassword(email, password);
        console.log('Logged in successfully:', loginCred.user);

        navigation.replace('Login');
      } catch (loginErr) {
        console.error('Login error:', loginErr);
        Alert.alert('Login Failed', loginErr.message);
      }
    } catch (authErr) {
      console.error('Auth error:', authErr);
      if (authErr.code === 'auth/email-already-in-use') {
        Alert.alert('Email Already In Use', 'The email address is already registered.');
      } else if (authErr.code === 'auth/weak-password') {
        Alert.alert('Weak Password', 'The password should be at least 6 characters long.');
      } else {
        Alert.alert('Registration Failed', authErr.message);
      }
    }
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
      <Button title="Register" onPress={registerUser} />
      <View style={styles.loginContainer}>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.replace('LoginScreen')}  
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
  },
  loginContainer: {
    marginTop: 12,
  },
});

export default RegisterScreen;
