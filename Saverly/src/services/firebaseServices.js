import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig'; 

const db = getFirestore(firebaseApp);

// Function to fetch income and expenses for the current user
const fetchDataForUser = async (userId) => {
  try {
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
    throw error; 
  }
};

export { fetchDataForUser };
