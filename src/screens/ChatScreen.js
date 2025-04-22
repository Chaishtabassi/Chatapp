import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import { saveChat, getChat } from '../storage/chatStorage';

const ChatScreen = ({ route }) => {
  const { roomId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const msg = {
      text: message,
      sender: auth.currentUser.uid,
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
  }, []);

  useEffect(() => {
    (async () => {
      const localMessages = await getChat(roomId);
      if (localMessages) setMessages(localMessages);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: item.sender === auth.currentUser.uid ? '#dcf8c6' : '#fff',
                alignSelf: item.sender === auth.currentUser.uid ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <Button title="Send" onPress={sendMessage} color="#4CAF50" />
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
