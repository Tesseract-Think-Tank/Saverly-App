import { addDoc, collection, doc, getDoc, updateDoc, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';


const addAccount = async (type, balance, currency) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  // First, check if an account with the same type already exists
  const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
  const q = query(accountsRef, where("type", "==", type));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // An account with this type already exists
    throw new Error('An account with this type already exists.');
  }

  // If no existing account with the same type, get the current user's income
  const userRef = doc(FIREBASE_DB, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};
  const currentIncome = userData.income || 0;
  const newIncome = currentIncome + parseFloat(balance);

  // Update the user's income
  await updateDoc(userRef, {
    income: newIncome,
  });

  // Then, add the new account
  await addDoc(accountsRef, {
    type,
    balance: parseFloat(balance),
    currency,
  });

  
  return true; // Indicate success
};

const fetchUserAccounts = async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) throw new Error('No user is signed in.');
  
    const q = query(collection(FIREBASE_DB, 'users', userId, 'accounts'));
    const querySnapshot = await getDocs(q);
    const accounts = [];
    querySnapshot.forEach((doc) => {
      accounts.push({ id: doc.id, ...doc.data() });
    });
  
    return accounts;
};
  

export { addAccount, fetchUserAccounts };
