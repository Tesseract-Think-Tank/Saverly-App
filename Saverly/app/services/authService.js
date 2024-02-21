// authService.js
import firebase from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {firebaseConfig, FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, addDoc, collection } from 'firebase/firestore';
import { initializeUserDetails } from './initializeUser';





const signUp = async (email, password) => {
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const userId = userCredential.user.uid;
      
      // Create a user document in Firestore with the email field
      // Initialize user details and accounts
      await initializeUserDetails(userId, email);
    
      return { userId };
    } catch (error) {
      // Handle errors
      throw new Error(`Error signing up: ${error.message}`);
    }
  };
  
  export { signUp };