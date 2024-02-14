// firebaseService.js
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig'; // Adjust the import path according to your setup

const db = getFirestore(firebaseApp);

// Function to fetch income and expenses for the current user
export const fetchDataForUser = async (userId) => {
  try {
    // Reference to the user's document in the 'users' collection
    const userDocRef = doc(db, 'users', userId);

    // Get the document
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return {
        income: userData.income || 0,
        expenses: userData.expenses || 0,
      };
    } else {
      // User document doesn't exist
      return { income: 0, expenses: 0 };
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
