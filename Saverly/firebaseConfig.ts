import { initializeApp } from 'firebase/app';
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBd7XHkk1Mttdj47-caDok6zjjMbFSA5ng",
    authDomain: "saverlytest.firebaseapp.com",
    projectId: "saverlytest",
    storageBucket: "saverlytest.appspot.com",
    messagingSenderId: "23576594772",
    appId: "1:23576594772:web:13cec1b08173829312e0c1",
    measurementId: "G-1HHGLP49CF"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);