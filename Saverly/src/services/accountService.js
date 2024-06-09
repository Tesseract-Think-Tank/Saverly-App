import { addDoc, collection, doc, getDoc, updateDoc, query, getDocs } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

// Generate a unique ID of specified length
function generateUniqueId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Add a new account for the current user
const addAccount = async (type, balance, currency) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  if (isNaN(balance)) {
    throw new Error('Balance must be a number');
  }

  const userRef = doc(FIREBASE_DB, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};
  const currentIncome = userData.income || 0;
  const accountId = generateUniqueId();
  
  const exchangeRates = {
    "EUR": 5,
    "USD": 4.57,
    "GBP": 5.82,
    "RON": 1
  };

  const exchangeRate = exchangeRates[currency];

  if (!exchangeRate) {
    throw new Error("Currency not supported");
  }

  const newIncome = currentIncome + (exchangeRate * parseFloat(balance));

  await updateDoc(userRef, {
    income: newIncome,
  });

  await addDoc(collection(FIREBASE_DB, 'users', userId, 'accounts'), {
    id: accountId,
    type,
    balance: parseFloat(balance),
    currency,
  });

  await addDoc(collection(FIREBASE_DB, 'users', userId, 'logs'), {
    balance: parseFloat(balance),
    currency,
  });

  return true;
};

// Fetch all accounts of the current user
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

// Get the date and time of a specific expense
const getExpenseDateAndTime = async (expenseId) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');
  if (!expenseId) throw new Error('Expense ID is required.');

  const expenseRef = doc(FIREBASE_DB, 'users', userId, 'expenses', expenseId);
  const expenseSnap = await getDoc(expenseRef);

  if (!expenseSnap.exists()) {
    throw new Error('Expense not found.');
  }

  const expenseData = expenseSnap.data();
  const dateAndTime = expenseData.dateAndTime || null;

  return dateAndTime;
};

export { addAccount, fetchUserAccounts, getExpenseDateAndTime };