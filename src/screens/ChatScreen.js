import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { db } from '../services/firebaseConfig';
import { saveChat, getChat } from '../storage/chatStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ route }) => {
  const { roomId, selectedUser } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error getting current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    const msg = {
      text: message,
      sender: currentUser.uid,
      createdAt: Date.now(),
    };

    await db.collection('chats').doc(roomId).collection('messages').add(msg);
    setMessage('');
  };

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => doc.data());
        setMessages(newMessages);
        saveChat(roomId, newMessages);
      });

    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    (async () => {
      const localMessages = await getChat(roomId);
      if (localMessages) setMessages(localMessages);
    })();
  }, [roomId]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((item, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              {
                backgroundColor:
                  item.sender === currentUser?.uid ? '#dcf8c6' : '#fff',
                alignSelf:
                  item.sender === currentUser?.uid
                    ? 'flex-end'
                    : 'flex-start',
              },
            ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <Button
          title="Send"
          onPress={sendMessage}
          color="#4CAF50"
          disabled={!message.trim() || !currentUser}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 16,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '75%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 16,
    marginRight: 8,
  },
});

export default ChatScreen;
