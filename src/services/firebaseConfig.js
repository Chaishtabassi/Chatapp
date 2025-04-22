import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAyec_mt9id0TwTVvsbDT-uc3AHCb8STNE",
  authDomain: "chatapp-4a506.firebaseapp.com",
  projectId: "chatapp-4a506",
  storageBucket: "chatapp-4a506.appspot.com",
  messagingSenderId: "126749499148",
  appId: "1:126749499148:android:176b86c3ea626bb924b329",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore as db };

