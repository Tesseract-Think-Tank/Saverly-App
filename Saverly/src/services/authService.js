import { getApps, initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig, FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeUserDetails } from './initializeUser';

// Initialize Firebase app if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

/**
 * Sign up a new user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} An object containing the user's ID.
 * @throws {Error} If there is an error during the sign-up process.
 */
const signUp = async (email, password) => {
  try {
    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const userId = userCredential.user.uid;

    // Initialize user details and accounts in Firestore
    await initializeUserDetails(userId, email);

    return { userId };
  } catch (error) {
    // Handle errors
    throw new Error(`Error signing up: ${error.message}`);
  }
};

export { signUp };