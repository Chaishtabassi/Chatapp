import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveChat = async (roomId, messages) => {
  try {
    await AsyncStorage.setItem(`chat_${roomId}`, JSON.stringify(messages));
  } catch (e) {
    console.error('Save chat failed', e);
  }
};

export const getChat = async (roomId) => {
  try {
    const json = await AsyncStorage.getItem(`chat_${roomId}`);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Get chat failed', e);
    return null;
  }
};
