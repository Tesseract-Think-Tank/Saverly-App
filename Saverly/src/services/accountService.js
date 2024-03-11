import { addDoc, collection, doc, getDoc, updateDoc, query, queryEqual, querySnapshot, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';


const addAccount = async (type, balance, currency) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  if (isNaN(balance)) {
    throw new Error('Balance must be a number');
  }
  //let accountID = 0;
  const userRef = doc(FIREBASE_DB, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};
  const currentIncome = userData.income || 0;

  const exchangeRates = {
    "EUR": 5,
    "USD": 4.57,
    "GBP": 5.82,
    "RON": 1
  };

  const exchangeRate = exchangeRates[currency];

  if (!exchangeRate) {
    throw Error("Currency not supported");
  }

  const newIncome = currentIncome + (exchangeRate * parseFloat(balance));

  await updateDoc(userRef, {
    income: newIncome,
  });
  
  await addDoc(collection(FIREBASE_DB, 'users', userId, 'accounts'), {
    type,
    balance: parseFloat(balance),
    currency,
    //accountId:accountID
  });
    //accountID += 1;
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
