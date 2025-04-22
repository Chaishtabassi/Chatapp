import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebaseConfig';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const subscriber = db.collection('users').onSnapshot(snapshot => {
      const currentUid = auth.currentUser?.uid;
      console.log('Current UID:', currentUid);

      const allUsers = snapshot.docs.map(doc => doc.data());
      console.log('All Users:', allUsers);

      const filtered = allUsers.filter(user => user.uid !== currentUid);
      console.log('Filtered Users:', filtered);

      setUsers(filtered);
    });

    return () => subscriber();
  }, []);

  const goToChat = (user) => {
    const currentUid = auth.currentUser?.uid; 
    const roomId = [currentUid, user.uid].sort().join('_');
    navigation.navigate('Chat', { roomId, otherUser: user });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToChat(item)} style={styles.userCard}>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:20,fontWeight:'600'}}>Users List</Text>
      </View>
      {users.length === 0 ? (
        <Text style={styles.noUserText}>No other users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.uid}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 16,
  },
  noUserText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#555',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
