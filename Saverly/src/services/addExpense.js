import { addDoc, collection, doc, getDoc, updateDoc, where, query, getDocs, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../firebaseConfig';

// Function to get the accounts of the current user
const getAccounts = async () => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
  const querySnapshot = await getDocs(accountsRef);
  const accounts = [];
  querySnapshot.forEach((doc) => {
    accounts.push(doc.data());
  });
  return accounts;
};

// Function to add an expense for the current user
const addExpense = async (accountCurrency, accountType, category, amount, description, currencyOfExp) => {
  if (!accountCurrency || !accountType) {
    throw new Error('Account currency or account type is undefined.');
  }

  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  const accountsRef = collection(FIREBASE_DB, 'users', userId, 'accounts');
  const q = query(accountsRef, where("currency", "==", accountCurrency), where("type", "==", accountType));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) throw new Error('Account not found.');

  const accountSnap = querySnapshot.docs[0];
  const accountId = accountSnap.id;
  const accountData = accountSnap.data();
  const accountBalance = accountData.balance || 0;
  const accountIdForExpense = accountData.id;

  const userDocRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnapshot = await getDoc(userDocRef);
  if (!userDocSnapshot.exists()) {
    throw new Error('User not found.');
  }

  const currentExpenses = userDocSnapshot.data().expenses;

  const exchangeRates = {
    'EUR:RON': 5, 'RON:EUR': 0.2,
    'USD:RON': 4.57, 'RON:USD': 0.22,
    'GBP:RON': 5.82, 'RON:GBP': 0.17,
    'EUR:USD': 1.09, 'USD:EUR': 0.92,
    'GBP:EUR': 1.17, 'EUR:GBP': 0.86,
    'USD:GBP': 0.79, 'GBP:USD': 1.27
  };

  const keyForExchangeRate = `${currencyOfExp}:${accountCurrency}`;
  const keyForExchangeRateRon = `${currencyOfExp}:RON`;
  const exchangeRate = exchangeRates[keyForExchangeRate] || 1;
  const exchangeToRon = exchangeRates[keyForExchangeRateRon] || 1;

  const convertedAmount = amount * exchangeRate;
  const convertedToRon = amount * exchangeToRon;
  
  if (convertedAmount > accountBalance) throw new Error("Insufficient funds in the selected account.");

  const newExpensesValue = currentExpenses + convertedToRon;
  const newAccountBalance = accountBalance - convertedAmount;

  const accountRef = doc(FIREBASE_DB, 'users', userId, 'accounts', accountId);
  await updateDoc(accountRef, {
    balance: newAccountBalance
  });

  await addDoc(collection(FIREBASE_DB, 'users', userId, 'expenses'), {
    category,
    accountId: accountIdForExpense,
    amount: parseFloat(amount),
    dateAndTime: new Date(),
    description,
    currency: currencyOfExp
  });

  await updateDoc(userDocRef, {
    expenses: newExpensesValue
  });

  return true;
};

// Function to remove an expense for the current user
const removeExpense = async (category, description, currency, amount) => {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  if (!userId) throw new Error('No user is signed in.');

  const expensesRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
  const expenseQuery = query(expensesRef, where('category', '==', category), where('description', '==', description), where('currency', '==', currency), where('amount', '==', amount));

  const querySnapshot = await getDocs(expenseQuery);

  const deletionPromises = [];
  querySnapshot.forEach((doc) => {
    deletionPromises.push(deleteDoc(doc.ref));
  });

  await Promise.all(deletionPromises);

  const userDocRef = doc(FIREBASE_DB, 'users', userId);
  const userDocSnapshot = await getDoc(userDocRef);
  if (!userDocSnapshot.exists()) {
    throw new Error('User not found.');
  }

  const currentExpenses = userDocSnapshot.data().expenses;
  const newExpensesValue = currentExpenses - amount;

  await updateDoc(userDocRef, {
    expenses: newExpensesValue
  });

  return true;
};

export { addExpense, getAccounts, removeExpense };