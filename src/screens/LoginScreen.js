import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 10,
  }
});

export default LoginScreen;
