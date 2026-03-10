// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';


import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAx3hXtP1ifBvAwymgLgAeBH_QSPZRSX4I",
    authDomain: "diaryapp-34a91.firebaseapp.com",
    projectId: "diaryapp-34a91",
    storageBucket: "diaryapp-34a91.firebasestorage.app",
    messagingSenderId: "53629397633",
    appId: "1:53629397633:web:b96b42d600da061ee07b80",
    measurementId: "G-KWT46NMX86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const storage= getStorage(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, db, storage };