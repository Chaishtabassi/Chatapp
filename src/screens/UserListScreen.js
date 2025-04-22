import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { db } from '../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await db.collection('users').get();
        const usersData = snapshot.docs.map(doc => doc.data());

        const loggedInUser = await AsyncStorage.getItem('user');
        if (loggedInUser) {
          setCurrentUser(JSON.parse(loggedInUser));

          const filteredUsers = usersData.filter(user => user.uid !== JSON.parse(loggedInUser).uid);
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const startChat = (user) => {
    const currentUid = currentUser.uid;
    const selectedUid = user.uid;
  
    const roomId = currentUid < selectedUid
      ? `${currentUid}_${selectedUid}`
      : `${selectedUid}_${currentUid}`;
  
    navigation.navigate('Chat', { roomId, selectedUser: user });
  };
  

  return (
    <View style={styles.container}>
      <View style={{alignItems:'center'}}>
      {currentUser && <Text style={{fontSize:15}}>Welcome, {currentUser.email}</Text>}
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.email}</Text>
            <Button title="Chat" onPress={() => startChat(item)} />
          </View>
        )}
        keyExtractor={item => item.uid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    top:20
  },
});

export default UserListScreen;
